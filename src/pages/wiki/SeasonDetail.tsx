import { Fragment, type ReactNode } from "react";
import { Link, useParams } from "react-router";
import { PiCalendarBlank, PiCrown, PiImages, PiMicrophone } from "react-icons/pi";
import PageHeader from "../../components/PageHeader";
import IconLabel from "../../components/IconLabel";
import ClimbChart from "../../components/ClimbChart";
import LegendPopover from "../../components/LegendPopover";
import MatchPhoto from "../../components/MatchPhoto";
import MatchTable, { FinalLegendBody, SemiLegendBody } from "../../components/MatchTable";
import PersonLink from "../../components/PersonLink";
import NotFound from "../NotFound";
import {
  finalOf,
  getSchool,
  getSeason,
  libraryCount,
  libraryPath,
  matchPhoto,
  podium,
  qualifyingOf,
  seasonPath,
  semifinalsOf,
  type PlacedResult,
} from "../../lib/data";
import { SeasonContext } from "../../lib/seasonContext";
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
    <SeasonContext.Provider value={n}>
      <PageHeader
        breadcrumb={[
          { to: "/wiki", label: "OSSPEDIA" },
          { to: "/wiki/cuoc-thi", label: "Các mùa giải" },
          { label: `Mùa ${n}` },
        ]}
        title={`Olympia Sóc Sơn mùa ${n}`}
        description={`Năm học ${season.schoolYear} · Chung kết ngày ${formatDate(season.finalDate)}.`}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            {libraryCount(n) > 0 && (
              <Link
                to={libraryPath(n)}
                className="inline-flex items-center gap-1.5 rounded-full border border-oss/25 bg-white/70 px-3.5 py-1.5 text-sm font-semibold text-oss hover:border-oss"
              >
                <PiImages className="size-4" aria-hidden />
                Thư viện ảnh
              </Link>
            )}
            <SeasonNav n={n} />
          </div>
        }
        backdrop={final ? matchPhoto(final.id) : undefined}
      />
      <article className="mx-auto max-w-6xl px-5 pb-12 md:pb-16">
        <div className="grid items-start gap-10 md:grid-cols-[minmax(0,1fr)_18rem]">
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
                <h2 className="h3 text-ink">Sự kiện đáng nhớ</h2>
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
              <dt>
                <IconLabel icon={PiCalendarBlank}>Thời gian</IconLabel>
              </dt>
              <dd className="tabular-nums">
                {formatDate(season.startDate)} – {formatDate(season.finalDate)}
              </dd>
              <dt>
                <IconLabel icon={PiMicrophone}>Dẫn chương trình</IconLabel>
              </dt>
              <dd>
                <ul>
                  {season.hosts.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
              </dd>
              <dt>
                <IconLabel icon={PiCrown}>Quán quân</IconLabel>
              </dt>
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
          <section id="vong-loai" className="mt-12 scroll-mt-24 md:mt-16">
            <h2 className="h2 text-ink">Vòng loại</h2>
            <p className="mt-2 max-w-[70ch] text-ink-soft">
              {quals.length} thí sinh có kết quả cao nhất vào vòng Bán kết.
              {season.seededDraw &&
                " Các thí sinh được chia vào 3 trận Bán kết bằng bốc thăm theo nhóm hạt giống: nhóm 1 gồm hạng 1–3, nhóm 2 hạng 4–6, nhóm 3 hạng 7–9, nhóm 4 hạng 10–12."}
            </p>
            <div className="mt-4 overflow-x-auto">
              <table className="data-table md:min-w-[36rem]">
                <thead>
                  <tr>
                    <th scope="col" className="num">
                      Hạng
                    </th>
                    <th scope="col" className="sticky-start">
                      Thí sinh
                    </th>
                    <th scope="col" className="hidden md:table-cell">
                      Lớp
                    </th>
                    <th scope="col" className="hidden md:table-cell">
                      Trường
                    </th>
                    <th scope="col" className="num text-right">
                      Điểm
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {quals.map((q) => (
                    <tr key={q.person}>
                      <td className="num">{q.rank}</td>
                      <td className="sticky-start">
                        <PersonLink id={q.person} />
                        {/* Điện thoại: "{lớp} - {trường}" thành dòng nhỏ (cột Lớp, Trường bị ẩn) */}
                        <span className="block text-xs text-ink-soft md:hidden">
                          {q.class} - {getSchool(q.school)?.name ?? q.school}
                        </span>
                      </td>
                      <td className="hidden md:table-cell">{q.class}</td>
                      <td className="hidden md:table-cell">{getSchool(q.school)?.name ?? q.school}</td>
                      <td className="num text-right font-semibold">{formatScore(q.score)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {semis.length > 0 && (
          <section id="ban-ket" className="mt-12 scroll-mt-24 md:mt-16">
            <div className="relative flex items-center gap-1">
              <h2 className="h2 text-ink">Vòng Bán kết</h2>
              <LegendPopover label="Chú thích bảng Bán kết">
                <SemiLegendBody />
              </LegendPopover>
            </div>
            <div className="mt-6 space-y-12">
              {semis.map((m) => (
                <MatchTable
                  key={m.id}
                  match={m}
                  id={`ban-ket-${m.number}`}
                  photo={
                    matchPhoto(m.id) ? <MatchPhoto match={m} caption={`Các thí sinh của trận Bán kết ${m.number}`} /> : undefined
                  }
                />
              ))}
            </div>
          </section>
        )}

        {final && (
          <section id="chung-ket" className="mt-12 scroll-mt-24 md:mt-16">
            <div className="relative flex items-center gap-1">
              <h2 className="h2 text-ink">Trận Chung kết</h2>
              <LegendPopover label="Chú thích bảng Chung kết">
                <FinalLegendBody />
              </LegendPopover>
            </div>
            <div className="mt-6">
              <MatchTable match={final} />
              <ClimbChart match={final} />
              {matchPhoto(final.id) && (
                <div className="mt-8">
                  <MatchPhoto match={final} caption={`Các thí sinh trận Chung kết mùa ${n}`} />
                </div>
              )}
            </div>
          </section>
        )}

        <SeasonNav n={n} spread className="mt-12 justify-between border-t border-oss/15 pt-6 md:mt-16" />
      </article>
    </SeasonContext.Provider>
  );
}
