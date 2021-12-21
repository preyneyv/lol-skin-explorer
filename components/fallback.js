import Head from "next/head";
import { useRouter } from "next/router";
import { Footer, FooterContainer } from "./footer";
import { Header } from "./header";

export function Fallback({ children }) {
  const router = useRouter();
  if (router.isFallback)
    return (
      <>
        <Head>
          <title>Loading... &middot; Skin Explorer</title>
        </Head>
        <FooterContainer>
          <div>
            <Header />
            ...
          </div>
          <Footer />
        </FooterContainer>
      </>
    );

  return children;
}
