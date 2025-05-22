import dynamic from "next/dynamic";
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
  return (
    <FooterContainer>
      <div>
        <Header {...{ flat, backTo }} />
        <div className={styles.adTestBanner}>
          <div>Venatus Ad Test</div>
          <div>&middot;</div>
          <a href="/">Exit Test Page</a>
        </div>
        <div className={styles.adBanner}>
          <VenatusAd placementName="billboard" />
          <VenatusAd placementName="mobile_banner" />
        </div>
        <div className={styles.adLayout}>
          <div></div>
          <div>
            {withNew && <LazyNewAdditions />}
            {children}
          </div>
          <div></div>
        </div>
      </div>
      <VenatusAd placementName="horizontal_sticky" />
      <VenatusAd placementName="mobile_horizontal_sticky" />
      <VenatusAd placementName="video_slider" />
      <Footer {...{ flat }} />
    </FooterContainer>
  );
}
