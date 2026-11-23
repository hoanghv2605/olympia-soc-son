import { useState } from "react";
import Lightbox from "./Lightbox";
import Photo from "./Photo";
import { asset } from "../lib/format";

/**
 * Ảnh có chú thích (3:2), căn giữa, tối đa 720px, bấm để phóng to. Dùng cho ảnh trận đấu (`MatchPhoto`)
 * và ảnh trao giải của sự kiện. `src` đã được kiểm tra là ảnh thật; không có thì không hiện gì.
 */
export default function AwardPhoto({ src, caption }: { src: string | undefined; caption: string }) {
  const [zoom, setZoom] = useState(false);
  if (!src) return null;

  return (
    <figure className="mx-auto w-full max-w-[720px]">
      <button
        type="button"
        onClick={() => setZoom(true)}
        aria-label={`Phóng to ảnh: ${caption}`}
        className="block w-full cursor-zoom-in overflow-hidden rounded-2xl"
      >
        <Photo src={src} alt={caption} className="aspect-[3/2] w-full" />
      </button>
      <figcaption className="mt-2 text-center text-sm text-ink-soft italic">{caption}</figcaption>
      <Lightbox open={zoom} onClose={() => setZoom(false)} images={[{ src: asset(src), alt: caption }]} />
    </figure>
  );
}
