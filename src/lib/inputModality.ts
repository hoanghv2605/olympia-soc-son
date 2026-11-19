/**
 * Ghi nhận người dùng đang thao tác bằng chuột/chạm hay bàn phím: <html data-input="pointer" | "keyboard">.
 * CSS dùng để ẩn vòng focus khi focus được trả về bằng code sau một cú bấm chuột
 * (Chrome vẫn coi đó là :focus-visible). Dùng bàn phím (Tab, phím mũi tên…) thì vòng focus vẫn hiện.
 */
export function trackInputModality() {
  const root = document.documentElement;
  const set = (mode: "pointer" | "keyboard") => {
    if (root.dataset.input !== mode) root.dataset.input = mode;
  };
  document.addEventListener("pointerdown", () => set("pointer"), { capture: true, passive: true });
  document.addEventListener(
    "keydown",
    (e) => {
      // phím bổ trợ đơn lẻ không tính là chuyển sang bàn phím
      if (!["Shift", "Control", "Alt", "Meta"].includes(e.key)) set("keyboard");
    },
    { capture: true },
  );
}
