import PersonLink from "./PersonLink";
import { PLACEMENT_LABEL, personName, roundLabel, schoolName, tiebreakInfo } from "../lib/data";
import { formatScore, joinViText } from "../lib/format";
import { MEDAL_ROW, medalOf } from "../lib/medal";
import type { Match, MatchResult } from "../types";

/** Nhì cao điểm nhất: người hạng Nhì vẫn được vào Chung kết. */
function isBestSecond(r: MatchResult) {
  return r.rank === 2 && !!r.advanced;
}

/**
 * Kiểu dòng Bán kết, dùng chung cho bảng và dòng chú thích màu (CSS trong index.css theo `data-tone`):
 * Nhất trận: nền oss, chữ trắng; Nhì cao điểm nhất: không tô nền, viền oss 2px quanh dòng, tên đậm.
 */
export const SEMI_TONE = {
  winner: { tone: "winner", swatch: "bg-oss", label: "Nhất trận, vào Chung kết" },
  bestSecond: { tone: "outline", swatch: "border-2 border-oss", label: "Nhì cao điểm nhất, vào Chung kết" },
} as const;

/** 4 cột điểm: tiêu đề viết tắt (để bảng không vỡ trên điện thoại), rê chuột hiện tên đầy đủ. */
export const SCORE_COLUMNS = [
  { abbr: "KĐ", full: "Khởi động" },
  { abbr: "VCNV", full: "Vượt chướng ngại vật" },
  { abbr: "TT", full: "Tăng tốc" },
  { abbr: "VĐ", full: "Về đích" },
] as const;

/** Các ô tiêu đề cột điểm KĐ / VCNV / TT / VĐ dùng `<abbr>`. */
export function ScoreHeads() {
  return (
    <>
      {SCORE_COLUMNS.map((c) => (
        <th key={c.abbr} scope="col" className="num text-right">
          <abbr title={c.full} className="cursor-help">
            {c.abbr}
          </abbr>
        </th>
      ))}
    </>
  );
}

/** Dòng chú thích màu, đặt 1 lần phía trên các bảng Bán kết (kèm giải nghĩa chữ viết tắt cột điểm). */
export function SemiLegend({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
      <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-soft">
        {Object.values(SEMI_TONE).map((t) => (
          <li key={t.label} className="flex items-center gap-2">
            <span className={`size-4 shrink-0 rounded-sm ${t.swatch}`} aria-hidden />
            {t.label}
          </li>
        ))}
      </ul>
      <p className="mt-2 text-xs text-ink-soft">{SCORE_COLUMNS.map((c) => `${c.abbr}: ${c.full}`).join(" · ")}</p>
    </div>
  );
}

/**
 * Bảng một trận Bán kết / Chung kết. Giữ đúng thứ tự thí sinh trong matches.json
 * (thứ tự đứng trên sân khấu), không sắp xếp lại theo điểm.
 */
export default function MatchTable({ match, id }: { match: Match; id?: string }) {
  const isFinal = match.round === "chung-ket";
  const tiebreak = tiebreakInfo(match);

  /** Màu dòng + chữ ẩn cho trình đọc màn hình nói kết quả tương ứng. */
  function rowTone(r: MatchResult): { tone: string; className?: string; label: string } | undefined {
    if (isFinal) {
      const medal = medalOf(r.placement);
      return medal && r.placement
        ? { tone: "medal", className: MEDAL_ROW[medal], label: PLACEMENT_LABEL[r.placement] }
        : undefined;
    }
    if (r.rank === 1) return SEMI_TONE.winner;
    if (isBestSecond(r)) return SEMI_TONE.bestSecond;
    return undefined;
  }

  return (
    <section id={id} className="scroll-mt-24">
      <h3 className="h3 text-ink">{roundLabel(match)}</h3>
      <div className="mt-3 overflow-x-auto">
        <table className="data-table min-w-[32rem]">
          <thead>
            <tr>
              <th scope="col" className="sticky-start">
                Thí sinh
              </th>
              <ScoreHeads />
              <th scope="col" className="sticky-end num text-right">
                Tổng
              </th>
            </tr>
          </thead>
          <tbody>
            {match.results.map((r) => {
              const tone = rowTone(r);
              return (
                <tr key={r.person} className={tone && "className" in tone ? tone.className : undefined} data-tone={tone?.tone}>
                  <td className="sticky-start">
                    <PersonLink id={r.person} />
                    {tiebreak?.winner === r.person && <span aria-hidden>*</span>}
                    {tone && <span className="sr-only">. {tone.label}</span>}
                    <span className="row-sub block text-xs text-ink-soft">
                      {r.class} - {schoolName(r.school)}
                    </span>
                  </td>
                  <td className="num text-right">{formatScore(r.kd)}</td>
                  <td className="num text-right">{formatScore(r.vcnv)}</td>
                  <td className="num text-right">{formatScore(r.tt)}</td>
                  <td className="num text-right">{formatScore(r.vd)}</td>
                  <td className="sticky-end num text-right font-bold">{formatScore(r.total)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {tiebreak && <TiebreakNote winner={tiebreak.winner} tiedWith={tiebreak.tiedWith} />}
      {match.notes?.map((n) => (
        <p key={n} className="mt-2 text-sm text-ink-soft">
          {n}
        </p>
      ))}
    </section>
  );
}

/** "* A thắng câu hỏi phụ trước B." */
export function TiebreakNote({ winner, tiedWith }: { winner: string; tiedWith: string[] }) {
  return (
    <p className="mt-2 text-sm text-ink-soft">
      * {personName(winner)} thắng câu hỏi phụ{tiedWith.length > 0 && ` trước ${joinViText(tiedWith.map(personName))}`}.
    </p>
  );
}
