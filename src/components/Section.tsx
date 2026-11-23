import type { ReactNode } from "react";

/**
 * Khung một khối của trang. `tone="light"` (mặc định): khối thường (`.section`, nền sáng của trang).
 * `tone="dark"`: khối nền tối tràn ngang, dùng đúng nền `paper-dark` + chữ trắng + khoảng cách `section-band` như khối
 * Giới thiệu tối ở trang Về chúng tôi. Muốn đổi một khối sang tối chỉ cần thêm `tone="dark"`.
 */
export default function Section({
  tone = "light",
  labelledBy,
  className = "",
  children,
}: {
  tone?: "light" | "dark";
  /** id của tiêu đề khối (aria-labelledby) */
  labelledBy?: string;
  className?: string;
  children: ReactNode;
}) {
  if (tone === "dark") {
    return (
      <section aria-labelledby={labelledBy} className={`paper-dark text-white ${className}`.trim()}>
        <div className="section-band mx-auto max-w-6xl px-5">{children}</div>
      </section>
    );
  }
  return (
    <section aria-labelledby={labelledBy} className={`section mx-auto max-w-6xl px-5 pt-0 md:pt-0 ${className}`.trim()}>
      {children}
    </section>
  );
}
