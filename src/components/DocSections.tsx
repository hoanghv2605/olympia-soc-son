import type { ReactNode } from "react";
import LegendPopover from "./LegendPopover";
import { SEMI_TONE } from "./MatchTable";
import PersonLink from "./PersonLink";
import PersonPhoto from "./PersonPhoto";
import ResultBadge from "./ResultBadge";
import { EVENT_RESULT_LABEL, eventParticipantPhoto, eventResultMedal, getPerson, schoolName } from "../lib/data";
import { scrollToId, formatScoreVi } from "../lib/format";
import { MEDAL_BADGE, MEDAL_ROW } from "../lib/medal";
import type { DocData, DocResult, EventResult, SiteEvent } from "../types";

/** Tên thí sinh: link hồ sơ nếu có `ossPerson` và người đó có hồ sơ OSSPEDIA, còn lại chữ thường. */
function DocName({ p }: { p: { name: string; ossPerson?: string } }) {
  return p.ossPerson && getPerson(p.ossPerson) ? <PersonLink id={p.ossPerson} /> : <span className="font-medium">{p.name}</span>;
}

/** Dưới 640px: kết quả ngay dưới tên (cột Kết quả bị ẩn bằng display:none nên kết quả chỉ được đọc một lần). */
function SmallResult({ result }: { result: EventResult }) {
  return (
    <div className="mt-1 sm:hidden">
      <ResultBadge medal={eventResultMedal(result)} size="sm">
        {EVENT_RESULT_LABEL[result]}
      </ResultBadge>
    </div>
  );
}

/** Ô "Thí sinh": ảnh tròn nhỏ + tên; điện thoại thêm dòng "lớp - trường" (cột Lớp, Trường bị ẩn). */
function PersonCell({ event, p }: { event: SiteEvent; p: { name: string; class: string; school: string; ossPerson?: string; result?: EventResult } }) {
  return (
    <div className="flex items-center gap-2.5">
      <PersonPhoto
        decorative
        src={eventParticipantPhoto(event, p)}
        seed={p.ossPerson ?? p.name}
        name={p.name}
        className="size-8 shrink-0 rounded-full"
      />
      <div className="min-w-0 sm:min-w-[7.5rem]">
        <DocName p={p} />
        <span className="block text-xs text-ink-soft md:hidden">
          {p.class} - {schoolName(p.school)}
        </span>
        {p.result && <SmallResult result={p.result} />}
      </div>
    </div>
  );
}

const TOC_ITEMS = (doc: DocData) => [
  { id: "vong-loai", label: "Vòng loại", children: [] as { id: string; label: string }[] },
  { id: "ban-ket", label: "Vòng Bán kết", children: doc.semifinals.map((m) => ({ id: `ban-ket-${m.no}`, label: `Bán kết ${m.no}` })) },
  { id: "chung-ket", label: "Trận Chung kết", children: [] },
];

/** Mục lục như trang mùa OSS: Vòng loại, Vòng Bán kết (Bán kết 1–3), Trận Chung kết. */
export function DocToc({ doc }: { doc: DocData }) {
  const toc = TOC_ITEMS(doc).filter((t) => (t.id === "vong-loai" ? doc.qualifying.length : t.id === "ban-ket" ? doc.semifinals.length : doc.final.results.length));
  if (!toc.length) return null;
  return (
    <nav aria-label="Mục lục" className="mt-5 inline-block rounded-xl border border-oss/15 bg-white/75 px-5 py-4 text-[15px]">
      <p className="text-sm font-semibold text-ink-soft">Mục lục</p>
      <ol className="mt-2 space-y-1">
        {toc.map((t, i) => (
          <li key={t.id}>
            <button type="button" onClick={() => scrollToId(t.id)} className="text-left text-oss hover:underline">
              {i + 1}. {t.label}
            </button>
            {t.children.length > 0 && (
              <ol className="mt-1 space-y-1 pl-5">
                {t.children.map((c, j) => (
                  <li key={c.id}>
                    <button type="button" onClick={() => scrollToId(c.id)} className="text-left text-oss hover:underline">
                      {i + 1}.{j + 1}. {c.label}
                    </button>
                  </li>
                ))}
              </ol>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

const resultHeads = (
  <>
    <th scope="col" className="sticky-start">
      Thí sinh
    </th>
    <th scope="col" className="hidden md:table-cell">
      Lớp
    </th>
    <th scope="col" className="hidden md:table-cell">
      Trường
    </th>
    <th scope="col" className="hidden sm:table-cell">
      Kết quả
    </th>
  </>
);

/**
 * Các phần thi của sự kiện dạng mùa thi (DOC3, DOC4) như trang mùa OSS: Vòng loại, Vòng Bán kết (3 trận), Trận Chung kết,
 * rồi ảnh trao giải. Không có điểm Bán kết / Chung kết nên không có biểu đồ; người vào Chung kết được tô nổi bật ở Bán kết.
 */
export default function DocSections({ event, doc, award }: { event: SiteEvent; doc: DocData; award?: ReactNode }) {
  // Người vào Chung kết: người Nhất mỗi trận + người Nhì cao nhất (xác định bằng việc có tên trong Chung kết)
  const finalists = new Set(doc.final.results.map((r) => r.name));
  const semiTone = (r: DocResult) => {
    if (!finalists.has(r.name)) return undefined;
    return r.result === "giai-nhat" ? SEMI_TONE.winner : SEMI_TONE.bestSecond;
  };

  return (
    <>
      {doc.qualifying.length > 0 && (
        <section id="vong-loai" className="mt-12 scroll-mt-24 md:mt-16">
          <h2 className="h2 text-ink">Vòng loại</h2>
          <p className="mt-2 max-w-[70ch] text-ink-soft">{doc.qualifying.length} thí sinh có kết quả cao nhất vào vòng Bán kết.</p>
          <div className="mt-4 overflow-x-auto">
            <table className="data-table md:min-w-[36rem]">
              <thead>
                <tr>
                  <th scope="col" className="num">
                    Hạng
                  </th>
                  <th scope="col" className="sticky-start">
                    Thí sinh
                  </th>
                  <th scope="col" className="hidden md:table-cell">
                    Lớp
                  </th>
                  <th scope="col" className="hidden md:table-cell">
                    Trường
                  </th>
                  <th scope="col" className="num text-right">
                    Điểm
                  </th>
                </tr>
              </thead>
              <tbody>
                {doc.qualifying.map((q) => (
                  <tr key={q.name}>
                    <td className="num">{q.rank}</td>
                    <td className="sticky-start">
                      <PersonCell event={event} p={q} />
                    </td>
                    <td className="hidden md:table-cell">{q.class}</td>
                    <td className="hidden md:table-cell">{schoolName(q.school)}</td>
                    <td className="num text-right font-semibold">{formatScoreVi(q.score)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {doc.semifinals.length > 0 && (
        <section id="ban-ket" className="mt-12 scroll-mt-24 md:mt-16">
          <div className="relative flex items-center gap-1">
            <h2 className="h2 text-ink">Vòng Bán kết</h2>
            <LegendPopover label="Chú thích bảng Bán kết">
              <ul className="space-y-2">
                {Object.values(SEMI_TONE).map((t) => (
                  <li key={t.label} className="flex items-center gap-2">
                    <span className={`size-4 shrink-0 rounded-sm ${t.swatch}`} aria-hidden />
                    {t.label}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-ink-soft">Thứ tự theo vị trí đứng của thí sinh trong trận.</p>
            </LegendPopover>
          </div>
          <div className="mt-6 space-y-12">
            {doc.semifinals.map((m) => (
              <section key={m.no} id={`ban-ket-${m.no}`} className="scroll-mt-24">
                <h3 className="h3 text-ink">Bán kết {m.no}</h3>
                <div className="mt-4 overflow-x-auto">
                  <table className="data-table is-fit sm:min-w-[30rem]">
                    <thead>
                      <tr>{resultHeads}</tr>
                    </thead>
                    <tbody>
                      {m.results.map((r) => {
                        const tone = semiTone(r);
                        const onDark = tone?.tone === "winner";
                        return (
                          <tr key={r.name} data-tone={tone?.tone}>
                            <td className="sticky-start">
                              <div className="flex items-center gap-2.5">
                                <PersonPhoto
                                  decorative
                                  src={eventParticipantPhoto(event, r)}
                                  seed={r.ossPerson ?? r.name}
                                  name={r.name}
                                  className={`size-8 shrink-0 rounded-full ${onDark ? "ring-2 ring-white" : ""}`}
                                />
                                <div className="min-w-0 sm:min-w-[7.5rem]">
                                  {r.ossPerson && getPerson(r.ossPerson) ? (
                                    <PersonLink id={r.ossPerson} className={onDark ? "font-bold !text-white decoration-white focus-visible:outline-white" : ""} />
                                  ) : (
                                    <span className={onDark ? "font-bold" : "font-medium"}>{r.name}</span>
                                  )}
                                  {tone && <span className="sr-only">. {tone.label}</span>}
                                  <span className={`block text-xs md:hidden ${onDark ? "text-white/80" : "text-ink-soft"}`}>
                                    {r.class} - {schoolName(r.school)}
                                  </span>
                                  <SmallResult result={r.result} />
                                </div>
                              </div>
                            </td>
                            <td className="hidden md:table-cell">{r.class}</td>
                            <td className="hidden md:table-cell">{schoolName(r.school)}</td>
                            <td className="hidden font-semibold sm:table-cell">{EVENT_RESULT_LABEL[r.result]}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </section>
            ))}
          </div>
        </section>
      )}

      {doc.final.results.length > 0 && (
        <section id="chung-ket" className="mt-12 scroll-mt-24 md:mt-16">
          <div className="relative flex items-center gap-1">
            <h2 className="h2 text-ink">Trận Chung kết</h2>
            <LegendPopover label="Chú thích bảng Chung kết">
              <ul className="space-y-2">
                {(
                  [
                    { medal: "gold", label: EVENT_RESULT_LABEL["quan-quan"] },
                    { medal: "silver", label: EVENT_RESULT_LABEL["a-quan"] },
                    { medal: "bronze", label: EVENT_RESULT_LABEL["quy-quan"] },
                  ] as const
                ).map((it) => (
                  <li key={it.medal} className="flex items-center gap-2">
                    <span className={`size-4 shrink-0 rounded-sm border ${MEDAL_BADGE[it.medal]}`} aria-hidden />
                    {it.label}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-ink-soft">Thứ tự theo vị trí đứng của thí sinh trong trận.</p>
            </LegendPopover>
          </div>
          <div className="mt-6">
            <div className="overflow-x-auto">
              <table className="data-table is-fit sm:min-w-[30rem]">
                <thead>
                  <tr>{resultHeads}</tr>
                </thead>
                <tbody>
                  {doc.final.results.map((r) => {
                    const medal = eventResultMedal(r.result);
                    return (
                      <tr key={r.name} className={medal ? MEDAL_ROW[medal] : undefined} data-tone={medal ? "medal" : undefined}>
                        <td className="sticky-start">
                          <PersonCell event={event} p={r} />
                        </td>
                        <td className="hidden md:table-cell">{r.class}</td>
                        <td className="hidden md:table-cell">{schoolName(r.school)}</td>
                        <td className="hidden sm:table-cell">
                          <ResultBadge medal={medal} size="sm">
                            {EVENT_RESULT_LABEL[r.result]}
                          </ResultBadge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {award && <div className="mt-8">{award}</div>}
          </div>
        </section>
      )}
    </>
  );
}
