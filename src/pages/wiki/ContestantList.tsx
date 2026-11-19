import { useMemo, useState } from "react";
import { Link } from "react-router";
import { PiMagnifyingGlassBold } from "react-icons/pi";
import PageHeader from "../../components/PageHeader";
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
    <>
      <PageHeader
        breadcrumb={[{ to: "/wiki", label: "OSSPEDIA" }, { label: "Thí sinh" }]}
        title="Thí sinh Olympia Sóc Sơn"
        description={`${people.length} thí sinh từng lọt vào top 12 qua các mùa.`}
      />
      <section className="mx-auto max-w-6xl px-5 pb-12 md:pb-16">
        <div className="flex flex-col gap-3 sm:flex-row">
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
              {rows.map((r) => (
                <tr key={r.person.id}>
                  <td className="sticky-start">
                    <PersonLink id={r.person.id} className="font-semibold" />
                    {/* Điện thoại: tên trường thành dòng nhỏ dưới tên (cột Trường bị ẩn) */}
                    {r.school && <span className="block text-xs text-ink-soft md:hidden">{r.school.name}</span>}
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
    </>
  );
}
