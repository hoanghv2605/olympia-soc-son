import type { ReactNode } from "react";
import Breadcrumb from "./Breadcrumb";
import { hasImage } from "../lib/images";
import { asset } from "../lib/format";

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
  /** Ảnh làm nền mờ cho vùng đầu trang (đường dẫn trong public/); chỉ hiện khi ảnh có thật. Chỉ dùng với tông light. */
  backdrop?: string;
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
  backdrop,
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
  if (dark) return <header className="paper-dark text-white">{inner}</header>;
  if (!hasImage(backdrop)) return <header>{inner}</header>;
  return (
    <header className="relative isolate">
      {/* Ảnh nền: cao 320px (điện thoại 220px), mờ nhẹ, nhạt, tan dần xuống dưới; lớp phủ màu nền giữ chữ đủ tương phản */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[220px] overflow-hidden md:h-[320px]"
        style={{
          maskImage: "linear-gradient(to bottom, black 45%, transparent)",
          WebkitMaskImage: "linear-gradient(to bottom, black 45%, transparent)",
        }}
      >
        <img src={asset(backdrop)} alt="" className="size-full object-cover opacity-35 blur-[2px]" />
        <div className="absolute inset-0 bg-mist/40" />
      </div>
      {inner}
    </header>
  );
}
