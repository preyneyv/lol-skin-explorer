import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { Footer, FooterContainer } from "./footer";
import { Header } from "./header";
import styles from "./styles.module.scss";
import { VenatusAd } from "./venatus";

const LazyNewAdditions = dynamic(() => import("./new-additions"), {
  ssr: false,
});

export function Layout({ children, flat, backTo, withNew }) {
  return (
    <FooterContainer>
      <div>
        <Header {...{ flat, backTo }} />
        {withNew && <LazyNewAdditions />}
        {children}
      </div>
      <Footer {...{ flat }} />
    </FooterContainer>
  );
}

export function LayoutWithAds({ children, flat, backTo, withNew }) {
  // useRouteInterceptor();

  const footerRef = useRef(null);
  useEffect(() => {
    if (!footerRef.current) {
      return;
    }

    const mutationObserver = new MutationObserver((cb) => {
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

      footerRef.current.style.setProperty(
        "--mobile-h",
        hasMobile ? "50px" : "0px"
      );
      footerRef.current.style.setProperty(
        "--desktop-h",
        hasDesktop ? "90px" : "0px"
      );

      console.log(hasMobile, hasDesktop);
    });
    mutationObserver.observe(document.body, {
      subtree: true,
      childList: true,
    });
    return () => {
      mutationObserver.disconnect();
    };
  }, [footerRef]);

  return (
    <FooterContainer>
      <div>
        <Header {...{ flat, backTo }} />
        <div className={styles.adLayout}>
          <div className={styles.sidebar}>
            <div className={styles.sidebarAdContainer}>
              <VenatusAd placementName="double_mpu" />
            </div>
          </div>
          <div className={styles.main}>
            <div className={styles.adBanner}>
              <VenatusAd placementName="billboard" />
              <VenatusAd placementName="mobile_banner" />
            </div>
            {withNew && <LazyNewAdditions />}
            {children}
          </div>
          <div></div>
        </div>
      </div>

      <Footer {...{ flat }} />

      <div className={styles.adTestBanner}>
        <div>Venatus Ad Test</div>
        <div>&middot;</div>
        <a href="#" onClick={() => (window.location.href = "/")}>
          Exit
        </a>
      </div>
      <div ref={footerRef} className={styles.stickyAdContainer}>
        <VenatusAd placementName="mobile_horizontal_sticky" />
        <VenatusAd placementName="horizontal_sticky" />
      </div>
    </FooterContainer>
  );
}
