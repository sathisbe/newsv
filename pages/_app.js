import Layout from "../components/Layout";
import "../styles/globals.css";
import Head from "next/head";
import Script from "next/script";

export default function App({ Component, pageProps }) {
  return (
    <>
      {/* ✅ Meta & Page Title */}
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>NewsV Tamil</title>
      </Head>

      {/* ✅ Google Analytics (gtag.js) */}
      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-QQ2FNJ0P98"
        strategy="afterInteractive"
      />
      <Script
        id="ga-setup"
        strategy="afterInteractive"
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
      <Script
        id="adsense-script"
        strategy="afterInteractive"
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8044572563880113"
        crossOrigin="anonymous"
      />

      {/* ✅ Layout Wrapper */}
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}
