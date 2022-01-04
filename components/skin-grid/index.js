import classNames from "classnames";
import Image from "next/image";
import Link from "next/link";
import { asset, rarity } from "../../data/helpers";
import styles from "./styles.module.scss";

export function SkinGrid({ skins, linkTo }) {
  if (skins.length === 0)
    return (
      <div className={styles.grid} style={{ gridTemplateColumns: "1fr" }}>
        <span className={styles.error}>No skins (yet)!</span>
      </div>
    );
  return (
    <div className={styles.grid}>
      {skins.map((skin) => {
        const r = rarity(skin);
        return (
          <Link key={skin.id} href={linkTo(skin)} as={linkTo(skin)}>
            <a>
              <Image
                className={styles.tile}
                unoptimized
                src={asset(skin.tilePath)}
                alt={skin.name}
                width={300}
                height={300}
              />
              <div>
                {skin.name}
                <div className={classNames({ [styles.rarityBadge]: r })}>
                  {r && (
                    <Image
                      src={r[0]}
                      title={r[1]}
                      alt={r[1]}
                      objectFit="contain"
                      objectPosition="center"
                      layout="fill"
                    />
                  )}
                </div>
              </div>
            </a>
          </Link>
        );
      })}
    </div>
  );
}
