import { NavLink, Outlet } from "react-router";
import PageHeader from "../../components/PageHeader";

const TABS = [
  { to: "/ve-chung-toi", label: "Giới thiệu", end: true },
  { to: "/ve-chung-toi/co-cau-to-chuc", label: "Cơ cấu tổ chức" },
];

export default function AboutLayout() {
  return (
    <>
      <div className="sticky top-[var(--header-h,4rem)] z-30 border-b border-white/70 bg-white/45 backdrop-blur-md">
        <nav aria-label="Về chúng tôi" className="mx-auto max-w-6xl overflow-x-auto px-5">
          <ul className="flex h-12 items-center justify-end gap-5 whitespace-nowrap md:gap-7">
            {TABS.map((t) => (
              <li key={t.to}>
                <NavLink end={t.end} to={t.to} className={({ isActive }) => `nav-link${isActive ? " is-active" : ""}`}>
                  {t.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <PageHeader
        title="Về chúng tôi"
        description="Câu chuyện, chặng đường và bộ máy tổ chức của Olympia Sóc Sơn."
      />
      <Outlet />
    </>
  );
}
