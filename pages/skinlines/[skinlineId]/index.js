import Head from "next/head";
import Image from "next/image";
import { Fallback } from "../../../components/fallback";
import { Footer, FooterContainer } from "../../../components/footer";
import { useProps } from "../../../data/contexts";
import { Header } from "../../../components/header";
import { SkinGrid } from "../../../components/skin-grid";
import {
  asset,
  makeDescription,
  makeImage,
  makeTitle,
  skinlineSkins,
  useLocalStorageState,
  useSortedSkins,
} from "../../../data/helpers";
import { store } from "../../../data/store";
import styles from "../../../styles/collection.module.scss";
import { Folder } from "react-feather";

function _Page() {
  const { skinline, skins } = useProps();
  const [sortBy, setSortBy] = useLocalStorageState(
    "skinline__sortBy",
    "champion"
  );

  const linkTo = (skin) => `/skinlines/${skinline.id}/skins/${skin.id}`;

  const sortedSkins = useSortedSkins(sortBy === "rarity", skins);

  return (
    <>
      <Head>
        {makeTitle(skinline.name)}
        {makeDescription(
          `Browse through all ${skins.length} skin${
            skins.length == 1 ? "" : "s"
          } in the League of Legends ${skinline.name} skinline!`
        )}
        {makeImage(asset[skins[0]?.uncenteredSplashPath], skinline.name)}
      </Head>
      <div className={styles.container}>
        <FooterContainer>
          <div>
            <div className={styles.background}>
              <Image
                unoptimized
                layout="fill"
                objectFit="cover"
                src={asset(skins[0]?.uncenteredSplashPath)}
                alt={skinline.name}
              />
            </div>
            <Header backTo="/skinlines" flat />
            <main>
              <h2 className={styles.subtitle}>
                <Folder />
                Skinline
              </h2>
              <h1 className={styles.title}>{skinline.name}</h1>
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
              <SkinGrid
                skins={sortedSkins}
                linkTo={linkTo}
                viewerPage="/skinlines/[lId]/skins/[sId]"
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
  const { skinlineId } = ctx.params;
  await store.fetch();

  const [champions, skinlines, allSkins] = await Promise.all([
    store.patch.champions,
    store.patch.skinlines,
    store.patch.skins,
  ]);

  const skinline = skinlines.find((l) => l.id.toString() == skinlineId);
  if (!skinline) {
    return {
      notFound: true,
    };
  }

  const skins = skinlineSkins(skinline.id, allSkins, champions);

  return {
    props: {
      skinline,
      skins,
      patch: store.patch.fullVersionString,
    },
  };
}

export async function getStaticPaths() {
  let paths = [];
  if (process.env.NODE_ENV === "production") {
    await store.fetch();
    const skinlines = await store.patch.skinlines;
    paths = skinlines.map((l) => ({ params: { skinlineId: l.id.toString() } }));
  }

  return {
    paths,
    fallback: true,
  };
}
