import { championSkins } from "../../../data/helpers";
import { store } from "../../../data/store";

export default function Page() {
  return <div>hi</div>;
}

export async function getStaticProps(ctx) {
  const { champId } = ctx.params;
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

  return {
    props: {
      champion,
      skins,
    },
    revalidate: 60,
  };
}

export async function getStaticPaths() {
  let paths = [];
  if (process.env.NODE_ENV === "production") {
    await store.fetch();
    const champions = await store.patch.champions;
    paths = champions.map((c) => ({ params: { champId: c.key.toString() } }));
  }

  return {
    paths,
    fallback: true,
  };
}
