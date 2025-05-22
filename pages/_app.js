import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import { useVenatusTracking } from "../components/venatus";
import { PropsProvider } from "../data/contexts";
import "../styles/globals.scss";

/**
 *
 * @param {string} url
 * @param {import("react").ScriptHTMLAttributes} props
 * @returns
 */
function loadScript(url, props = {}) {
  const script = document.createElement("script");
  script.src = url;
  script.async = true;
  // script.onload = () => resolve();
  // script.onerror = (e) => console.error(e);
  Object.entries(props).forEach(([key, value]) => {
    script.setAttribute(key, value);
  });
  document.head.appendChild(script);
}

const NO_AD_PATHS = ["/privacy-policy"];
const VENATUS_PATHS = ["/venatus-test"];
function useDynamicAdScript() {
  const lastPathClass = useRef();

  const router = useRouter();
  useEffect(() => {
    function loadDynamicAdScript(url) {
      let pathClass = "google";
      if (NO_AD_PATHS.some((path) => url.startsWith(path))) pathClass = "none";
      if (VENATUS_PATHS.some((path) => url.startsWith(path)))
        pathClass = "venatus";

      if (lastPathClass.current && lastPathClass.current !== pathClass) {
        location.href = url;
        return;
      }
      lastPathClass.current = pathClass;

      if (pathClass === "venatus")
        loadScript(
          "https://hb.vntsm.com/v4/live/vms/sites/skinexplorer.lol/index.js"
        );
      else if (pathClass === "google")
        loadScript(
          "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3297862613403903",
          {
            crossOrigin: "anonymous",
          }
        );
    }
    loadDynamicAdScript(window.location.pathname);
    router.events.on("routeChangeStart", loadDynamicAdScript);
    return () => {
      router.events.off("routeChangeStart", loadDynamicAdScript);
    };
  }, [router]);
}

function useVenatusRouteInterceptor() {
  const router = useRouter();
  useEffect(() => {
    // Listen for route change start events
    const handleRouteChangeStart = (url) => {
      if (!router.pathname.startsWith("/venatus-test")) return;
      if (url.startsWith("/venatus-test")) return;
      // Prevent default navigation
      router.events.emit("routeChangeError");
      // Redirect elsewhere
      router.push("/venatus-test" + url);
      // Throw error to stop navigation (will be caught by Next.js)
      throw new Error(`Route changed to ${url} was blocked`);
    };

    router.events.on("routeChangeStart", handleRouteChangeStart);

    return () => {
      router.events.off("routeChangeStart", handleRouteChangeStart);
    };
  }, [router]);
}

export default function App({ Component, pageProps }) {
  useVenatusRouteInterceptor();
  useDynamicAdScript();
  useVenatusTracking();

  const getLayout = Component.getLayout || ((page) => page);

  useEffect(() => {
    if (typeof window === "undefined") return;
    function resize() {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    }
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"
        />
      </Head>
      <PropsProvider value={pageProps}>
        {getLayout(<Component {...pageProps} />)}
      </PropsProvider>
    </>
  );
}
