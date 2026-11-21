import { Link, useParams } from "react-router";
import PageHeader from "../components/PageHeader";
import PhotoGrid from "../components/PhotoGrid";
import NotFound from "./NotFound";
import { eventLibraryCount, eventLibraryPath, eventNeighbors, eventPath, eventPhotos, eventShortName, eventTimeLabel, getEvent } from "../lib/data";

const pill =
  "rounded-full border border-oss/25 bg-white/70 px-3.5 py-1.5 text-sm font-semibold text-oss hover:border-oss";

export default function LibraryEventPage() {
  const { id } = useParams();
  const event = getEvent(id);
  if (!event) return <NotFound />;

  const photos = eventPhotos(event.id);
  // Chỉ chuyển sang sự kiện trước / sau đang có ảnh
  const { prev, next } = eventNeighbors(event.id, (e) => eventLibraryCount(e.id) > 0);

  return (
    <>
      <PageHeader
        breadcrumb={[{ to: "/thu-vien", label: "Thư viện" }, { label: eventShortName(event) }]}
        title={`Thư viện ảnh ${event.name}`}
        description={`${eventTimeLabel(event)} · ${photos.length} ảnh`}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Link to={eventPath(event.id)} className={pill}>
              Trang sự kiện
            </Link>
            {prev && (
              <Link to={eventLibraryPath(prev.id)} title={prev.name} className={pill}>
                ‹ Sự kiện trước
              </Link>
            )}
            {next && (
              <Link to={eventLibraryPath(next.id)} title={next.name} className={pill}>
                Sự kiện sau ›
              </Link>
            )}
          </div>
        }
      />
      <section className="mx-auto max-w-6xl px-5 pb-12 md:pb-16">
        <PhotoGrid photos={photos} emptyTitle="Sự kiện này chưa có ảnh" />
      </section>
    </>
  );
}
