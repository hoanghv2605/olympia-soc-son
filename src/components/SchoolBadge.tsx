import { useState } from "react";
import { schoolLogoCandidates } from "../lib/data";
import { asset } from "../lib/format";
import type { School } from "../types";

/**
 * Huy hiệu tròn của trường. Thử lần lượt public/images/truong/<id>.svg → <id>.png
 * (tải lỗi thì chuyển file kế tiếp); chưa có logo thì hiện chữ viết tắt `short` trên nền tím nhạt.
 * Cỡ truyền qua `className` (vd "size-11 md:size-14"). Tên trường luôn đứng cạnh nên ảnh để alt="".
 */
export default function SchoolBadge({
  school,
  className = "size-14",
  textClass = "text-base",
}: {
  school: School;
  className?: string;
  textClass?: string;
}) {
  const files = schoolLogoCandidates(school.id);
  const [index, setIndex] = useState(0);

  if (index >= files.length) {
    return (
      <span
        aria-hidden="true"
        className={`grid shrink-0 place-items-center rounded-full bg-oss-soft font-extrabold tracking-wide text-oss-deep ${textClass} ${className}`}
      >
        {school.short}
      </span>
    );
  }

  return (
    <img
      key={files[index]}
      src={asset(files[index])}
      alt=""
      onError={() => setIndex((i) => i + 1)}
      className={`shrink-0 rounded-full bg-white object-contain p-1 ring-1 ring-oss/15 ${className}`}
    />
  );
}
