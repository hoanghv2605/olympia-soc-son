import { useMemo, useState } from "react";
import { Link } from "react-router";
import { PiMagnifyingGlassBold } from "react-icons/pi";
import { championsList, people, schoolPath, schools, search, seasonPath } from "../../lib/data";

const KIND_LABEL = { season: "Mùa giải", person: "Thí sinh", school: "Trường" } as const;

export default function WikiHome() {
  const [query, setQuery] = useState("");
  const results = useMemo(() => search(query), [query]);

  return (
    <section className="mx-auto max-w-6xl px-5 py-14 md:py-20">
      <h1 className="text-4xl font-extrabold tracking-tight text-oss md:text-5xl">OSSPEDIA</h1>
      <p className="mt-3 max-w-[60ch] text-[17px] text-balance text-ink-soft lg:max-w-none">
        Bách khoa thư về Olympia Sóc Sơn: các mùa giải, thí sinh, trường và thành tích tại Đường lên đỉnh Olympia.
      </p>

      <label className="mt-8 flex max-w-xl items-center gap-3 rounded-full border border-oss/20 bg-white/80 px-5 py-3 focus-within:border-oss">
        <PiMagnifyingGlassBold className="size-5 shrink-0 text-oss" aria-hidden />
        <span className="sr-only">Tìm trong OSSPEDIA</span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tìm thí sinh, mùa giải, trường, vd: mùa 5, Trà My, Đa Phúc"
          className="w-full bg-transparent text-[15px] outline-none placeholder:text-ink-soft/70"
        />
      </label>

      {query ? (
        <div className="mt-10" aria-live="polite">
          <p className="text-sm text-ink-soft">
            {results.length
              ? `${results.length} kết quả cho “${query}”`
              : `Không có kết quả cho “${query}”. Thử tìm tên không dấu hoặc số mùa.`}
          </p>
          <ul className="mt-4 divide-y divide-oss/10 border-y border-oss/10">
            {results.map((r) => (
              <li key={r.to}>
                <Link to={r.to} className="flex items-start justify-between gap-4 px-1 py-3 hover:bg-white/50">
                  <span>
                    <span className="block font-semibold text-ink">{r.title}</span>
                    <span className="block text-sm text-ink-soft">{r.subtitle}</span>
                  </span>
                  <span className="shrink-0 rounded-full bg-oss-soft px-2 py-0.5 text-xs font-semibold text-oss">
                    {KIND_LABEL[r.kind]}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="mt-14 grid gap-14 md:grid-cols-3">
          <div>
            <h2 className="text-xl font-bold text-ink">Các mùa giải</h2>
            <ul className="mt-4 divide-y divide-oss/10 border-y border-oss/10">
              {championsList().map(({ season: s, champions }) => (
                <li key={s.season}>
                  <Link to={seasonPath(s.season)} className="flex justify-between gap-4 px-1 py-2.5 hover:bg-white/50">
                    <span className="font-medium text-oss">Mùa {s.season}</span>
                    <span className="text-right text-ink-soft">{champions.map((c) => c.person.name).join(", ")}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link to="/wiki/cuoc-thi" className="link-strong mt-4 inline-block text-sm">
              Bảng tổng hợp các mùa
            </Link>
          </div>

          <div>
            <h2 className="text-xl font-bold text-ink">Thí sinh</h2>
            <p className="mt-4 text-ink-soft">
              Hồ sơ {people.length} thí sinh lọt vào top 12: điểm từng trận, danh hiệu và hành trình tại Đường lên đỉnh Olympia.
            </p>
            <Link to="/wiki/thi-sinh" className="link-strong mt-4 inline-block text-sm">
              Danh sách thí sinh
            </Link>
          </div>

          <div>
            <h2 className="text-xl font-bold text-ink">Trường</h2>
            <ul className="mt-4 divide-y divide-oss/10 border-y border-oss/10">
              {schools.map((s) => (
                <li key={s.id}>
                  <Link to={schoolPath(s.id)} className="block px-1 py-2.5 font-medium text-oss hover:bg-white/50">
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
            <Link to="/wiki/truong" className="link-strong mt-4 inline-block text-sm">
              Thống kê các trường
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
