import { useRef, useState } from "react";
import { Link } from "react-router";
import MedalBadge from "../components/MedalBadge";
import Modal from "../components/Modal";
import PersonLink from "../components/PersonLink";
import PersonPhoto from "../components/PersonPhoto";
import {
  RECORD_LABEL,
  bestOlympiaRecord,
  championsList,
  defendingChampions,
  describeOlympiaRecord,
  describeTitles,
  getSchool,
  matchShortLabel,
  multipleFinalists,
  olympiaContestantCount,
  olympiaLaurelCount,
  olympiaPeople,
  personPath,
  personPhoto,
  seasonPath,
  titlesOf,
  topRecords,
  type RecordField,
} from "../lib/data";
import { formatDate, formatScore } from "../lib/format";
import { MEDAL_DOT, MEDAL_ROW, medalOf } from "../lib/medal";

const RECORD_FIELDS: RecordField[] = ["vl", "kd", "vcnv", "tt", "vd", "total"];

// ===== OSS tại Đường lên đỉnh Olympia (chỉ THPT Sóc Sơn) =====

function OlympiaSection() {
  const people = olympiaPeople("soc-son");
  const [selected, setSelected] = useState<string | null>(null);
  const cardRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const current = people.find((p) => p.person.id === selected);

  function close() {
    const id = selected;
    setSelected(null);
    // trả focus về thẻ vừa mở (đợi hộp nổi đóng hẳn, vì khi đang mở phần còn lại của trang bị khóa)
    if (id) requestAnimationFrame(() => cardRefs.current[id]?.focus());
  }

  return (
    <section className="border-y border-oss/10 bg-white/40">
      <div className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="section-title">OSS tại Đường lên đỉnh Olympia</h2>
        <p className="mt-3 text-sm text-ink-soft">
          Cựu thí sinh trường THPT Sóc Sơn: <strong className="text-ink tabular-nums">{olympiaContestantCount("soc-son")}</strong>{" "}
          thí sinh · <strong className="text-ink tabular-nums">{olympiaLaurelCount("soc-son")}</strong> vòng nguyệt quế
        </p>

        <ul className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
          {people.map(({ person, records, ossSeason }) => {
            const best = bestOlympiaRecord(records);
            return (
              <li key={person.id}>
                <button
                  type="button"
                  ref={(el) => {
                    cardRefs.current[person.id] = el;
                  }}
                  onClick={() => setSelected(person.id)}
                  aria-haspopup="dialog"
                  className="group flex h-full w-full flex-col overflow-hidden rounded-xl border border-oss/15 bg-white/80 text-left transition-shadow hover:shadow-[0_18px_40px_-20px_rgba(109,40,217,0.5)]"
                >
                  <PersonPhoto src={personPhoto(person.id)} name={person.name} className="aspect-[3/4] w-full" />
                  <span className="flex flex-1 flex-col p-4">
                    <span className="font-bold text-ink group-hover:text-oss">{person.name}</span>
                    <span className="text-xs text-ink-soft">OSS mùa {ossSeason}</span>
                    {best && <span className="mt-2 text-sm leading-snug text-ink">{describeOlympiaRecord(best)}</span>}
                    <span className="mt-auto flex flex-wrap gap-1.5 pt-3" aria-label={`${records.length} thành tích`}>
                      {records.map((r, i) => {
                        const medal = medalOf(r.result);
                        return (
                          <span
                            key={i}
                            className={`size-2.5 rounded-full ${medal ? MEDAL_DOT[medal] : "bg-oss/30"}`}
                            title={`${r.result} ${r.round}`}
                          />
                        );
                      })}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <Modal open={!!current} onClose={close} labelledBy="olympia-dialog-title">
        {current && (
          <div>
            <div className="flex gap-5 pr-10">
              <PersonPhoto
                src={personPhoto(current.person.id)}
                name={current.person.name}
                className="aspect-[3/4] w-24 shrink-0 rounded-lg sm:w-32"
                textClass="text-3xl"
              />
              <div>
                <h2 id="olympia-dialog-title" className="text-2xl font-bold text-ink">
                  {current.person.name}
                </h2>
                <p className="text-sm text-ink-soft">{getSchool(current.person.school)?.name}</p>
                {describeTitles(titlesOf(current.person.id)).map((t) => (
                  <p key={t} className="mt-1 text-sm font-semibold text-oss">
                    {t}
                  </p>
                ))}
              </div>
            </div>

            <h3 className="mt-6 text-sm font-semibold tracking-wide text-ink-soft uppercase">Đường lên đỉnh Olympia</h3>
            <ul className="mt-2 divide-y divide-oss/10 border-y border-oss/10">
              {current.records.map((r) => (
                <li key={`${r.year}-${r.round}`} className="flex flex-wrap items-start gap-x-3 gap-y-1 py-3">
                  <MedalBadge medal={medalOf(r.result)}>{r.result}</MedalBadge>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[15px] text-ink">
                      {r.round}, năm thứ {r.year}
                    </span>
                    {r.date && <span className="block text-xs text-ink-soft tabular-nums">{formatDate(r.date)}</span>}
                    {r.note && <span className="block text-sm font-semibold text-cube-pink">{r.note}</span>}
                  </span>
                </li>
              ))}
            </ul>

            <Link to={personPath(current.person.id)} className="btn-primary mt-6">
              Xem hồ sơ đầy đủ
            </Link>
          </div>
        )}
      </Modal>
    </section>
  );
}

// ===== Kỷ lục =====

function RecordsSection() {
  const [openField, setOpenField] = useState<RecordField | null>(null);
  const tables = Object.fromEntries(RECORD_FIELDS.map((f) => [f, topRecords(f, 10)])) as Record<
    RecordField,
    ReturnType<typeof topRecords>
  >;
  const rows = openField ? tables[openField] : [];

  return (
    <section className="mx-auto max-w-6xl px-5 py-16">
      <h2 className="section-title">Kỷ lục</h2>
      <p className="mt-3 text-ink-soft">Bấm vào từng ô để xem bảng xếp hạng top 10 (giữ nguyên những người bằng điểm).</p>

      <ul className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
        {RECORD_FIELDS.map((f) => {
          const holders = tables[f].filter((r) => r.rank === 1);
          const shown = holders.slice(0, 2).map((r) => r.person.name);
          const expanded = openField === f;
          return (
            <li key={f}>
              <button
                type="button"
                aria-expanded={expanded}
                aria-controls="record-panel"
                onClick={() => setOpenField(expanded ? null : f)}
                className={`flex h-full w-full flex-col rounded-xl border p-4 text-left transition-colors md:p-5 ${
                  expanded ? "border-oss bg-oss text-white" : "border-oss/15 bg-white/80 hover:border-oss/50"
                }`}
              >
                <span className={`text-sm font-semibold ${expanded ? "text-white/80" : "text-ink-soft"}`}>{RECORD_LABEL[f]}</span>
                <span className={`mt-1 text-4xl font-extrabold tabular-nums ${expanded ? "text-white" : "text-oss"}`}>
                  {holders[0]?.value ?? "–"}
                </span>
                <span className={`mt-1 text-sm leading-snug ${expanded ? "text-white" : "text-ink"}`}>
                  {shown.join(", ")}
                  {holders.length > 2 && ` +${holders.length - 2}`}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <div id="record-panel" aria-live="polite">
        {openField && (
          <div className="mt-6 overflow-x-auto">
            <table className="data-table min-w-[34rem]">
              <caption className="pb-3 text-left text-lg font-bold text-ink">Bảng xếp hạng: {RECORD_LABEL[openField]}</caption>
              <thead>
                <tr>
                  <th scope="col">Hạng</th>
                  <th scope="col">Thí sinh</th>
                  <th scope="col">Mùa</th>
                  <th scope="col">Trận</th>
                  <th scope="col" className="text-right">Điểm</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  const medal = medalOf(r.rank);
                  return (
                    <tr
                      key={`${r.person.id}-${r.season}-${r.match?.id ?? "vl"}`}
                      className={medal ? MEDAL_ROW[medal] : undefined}
                      data-tone={medal ? "" : undefined}
                    >
                      <td className="font-semibold tabular-nums">{r.rank}</td>
                      <td>
                        <PersonLink id={r.person.id} />
                      </td>
                      <td>
                        <Link to={seasonPath(r.season)} className="hover:text-oss hover:underline">
                          Mùa {r.season}
                        </Link>
                      </td>
                      <td>{r.match ? matchShortLabel(r.match) : "Vòng loại"}</td>
                      <td className="text-right font-bold tabular-nums">{r.value}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

export default function HallOfFamePage() {
  const champions = championsList();
  const finalists = multipleFinalists(2);
  const defenders = defendingChampions();

  return (
    <>
      <section className="paper-dark text-white">
        <div className="mx-auto max-w-6xl px-5 py-16 md:py-20">
          <h1 className="text-3xl font-bold tracking-[0.06em] uppercase md:text-[2.5rem]">Bảng vàng</h1>
          <p className="mt-3 max-w-[60ch] text-white/75">
            Quán quân các mùa, những cựu thí sinh OSS bước lên sân khấu Đường lên đỉnh Olympia và các kỷ lục điểm số.
          </p>
        </div>
      </section>

      {/* ===== Quán quân ===== */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="section-title">Quán quân các mùa</h2>
        <div className="mt-8 overflow-x-auto">
          <table className="data-table min-w-[36rem]">
            <thead>
              <tr>
                <th scope="col">Mùa</th>
                <th scope="col">Quán quân</th>
                <th scope="col">Trường</th>
                <th scope="col" className="text-right">Điểm Chung kết</th>
              </tr>
            </thead>
            <tbody>
              {champions.flatMap(({ season: s, champions: cs }) =>
                cs.map((c) => (
                  <tr key={`${s.season}-${c.person.id}`}>
                    <td>
                      <Link to={seasonPath(s.season)} className="font-semibold text-oss hover:underline">
                        Mùa {s.season}
                      </Link>
                    </td>
                    <td>
                      <PersonLink id={c.person.id} className="font-semibold" />
                      {defenders.some((d) => d.person.id === c.person.id && d.seasons[1] === s.season) && (
                        <span className="block text-xs font-semibold text-cube-pink">Bảo vệ thành công ngôi Quán quân</span>
                      )}
                    </td>
                    <td>{getSchool(c.result.school)?.name}</td>
                    <td className="text-right font-bold tabular-nums">{formatScore(c.result.total)}</td>
                  </tr>
                )),
              )}
            </tbody>
          </table>
        </div>
      </section>

      <OlympiaSection />

      <RecordsSection />

      {/* ===== Vào CK nhiều lần ===== */}
      <section className="mx-auto mb-12 max-w-6xl px-5 pb-16">
        <h2 className="section-title">Vào Chung kết nhiều lần</h2>
        <ul className="mt-8 grid border-t border-oss/15 sm:grid-cols-2 lg:grid-cols-3">
          {finalists.map((f) => (
            <li key={f.person.id} className="border-b border-oss/15 px-1 py-4">
              <PersonLink id={f.person.id} className="text-lg font-semibold" />
              <span className="block text-sm text-ink-soft">
                {f.seasons.length} lần: mùa {f.seasons.join(", ")}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
