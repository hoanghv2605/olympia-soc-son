import { Link } from "react-router";
import type { IconType } from "react-icons";
import { PiBooks, PiChatsCircle, PiFlag, PiTrophy } from "react-icons/pi";
import SearchTrigger from "./SearchTrigger";
import {
  championCards,
  humans,
  olympiaLaurelCount,
  people,
  schoolsOverview,
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

/** Số liệu đều tự tính từ dữ liệu. */
function entries(): Entry[] {
  return [
    {
      to: "/wiki",
      icon: PiBooks,
      title: "OSSPEDIA",
      description: "Các mùa giải, hồ sơ thí sinh và các trường.",
      stat: `${seasons.length} mùa · ${people.length} thí sinh · ${schoolsOverview().schools} trường`,
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
      description: "Lịch sử, cơ cấu tổ chức và liên hệ.",
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
        <p className="mt-3 mb-6 text-sm font-semibold text-oss tabular-nums">{main.stat}</p>
        <SearchTrigger className="relative z-10 md:mt-auto" />
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
              <p className="mt-2 text-sm font-semibold text-oss tabular-nums">{e.stat}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
