import { useEffect, useState, type RefObject } from "react";

/** Người dùng có bật "giảm chuyển động" không (đọc 1 lần lúc gọi). */
export function prefersReducedMotion() {
  return typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

/** Theo dõi một media query, vd "(max-width: 639px)". */
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => typeof window !== "undefined" && !!window.matchMedia?.(query).matches);
  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);
  return matches;
}

/** true khi phần tử cuộn vào màn hình (tỉ lệ hiện ≥ threshold); chỉ đổi 1 lần (false → true). */
export function useInViewOnce(ref: RefObject<Element | null>, threshold = 0.3) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting && e.intersectionRatio >= threshold)) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, threshold, inView]);
  return inView;
}
