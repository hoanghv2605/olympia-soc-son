import { PiMagnifyingGlass } from "react-icons/pi";
import { useSearch } from "../lib/searchContext";

/** Nút trông như ô tìm kiếm; bấm vào thì mở hộp tìm kiếm chung. */
export default function SearchTrigger({
  label = "Tìm thí sinh, mùa giải, trường",
  className = "",
}: {
  label?: string;
  className?: string;
}) {
  const { open } = useSearch();
  return (
    <button
      type="button"
      onClick={(e) => open(e.currentTarget)}
      aria-haspopup="dialog"
      className={`flex w-full items-center gap-3 rounded-full border border-oss/20 bg-white/80 px-5 py-3 text-left text-[15px] text-ink-soft/80 transition-colors hover:border-oss ${className}`}
    >
      <PiMagnifyingGlass className="size-5 shrink-0 text-oss" aria-hidden />
      <span className="flex-1 truncate">{label}</span>
      <kbd className="hidden rounded border border-oss/20 px-1.5 text-xs font-semibold text-ink-soft md:inline">/</kbd>
    </button>
  );
}
