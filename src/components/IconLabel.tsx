import type { ReactNode } from "react";
import type { IconType } from "react-icons";

/**
 * Nhãn / tiêu đề kèm 1 icon đứng trước chữ (icon chỉ để trang trí, aria-hidden).
 * Chỉ dùng cho tiêu đề và nhãn; không đặt icon trong ô bảng, danh sách, đoạn văn, menu, nút bấm.
 * Cỡ: nhãn ô thông tin `size-4`; tiêu đề mục `size-[0.9em]`; ô Kỷ lục `size-5`.
 */
export default function IconLabel({
  icon: Icon,
  iconClass = "size-4",
  children,
}: {
  icon: IconType;
  iconClass?: string;
  children: ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-2">
      <Icon aria-hidden="true" className={`shrink-0 ${iconClass}`} />
      {children}
    </span>
  );
}
