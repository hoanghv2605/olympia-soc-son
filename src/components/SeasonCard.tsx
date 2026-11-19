import type { ReactNode } from "react";
import { Link } from "react-router";
import CubeOutline from "./CubeOutline";
import Photo from "./Photo";
import { finalOf, matchPhoto, podium, seasonPath } from "../lib/data";
import { formatDate, formatScore } from "../lib/format";
import { MEDAL_DOT, type Medal } from "../lib/medal";
import { PLACEHOLDER_TONES } from "../lib/placeholder";
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
  const photo = final ? matchPhoto(final.id) : undefined;
  const tone = PLACEHOLDER_TONES[(n - 1) % PLACEHOLDER_TONES.length];
  const names = (list: typeof champions) => list.map((c) => c.person.name).join(", ");

  return (
    <article className="group relative flex w-full flex-col overflow-hidden rounded-2xl border border-oss/15 bg-white/80 transition duration-200 hover:-translate-y-0.5 hover:border-oss focus-within:-translate-y-0.5 focus-within:border-oss">
      <div className="relative aspect-[3/2]">
        <Photo
          src={photo}
          alt=""
          className="size-full"
          fallback={
            <span
              aria-hidden
              className="absolute inset-0 overflow-hidden"
              style={{ backgroundColor: tone.bg, color: tone.ink, containerType: "size" }}
            >
              <CubeOutline color={tone.ink} className="absolute -right-[22%] -bottom-[18%] w-[78%]" />
              <span className="font-display absolute inset-0 grid place-items-center text-[clamp(4rem,52cqmin,9rem)] leading-none font-bold">
                {n}
              </span>
            </span>
          }
        />
        <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-oss shadow-sm">Mùa {n}</span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <ul className="space-y-2 text-[15px] text-ink">
          <Row
            medal="gold"
            aside={<span className="text-sm text-ink-soft tabular-nums">{formatScore(champions[0]?.result.total)}</span>}
          >
            <span className="font-semibold">{champions.length ? names(champions) : "Đang cập nhật"}</span>
          </Row>
          {runnersUp.length > 0 && <Row medal="silver">{names(runnersUp)}</Row>}
          {thirds.length > 0 && <Row medal="bronze">{names(thirds)}</Row>}
        </ul>
        <p className="mt-auto pt-4 text-xs text-ink-soft tabular-nums">
          {season.schoolYear} · Chung kết {formatDate(season.finalDate)}
        </p>
      </div>
      <Link to={seasonPath(n)} aria-label={`Olympia Sóc Sơn mùa ${n}`} className="absolute inset-0 z-10 rounded-2xl" />
    </article>
  );
}
