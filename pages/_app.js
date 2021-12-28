import Head from "next/head";
import { useEffect } from "react";
import { PropsProvider } from "../data/contexts";
import "../styles/globals.scss";

export default function App({ Component, pageProps }) {
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
