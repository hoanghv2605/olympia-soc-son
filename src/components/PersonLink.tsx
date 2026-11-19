import { useContext } from "react";
import { Link } from "react-router";
import { personName, personPath } from "../lib/data";
import { SeasonContext } from "../lib/seasonContext";

/** Tên thí sinh dẫn tới hồ sơ (rê chuột hiện thẻ xem nhanh, xem PersonPreview). */
export default function PersonLink({ id, className = "" }: { id: string; className?: string }) {
  const season = useContext(SeasonContext); // trên trang mùa: thẻ xem nhanh dùng ảnh đúng mùa
  return (
    <Link to={personPath(id)} data-person-preview={id} data-person-season={season} className={`font-medium text-oss hover:underline ${className}`}>
      {personName(id)}
    </Link>
  );
}
