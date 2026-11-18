import { Link } from "react-router";
import { personName, personPath } from "../lib/data";

/** Tên thí sinh dẫn tới hồ sơ. */
export default function PersonLink({ id, className = "" }: { id: string; className?: string }) {
  return (
    <Link to={personPath(id)} className={`font-medium text-oss hover:underline ${className}`}>
      {personName(id)}
    </Link>
  );
}
