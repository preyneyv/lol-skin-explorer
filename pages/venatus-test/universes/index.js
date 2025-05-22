import Head from "next/head";
import Link from "next/link";
import { useEffect } from "react";
import { Layout } from "../../../components";
import { Nav } from "../../../components/nav";
import { prepareAdditions } from "../../../components/new-additions/helpers";
import { useProps } from "../../../data/contexts";
import {
  makeDescription,
  makeTitle,
  useArrowNavigation,
} from "../../../data/helpers";
import { store } from "../../../data/store";
import styles from "../../../styles/index.module.scss";

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

  const handlers = useArrowNavigation("/", "/skinlines");

  const { universes } = useProps();

  return (
    <>
      <Head>
        {makeTitle("Universes")}
        {makeDescription(
          `Browse through League of Legends skins from the comfort of your browser. Take a look at these ${universes.length} universes!`
        )}
      </Head>
      <div {...handlers} className={styles.container}>
        <Nav active="universes" />
        <main>
          <UniversesList />
        </main>
      </div>
    </>
  );
}

Index.getLayout = (page) => <Layout withNew>{page}</Layout>;

export async function getStaticProps() {
  const { universes, skinlines } = store.patch;

  return {
    props: {
      universes: universes.filter((u) => u.skinSets.length),
      skinlines,
      patch: store.patch.fullVersionString,
      added: await prepareAdditions(),
    },
  };
}
