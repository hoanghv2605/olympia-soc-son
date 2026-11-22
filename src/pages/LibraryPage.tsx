import { Link } from "react-router";
import PageHeader from "../components/PageHeader";
import SeasonCover from "../components/SeasonCover";
import EventCover from "../components/EventCover";
import { eventLibraryPath, eventPhotos, eventShortName, eventTimeLabel, events, libraryPath, libraryPhotos, seasons, site } from "../lib/data";
import type { ReactNode } from "react";
import { formatSchoolYear } from "../lib/format";
import type { SiteEvent } from "../types";
import { usePageTitle } from "../lib/hooks";

/** Ô thư viện: có ảnh thì là link; chưa có ảnh thì mờ, "Chưa có ảnh", không phải link. */
function Tile({ to, has, children }: { to: string; has: boolean; children: ReactNode }) {
  const base = "block overflow-hidden rounded-2xl border border-oss/15 bg-white/80";
  if (!has) return <div className={`${base} opacity-55`}>{children}</div>;
  return (
    <Link
      to={to}
      className={`${base} transition duration-200 hover:-translate-y-0.5 hover:border-oss focus-visible:-translate-y-0.5 focus-visible:border-oss motion-reduce:transition-none motion-reduce:hover:translate-y-0`}
    >
      {children}
    </Link>
  );
}

function Cover({ n, schoolYear }: { n: number; schoolYear: string }) {
  const photos = libraryPhotos(n);
  const has = photos.length > 0;
  return (
    <Tile to={libraryPath(n)} has={has}>
      <SeasonCover season={n} src={photos[0]?.src} />
      <span className="block p-3">
        <span className="block text-base font-bold text-ink">Mùa {n}</span>
        <span className="block text-[0.8rem] text-ink-soft tabular-nums">
          {formatSchoolYear(schoolYear)} · {has ? `${photos.length} ảnh` : "Chưa có ảnh"}
        </span>
      </span>
    </Tile>
  );
}

function EventTile({ event }: { event: SiteEvent }) {
  const photos = eventPhotos(event.id);
  const has = photos.length > 0;
  return (
    <Tile to={eventLibraryPath(event.id)} has={has}>
      <EventCover type={event.type} index={event.stt} src={photos[0]?.src} />
      <span className="block p-3">
        <span className="block min-h-[2lh] text-base leading-snug font-bold text-ink">{eventShortName(event)}</span>
        <span className="block text-[0.8rem] text-ink-soft tabular-nums">
          {eventTimeLabel(event)} · {has ? `${photos.length} ảnh` : "Chưa có ảnh"}
        </span>
      </span>
    </Tile>
  );
}

export default function LibraryPage() {
  usePageTitle("Thư viện · Olympia Sóc Sơn");
  return (
    <>
      <PageHeader title="Thư viện" description="Ảnh và tư liệu qua các mùa Olympia Sóc Sơn và các sự kiện khác." />
      <section className="mx-auto max-w-6xl px-5 pb-12 md:pb-16">
        <h2 className="h2 text-ink">Các mùa Olympia Sóc Sơn</h2>
        <ul className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-5">
          {seasons.map((s) => (
            <li key={s.season}>
              <Cover n={s.season} schoolYear={s.schoolYear} />
            </li>
          ))}
        </ul>
        <h2 className="h2 mt-12 text-ink md:mt-16">Các sự kiện khác</h2>
        <ul className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-5">
          {events.map((e) => (
            <li key={e.id}>
              <EventTile event={e} />
            </li>
          ))}
        </ul>
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-oss/15 bg-white/60 px-6 py-5">
          <p className="text-ink">Xem thêm ảnh và video trên fanpage Olympia Sóc Sơn</p>
          <a href={site.facebook} target="_blank" rel="noreferrer" className="btn-primary">
            Mở fanpage Olympia Sóc Sơn
          </a>
        </div>
      </section>
    </>
  );
}
