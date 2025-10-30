import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import PostCard from "../components/PostCard";
import Sidebar from "../components/Sidebar";

export async function getStaticProps() {
  const API =
    process.env.NEXT_PUBLIC_WORDPRESS_API ||
    "https://newsvtamil.wpcomstaging.com/wp-json/wp/v2";
  try {
    const res = await fetch(`${API}/posts?per_page=10&_embed&page=1`);
    const posts = await res.json();
    const totalPages = parseInt(res.headers.get("X-WP-TotalPages") || "1", 10);
    return { props: { posts, totalPages }, revalidate: 60 };
  } catch (e) {
    console.error(e);
    return { props: { posts: [], totalPages: 1 } };
  }
}

export default function Home({ posts, totalPages }) {
  const siteUrl = "https://newsvtamil.com";
  const siteName = "NewsV Tamil";
  const title = `${siteName} — தமிழ் செய்திகள், இந்தியா, உலகம், சினிமா, விளையாட்டு`;
  const description =
    "தமிழ் செய்திகள், இந்தியா, உலகம், சினிமா, விளையாட்டு மற்றும் வைரல் செய்திகளை உடனுக்குடன் படிக்க NewsV Tamil-இல்!";
  const image =
    posts?.[0]?._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
    `${siteUrl}/logo.png`;

  // 🔹 Local state for dynamic loading
  const [allPosts, setAllPosts] = useState(posts);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(page < totalPages);

  // ✅ Load more posts (client-side fetch)
  const loadMore = async () => {
    if (!hasMore || loading) return;
    setLoading(true);
    const nextPage = page + 1;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_WORDPRESS_API || "https://newsvtamil.wpcomstaging.com/wp-json/wp/v2"}/posts?per_page=10&_embed&page=${nextPage}`
      );
      const newPosts = await res.json();
      setAllPosts([...allPosts, ...newPosts]);
      setPage(nextPage);
      if (nextPage >= totalPages) setHasMore(false);
    } catch (e) {
      console.error("Load more error:", e);
    }
    setLoading(false);
  };

  // 📰 Split hero post
  const hero = allPosts[0];
  const list = allPosts.slice(1);

  // ✅ JSON-LD schema
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: siteUrl,
    description,
    publisher: {
      "@type": "Organization",
      name: siteName,
      logo: {
        "@type": "ImageObject",
        url: image,
      },
    },
  };

  return (
    <>
      {/* ✅ SEO & Meta */}
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={siteUrl} />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={siteName} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image} />
        <meta property="og:url" content={siteUrl} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />

        {/* JSON-LD */}
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Head>

      {/* ✅ Layout */}
      <div className="container site-inner">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 py-6">
          {/* 📰 Main Content */}
          <main className="lg:col-span-2">
            {/* 🔹 Hero Post */}
            {hero && (
              <article className="mb-8 border-b pb-6">
                <Link href={`/${hero.slug}/`} className="block group">
                  <img
                    src={
                      hero._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
                      "/placeholder-4x3.png"
                    }
                    alt={hero.title.rendered}
                    className="w-full h-64 object-cover rounded-md transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                  <h1
                    className="text-3xl font-bold mt-4 leading-snug text-gray-900 group-hover:text-red-600 transition-colors"
                    dangerouslySetInnerHTML={{ __html: hero.title.rendered }}
                  />
                </Link>
                <p className="text-sm text-gray-500 mb-3">
                  {new Date(hero.date).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
                <div
                  className="prose text-gray-700"
                  dangerouslySetInnerHTML={{ __html: hero.excerpt.rendered }}
                />
              </article>
            )}

            {/* 🔹 Post List */}
            <div className="space-y-6">
              {list.map((p) => (
                <article
                  key={p.id}
                  className="border-b pb-4 hover:bg-gray-50 transition rounded-md"
                >
                  <Link href={`/${p.slug}/`} className="flex gap-4 group">
                    <img
                      src={
                        p._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
                        "/placeholder-4x3.png"
                      }
                      alt={p.title.rendered}
                      className="w-36 h-24 object-cover rounded-md transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                    <div>
                      <h2
                        className="text-lg font-semibold text-gray-900 group-hover:text-red-600 leading-snug transition-colors"
                        dangerouslySetInnerHTML={{
                          __html: p.title.rendered,
                        }}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(p.date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
            {/* 🔹 Load More Button */}
            {hasMore && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className={`px-6 py-3 text-sm font-semibold rounded-md border transition ${
                    loading
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-red-600 text-white hover:bg-red-700"
                  }`}
                >
                  {loading ? "Loading..." : "Load More"}
                </button>
              </div>
            )}

            {!hasMore && (
              <p className="text-center text-gray-500 mt-6">No more posts</p>
            )}
          </main>

          {/* 🔹 Sidebar */}
          <aside className="lg:col-span-1">
            <Sidebar posts={posts} />
          </aside>
        </div>
      </div>
    </>
  );
}
