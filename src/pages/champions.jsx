import { Link, generatePath, useParams } from "react-router-dom";
import { SkinCarousel } from "../components/skin-carousel";
import { SkinList } from "../components/skin-list";
import { asset, champions, championSkins } from "../data";
import { navigate, useEscapeTo, useTitle } from "../hooks";

export function ChampionsIndex() {
  return (
    <div className="champions-index">
      {champions.map((c) => (
        <Link
          title={c.name}
          key={c.id}
          to={generatePath("/champions/:champion", { champion: c.key })}
        >
          <img src={asset(c.squarePortraitPath)} alt={c.name} />
          <div>{c.name}</div>
        </Link>
      ))}
    </div>
  );
}

export function Champion() {
  const { champion } = useParams();
  let champ;

  champ = champions.find((c) => c.key === champion);
  useTitle(champ?.name);
  useEscapeTo("/");
  if (!champ) return navigate("/");

  const skins = championSkins(champ.id);

  return (
    <SkinList
      title={champ.name}
      skins={skins}
      linkTo={(skin) =>
        generatePath("/champions/:champion/skins/:skinId", {
          champion,
          skinId: skin.id,
        })
      }
    />
  );
}

export function ChampionSkin() {
  const { champion, skinId } = useParams();
  let champ;
  try {
    champ = champions.find((c) => c.key === champion);
    if (!champ) throw new Error("Bad champion");
  } catch (e) {
    return navigate("/");
  }

  const skins = championSkins(champ.id);
  if (!skins.find((s) => s.id === parseInt(skinId)))
    return navigate(generatePath("/champions/:champion", { champion }));

  return (
    <SkinCarousel
      back={generatePath("/champions/:champion", {
        champion,
      })}
      title={champ.name}
      skins={skins}
      current={parseInt(skinId)}
      linkTo={(skin) =>
        generatePath("/champions/:champion/skins/:skinId", {
          champion,
          skinId: skin.id,
        })
      }
      showSkinline
    />
  );
}
