import { useMemo, useRef, useState } from "react";
import { Link } from "react-router";
import { PiLightbulb } from "react-icons/pi";
import IconLabel from "./IconLabel";
import { buildFacts } from "../lib/facts";
import { prefersReducedMotion } from "../lib/hooks";

const FADE_MS = 200;

/** Chọn ngẫu nhiên 1 chỉ số khác `except` */
function randomIndex(n: number, except = -1) {
  if (n <= 1) return 0;
  let i = except;
  while (i === except) i = Math.floor(Math.random() * n);
  return i;
}

/**
 * "Bạn có biết?": mỗi lần tải chọn ngẫu nhiên 1 câu sự thật (tự sinh từ dữ liệu, xem src/lib/facts.ts);
 * nút "Sự thật khác" đổi sang câu khác bằng hiệu ứng mờ chéo 200ms.
 */
export default function DidYouKnow() {
  const facts = useMemo(() => buildFacts(), []);
  const [index, setIndex] = useState(() => randomIndex(facts.length));
  const [fading, setFading] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  if (!facts.length) return null;
  const fact = facts[index];

  function next() {
    const target = randomIndex(facts.length, index);
    if (prefersReducedMotion()) {
      setIndex(target);
      return;
    }
    window.clearTimeout(timer.current);
    setFading(true);
    timer.current = window.setTimeout(() => {
      setIndex(target);
      setFading(false);
    }, FADE_MS);
  }

  return (
    <div className="mx-auto max-w-[47.5rem] rounded-2xl border border-oss/15 bg-white/80 px-5 py-4 md:px-6 md:py-5">
      <p className="text-sm font-semibold text-oss">
        <IconLabel icon={PiLightbulb} iconClass="size-5">
          Bạn có biết?
        </IconLabel>
      </p>
      {/* Vùng chữ giữ sẵn 3 dòng để ô không nhảy khi đổi câu; câu dài hơn thì ô cao thêm */}
      <div aria-live="polite" className={`did-you-know mt-2 min-h-[5.0625rem] ${fading ? "opacity-0" : "opacity-100"}`}>
        <p className="text-lg leading-normal text-ink">{fact.text}</p>
      </div>
      <div className="mt-3 flex items-center justify-between gap-3">
        <Link to={fact.to} className={`did-you-know link-strong text-sm ${fading ? "opacity-0" : "opacity-100"}`}>
          Xem chi tiết
        </Link>
        <button
          type="button"
          onClick={next}
          className="inline-flex min-h-11 shrink-0 items-center rounded-full border border-oss/25 px-5 text-sm font-semibold text-oss hover:border-oss hover:bg-oss-soft"
        >
          Sự thật khác
        </button>
      </div>
    </div>
  );
}
