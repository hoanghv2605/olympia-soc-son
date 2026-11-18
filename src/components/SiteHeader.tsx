import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { PiListBold, PiXBold } from "react-icons/pi";
import Logo from "./Logo";

const NAV = [
  { to: "/ve-chung-toi", label: "Về chúng tôi" },
  { to: "/wiki", label: "OSSPEDIA" },
  { to: "/bang-vang", label: "Bảng vàng" },
  { to: "/human-of-oss", label: "Human of OSS" },
  { to: "/thu-vien", label: "Thư viện" },
];

const navClass = ({ isActive }: { isActive: boolean }) => `nav-link${isActive ? " is-active" : ""}`;

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-white/70 bg-white/60 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-5">
        <Link to="/" className="flex items-center gap-3" aria-label="Olympia Sóc Sơn – Trang chủ">
          <Logo className="size-8" />
          <span className="wordmark text-[15px]">Olympia Sóc Sơn</span>
        </Link>

        <nav aria-label="Điều hướng chính" className="hidden md:block">
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

        <button
          type="button"
          className="grid size-10 place-items-center rounded-full text-oss hover:bg-oss-soft md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Đóng menu" : "Mở menu"}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <PiXBold className="size-5" /> : <PiListBold className="size-5" />}
        </button>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Điều hướng chính" className="border-t border-oss/10 md:hidden">
          <ul className="mx-auto flex max-w-6xl flex-col px-5 py-2">
            {NAV.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} className={navClass}>
                  <span className="block py-2">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
