import classNames from "classnames";
import styles from "./styles.module.scss";
import { useProps } from "../../data/contexts";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

export function Footer({ flat }) {
  const { patch } = useProps();
  return (
    <footer className={classNames(styles.footer, { [styles.flat]: flat })}>
      <div>
        <p>
          In-game data provided by{" "}
          <a
            target="_blank"
            href="https://communitydragon.org"
            rel="noreferrer"
          >
            CommunityDragon
          </a>{" "}
          and the{" "}
          <a
            target="_blank"
            href="https://leagueoflegends.fandom.com/"
            rel="noreferrer"
          >
            League of Legends Wiki
          </a>
          .
        </p>
        <p>
          Skin Explorer was created under Riot Games' "Legal Jibber Jabber"
          policy using assets owned by Riot Games. Riot Games does not endorse
          or sponsor this project.
        </p>
      </div>
      <div>
        {patch && (
          <p>
            <a
              href="https://raw.communitydragon.org/pbe"
              target="_blank"
              rel="noreferrer"
            >
              <b>Patch {patch}</b>
            </a>
          </p>
        )}
        <p>
          <a
            target="_blank"
            href={`https://github.com/preyneyv/lol-skin-explorer/tree/${
              process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA ?? "main"
            }`}
            rel="noreferrer"
          >
            Skin Explorer v{publicRuntimeConfig?.version}
          </a>
          <br />
          Built by{" "}
          <a
            target="_blank"
            href="https://github.com/preyneyv"
            rel="noreferrer"
          >
            @preyneyv
          </a>
          .{" "}
          <a
            target="_blank"
            href="https://github.com/preyneyv/lol-skin-explorer"
            rel="noreferrer"
          >
            View Source on GitHub
          </a>
        </p>
      </div>
    </footer>
  );
}

export function FooterContainer({ children }) {
  return <div className={styles.container}>{children}</div>;
}
