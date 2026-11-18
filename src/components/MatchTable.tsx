import MedalBadge from "./MedalBadge";
import PersonLink from "./PersonLink";
import { PLACEMENT_LABEL, getSchool, matchLabel } from "../lib/data";
import { formatScore } from "../lib/format";
import { MEDAL_ROW, medalOf } from "../lib/medal";
import type { Match, MatchResult } from "../types";

const RANK_WORD = ["Nhất", "Nhì", "Ba", "Tư"];

function rankWord(rank: number) {
  return RANK_WORD[rank - 1] ?? `Hạng ${rank}`;
}

/** Nhì cao điểm nhất: người hạng Nhì vẫn được vào Chung kết. */
function isBestSecond(r: MatchResult) {
  return r.rank === 2 && !!r.advanced;
}

/**
 * Bảng một trận Bán kết / Chung kết. Giữ đúng thứ tự thí sinh trong matches.json
 * (thứ tự đứng trên sân khấu), không sắp xếp lại theo điểm.
 */
export default function MatchTable({ match, id }: { match: Match; id?: string }) {
  const isFinal = match.round === "chung-ket";

  function rowTone(r: MatchResult) {
    if (isFinal) {
      const medal = medalOf(r.placement);
      return medal ? MEDAL_ROW[medal] : undefined;
    }
    if (r.rank === 1) return "bg-oss/20";
    if (isBestSecond(r)) return "bg-oss-soft";
    return undefined;
  }

  return (
    <section id={id} className="scroll-mt-24">
      <h3 className="text-lg font-bold text-ink">{matchLabel(match)}</h3>
      <div className="mt-3 overflow-x-auto">
        <table className="data-table min-w-[44rem]">
          <thead>
            <tr>
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
            {match.results.map((r) => {
              const tone = rowTone(r);
              return (
                <tr key={r.person} className={tone} data-tone={tone ? "" : undefined}>
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
                    {isFinal ? (
                      r.placement && <MedalBadge medal={medalOf(r.placement)}>{PLACEMENT_LABEL[r.placement]}</MedalBadge>
                    ) : (
                      <>
                        <span className="font-semibold">{rankWord(r.rank)}</span>
                        {r.advanced && (
                          <span className="block text-xs font-semibold text-oss">
                            {isBestSecond(r) ? "Vào Chung kết (Nhì cao nhất)" : "Vào Chung kết"}
                          </span>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
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
