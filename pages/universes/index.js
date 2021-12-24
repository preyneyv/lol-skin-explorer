import { useEffect } from "react";
import Head from "next/head";
import { useProps } from "../../data/contexts";
import styles from "../../styles/index.module.scss";
import Link from "next/link";
import { store } from "../../data/store";
import { Nav } from "../../components/nav";
import { Layout } from "../../components";

function UniversesList() {
  const { universes, skinlines } = useProps();
  return (
    <div className={styles.universes}>
      {universes.map((u) => {
        const skinSets = u.skinSets
          .map((id) => ({
            id,
            name: skinlines.find((s) => s.id === id).name,
          }))
          .sort((a, b) => (a.name > b.name ? 1 : -1));
        return (
          <div key={u.id}>
            <Link
              href="/universes/[universeId]"
              as={`/universes/${u.id}`}
              prefetch={false}
            >
              <a>{u.name}</a>
            </Link>
            {(skinSets.length > 1 || skinSets[0].name !== u.name) && (
              <ul>
                {skinSets.map(({ name, id }) => (
                  <li key={id}>
                    <Link
                      href="/skinlines/[skinlineId]"
                      as={`/skinlines/${id}`}
                      prefetch={false}
                    >
                      <a>{name}</a>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function Index() {
  useEffect(() => {
    localStorage.lastIndex = "/universes";
  }, []);

  const { universes } = useProps();

  return (
    <>
      <Head>
        <title>Universes &middot; Skin Explorer</title>
        <meta
          name="description"
          content={`Skin Explorer is an online skin splash art viewer that lets you browse through League of Legends skins from the comfort of your browser. Take a look at these ${universes.length} universes!`}
        />
      </Head>
      <div className={styles.container}>
        <Nav active="universes" />
        <main>
          <UniversesList />
        </main>
      </div>
    </>
  );
}

Index.getLayout = (page) => <Layout>{page}</Layout>;

export async function getStaticProps() {
  await store.fetch();

  const [universes, skinlines] = await Promise.all([
    store.patch.universes,
    store.patch.skinlines,
  ]);

  return {
    props: {
      universes,
      skinlines,
      patch: store.patch.fullVersionString,
    },
    revalidate: 60,
  };
}
