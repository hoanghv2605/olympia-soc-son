import { Fragment, useMemo, useState, type MouseEvent } from "react";
import { Link } from "react-router";
import { PiCamera } from "react-icons/pi";
import Lightbox from "./Lightbox";
import MilestonePhoto from "./MilestonePhoto";
import type { TimelineItem } from "../types";
import { asset, formatDate, sentenceParts, sentenceText, yearOf } from "../lib/format";
import { hasImage } from "../lib/images";
import { eventPath, milestonePhoto, personPath } from "../lib/data";

const dotClass = (m: TimelineItem) => `tl-dot${m.kind === "olympia" ? " is-olympia" : m.kind === "event" ? " is-event" : ""}`;

function Text({ m, linkPerson }: { m: TimelineItem; linkPerson: boolean }) {
  const { lead } = sentenceParts(m.personName, m.action, m.highlight);
  return (
    <>
      <p className="tl-text text-[15px] leading-snug">
        {m.personName &&
          (m.personId && linkPerson ? (
            <Link
              to={personPath(m.personId)}
              data-person-preview={m.personId}
              className="font-semibold text-ink hover:text-oss hover:underline"
            >
              {m.personName}
            </Link>
          ) : (
            <strong className="font-semibold text-ink">{m.personName}</strong>
          ))}
        {lead}
        <strong className="font-semibold text-oss">{m.highlight}</strong>
      </p>
      {m.detail &&
        (m.eventId ? (
          // Dòng sự kiện (chỉ ở hồ sơ thí sinh): dòng phụ là tên sự kiện (link)
          <p className="mt-0.5 text-sm">
            <Link to={eventPath(m.eventId)} className="text-ink-soft hover:text-oss hover:underline">
              {m.detail}
            </Link>
          </p>
        ) : (
          <p className="mt-0.5 text-sm text-ink-soft">{m.detail}</p>
        ))}
      {m.note && <p className="mt-1 text-sm font-semibold text-cube-pink">{m.note}</p>}
    </>
  );
}

function photoAlt(m: TimelineItem) {
  return `Ảnh cột mốc ${formatDate(m.date)}: ${sentenceText(m.personName, m.action, m.highlight)}`;
}

function photoCaption(m: TimelineItem) {
  return `${formatDate(m.date)} · ${sentenceText(m.personName, m.action, m.highlight)}`;
}

const CAN_HOVER = "(hover: hover) and (pointer: fine)";

/**
 * Dòng thời gian dọc (cũ → mới).
 * - Bản đầy đủ (trang Giới thiệu): so le trái/phải trên máy tính, có vạch chia năm. CHỈ cột mốc có ảnh thật
 *   mới có tương tác: nút máy ảnh cạnh ngày, rê chuột (thiết bị có chuột) hiện ảnh xem trước ở phía cột ngày,
 *   bấm nút / ảnh xem trước / vùng trống của dòng mở hộp xem ảnh lớn (`Lightbox`) gồm mọi ảnh cột mốc.
 * - Bản "compact" (trang thí sinh): một cột, không tương tác.
 */
export default function Timeline({ items, compact = false }: { items: TimelineItem[]; compact?: boolean }) {
  const [active, setActive] = useState<number | null>(null);
  const [zoom, setZoom] = useState<number | null>(null);

  // Ảnh cột mốc có thật, theo thứ tự thời gian (items đã sắp cũ → mới)
  const gallery = useMemo(() => {
    const index = new Map<number, number>();
    const images: { src: string; alt: string; caption: string }[] = [];
    items.forEach((m, i) => {
      const src = milestonePhoto(m.date);
      if (!hasImage(src)) return;
      index.set(i, images.length);
      images.push({ src: asset(src), alt: photoAlt(m), caption: photoCaption(m) });
    });
    return { index, images };
  }, [items]);

  if (compact) {
    return (
      <ol className="timeline is-compact">
        {items.map((m, i) => (
          <li key={`${m.date}-${i}`} className="tl-item">
            <time dateTime={m.date} className="tl-date">
              {formatDate(m.date)}
            </time>
            <span className={dotClass(m)} aria-hidden />
            <div className="tl-body">
              <Text m={m} linkPerson={false} />
            </div>
          </li>
        ))}
      </ol>
    );
  }

  const canHover = typeof window !== "undefined" && window.matchMedia(CAN_HOVER).matches;
  const open = (i: number) => {
    const g = gallery.index.get(i);
    if (g !== undefined) setZoom(g);
  };
  // Bấm vùng trống của dòng (không phải link tên hay nút) mở hộp xem ảnh
  const onRowClick = (e: MouseEvent<HTMLLIElement>, i: number) => {
    const t = e.target as HTMLElement;
    if (t.closest("a, button")) return;
    open(i);
  };

  return (
    <>
      <ol className={`timeline mx-auto max-w-5xl${active !== null ? " has-active" : ""}`}>
        {items.map((m, i) => {
          const year = yearOf(m.date);
          const newYear = i === 0 || yearOf(items[i - 1].date) !== year;
          const side = i % 2 === 0 ? "tl-right" : "tl-left";
          const photo = gallery.index.has(i);
          return (
            <Fragment key={`${m.date}-${i}`}>
              {newYear && (
                <li className="tl-year">
                  <span>{year}</span>
                </li>
              )}
              <li
                className={`tl-item ${side}${photo ? " is-interactive" : ""}${photo && active === i ? " is-active" : ""}`}
                onMouseEnter={photo ? () => setActive(i) : undefined}
                onMouseLeave={photo ? () => setActive((a) => (a === i ? null : a)) : undefined}
                onFocus={photo ? () => setActive(i) : undefined}
                onBlur={photo ? () => setActive((a) => (a === i ? null : a)) : undefined}
                onClick={photo ? (e) => onRowClick(e, i) : undefined}
              >
                <div className="tl-date">
                  <time dateTime={m.date}>{formatDate(m.date)}</time>
                  {photo && (
                    <button
                      type="button"
                      onClick={() => open(i)}
                      aria-label={`Xem ảnh cột mốc ${formatDate(m.date)}`}
                      className="tl-camera"
                    >
                      <PiCamera className="size-4" aria-hidden />
                    </button>
                  )}
                </div>
                <span className={dotClass(m)} aria-hidden />
                <div className="tl-body">
                  <Text m={m} linkPerson />
                </div>
                {photo && canHover && active === i && (
                  <span className="tl-photo" aria-hidden onClick={() => open(i)}>
                    <MilestonePhoto src={milestonePhoto(m.date)} alt="" className="size-full" />
                  </span>
                )}
              </li>
            </Fragment>
          );
        })}
      </ol>
      <Lightbox open={zoom !== null} onClose={() => setZoom(null)} images={gallery.images} start={zoom ?? 0} />
    </>
  );
}
