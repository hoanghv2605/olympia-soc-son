import { useMemo, useState } from "react";
import { Link } from "react-router";
import { PiMagnifyingGlassBold } from "react-icons/pi";
import Breadcrumb from "../../components/Breadcrumb";
import PersonLink from "../../components/PersonLink";
import { describeTitles, getSchool, participationsOf, people, schoolPath, schools, seasonPath, titlesOf } from "../../lib/data";
import { normalize } from "../../lib/format";

const ROWS = people.map((p) => ({
  person: p,
  school: getSchool(p.school),
  seasons: participationsOf(p.id).map((s) => s.season),
  titles: describeTitles(titlesOf(p.id)),
  key: normalize(p.name),
}));

export default function ContestantList() {
  const [query, setQuery] = useState("");
  const [school, setSchool] = useState("");

  const rows = useMemo(() => {
    const q = normalize(query);
    return ROWS.filter((r) => (!school || r.person.school === school) && (!q || r.key.includes(q)));
  }, [query, school]);

  return (
    <section className="mx-auto max-w-6xl px-5 py-14 md:py-20">
      <Breadcrumb items={[{ to: "/wiki", label: "OSSPEDIA" }, { label: "Thí sinh" }]} />
      <h1 className="mt-4 text-3xl font-bold text-ink md:text-4xl">Thí sinh Olympia Sóc Sơn</h1>
      <p className="mt-3 text-ink-soft">{people.length} thí sinh từng lọt vào top 12 qua các mùa.</p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <label className="flex flex-1 items-center gap-3 rounded-full border border-oss/20 bg-white/80 px-5 py-2.5 focus-within:border-oss">
          <PiMagnifyingGlassBold className="size-5 shrink-0 text-oss" aria-hidden />
          <span className="sr-only">Tìm thí sinh</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm tên, gõ không dấu cũng được"
            className="w-full bg-transparent text-[15px] outline-none placeholder:text-ink-soft/70"
          />
        </label>
        <label className="flex items-center gap-2 rounded-full border border-oss/20 bg-white/80 px-5 py-2.5 text-[15px]">
          <span className="sr-only">Lọc theo trường</span>
          <select value={school} onChange={(e) => setSchool(e.target.value)} className="bg-transparent outline-none">
            <option value="">Tất cả trường</option>
            {schools.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="mt-6 text-sm text-ink-soft" aria-live="polite">
        {rows.length} thí sinh
      </p>
      <div className="mt-2 overflow-x-auto">
        <table className="data-table min-w-[40rem]">
          <thead>
            <tr>
              <th scope="col">Thí sinh</th>
              <th scope="col">Trường</th>
              <th scope="col">Mùa tham dự</th>
              <th scope="col">Danh hiệu OSS</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.person.id}>
                <td>
                  <PersonLink id={r.person.id} className="font-semibold" />
                </td>
                <td>
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
                    <span key={s}>
                      {i > 0 && ", "}
                      <Link to={seasonPath(s)} className="hover:text-oss hover:underline">
                        {s}
                      </Link>
                    </span>
                  ))}
                </td>
                <td>{r.titles.length ? r.titles.join("; ") : "–"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
