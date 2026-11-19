import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion, useInViewOnce } from "../lib/hooks";

const DURATION = 1200; // ms

/** "400+" → { n: 400, suffix: "+" }; "10" → { n: 10, suffix: "" }; không phải số → null */
function parse(value: string) {
  const m = /^(\d+)(.*)$/.exec(value.trim());
  return m ? { n: Number(m[1]), suffix: m[2] } : null;
}

const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

/** Giá trị tại thời điểm `elapsed` (ms) — luôn trong [0, target], không bao giờ âm. */
export function countUpValue(target: number, elapsed: number) {
  return Math.round(target * easeOutCubic(clamp01(elapsed / DURATION)));
}

/**
 * Số chạy từ 0 tới giá trị thật khi cuộn vào màn hình (hiện ≥ 50%), 1,2 giây, chậm dần về cuối; chỉ 1 lần.
 * Hậu tố (vd "+") hiện khi chạy xong. Số đang chạy aria-hidden, giá trị cuối nằm trong sr-only.
 * Giảm chuyển động: hiện thẳng số cuối.
 */
export default function CountUp({ value, className = "" }: { value: string; className?: string }) {
  const parsed = parse(value);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInViewOnce(ref, 0.5);
  const [reduced] = useState(prefersReducedMotion);
  const [current, setCurrent] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!parsed || reduced || !inView) return;
    let raf = 0;
    // Mốc bắt đầu lấy từ chính `now` của khung hình đầu tiên (cùng đồng hồ với các khung sau)
    let start: number | null = null;
    const tick = (now: number) => {
      if (start === null) start = now;
      const elapsed = now - start;
      setCurrent(countUpValue(parsed.n, elapsed));
      if (elapsed < DURATION) raf = requestAnimationFrame(tick);
      else setDone(true);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduced, parsed?.n]);

  if (!parsed) return <span className={className}>{value}</span>;
  const finished = reduced || done;

  return (
    <span ref={ref} className={className}>
      <span aria-hidden="true">
        {finished ? parsed.n : current}
        {finished && parsed.suffix}
      </span>
      <span className="sr-only">{value}</span>
    </span>
  );
}
