import React from "react";
export function Footer() {
  return (
    <footer>
      <div>
        In-game data provided by{" "}
        <a href="https://communitydragon.org/" rel="noreferrer" target="_blank">
          CommunityDragon
        </a>
        . Skin Explorer isn't endorsed by Riot Games and doesn't reflect the
        views or opinions of Riot Games or anyone officially involved in
        producing or managing League of Legends. League of Legends and Riot
        Games are trademarks or registered trademarks of Riot Games, Inc.
      </div>
      <div>
        <div>
          Built by{" "}
          <a
            href="https://github.com/preyneyv"
            target="_blank"
            rel="noreferrer"
          >
            @preyneyv
          </a>
          .
        </div>
        <a
          href="https://github.com/preyneyv/lol-skin-explorer"
          target="_blank"
          rel="noreferrer"
        >
          View Source on GitHub
        </a>
      </div>
    </footer>
  );
}

export function FooterContainer({ children }) {
  return <div className="footer-container">{children}</div>;
}
