import { useState } from "react";
import DonutChart from "./DonutChart";
import { registrationOf, top12Breakdown } from "../lib/data";
import { percent } from "../lib/format";
import { ratioSegments, type RatioDimension } from "../lib/ratio";

const CHARTS: { dimension: RatioDimension; label: string; key: "byGrade" | "byGender" | "bySchool" }[] = [
  { dimension: "grade", label: "Khối", key: "byGrade" },
  { dimension: "gender", label: "Giới tính", key: "byGender" },
  { dimension: "school", label: "Trường", key: "bySchool" },
];

type Mode = "registered" | "top12";
const MODES: { id: Mode; label: string }[] = [
  { id: "registered", label: "Đăng kí" },
  { id: "top12", label: "Top 12" },
];

/** Số liệu đăng kí ở mục Vòng loại của trang mùa. Mỗi biểu đồ chỉ chia theo một tiêu chí. Mùa chưa có số liệu thì không hiện. */
export default function RegistrationBlock({ season }: { season: number }) {
  const [mode, setMode] = useState<Mode>("registered");
  const reg = registrationOf(season);
  if (!reg) return null;
  const top = top12Breakdown(season);
  const isTop = mode === "top12";

  const numbers = [
    { value: String(reg.total), label: "thí sinh đăng kí" },
    { value: String(top.total), label: `vào Bán kết · ${percent(top.total, reg.total)}%` },
  ];

  return (
    <div className="mt-5 mb-8">
      <ul className="grid grid-cols-2 gap-4">
        {numbers.map((n) => (
          <li key={n.label} className="rounded-xl border border-oss/15 bg-white/75 p-4 text-center">
            <span className="block text-3xl font-extrabold text-oss tabular-nums">{n.value}</span>{" "}
            <span className="mt-1 block text-sm text-ink-soft">{n.label}</span>
          </li>
        ))}
      </ul>

      <div className="mt-4 rounded-xl border border-oss/15 bg-white/75 p-4 sm:p-5">
        <div className="flex justify-center">
          <div role="group" aria-label="Số liệu hiển thị" className="inline-flex rounded-full border border-oss/25 bg-white p-1 text-sm font-semibold">
            {MODES.map((m) => (
              <button
                key={m.id}
                type="button"
                aria-pressed={mode === m.id}
                onClick={() => setMode(m.id)}
                className="min-h-9 rounded-full px-4 text-oss aria-pressed:bg-oss aria-pressed:text-white"
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-5 grid gap-8 sm:grid-cols-3 sm:gap-4">
          {CHARTS.map((chart) => {
            const registered: Partial<Record<string, number>> = reg[chart.key];
            return (
              <DonutChart
                key={chart.dimension}
                title={chart.label}
                // Nhóm, màu và thứ tự luôn theo số đăng kí, đổi chế độ chỉ đổi số
                segments={ratioSegments(chart.dimension, isTop ? top[chart.key] : registered, registered)}
                value={isTop ? top.total : reg.total}
                caption={isTop ? "top 12" : "thí sinh"}
                unit={isTop ? "người" : "thí sinh"}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
