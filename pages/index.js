import Image from "next/image";
import { useMemo } from "react";
import Head from "next/head";
import { Header } from "../components/header";
import { Footer, FooterContainer } from "../components/footer";
import { useProps } from "../data/contexts";
import styles from "../styles/index.module.scss";
import Link from "next/link";
import { asset, classes, useLocalStorageState } from "../data/helpers";
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

export default function Index() {
  const [champRole, setChampRole] = useLocalStorageState(
    "champs_index__champRole",
    ""
  );

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
                <Link href="/">
                  <a className={styles.active}>Champions</a>
                </Link>
                <Link href="/universes">
                  <a>Universes</a>
                </Link>
                <Link href="/skinlines">
                  <a>Skinlines</a>
                </Link>
              </div>
              <div className={styles.filters}>
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
              <ChampionsList role={champRole} />
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

  const champions = await store.patch.champions;

  return {
    props: {
      champions,
      patch: store.patch.fullVersionString,
    },
    revalidate: 60,
  };
}
