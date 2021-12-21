import {
  SkinViewer,
  prepareCollection,
} from "../../../../components/skin-viewer";
import { useProps } from "../../../../data/contexts";
import { skinlineSkins } from "../../../../data/helpers";
import { store } from "../../../../data/store";

export default function Page() {
  const { skin, prev, next, id, name } = useProps();
  return (
    <SkinViewer
      backTo={{
        pathname: "/universes/[id]",
        query: { id },
      }}
      linkTo={(sId) => ({
        pathname: "/universes/[id]/skins/[sId]",
        query: { id, sId },
      })}
      collectionName={name}
      {...{ skin, prev, next }}
    />
  );
}

export async function getStaticProps(ctx) {
  const { universeId, skinId } = ctx.params;
  await store.fetch();

  const [universes, champions, allSkinlines, allSkins] = await Promise.all([
    store.patch.universes,
    store.patch.champions,
    store.patch.skinlines,
    store.patch.skins,
  ]);

  const universe = universes.find((u) => u.id.toString() === universeId);
  if (!universe)
    return {
      notFound: true,
      revalidate: 60,
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
      revalidate: 60,
    };

  const { skin, prev, next } = prepareCollection(skins, currentIdx);

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
    await store.fetch();
    const [universes, skins] = await Promise.all([
      store.patch.universes,
      store.patch.skins,
    ]);

    paths = Object.values(skins)
      .map((skin) =>
        (skin.skinLines ?? [])
          .map((skinline) => {
            const u = universes.find((u) => u.skinSets.includes(skinline.id));
            if (!u) return null;
            return {
              params: {
                universeId: u.id,
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
    fallback: true,
  };
}
