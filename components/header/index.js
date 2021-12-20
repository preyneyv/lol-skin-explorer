import Link from "next/link";
import styles from "./styles.module.scss";
import Image from "next/image";
import logo from "../../assets/logo.png";
import { Omnisearch } from "../omnisearch";

export const Header = () => {
  return (
    <header className={styles.header}>
      <Link href="/">
        <a>
          <div className={styles.logo}>
            <Image
              priority
              src={logo}
              alt="Skin Explorer"
              height={36}
              width={178}
            />
          </div>
        </a>
      </Link>
      <div>
        <Omnisearch />
      </div>
    </header>
  );
};
