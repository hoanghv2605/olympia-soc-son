import { useEffect, useRef, useState, type FocusEvent, type MouseEvent, type PointerEvent } from "react";
import { Link } from "react-router";
import { PiCaretLeft, PiCaretRight } from "react-icons/pi";
import PersonPhoto from "./PersonPhoto";
import { PLACEMENT_LABEL, consecutiveFinalists, personPath, personPhoto } from "../lib/data";

/**
 * Dải ảnh hình bình hành nghiêng phải, đặt sát nhau trên 1 hàng.
 * Máy tính: rê chuột / focus → dải giãn ra, hiện tên + 2 mùa; phím ← → (khi chuột trong khối hoặc đang focus
 * trong khối) và 2 nút mũi tên để chuyển dải đang mở; dải thu lại hiện tên dọc.
 * Điện thoại: hàng vuốt ngang; chạm lần đầu để giãn dải, chạm lần nữa để mở hồ sơ; nút mũi tên luôn hiện.
 */
export default function FinalistStrips() {
  const list = consecutiveFinalists();
  const n = list.length;
  const [active, setActive] = useState<number | null>(null);
  const blockRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const hovering = useRef(false);
  // true khi thao tác hiện tại là chạm (không phải chuột / bàn phím)
  const touching = useRef(false);
  const activeRef = useRef(active);
  activeRef.current = active;

  /** Mở dải bên trái (-1) / phải (+1), quay vòng; chưa có dải nào mở thì ← mở dải cuối, → mở dải đầu. */
  function step(dir: -1 | 1) {
    if (!n) return;
    const cur = activeRef.current;
    const next = cur === null ? (dir > 0 ? 0 : n - 1) : (cur + dir + n) % n;
    setActive(next);
    const link = linkRefs.current[next];
    // đang focus một dải thì focus đi theo dải được mở
    if (link && linkRefs.current.includes(document.activeElement as HTMLAnchorElement)) {
      link.focus({ preventScroll: true });
    }
    // điện thoại (hàng cuộn ngang): cuộn tới dải đó
    link?.parentElement?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }
  const stepRef = useRef(step);
  stepRef.current = step;

  // Phím ← → khi chuột đang nằm trong khối hoặc focus đang ở trong khối
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      const target = e.target as HTMLElement | null;
      if (target && (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))) return;
      const focusInside = !!blockRef.current?.contains(document.activeElement);
      if (!hovering.current && !focusInside) return;
      e.preventDefault(); // chặn cuộn ngang mặc định
      stepRef.current(e.key === "ArrowLeft" ? -1 : 1);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  function onLinkClick(e: MouseEvent, i: number) {
    if (!touching.current) return;
    touching.current = false;
    if (active !== i) {
      e.preventDefault();
      setActive(i);
    }
  }

  // Rời chuột khỏi khối và không còn focus bên trong → các dải về đều nhau
  function onBlockLeave(e: PointerEvent) {
    if (e.pointerType !== "mouse") return;
    hovering.current = false;
    if (!blockRef.current?.contains(document.activeElement)) setActive(null);
  }
  function onBlockBlur(e: FocusEvent) {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null) && !hovering.current) setActive(null);
  }

  return (
    <div
      ref={blockRef}
      className="strips-block group relative"
      onPointerEnter={(e) => {
        if (e.pointerType === "mouse") hovering.current = true;
      }}
      onPointerLeave={onBlockLeave}
      onBlur={onBlockBlur}
    >
      <ul className={`strips${active !== null ? " has-active" : ""}`}>
        {list.map(({ person, entries }, i) => {
          const seasonsText = entries
            .map((e) => `Mùa ${e.season}: ${e.placement ? PLACEMENT_LABEL[e.placement] : "Chung kết"}`)
            .join(" · ");
          return (
            <li key={person.id} className={`strip${active === i ? " is-active" : ""}`}>
              <Link
                ref={(el) => {
                  linkRefs.current[i] = el;
                }}
                to={personPath(person.id)}
                aria-label={`${person.name}. ${seasonsText}`}
                className="strip-inner block"
                onPointerDown={(e) => (touching.current = e.pointerType !== "mouse")}
                onPointerEnter={(e) => e.pointerType === "mouse" && setActive(i)}
                onFocus={() => !touching.current && setActive(i)}
                onClick={(e) => onLinkClick(e, i)}
              >
                <PersonPhoto src={personPhoto(person.id)} seed={person.id} name={person.name} className="size-full" />
                <span className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/80 to-transparent" aria-hidden />
                {/* Dải thu lại: tên theo chiều dọc, đọc từ dưới lên */}
                <span className="strip-vlabel" aria-hidden>
                  {person.name}
                </span>
                <span className="strip-caption" aria-hidden>
                  <span className="block text-lg leading-tight font-bold">{person.name}</span>
                  <span className="mt-1 block text-sm text-white/85">{seasonsText}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      {n > 1 && (
        <>
          <button type="button" aria-label="Thí sinh trước" onClick={() => step(-1)} className="strips-arrow left-0 md:-left-3">
            <PiCaretLeft className="size-5" aria-hidden />
          </button>
          <button type="button" aria-label="Thí sinh sau" onClick={() => step(1)} className="strips-arrow right-0 md:-right-3">
            <PiCaretRight className="size-5" aria-hidden />
          </button>
        </>
      )}
    </div>
  );
}
