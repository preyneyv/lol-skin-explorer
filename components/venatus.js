import { useEffect, useRef } from "react";

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
