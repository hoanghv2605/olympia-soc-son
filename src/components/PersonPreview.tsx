import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation } from "react-router";
import PersonPhoto from "./PersonPhoto";
import { personPhoto, personPreview } from "../lib/data";
import { useMediaQuery } from "../lib/hooks";

const SHOW_DELAY = 350; // ms rê chuột trên link thì hiện
const HIDE_DELAY = 150; // ms rời link thì ẩn
const WIDTH = 280;
const GAP = 8; // khoảng cách với link và với mép màn hình

/**
 * Thẻ xem nhanh thí sinh khi rê chuột vào link chữ có `data-person-preview="<id>"` (PersonLink, dòng thời gian).
 * Một thẻ dùng chung cho cả trang (portal vào body), chỉ bật trên thiết bị có chuột.
 * Thẻ aria-hidden: thông tin đầy đủ đã có ở trang hồ sơ.
 */
export default function PersonPreview() {
  const enabled = useMediaQuery("(hover: hover) and (pointer: fine)");
  const [id, setId] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const anchorRef = useRef<HTMLElement | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const showTimer = useRef<number | undefined>(undefined);
  const hideTimer = useRef<number | undefined>(undefined);
  const { pathname } = useLocation();

  const clearTimers = () => {
    window.clearTimeout(showTimer.current);
    window.clearTimeout(hideTimer.current);
  };

  const hide = useCallback(() => {
    clearTimers();
    anchorRef.current = null;
    setVisible(false);
  }, []);

  const scheduleHide = useCallback(() => {
    window.clearTimeout(showTimer.current);
    window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => {
      anchorRef.current = null;
      setVisible(false);
    }, HIDE_DELAY);
  }, []);

  // Bắt sự kiện chung ở document (không gắn từng link)
  useEffect(() => {
    if (!enabled) return;
    function onOver(e: PointerEvent) {
      if (e.pointerType !== "mouse") return;
      const a = (e.target as Element | null)?.closest?.<HTMLElement>("a[data-person-preview]");
      if (!a) return;
      window.clearTimeout(hideTimer.current);
      if (a === anchorRef.current) return;
      window.clearTimeout(showTimer.current);
      showTimer.current = window.setTimeout(() => {
        const pid = a.dataset.personPreview;
        if (!pid || !personPreview(pid)) return;
        anchorRef.current = a;
        setId(pid);
        setVisible(true);
      }, SHOW_DELAY);
    }
    function onOut(e: PointerEvent) {
      const a = (e.target as Element | null)?.closest?.("a[data-person-preview]");
      if (!a) return;
      // còn ở trong cùng link (đi qua phần tử con) thì bỏ qua
      if (e.relatedTarget instanceof Node && a.contains(e.relatedTarget)) return;
      if (cardRef.current && e.relatedTarget instanceof Node && cardRef.current.contains(e.relatedTarget)) return;
      scheduleHide();
    }
    document.addEventListener("pointerover", onOver);
    document.addEventListener("pointerout", onOut);
    document.addEventListener("pointerdown", hide);
    window.addEventListener("scroll", hide, { passive: true });
    return () => {
      clearTimers();
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onOut);
      document.removeEventListener("pointerdown", hide);
      window.removeEventListener("scroll", hide);
    };
  }, [enabled, hide, scheduleHide]);

  // Chuyển trang thì ẩn
  useEffect(() => {
    hide();
  }, [pathname, hide]);

  // Đặt vị trí: dưới link; không đủ chỗ thì lật lên trên; không tràn mép trái/phải
  useLayoutEffect(() => {
    if (!visible || !anchorRef.current || !cardRef.current) return;
    const r = anchorRef.current.getBoundingClientRect();
    const h = cardRef.current.offsetHeight;
    let top = r.bottom + GAP;
    if (top + h > window.innerHeight - GAP && r.top - GAP - h >= GAP) top = r.top - GAP - h;
    const maxLeft = window.innerWidth - WIDTH - GAP;
    const left = Math.max(GAP, Math.min(r.left, maxLeft));
    setPos({ top, left });
  }, [visible, id]);

  if (!enabled || !id) return null;
  const info = personPreview(id);
  if (!info) return null;

  return createPortal(
    <div
      ref={cardRef}
      aria-hidden="true"
      className={`person-preview fixed z-50 flex gap-3 rounded-xl border border-oss/15 bg-white p-3 shadow-[0_18px_40px_-16px_rgba(46,16,101,0.45)] ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      style={{ top: pos.top, left: pos.left, width: WIDTH }}
      onPointerEnter={() => window.clearTimeout(hideTimer.current)}
      onPointerLeave={scheduleHide}
    >
      <PersonPhoto
        src={personPhoto(info.person.id)}
        seed={info.person.id}
        name={info.person.name}
        className="h-16 w-12 shrink-0 rounded-md"
      />
      <div className="min-w-0 text-sm leading-snug">
        <p className="font-bold text-ink">{info.person.name}</p>
        <p className="text-ink-soft">{info.school}</p>
        {info.seasons.length > 0 && <p className="text-ink-soft">Mùa {info.seasons.join(", ")}</p>}
        {info.topTitle && <p className="mt-1 font-semibold text-oss">{info.topTitle}</p>}
        {info.olympiaYears.length > 0 && (
          <p className="mt-0.5 text-cube-pink">Olympia năm thứ {info.olympiaYears.join(", ")}</p>
        )}
      </div>
    </div>,
    document.body,
  );
}
