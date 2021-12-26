import Head from "next/head";
import { useEffect } from "react";
import { PropsProvider } from "../data/contexts";
import "../styles/globals.scss";

export default function App({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => page);
  // const { patch } = pageProps;
  // useEffect(() => {
  //   if (typeof window === "undefined") return;
  //   if (patch) {
  //     const oldPatch = localStorage.lastCachedPatch;
  //     if (patch !== oldPatch) {
  //       console.log("DIFF");
  //       caches.keys().then((names) => names.map((name) => caches.delete(name)));
  //       console.log("Patch changed, clearing caches", oldPatch, patch);
  //     }
  //     localStorage.lastCachedPatch = patch;
  //   }
  // }, [patch]);
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/offline.sw.js");
    }
  });

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <PropsProvider value={pageProps}>
        {getLayout(<Component {...pageProps} />)}
      </PropsProvider>
    </>
  );
}
