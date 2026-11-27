import { Link } from "react-router";
import Photo from "./Photo";
import StripLabel from "./StripLabel";
import { useChartTooltip } from "./ChartTooltip";
import { coverPhoto, seasonPath, seasons } from "../lib/data";
import { PLACEHOLDER_TONES } from "../lib/placeholder";

/** Dải ảnh bìa vuông nhỏ của các mùa (mùa 1 → mới nhất, tự xuống hàng); mùa mới nhất viền tím. Chưa có bìa: số mùa. */
export default function SeasonStrip() {
  const { bind, tooltip } = useChartTooltip();
  return (
    <>
      {/* Ô đủ rộng thì 10 ô một hàng, hẹp thì 5 ô một hàng (không để một ô rớt lẻ) */}
      <div className="@container mt-4">
        <StripLabel to="/wiki/cuoc-thi">Mùa giải</StripLabel>
        <ul className="relative z-10 grid w-fit grid-cols-5 gap-1.5 @min-[28.5rem]:grid-cols-10">
        {seasons.map(({ season }, i) => {
          const tone = PLACEHOLDER_TONES[(season - 1) % PLACEHOLDER_TONES.length];
          const latest = i === seasons.length - 1;
          return (
            <li key={season}>
              <Link to={seasonPath(season)} aria-label={`Mùa ${season}`} {...bind({ title: `Mùa ${season}`, lines: [] })} className="block rounded-lg">
                <Photo
                  src={coverPhoto(season)}
                  alt=""
                  decorative
                  className={`size-10 rounded-lg ${latest ? "ring-2 ring-oss ring-offset-2" : "ring-1 ring-oss/15"}`}
                  fallback={
                    <span className="font-display absolute inset-0 grid place-items-center text-base font-bold" style={{ backgroundColor: tone.bg, color: tone.ink }}>
                      {season}
                    </span>
                  }
                />
              </Link>
            </li>
          );
        })}
        </ul>
      </div>
      {tooltip}
    </>
  );
}
