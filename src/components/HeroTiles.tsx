import { useEffect, useState } from "react";

const SESSION_KEY = "oss-hero-flipped";
const START_DELAY = 400; // ms chờ trước khi lật ô đầu tiên
const STEP = 180; // ms giữa 2 ô
const FLIP = 380; // ms mỗi ô lật

/** Chỉ lật lần đầu trong phiên, và không lật khi người dùng bật giảm chuyển động. */
function shouldFlip() {
  if (typeof window === "undefined") return false;
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return false;
  try {
    return window.sessionStorage.getItem(SESSION_KEY) !== "1";
  } catch {
    return true; // không đọc được sessionStorage: vẫn lật, chỉ là không nhớ được
  }
}

// 4 ô góc (đánh số 1–4) rồi ô trung tâm, theo thứ tự lật
const TILES = [
  { label: "1", className: "tile-q left-0 top-0", color: "#7c3aed" },
  { label: "2", className: "tile-q right-0 top-0", color: "#6d28d9" },
  { label: "3", className: "tile-q left-0 bottom-0", color: "#6d28d9" },
  { label: "4", className: "tile-q right-0 bottom-0", color: "#7c3aed" },
  { label: "", className: "tile-center", color: "#4c1d95" },
];

/**
 * Ảnh lớn trang chủ được che bởi 4 ô góc + 1 ô trung tâm (như ô Vượt chướng ngại vật),
 * rồi lần lượt lật mở 1 → 2 → 3 → 4 → trung tâm. Xong thì gỡ các ô khỏi DOM.
 * Lớp ô nằm dưới chữ trên ảnh (chữ luôn đọc được), aria-hidden, không nhận chuột.
 */
export default function HeroTiles() {
  const [show, setShow] = useState(shouldFlip);

  useEffect(() => {
    if (!show) return;
    const total = START_DELAY + (TILES.length - 1) * STEP + FLIP + 60;
    const timer = window.setTimeout(() => {
      try {
        window.sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        /* bỏ qua */
      }
      setShow(false);
    }, total);
    return () => window.clearTimeout(timer);
  }, [show]);

  if (!show) return null;

  return (
    <div aria-hidden="true" className="hero-tiles pointer-events-none absolute inset-0 z-10">
      {TILES.map((t, i) => (
        <span
          key={i}
          className={`hero-tile ${t.className}`}
          style={{ backgroundColor: t.color, animationDelay: `${START_DELAY + i * STEP}ms`, animationDuration: `${FLIP}ms` }}
        >
          {t.label && <span className="font-display text-4xl font-bold text-white/90 md:text-6xl">{t.label}</span>}
        </span>
      ))}
    </div>
  );
}
