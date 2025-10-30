import Layout from "../components/Layout";
import "../styles/globals.css";
import Head from "next/head";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Tamil:wght@400;700&display=swap"
          rel="stylesheet"
        />

        {/* ✅ Google Analytics (gtag.js) */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-QQ2FNJ0P98"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-QQ2FNJ0P98');
            `,
          }}
        />

        {/* ✅ Google AdSense Auto Ads */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8044572563880113"
          crossOrigin="anonymous"
        ></script>

        <title>NewsV Tamil</title>
      </Head>

      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}
