import BaseDocument, { Html, Head, Main, NextScript } from "next/document";

class Document extends BaseDocument {
  render() {
    return (
      <Html>
        <Head>
          <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
          <meta name="theme-color" content="rgb(12, 15, 19)" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://raw.communitydragon.org" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="true"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Lobster+Two:wght@700&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
            rel="stylesheet"
          />
          {process.env.NEXT_PUBLIC_VERCEL_ENV === "production" && (
            <script
              async
              defer
              data-website-id="9de8a8b2-be77-4c8b-9b1c-5e22f32e70d7"
              src="https://analytics.skinexplorer.lol/umami.js"
            />
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
