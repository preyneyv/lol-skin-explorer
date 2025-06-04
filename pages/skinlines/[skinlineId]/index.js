import { Folder, Globe } from "lucide-react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { Fallback } from "../../../components/fallback";
import { Footer, FooterContainer } from "../../../components/footer";
import { Header } from "../../../components/header";
import { SkinGrid } from "../../../components/skin-grid";
import { FooterAds, SidebarAdLayout } from "../../../components/venatus";
import { useProps } from "../../../data/contexts";
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

function _Page() {
  const { skinline, universes, skins } = useProps();
  const [sortBy, setSortBy] = useLocalStorageState(
    "skinline__sortBy",
    "champion"
  );

  const linkTo = (skin) => `/skinlines/${skinline.id}/skins/${skin.id}`;

  const sortedSkins = useSortedSkins(sortBy === "rarity", skins);
  const splash = skins.length > 0 && asset(skins[0].uncenteredSplashPath);

  return (
    <>
      <Head>
        {makeTitle(skinline.name)}
        {makeDescription(
          `Browse through all ${skins.length} skin${
            skins.length == 1 ? "" : "s"
          } in the League of Legends ${skinline.name} skinline!`
        )}
        {splash && makeImage(splash, skinline.name)}
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
                  alt={skinline.name}
                />
              </div>
            )}
            <Header backTo="/skinlines" flat />
            <SidebarAdLayout>
              <main>
                <h2 className={styles.subtitle}>
                  <Folder />
                  Skinline
                </h2>
                <h1 className={styles.title}>{skinline.name}</h1>
                {!!universes.length && (
                  <div className={styles.parents}>
                    <Link
                      key={universes[0].id}
                      href="/universes/[universeId]"
                      as={`/universes/${universes[0].id}`}
                      prefetch={false}
                    >
                      <a>
                        <Globe />

                        <span>Part of the {universes[0].name} universe.</span>
                      </a>
                    </Link>
                  </div>
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
                <SkinGrid
                  skins={sortedSkins}
                  linkTo={linkTo}
                  viewerPage="/skinlines/[lId]/skins/[sId]"
                />
              </main>
            </SidebarAdLayout>
          </div>
          <Footer flat />
          <FooterAds />
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

  const {
    champions,
    skinlines,
    universes: allUniverses,
    skins: allSkins,
  } = store.patch;

  const skinline = skinlines.find((l) => l.id.toString() == skinlineId);
  if (!skinline) {
    return {
      notFound: true,
    };
  }

  const skins = skinlineSkins(skinline.id, allSkins, champions);
  const universes = allUniverses.filter((u) =>
    u.skinSets.includes(skinline.id)
  );

  return {
    props: {
      skinline,
      skins,
      universes,
      patch: store.patch.fullVersionString,
    },
  };
}

export async function getStaticPaths() {
  let paths = [];
  if (process.env.NODE_ENV === "production") {
    const { skinlines } = store.patch;
    paths = skinlines.map((l) => ({ params: { skinlineId: l.id.toString() } }));
  }

  return {
    paths,
    fallback: true,
  };
}
