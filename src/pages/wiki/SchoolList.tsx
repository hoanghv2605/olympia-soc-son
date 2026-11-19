import { Link } from "react-router";
import Breadcrumb from "../../components/Breadcrumb";
import SchoolBadge from "../../components/SchoolBadge";
import { schoolPath, schoolStats, schoolsOverview, type SchoolStat } from "../../lib/data";

const MEDAL_CELLS = [
  { key: "champions", label: "Quán quân", ring: "border-gold bg-gold-bg text-gold-ink" },
  { key: "runnersUp", label: "Á quân", ring: "border-silver bg-silver-bg text-silver-ink" },
  { key: "thirds", label: "Quý quân", ring: "border-bronze bg-bronze-bg text-bronze-ink" },
] as const;

function SchoolCard({ stat }: { stat: SchoolStat }) {
  const { school } = stat;
  return (
    <Link
      to={schoolPath(school.id)}
      className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-4 gap-y-4 rounded-2xl border border-oss/15 bg-white/80 p-4 transition duration-200 hover:-translate-y-0.5 hover:border-oss focus-visible:-translate-y-0.5 focus-visible:border-oss motion-reduce:transition-colors motion-reduce:hover:translate-y-0 motion-reduce:focus-visible:translate-y-0 md:grid-cols-[auto_minmax(0,1fr)_auto] md:p-5"
    >
      <SchoolBadge school={school} className="size-11 md:size-14" textClass="text-sm md:text-base" />

      <span className="min-w-0">
        <span className="block text-lg leading-snug font-bold text-ink">{school.name}</span>
        <span className="block text-sm text-ink-soft">
          <span className="tabular-nums">{stat.people.length}</span> thí sinh ·{" "}
          <span className="tabular-nums">{stat.top12}</span> lượt vào top 12
        </span>
      </span>

      {/* 3 ô huy chương: căn phải trên máy tính, thành 1 hàng riêng trên điện thoại */}
      <span className="col-span-2 grid grid-cols-3 gap-2 md:col-span-1 md:flex md:gap-4">
        {MEDAL_CELLS.map((m) => {
          const value = stat[m.key];
          return (
            <span
              key={m.key}
              role="img"
              aria-label={`${value} ${m.label}`}
              className={`flex flex-col items-center gap-1 md:w-[4.5rem] ${value === 0 ? "opacity-35" : ""}`}
            >
              <span className={`grid size-10 place-items-center rounded-full border-2 font-bold tabular-nums ${m.ring}`}>
                {value}
              </span>
              <span className="text-xs text-ink-soft">{m.label}</span>
            </span>
          );
        })}
      </span>

      {/* Thanh tỉ lệ lượt vào top 12 */}
      <span className="col-span-full flex items-center gap-3">
        <span
          role="img"
          aria-label={`Chiếm ${stat.share}% trong ${stat.totalTop12} lượt vào top 12`}
          className="h-1.5 flex-1 overflow-hidden rounded-full bg-oss-soft"
        >
          <span className="block h-full rounded-full bg-oss" style={{ width: `${(stat.top12 / stat.totalTop12) * 100}%` }} />
        </span>
        <span className="w-9 text-right text-xs font-semibold text-ink-soft tabular-nums" aria-hidden="true">
          {stat.share}%
        </span>
      </span>
    </Link>
  );
}

export default function SchoolList() {
  const stats = schoolStats();
  const overview = schoolsOverview();
  return (
    <section className="mx-auto max-w-6xl px-5 py-14 md:py-20">
      <Breadcrumb items={[{ to: "/wiki", label: "OSSPEDIA" }, { label: "Trường" }]} />
      <h1 className="mt-4 text-3xl font-bold text-ink md:text-4xl">Các trường</h1>
      <p className="mt-3 max-w-[60ch] text-ink-soft">
        {overview.people} thí sinh từ {overview.schools} trường đã vào top 12 qua {overview.seasons} mùa OSS.
      </p>

      <ul className="mt-8 space-y-3.5">
        {stats.map((s) => (
          <li key={s.school.id}>
            <SchoolCard stat={s} />
          </li>
        ))}
      </ul>
    </section>
  );
}
