import Head from "next/head";
import Image from "next/image";
import { Header } from "../../../components/header";
import { useProps } from "../../../data/contexts";
import { Fallback } from "../../../components/fallback";
import {
  asset,
  skinlineSkins,
  useLocalStorageState,
  useSortedSkins,
} from "../../../data/helpers";
import { store } from "../../../data/store";

import styles from "../../../styles/collection.module.scss";
import { Footer, FooterContainer } from "../../../components/footer";
import { SkinGrid } from "../../../components/skin-grid";
import Link from "next/link";

function Skinline({ sortByRarity, skinline, linkTo }) {
  const sortedSkins = useSortedSkins(sortByRarity, skinline.skins);

  return (
    <>
      <h2 className={styles.groupTitle}>
        <Link
          href={{
            pathname: "/skinlines/[id]",
            query: { id: skinline.id.toString() },
          }}
        >
          <a>{skinline.name}</a>
        </Link>
      </h2>
      <SkinGrid skins={sortedSkins} linkTo={linkTo} />
    </>
  );
}

function _Page() {
  const { skinlines, universe } = useProps();
  const [sortBy, setSortBy] = useLocalStorageState(
    "universe__sortBy",
    "champion"
  );

  const linkTo = (skin) => ({
    pathname: "/universes/[uId]/skins/[sId]",
    query: { uId: universe.id.toString(), sId: skin.id.toString() },
  });

  return (
    <>
      <Head>
        <title>{universe.name} &middot; Skin Explorer</title>
      </Head>
      <div className={styles.container}>
        <FooterContainer>
          <div>
            <div className={styles.background}>
              <Image
                unoptimized
                layout="fill"
                objectFit="cover"
                src={asset(skinlines[0].skins[0].uncenteredSplashPath)}
                alt={universe.name}
              />
            </div>
            <Header backTo="/universes" flat />
            <main>
              <h1 className={styles.title}>{universe.name}</h1>
              <div className={styles.controls}>
                <label>
                  <span>Sort By</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="champion">Champion</option>
                    <option value="rarity">Rarity</option>
                  </select>
                </label>
              </div>

              {skinlines.map((l) => (
                <Skinline
                  key={l.id}
                  linkTo={linkTo}
                  skinline={l}
                  sortByRarity={sortBy === "rarity"}
                  showTitle={
                    skinlines.length > 1 || skinlines[0].name !== universe.name
                  }
                />
              ))}
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
  const { universeId } = ctx.params;
  await store.fetch();

  const [universes, champions, allSkinlines, allSkins] = await Promise.all([
    store.patch.universes,
    store.patch.champions,
    store.patch.skinlines,
    store.patch.skins,
  ]);

  const universe = universes.find((u) => u.id.toString() === universeId);
  if (!universe)
    return {
      notFound: true,
      revalidate: 60,
    };

  const skinlines = allSkinlines
    .filter((l) => universe.skinSets.includes(l.id))
    .map((l) => ({ ...l, skins: skinlineSkins(l.id, allSkins, champions) }))
    .sort((a, b) => (a.name > b.name ? 1 : -1));

  return {
    props: {
      universe,
      skinlines,
      patch: store.patch.fullVersionString,
    },
    revalidate: 60,
  };
}

export async function getStaticPaths() {
  let paths = [];
  if (process.env.NODE_ENV === "production") {
    await store.fetch();
    const universes = await store.patch.universes;
    paths = universes.map((u) => ({ params: { universeId: u.id.toString() } }));
  }

  return {
    paths,
    fallback: true,
  };
}
