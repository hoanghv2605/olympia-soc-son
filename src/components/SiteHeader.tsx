import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { PiListBold, PiMagnifyingGlass, PiXBold } from "react-icons/pi";
import Logo from "./Logo";
import { useSearch } from "../lib/searchContext";
import { NAV } from "../lib/nav";

const SCROLL_THRESHOLD = 24; // px: cuộn quá mức này thì header thu gọn
const HEADER_H = { normal: "4rem", compact: "3.25rem" }; // 64px → 52px

const navClass = ({ isActive }: { isActive: boolean }) => `nav-link${isActive ? " is-active" : ""}`;

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLElement>(null);
  const { open: openSearch } = useSearch();

  // Thu gọn khi cuộn
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Chiều cao header cho các phần dính bên dưới (thanh tab Về chúng tôi, menu điện thoại)
  useEffect(() => {
    document.documentElement.style.setProperty("--header-h", scrolled ? HEADER_H.compact : HEADER_H.normal);
  }, [scrolled]);

  // Đóng menu khi chuyển trang
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Khi menu mở: khóa cuộn trang nền, focus vào mục đầu, giữ Tab trong menu, Esc để đóng
  useEffect(() => {
    if (!open) return;
    const button = buttonRef.current;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    menuRef.current?.querySelector<HTMLElement>("a")?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      const items = [button, ...(menuRef.current?.querySelectorAll<HTMLElement>("a") ?? [])].filter(
        (el): el is HTMLElement => !!el,
      );
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (!active || !items.includes(active)) {
        e.preventDefault();
        first.focus();
      } else if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
      button?.focus(); // trả focus về nút menu khi đóng
    };
  }, [open]);

  return (
    <>
      <header
        className={[
          "site-header sticky top-0 z-40 border-b backdrop-blur-md",
          scrolled ? "is-scrolled" : "",
          scrolled || open ? "border-oss/10 bg-white/85" : "border-white/70 bg-white/60",
        ].join(" ")}
      >
        <div className="site-header-bar mx-auto flex max-w-6xl items-center justify-between gap-6 px-5">
          <Link to="/" className="flex items-center gap-3" aria-label="Olympia Sóc Sơn – Trang chủ">
            <Logo className="site-header-logo" />
            <span className="wordmark text-[15px]">Olympia Sóc Sơn</span>
          </Link>

          <nav aria-label="Điều hướng chính" className="hidden md:ml-auto md:block">
            <ul className="flex items-center gap-8">
              {NAV.map((item) => (
                <li key={item.to}>
                  <NavLink to={item.to} className={navClass}>
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-1 md:-mr-2">
            <button
              type="button"
              data-search-button
              aria-label="Tìm kiếm"
              aria-haspopup="dialog"
              onClick={(e) => {
                setOpen(false);
                openSearch(e.currentTarget);
              }}
              className="grid size-11 place-items-center rounded-full text-oss hover:bg-oss-soft"
            >
              <PiMagnifyingGlass className="size-5" aria-hidden />
            </button>
            <button
              ref={buttonRef}
              type="button"
              className="grid size-11 place-items-center rounded-full text-oss hover:bg-oss-soft md:hidden"
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? "Đóng menu" : "Mở menu"}
              onClick={() => setOpen((o) => !o)}
            >
              {open ? <PiXBold className="size-5" /> : <PiListBold className="size-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Đặt ngoài <header>: backdrop-filter của header sẽ "nhốt" phần tử fixed bên trong */}
      {open && (
        <nav
          id="mobile-nav"
          ref={menuRef}
          aria-label="Điều hướng chính"
          className="mobile-nav fixed inset-x-0 bottom-0 z-40 overflow-y-auto border-t border-oss/10 bg-mist md:hidden"
        >
          <ul className="mx-auto flex max-w-6xl flex-col px-5 py-4">
            {NAV.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `flex min-h-12 items-center border-l-4 py-2 pl-4 text-xl font-semibold ${
                      isActive ? "border-oss text-oss" : "border-transparent text-ink hover:text-oss"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </>
  );
}
