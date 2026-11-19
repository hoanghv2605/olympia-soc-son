import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
import BackToTop from "./BackToTop";
import PersonPreview from "./PersonPreview";
import SearchProvider from "./SearchProvider";

export default function SiteLayout() {
  const { pathname } = useLocation();

  // Chuyển trang thì cuộn lên đầu
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <SearchProvider>
      <div className="flex min-h-dvh flex-col">
        <a
          href="#main"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById("main")?.focus();
          }}
          className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-3 focus-visible:left-3 focus-visible:z-50 focus-visible:rounded-full focus-visible:bg-white focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:font-semibold focus-visible:text-oss"
        >
          Bỏ qua menu
        </a>
        <SiteHeader />
        <main id="main" tabIndex={-1} className="flex-1 outline-none">
          <Outlet />
        </main>
        <SiteFooter />
        <BackToTop />
      </div>
      <PersonPreview />
    </SearchProvider>
  );
}
