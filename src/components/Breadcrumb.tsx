import { Fragment } from "react";
import { Link } from "react-router";

interface Crumb {
  to?: string;
  label: string;
}

export default function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Vị trí trang" className="text-sm text-ink-soft">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((c, i) => (
          <Fragment key={c.label}>
            {i > 0 && (
              <li aria-hidden className="text-oss/40">
                /
              </li>
            )}
            <li>
              {c.to ? (
                <Link to={c.to} className="hover:text-oss hover:underline">
                  {c.label}
                </Link>
              ) : (
                <span aria-current="page" className="text-ink">
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
