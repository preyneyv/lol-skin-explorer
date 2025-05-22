import { Globe } from "lucide-react";
import { SkinViewer } from "../../../../../components/skin-viewer";
import { prepareCollection } from "../../../../../components/skin-viewer/helpers";
import { useProps } from "../../../../../data/contexts";
import { skinlineSkins } from "../../../../../data/helpers";
import { store } from "../../../../../data/store";

export default function Page() {
  const { skin, prev, next, id, name } = useProps();
  return (
    <SkinViewer
      backTo={`/universes/${id}`}
      linkTo={(s) => `/universes/${id}/skins/${s.id}`}
      collectionName={name}
      collectionIcon={<Globe />}
      collectionPage="/universes/[id]"
      {...{ skin, prev, next }}
    />
  );
}

export async function getStaticProps(ctx) {
  const { universeId, skinId } = ctx.params;

  const {
    universes,
    champions,
    skinlines: allSkinlines,
    skins: allSkins,
  } = store.patch;
  const universe = universes.find((u) => u.id.toString() === universeId);
  if (!universe)
    return {
      notFound: true,
    };

  const skins = allSkinlines
    .filter((l) => universe.skinSets.includes(l.id))
    .map((l) => allSkinlines.find((line) => line.id === l.id))
    .sort((a, b) => (a.name > b.name ? 1 : -1))
    .map((l) => skinlineSkins(l.id, allSkins, champions))
    .flat();

  const currentIdx = skins.findIndex((s) => s.id.toString() === skinId);
  if (currentIdx === -1)
    return {
      notFound: true,
    };

  const { skin, prev, next } = await prepareCollection(skins, currentIdx);

  return {
    props: {
      name: universe.name,
      id: universe.id,
      skin,
      prev,
      next,
      patch: store.patch.fullVersionString,
    },
  };
}

export async function getStaticPaths() {
  let paths = [];
  if (process.env.NODE_ENV === "production") {
    const { universes, skins } = store.patch;
    paths = Object.values(skins)
      .map((skin) =>
        (skin.skinLines ?? [])
          .map((skinline) => {
            const u = universes.find((u) => u.skinSets.includes(skinline.id));
            if (!u) return null;
            return {
              params: {
                universeId: u.id.toString(),
                skinId: skin.id.toString(),
              },
            };
          })
          .filter((a) => a)
      )
      .flat();
  }

  return {
    paths,
    fallback: "blocking",
  };
}
