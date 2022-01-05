import { useProps } from "../../data/contexts";
import Link from "next/link";
import Image from "../image";
import styles from "./style.module.scss";
import { rarity, asset } from "../../data/helpers";
import classNames from "classnames";

export function NewAdditions() {
  const { added } = useProps();

  if (!added.length) {
    return null;
  }

  const linkTo = (skin) => `/champions/${skin.$$key}/skins/${skin.id}`;

  return (
    <div className={styles.container}>
      <h3>New Additions</h3>
      <div className={styles.gridContainer}>
        <div className={styles.grid}>
          {added.map((skin) => {
            return (
              <Link key={skin.id} href={linkTo(skin)} as={linkTo(skin)}>
                <a className={styles.skin}>
                  <span className={styles.imageContainer}>
                    <Image
                      className={styles.tile}
                      unoptimized
                      loading="eager"
                      src={asset(skin.tilePath)}
                      alt={skin.name}
                      objectFit="cover"
                      layout="fill"
                    />
                  </span>
                  <div>{skin.name}</div>
                </a>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
