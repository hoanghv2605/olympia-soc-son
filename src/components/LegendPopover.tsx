import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { PiInfo } from "react-icons/pi";

/**
 * Nút ⓘ đứng sau tiêu đề, mở hộp chú thích nhỏ: rê chuột (máy tính) hoặc bấm / chạm để mở;
 * đóng khi bấm ra ngoài hoặc Esc. Đặt trong khối `relative` rộng bằng hàng tiêu đề.
 */
export default function LegendPopover({ label, children }: { label: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLSpanElement>(null);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!boxRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <span
      ref={boxRef}
      className="contents"
      onPointerEnter={(e) => e.pointerType === "mouse" && setOpen(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setOpen(false)}
    >
      <button
        type="button"
        aria-label={label}
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        className="inline-grid size-9 place-items-center rounded-full text-ink-soft hover:bg-oss-soft hover:text-oss"
      >
        <PiInfo className="size-5" aria-hidden />
      </button>
      {open && (
        <div
          id={id}
          role="note"
          className="absolute top-full left-0 z-30 mt-1 w-[min(24rem,100%)] rounded-xl border border-oss/15 bg-white p-4 text-sm text-ink shadow-[0_16px_40px_-20px_rgba(31,27,46,0.45)]"
        >
          {children}
        </div>
      )}
    </span>
  );
}
