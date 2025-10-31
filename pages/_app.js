import { useEffect } from "react";
import Script from "next/script";
import Layout from "../components/Layout";
import "../styles/globals.css";

export default function App({ Component, pageProps }) {
  useEffect(() => {
    let loaded = false;

    const loadAdsense = () => {
      if (loaded) return;
      loaded = true;

      const script = document.createElement("script");
      script.src =
        "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8044572563880113";
      script.async = true;
      script.crossOrigin = "anonymous";
      document.head.appendChild(script);
    };

    // Load on scroll or user interaction
    window.addEventListener("scroll", loadAdsense, { once: true });
    window.addEventListener("click", loadAdsense, { once: true });
    window.addEventListener("touchstart", loadAdsense, { once: true });

    return () => {
      window.removeEventListener("scroll", loadAdsense);
      window.removeEventListener("click", loadAdsense);
      window.removeEventListener("touchstart", loadAdsense);
    };
  }, []);

  return (
    <>
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
