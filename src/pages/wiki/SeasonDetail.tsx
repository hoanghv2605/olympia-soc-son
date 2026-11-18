import { Link, useParams } from "react-router";
import Breadcrumb from "../../components/Breadcrumb";
import MatchTable from "../../components/MatchTable";
import PersonLink from "../../components/PersonLink";
import NotFound from "../NotFound";
import { finalOf, getSchool, getSeason, podium, qualifyingOf, seasonPath, seedGroup, semifinalsOf } from "../../lib/data";
import { formatDate, formatScore } from "../../lib/format";

export default function SeasonDetail() {
  const { slug } = useParams();
  const n = Number(slug?.replace("mua-", ""));
  const season = getSeason(n);
  if (!season) return <NotFound />;

  const { champions, runnersUp } = podium(n);
  const quals = qualifyingOf(n);
  const semis = semifinalsOf(n);
  const final = finalOf(n);
  const prev = getSeason(n - 1);
  const next = getSeason(n + 1);

  return (
    <article className="mx-auto max-w-6xl px-5 py-14 md:py-20">
      <Breadcrumb
        items={[
          { to: "/wiki", label: "OSSPEDIA" },
          { to: "/wiki/cuoc-thi", label: "Các mùa giải" },
          { label: `Mùa ${n}` },
        ]}
      />
      <h1 className="mt-4 text-3xl font-bold text-ink md:text-4xl">Olympia Sóc Sơn mùa {n}</h1>

      <div className="mt-8 grid items-start gap-10 md:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="min-w-0 space-y-6 text-[17px] leading-relaxed">
          <p>
            {season.code} diễn ra trong năm học {season.schoolYear}, từ vòng loại ngày {formatDate(season.startDate)} đến
            trận Chung kết ngày {formatDate(season.finalDate)}.
            {champions.length > 0 && (
              <>
                {" "}
                Quán quân của mùa là{" "}
                {champions.map((c, i) => (
                  <span key={c.person.id}>
                    {i > 0 && ", "}
                    <PersonLink id={c.person.id} className="font-semibold" />
                  </span>
                ))}
                .
              </>
            )}
          </p>
          {season.notes.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-ink">Sự kiện đáng nhớ</h2>
              <ul className="mt-3 list-disc space-y-1.5 pl-5 marker:text-oss">
                {season.notes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <aside className="infobox" aria-label="Thông tin nhanh">
          <dl>
            <dt>Năm học</dt>
            <dd>{season.schoolYear}</dd>
            <dt>Vòng loại</dt>
            <dd className="tabular-nums">{formatDate(season.startDate)}</dd>
            <dt>Chung kết</dt>
            <dd className="tabular-nums">{formatDate(season.finalDate)}</dd>
            <dt>Địa điểm Chung kết</dt>
            <dd>{season.venue}</dd>
            <dt>Người dẫn chương trình</dt>
            <dd>
              <ul>
                {season.hosts.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </dd>
            <dt>Luật Đường lên đỉnh Olympia</dt>
            <dd>Năm thứ {season.rulesBasedOn.join(" và ")}</dd>
            <dt>Quán quân</dt>
            <dd>{champions.length ? champions.map((c) => c.person.name).join(", ") : "Đang cập nhật"}</dd>
            {runnersUp.length > 0 && (
              <>
                <dt>{runnersUp.length > 1 ? "Đồng Á quân" : "Á quân"}</dt>
                <dd>{runnersUp.map((c) => c.person.name).join(", ")}</dd>
              </>
            )}
            <dt>Đối tượng dự thi</dt>
            <dd className="font-normal">{season.eligibility}</dd>
          </dl>
        </aside>
      </div>

      {quals.length > 0 && (
        <section className="mt-14">
          <h2 className="text-2xl font-bold text-ink">Vòng loại</h2>
          <p className="mt-2 max-w-[70ch] text-ink-soft">
            {quals.length} thí sinh có kết quả cao nhất vào vòng Bán kết.
            {season.seededDraw &&
              " Các thí sinh được chia vào 3 trận Bán kết bằng bốc thăm theo nhóm hạt giống: nhóm 1 gồm hạng 1–3, nhóm 2 hạng 4–6, nhóm 3 hạng 7–9, nhóm 4 hạng 10–12."}
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="data-table min-w-[36rem]">
              <thead>
                <tr>
                  <th scope="col">Hạng</th>
                  <th scope="col">Thí sinh</th>
                  <th scope="col">Lớp</th>
                  <th scope="col">Trường</th>
                  <th scope="col" className="text-right">Điểm</th>
                  {season.seededDraw && <th scope="col" className="text-right">Nhóm hạt giống</th>}
                </tr>
              </thead>
              <tbody>
                {quals.map((q) => (
                  <tr key={q.person}>
                    <td className="tabular-nums">{q.rank}</td>
                    <td>
                      <PersonLink id={q.person} />
                    </td>
                    <td>{q.class}</td>
                    <td>{getSchool(q.school)?.name ?? q.school}</td>
                    <td className="text-right font-semibold tabular-nums">{formatScore(q.score)}</td>
                    {season.seededDraw && <td className="text-right tabular-nums">{seedGroup(q.rank)}</td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {semis.length > 0 && (
        <section className="mt-14">
          <h2 className="text-2xl font-bold text-ink">Vòng Bán kết</h2>
          <div className="mt-6 space-y-10">
            {semis.map((m) => (
              <MatchTable key={m.id} match={m} />
            ))}
          </div>
        </section>
      )}

      {final && (
        <section className="mt-14">
          <h2 className="text-2xl font-bold text-ink">Trận Chung kết</h2>
          <div className="mt-6">
            <MatchTable match={final} />
          </div>
        </section>
      )}

      <nav aria-label="Mùa trước và mùa sau" className="mt-14 flex justify-between gap-4 border-t border-oss/15 pt-6 text-sm">
        {prev ? (
          <Link to={seasonPath(prev.season)} className="link-strong">
            Mùa {prev.season}
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link to={seasonPath(next.season)} className="link-strong">
            Mùa {next.season}
          </Link>
        )}
      </nav>
    </article>
  );
}
