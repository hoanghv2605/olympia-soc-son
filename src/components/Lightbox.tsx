import { useCallback, useEffect, useRef, useState } from "react";
import { PiCaretLeftBold, PiCaretRightBold, PiXBold } from "react-icons/pi";

export interface LightboxImage {
  src: string;
  alt: string;
  caption?: string;
}

/**
 * Hộp xem ảnh dùng chung (ảnh trận đấu, cột mốc, thư viện): nền tối, ảnh tối đa 92vw × 82vh.
 * ‹ › và phím ← → (hoặc vuốt trái/phải) để chuyển ảnh, bộ đếm "3 / 12", tải trước ảnh liền kề.
 * Esc, nút đóng hoặc bấm nền để đóng; focus giữ trong hộp và trả về chỗ đã mở (<dialog> gốc).
 * Danh sách 1 ảnh thì ẩn nút chuyển và bộ đếm.
 */
export default function Lightbox({
  open,
  onClose,
  images,
  start = 0,
}: {
  open: boolean;
  onClose: () => void;
  images: LightboxImage[];
  start?: number;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const swipe = useRef<{ x: number; y: number } | null>(null);
  const [index, setIndex] = useState(start);
  const count = images.length;
  const many = count > 1;

  // Mỗi lần mở: về ảnh bắt đầu
  useEffect(() => {
    if (open) setIndex(Math.min(Math.max(start, 0), Math.max(count - 1, 0)));
  }, [open, start, count]);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  const go = useCallback(
    (step: number) => {
      if (count > 1) setIndex((i) => (i + step + count) % count);
    },
    [count],
  );

  // Tải trước ảnh liền trước / liền sau
  useEffect(() => {
    if (!open || count < 2) return;
    for (const j of [(index + 1) % count, (index - 1 + count) % count]) {
      const img = new Image();
      img.src = images[j].src;
    }
  }, [open, index, count, images]);

  const current = images[index];

  return (
    <dialog
      ref={ref}
      aria-label={current?.alt ?? "Xem ảnh"}
      className="lightbox"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          go(-1);
        } else if (e.key === "ArrowRight") {
          e.preventDefault();
          go(1);
        }
      }}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Đóng"
        className="absolute top-3 right-3 z-10 grid size-11 place-items-center rounded-full bg-white/15 text-white hover:bg-white/25"
      >
        <PiXBold className="size-5" aria-hidden />
      </button>
      {open && current && (
        <div
          className="flex size-full flex-col items-center justify-center gap-3 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
          onPointerDown={(e) => {
            swipe.current = { x: e.clientX, y: e.clientY };
          }}
          onPointerUp={(e) => {
            const s = swipe.current;
            swipe.current = null;
            if (!s || !many) return;
            const dx = e.clientX - s.x;
            if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(e.clientY - s.y)) go(dx < 0 ? 1 : -1);
          }}
        >
          <img
            key={current.src}
            src={current.src}
            alt={current.alt}
            draggable={false}
            className="max-h-[82vh] max-w-[92vw] rounded-lg object-contain"
          />
          {(current.caption || many) && (
            <p className="max-w-[92vw] text-center text-sm text-white/85">
              {many && <span className="mr-2 tabular-nums text-white/60">{index + 1} / {count}</span>}
              {current.caption}
            </p>
          )}
        </div>
      )}
      {open && many && (
        <>
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Ảnh trước"
            className="absolute top-1/2 left-2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-white hover:bg-white/25 md:left-4"
          >
            <PiCaretLeftBold className="size-5" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Ảnh sau"
            className="absolute top-1/2 right-2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-white hover:bg-white/25 md:right-4"
          >
            <PiCaretRightBold className="size-5" aria-hidden />
          </button>
        </>
      )}
    </dialog>
  );
}
