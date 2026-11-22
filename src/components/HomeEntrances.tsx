import { Link } from "react-router";
import type { IconType } from "react-icons";
import { PiBooks, PiChatsCircle, PiFlag, PiTrophy } from "react-icons/pi";
import Figure from "./Figure";
import SearchTrigger from "./SearchTrigger";
import {
  championCards,
  events,
  humans,
  olympiaLaurelCount,
  people,
  schoolsOverview,
  seasonPath,
  seasons,
  site,
} from "../lib/data";
import { yearOf } from "../lib/format";

interface Entry {
  to: string;
  icon: IconType;
  title: string;
  description: string;
  stat: string;
}

/** 3 lối tắt trong ô OSSPEDIA: mùa mới nhất (tự tính), danh sách thí sinh, các trường. */
function shortcuts() {
  const latest = seasons[seasons.length - 1];
  return [
    ...(latest ? [{ to: seasonPath(latest.season), label: `Mùa ${latest.season}` }] : []),
    { to: "/wiki/thi-sinh", label: "Danh sách thí sinh" },
    { to: "/wiki/truong", label: "Các trường" },
    { to: "/wiki/su-kien", label: "Sự kiện khác" },
  ];
}

/** Số liệu đều tự tính từ dữ liệu. */
function entries(): Entry[] {
  return [
    {
      to: "/wiki",
      icon: PiBooks,
      title: "OSSPEDIA",
      description: "Các mùa giải, hồ sơ thí sinh, các trường và sự kiện khác.",
      stat: `${seasons.length} mùa · ${people.length} thí sinh · ${schoolsOverview().schools} trường · ${events.length} sự kiện`,
    },
    {
      to: "/bang-vang",
      icon: PiTrophy,
      title: "Bảng vàng",
      description: "Quán quân, kỷ lục và thành tích tại Đường lên đỉnh Olympia.",
      // số Quán quân = số người khác nhau từng vô địch; vòng nguyệt quế: thí sinh THPT Sóc Sơn, phạm vi toàn bộ
      stat: `${championCards().length} Quán quân · ${olympiaLaurelCount("soc-son", "all")} vòng nguyệt quế`,
    },
    {
      to: "/human-of-oss",
      icon: PiChatsCircle,
      title: "Human of OSS",
      description: "Những con người và câu chuyện phía sau OSS.",
      stat: `${humans.length} câu chuyện`,
    },
    {
      to: "/ve-chung-toi",
      icon: PiFlag,
      title: "Về chúng tôi",
      description: "Lịch sử và cơ cấu tổ chức.",
      stat: `Thành lập năm ${yearOf(site.foundedDate)}`,
    },
  ];
}

/**
 * Lối vào 4 phần chính. Cả ô là link (link phủ kín ô bằng ::after, vì không được lồng nút trong <a>);
 * ô OSSPEDIA là ô chính, có ô tìm kiếm giả mở hộp tìm kiếm chung.
 */
export default function HomeEntrances() {
  const [main, ...rest] = entries();
  const MainIcon = main.icon;
  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-5">
      <div className="entry-card flex flex-col p-6 md:row-span-3 md:p-8">
        <MainIcon className="size-11 text-oss" aria-hidden />
        <h3 className="h2 mt-5 text-ink">
          <Link to={main.to} className="entry-link">
            {main.title}
          </Link>
        </h3>
        <p className="mt-2 text-[17px] text-ink-soft">{main.description}</p>
        <Figure text={main.stat} className="mt-3 text-sm font-semibold text-oss tabular-nums" />
        {/* Lối tắt: nằm trên lớp link phủ ô (relative z-10) */}
        <ul className="relative z-10 mt-5 mb-6 flex flex-wrap gap-2">
          {shortcuts().map((sc) => (
            <li key={sc.to}>
              <Link
                to={sc.to}
                className="inline-flex min-h-9 items-center rounded-full border border-oss/30 bg-white px-3.5 text-sm font-semibold text-oss hover:border-oss hover:bg-oss-soft"
              >
                {sc.label}
              </Link>
            </li>
          ))}
        </ul>
        <SearchTrigger label="Tìm thí sinh, mùa giải, trường, sự kiện" className="relative z-10 md:mt-auto" />
      </div>

      {rest.map((e) => {
        const Icon = e.icon;
        return (
          <div key={e.to} className="entry-card flex items-start gap-4 p-5">
            <Icon className="size-8 shrink-0 text-oss" aria-hidden />
            <div className="min-w-0">
              <h3 className="h3 text-ink">
                <Link to={e.to} className="entry-link">
                  {e.title}
                </Link>
              </h3>
              <p className="mt-1 text-[15px] text-ink-soft">{e.description}</p>
              <Figure text={e.stat} className="mt-2 text-sm font-semibold text-oss tabular-nums" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
