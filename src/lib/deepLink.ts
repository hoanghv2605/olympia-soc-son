// Mở trang đúng mục theo đường dẫn: cuộn tới phần tử và làm nổi trong chốc lát.
import { useEffect } from "react";
import { useLocation, useSearchParams } from "react-router";
import { anchorCode, matchAnchor } from "./data";
import { scrollToId } from "./format";

const FLASH_MS = 2200;
/** Thời gian chờ trước khi chỉnh lại vị trí (font, ảnh tải xong có thể làm trang xê dịch) */
const SETTLE_MS = 900;

/**
 * Mỗi lần đổi địa chỉ (`location.key`, kể cả bấm lại cùng một mục): cuộn tới `targetId` và gắn lớp `deep-flash`.
 * Chạy trong requestAnimationFrame để đứng sau lệnh cuộn lên đầu của SiteLayout khi chuyển trang.
 * Không cuộn đè lên mục lục / thanh menu nhờ `scroll-margin-top` của phần tử.
 */
export function useDeepLink(targetId: string | undefined) {
  const { key } = useLocation();
  useEffect(() => {
    if (!targetId) return;
    let el: HTMLElement | null = null;
    let touched = false;
    const timers: number[] = [];
    const onUser = () => {
      touched = true;
    };
    const events = ["wheel", "touchstart", "pointerdown", "keydown"] as const;
    const frame = requestAnimationFrame(() => {
      el = document.getElementById(targetId);
      if (!el) return;
      // Mở thẳng bằng đường dẫn (tải lại, tab mới): nhảy ngay, không cuộn mượt qua cả trang
      if (key === "default") el.scrollIntoView({ block: "start" });
      else scrollToId(targetId);
      el.classList.add("deep-flash");
      events.forEach((e) => window.addEventListener(e, onUser, { passive: true }));
      timers.push(
        window.setTimeout(() => {
          const margin = parseFloat(getComputedStyle(el!).scrollMarginTop) || 0;
          if (!touched && Math.abs(el!.getBoundingClientRect().top - margin) > 8) el!.scrollIntoView({ block: "start" });
        }, SETTLE_MS),
        window.setTimeout(() => el?.classList.remove("deep-flash"), FLASH_MS),
      );
    });
    return () => {
      cancelAnimationFrame(frame);
      timers.forEach((t) => window.clearTimeout(t));
      events.forEach((e) => window.removeEventListener(e, onUser));
      el?.classList.remove("deep-flash");
    };
  }, [targetId, key]);
}

/**
 * `?tran=vl|bk1|bk2|bk3|ck` cho trang mùa và trang sự kiện dạng mùa thi. Trả về hàm dùng cho mục lục:
 * mục là một trận thì ghi mã vào địa chỉ (thay, không thêm lịch sử); mục khác thì chỉ cuộn và bỏ `tran`.
 */
export function useMatchLink() {
  const [params, setParams] = useSearchParams();
  useDeepLink(matchAnchor(params.get("tran")));
  return (anchor: string) => {
    const code = anchorCode(anchor);
    setParams(code ? { tran: code } : {}, { replace: true });
    if (!code) scrollToId(anchor);
  };
}
