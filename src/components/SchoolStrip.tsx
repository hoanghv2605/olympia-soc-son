import { Link } from "react-router";
import SchoolBadge from "./SchoolBadge";
import StripLabel from "./StripLabel";
import { useChartTooltip } from "./ChartTooltip";
import { schoolPath, schools } from "../lib/data";

/** Dải logo các trường (thứ tự trong schools.json), cùng cỡ ô với dải bìa mùa; mỗi logo là link tới trang trường. */
export default function SchoolStrip() {
  const { bind, tooltip } = useChartTooltip();
  return (
    <div className="mt-3">
      <StripLabel to="/wiki/truong">Trường</StripLabel>
      <ul className="relative z-10 flex w-fit flex-wrap gap-1.5">
        {schools.map((school) => (
          <li key={school.id}>
            <Link to={schoolPath(school.id)} aria-label={school.name} {...bind({ title: school.name, lines: [] })} className="block rounded-full">
              <SchoolBadge school={school} className="block size-10" textClass="text-xs" />
            </Link>
          </li>
        ))}
      </ul>
      {tooltip}
    </div>
  );
}
