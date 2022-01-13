import Image from "next/image";
import Head from "next/head";
import { useProps } from "../../../data/contexts";
import {
  championSkins,
  useLocalStorageState,
  useSortedSkins,
  makeTitle,
  makeImage,
  makeDescription,
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

  const linkTo = (skin) => `/champions/${champion.key}/skins/${skin.id}`;

  const sortedSkins = useSortedSkins(sortBy === "rarity", skins);

  return (
    <>
      <Head>
        {makeTitle(champion.name)}
        {makeDescription(
          `Browse through the ${skins.length} skin${
            skins.length == 1 ? "" : "s"
          } that ${champion.name} has!`
        )}
        {makeImage(asset(base.uncenteredSplashPath), champion.name)}
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
            <Header backTo="/" flat />
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
              <SkinGrid
                skins={sortedSkins}
                linkTo={linkTo}
                viewerPage="/champions/[key]/skins/[id]"
              />
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

  const { champions, skins: allSkins } = store.patch;

  const champion = champions.find((c) => c.key === champId);
  if (!champion) {
    return {
      notFound: true,
    };
  }

  const skins = championSkins(champion.id, allSkins);

  return {
    props: {
      champion,
      skins,
      patch: store.patch.fullVersionString,
    },
  };
}

export async function getStaticPaths() {
  let paths = [];
  if (process.env.NODE_ENV === "production") {
    const { champions } = store.patch;
    paths = champions.map((c) => ({ params: { champId: c.key.toString() } }));
  }

  return {
    paths,
    fallback: "blocking",
  };
}
