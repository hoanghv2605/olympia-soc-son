import { Fragment } from "react";
import { Link, useParams } from "react-router";
import Breadcrumb from "../../components/Breadcrumb";
import { PiCalendarBlank, PiGraduationCap, PiTelevisionSimple, PiTrophy } from "react-icons/pi";
import IconLabel from "../../components/IconLabel";
import { ScoreHeads, TiebreakNote } from "../../components/MatchTable";
import ResultBadge from "../../components/ResultBadge";
import SeasonPhotoSwitcher from "../../components/SeasonPhotoSwitcher";
import Timeline from "../../components/Timeline";
import NotFound from "../NotFound";
import {
  describeTitles,
  eventPath,
  eventShortName,
  eventTimeLabel,
  eventsOfPerson,
  ossSeasonsOf,
  personProfile,
  schoolPath,
  resultLabel,
  roundLabel,
  seasonPath,
  tiebreakInfo,
} from "../../lib/data";
import { formatScore } from "../../lib/format";
import { medalOf } from "../../lib/medal";

export default function ContestantDetail() {
  const { id } = useParams();
  const profile = personProfile(id);
  if (!profile) return <NotFound />;

  const { person, school, participations, titles, olympia, timeline } = profile;
  const titleText = describeTitles(titles);
  const personEvents = eventsOfPerson(person.id);
  const olympiaYears = [...new Set(olympia.map((r) => r.year))];
  // Các trận người này thắng câu hỏi phụ (chú thích dưới bảng, đánh dấu *)
  const tiebreaks = participations.flatMap((p) =>
    p.matches.flatMap(({ match }) => {
      const t = tiebreakInfo(match);
      return t?.winner === person.id ? [{ match, ...t }] : [];
    }),
  );

  return (
    <article className="mx-auto max-w-6xl px-5 pt-12 pb-12 md:pt-16 md:pb-16">
      <Breadcrumb
        items={[
          { to: "/wiki", label: "OSSPEDIA" },
          { to: "/wiki/thi-sinh", label: "Thí sinh" },
          { label: person.name },
        ]}
      />

      <div className="mt-4 grid items-start gap-10 md:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="min-w-0 space-y-12">
          <header>
            <h1 className="h1 text-ink">{person.name}</h1>
            {titleText.length > 0 && <p className="mt-2 text-lg font-semibold text-oss">{titleText.join(" · ")}</p>}
          </header>

          <section>
            <h2 className="h3 text-ink">Olympia Sóc Sơn</h2>
            <div className="mt-3 overflow-x-auto">
              <table className="data-table min-w-[40rem]">
                <thead>
                  <tr>
                    <th scope="col" className="sticky-start">
                      Mùa
                    </th>
                    <th scope="col">Vòng</th>
                    <ScoreHeads />
                    <th scope="col" className="num text-right">
                      Điểm
                    </th>
                    <th scope="col" className="sticky-end">
                      Kết quả
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {participations.map((p) => (
                    <Fragment key={p.season}>
                      {p.qualifying && (
                        <tr>
                          <td rowSpan={p.matches.length + 1} className="sticky-start align-top">
                            <Link to={seasonPath(p.season)} className="font-semibold text-oss hover:underline">
                              Mùa {p.season}
                            </Link>
                            <span className="block text-xs text-ink-soft">Lớp {p.qualifying.class}</span>
                          </td>
                          <td>{roundLabel()}</td>
                          <td colSpan={4} />
                          <td className="num text-right font-semibold">{formatScore(p.qualifying.score)}</td>
                          <td className="sticky-end">
                            <ResultBadge medal={medalOf(p.qualifying.rank)}>{resultLabel(undefined, p.qualifying)}</ResultBadge>
                          </td>
                        </tr>
                      )}
                      {p.matches.map(({ match, result }, i) => (
                        <tr key={match.id}>
                          {!p.qualifying && i === 0 && (
                            <td rowSpan={p.matches.length} className="sticky-start align-top">
                              <Link to={seasonPath(p.season)} className="font-semibold text-oss hover:underline">
                                Mùa {p.season}
                              </Link>
                            </td>
                          )}
                          <td>{roundLabel(match)}</td>
                          <td className="num text-right">{formatScore(result.kd)}</td>
                          <td className="num text-right">{formatScore(result.vcnv)}</td>
                          <td className="num text-right">{formatScore(result.tt)}</td>
                          <td className="num text-right">{formatScore(result.vd)}</td>
                          <td className="num text-right font-semibold">{formatScore(result.total)}</td>
                          <td className="sticky-end">
                            <ResultBadge medal={match.round === "chung-ket" ? medalOf(result.placement) : medalOf(resultLabel(match, result))}>
                              {resultLabel(match, result)}
                            </ResultBadge>
                            {tiebreaks.some((t) => t.match.id === match.id) && <span aria-hidden>*</span>}
                          </td>
                        </tr>
                      ))}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
            {tiebreaks.map((t) => (
              <TiebreakNote key={t.match.id} winner={t.winner} tiedWith={t.tiedWith} />
            ))}
          </section>

          {olympia.length > 0 && (
            <section>
              <h2 className="h3 text-ink">Đường lên đỉnh Olympia</h2>
              <div className="mt-3 overflow-x-auto">
                <table className="data-table min-w-[26rem]">
                  <thead>
                    <tr>
                      <th scope="col">Năm thứ</th>
                      <th scope="col">Vòng thi</th>
                      <th scope="col">Kết quả</th>
                    </tr>
                  </thead>
                  <tbody>
                    {olympia.map((r) => (
                      <tr key={`${r.year}-${r.round}`}>
                        <td className="tabular-nums">{r.year}</td>
                        <td>
                          {r.round}
                          {r.note && <span className="block text-sm font-semibold text-cube-pink">{r.note}</span>}
                          {r.beforeOss && <span className="block text-xs text-ink-soft">Tham gia trước khi dự thi OSS</span>}
                        </td>
                        <td>
                          <ResultBadge medal={medalOf(r.result)}>{r.result}</ResultBadge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {timeline.length > 0 && (
            <section>
              <h2 className="h3 text-ink">Dòng thời gian</h2>
              <div className="mt-4">
                <Timeline items={timeline} compact />
              </div>
            </section>
          )}

          {personEvents.length > 0 && (
            <section>
              <h2 className="h3 text-ink">Sự kiện khác</h2>
              <div className="mt-3 overflow-x-auto">
                <table className="data-table min-w-[26rem]">
                  <thead>
                    <tr>
                      <th scope="col">Sự kiện</th>
                      <th scope="col">Năm</th>
                      <th scope="col">Kết quả</th>
                    </tr>
                  </thead>
                  <tbody>
                    {personEvents.map(({ event, result, plain }) => (
                      <tr key={event.id}>
                        <td>
                          <Link to={eventPath(event.id)} className="font-semibold text-oss hover:underline">
                            {eventShortName(event)}
                          </Link>
                        </td>
                        <td className="tabular-nums">{eventTimeLabel(event, { short: true })}</td>
                        <td>
                          {result ? <ResultBadge medal={result.medal}>{result.label}</ResultBadge> : (plain ?? "—")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </div>

        <aside className="infobox" aria-label="Thông tin nhanh">
          <SeasonPhotoSwitcher
            personId={person.id}
            name={person.name}
            seasons={ossSeasonsOf(person.id)}
            olympiaYears={olympiaYears}
            events={personEvents.filter((e) => e.event.photoKey).map((e) => ({ id: e.event.id, label: e.event.photoLabel ?? e.event.name }))}
          />
          <dl>
            <dt>
              <IconLabel icon={PiGraduationCap}>Trường</IconLabel>
            </dt>
            <dd>
              {school ? (
                <Link to={schoolPath(school.id)} className="text-oss hover:underline">
                  {school.name}
                </Link>
              ) : (
                "–"
              )}
            </dd>
            <dt>
              <IconLabel icon={PiCalendarBlank}>Mùa tham dự</IconLabel>
            </dt>
            <dd>{participations.map((p) => p.season).join(", ") || "–"}</dd>
            {titleText.length > 0 && (
              <>
                <dt>
                  <IconLabel icon={PiTrophy}>Danh hiệu OSS</IconLabel>
                </dt>
                <dd>
                  <ul>
                    {titleText.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </dd>
              </>
            )}
            {olympiaYears.length > 0 && (
              <>
                <dt>
                  <IconLabel icon={PiTelevisionSimple}>Tham dự Đường lên đỉnh Olympia</IconLabel>
                </dt>
                <dd>Năm thứ {olympiaYears.join(", ")}</dd>
              </>
            )}
          </dl>
        </aside>
      </div>
    </article>
  );
}
