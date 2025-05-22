import { User } from "lucide-react";
import { SkinViewer } from "../../../../../components/skin-viewer";
import { prepareCollection } from "../../../../../components/skin-viewer/helpers";
import { useProps } from "../../../../../data/contexts";
import { championSkins, splitId } from "../../../../../data/helpers";
import { store } from "../../../../../data/store";

export default function Page() {
  const { skin, prev, next, key, name } = useProps();
  return (
    <SkinViewer
      backTo={`/champions/${key}`}
      linkTo={(skin) => `/champions/${key}/skins/${skin.id}`}
      collectionName={name}
      collectionIcon={<User />}
      collectionPage="/champions/[key]"
      {...{ skin, prev, next }}
    />
  );
}

export async function getStaticProps(ctx) {
  const { champId, skinId } = ctx.params;

  const { champions, skins: allSkins } = store.patch;

  const champion = champions.find((c) => c.key === champId);
  if (!champion) {
    return {
      notFound: true,
    };
  }

  const skins = championSkins(champion.id, allSkins);
  const currentIdx = skins.findIndex((s) => s.id.toString() === skinId);
  if (currentIdx === -1) {
    return {
      notFound: true,
    };
  }

  const { skin, prev, next } = await prepareCollection(skins, currentIdx);

  return {
    props: {
      name: champion.name,
      key: champion.key,
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
    const { champions, skins } = store.patch;
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
    fallback: "blocking",
  };
}
