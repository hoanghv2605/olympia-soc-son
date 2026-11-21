import { useContext } from "react";
import { Link } from "react-router";
import { useCompetition } from "../lib/competitionContext";
import { SeasonContext } from "../lib/seasonContext";

/**
 * Tên thí sinh dẫn tới hồ sơ (rê chuột hiện thẻ xem nhanh, xem PersonPreview).
 * Người không có hồ sơ OSSPEDIA (vd một số thí sinh DOC3) chỉ hiện chữ thường.
 */
export default function PersonLink({ id, className = "" }: { id: string; className?: string }) {
  const season = useContext(SeasonContext); // trên trang mùa: thẻ xem nhanh dùng ảnh đúng mùa
  const comp = useCompetition();
  const to = comp.personTo(id);
  if (!to) return <span className={`font-medium ${className}`}>{comp.personName(id)}</span>;
  return (
    <Link to={to} data-person-preview={comp.previewId(id)} data-person-season={season} className={`font-medium text-oss hover:underline ${className}`}>
      {comp.personName(id)}
    </Link>
  );
}
