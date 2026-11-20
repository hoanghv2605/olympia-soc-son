import type { ReactNode } from "react";
import { Link } from "react-router";
import SeasonCover from "./SeasonCover";
import PersonPhoto from "./PersonPhoto";
import { coverPhoto, finalOf, libraryCount, matchPhoto, personPhoto, libraryPath, podium, seasonPath } from "../lib/data";
import { formatDate, formatScore } from "../lib/format";
import { MEDAL_DOT, type Medal } from "../lib/medal";
import type { Season } from "../types";

function Row({ medal, children, aside }: { medal: Medal; children: ReactNode; aside?: ReactNode }) {
  return (
    <li className="flex items-baseline gap-2.5">
      <span aria-hidden className={`mt-1.5 size-2.5 shrink-0 self-start rounded-full ${MEDAL_DOT[medal]}`} />
      <span className="min-w-0 flex-1">{children}</span>
      {aside}
    </li>
  );
}

/** Thẻ một mùa ở trang Các mùa giải: cả thẻ là 1 link (tên người là chữ thường, không lồng link). */
export default function SeasonCard({ season }: { season: Season }) {
  const n = season.season;
  const { champions, runnersUp, thirds } = podium(n);
  const final = finalOf(n);
  const photos = libraryCount(n);
  const photo = coverPhoto(n) ?? (final ? matchPhoto(final.id) : undefined);
  const champPhoto = champions[0] ? personPhoto(champions[0].person.id, { season: n }) : undefined;
  const names = (list: typeof champions) => list.map((c) => c.person.name).join(", ");

  return (
    <article className="group relative flex w-full flex-col overflow-hidden rounded-2xl border border-oss/15 bg-white/80 transition duration-200 hover:-translate-y-0.5 hover:border-oss focus-within:-translate-y-0.5 focus-within:border-oss">
      <div className="relative">
        <SeasonCover season={n} src={photo} />
        <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-oss shadow-sm">Mùa {n}</span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <ul className="space-y-2 text-[15px] text-ink">
          <Row
            medal="gold"
            aside={<span className="text-sm text-ink-soft tabular-nums">{formatScore(champions[0]?.result.total)}</span>}
          >
            <span className="flex items-center gap-2 font-semibold">
              {champPhoto && champions[0] && (
                <PersonPhoto
                  src={champPhoto}
                  seed={champions[0].person.id}
                  name={champions[0].person.name}
                  className="size-7 shrink-0 rounded-full"
                />
              )}
              {champions.length ? names(champions) : "Đang cập nhật"}
            </span>
          </Row>
          {runnersUp.length > 0 && <Row medal="silver">{names(runnersUp)}</Row>}
          {thirds.length > 0 && <Row medal="bronze">{names(thirds)}</Row>}
        </ul>
        <p className="mt-auto pt-4 text-xs text-ink-soft tabular-nums">
          {season.schoolYear} · Chung kết {formatDate(season.finalDate)}
        </p>
        {photos > 0 && (
          // Link phủ cả thẻ nằm sau (z-10); link thư viện đặt cao hơn (z-20) và là phần tử riêng, không lồng link trong link
          <Link to={libraryPath(n)} className="link-strong relative z-20 mt-2 inline-block self-start text-sm">
            Thư viện ảnh ({photos})
          </Link>
        )}
      </div>
      <Link to={seasonPath(n)} aria-label={`Olympia Sóc Sơn mùa ${n}`} className="absolute inset-0 z-10 rounded-2xl" />
    </article>
  );
}
