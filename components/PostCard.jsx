import Link from "next/link";

export default function PostCard({ post }) {
  const image =
    post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
    "/placeholder-4x3.png";

  return (
    <div className="bg-white rounded-md shadow-sm hover:shadow-md transition">
      <Link href={`/${post.slug}/`}>
        <img src={image} alt={post.title.rendered} className="rounded-t-md" />
      </Link>
      <div className="p-3">
        <Link href={`/${post.slug}/`}>
          <h2
            className="text-lg font-semibold leading-snug hover:text-red-600"
            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
          />
        </Link>
      </div>
    </div>
  );
}
