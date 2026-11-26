import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Khung cuộn ngang cho bảng điểm: chỉ khi bảng rộng hơn khung mới hiện dòng gợi ý vuốt ngay trên bảng
 * (đo bằng ResizeObserver, tự cập nhật khi xoay máy / đổi cỡ cửa sổ).
 */
export default function ScrollTable({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [wide, setWide] = useState(false);

  useEffect(() => {
    const box = ref.current;
    if (!box || typeof ResizeObserver === "undefined") return;
    const check = () => setWide(box.scrollWidth - box.clientWidth > 1);
    const observer = new ResizeObserver(check);
    observer.observe(box);
    if (box.firstElementChild) observer.observe(box.firstElementChild);
    check();
    return () => observer.disconnect();
  }, []);

  return (
    <div className={className}>
      {wide && <p className="scroll-hint">Vuốt ngang để xem điểm từng phần thi</p>}
      <div ref={ref} className="overflow-x-auto">
        {children}
      </div>
    </div>
  );
}
