import { Footer, FooterContainer } from "../components/footer";
import { ChampionsIndex } from "./champions";
import { SkinlineIndex } from "./skinlines";

export function Home() {
  return (
    <FooterContainer>
      <div className="home">
        <ChampionsIndex />
        <hr />
        <SkinlineIndex />
      </div>
      <Footer />
    </FooterContainer>
  );
}
