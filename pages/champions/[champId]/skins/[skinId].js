import { splitId } from "../../../../data/helpers";
import { store } from "../../../../data/store";
import { championSkins } from "../../../../data/helpers";
import {
  SkinViewer,
  prepareCollection,
} from "../../../../components/skin-viewer";
import { useProps } from "../../../../data/contexts";

export default function Page() {
  const { skin, prev, next, key, name } = useProps();
  return (
    <SkinViewer
      backTo={{
        pathname: "/champions/[key]",
        query: { key },
      }}
      linkTo={(id) => ({
        pathname: "/champions/[key]/skins/[id]",
        query: { key, id },
      })}
      collectionName={name}
      {...{ skin, prev, next }}
    />
  );
}

export async function getStaticProps(ctx) {
  const { champId, skinId } = ctx.params;
  await store.fetch();

  const [champions, allSkins] = await Promise.all([
    store.patch.champions,
    store.patch.skins,
  ]);

  const champion = champions.find((c) => c.key === champId);
  if (!champion) {
    return {
      notFound: true,
      revalidate: 60,
    };
  }

  const skins = championSkins(champion.id, allSkins);
  const currentIdx = skins.findIndex((s) => s.id.toString() === skinId);
  if (currentIdx === -1) {
    return {
      notFound: true,
      revalidate: 60,
    };
  }

  const { skin, prev, next } = prepareCollection(skins, currentIdx);

  return {
    props: {
      name: champion.name,
      key: champion.key,
      skin,
      prev,
      next,
      patch: store.patch.fullVersionString,
    },
    revalidate: 60,
  };
}

export async function getStaticPaths() {
  let paths = [];
  if (process.env.NODE_ENV === "production") {
    await store.fetch();
    const [champions, skins] = await Promise.all([
      store.patch.champions,
      store.patch.skins,
    ]);
    const champLookup = champions.reduce(
      (obj, c) => ({ ...obj, [c.id]: c.key }),
      {}
    );
    paths = Object.values(skins).map((skin) => ({
      params: {
        champId: champLookup[splitId(skin.id)[0]],
        skinId: skin.id.toString(),
      },
    }));
  }

  return {
    paths,
    fallback: true,
  };
}
