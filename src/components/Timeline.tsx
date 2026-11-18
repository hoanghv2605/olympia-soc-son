import { Link } from "react-router";
import type { TimelineItem } from "../types";
import { formatDate } from "../lib/format";
import { personPath } from "../lib/data";

/** Dòng thời gian dọc: máy tính so le trái/phải như Canva, điện thoại thành một cột. */
export default function Timeline({ items, compact = false }: { items: TimelineItem[]; compact?: boolean }) {
  return (
    <ol className={compact ? "timeline is-compact" : "timeline mx-auto max-w-5xl"}>
      {items.map((m, i) => (
        <li key={`${m.date}-${i}`} className={`tl-item ${i % 2 === 0 ? "tl-right" : "tl-left"}`}>
          <time dateTime={m.date} className="tl-date">
            {formatDate(m.date)}
          </time>
          <span className={`tl-dot${m.kind === "olympia" ? " is-olympia" : ""}`} aria-hidden />
          <div className="tl-body">
            <p className="text-[15px] leading-snug">
              {m.personName &&
                (m.personId && !compact ? (
                  <Link to={personPath(m.personId)} className="font-semibold text-ink hover:text-oss hover:underline">
                    {m.personName}
                  </Link>
                ) : (
                  <strong className="font-semibold text-ink">{m.personName}</strong>
                ))}
              {m.action && ` ${m.action} `}
              <strong className="font-semibold text-oss">{m.highlight}</strong>
            </p>
            {m.detail && <p className="mt-0.5 text-sm text-ink-soft">{m.detail}</p>}
            {m.note && <p className="mt-1 text-sm font-semibold text-cube-pink">{m.note}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}
