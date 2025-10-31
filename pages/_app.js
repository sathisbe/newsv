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

      // ⏳ Delay slightly to let header/logo fully render
      setTimeout(() => {
        const script = document.createElement("script");
        script.src =
          "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8044572563880113";
        script.async = true;
        script.crossOrigin = "anonymous";
        document.head.appendChild(script);

        console.log("✅ Google AdSense Auto Ads script injected safely");
      }, 1500); // delay 1.5s (prevents early layout shift)
    };

    // 🖱 Load after user interaction (scroll, click, or touch)
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

      {/* ✅ Wrap everything in a container to isolate header from auto ads */}
      <div id="site-wrapper">
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </div>
    </>
  );
}
