import RatioBar from "./RatioBar";
import SeasonColumnChart from "./SeasonColumnChart";
import { genderFunnel, registrationOverview } from "../lib/data";
import { ratioSegments } from "../lib/ratio";

/** Mục "Toàn cảnh {n} mùa" ở trang Các mùa giải: số đăng kí qua các mùa và phễu Nam / Nữ. */
export default function RegistrationOverview() {
  const { rows, total, slots, max } = registrationOverview();
  if (!rows.length) return null;
  const stages = genderFunnel();
  return (
    <section className="mt-12 md:mt-16">
      <h2 className="h2 text-ink">Toàn cảnh {rows.length} mùa</h2>

      <h3 className="h3 mt-8 text-ink">Thí sinh đăng kí qua các mùa</h3>
      <p className="mt-2 font-semibold text-oss tabular-nums">
        {total} lượt đăng kí cho {slots} suất vào Bán kết.
      </p>
      <SeasonColumnChart rows={rows} max={max} />

      <h3 className="h3 mt-12 text-ink">Từ đơn đăng kí tới ngôi Quán quân</h3>
      <ol className="mt-4 space-y-4">
        {stages.map((stage) => {
          const sum = stage.nam + stage.nu;
          return (
            <li key={stage.id} className="grid gap-x-4 gap-y-1.5 sm:grid-cols-[10rem_minmax(0,1fr)] sm:items-center">
              <p className="leading-snug">
                <span className="block text-sm font-bold text-ink">{stage.label}</span>
                <span className="block text-xs text-ink-soft tabular-nums">{sum} lượt</span>
              </p>
              <RatioBar title={stage.label} segments={ratioSegments("gender", { nam: stage.nam, nu: stage.nu }, { nam: sum, nu: sum })} />
            </li>
          );
        })}
      </ol>
      {/* Một chú thích chung cho cả 4 thanh */}
      <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-1 text-sm">
        {ratioSegments("gender", {}, { nam: 1, nu: 1 }).map((g) => (
          <li key={g.key} className="inline-flex items-center gap-1.5">
            <span aria-hidden className="size-3 shrink-0 rounded-[3px]" style={{ backgroundColor: g.color }} />
            {g.label}
          </li>
        ))}
      </ul>
      <p className="mt-2 text-xs text-ink-soft">Tính theo lượt: một người vào top 12 ở hai mùa được tính hai lượt.</p>
    </section>
  );
}
