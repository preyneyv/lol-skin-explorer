import { Folder } from "lucide-react";
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

  const { skinlines, champions, skins: allSkins } = store.patch;

  const skinline = skinlines.find((l) => l.id.toString() === skinlineId);
  if (!skinline) {
    return {
      notFound: true,
    };
  }

  const skins = skinlineSkins(skinline.id, allSkins, champions);
  const currentIdx = skins.findIndex((s) => s.id.toString() === skinId);
  if (currentIdx === -1) {
    return {
      notFound: true,
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
  };
}

export async function getStaticPaths() {
  let paths = [];
  if (process.env.NODE_ENV === "production") {
    const { skins } = store.patch;

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
    fallback: "blocking",
  };
}
