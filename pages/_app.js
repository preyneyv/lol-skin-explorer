import Head from "next/head";
import { PropsProvider } from "../data/contexts";
import "../styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <PropsProvider value={pageProps}>
        <Component {...pageProps} />
      </PropsProvider>
    </>
  );
}
