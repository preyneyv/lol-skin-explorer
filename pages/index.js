import Image from "next/image";
import classNames from "classnames";
import { useMemo, useState } from "react";
import Head from "next/head";
import { Header } from "../components/header";
import { Footer, FooterContainer } from "../components/footer";
import { useProps } from "../data/contexts";
import styles from "../styles/index.module.scss";
import Link from "next/link";
import { asset, classes } from "../data/helpers";
import { store } from "../data/store";

function ChampionsList({ role }) {
  const { champions } = useProps();
  const filteredChamps = useMemo(() => {
    if (!role) return champions;

    return champions.filter((c) => c.roles.includes(role));
  }, [champions, role]);

  return (
    <div className={styles.champions}>
      {filteredChamps.map((c) => (
        <Link
          key={c.id}
          href={{
            pathname: "/champions/[champId]",
            query: { champId: c.key },
          }}
          prefetch={false}
        >
          <a>
            <Image
              unoptimized
              className={styles.img}
              src={asset(c.squarePortraitPath)}
              alt={c.name}
              width={80}
              height={80}
            />
            <div>{c.name}</div>
          </a>
        </Link>
      ))}
    </div>
  );
}

function SkinlinesList() {
  const { skinlines } = useProps();
  return (
    <div className={styles.skinlines}>
      {skinlines.map((l) => (
        <div key={l.id}>
          <Link
            href={{
              pathname: "/skinlines/[skinlineId]",
              query: { skinlineId: l.id },
            }}
            prefetch={false}
          >
            <a>{l.name}</a>
          </Link>
        </div>
      ))}
    </div>
  );
}

function UniversesList() {
  const { universes, skinlines } = useProps();
  return (
    <div className={styles.universes}>
      {universes.map((u) => (
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
          {u.skinSets.length > 1 && (
            <ul>
              {u.skinSets.map((id) => (
                <li key={id}>
                  <Link
                    href={{
                      pathname: "/skinlines/[id]",
                      query: { id },
                    }}
                    prefetch={false}
                  >
                    <a>{skinlines.find((s) => s.id === id).name}</a>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}

export default function Index() {
  const [active, setActive] = useState("champions");
  const [champRole, setChampRole] = useState("");

  return (
    <>
      <Head>
        <title>Skin Explorer</title>
      </Head>
      <FooterContainer>
        <div>
          <Header />
          <div className={styles.container}>
            <nav>
              <div className={styles.tabs}>
                <div
                  className={classNames({
                    [styles.active]: active === "champions",
                  })}
                  onClick={() => setActive("champions")}
                >
                  Champions
                </div>
                <div
                  className={classNames({
                    [styles.active]: active === "universes",
                  })}
                  onClick={() => setActive("universes")}
                >
                  Universes
                </div>
                <div
                  className={classNames({
                    [styles.active]: active === "skinlines",
                  })}
                  onClick={() => setActive("skinlines")}
                >
                  Skinlines
                </div>
              </div>
              <div
                className={styles.filters}
                style={{ display: active === "champions" ? "block" : "none" }}
              >
                <label>
                  <span>Role</span>
                  <select
                    value={champRole}
                    onChange={(e) => setChampRole(e.target.value)}
                  >
                    <option value="">All</option>
                    {Object.entries(classes).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </nav>
            <main>
              <div
                style={{ display: active === "champions" ? "block" : "none" }}
              >
                <ChampionsList role={champRole} />
              </div>
              <div
                style={{ display: active === "skinlines" ? "block" : "none" }}
              >
                <SkinlinesList />
              </div>
              <div
                style={{ display: active === "universes" ? "block" : "none" }}
              >
                <UniversesList />
              </div>
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

  const [champions, skinlines, universes] = await Promise.all([
    store.patch.champions,
    store.patch.skinlines,
    store.patch.universes,
  ]);

  return {
    props: {
      champions,
      skinlines,
      universes,
      patch: store.patch.fullVersionString,
    },
    revalidate: 600,
  };
}
