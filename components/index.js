import { Header } from "./header";
import { Footer, FooterContainer } from "./footer";
import { NewAdditions } from "./new-additions";
import dynamic from "next/dynamic";

const LazyNewAdditions = dynamic(() => import("./new-additions"), {
  ssr: false,
});

export function Layout({ children, flat, backTo, withNew }) {
  return (
    <FooterContainer>
      <div>
        <Header {...{ flat, backTo }} />
        {withNew && <LazyNewAdditions />}
        {children}
      </div>
      <Footer {...{ flat }} />
    </FooterContainer>
  );
}
