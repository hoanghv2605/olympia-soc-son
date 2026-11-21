import { useState } from "react";
import Lightbox from "./Lightbox";
import { asset } from "../lib/format";
import { imageFocus } from "../lib/images";
import { site } from "../lib/data";

/**
 * Lưới ảnh vuông 6/5/4/3/2 cột của trang thư viện (mùa, sự kiện); bấm mở Lightbox với toàn bộ ảnh.
 * Chưa có ảnh: thông báo `emptyTitle` + nút mở fanpage.
 */
export default function PhotoGrid({ photos, emptyTitle }: { photos: { src: string; alt: string }[]; emptyTitle: string }) {
  const [zoom, setZoom] = useState<number | null>(null);
  if (photos.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-oss/30 bg-white/50 px-6 py-14 text-center">
        <p className="text-lg font-semibold text-ink">{emptyTitle}</p>
        <p className="mx-auto mt-2 max-w-[52ch] text-ink-soft">Bạn có thể xem ảnh và video trên fanpage của Olympia Sóc Sơn.</p>
        <a href={site.facebook} target="_blank" rel="noreferrer" className="btn-primary mt-7">
          Mở fanpage Olympia Sóc Sơn
        </a>
      </div>
    );
  }
  return (
    <>
      <ul className="grid grid-cols-2 gap-2 min-[560px]:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
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
                style={{ objectPosition: imageFocus(p.src) }}
                className="size-full object-cover transition-transform duration-200 hover:scale-[1.03] motion-reduce:transition-none motion-reduce:hover:scale-100"
              />
            </button>
          </li>
        ))}
      </ul>
      <Lightbox open={zoom !== null} onClose={() => setZoom(null)} images={photos.map((p) => ({ src: asset(p.src), alt: p.alt }))} start={zoom ?? 0} />
    </>
  );
}
