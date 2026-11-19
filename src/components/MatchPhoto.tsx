import { useState } from "react";
import ImageLightbox from "./ImageLightbox";
import Photo from "./Photo";
import { matchPhoto } from "../lib/data";
import { asset } from "../lib/format";
import type { Match } from "../types";

/**
 * Ảnh một trận (images/tran-dau/<id trận>.jpg, 3:2), căn giữa, tối đa 720px, bấm để phóng to.
 * Chưa có ảnh thật thì không hiện gì (không còn dải giữ chỗ); nơi gọi nên kiểm tra `matchPhoto(id)` trước
 * để không để lại khoảng cách thừa.
 */
export default function MatchPhoto({ match, caption }: { match: Match; caption: string }) {
  const [zoom, setZoom] = useState(false);
  const src = matchPhoto(match.id);
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
      <ImageLightbox open={zoom} onClose={() => setZoom(false)} src={asset(src)} alt={caption} />
    </figure>
  );
}
