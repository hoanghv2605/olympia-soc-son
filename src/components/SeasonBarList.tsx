import { Link } from "react-router";
import Figure from "./Figure";
import { matchPath } from "../lib/data";

/**
 * Danh sách theo mùa: "Mùa n" (mở mục Vòng loại của mùa) · thanh ngang dài theo `count` so với `max` · nhãn chữ.
 * `count = 0`: chỉ hiện nhãn xám, không vẽ thanh. Điện thoại: nhãn nằm trên, thanh rộng hết khung.
 */
export default function SeasonBarList({
  rows,
  max,
  color,
}: {
  rows: { season: number; count: number; text: string }[];
  max: number;
  color: string;
}) {
  return (
    <ul className="mt-4 space-y-3 sm:space-y-1">
      {rows.map((r) => (
        <li
          key={r.season}
          className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3 gap-y-1 sm:grid-cols-[4.5rem_minmax(0,1fr)_19rem] sm:gap-y-0"
        >
          <Link to={matchPath(r.season)} className="text-sm font-semibold whitespace-nowrap text-oss hover:underline sm:py-1.5">
            Mùa {r.season}
          </Link>
          <Figure
            text={r.text}
            className={`text-right text-sm tabular-nums sm:order-last sm:text-left ${r.count ? "" : "text-ink-soft"}`}
          />
          <span aria-hidden className="col-span-2 block sm:col-span-1">
            {r.count > 0 && (
              <span className="block h-3 rounded-full" style={{ width: `${(r.count / max) * 100}%`, backgroundColor: color }} />
            )}
          </span>
        </li>
      ))}
    </ul>
  );
}
