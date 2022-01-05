import { Header } from "./header";
import { Footer, FooterContainer } from "./footer";
import { NewAdditions } from "./new-additions";

export function Layout({ children, flat, backTo, withNew }) {
  return (
    <FooterContainer>
      <div>
        <Header {...{ flat, backTo }} />
        {withNew && <NewAdditions />}
        {children}
      </div>
      <Footer {...{ flat }} />
    </FooterContainer>
  );
}
