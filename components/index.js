import dynamic from "next/dynamic";
import { Footer, FooterContainer } from "./footer";
import { Header } from "./header";
import styles from "./styles.module.scss";
import { SidebarAdLayout, VenatusAd } from "./venatus";

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
        <SidebarAdLayout>
          {withNew && <LazyNewAdditions />}
          {children}
        </SidebarAdLayout>
      </div>

      <Footer {...{ flat }} />

      <div className={styles.stickyAdContainer}>
        <VenatusAd placementName="mobile_horizontal_sticky" />
        <VenatusAd placementName="horizontal_sticky" />
      </div>
    </FooterContainer>
  );
}
