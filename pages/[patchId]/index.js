import { comparePatches } from "../../data/patch";
import { store } from "../../data/store";
import { List } from "../../layouts/list";

export default function Index() {
  return <List />;
}

export async function getStaticProps(context) {
  const { patchId } = context.params;
  if (!store.patches[patchId]) return { notFound: true, revalidate: 60 };

  return {
    props: {},
    revalidate: 60,
  };
}

export async function getStaticPaths() {
  await store.fetch();

  return {
    paths: Object.keys(store.patches)
      .sort(comparePatches)
      .reverse()
      .slice(0, 5)
      .map((patchId) => ({
        params: { patchId },
      })),
    fallback: true,
  };
}
