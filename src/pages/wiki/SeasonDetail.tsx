import { Fragment, type ReactNode } from "react";
import { Link, useParams } from "react-router";
import Breadcrumb from "../../components/Breadcrumb";
import MatchTable from "../../components/MatchTable";
import PersonLink from "../../components/PersonLink";
import NotFound from "../NotFound";
import {
  finalOf,
  getSchool,
  getSeason,
  podium,
  qualifyingOf,
  seasonPath,
  seedGroup,
  semifinalsOf,
  type PlacedResult,
} from "../../lib/data";
import { formatDate, formatScore, scrollToId, seasonOrdinal } from "../../lib/format";

/** Nối các phần: "A", "A và B", "A, B và C". */
function joinVi(parts: ReactNode[]) {
  return parts.map((p, i) => (
    <Fragment key={i}>
      {i > 0 && (i === parts.length - 1 ? " và " : ", ")}
      {p}
    </Fragment>
  ));
}

/** "Tên (lớp 11A1, THPT Sóc Sơn)" */
function withClass(c: PlacedResult) {
  return (
    <>
      <PersonLink id={c.person.id} className="font-semibold" /> (lớp {c.result.class}, {getSchool(c.result.school)?.name ?? c.result.school})
    </>
  );
}

/** Nút chuyển mùa. `spread`: dàn 2 nút ra 2 bên (dùng ở cuối trang). */
function SeasonNav({ n, className = "", spread = false }: { n: number; className?: string; spread?: boolean }) {
  const prev = getSeason(n - 1);
  const next = getSeason(n + 1);
  return (
    <nav aria-label="Chuyển mùa" className={`flex items-center gap-2 text-sm ${className}`}>
      {spread && !prev && <span />}
      {prev && (
        <Link to={seasonPath(prev.season)} className="rounded-full border border-oss/25 bg-white/70 px-3.5 py-1.5 font-semibold text-oss hover:border-oss">
          ‹ Mùa {prev.season}
        </Link>
      )}
      {next && (
        <Link to={seasonPath(next.season)} className="rounded-full border border-oss/25 bg-white/70 px-3.5 py-1.5 font-semibold text-oss hover:border-oss">
          Mùa {next.season} ›
        </Link>
      )}
    </nav>
  );
}

export default function SeasonDetail() {
  const { slug } = useParams();
  const n = Number(slug?.replace("mua-", ""));
  const season = getSeason(n);
  if (!season) return <NotFound />;

  const { champions, runnersUp, thirds } = podium(n);
  const quals = qualifyingOf(n);
  const semis = semifinalsOf(n);
  const final = finalOf(n);
  const code = season.code;

  const toc = [
    ...(quals.length ? [{ id: "vong-loai", label: "Vòng loại", children: [] as { id: string; label: string }[] }] : []),
    ...(semis.length
      ? [
          {
            id: "ban-ket",
            label: "Vòng Bán kết",
            children: semis.map((m) => ({ id: `ban-ket-${m.number}`, label: `Bán kết ${m.number}` })),
          },
        ]
      : []),
    ...(final ? [{ id: "chung-ket", label: "Trận Chung kết", children: [] }] : []),
  ];

  return (
    <article className="mx-auto max-w-6xl px-5 py-14 md:py-20">
      <Breadcrumb
        items={[
          { to: "/wiki", label: "OSSPEDIA" },
          { to: "/wiki/cuoc-thi", label: "Các mùa giải" },
          { label: `Mùa ${n}` },
        ]}
      />
      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-ink md:text-4xl">Olympia Sóc Sơn mùa {n}</h1>
        <SeasonNav n={n} />
      </div>

      <div className="mt-8 grid items-start gap-10 md:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="min-w-0 space-y-5 text-[17px] leading-relaxed">
          <p>
            <strong>Olympia Sóc Sơn mùa {n}</strong>, thường được gọi tắt là <strong>{code}</strong>, là năm{" "}
            {seasonOrdinal(n)} cuộc thi Olympia Sóc Sơn dành cho học sinh THPT tại Sóc Sơn. Cuộc thi bắt đầu từ vòng loại ngày{" "}
            {formatDate(season.startDate)} và trận Chung kết diễn ra ngày {formatDate(season.finalDate)} tại {season.venue}.
          </p>
          <p>
            Đối tượng tham gia là {season.eligibility}. Luật chơi của {code} được mô phỏng dựa theo luật chơi của chương trình
            Đường lên đỉnh Olympia năm thứ {season.rulesBasedOn.join(" và ")}.
          </p>
          {champions.length > 0 && (
            <p>
              Quán quân của {code} là{" "}
              {joinVi(
                champions.map((c) => (
                  <>
                    <PersonLink id={c.person.id} className="font-semibold" />, học sinh lớp {c.result.class} trường{" "}
                    {getSchool(c.result.school)?.name ?? c.result.school}
                  </>
                )),
              )}
              .
              {runnersUp.length > 0 && (
                <>
                  {" "}
                  {runnersUp.length > 1 ? "Đồng Á quân" : "Á quân"} là {joinVi(runnersUp.map(withClass))}.
                </>
              )}
              {thirds.length > 0 && <> Quý quân là {joinVi(thirds.map(withClass))}.</>}
            </p>
          )}

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

          {toc.length > 0 && (
            <nav aria-label="Mục lục" className="inline-block rounded-xl border border-oss/15 bg-white/75 px-5 py-4 text-[15px]">
              <p className="text-sm font-semibold text-ink-soft">Mục lục</p>
              <ol className="mt-2 space-y-1">
                {toc.map((t, i) => (
                  <li key={t.id}>
                    <button type="button" onClick={() => scrollToId(t.id)} className="text-left text-oss hover:underline">
                      {i + 1}. {t.label}
                    </button>
                    {t.children.length > 0 && (
                      <ol className="mt-1 space-y-1 pl-5">
                        {t.children.map((c, j) => (
                          <li key={c.id}>
                            <button type="button" onClick={() => scrollToId(c.id)} className="text-left text-oss hover:underline">
                              {i + 1}.{j + 1}. {c.label}
                            </button>
                          </li>
                        ))}
                      </ol>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          )}
        </div>

        <aside className="infobox" aria-label="Thông tin nhanh">
          <dl>
            <dt>Tên khác</dt>
            <dd>{code}</dd>
            <dt>Năm học</dt>
            <dd>{season.schoolYear}</dd>
            <dt>Thời gian</dt>
            <dd className="tabular-nums">
              {formatDate(season.startDate)} – {formatDate(season.finalDate)}
            </dd>
            <dt>Dẫn chương trình</dt>
            <dd>
              <ul>
                {season.hosts.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </dd>
            <dt>Quán quân</dt>
            <dd>
              {champions.length
                ? champions.map((c) => (
                    <span key={c.person.id} className="block">
                      <PersonLink id={c.person.id} className="font-semibold" />
                      <span className="block text-xs font-normal text-ink-soft">
                        Lớp {c.result.class}, {getSchool(c.result.school)?.name ?? c.result.school}
                      </span>
                    </span>
                  ))
                : "Đang cập nhật"}
            </dd>
          </dl>
        </aside>
      </div>

      {quals.length > 0 && (
        <section id="vong-loai" className="mt-14 scroll-mt-24">
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
        <section id="ban-ket" className="mt-14 scroll-mt-24">
          <h2 className="text-2xl font-bold text-ink">Vòng Bán kết</h2>
          <div className="mt-6 space-y-10">
            {semis.map((m) => (
              <MatchTable key={m.id} match={m} id={`ban-ket-${m.number}`} />
            ))}
          </div>
        </section>
      )}

      {final && (
        <section id="chung-ket" className="mt-14 scroll-mt-24">
          <h2 className="text-2xl font-bold text-ink">Trận Chung kết</h2>
          <div className="mt-6">
            <MatchTable match={final} />
          </div>
        </section>
      )}

      <SeasonNav n={n} spread className="mt-14 justify-between border-t border-oss/15 pt-6" />
    </article>
  );
}
