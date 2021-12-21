import Image from "next/image";
import Link from "next/link";
import { asset, rarity } from "../../data/helpers";
import styles from "./styles.module.scss";

export function SkinGrid({ skins, linkTo }) {
  return (
    <div className={styles.grid}>
      {skins.map((skin) => {
        const r = rarity(skin);
        return (
          <Link key={skin.id} href={linkTo(skin)}>
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
                {r && (
                  <div className={styles.rarityBadge}>
                    <Image
                      src={r[0]}
                      title={r[1]}
                      alt={r[1]}
                      objectFit="contain"
                      objectPosition="center"
                      layout="fill"
                    />
                  </div>
                )}
                {skin.name}
              </div>
            </a>
          </Link>
        );
      })}
    </div>
  );
}
