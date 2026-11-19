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
    <div className="rounded-2xl border border-oss/15 bg-white/80 p-6 md:p-8">
      <p className="text-sm font-semibold text-oss">
        <IconLabel icon={PiLightbulb} iconClass="size-5">
          Bạn có biết?
        </IconLabel>
      </p>
      <div aria-live="polite" className={`did-you-know mt-3 ${fading ? "opacity-0" : "opacity-100"}`}>
        <p className="text-lg leading-relaxed text-ink md:text-xl">{fact.text}</p>
        <Link to={fact.to} className="link-strong mt-3 inline-block text-sm">
          Xem chi tiết
        </Link>
      </div>
      <button
        type="button"
        onClick={next}
        className="mt-5 inline-flex min-h-11 items-center rounded-full border border-oss/25 px-5 text-sm font-semibold text-oss hover:border-oss hover:bg-oss-soft"
      >
        Sự thật khác
      </button>
    </div>
  );
}
