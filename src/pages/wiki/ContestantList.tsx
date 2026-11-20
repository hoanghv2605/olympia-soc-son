import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { PiFunnel, PiMagnifyingGlassBold } from "react-icons/pi";
import PageHeader from "../../components/PageHeader";
import PersonLink from "../../components/PersonLink";
import PersonPhoto from "../../components/PersonPhoto";
import ResultBadge from "../../components/ResultBadge";
import { describeTitles, people, personPath, personPhoto, schoolPath, schools, seasonPath, seasons, titlesOf } from "../../lib/data";
import {
  PRIZE_LABEL,
  SORT_LABEL,
  activeFilterCount,
  applyFilters,
  filtersFromParams,
  paramsFromFilters,
  topTitle,
  type Filters,
  type PrizeFilter,
  type Row,
  type SortKey,
} from "../../lib/contestants";
import { medalOf } from "../../lib/medal";

type View = "cards" | "table";
const VIEW_KEY = "oss-contestant-view";

function loadView(): View {
  try {
    return localStorage.getItem(VIEW_KEY) === "table" ? "table" : "cards";
  } catch {
    return "cards";
  }
}

const selectCls = "w-full rounded-full border border-oss/20 bg-white/80 px-4 py-2 text-[15px] outline-none focus:border-oss";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm font-semibold text-ink-soft">
      <span className="mb-1 block">{label}</span>
      {children}
    </label>
  );
}

function Card({ r, mua }: { r: Row; mua: number | null }) {
  const title = topTitle(r, mua);
  const seasonsText = r.seasons.map((s) => s.season).join(", ");
  return (
    <Link
      to={personPath(r.person.id)}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-oss/15 bg-white/80 transition duration-200 hover:-translate-y-0.5 hover:border-oss focus-visible:-translate-y-0.5 focus-visible:border-oss motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      <PersonPhoto
        decorative
        src={personPhoto(r.person.id, mua !== null ? { season: mua } : undefined)}
        seed={r.person.id}
        name={r.person.name}
        className="aspect-[3/4] w-full"
      />
      <span className="flex flex-1 flex-col gap-1 p-3.5">
        <span className="font-bold text-ink group-hover:text-oss">{r.person.name}</span>
        {r.school && <span className="text-xs text-ink-soft">{r.school.name}</span>}
        <span className="text-xs text-ink-soft">Mùa {seasonsText}</span>
        <span className="mt-auto pt-2">
          {title ? (
            <ResultBadge medal={medalOf(title.placement)}>{title.label}</ResultBadge>
          ) : (
            <span className="text-xs text-ink-soft">Top 12</span>
          )}
        </span>
      </span>
    </Link>
  );
}

export default function ContestantList() {
  const [params, setParams] = useSearchParams();
  const filters = useMemo(() => filtersFromParams(params), [params]);
  const [view, setView] = useState<View>(loadView);
  const [panel, setPanel] = useState(false);

  const rows = useMemo(() => applyFilters(filters), [filters]);
  const active = activeFilterCount(filters);
  const dirty = active > 0 || filters.q !== "";

  const update = (patch: Partial<Filters>) => setParams(paramsFromFilters({ ...filters, ...patch }), { replace: true });
  const clear = () => setParams(paramsFromFilters({ ...filters, q: "", truong: "", mua: null, giai: null }), { replace: true });
  const choose = (v: View) => {
    setView(v);
    try {
      localStorage.setItem(VIEW_KEY, v);
    } catch {
      /* bỏ qua: chế độ riêng tư / chặn dữ liệu trang */
    }
  };

  return (
    <>
      <PageHeader
        breadcrumb={[{ to: "/wiki", label: "OSSPEDIA" }, { label: "Thí sinh" }]}
        title="Thí sinh Olympia Sóc Sơn"
        description={`${people.length} thí sinh từng lọt vào top 12 qua các mùa.`}
      />
      <section className="mx-auto max-w-6xl px-5 pb-12 md:pb-16">
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex min-w-0 flex-1 items-center gap-3 rounded-full border border-oss/20 bg-white/80 px-5 py-2.5 focus-within:border-oss sm:min-w-[16rem]">
            <PiMagnifyingGlassBold className="size-5 shrink-0 text-oss" aria-hidden />
            <span className="sr-only">Tìm thí sinh</span>
            <input
              type="search"
              value={filters.q}
              onChange={(e) => update({ q: e.target.value })}
              placeholder="Tìm tên, gõ không dấu cũng được"
              className="w-full bg-transparent text-[15px] outline-none placeholder:text-ink-soft/70"
            />
          </label>
          <button
            type="button"
            aria-expanded={panel}
            aria-controls="contestant-filters"
            onClick={() => setPanel((o) => !o)}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-oss/25 bg-white/70 px-4 text-sm font-semibold text-oss md:hidden"
          >
            <PiFunnel className="size-4" aria-hidden />
            Bộ lọc{active > 0 ? ` (${active})` : ""}
          </button>
          <div className="inline-flex rounded-full border border-oss/25 bg-white/70 p-1 text-sm font-semibold">
            {(["cards", "table"] as const).map((v) => (
              <button
                key={v}
                type="button"
                aria-pressed={view === v}
                onClick={() => choose(v)}
                className="min-h-9 rounded-full px-4 text-oss aria-pressed:bg-oss aria-pressed:text-white"
              >
                {v === "cards" ? "Thẻ" : "Bảng"}
              </button>
            ))}
          </div>
        </div>

        <div id="contestant-filters" className={`mt-4 grid-cols-2 gap-3 md:grid md:grid-cols-4 ${panel ? "grid" : "hidden"}`}>
          <Field label="Trường">
            <select value={filters.truong} onChange={(e) => update({ truong: e.target.value })} className={selectCls}>
              <option value="">Tất cả</option>
              {schools.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Mùa">
            <select
              value={filters.mua ?? ""}
              onChange={(e) => update({ mua: e.target.value ? Number(e.target.value) : null })}
              className={selectCls}
            >
              <option value="">Tất cả</option>
              {seasons.map((s) => (
                <option key={s.season} value={s.season}>
                  Mùa {s.season}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Giải">
            <select
              value={filters.giai ?? ""}
              onChange={(e) => update({ giai: (e.target.value || null) as PrizeFilter | null })}
              className={selectCls}
            >
              <option value="">Tất cả</option>
              {(Object.keys(PRIZE_LABEL) as PrizeFilter[]).map((k) => (
                <option key={k} value={k}>
                  {PRIZE_LABEL[k]}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Sắp xếp">
            <select value={filters.sort} onChange={(e) => update({ sort: e.target.value as SortKey })} className={selectCls}>
              {(Object.keys(SORT_LABEL) as SortKey[]).map((k) => (
                <option key={k} value={k}>
                  {SORT_LABEL[k]}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
          <p className="text-sm text-ink-soft" aria-live="polite">
            Hiển thị {rows.length} / {people.length} thí sinh
          </p>
          {dirty && (
            <button type="button" onClick={clear} className="link-strong text-sm">
              Xoá bộ lọc
            </button>
          )}
        </div>

        {rows.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-oss/30 bg-white/50 px-6 py-12 text-center">
            <p className="text-ink">Không có thí sinh nào khớp bộ lọc.</p>
            <button type="button" onClick={clear} className="btn-primary mt-5">
              Xoá bộ lọc
            </button>
          </div>
        ) : view === "cards" ? (
          <ul className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-5 lg:grid-cols-4">
            {rows.map((r) => (
              <li key={r.person.id}>
                <Card r={r} mua={filters.mua} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-2 overflow-x-auto">
            <table className="data-table min-w-[28rem] md:min-w-[40rem]">
              <thead>
                <tr>
                  <th scope="col" className="sticky-start">
                    Thí sinh
                  </th>
                  <th scope="col" className="hidden md:table-cell">
                    Trường
                  </th>
                  <th scope="col">Mùa tham dự</th>
                  <th scope="col">Danh hiệu OSS</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  const titles = describeTitles(titlesOf(r.person.id));
                  return (
                    <tr key={r.person.id}>
                      <td className="sticky-start">
                        <span className="flex items-center gap-2.5">
                          <PersonPhoto
                            decorative
                            src={personPhoto(r.person.id, filters.mua !== null ? { season: filters.mua } : undefined)}
                            seed={r.person.id}
                            name={r.person.name}
                            className="size-7 shrink-0 rounded-full"
                          />
                          <span className="min-w-0">
                            <PersonLink id={r.person.id} className="font-semibold" />
                            {/* Điện thoại: tên trường thành dòng nhỏ dưới tên (cột Trường bị ẩn) */}
                            {r.school && <span className="block text-xs text-ink-soft md:hidden">{r.school.name}</span>}
                          </span>
                        </span>
                      </td>
                      <td className="hidden md:table-cell">
                        {r.school ? (
                          <Link to={schoolPath(r.school.id)} className="hover:text-oss hover:underline">
                            {r.school.name}
                          </Link>
                        ) : (
                          "–"
                        )}
                      </td>
                      <td className="tabular-nums">
                        {r.seasons.map((s, i) => (
                          <span key={s.season}>
                            {i > 0 && ", "}
                            <Link to={seasonPath(s.season)} className="hover:text-oss hover:underline">
                              {s.season}
                            </Link>
                          </span>
                        ))}
                      </td>
                      <td>{titles.length ? titles.join("; ") : "–"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
