import { Folder } from "react-feather";
import { SkinViewer } from "../../../../components/skin-viewer";
import { prepareCollection } from "../../../../components/skin-viewer/helpers";
import { useProps } from "../../../../data/contexts";
import { skinlineSkins } from "../../../../data/helpers";
import { store } from "../../../../data/store";

export default function Page() {
  const { skin, prev, next, id, name } = useProps();
  return (
    <SkinViewer
      backTo={`/skinlines/${id}`}
      linkTo={(skin) => `/skinlines/${id}/skins/${skin.id}`}
      collectionName={name}
      collectionIcon={<Folder />}
      collectionPage="/skinlines/[id]"
      {...{ skin, prev, next }}
    />
  );
}

export async function getStaticProps(ctx) {
  const { skinlineId, skinId } = ctx.params;
  await store.fetch();

  const [skinlines, champions, allSkins] = await Promise.all([
    store.patch.skinlines,
    store.patch.champions,
    store.patch.skins,
  ]);

  const skinline = skinlines.find((l) => l.id.toString() === skinlineId);
  if (!skinline) {
    return {
      notFound: true,
      revalidate: 60,
    };
  }

  const skins = skinlineSkins(skinline.id, allSkins, champions);
  const currentIdx = skins.findIndex((s) => s.id.toString() === skinId);
  if (currentIdx === -1) {
    return {
      notFound: true,
      revalidate: 60,
    };
  }

  const { skin, prev, next } = await prepareCollection(skins, currentIdx);

  return {
    props: {
      name: skinline.name,
      id: skinline.id,
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
    const skins = await store.patch.skins;

    paths = Object.values(skins)
      .map((skin) =>
        (skin.skinLines ?? []).map((skinline) => {
          return {
            params: {
              skinlineId: skinline.id.toString(),
              skinId: skin.id.toString(),
            },
          };
        })
      )
      .flat();
  }

  return {
    paths,
    fallback: true,
  };
}
