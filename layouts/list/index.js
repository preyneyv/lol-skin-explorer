import Head from "next/head";
import { Header } from "../../components/header";
import { useData } from "../../data/contexts";
import styles from "./styles.module.scss";

export const List = () => {
  const { patch, champions } = useData();
  return (
    <>
      <Head>
        <title>{patch ? `${patch} · ` : ""}Skin Explorer</title>
      </Head>
      <Header patch={patch} />
      <div className={styles.main}>
        {champions.map((c) => (
          <div key={c.id}>{c.name}</div>
        ))}
      </div>
    </>
  );
};
