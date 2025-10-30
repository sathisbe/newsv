// /pages/_app.js
import "../styles/globals.css";
import Layout from "../components/Layout";
import Head from "next/head";
import Script from "next/script";

export default function App({ Component, pageProps }) {
  return (
    <>
      {/* ✅ Basic Meta */}
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>NewsV Tamil</title>
      </Head>

      {/* ✅ Google Analytics */}
      <Script
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=G-QQ2FNJ0P98"
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

      {/* ✅ Layout Wrapper */}
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}
