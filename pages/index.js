import classNames from "classnames";
import { useState } from "react";
import Head from "next/head";
import { Header } from "../components/header";
import { useData } from "../data/contexts";
import styles from "../styles/index.module.scss";
import Link from "next/link";
import { asset } from "../data/helpers";

function ChampionsList() {
  const { champions } = useData();
  return (
    <div className={styles.champions}>
      {champions.map((c) => (
        <Link
          key={c.id}
          href={{
            pathname: "/champions/[champId]",
            query: { champId: c.id },
          }}
          prefetch={false}
        >
          <a>
            <img src={asset(c.squarePortraitPath)} alt={c.name} />
          </a>
        </Link>
      ))}
    </div>
  );
}

function SkinlinesList() {
  return null;
}

function UniversesList() {
  return null;
}

export default function Index() {
  const { patch } = useData();
  const [active, setActive] = useState("champions");
  return (
    <>
      <Head>
        <title>Skin Explorer</title>
      </Head>
      <Header patch={patch} />
      <Link href="/other" prefetch={false}>
        Other
      </Link>
      <div className={styles.container}>
        <aside>
          <div
            className={classNames({ [styles.active]: active === "champions" })}
            onClick={() => setActive("champions")}
          >
            Champions
          </div>
          <div
            className={classNames({ [styles.active]: active === "skinlines" })}
            onClick={() => setActive("skinlines")}
          >
            Skinlines
          </div>
          <div
            className={classNames({ [styles.active]: active === "universes" })}
            onClick={() => setActive("universes")}
          >
            Universes
          </div>
        </aside>
        <main>
          <ChampionsList show={active === "champions"} />
          <SkinlinesList show={active === "champions"} />
          <UniversesList show={active === "champions"} />
        </main>
      </div>
    </>
  );
}

export async function getStaticProps() {
  return {
    props: {},
    revalidate: 600,
  };
}
