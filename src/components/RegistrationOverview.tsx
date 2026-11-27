import RatioBar from "./RatioBar";
import SeasonColumnChart from "./SeasonColumnChart";
import { genderFunnel, registrationOverview } from "../lib/data";
import { percent } from "../lib/format";
import { ratioSegments } from "../lib/ratio";

/** Mục "Toàn cảnh {n} mùa" ở trang Các mùa giải: số đăng kí qua các mùa và phễu Nam / Nữ. */
export default function RegistrationOverview() {
  const { rows, total, slots, max } = registrationOverview();
  if (!rows.length) return null;
  return (
    <section className="mt-12 md:mt-16">
      <h2 className="h2 text-ink">Toàn cảnh {rows.length} mùa</h2>

      <h3 className="h3 mt-8 text-ink">Thí sinh đăng kí qua các mùa</h3>
      <p className="mt-2 font-semibold text-oss tabular-nums">
        {total} lượt đăng kí cho {slots} suất vào Bán kết.
      </p>
      <SeasonColumnChart rows={rows} max={max} />

      <h3 className="h3 mt-12 text-ink">Từ đơn đăng kí tới ngôi Quán quân</h3>
      <ol className="mt-4 space-y-5">
        {genderFunnel().map((stage) => {
          const sum = stage.nam + stage.nu;
          return (
            <li
              key={stage.id}
              className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-3 gap-y-1.5 sm:grid-cols-[13rem_minmax(0,1fr)_5rem]"
            >
              <p className="text-sm font-semibold text-ink tabular-nums sm:leading-7">
                {stage.label} · {sum} lượt
              </p>
              <p className="text-right text-sm font-semibold text-ink tabular-nums sm:order-last sm:leading-7">
                Nữ {percent(stage.nu, sum)}%
              </p>
              <div className="col-span-2 min-w-0 sm:col-span-1">
                <RatioBar title={stage.label} segments={ratioSegments("gender", { nam: stage.nam, nu: stage.nu }, { nam: sum, nu: sum })} />
              </div>
            </li>
          );
        })}
      </ol>
      <p className="mt-4 text-xs text-ink-soft">Tính theo lượt: một người vào top 12 ở hai mùa được tính hai lượt.</p>
    </section>
  );
}
