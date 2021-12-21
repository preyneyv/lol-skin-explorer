import Link from "next/link";
import styles from "./styles.module.scss";
import Image from "next/image";
import classNames from "classnames";
import logo from "../../assets/logo.png";
import { Omnisearch } from "../omnisearch";
import { useEscapeTo } from "../../data/helpers";

export const Header = ({ flat, backArrow }) => {
  useEscapeTo("/");

  return (
    <>
      <header className={classNames(styles.header, { [styles.flat]: flat })}>
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
      <div className={styles.headerSpacer} />
    </>
  );
};
