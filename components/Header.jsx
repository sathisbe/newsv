import { useEffect, useState } from "react";
import Link from "next/link";

export default function Header() {
  const [mainMenu, setMainMenu] = useState([]);
  const [today, setToday] = useState("");

  useEffect(() => {
    // 🗓️ Set Tamil date
    const date = new Date().toLocaleDateString("ta-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    setToday(date);

    // 🧭 Fetch Primary Menu (menu-1)
    fetch(
      `${process.env.NEXT_PUBLIC_WORDPRESS_API?.replace(
        "/wp/v2",
        ""
      )}/wp-menus/v1/menus/menu-1`
    )
      .then((res) => res.json())
      .then(setMainMenu)
      .catch(console.error);
  }, []);

  // 🧹 Helper: convert backend URLs → frontend URLs
  const fixUrl = (url) => {
    if (!url) return "/";
    return (
      url
        // remove backend domain (works for both staging & prod)
        .replace("https://newsvtamil.wpcomstaging.com", "")
        .replace("https://newsvtamil.com", "")
        // remove trailing slash for safety
        .replace(/\/$/, "") || "/"
    );
  };

  return (
    <header id="masthead" className="site-header bg-white border-b">
      {/* 🔝 Top bar */}
      <div className="top-bar bg-gray-100 border-b text-sm py-2">
        <div className="container mx-auto flex justify-between items-center px-3">
          <div className="text-gray-600 flex items-center gap-2">
            <i className="far fa-calendar-alt"></i>
            <span>{today}</span>
          </div>
          <div className="text-gray-400">{/* Social icons placeholder */}</div>
        </div>
      </div>

      {/* 🏠 Logo + Navigation */}
      <div id="sticky-header" className="sticky top-0 bg-white z-50 shadow-sm">
        <div className="container mx-auto flex items-center justify-between px-3 py-2">
          <Link href="/" className="flex items-center">
            <img
              src="https://i0.wp.com/newsvtamil.com/wp-content/uploads/2021/03/logo-3.png"
              alt="NewsV Tamil"
              className="h-12 w-auto"
            />
          </Link>

          {/* 🧭 Desktop Menu */}
          <nav
            className="hidden md:flex items-center gap-6 text-[15px] font-medium"
            aria-label="Main Menu"
          >
            {mainMenu.map((item) => (
              <Link
                key={item.id}
                href={fixUrl(item.url)}
                className="hover:text-red-600 transition-colors"
              >
                <span dangerouslySetInnerHTML={{ __html: item.title }} />
              </Link>
            ))}
          </nav>

          {/* 🔍 Optional search icon */}
          <button
            className="hidden md:inline-block text-gray-600 hover:text-black"
            aria-label="Search"
          >
            <i className="fa fa-search"></i>
          </button>
        </div>

        {/* 📱 Mobile Scrollable Menu */}
        <div className="md:hidden overflow-x-auto border-t border-gray-200">
          <div className="flex whitespace-nowrap px-2 py-2 gap-3 scroll-smooth no-scrollbar">
            {mainMenu.map((item) => (
              <Link
                key={item.id}
                href={fixUrl(item.url)}
                className="px-3 py-1 text-[14px] font-medium text-gray-800 bg-gray-50 rounded-lg hover:bg-red-100 shrink-0"
              >
                <span dangerouslySetInnerHTML={{ __html: item.title }} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
