import { Link } from "react-router";
import PersonLink from "../components/PersonLink";
import {
  RECORD_LABEL,
  championsList,
  defendingChampions,
  getSchool,
  matchShortLabel,
  multipleFinalists,
  olympiaContestantCount,
  olympiaLaurelCount,
  olympiaPeople,
  seasonPath,
  topRecords,
  type RecordField,
} from "../lib/data";
import { formatScore } from "../lib/format";

const RECORD_FIELDS: RecordField[] = ["total", "kd", "vcnv", "tt", "vd", "vl"];

export default function HallOfFamePage() {
  const champions = championsList();
  const olympians = olympiaPeople("all");
  const finalists = multipleFinalists(2);
  const defenders = defendingChampions();
  const scopes = [
    { label: "Chỉ THPT Sóc Sơn", contestants: olympiaContestantCount("soc-son"), laurels: olympiaLaurelCount("soc-son") },
    { label: "Mọi trường", contestants: olympiaContestantCount("all"), laurels: olympiaLaurelCount("all") },
  ];

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
                        <span className="block text-xs font-semibold text-cube-pink">Bảo vệ thành công ngôi vô địch</span>
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

      {/* ===== OSS tại ĐLĐO ===== */}
      <section className="border-y border-oss/10 bg-white/40">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <h2 className="section-title">OSS tại Đường lên đỉnh Olympia</h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {scopes.map((s) => (
              <li key={s.label} className="rounded-xl border border-oss/15 bg-white/80 p-5">
                <p className="text-sm font-semibold text-ink-soft">{s.label}</p>
                <p className="mt-2 flex flex-wrap gap-x-8 gap-y-2">
                  <span>
                    <span className="text-3xl font-extrabold text-oss tabular-nums">{s.contestants}</span>{" "}
                    <span className="text-ink-soft">thí sinh</span>
                  </span>
                  <span>
                    <span className="text-3xl font-extrabold text-cube-pink tabular-nums">{s.laurels}</span>{" "}
                    <span className="text-ink-soft">vòng nguyệt quế</span>
                  </span>
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-8 overflow-x-auto">
            <table className="data-table min-w-[44rem]">
              <thead>
                <tr>
                  <th scope="col">Thí sinh</th>
                  <th scope="col">Trường</th>
                  <th scope="col">Thành tích Đường lên đỉnh Olympia</th>
                </tr>
              </thead>
              <tbody>
                {olympians.map(({ person, records }) => (
                  <tr key={person.id}>
                    <td>
                      <PersonLink id={person.id} className="font-semibold" />
                      <span className="block text-xs text-ink-soft">OSS mùa {records[0]?.ossSeason}</span>
                    </td>
                    <td>{getSchool(person.school)?.name}</td>
                    <td>
                      <ul className="space-y-0.5">
                        {records.map((r) => (
                          <li key={`${r.year}-${r.round}`}>
                            <span className="font-semibold">{r.result}</span>{" "}
                            <span className="text-ink-soft">
                              {r.round}, năm thứ {r.year}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ===== Kỷ lục ===== */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="section-title">Kỷ lục</h2>
        <p className="mt-3 text-ink-soft">Top 5 theo từng chỉ số, giữ nguyên các thí sinh đồng điểm.</p>
        <div className="mt-8 grid gap-10 md:grid-cols-2">
          {RECORD_FIELDS.map((f) => (
            <div key={f}>
              <h3 className="text-lg font-bold text-ink">{RECORD_LABEL[f]}</h3>
              <table className="data-table mt-3">
                <tbody>
                  {topRecords(f, 5).map((r) => (
                    <tr key={`${r.person.id}-${r.season}-${r.match?.id ?? "vl"}`}>
                      <td className="w-14 text-right font-bold text-oss tabular-nums">{r.value}</td>
                      <td>
                        <PersonLink id={r.person.id} />
                      </td>
                      <td className="text-right whitespace-nowrap text-ink-soft">
                        <Link to={seasonPath(r.season)} className="hover:text-oss hover:underline">
                          Mùa {r.season}
                          {r.match && `, ${matchShortLabel(r.match)}`}
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </section>

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
