import BaseDocument, { Head, Html, Main, NextScript } from "next/document";

class Document extends BaseDocument {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
          <meta name="theme-color" content="#0C0F13" />
          <link
            rel="preconnect"
            href="https://fonts.googleapis.com"
            crossOrigin="true"
          />
          <link
            rel="preconnect"
            href="https://raw.communitydragon.org"
            crossOrigin="true"
          />
          <link
            rel="preconnect"
            href="https://vitals.vercel-insights.com"
            crossOrigin="true"
          />
          <link
            rel="preconnect"
            href="https://analytics.skinexplorer.lol"
            crossOrigin="true"
          />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="true"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500&display=swap"
            rel="stylesheet"
          />
          <link rel="manifest" href="/manifest.webmanifest" />
          <link rel="apple-touch-icon" href="/icons/logo-192.png" />
          <link
            type="application/opensearchdescription+xml"
            rel="search"
            href="/opensearchdescription.xml"
          />
          {process.env.NEXT_PUBLIC_VERCEL_ENV === "production" && (
            <>
              <script
                async
                src="https://www.googletagmanager.com/gtag/js?id=G-V2ZERGTW3J"
              />
              <script
                id="google-analytics"
                async
                dangerouslySetInnerHTML={{
                  __html: `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    
                    gtag('config', 'G-V2ZERGTW3J');
                  `,
                }}
              />
              {/* <script
                async
                src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3297862613403903"
                crossOrigin="anonymous"
              ></script> */}
            </>
          )}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default Document;
