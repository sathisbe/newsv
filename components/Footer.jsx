export default function Footer({ footerMenu = [] }) {
  // 🧭 Convert WordPress URL → Next.js frontend URL (/page/{slug})
  const fixUrl = (url) => {
    if (!url) return "#";

    // Remove backend domains
    let cleaned = url
      .replace("https://newsvtamil.wpcomstaging.com", "")
      .replace("https://newsvtamil.com", "")
      .replace(/\/$/, ""); // remove trailing slash

    // Convert internal links → /page/{slug}
    if (cleaned && !cleaned.startsWith("http") && cleaned !== "") {
      // remove leading slash
      cleaned = cleaned.startsWith("/") ? cleaned.slice(1) : cleaned;
      return `/page/${cleaned}`;
    }

    // Return external URLs unchanged
    return url;
  };

  return (
    <footer className="mt-8 py-6 text-sm text-gray-700 text-center border-t bg-white">
      {/* 🔹 Footer Menu Links */}
      <nav className="flex flex-wrap justify-center gap-x-4 gap-y-2 mb-3">
        {footerMenu.length > 0 ? (
          footerMenu.map((item) => (
            <a
              key={item.id || item.title}
              href={fixUrl(item.url)}
              className="hover:text-red-600 transition-colors"
              dangerouslySetInnerHTML={{ __html: item.title }}
            />
          ))
        ) : (
          <p className="text-gray-400">Loading menu...</p>
        )}
      </nav>

      {/* 🔹 Copyright */}
      <p className="text-gray-500">
        © {new Date().getFullYear()} News V Tamil. All rights reserved.
      </p>
    </footer>
  );
}
