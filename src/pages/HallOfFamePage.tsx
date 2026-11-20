import { useRef, useState } from "react";
import { Link } from "react-router";
import type { IconType } from "react-icons";
import {
  PiChartBar,
  PiClipboardText,
  PiFlagCheckered,
  PiLightning,
  PiPuzzlePiece,
  PiRepeat,
  PiRocketLaunch,
  PiTelevisionSimple,
  PiTrophy,
} from "react-icons/pi";
import FinalistStrips from "../components/FinalistStrips";
import IconLabel from "../components/IconLabel";
import Laurel from "../components/Laurel";
import MedalBadge from "../components/MedalBadge";
import Modal from "../components/Modal";
import PageHeader from "../components/PageHeader";
import PersonLink from "../components/PersonLink";
import PersonPhoto from "../components/PersonPhoto";
import {
  RECORD_LABEL,
  championCards,
  championPhoto,
  describeTitles,
  getSchool,
  olympiaContestantCount,
  olympiaLaurelCount,
  olympiaPeople,
  olympiaTvBridgeCount,
  ossSeasonsOf,
  personPath,
  personPhoto,
  roundLabel,
  seasonPath,
  titlesOf,
  topRecords,
  type RecordField,
} from "../lib/data";
import { formatDate } from "../lib/format";
import { MEDAL_DOT, MEDAL_ROW, medalOf } from "../lib/medal";
import type { OlympiaPeriod } from "../types";

const RECORD_FIELDS: RecordField[] = ["vl", "kd", "vcnv", "tt", "vd", "total"];

const RECORD_ICON: Record<RecordField, IconType> = {
  vl: PiClipboardText,
  kd: PiLightning,
  vcnv: PiPuzzlePiece,
  tt: PiRocketLaunch,
  vd: PiFlagCheckered,
  total: PiTrophy,
};

/** Cỡ icon tiêu đề mục (~0.9em cỡ chữ tiêu đề). */
const TITLE_ICON = "size-[0.9em]";

// ===== Quán quân các mùa (Hall of Fame, nền tối, điểm nhấn vàng kim) =====

function ChampionsSection() {
  const cards = championCards();
  return (
    <section className="paper-dark text-white">
      {/* nối liền đầu trang tối phía trên nên không có khoảng đệm trên */}
      <div className="section-band mx-auto max-w-6xl px-5 pt-2 md:pt-4">
        {/* Tiêu đề in hoa (ngoại lệ có chủ đích): line-height ≥ 1.35 và không overflow để không cắt dấu chồng (Ầ, Ễ…) */}
        <h2 className="font-display flex items-center justify-center gap-4 text-2xl leading-[1.4] font-bold tracking-[0.08em] text-gold-text uppercase md:text-3xl">
          <span aria-hidden className="h-px w-12 bg-gold-text/40" />
          Hall of Fame
          <span aria-hidden className="h-px w-12 bg-gold-text/40" />
        </h2>
        <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-6 lg:grid-cols-4">
          {cards.map(({ person, wins }) => (
            <li key={person.id}>
              <Link
                to={personPath(person.id)}
                className="hof-card group flex flex-col items-center text-center focus-visible:outline-gold"
              >
                {/* Khung vuông: ảnh tròn ~68% bề rộng (tối đa 200px) nằm giữa vòng nguyệt quế tự vẽ */}
                <span className="relative block aspect-square w-full max-w-[294px]">
                  <Laurel className="hof-laurel absolute inset-0 size-full" />
                  <span className="hof-photo absolute inset-[16%] overflow-hidden rounded-full border border-gold">
                    <PersonPhoto src={championPhoto(person.id)} seed={person.id} name={person.name} className="size-full" />
                  </span>
                </span>
                {/* 2 dòng vàng căn giữa (khối cao tối thiểu bằng 2 dòng tên + dòng Quán quân để các ô thẳng hàng); tên in hoa là ngoại lệ có chủ đích của quy tắc "không in hoa" */}
                <span className="mt-3 flex min-h-[4.75rem] flex-col items-center gap-1 text-gold-text">
                  <span className="font-display pt-[0.12em] text-base leading-[1.4] font-bold tracking-[0.02em] text-balance uppercase md:text-lg">
                    {person.name}
                  </span>
                  <span className="text-sm font-bold">Quán quân {wins.map((w) => `OSS${w.season}`).join(", ")}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// ===== THPT Sóc Sơn tại Đường lên đỉnh Olympia =====

const PERIODS: { id: OlympiaPeriod; label: string }[] = [
  { id: "all", label: "Toàn bộ thí sinh" },
  { id: "oss", label: "Các thí sinh từ OSS" },
];

function OlympiaSection() {
  const [period, setPeriod] = useState<OlympiaPeriod>("all");
  const people = olympiaPeople("soc-son", period);
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
      <div className="section-band mx-auto max-w-6xl px-5">
        <h2 className="section-title">
          <IconLabel icon={PiTelevisionSimple} iconClass={TITLE_ICON}>
            THPT Sóc Sơn tại Đường lên đỉnh Olympia
          </IconLabel>
        </h2>

        <div className="mt-5 inline-flex rounded-full border border-oss/20 bg-white/80 p-1" role="group" aria-label="Phạm vi thí sinh">
          {PERIODS.map((p) => (
            <button
              key={p.id}
              type="button"
              aria-pressed={period === p.id}
              onClick={() => setPeriod(p.id)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                period === p.id ? "bg-oss text-white" : "text-oss hover:bg-oss-soft"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
        <p className="mt-3 text-sm text-ink-soft" aria-live="polite">
          <strong className="text-ink tabular-nums">{olympiaContestantCount("soc-son", period)}</strong> thí sinh ·{" "}
          <strong className="text-ink tabular-nums">{olympiaLaurelCount("soc-son", period)}</strong> vòng nguyệt quế ·{" "}
          <strong className="text-ink tabular-nums">{olympiaTvBridgeCount("soc-son", period)}</strong> cầu truyền hình
        </p>

        <ul className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-5">
          {people.map(({ person, records, years }) => (
            <li key={person.id}>
              <button
                type="button"
                ref={(el) => {
                  cardRefs.current[person.id] = el;
                }}
                onClick={() => setSelected(person.id)}
                aria-haspopup="dialog"
                className="group relative block w-full overflow-hidden rounded-2xl text-left shadow-[0_6px_18px_-12px_rgba(46,16,101,0.45)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_22px_40px_-18px_rgba(109,40,217,0.55)] focus-visible:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:focus-visible:translate-y-0"
              >
                <PersonPhoto src={personPhoto(person.id, { olympia: true })} seed={person.id} name={person.name} className="aspect-[3/4] w-full" />
                <span className="absolute inset-x-0 bottom-0 flex flex-col bg-linear-to-t from-black/80 via-black/45 to-transparent p-3 pt-12 text-white">
                  <span className="leading-snug font-bold">{person.name}</span>
                  <span className="text-xs text-white/80">
                    Olympia năm thứ {years.join(", ")}
                  </span>
                  <span className="mt-2 flex flex-wrap gap-1.5" aria-label={`${records.length} thành tích`}>
                    {records.map((r, i) => {
                      const medal = medalOf(r.result);
                      return (
                        <span
                          key={i}
                          className={`size-2.5 rounded-full ring-1 ring-white/60 ${medal ? MEDAL_DOT[medal] : "bg-white/40"}`}
                          title={`${r.result} ${r.round}`}
                        />
                      );
                    })}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <Modal open={!!current} onClose={close} labelledBy="olympia-dialog-title">
        {current && (
          <div>
            <div className="flex gap-5 pr-10">
              <PersonPhoto
                src={personPhoto(current.person.id, { olympia: true })}
                seed={current.person.id}
                name={current.person.name}
                className="aspect-[3/4] w-24 shrink-0 rounded-lg sm:w-32"
              />
              <div>
                <h2 id="olympia-dialog-title" className="h2 text-ink">
                  {current.person.name}
                </h2>
                <p className="text-sm font-semibold text-ink">Olympia năm thứ {current.years.join(", ")}</p>
                <p className="text-sm text-ink-soft">{getSchool(current.person.school)?.name}</p>
                {current.isOss && (
                  <p className="text-xs text-ink-soft">Thí sinh OSS mùa {ossSeasonsOf(current.person.id).join(", ")}</p>
                )}
                {describeTitles(titlesOf(current.person.id)).map((t) => (
                  <p key={t} className="mt-1 text-sm font-semibold text-oss">
                    {t}
                  </p>
                ))}
              </div>
            </div>

            <h3 className="h3 mt-6 text-ink">Đường lên đỉnh Olympia</h3>
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
                    {r.beforeOss && <span className="block text-xs text-ink-soft">Tham gia trước khi dự thi OSS</span>}
                  </span>
                </li>
              ))}
            </ul>

            {current.isOss && (
              <Link to={personPath(current.person.id)} className="btn-primary mt-6">
                Xem hồ sơ đầy đủ
              </Link>
            )}
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
    <section className="section mx-auto max-w-6xl px-5">
      <h2 className="section-title">
        <IconLabel icon={PiChartBar} iconClass={TITLE_ICON}>
          Kỷ lục
        </IconLabel>
      </h2>
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
                <span className={`text-sm font-semibold ${expanded ? "text-white/80" : "text-ink-soft"}`}>
                  <IconLabel icon={RECORD_ICON[f]} iconClass={`size-5 ${expanded ? "text-white" : "text-oss"}`}>
                    {RECORD_LABEL[f]}
                  </IconLabel>
                </span>
                <span className={`font-display mt-1 text-4xl font-extrabold tabular-nums ${expanded ? "text-white" : "text-oss"}`}>
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
                  <th scope="col" className="num">
                    Hạng
                  </th>
                  <th scope="col" className="sticky-start">
                    Thí sinh
                  </th>
                  <th scope="col">Mùa</th>
                  <th scope="col">Trận</th>
                  <th scope="col" className="sticky-end num text-right">
                    Điểm
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  const medal = medalOf(r.rank);
                  return (
                    <tr
                      key={`${r.person.id}-${r.season}-${r.match?.id ?? "vl"}`}
                      className={medal ? MEDAL_ROW[medal] : undefined}
                      data-tone={medal ? "medal" : undefined}
                    >
                      <td className="num font-semibold">{r.rank}</td>
                      <td className="sticky-start">
                        <PersonLink id={r.person.id} />
                      </td>
                      <td>
                        <Link to={seasonPath(r.season)} className="hover:text-oss hover:underline">
                          Mùa {r.season}
                        </Link>
                      </td>
                      <td>{roundLabel(r.match)}</td>
                      <td className="sticky-end num text-right font-bold">{r.value}</td>
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
  return (
    <>
      <PageHeader
        tone="dark"
        title="Bảng vàng"
        description="Quán quân các mùa, những thí sinh THPT Sóc Sơn bước lên sân khấu Đường lên đỉnh Olympia và các kỷ lục điểm số."
      />

      <ChampionsSection />

      <OlympiaSection />

      <RecordsSection />

      {/* ===== Các thí sinh vào Chung kết 2 năm liên tiếp ===== */}
      <section className="section mx-auto max-w-6xl px-5">
        <h2 className="section-title">
          <IconLabel icon={PiRepeat} iconClass={TITLE_ICON}>
            Các thí sinh vào Chung kết 2 năm liên tiếp
          </IconLabel>
        </h2>
        <div className="mt-8">
          <FinalistStrips />
        </div>
      </section>
    </>
  );
}
