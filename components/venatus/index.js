import { useEffect, useRef } from "react";
import styles from "./styles.module.scss";

function vm() {
  self.__VM = self.__VM || [];
  return self.__VM;
}

/**
 * @param {{ placementName: string; alias?: string }} props
 * @returns
 */
export const VenatusAd = ({ placementName, alias }) => {
  const elRef = useRef(null);

  useEffect(() => {
    let placement;
    console.log("[PROSPER] add", placementName);

    vm().push(function (admanager, scope) {
      if (placementName === "vertical_sticky") {
        scope.Config.verticalSticky().display();
      } else if (
        placementName === "horizontal_sticky" ||
        placementName === "mobile_horizontal_sticky" ||
        placementName === "video_slider"
      ) {
        placement = scope.Config.get(placementName).displayBody();
      } else {
        placement = scope.Config.get(placementName).display(elRef.current);
      }
    });

    return () => {
      vm().push(function (admanager, scope) {
        console.log("[PROSPER] removed", placementName);
        if (placementName === "vertical_sticky") {
          scope.Config.verticalSticky().destroy();
        } else {
          placement.remove();
        }
      });
    };
  }, [placementName]);

  return <div ref={elRef}></div>;
};

export function useVenatusTracking() {
  useEffect(() => {
    vm().push(function (admanager, scope) {
      scope.Instances.pageManager.on(
        "navigated",
        () => {
          scope.Instances.pageManager.newPageSession(false);
        },
        false
      );
    });
  }, []);
}

export function useDynamicStickyHeight() {
  useEffect(() => {
    const INTERVAL = 1000;
    function setStickyHeight() {
      const ads = document.querySelectorAll(
        "body > span > span > span > iframe"
      );
      let hasMobile = false,
        hasDesktop = false;
      ads.forEach((ad) => {
        if (ad.clientHeight === 50) {
          hasMobile = true;
        } else {
          hasDesktop = true;
        }
      });

      console.log("[PROSPER] setStickyHeight", hasMobile, hasDesktop);

      document.body.style.setProperty(
        "--asp-mobile-h",
        hasMobile ? "50px" : "0px"
      );
      document.body.style.setProperty(
        "--asp-desktop-h",
        hasDesktop ? "90px" : "0px"
      );
    }
    setStickyHeight();
    function lazyStickyHeight() {
      const redo = () => (timeout = setTimeout(lazyStickyHeight, INTERVAL));
      if (window.requestIdleCallback) {
        window.requestIdleCallback(
          () => {
            setStickyHeight();
            redo();
          },
          { timeout: 1000 }
        );
      } else {
        setStickyHeight();
        redo();
      }
    }
    let timeout = setTimeout(lazyStickyHeight, INTERVAL);
    const obs = new MutationObserver(() => setStickyHeight());
    obs.observe(document.body, {
      childList: true,
      subtree: true,
    });
    return () => {
      clearInterval(timeout);
      obs.disconnect();
    };
  }, []);
}

export function SidebarAdLayout({ children }) {
  return (
    <div className={styles.adLayout}>
      <div className={styles.sidebar}>
        <div className={styles.sidebarAdContainer}>
          <div className={styles.mpu}>
            <VenatusAd placementName="double_mpu" />
          </div>
          <div>
            <VenatusAd placementName="video" />
          </div>
        </div>
      </div>
      <div className={styles.main}>
        <div className={styles.adBanner}>
          <VenatusAd placementName="billboard" />
          <VenatusAd placementName="mobile_banner" />
        </div>
        {children}
      </div>
    </div>
  );
}

export function FooterAds() {
  return (
    <div className={styles.stickyAdContainer}>
      <VenatusAd placementName="mobile_horizontal_sticky" />
      <VenatusAd placementName="horizontal_sticky" />
    </div>
  );
}
