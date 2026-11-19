import { asset } from "../lib/format";
import { pickImage } from "../lib/images";

/**
 * Logo OSS: dùng file đầu tiên có trong public/ theo thứ tự dưới đây (theo danh sách ảnh có sẵn).
 * Thả logo thật tên `logo-oss.svg` HOẶC `logo-oss.png` vào public/ là xong; `logo-oss-tam.svg` là logo tạm.
 * Favicon dùng cùng file (đặt trong src/main.tsx).
 */
const LOGO_CANDIDATES = ["logo-oss.svg", "logo-oss.png", "logo-oss-tam.svg"];

/** File logo đang dùng: file đầu tiên có trong danh sách ảnh có sẵn (mặc định logo tạm). */
export const LOGO_FILE = pickImage(LOGO_CANDIDATES) ?? "logo-oss-tam.svg";

export default function Logo({ className = "" }: { className?: string }) {
  return <img src={asset(LOGO_FILE)} alt="" className={className} />;
}
