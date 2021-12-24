import { ExternalLink, Folder, Globe, User } from "react-feather";
import Link from "next/link";
import styles from "./styles.module.scss";
export function Popup({ skin }) {
  const meta = skin.$skinExplorer;
  return (
    <aside className={styles.popup} onTouchStart={(e) => e.stopPropagation()}>
      <nav>
        <div>
          <User />
          <Link href="/champions/[key]" as={`/champions/${meta.champion.key}`}>
            <a>
              <span>{meta.champion.name}</span>
            </a>
          </Link>
        </div>
        {!!meta.universes.length && (
          <div>
            <Globe />
            {meta.universes.map((u) => (
              <Link key={u.id} href="/universes/[id]" as={`/universes/${u.id}`}>
                <a>
                  <span>{u.name}</span>
                </a>
              </Link>
            ))}
          </div>
        )}
        {!!meta.skinlines.length && (
          <div>
            <Folder />
            {meta.skinlines.map((l) => (
              <Link key={l.id} href="/skinlines/[id]" as={`/skinlines/${l.id}`}>
                <a>
                  <span>{l.name}</span>
                </a>
              </Link>
            ))}
          </div>
        )}
      </nav>
      {skin.description && (
        <p dangerouslySetInnerHTML={{ __html: skin.description }} />
      )}
      <div className={styles.external}>
        <a href={meta.teemoGGUrl} target="_blank" rel="noreferrer">
          View on Teemo.GG <ExternalLink />
        </a>
      </div>
    </aside>
  );
}
