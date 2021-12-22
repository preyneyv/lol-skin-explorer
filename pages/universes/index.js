import Image from "next/image";
import { useMemo } from "react";
import Head from "next/head";
import { Header } from "../../components/header";
import { Footer, FooterContainer } from "../../components/footer";
import { useProps } from "../../data/contexts";
import styles from "../../styles/index.module.scss";
import Link from "next/link";
import { asset, classes, useLocalStorageState } from "../../data/helpers";
import { store } from "../../data/store";

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
              href={{
                pathname: "/universes/[universeId]",
                query: { universeId: u.id },
              }}
              prefetch={false}
            >
              <a>{u.name}</a>
            </Link>
            {(skinSets.length > 1 || skinSets[0].name !== u.name) && (
              <ul>
                {skinSets.map(({ name, id }) => (
                  <li key={id}>
                    <Link
                      href={{
                        pathname: "/skinlines/[id]",
                        query: { id },
                      }}
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
  return (
    <>
      <Head>
        <title>Skinlines &middot; Skin Explorer</title>
      </Head>
      <FooterContainer>
        <div>
          <Header />
          <div className={styles.container}>
            <nav>
              <div className={styles.tabs}>
                <Link href="/">
                  <a>Champions</a>
                </Link>
                <Link href="/universes">
                  <a className={styles.active}>Universes</a>
                </Link>
                <Link href="/skinlines">
                  <a>Skinlines</a>
                </Link>
              </div>
            </nav>
            <main>
              <UniversesList />
            </main>
          </div>
        </div>
        <Footer />
      </FooterContainer>
    </>
  );
}

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
