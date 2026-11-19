import { Link } from "react-router";
import ClimbChart from "./ClimbChart";
import PersonLink from "./PersonLink";
import PersonPhoto from "./PersonPhoto";
import { PLACEMENT_LABEL, finalOf, latestFinalSeason, personPath, personPhoto, podium, seasonPath } from "../lib/data";
import { formatDate, formatScore } from "../lib/format";

/**
 * Trang chủ: trận Chung kết của mùa gần nhất (mùa lớn nhất có Chung kết, tự tính).
 * Trái: thẻ Quán quân + những người còn lại (theo danh hiệu rồi điểm); phải: biểu đồ diễn biến điểm.
 */
export default function LatestSeason() {
  const season = latestFinalSeason();
  const final = season && finalOf(season.season);
  if (!season || !final) return null;
  const n = season.season;
  const { champions, runnersUp, thirds } = podium(n); // mỗi nhóm đã sắp theo hạng rồi điểm
  const others = [...champions.slice(1), ...runnersUp, ...thirds];
  const champ = champions[0];

  return (
    <div>
      <h2 className="section-title">Chung kết mùa {n}</h2>
      <p className="mt-1 text-ink-soft">Ngày {formatDate(season.finalDate)}</p>

      <div className="mt-8 grid items-center gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <div>
          {champ && (
            <Link
              to={personPath(champ.person.id)}
              className="group flex items-center gap-5 rounded-2xl border border-gold/50 bg-white/80 p-4 hover:border-gold"
            >
              <PersonPhoto
                src={personPhoto(champ.person.id, { season: n })}
                seed={champ.person.id}
                name={champ.person.name}
                className="aspect-[3/4] w-[120px] shrink-0 rounded-xl"
              />
              <span>
                <span className="font-display block text-xl font-bold text-ink group-hover:text-oss">
                  {champ.person.name}
                </span>
                <span className="mt-1 block font-semibold text-gold-ink">
                  Quán quân · {formatScore(champ.result.total)} điểm
                </span>
              </span>
            </Link>
          )}

          <ul className="mt-4 divide-y divide-oss/10 border-y border-oss/10">
            {others.map((o) => (
              <li key={o.person.id} className="flex items-center justify-between gap-4 px-1 py-2.5">
                <span className="min-w-0">
                  <PersonLink id={o.person.id} className="font-semibold" />
                  <span className="block text-sm text-ink-soft">
                    {o.result.placement ? PLACEMENT_LABEL[o.result.placement] : ""}
                  </span>
                </span>
                <span className="font-bold text-ink tabular-nums">{formatScore(o.result.total)}</span>
              </li>
            ))}
          </ul>
        </div>

        <ClimbChart match={final} compact />
      </div>

      <Link to={seasonPath(n)} className="link-strong mt-8 inline-block text-sm">
        Xem toàn bộ mùa {n}
      </Link>
    </div>
  );
}
