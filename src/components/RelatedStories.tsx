import { Link } from "react-router";
import { humanPath, storiesOfMatch } from "../lib/data";

/** "Câu chuyện liên quan: {tiêu đề bài}" dưới bảng / biểu đồ của trận được kể trong bài Human of OSS. */
export default function RelatedStories({ season, code }: { season: number; code: string }) {
  const stories = storiesOfMatch(season, code);
  if (!stories.length) return null;
  return (
    <ul className="mt-4 space-y-1 text-[15px]">
      {stories.map((s) => (
        <li key={s.slug}>
          <span className="text-ink-soft">Câu chuyện liên quan: </span>
          <Link to={humanPath(s.slug)} className="link-strong">
            {s.headline}
          </Link>
        </li>
      ))}
    </ul>
  );
}
