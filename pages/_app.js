import Head from "next/head";
import { useEffect } from "react";
import { PropsProvider } from "../data/contexts";
import "../styles/globals.scss";

export default function App({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => page);

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
