import Head from 'next/head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import PostCard from '../../components/PostCard';

export async function getServerSideProps({ params }) {
  const API = process.env.NEXT_PUBLIC_WORDPRESS_API || 'https://newsvtamil.com/wp-json/wp/v2';

  // 🔹 Fetch category by slug
  const catRes = await fetch(`${API}/categories?slug=${params.slug}`);
  const cats = await catRes.json();
  const cat = cats && cats[0];
  if (!cat) return { notFound: true };

  // 🔹 Fetch posts in this category
  const res = await fetch(`${API}/posts?categories=${cat.id}&per_page=12&_embed`);
  const posts = await res.json();

  // 🔹 Fetch recent posts for sidebar
  const recentRes = await fetch(`${API}/posts?per_page=5&_embed`);
  const recent = await recentRes.json();

  return { props: { posts, cat, recent } };
}

export default function Category({ posts, cat, recent }) {
  return (
    <>
      <Head>
        <title>{cat?.name} — NewsV Tamil</title>
        <meta name="description" content={`${cat?.name} செய்திகள் - சமீபத்திய செய்திகள், புதுப்பிப்புகள் மற்றும் சிறப்பு கட்டுரைகள்.`} />
        <link rel="canonical" href={`https://newsvtamil.com/category/${cat?.slug}/`} />
      </Head>


      <main className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 🔹 Category posts */}
        <section className="lg:col-span-8 space-y-6">
          <h2 className="text-2xl font-bold border-b pb-3 text-gray-800">
            {cat?.name}
          </h2>

          {posts.length > 0 ? (
            <div className="grid sm:grid-cols-2 gap-6">
              {posts.map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No posts found in this category.</p>
          )}
        </section>

        {/* 🔹 Sidebar */}
        <aside className="lg:col-span-4 space-y-6">
          {/* Recent News */}
          <div className="bg-white border rounded-md p-4 shadow-sm">
            <h3 className="text-lg font-semibold mb-3 border-b pb-2 text-gray-800">
              சமீபத்திய செய்திகள்
            </h3>
            <ul className="space-y-3">
              {recent.map((r) => (
                <li key={r.id}>
                  <a
                    href={`/${r.slug}/`}
                    className="flex gap-3 items-center hover:text-red-600"
                  >
                    <img
                      src={
                        r._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
                        '/placeholder-4x3.png'
                      }
                      alt={r.title.rendered}
                      className="w-16 h-12 object-cover rounded"
                    />
                    <span
                      className="text-sm font-medium leading-tight"
                      dangerouslySetInnerHTML={{ __html: r.title.rendered }}
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Ad Section */}
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
