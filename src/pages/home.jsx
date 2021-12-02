import React from "react";
import { Footer, FooterContainer } from "../components/footer";
import { Omnisearch } from "../components/omnisearch";
import { ChampionsIndex } from "./champions";
import { SkinlineIndex } from "./skinlines";

export function Home() {
  return (
    <FooterContainer>
      <div className="home">
        <header>
          <h1>Skin Explorer</h1>
          <Omnisearch />
        </header>
        <h2>Champions</h2>
        <ChampionsIndex />
        <hr />
        <h2>Skinlines</h2>
        <SkinlineIndex />
      </div>
      <Footer />
    </FooterContainer>
  );
}
