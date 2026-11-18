import PersonLink from "./PersonLink";
import { PLACEMENT_LABEL, getSchool, matchLabel } from "../lib/data";
import { formatScore } from "../lib/format";
import type { Match } from "../types";

const badge = "inline-block rounded-full px-2 py-0.5 text-xs font-semibold whitespace-nowrap";

/** Bảng một trận Bán kết / Chung kết: 4 phần thi + tổng, kết quả, người thắng câu hỏi phụ. */
export default function MatchTable({ match }: { match: Match }) {
  const rows = match.results.slice().sort((a, b) => a.rank - b.rank);
  const isFinal = match.round === "chung-ket";

  return (
    <section>
      <h3 className="text-lg font-bold text-ink">{matchLabel(match)}</h3>
      <div className="mt-3 overflow-x-auto">
        <table className="data-table min-w-[44rem]">
          <thead>
            <tr>
              <th scope="col">Hạng</th>
              <th scope="col">Thí sinh</th>
              <th scope="col">Trường</th>
              <th scope="col" className="text-right" title="Khởi động">KĐ</th>
              <th scope="col" className="text-right" title="Vượt chướng ngại vật">VCNV</th>
              <th scope="col" className="text-right" title="Tăng tốc">TT</th>
              <th scope="col" className="text-right" title="Về đích">VĐ</th>
              <th scope="col" className="text-right">Tổng</th>
              <th scope="col">Kết quả</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.person}>
                <td className="tabular-nums">{r.rank}</td>
                <td>
                  <PersonLink id={r.person} />
                  <span className="block text-xs text-ink-soft">{r.class}</span>
                  {match.tiebreakWinner === r.person && (
                    <span className="block text-xs font-semibold text-cube-pink">Thắng câu hỏi phụ</span>
                  )}
                </td>
                <td title={getSchool(r.school)?.name}>{getSchool(r.school)?.short ?? r.school}</td>
                <td className="text-right tabular-nums">{formatScore(r.kd)}</td>
                <td className="text-right tabular-nums">{formatScore(r.vcnv)}</td>
                <td className="text-right tabular-nums">{formatScore(r.tt)}</td>
                <td className="text-right tabular-nums">{formatScore(r.vd)}</td>
                <td className="text-right font-bold tabular-nums">{formatScore(r.total)}</td>
                <td>
                  {isFinal && r.placement && (
                    <span className={`${badge} ${r.placement === "vo-dich" ? "bg-oss text-white" : "bg-oss-soft text-oss"}`}>
                      {PLACEMENT_LABEL[r.placement]}
                    </span>
                  )}
                  {!isFinal && r.advanced && <span className={`${badge} bg-oss-soft text-oss`}>Vào Chung kết</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {match.notes?.map((n) => (
        <p key={n} className="mt-2 text-sm text-ink-soft">
          {n}
        </p>
      ))}
    </section>
  );
}
