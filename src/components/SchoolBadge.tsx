import { useState } from "react";
import { schoolLogoCandidates } from "../lib/data";
import { asset } from "../lib/format";
import { pickImage } from "../lib/images";
import type { School } from "../types";

/**
 * Huy hiệu tròn của trường: dùng public/images/truong/<id>.svg hoặc <id>.png nếu có trong danh sách ảnh có sẵn;
 * chưa có logo (hoặc tải lỗi) thì hiện chữ viết tắt `short` trên nền tím nhạt.
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
  // Chỉ dùng logo có trong danh sách ảnh có sẵn; lỗi tải (dự phòng) thì về chữ viết tắt
  const file = pickImage(schoolLogoCandidates(school.id));
  const [failed, setFailed] = useState(false);

  if (!file || failed) {
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
      src={asset(file)}
      alt=""
      onError={() => setFailed(true)}
      className={`shrink-0 rounded-full bg-white object-contain p-1 ring-1 ring-oss/15 ${className}`}
    />
  );
}
