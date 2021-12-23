import { Header } from "./header";
import { Footer, FooterContainer } from "./footer";

export function Layout({ children, flat, backTo }) {
  return (
    <FooterContainer>
      <div>
        <Header {...{ flat, backTo }} />
        {children}
      </div>
      <Footer {...{ flat }} />
    </FooterContainer>
  );
}
