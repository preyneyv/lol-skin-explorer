import React from "react";
import { generatePath, useNavigate } from "react-router";
import { Footer, FooterContainer } from "../components/footer";
import { Omnisearch } from "../components/omnisearch";
import { champions, splitId } from "../data";
import { ChampionsIndex } from "./champions";
import { SkinlineIndex } from "./skinlines";

export function Home() {
  const navigate = useNavigate();

  return (
    <FooterContainer>
      <div className="home">
        <header>
          <h1 style={{ color: "rgb(53, 46, 53)" }}>Skin Explorer</h1>
          <Omnisearch
            onSelect={(type, entity) => {
              if (type === "champion") {
                navigate(
                  generatePath("/champions/:champion", { champion: entity.key })
                );
              }
              if (type === "skinline") {
                navigate(generatePath("/skinlines/:id", { id: entity.id }));
              }
              if (type === "skin") {
                const champId = splitId(entity.id)[0];
                const champ = champions.find((c) => c.id === champId);
                navigate(
                  generatePath("/champions/:cKey/skins/:sId", {
                    cKey: champ.key,
                    sId: entity.id,
                  })
                );
              }
            }}
          />
        </header>
        <ChampionsIndex />
        <hr />
        <SkinlineIndex />
      </div>
      <Footer />
    </FooterContainer>
  );
}
