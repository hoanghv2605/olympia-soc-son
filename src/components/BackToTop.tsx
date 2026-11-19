import { useEffect, useState } from "react";
import { PiArrowUp } from "react-icons/pi";

/** Nút tròn góc dưới phải, hiện khi đã cuộn quá 1,5 lần chiều cao màn hình. */
export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 1.5);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      aria-label="Lên đầu trang"
      onClick={() => {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
      }}
      className="fixed right-4 bottom-4 z-30 grid size-11 place-items-center rounded-full bg-oss text-white shadow-[0_10px_24px_-10px_rgba(109,40,217,0.7)] hover:bg-oss-deep md:right-6 md:bottom-6"
      style={{ marginBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <PiArrowUp className="size-5" aria-hidden />
    </button>
  );
}
