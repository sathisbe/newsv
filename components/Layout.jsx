// components/Layout.jsx
import { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout({ children }) {
  const [menus, setMenus] = useState({
    mainMenu: [],
    topMenu: [],
    footerMenu: [],
  });

  useEffect(() => {
    async function fetchMenus() {
      try {
        const [mainRes, topRes, footerRes] = await Promise.all([
          fetch("https://newsvtamil.wpcomstaging.com/wp-json/wp-menus/v1/menus/menu-1"),
          fetch("https://newsvtamil.wpcomstaging.com/wp-json/wp-menus/v1/menus/menu-2"),
          fetch("https://newsvtamil.wpcomstaging.com/wp-json/wp-menus/v1/menus/menu-3"),
        ]);

        const [mainMenu, topMenu, footerMenu] = await Promise.all([
          mainRes.json(),
          topRes.json(),
          footerRes.json(),
        ]);

        setMenus({ mainMenu, topMenu, footerMenu });
      } catch (err) {
        console.error("Menu fetch failed:", err);
      }
    }
    fetchMenus();
  }, []);

  return (
    <>
      <Header mainMenu={menus.mainMenu} topMenu={menus.topMenu} />
      <main>{children}</main>
      <Footer footerMenu={menus.footerMenu} />
    </>
  );
}
