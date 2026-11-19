import { useState } from "react";
import { asset } from "../lib/format";

/**
 * Logo OSS: thử lần lượt các file trong public/, file nào tải lỗi thì chuyển sang file kế tiếp.
 * Thả logo thật tên `logo-oss.svg` HOẶC `logo-oss.png` vào public/ là xong; `logo-oss-tam.svg` là logo tạm.
 * (Favicon chọn theo cùng thứ tự bằng đoạn script trong index.html.)
 */
const LOGO_CANDIDATES = ["logo-oss.svg", "logo-oss.png", "logo-oss-tam.svg"];

// Nhớ file đã dò được để các logo khác trên trang không phải thử lại từ đầu.
let resolvedIndex = 0;

export default function Logo({ className = "" }: { className?: string }) {
  const [index, setIndex] = useState(resolvedIndex);

  return (
    <img
      src={asset(LOGO_CANDIDATES[index])}
      alt=""
      className={className}
      onLoad={() => {
        resolvedIndex = index;
      }}
      onError={() => {
        if (index < LOGO_CANDIDATES.length - 1) setIndex(index + 1);
      }}
    />
  );
}
