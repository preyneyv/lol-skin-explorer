import Image from "next/image";
import Head from "next/head";
import { useProps } from "../../../data/contexts";
import {
  championSkins,
  useLocalStorageState,
  useSortedSkins,
} from "../../../data/helpers";
import { store } from "../../../data/store";
import { Header } from "../../../components/header";
import { SkinGrid } from "../../../components/skin-grid";
import { Footer, FooterContainer } from "../../../components/footer";
import { useMemo } from "react";
import { Fallback } from "../../../components/fallback";
import { asset } from "../../../data/helpers";
import styles from "../../../styles/collection.module.scss";

function _Page() {
  const { champion, skins } = useProps();
  const [sortBy, setSortBy] = useLocalStorageState(
    "champion__sortBy",
    "release"
  );
  const base = useMemo(() => skins.find((s) => s.isBase), [skins]);

  const linkTo = (skin) => ({
    pathname: "/champions/[key]/skins/[id]",
    query: { key: champion.key, id: skin.id.toString() },
  });

  const sortedSkins = useSortedSkins(sortBy === "rarity", skins);

  return (
    <>
      <Head>
        <title>{champion.name} &middot; Skin Explorer</title>
      </Head>
      <div className={styles.container}>
        <FooterContainer>
          <div>
            <div className={styles.background}>
              <Image
                unoptimized
                layout="fill"
                objectFit="cover"
                src={asset(base.uncenteredSplashPath)}
                alt={champion.name}
              />
            </div>
            <Header backArrow flat />
            <main>
              <h1 className={styles.title}>{champion.name}</h1>
              <div className={styles.controls}>
                <label>
                  <span>Sort By</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="release">Release</option>
                    <option value="rarity">Rarity</option>
                  </select>
                </label>
              </div>
              <SkinGrid skins={sortedSkins} linkTo={linkTo} />
            </main>
          </div>
          <Footer flat />
        </FooterContainer>
      </div>
    </>
  );
}

export default function Page() {
  return (
    <Fallback>
      <_Page />
    </Fallback>
  );
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
      patch: store.patch.fullVersionString,
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
