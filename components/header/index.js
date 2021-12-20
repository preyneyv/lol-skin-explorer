import styles from "./styles.module.scss";
import { Omnisearch } from "../omnisearch";

export const Header = () => {
  return (
    <header className={styles.header}>
      <div>
        <img src="/logo.png" alt="logo" />
      </div>
      <div>
        <Omnisearch />
      </div>
    </header>
  );
};
