import { ArrowLeft } from "react-feather";
import { Link } from "react-router-dom";
import { asset, rarity } from "../data";
import { Footer, FooterContainer } from "./footer";
import { Omnisearch } from "./omnisearch";

export function SkinList({ title, skins, linkTo }) {
  return (
    <FooterContainer>
      <div className="skin-list">
        <header>
          <Link to="/">
            <ArrowLeft />
            <span>Home</span>
          </Link>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h1>{title}</h1>
            <Omnisearch />
          </div>
        </header>
        <div>
          {skins.map((skin) => {
            const r = rarity(skin);
            return (
              <Link key={skin.id} to={linkTo(skin)}>
                <img src={asset(skin.tilePath)} alt={skin.name} />
                <div>
                  {r && <img src={r[0]} title={r[1]} alt={r[1]} />}
                  {skin.name}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
      <Footer />
    </FooterContainer>
  );
}
