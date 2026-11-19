import { useEffect, useRef } from "react";
import { PiXBold } from "react-icons/pi";

/** Hộp phóng to ảnh: nền tối, ảnh vừa màn hình; Esc, nút đóng hoặc bấm ra ngoài để đóng; focus giữ trong hộp (<dialog> gốc). */
export default function ImageLightbox({ open, onClose, src, alt }: { open: boolean; onClose: () => void; src: string; alt: string }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-label={alt}
      className="lightbox"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
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
      {open && (
        <div className="grid size-full place-items-center p-4" onClick={onClose}>
          <img src={src} alt={alt} className="max-h-full max-w-full rounded-lg object-contain" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </dialog>
  );
}
