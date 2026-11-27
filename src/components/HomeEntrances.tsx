import { Link } from "react-router";
import { PiBooks, PiTrophy } from "react-icons/pi";
import Figure from "./Figure";
import PersonPhoto from "./PersonPhoto";
import SchoolStrip from "./SchoolStrip";
import SearchTrigger from "./SearchTrigger";
import SeasonStrip from "./SeasonStrip";
import StoryEntry from "./StoryEntry";
import { useChartTooltip } from "./ChartTooltip";
import { championCards, championPhoto, events, olympiaLaurelCount, people, personPath, schoolsOverview, seasons } from "../lib/data";

/** Lối tắt trong ô OSSPEDIA (mùa giải và trường đã có dải ảnh riêng, kèm nhãn dẫn tới danh sách). */
const SHORTCUTS = [
  { to: "/wiki/thi-sinh", label: "Danh sách thí sinh" },
  { to: "/wiki/su-kien", label: "Sự kiện khác" },
];

/** Ô OSSPEDIA (ô chính): số liệu tự tính, dải bìa các mùa, dải logo trường, lối tắt và ô tìm kiếm giả mở hộp tìm kiếm chung. */
function WikiEntry() {
  return (
    <div className="entry-card flex min-w-0 flex-col p-5 md:row-span-2 md:p-8">
      <PiBooks className="size-11 text-oss" aria-hidden />
      <h3 className="h2 mt-5 text-ink">
        <Link to="/wiki" className="entry-link">
          OSSPEDIA
        </Link>
      </h3>
      <p className="mt-2 text-[17px] text-ink-soft">Các mùa giải, hồ sơ thí sinh, các trường và sự kiện khác.</p>
      <Figure
        text={`${seasons.length} mùa · ${people.length} thí sinh · ${schoolsOverview().schools} trường · ${events.length} sự kiện`}
        className="mt-3 text-sm font-semibold text-oss tabular-nums"
      />
      <SeasonStrip />
      <SchoolStrip />
      {/* Lối tắt: nằm trên lớp link phủ ô (relative z-10) */}
      <ul className="relative z-10 mt-4 mb-4 flex flex-wrap gap-2">
        {SHORTCUTS.map((sc) => (
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
  );
}

/** Ô Bảng vàng: nền tối chữ vàng như đầu trang Bảng vàng, một hàng ảnh lúc vô địch (cùng nguồn Hall of Fame, theo mùa vô địch đầu tiên). */
function GoldEntry() {
  const champions = championCards();
  const { bind, tooltip } = useChartTooltip();
  return (
    <div className="entry-card paper-dark flex min-w-0 flex-col justify-center p-5">
      <div className="flex items-center gap-3">
        <PiTrophy className="size-8 shrink-0 text-gold-text" aria-hidden />
        <h3 className="h3 text-gold-text">
          <Link to="/bang-vang" className="entry-link">
            Bảng vàng
          </Link>
        </h3>
      </div>
      <p className="mt-2 text-[15px] text-white/75">Quán quân, kỷ lục và thành tích tại Đường lên đỉnh Olympia.</p>
      {/* số Quán quân = số người khác nhau từng vô địch; vòng nguyệt quế: thí sinh THPT Sóc Sơn, phạm vi toàn bộ.
          \u00a0 giữ liền các cụm: phần sau dài nên được xuống dòng giữa các cụm ở màn hẹp */}
      <Figure
        text={`${champions.length}\u00a0nhà vô địch OSS · ${olympiaLaurelCount("soc-son", "all")}\u00a0vòng\u00a0nguyệt\u00a0quế tại Đường\u00a0lên\u00a0đỉnh\u00a0Olympia`}
        wrap
        className="mt-2 text-sm font-semibold text-gold-text tabular-nums"
      />
      {/* Luôn 1 hàng: ảnh tự co khi hẹp */}
      <ul className="relative z-10 mt-4 flex gap-1 sm:gap-1.5">
        {champions.map(({ person, wins }) => {
          const name = `${person.name} · Quán quân mùa ${wins.map((w) => w.season).join(", ")}`;
          return (
            <li key={person.id} className="max-w-12 min-w-0 flex-1">
              <Link to={personPath(person.id)} aria-label={name} {...bind({ title: name, lines: [] })} className="block rounded-full">
                <PersonPhoto
                  src={championPhoto(person.id)}
                  seed={person.id}
                  name={person.name}
                  decorative
                  className="aspect-square w-full rounded-full ring-1 ring-gold/60"
                />
              </Link>
            </li>
          );
        })}
      </ul>
      {tooltip}
    </div>
  );
}

/**
 * Lối vào 3 phần chính. Ô OSSPEDIA và Bảng vàng: cả ô là link (link phủ kín ô bằng ::after, vì không được lồng nút trong <a>).
 * Từ md: OSSPEDIA bên trái cao bằng 2 ô bên phải cộng lại (2 hàng bằng nhau).
 */
export default function HomeEntrances() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:grid-rows-2 md:gap-5">
      <WikiEntry />
      <GoldEntry />
      <StoryEntry />
    </div>
  );
}
