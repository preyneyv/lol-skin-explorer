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
          Skin Explorer isn&rsquo;t endorsed by Riot Games and doesn&rsquo;t
          reflect the views or opinions of Riot Games or anyone officially
          involved in producing or managing League of Legends. League of Legends
          and Riot Games are trademarks or registered trademarks of Riot Games,
          Inc.
        </p>
      </div>
      <div>
        <p>
          <b>Patch {patch} (PBE)</b>
        </p>
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
