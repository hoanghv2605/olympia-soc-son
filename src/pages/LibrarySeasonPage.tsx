import { useState } from "react";
import { Link, useParams } from "react-router";
import Lightbox from "../components/Lightbox";
import PageHeader from "../components/PageHeader";
import NotFound from "./NotFound";
import { getSeason, libraryCount, libraryPath, libraryPhotos, seasonPath, site } from "../lib/data";
import { asset } from "../lib/format";

const pill =
  "rounded-full border border-oss/25 bg-white/70 px-3.5 py-1.5 text-sm font-semibold text-oss hover:border-oss";

export default function LibrarySeasonPage() {
  const { slug } = useParams();
  const n = Number(slug?.replace("mua-", ""));
  const season = Number.isInteger(n) ? getSeason(n) : undefined;
  const [zoom, setZoom] = useState<number | null>(null);
  if (!season) return <NotFound />;

  const photos = libraryPhotos(n);
  // Chỉ chuyển sang mùa kế tiếp / trước đó đang có ảnh
  const prev = [...Array(n - 1).keys()].map((i) => n - 1 - i).find((m) => getSeason(m) && libraryCount(m) > 0);
  const next = Array.from({ length: 30 }, (_, i) => n + 1 + i).find((m) => getSeason(m) && libraryCount(m) > 0);

  return (
    <>
      <PageHeader
        breadcrumb={[{ to: "/thu-vien", label: "Thư viện" }, { label: `Mùa ${n}` }]}
        title={`Thư viện ảnh mùa ${n}`}
        description={`${season.schoolYear} · ${photos.length} ảnh`}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Link to={seasonPath(n)} className={pill}>
              Trang mùa {n}
            </Link>
            {prev && (
              <Link to={libraryPath(prev)} className={pill}>
                ‹ Mùa {prev}
              </Link>
            )}
            {next && (
              <Link to={libraryPath(next)} className={pill}>
                Mùa {next} ›
              </Link>
            )}
          </div>
        }
      />
      <section className="mx-auto max-w-6xl px-5 pb-12 md:pb-16">
        {photos.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-oss/30 bg-white/50 px-6 py-14 text-center">
            <p className="text-lg font-semibold text-ink">Mùa này chưa có ảnh</p>
            <p className="mx-auto mt-2 max-w-[52ch] text-ink-soft">Bạn có thể xem ảnh và video các mùa thi trên fanpage của Olympia Sóc Sơn.</p>
            <a href={site.facebook} target="_blank" rel="noreferrer" className="btn-primary mt-7">
              Mở fanpage Olympia Sóc Sơn
            </a>
          </div>
        ) : (
          <>
            <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
              {photos.map((p, i) => (
                <li key={p.src}>
                  <button
                    type="button"
                    onClick={() => setZoom(i)}
                    aria-label={`Phóng to: ${p.alt}`}
                    className="block aspect-square w-full cursor-zoom-in overflow-hidden rounded-xl bg-oss-soft"
                  >
                    <img
                      src={asset(p.src)}
                      alt={p.alt}
                      loading="lazy"
                      decoding="async"
                      className="size-full object-cover transition-transform duration-200 hover:scale-[1.03] motion-reduce:transition-none motion-reduce:hover:scale-100"
                    />
                  </button>
                </li>
              ))}
            </ul>
            <Lightbox
              open={zoom !== null}
              onClose={() => setZoom(null)}
              images={photos.map((p) => ({ src: asset(p.src), alt: p.alt }))}
              start={zoom ?? 0}
            />
          </>
        )}
      </section>
    </>
  );
}
