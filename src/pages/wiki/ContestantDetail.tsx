import { Fragment } from "react";
import { Link, useParams } from "react-router";
import Breadcrumb from "../../components/Breadcrumb";
import Timeline from "../../components/Timeline";
import NotFound from "../NotFound";
import {
  PLACEMENT_LABEL,
  describeTitles,
  matchShortLabel,
  personProfile,
  schoolPath,
  seasonPath,
} from "../../lib/data";
import { formatDate, formatScore } from "../../lib/format";

export default function ContestantDetail() {
  const { id } = useParams();
  const profile = personProfile(id);
  if (!profile) return <NotFound />;

  const { person, school, participations, titles, olympia, timeline } = profile;
  const titleText = describeTitles(titles);
  const olympiaYears = [...new Set(olympia.map((r) => r.year))];

  return (
    <article className="mx-auto max-w-6xl px-5 py-14 md:py-20">
      <Breadcrumb
        items={[
          { to: "/wiki", label: "OSSPEDIA" },
          { to: "/wiki/thi-sinh", label: "Thí sinh" },
          { label: person.name },
        ]}
      />
      <h1 className="mt-4 text-3xl font-bold text-ink md:text-4xl">{person.name}</h1>
      {titleText.length > 0 && <p className="mt-2 text-lg font-semibold text-oss">{titleText.join(" · ")}</p>}

      <div className="mt-8 grid items-start gap-10 md:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="min-w-0 space-y-12">
          <section>
            <h2 className="text-xl font-bold text-ink">Olympia Sóc Sơn</h2>
            <div className="mt-3 overflow-x-auto">
              <table className="data-table min-w-[40rem]">
                <thead>
                  <tr>
                    <th scope="col">Mùa</th>
                    <th scope="col">Vòng</th>
                    <th scope="col" className="text-right" title="Khởi động">KĐ</th>
                    <th scope="col" className="text-right" title="Vượt chướng ngại vật">VCNV</th>
                    <th scope="col" className="text-right" title="Tăng tốc">TT</th>
                    <th scope="col" className="text-right" title="Về đích">VĐ</th>
                    <th scope="col" className="text-right">Điểm</th>
                    <th scope="col">Kết quả</th>
                  </tr>
                </thead>
                <tbody>
                  {participations.map((p) => (
                    <Fragment key={p.season}>
                      {p.qualifying && (
                        <tr>
                          <td rowSpan={p.matches.length + 1} className="align-top">
                            <Link to={seasonPath(p.season)} className="font-semibold text-oss hover:underline">
                              Mùa {p.season}
                            </Link>
                            <span className="block text-xs text-ink-soft">Lớp {p.qualifying.class}</span>
                          </td>
                          <td>Vòng loại</td>
                          <td colSpan={4} />
                          <td className="text-right font-semibold tabular-nums">{formatScore(p.qualifying.score)}</td>
                          <td>Hạng {p.qualifying.rank}</td>
                        </tr>
                      )}
                      {p.matches.map(({ match, result }, i) => (
                        <tr key={match.id}>
                          {!p.qualifying && i === 0 && (
                            <td rowSpan={p.matches.length} className="align-top">
                              <Link to={seasonPath(p.season)} className="font-semibold text-oss hover:underline">
                                Mùa {p.season}
                              </Link>
                            </td>
                          )}
                          <td>{matchShortLabel(match)}</td>
                          <td className="text-right tabular-nums">{formatScore(result.kd)}</td>
                          <td className="text-right tabular-nums">{formatScore(result.vcnv)}</td>
                          <td className="text-right tabular-nums">{formatScore(result.tt)}</td>
                          <td className="text-right tabular-nums">{formatScore(result.vd)}</td>
                          <td className="text-right font-semibold tabular-nums">{formatScore(result.total)}</td>
                          <td>
                            {result.placement
                              ? PLACEMENT_LABEL[result.placement]
                              : result.advanced
                                ? "Vào Chung kết"
                                : `Hạng ${result.rank}`}
                            {match.tiebreakWinner === person.id && (
                              <span className="block text-xs font-semibold text-cube-pink">Thắng câu hỏi phụ</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {olympia.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-ink">Đường lên đỉnh Olympia</h2>
              <div className="mt-3 overflow-x-auto">
                <table className="data-table min-w-[32rem]">
                  <thead>
                    <tr>
                      <th scope="col">Năm thứ</th>
                      <th scope="col">Vòng thi</th>
                      <th scope="col">Kết quả</th>
                      <th scope="col">Ngày</th>
                    </tr>
                  </thead>
                  <tbody>
                    {olympia.map((r) => (
                      <tr key={`${r.year}-${r.round}`}>
                        <td className="tabular-nums">{r.year}</td>
                        <td>
                          {r.round}
                          {r.note && <span className="block text-sm font-semibold text-cube-pink">{r.note}</span>}
                        </td>
                        <td className="font-semibold">{r.result}</td>
                        <td className="tabular-nums">{r.date ? formatDate(r.date) : "–"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {timeline.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-ink">Dòng thời gian</h2>
              <div className="mt-4">
                <Timeline items={timeline} compact />
              </div>
            </section>
          )}
        </div>

        <aside className="infobox" aria-label="Thông tin nhanh">
          <dl>
            <dt>Trường</dt>
            <dd>
              {school ? (
                <Link to={schoolPath(school.id)} className="text-oss hover:underline">
                  {school.name}
                </Link>
              ) : (
                "–"
              )}
            </dd>
            <dt>Mùa tham dự</dt>
            <dd>{participations.map((p) => p.season).join(", ") || "–"}</dd>
            <dt>Danh hiệu OSS</dt>
            <dd>
              {titleText.length ? (
                <ul>
                  {titleText.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              ) : (
                "–"
              )}
            </dd>
            <dt>Tham dự Đường lên đỉnh Olympia</dt>
            <dd>{olympiaYears.length ? `Năm thứ ${olympiaYears.join(", ")}` : "–"}</dd>
          </dl>
        </aside>
      </div>
    </article>
  );
}
