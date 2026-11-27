import { useState } from "react";
import RatioBar from "./RatioBar";
import { registrationOf, top12Breakdown } from "../lib/data";
import { percent } from "../lib/format";
import { ratioSegments, type RatioDimension } from "../lib/ratio";

const ROWS: { dimension: RatioDimension; label: string; key: "byGrade" | "byGender" | "bySchool" }[] = [
  { dimension: "grade", label: "Khối", key: "byGrade" },
  { dimension: "gender", label: "Giới tính", key: "byGender" },
  { dimension: "school", label: "Trường", key: "bySchool" },
];

/** Số liệu đăng kí ở mục Vòng loại của trang mùa. Mỗi hàng chỉ chia theo một tiêu chí. Mùa chưa có số liệu thì không hiện. */
export default function RegistrationBlock({ season }: { season: number }) {
  const [compare, setCompare] = useState(false);
  const reg = registrationOf(season);
  if (!reg) return null;
  const top = top12Breakdown(season);

  const numbers = [
    { value: String(reg.total), label: "thí sinh đăng kí" },
    { value: String(top.total), label: `vào Bán kết · ${percent(top.total, reg.total)}%` },
  ];

  return (
    <div className="mt-5 mb-8 max-w-3xl">
      <ul className="grid grid-cols-2 gap-4 sm:max-w-md">
        {numbers.map((n) => (
          <li key={n.label} className="rounded-xl border border-oss/15 bg-white/75 p-4 text-center">
            <span className="block text-3xl font-extrabold text-oss tabular-nums">{n.value}</span>{" "}
            <span className="mt-1 block text-sm text-ink-soft">{n.label}</span>
          </li>
        ))}
      </ul>

      <div className="mt-5 rounded-xl border border-oss/15 bg-white/75 p-4 sm:p-5">
        <button
          type="button"
          aria-pressed={compare}
          onClick={() => setCompare((v) => !v)}
          className="inline-flex min-h-9 items-center rounded-full border border-oss/25 bg-white px-4 text-sm font-semibold text-oss hover:border-oss aria-pressed:border-oss aria-pressed:bg-oss aria-pressed:text-white"
        >
          So với top 12
        </button>
        <div className="mt-4 space-y-5">
          {ROWS.map((row) => {
            const registered: Partial<Record<string, number>> = reg[row.key];
            const bars = [
              { tag: "Đăng kí", counts: registered },
              ...(compare ? [{ tag: "Top 12", counts: top[row.key] }] : []),
            ];
            return (
              <div key={row.key}>
                <p className="text-sm font-semibold text-ink">{row.label}</p>
                <div className="mt-1.5 space-y-3">
                  {bars.map((bar) => (
                    <div key={bar.tag} className={compare ? "sm:grid sm:grid-cols-[4.5rem_minmax(0,1fr)] sm:gap-3" : ""}>
                      {compare && <p className="mb-1 text-xs text-ink-soft sm:mb-0 sm:leading-7">{bar.tag}</p>}
                      <RatioBar
                        title={`${row.label}, ${bar.tag === "Top 12" ? "top 12" : "đăng kí"}`}
                        segments={ratioSegments(row.dimension, bar.counts, registered)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
