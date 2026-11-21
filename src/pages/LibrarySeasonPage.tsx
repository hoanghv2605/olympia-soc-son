import { Link, useParams } from "react-router";
import PhotoGrid from "../components/PhotoGrid";
import PageHeader from "../components/PageHeader";
import NotFound from "./NotFound";
import { getSeason, libraryCount, libraryPath, libraryPhotos, seasonPath } from "../lib/data";

const pill =
  "rounded-full border border-oss/25 bg-white/70 px-3.5 py-1.5 text-sm font-semibold text-oss hover:border-oss";

export default function LibrarySeasonPage() {
  const { slug } = useParams();
  const n = Number(slug?.replace("mua-", ""));
  const season = Number.isInteger(n) ? getSeason(n) : undefined;
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
        <PhotoGrid photos={photos} emptyTitle="Mùa này chưa có ảnh" />
      </section>
    </>
  );
}
