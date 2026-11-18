import { Fragment, useState, type KeyboardEvent } from "react";
import { Link } from "react-router";
import MilestonePhoto from "./MilestonePhoto";
import type { TimelineItem } from "../types";
import { formatDate, yearOf } from "../lib/format";
import { milestonePhoto, personPath } from "../lib/data";

function Text({ m, linkPerson }: { m: TimelineItem; linkPerson: boolean }) {
  return (
    <>
      <p className="tl-text text-[15px] leading-snug">
        {m.personName &&
          (m.personId && linkPerson ? (
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
    </>
  );
}

function photoAlt(m: TimelineItem) {
  return `Ảnh cột mốc ${formatDate(m.date)}: ${m.personName ? `${m.personName} ` : ""}${m.action ? `${m.action} ` : ""}${m.highlight}`;
}

/**
 * Dòng thời gian dọc (cũ → mới).
 * - Bản đầy đủ (trang Giới thiệu): so le trái/phải trên máy tính, có vạch chia năm;
 *   rê chuột / focus một dòng → ảnh cột mốc hiện ở nửa trống bên kia đường kẻ;
 *   điện thoại chạm vào dòng để mở/đóng ảnh ngay dưới phần chữ.
 * - Bản "compact" (trang thí sinh): một cột, không tương tác.
 */
export default function Timeline({ items, compact = false }: { items: TimelineItem[]; compact?: boolean }) {
  const [active, setActive] = useState<number | null>(null);
  const [open, setOpen] = useState<number | null>(null);

  if (compact) {
    return (
      <ol className="timeline is-compact">
        {items.map((m, i) => (
          <li key={`${m.date}-${i}`} className="tl-item">
            <time dateTime={m.date} className="tl-date">
              {formatDate(m.date)}
            </time>
            <span className={`tl-dot${m.kind === "olympia" ? " is-olympia" : ""}`} aria-hidden />
            <div className="tl-body">
              <Text m={m} linkPerson={false} />
            </div>
          </li>
        ))}
      </ol>
    );
  }

  const toggle = (i: number) => setOpen((o) => (o === i ? null : i));
  const onKeyDown = (e: KeyboardEvent<HTMLLIElement>, i: number) => {
    if (e.target !== e.currentTarget) return; // phím Enter trên link tên thí sinh thì để link xử lý
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle(i);
    }
  };

  return (
    <ol className={`timeline mx-auto max-w-5xl${active !== null ? " has-active" : ""}`}>
      {items.map((m, i) => {
        const year = yearOf(m.date);
        const newYear = i === 0 || yearOf(items[i - 1].date) !== year;
        const side = i % 2 === 0 ? "tl-right" : "tl-left";
        return (
          <Fragment key={`${m.date}-${i}`}>
            {newYear && (
              <li className="tl-year">
                <span>{year}</span>
              </li>
            )}
            <li
              tabIndex={0}
              className={`tl-item is-interactive ${side}${active === i ? " is-active" : ""}${open === i ? " is-open" : ""}`}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive((a) => (a === i ? null : a))}
              onFocus={() => setActive(i)}
              onBlur={() => setActive((a) => (a === i ? null : a))}
              onClick={() => toggle(i)}
              onKeyDown={(e) => onKeyDown(e, i)}
            >
              <div className="tl-date">
                <span className="tl-anchor">
                  <time dateTime={m.date}>{formatDate(m.date)}</time>
                  {active === i && (
                    <span className="tl-photo" aria-hidden>
                      <MilestonePhoto src={milestonePhoto(m.date)} alt="" className="size-full" />
                    </span>
                  )}
                </span>
              </div>
              <span className={`tl-dot${m.kind === "olympia" ? " is-olympia" : ""}`} aria-hidden />
              <div className="tl-body">
                <Text m={m} linkPerson />
                {open === i && (
                  <div className="tl-photo-mobile">
                    <MilestonePhoto src={milestonePhoto(m.date)} alt={photoAlt(m)} className="size-full" />
                  </div>
                )}
              </div>
            </li>
          </Fragment>
        );
      })}
    </ol>
  );
}
