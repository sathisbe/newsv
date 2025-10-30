import Head from "next/head";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const SITE_URL = "https://newsvtamil.com";
const API = `https://newsvtamil.wpcomstaging.com/wp-json/wp/v2`;

export async function getStaticPaths() {
  const res = await fetch(`${API}/pages?per_page=50&_fields=slug`);
  const pages = await res.json();

  const paths = pages.map((p) => ({
    params: { slug: p.slug },
  }));

  return {
    paths,
    fallback: "blocking", // generate on demand
  };
}

export async function getStaticProps({ params }) {
  const slug = params.slug;
  try {
    const res = await fetch(`${API}/pages?slug=${slug}&_embed`);
    const data = await res.json();
    const page = data[0];

    if (!page) return { notFound: true };

    return {
      props: { page },
      revalidate: 600, // regenerate every 10 mins
    };
  } catch (e) {
    console.error("Error fetching page:", e);
    return { notFound: true };
  }
}

export default function Page({ page }) {
  if (!page) return null;

  const title = page.title?.rendered || "";
  const content = page.content?.rendered || "";
  const excerpt = page.excerpt?.rendered?.replace(/<[^>]+>/g, "") || "";
  const canonical = `${SITE_URL}/page/${page.slug}/`;

  return (
    <>
      <Head>
        <title>{title} | NewsV Tamil</title>
        <meta name="description" content={excerpt} />
        <link rel="canonical" href={canonical} />

        {/* ✅ OG & Twitter Meta */}
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="NewsV Tamil" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={excerpt} />
        <meta property="og:url" content={canonical} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={excerpt} />

        {/* ✅ Schema Markup */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              headline: title,
              description: excerpt,
              url: canonical,
              publisher: {
                "@type": "Organization",
                name: "NewsV Tamil",
                logo: {
                  "@type": "ImageObject",
                  url: `${SITE_URL}/logo.png`,
                },
              },
            }),
          }}
        />
      </Head>


      <main className="container mx-auto px-3 py-6 max-w-4xl bg-white p-4 rounded-md shadow-sm">
        <h1
          className="text-3xl font-bold mb-4 leading-tight text-center"
          dangerouslySetInnerHTML={{ __html: title }}
        />
        <div
          className="prose max-w-none text-gray-800 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </main>

    </>
  );
}
