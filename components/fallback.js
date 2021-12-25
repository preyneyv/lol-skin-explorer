import Head from "next/head";
import { useRouter } from "next/router";
import { makeTitle } from "../data/helpers";
import { Footer, FooterContainer } from "./footer";
import { Header } from "./header";
import { Loading } from "./loading";

export function Fallback({ children }) {
  const router = useRouter();
  if (router.isFallback)
    return (
      <>
        <Head>{makeTitle("Loading...")}</Head>
        <FooterContainer>
          <Header />
          <Loading />
          <Footer />
        </FooterContainer>
      </>
    );

  return children;
}
