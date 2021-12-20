import Head from "next/head";
import { Header } from "../components/header";
import { useData } from "../data/contexts";
import styles from "../styles/index.module.scss";

export default function Index() {
  const { patch, champions, skinChanges } = useData();
  return (
    <>
      <Head>
        <title>Skin Explorer</title>
      </Head>
      <Header patch={patch} />
      {/* <div className={styles.main}>
        {champions.map((c) => (
          <div key={c.id}>{c.name}</div>
        ))}
      </div> */}
      {JSON.stringify(skinChanges)}
    </>
  );
}

export async function getStaticProps() {
  return {
    props: {},
    revalidate: 600,
  };
}
