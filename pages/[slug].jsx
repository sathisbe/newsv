import Head from "next/head";

import Link from "next/link";

const SITE_URL = "https://newsvtamil.com";
const API = `https://newsvtamil.wpcomstaging.com/wp-json/wp/v2`;

// ✅ 1️⃣  Static generation paths
export async function getStaticPaths() {
  const res = await fetch(`${API}/posts?per_page=50&_fields=slug`);
  const posts = await res.json();
  const paths = posts.map((p) => ({ params: { slug: p.slug } }));
  return { paths, fallback: "blocking" };
}

// ✅ 2️⃣  Fetch post, recent, related, next, previous
export async function getStaticProps({ params }) {
  const slug = params.slug;
  try {
    const [postRes, recentRes] = await Promise.all([
      fetch(`${API}/posts?slug=${slug}&_embed`),
      fetch(`${API}/posts?per_page=6&_embed`),
    ]);
    const postData = await postRes.json();
    const post = postData[0];
    if (!post) return { notFound: true };

    // Get related posts (same category)
    const catId = post.categories?.[0];
    const relatedRes = catId
      ? await fetch(`${API}/posts?categories=${catId}&exclude=${post.id}&per_page=4&_embed`)
      : null;
    const related = relatedRes ? await relatedRes.json() : [];

    // Get next & previous posts
    const [prevRes, nextRes] = await Promise.all([
      fetch(`${API}/posts?per_page=1&order=desc&orderby=date&before=${post.date}`),
      fetch(`${API}/posts?per_page=1&order=asc&orderby=date&after=${post.date}`),
    ]);
    const [prevPost, nextPost] = await Promise.all([prevRes.json(), nextRes.json()]);

    const recent = await recentRes.json();

    return {
      props: {
        post,
        recent,
        related,
        prev: prevPost[0] || null,
        next: nextPost[0] || null,
      },
      revalidate: 300,
    };
  } catch (e) {
    console.error("Error fetching:", e);
    return { notFound: true };
  }
}

// ✅ 3️⃣  Render component
export default function Post({ post, recent, related, prev, next }) {
  if (!post) return null;

  const title = post.title?.rendered || "";
  const content = post.content?.rendered || "";
  const excerpt = post.excerpt?.rendered?.replace(/<[^>]+>/g, "") || "";
  const image =
    post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
    `${SITE_URL}/default-share.jpg`;
  const author = post._embedded?.author?.[0]?.name || "NewsV Tamil";
  const published = post.date;
  const updated = post.modified;
  const canonical = `${SITE_URL}/${post.slug}/`;

  // ✅ SEO schema
  const schema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: title,
    image: [image],
    datePublished: published,
    dateModified: updated,
    author: { "@type": "Person", name: author },
    publisher: {
      "@type": "Organization",
      name: "NewsV Tamil",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
    description: excerpt,
  };

  return (
    <>
      <Head>
        <title>{title} | NewsV Tamil</title>
        <meta name="description" content={excerpt} />
        <link rel="canonical" href={canonical} />

        {/* ✅ Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="NewsV Tamil" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={excerpt} />
        <meta property="og:image" content={image} />
        <meta property="og:url" content={canonical} />

        {/* ✅ Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={excerpt} />
        <meta name="twitter:image" content={image} />

        {/* ✅ JSON-LD Schema */}
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Head>

      

      <main className="container mx-auto px-3 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* 📰 --- Article Section */}
        <article className="lg:col-span-2 bg-white p-4 rounded-md shadow-sm">
          <h1
            className="text-3xl font-bold mb-3 leading-tight"
            dangerouslySetInnerHTML={{ __html: title }}
          />
          <div className="text-sm text-gray-500 mb-4">
            <span>By {author}</span> •{" "}
            <time dateTime={published}>
              {new Date(published).toLocaleString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </time>{" "}
            (Updated{" "}
            {new Date(updated).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
            )
          </div>

          {image && (
            <img src={image} alt={title} className="w-full h-auto rounded mb-4" />
          )}

          <article
  itemScope
  itemType="https://schema.org/NewsArticle"
  className="max-w-none"
>
  <div
    itemProp="articleBody"
    className="prose prose-lg font-tamil text-gray-800 leading-relaxed text-justify"
    dangerouslySetInnerHTML={{ __html: content }}
  />
</article>

          {/* 🔹 Prev / Next navigation */}
          <div className="flex justify-between mt-10 border-t pt-4 text-sm font-semibold">
            {prev ? (
              <Link href={`/${prev.slug}/`} className="text-red-600 hover:underline">
                ← {prev.title.rendered.replace(/<[^>]+>/g, "")}
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link href={`/${next.slug}/`} className="text-red-600 hover:underline">
                {next.title.rendered.replace(/<[^>]+>/g, "")} →
              </Link>
            ) : (
              <span />
            )}
          </div>

          {/* 🔹 Related Posts */}
          {related?.length > 0 && (
            <div className="mt-10">
              <h3 className="text-lg font-bold mb-4 border-b pb-2">
                தொடர்புடைய செய்திகள்
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {related.map((r) => (
                  <Link
                    key={r.id}
                    href={`/${r.slug}/`}
                    className="flex gap-3 items-center hover:text-red-600"
                  >
                    <img
                      src={
                        r._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
                        "/placeholder-4x3.png"
                      }
                      alt={r.title.rendered}
                      className="w-24 h-16 object-cover rounded"
                    />
                    <span
                      className="text-sm font-medium leading-snug"
                      dangerouslySetInnerHTML={{ __html: r.title.rendered }}
                    />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>

        {/* 🧱 --- Sidebar */}
<aside className="lg:col-span-1 space-y-6 lg:sticky lg:top-24 self-start">
  {/* 🔹 Recent Posts */}
  <div className="bg-white border p-4 rounded-md shadow-sm">
    <h3 className="text-lg font-semibold mb-3 border-b pb-2">
      சமீபத்திய செய்திகள்
    </h3>
    <ul className="space-y-3">
      {recent?.map((p) => (
        <li key={p.id}>
          <Link
            href={`/${p.slug}/`}
            className="flex gap-3 hover:text-red-600"
          >
            <img
              src={
                p._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
                "/placeholder-4x3.png"
              }
              alt={p.title.rendered}
              className="w-16 h-12 object-cover rounded"
            />
            <span
              className="text-sm font-medium leading-tight"
              dangerouslySetInnerHTML={{ __html: p.title.rendered }}
            />
          </Link>
        </li>
      ))}
    </ul>
  </div>

  {/* 🔹 Ad / Widget */}
  <div className="bg-white border p-4 rounded-md text-center">
    <div className="text-gray-500 text-sm">ADVERTISEMENT</div>
    <div className="h-60 bg-gray-100 flex items-center justify-center mt-2 rounded">
      <span className="text-gray-400">300×250 Ad</span>
    </div>
  </div>
        </aside>
      </main>

      
    </>
  );
}
