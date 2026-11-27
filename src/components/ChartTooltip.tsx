import { useEffect, useLayoutEffect, useRef, useState, type FocusEvent, type MouseEvent, type PointerEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";

export interface TooltipContent {
  /** Dòng đầu (đậm): tên phần */
  title: string;
  /** Các dòng số */
  lines: string[];
  /** Dòng cuối chữ xám */
  muted?: string;
}

interface Tip {
  content: TooltipContent;
  /** Phần biểu đồ đang mở hộp */
  target: Element;
  /** "point": theo con trỏ / điểm chạm; "element": cạnh phần đang được focus bằng bàn phím */
  mode: "point" | "element";
  left: number;
  right: number;
  y: number;
}

const GAP = 14;
const EDGE = 8;

function atPoint(target: Element, content: TooltipContent, x: number, y: number): Tip {
  return { content, target, mode: "point", left: x, right: x, y };
}

function atElement(target: Element, content: TooltipContent): Tip {
  const r = target.getBoundingClientRect();
  return { content, target, mode: "element", left: r.left, right: r.right, y: r.top + r.height / 2 };
}

/**
 * Hộp số liệu nổi dùng chung cho các biểu đồ. Gắn `{...bind(nội dung)}` vào từng phần (phần đó tự đặt `aria-label`
 * đọc đủ số, vì hộp chỉ để nhìn) và đặt `tooltip` một lần trong biểu đồ.
 * Chuột: hộp đi theo con trỏ. Chạm: hiện ở điểm chạm, chạm chỗ khác hoặc cuộn trang thì ẩn.
 * Bàn phím: hiện cạnh phần đang focus, Esc ẩn. Gần mép phải / dưới thì lật sang phía còn lại.
 */
export function useChartTooltip(): { bind: (content: TooltipContent) => object; tooltip: ReactNode } {
  const [tip, setTip] = useState<Tip | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const box = boxRef.current;
    if (!tip || !box) return;
    const { clientWidth, clientHeight } = document.documentElement;
    const { offsetWidth: w, offsetHeight: h } = box;
    const clamp = (v: number, max: number) => Math.max(EDGE, Math.min(v, max - EDGE));
    let x = tip.right + GAP;
    if (x + w > clientWidth - EDGE) x = tip.left - GAP - w;
    let y = tip.y + GAP;
    if (y + h > clientHeight - EDGE) y = tip.y - GAP - h;
    box.style.transform = `translate(${Math.round(clamp(x, clientWidth - w))}px, ${Math.round(clamp(y, clientHeight - h))}px)`;
  }, [tip]);

  const open = tip !== null;
  useEffect(() => {
    if (!open) return;
    const hide = () => setTip(null);
    const onDown = (e: Event) => setTip((t) => (t && t.target.contains(e.target as Node) ? t : null));
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") hide();
    };
    // Cuộn trang: hộp theo bàn phím thì bám theo phần đó, còn lại thì ẩn (vị trí cũ không còn đúng)
    const onScroll = () => setTip((t) => (t?.mode === "element" ? atElement(t.target, t.content) : null));
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, { capture: true, passive: true });
    window.addEventListener("resize", hide);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll, { capture: true });
      window.removeEventListener("resize", hide);
    };
  }, [open]);

  const bind = (content: TooltipContent) => {
    const follow = (e: PointerEvent<Element>) => {
      if (e.pointerType === "mouse") setTip(atPoint(e.currentTarget, content, e.clientX, e.clientY));
    };
    return {
      tabIndex: 0,
      onPointerEnter: follow,
      onPointerMove: follow,
      onPointerLeave: (e: PointerEvent<Element>) => {
        if (e.pointerType === "mouse") setTip(null);
      },
      // Chạm (và bấm chuột). `detail === 0`: "bấm" không có con trỏ (trình đọc màn hình)
      onClick: (e: MouseEvent<Element>) =>
        setTip(e.detail === 0 ? atElement(e.currentTarget, content) : atPoint(e.currentTarget, content, e.clientX, e.clientY)),
      onFocus: (e: FocusEvent<Element>) => {
        if (document.documentElement.dataset.input === "keyboard") setTip(atElement(e.currentTarget, content));
      },
      onBlur: () => setTip(null),
    };
  };

  const tooltip =
    tip &&
    createPortal(
      <div
        ref={boxRef}
        aria-hidden
        data-chart-tooltip
        className="pointer-events-none fixed top-0 left-0 z-50 w-max max-w-[17rem] rounded-lg border border-oss/20 bg-white px-3 py-2 text-[13px] leading-snug text-ink shadow-[0_12px_28px_-16px_rgba(31,27,46,0.5)]"
      >
        <p className="font-bold">{tip.content.title}</p>
        {tip.content.lines.map((line) => (
          <p key={line} className="tabular-nums">
            {line}
          </p>
        ))}
        {tip.content.muted && <p className="text-ink-soft tabular-nums">{tip.content.muted}</p>}
      </div>,
      document.body,
    );

  return { bind, tooltip };
}
