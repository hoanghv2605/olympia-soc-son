import { useState } from "react";
import ImageLightbox from "./ImageLightbox";
import Photo from "./Photo";
import PersonPhoto from "./PersonPhoto";
import { matchPhoto, personName, personPhoto } from "../lib/data";
import { asset, initials } from "../lib/format";
import { placeholderTone } from "../lib/placeholder";
import type { Match } from "../types";

/**
 * Ảnh một trận (images/tran-dau/<id trận>.jpg, 3:2), căn giữa, tối đa 720px, bấm để phóng to.
 * Chưa có ảnh: dải giữ chỗ gọn với chữ cái đầu + tên của đúng các thí sinh trong trận (theo thứ tự matches.json), không bấm được.
 */
export default function MatchPhoto({ match, caption }: { match: Match; caption: string }) {
  const [zoom, setZoom] = useState(false);
  const src = matchPhoto(match.id);

  if (!src) {
    const first = match.results[0]?.person ?? match.id;
    return (
      <figure className="mx-auto w-full max-w-[720px]">
        <div
          className="flex h-44 items-center justify-center gap-3 rounded-2xl px-3 sm:gap-6"
          style={{ backgroundColor: placeholderTone(first).bg }}
        >
          {match.results.map((r) => {
            const tone = placeholderTone(r.person);
            const photo = personPhoto(r.person, match.season); // ảnh đúng mùa của trận (không có thì lùi về mùa khác)
            return (
              <div key={r.person} className="flex w-[4.75rem] flex-col items-center gap-2 text-center sm:w-24">
                {photo ? (
                  <PersonPhoto
                    src={photo}
                    seed={r.person}
                    name={personName(r.person)}
                    className="size-14 shrink-0 rounded-full ring-2 ring-white/70"
                  />
                ) : (
                  <span
                    aria-hidden
                    className="font-display grid size-14 place-items-center rounded-full bg-white/70 text-lg font-bold"
                    style={{ color: tone.ink }}
                  >
                    {initials(personName(r.person))}
                  </span>
                )}
                <span className="text-xs leading-tight text-ink">{personName(r.person)}</span>
              </div>
            );
          })}
        </div>
        <figcaption className="mt-2 text-center text-sm text-ink-soft italic">Ảnh trận đấu đang được cập nhật</figcaption>
      </figure>
    );
  }

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
