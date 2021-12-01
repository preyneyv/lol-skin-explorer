import { Link, generatePath, useParams } from "react-router-dom";
import { SkinCarousel } from "../components/skin-carousel";
import { SkinList } from "../components/skin-list";
import { skinlines, skinlineSkins } from "../data";
import { navigate } from "../hooks";

export function SkinlineIndex() {
  return (
    <div className="skinlines-index">
      {skinlines.map((s) => (
        <Link
          key={s.id}
          to={generatePath("/skinlines/:lineId", { lineId: s.id })}
        >
          {s.name}
        </Link>
      ))}
    </div>
  );
}

export function Skinline() {
  const { lineId } = useParams();

  let line;
  try {
    const id = parseInt(lineId);
    line = skinlines.find((l) => l.id === id);
    if (!line) throw new Error("Bad skinline id");
  } catch (e) {
    return navigate("/");
  }

  const skins = skinlineSkins(line.id);

  return (
    <SkinList
      title={line.name}
      skins={skins}
      linkTo={(skin) =>
        generatePath("/skinlines/:lineId/skins/:skinId", {
          lineId,
          skinId: skin.id,
        })
      }
    />
  );
}

export function SkinlineSkin() {
  const { lineId, skinId } = useParams();
  let line;
  try {
    const id = parseInt(lineId);
    line = skinlines.find((l) => l.id === id);
    if (!line) throw new Error("Bad skinline id");
  } catch (e) {
    return navigate("/");
  }

  const skins = skinlineSkins(line.id);
  if (!skins.find((s) => s.id === parseInt(skinId)))
    return navigate(generatePath("/skinlines/:lineId", { lineId }));

  return (
    <SkinCarousel
      back={generatePath("/skinlines/:lineId", { lineId })}
      title={line.name}
      skins={skins}
      current={parseInt(skinId)}
      linkTo={(skin) =>
        generatePath("/skinlines/:lineId/skins/:skinId", {
          lineId,
          skinId: skin.id,
        })
      }
      showChampion
    />
  );
}
