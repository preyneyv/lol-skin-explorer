import BaseApp from "next/app";
import Head from "next/head";
import { DataProvider } from "../data/contexts";
import { comparePatches } from "../data/patch";
import { store } from "../data/store";
import "../styles/globals.css";

export default function App({ Component, pageProps, data }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <DataProvider value={data}>
        <Component {...pageProps} />
      </DataProvider>
    </>
  );
}

App.getInitialProps = async (appContext) => {
  const appProps = await BaseApp.getInitialProps(appContext);
  await store.fetch();
  const { patch } = store;

  const [champions, skinlines, skins] = await Promise.all([
    patch.champions,
    patch.skinlines,
    patch.skins,
  ]);

  const data = {
    champions,
    skinlines,
    skins,
    skinChanges: store.skinChanges,
    version: patch.fullVersionString,
    patch: patch.name,
  };

  return { ...appProps, data };
};
