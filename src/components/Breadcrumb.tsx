import { Fragment } from "react";
import { Link } from "react-router";

interface Crumb {
  to?: string;
  label: string;
}

export default function Breadcrumb({ items, tone = "light" }: { items: Crumb[]; tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  return (
    <nav aria-label="Vị trí trang" className={`text-sm ${dark ? "text-white/70" : "text-ink-soft"}`}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((c, i) => (
          <Fragment key={c.label}>
            {i > 0 && (
              <li aria-hidden className={dark ? "text-white/40" : "text-oss/40"}>
                /
              </li>
            )}
            <li>
              {c.to ? (
                <Link to={c.to} className={dark ? "hover:text-white hover:underline" : "hover:text-oss hover:underline"}>
                  {c.label}
                </Link>
              ) : (
                <span aria-current="page" className={dark ? "text-white" : "text-ink"}>
                  {c.label}
                </span>
              )}
            </li>
          </Fragment>
        ))}
      </ol>
    </nav>
  );
}
