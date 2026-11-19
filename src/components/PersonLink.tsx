import { Link } from "react-router";
import { personName, personPath } from "../lib/data";

/** Tên thí sinh dẫn tới hồ sơ (rê chuột hiện thẻ xem nhanh, xem PersonPreview). */
export default function PersonLink({ id, className = "" }: { id: string; className?: string }) {
  return (
    <Link to={personPath(id)} data-person-preview={id} className={`font-medium text-oss hover:underline ${className}`}>
      {personName(id)}
    </Link>
  );
}
