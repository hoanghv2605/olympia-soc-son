import { asset } from "../lib/format";

// Logo nằm ở public/logo-oss.svg – thay bằng file logo thật (giữ nguyên tên) là xong.
export default function Logo({ className = "" }: { className?: string }) {
  return <img src={asset("logo-oss.svg")} alt="" className={className} />;
}
