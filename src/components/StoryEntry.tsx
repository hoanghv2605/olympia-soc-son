import { useState } from "react";
import { Link } from "react-router";
import { PiChatsCircle } from "react-icons/pi";
import PersonPhoto from "./PersonPhoto";
import { humanImage, humanPath, humans } from "../lib/data";
import { formatDate } from "../lib/format";

const BUTTON = "inline-flex min-h-9 items-center rounded-full border px-3.5 text-sm font-semibold";

/**
 * Ô Human of OSS ở trang chủ: một câu chuyện chọn ngẫu nhiên khi ô được dựng (không đổi khi vẽ lại), ảnh bên phải.
 * Ô có 2 nút riêng nên cả ô không phải là link.
 */
export default function StoryEntry() {
  const [story] = useState(() => humans[Math.floor(Math.random() * humans.length)]);
  return (
    <div className="entry-card flex min-w-0 flex-col p-5">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <PiChatsCircle className="size-8 shrink-0 text-oss" aria-hidden />
        <h3 className="h3 text-ink">Human of OSS</h3>
        <p className="ml-auto text-sm font-semibold text-oss tabular-nums">{humans.length} câu chuyện</p>
      </div>
      {story && (
        <div className="mt-3 flex items-start gap-4">
          <div className="min-w-0 flex-1">
            <p className="font-bold text-oss">{story.name}</p>
            <p className="text-sm text-ink-soft">{story.title}</p>
            <p className="mt-2 line-clamp-3 text-[15px] leading-relaxed text-ink italic">“{story.quote}”</p>
            <p className="mt-1.5 text-xs text-ink-soft tabular-nums">
              Tập {story.stt}
              {story.date && ` · ${formatDate(story.date)}`}
            </p>
          </div>
          <PersonPhoto
            key={story.slug}
            src={humanImage(story)}
            seed={story.slug}
            name={story.name}
            decorative
            className="size-20 shrink-0 rounded-full ring-2 ring-oss ring-offset-[3px] ring-offset-white"
          />
        </div>
      )}
      <div className="mt-auto flex flex-wrap gap-2 pt-4">
        {story && (
          <Link to={humanPath(story.slug)} className={`${BUTTON} border-oss bg-oss text-white hover:bg-oss-deep`}>
            Đọc câu chuyện
          </Link>
        )}
        <Link to="/human-of-oss" className={`${BUTTON} border-oss/30 bg-white text-oss hover:border-oss hover:bg-oss-soft`}>
          Tất cả câu chuyện
        </Link>
      </div>
    </div>
  );
}
