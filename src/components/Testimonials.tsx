import { useEffect, useRef, useState, type FocusEvent, type KeyboardEvent, type PointerEvent } from "react";
import { Link } from "react-router";
import { PiPause, PiPlay } from "react-icons/pi";
import PersonPhoto from "./PersonPhoto";
import { humanPath, testimonialSource, testimonials } from "../lib/data";
import { prefersReducedMotion } from "../lib/hooks";
import type { Testimonial } from "../types";

const AUTO_MS = 7000; // tự chuyển sau mỗi 7 giây
const SWIPE_PX = 40; // ngưỡng vuốt

/** Ảnh tròn kèm 2 vòng tròn mảnh đồng tâm (tím 30%, vàng kim 40%). Không có ảnh hồ sơ: chữ viết tắt như các thẻ khác. */
function Portrait({ name, seed, photo }: { name: string; seed: string; photo?: string }) {
  return (
    <span className="relative grid shrink-0 place-items-center p-6">
      <span aria-hidden className="absolute inset-0 rounded-full border border-gold/40" />
      <span aria-hidden className="absolute inset-3 rounded-full border border-oss/30" />
      <PersonPhoto src={photo} seed={seed} name={name} className="size-[120px] rounded-full md:size-40" />
    </span>
  );
}

function Slide({ t }: { t: Testimonial }) {
  const paragraphs = t.quote.split(/\n\s*\n/).filter((p) => p.trim());
  const { story, seed, photo } = testimonialSource(t);
  return (
    <div className="relative">
      <div className="flex flex-col items-center gap-4 text-center md:flex-row md:gap-6 md:text-left">
        <Portrait name={t.name} seed={seed} photo={photo} />
        <div className="flex flex-col items-center gap-2 md:items-start">
          <p className="rounded-full border border-oss/15 bg-white px-4 py-1.5 text-oss">
            {t.name}
            {t.role && (
              <>
                {" – "}
                <strong className="font-bold">{t.role}</strong>
              </>
            )}
          </p>
          {t.position && (
            <p className="rounded-full px-4 py-1.5 text-sm text-oss-deep" style={{ backgroundColor: "#EDE7FB" }}>
              {t.position}
            </p>
          )}
        </div>
      </div>

      <figure className="relative mt-6 px-2 md:mt-8 md:px-10">
        <span aria-hidden className="font-display absolute -top-4 left-0 text-6xl leading-none text-gold md:-left-1">
          “
        </span>
        <blockquote className="max-w-[70ch] space-y-4 pt-6 text-lg leading-[1.7] text-ink md:text-xl md:leading-[1.7]">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </blockquote>
        <span aria-hidden className="font-display mt-2 block text-right text-6xl leading-none text-gold">
          ”
        </span>
        {story && (
          <figcaption className="text-center md:text-left">
            <Link to={humanPath(story.slug)} className="link-strong inline-block text-sm">
              Đọc bài phỏng vấn
              <span className="sr-only"> {t.name}</span>
            </Link>
          </figcaption>
        )}
      </figure>
    </div>
  );
}

/**
 * Trình chiếu "Cảm nhận về Olympia Sóc Sơn": tự chuyển mỗi 7 giây (quay vòng), dừng khi rê chuột / focus /
 * tab bị ẩn / bấm Tạm dừng; chấm tròn, phím ← →, vuốt. Mọi trang chồng trong cùng 1 ô lưới nên khung có
 * chiều cao cố định theo nhận xét dài nhất. Giảm chuyển động: không tự chuyển, đổi trang tức thì.
 */
export default function Testimonials() {
  const items = testimonials;
  const n = items.length;
  const [index, setIndex] = useState(0);
  const [reduced] = useState(prefersReducedMotion);
  const [paused, setPaused] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);
  const [docHidden, setDocHidden] = useState(false);
  const swipeX = useRef<number | null>(null);

  const running = n > 1 && !reduced && !paused && !hovering && !focusWithin && !docHidden;

  useEffect(() => {
    const onVis = () => setDocHidden(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(() => setIndex((i) => (i + 1) % n), AUTO_MS);
    return () => window.clearTimeout(timer);
  }, [running, index, n]);

  if (!n) return null;
  const go = (i: number) => setIndex(((i % n) + n) % n);

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(index - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      go(index + 1);
    }
  }
  function onBlur(e: FocusEvent) {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocusWithin(false);
  }
  function onPointerDown(e: PointerEvent) {
    if (e.pointerType !== "mouse") swipeX.current = e.clientX;
  }
  function onPointerUp(e: PointerEvent) {
    if (swipeX.current === null) return;
    const dx = e.clientX - swipeX.current;
    swipeX.current = null;
    if (Math.abs(dx) >= SWIPE_PX) go(dx < 0 ? index + 1 : index - 1);
  }

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Cảm nhận về Olympia Sóc Sơn"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onFocus={() => setFocusWithin(true)}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
    >
      <div
        className={`testimonial-stage grid touch-pan-y rounded-3xl border border-white/10 bg-white/95 px-5 py-8 md:px-10 md:py-10`}
        aria-live={running ? "off" : "polite"}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (swipeX.current = null)}
      >
        {items.map((t, i) => (
          <div
            key={t.id}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} / ${n}`}
            className={`testimonial-slide [grid-area:1/1] ${i === index ? "is-active" : ""}`}
          >
            <Slide t={t} />
          </div>
        ))}
      </div>

      {n > 1 && (
        <div className="mt-5 flex items-center justify-center gap-3">
          <div className="flex items-center">
            {items.map((t, i) => (
              <button
                key={t.id}
                type="button"
                aria-label={`Nhận xét ${i + 1} / ${n}`}
                aria-current={i === index ? "true" : undefined}
                onClick={() => go(i)}
                className="grid h-8 place-items-center px-1.5"
              >
                <span
                  aria-hidden
                  className={`block h-2.5 rounded-full transition-all duration-300 motion-reduce:transition-none ${
                    i === index ? "w-7 bg-white" : "w-2.5 bg-white/35 hover:bg-white/60"
                  }`}
                />
              </button>
            ))}
          </div>
          {!reduced && (
            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              aria-label={paused ? "Tiếp tục tự chuyển" : "Tạm dừng tự chuyển"}
              className="grid size-9 place-items-center rounded-full border border-white/40 text-white hover:border-white hover:bg-white/10"
            >
              {paused ? <PiPlay className="size-4" aria-hidden /> : <PiPause className="size-4" aria-hidden />}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
