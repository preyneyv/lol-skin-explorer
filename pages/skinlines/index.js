import { useEffect } from "react";
import Head from "next/head";
import { useProps } from "../../data/contexts";
import styles from "../../styles/index.module.scss";
import Link from "next/link";
import { store } from "../../data/store";
import { Nav } from "../../components/nav";
import { Layout } from "../../components";
import { makeTitle, makeDescription } from "../../data/helpers";

function SkinlinesList() {
  const { skinlines } = useProps();
  return (
    <div className={styles.skinlines}>
      {skinlines.map((l) => (
        <div key={l.id}>
          <Link
            href="/skinlines/[skinlineId]"
            as={`/skinlines/${l.id}`}
            prefetch={false}
          >
            <a>{l.name}</a>
          </Link>
        </div>
      ))}
    </div>
  );
}

export default function Index() {
  useEffect(() => {
    localStorage.lastIndex = "/skinlines";
  }, []);
  const { skinlines } = useProps();

  return (
    <>
      <Head>
        {makeTitle("Skinlines")}
        {makeDescription(
          `Browse through League of Legends skins from the comfort of your browser. Take a look at these ${skinlines.length} skinlines!`
        )}
      </Head>
      <div className={styles.container}>
        <Nav active="skinlines" />
        <main>
          <SkinlinesList />
        </main>
      </div>
    </>
  );
}

Index.getLayout = (page) => <Layout>{page}</Layout>;

export async function getStaticProps() {
  await store.fetch();

  const skinlines = await store.patch.skinlines;

  return {
    props: {
      skinlines,
      patch: store.patch.fullVersionString,
    },
    revalidate: 60,
  };
}
