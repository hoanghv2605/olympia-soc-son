import { Link } from "react-router";

/** Nhãn nhỏ phía trên một dải ảnh ở ô OSSPEDIA, là link tới trang danh sách (nằm trên lớp link phủ ô). */
export default function StripLabel({ to, children }: { to: string; children: string }) {
  return (
    <Link to={to} className="relative z-10 mb-1.5 inline-block text-xs font-semibold text-ink-soft hover:text-oss hover:underline">
      {children}
    </Link>
  );
}
