import { Fragment, type ReactNode } from "react";
import { Link, useParams } from "react-router";
import { PiImages } from "react-icons/pi";
import PageHeader from "../../components/PageHeader";
import CompetitionSections, { SeasonInfobox } from "../../components/CompetitionSections";
import PersonLink from "../../components/PersonLink";
import NotFound from "../NotFound";
import {
  coverPhoto,
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
import { formatDate, scrollToId, seasonOrdinal } from "../../lib/format";

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
        backdrop={coverPhoto(n) ?? (final ? matchPhoto(final.id) : undefined)}
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

          <SeasonInfobox
            code={code}
            schoolYear={season.schoolYear}
            startDate={season.startDate}
            finalDate={season.finalDate}
            hosts={season.hosts}
            champions={champions.map((c) => ({ id: c.person.id, class: c.result.class, school: c.result.school }))}
          />
        </div>

        <CompetitionSections
          quals={quals}
          semis={semis}
          final={final}
          seededDraw={season.seededDraw}
          finalCaption={`Các thí sinh trận Chung kết mùa ${n}`}
        />

        <SeasonNav n={n} spread className="mt-12 justify-between border-t border-oss/15 pt-6 md:mt-16" />
      </article>
    </SeasonContext.Provider>
  );
}
