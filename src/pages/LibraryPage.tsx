import { Link } from "react-router";
import PageHeader from "../components/PageHeader";
import SeasonCover from "../components/SeasonCover";
import { libraryPath, libraryPhotos, seasons, site } from "../lib/data";

function Cover({ n, schoolYear }: { n: number; schoolYear: string }) {
  const photos = libraryPhotos(n);
  const has = photos.length > 0;
  const body = (
    <>
      <SeasonCover season={n} src={photos[0]?.src} />
      <span className="block p-3">
        <span className="block text-base font-bold text-ink">Mùa {n}</span>
        <span className="block text-[0.8rem] text-ink-soft tabular-nums">
          {schoolYear} · {has ? `${photos.length} ảnh` : "Chưa có ảnh"}
        </span>
      </span>
    </>
  );
  const base = "block overflow-hidden rounded-2xl border border-oss/15 bg-white/80";
  if (!has) return <div className={`${base} opacity-55`}>{body}</div>;
  return (
    <Link
      to={libraryPath(n)}
      className={`${base} transition duration-200 hover:-translate-y-0.5 hover:border-oss focus-visible:-translate-y-0.5 focus-visible:border-oss motion-reduce:transition-none motion-reduce:hover:translate-y-0`}
    >
      {body}
    </Link>
  );
}

export default function LibraryPage() {
  return (
    <>
      <PageHeader title="Thư viện" description="Ảnh và tư liệu qua các mùa Olympia Sóc Sơn." />
      <section className="mx-auto max-w-6xl px-5 pb-12 md:pb-16">
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-5">
          {seasons.map((s) => (
            <li key={s.season}>
              <Cover n={s.season} schoolYear={s.schoolYear} />
            </li>
          ))}
        </ul>
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-oss/15 bg-white/60 px-6 py-5">
          <p className="text-ink">Xem thêm ảnh và video trên fanpage Olympia Sóc Sơn</p>
          <a href={site.facebook} target="_blank" rel="noreferrer" className="btn-primary">
            Mở fanpage Olympia Sóc Sơn
          </a>
        </div>
      </section>
    </>
  );
}
