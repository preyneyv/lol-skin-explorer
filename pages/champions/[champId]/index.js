import { store } from "../../../data/store";

export default function Page() {
  return <div>hi</div>;
}

export async function getStaticProps() {
  return {
    props: {},
    revalidate: 600,
  };
}

export async function getStaticPaths() {
  await store.fetch();
  const champions = await store.patch.champions;
  return {
    paths: champions.map((c) => ({ params: { champId: c.id.toString() } })),
    fallback: true,
  };
}
