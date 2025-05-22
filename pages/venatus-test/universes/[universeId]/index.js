import Head from "next/head";
import Image from "next/image";
import { Fallback } from "../../../../components/fallback";
import { Header } from "../../../../components/header";
import { useProps } from "../../../../data/contexts";
import {
  asset,
  makeDescription,
  makeImage,
  makeTitle,
  skinlineSkins,
  useLocalStorageState,
  useSortedSkins,
} from "../../../../data/helpers";
import { store } from "../../../../data/store";

import { Folder, Globe } from "lucide-react";
import Link from "next/link";
import { Footer, FooterContainer } from "../../../../components/footer";
import { SkinGrid } from "../../../../components/skin-grid";
import styles from "../../../../styles/collection.module.scss";

function Skinline({ sortByRarity, skinline, linkTo }) {
  const sortedSkins = useSortedSkins(sortByRarity, skinline.skins);

  return (
    <>
      <h2 className={styles.groupTitle}>
        <Link href="/skinlines/[skinlineId]" as={`/skinlines/${skinline.id}`}>
          <a>
            <Folder />
            {skinline.name}
          </a>
        </Link>
      </h2>
      <SkinGrid
        skins={sortedSkins}
        viewerPage="/universes/[uId]/skins/[sId]"
        linkTo={linkTo}
      />
    </>
  );
}

function _Page() {
  const { skinlines, universe } = useProps();
  const [sortBy, setSortBy] = useLocalStorageState(
    "universe__sortBy",
    "champion"
  );

  const linkTo = (skin) => `/universes/${universe.id}/skins/${skin.id}`;
  const splash =
    skinlines.length > 0 &&
    skinlines[0].skins.length > 0 &&
    asset(skinlines[0].skins[0].uncenteredSplashPath);
  return (
    <>
      <Head>
        {makeTitle(universe.name)}
        {makeDescription(
          universe.description ||
            `Browse through all the skins in the League of Legends ${universe.name} universe!`
        )}
        {splash && makeImage(splash, universe.name)}
      </Head>
      <div className={styles.container}>
        <FooterContainer>
          <div>
            {splash && (
              <div className={styles.background}>
                <Image
                  unoptimized
                  layout="fill"
                  objectFit="cover"
                  src={splash}
                  alt={universe.name}
                />
              </div>
            )}
            <Header backTo="/universes" flat />
            <main>
              <h2 className={styles.subtitle}>
                <Globe />
                Universe
              </h2>
              <h1 className={styles.title}>{universe.name}</h1>
              {universe.description && (
                <p className={styles.description}>{universe.description}</p>
              )}
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

  const {
    universes,
    champions,
    skinlines: allSkinlines,
    skins: allSkins,
  } = store.patch;

  const universe = universes.find((u) => u.id.toString() === universeId);
  if (!universe)
    return {
      notFound: true,
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
  };
}

export async function getStaticPaths() {
  let paths = [];
  if (process.env.NODE_ENV === "production") {
    const { universes } = store.patch;
    paths = universes.map((u) => ({ params: { universeId: u.id.toString() } }));
  }

  return {
    paths,
    fallback: "blocking",
  };
}
