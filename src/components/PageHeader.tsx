import type { ReactNode } from "react";
import Breadcrumb from "./Breadcrumb";

interface Crumb {
  to?: string;
  label: string;
}

interface Props {
  /** Dòng chỉ đường (OSSPEDIA / Các mùa giải / ...) */
  breadcrumb?: Crumb[];
  title: ReactNode;
  /** 1 dòng mô tả ngắn dưới tiêu đề */
  description?: ReactNode;
  /** Nội dung bên phải tiêu đề (vd nút chuyển mùa) */
  actions?: ReactNode;
  /** Nội dung đứng trước tiêu đề trên cùng hàng (vd huy hiệu trường) */
  leading?: ReactNode;
  /** "dark" chỉ dùng ở Bảng vàng (nối liền khối Hall of Fame nền tối) */
  tone?: "light" | "dark";
  /** Cho dòng mô tả trải hết bề ngang trên màn hình lớn (vd trang chủ OSSPEDIA) */
  wideDescription?: boolean;
}

/**
 * Đầu trang dùng chung: dòng chỉ đường, h1, 1 dòng mô tả; khoảng cách trên/dưới cố định.
 * Tông "light" mặc định; "dark" có nền giấy đen.
 */
export default function PageHeader({
  breadcrumb,
  title,
  description,
  actions,
  leading,
  tone = "light",
  wideDescription = false,
}: Props) {
  const dark = tone === "dark";
  const inner = (
    <div className="mx-auto max-w-6xl px-5 pt-12 pb-8 md:pt-16 md:pb-10">
      {breadcrumb && <Breadcrumb items={breadcrumb} tone={tone} />}
      <div className={`flex flex-wrap items-center justify-between gap-4 ${breadcrumb ? "mt-4" : ""}`}>
        <div className="flex min-w-0 items-center gap-4">
          {leading}
          <h1 className={`h1 ${dark ? "text-white" : "text-ink"}`}>{title}</h1>
        </div>
        {actions}
      </div>
      {description && (
        <p
          className={`mt-3 max-w-[64ch] text-[17px] text-balance ${wideDescription ? "lg:max-w-none" : ""} ${dark ? "text-white/75" : "text-ink-soft"}`}
        >
          {description}
        </p>
      )}
    </div>
  );
  return dark ? <header className="paper-dark text-white">{inner}</header> : <header>{inner}</header>;
}
