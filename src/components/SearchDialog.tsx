import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { Link, useNavigate } from "react-router";
import { PiMagnifyingGlass, PiXBold } from "react-icons/pi";
import { EVENT_ICON } from "../lib/eventIcons";
import { SEARCH_GROUP_LABEL, SEARCH_GROUP_ORDER, flattenGroups, searchAll } from "../lib/search";

/**
 * Hộp tìm kiếm chung (dialog gốc + showModal: khóa nền, giữ focus, Esc đóng).
 * Máy tính: hộp nổi giữa màn hình; điện thoại: toàn màn hình.
 * Bàn phím: ↑ ↓ chọn dòng, Enter mở, Esc đóng.
 */
export default function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const navigate = useNavigate();
  const baseId = useId();

  const groups = useMemo(() => searchAll(query), [query]);
  const flat = useMemo(() => flattenGroups(groups), [groups]);
  const optionId = (i: number) => `${baseId}-opt-${i}`;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      setQuery("");
      setActive(0);
      dialog.showModal();
      inputRef.current?.focus();
    }
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // Dòng đang chọn luôn nằm trong vùng nhìn thấy
  useEffect(() => {
    document.getElementById(`${baseId}-opt-${active}`)?.scrollIntoView({ block: "nearest" });
  }, [active, baseId]);

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (!flat.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => (a + 1) % flat.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => (a - 1 + flat.length) % flat.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const r = flat[active];
      if (r) {
        onClose();
        navigate(r.to);
      }
    }
  }

  const q = query.trim();
  let index = -1;

  return (
    <dialog
      ref={dialogRef}
      aria-label="Tìm kiếm"
      className="modal search-modal"
      onClose={() => open && onClose()}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-panel search-panel">
        <div className="flex items-center gap-3 border-b border-oss/15 px-4 py-3 md:px-5">
          <PiMagnifyingGlass className="size-5 shrink-0 text-oss" aria-hidden />
          <input
            ref={inputRef}
            type="search"
            role="combobox"
            aria-expanded={flat.length > 0}
            aria-controls={`${baseId}-list`}
            aria-activedescendant={flat.length ? optionId(active) : undefined}
            aria-autocomplete="list"
            aria-label="Tìm thí sinh, mùa giải, trường, sự kiện"
            placeholder="Tìm thí sinh, mùa giải, trường, sự kiện"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={onKeyDown}
            className="min-w-0 flex-1 bg-transparent py-1.5 text-base outline-none placeholder:text-ink-soft/70"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng tìm kiếm"
            className="grid size-10 shrink-0 place-items-center rounded-full text-ink-soft hover:bg-oss-soft hover:text-oss"
          >
            <PiXBold className="size-5" aria-hidden />
          </button>
        </div>

        <div className="search-results px-2 py-3 md:px-3">
          {!q ? (
            <p className="px-3 py-2 text-sm text-ink-soft">Gõ tên thí sinh, mùa (vd: mùa 4), tên trường hoặc sự kiện</p>
          ) : !flat.length ? (
            <p className="px-3 py-2 text-sm text-ink-soft" role="status">
              Không tìm thấy “{q}”. Thử gõ ngắn hơn, ví dụ chỉ tên.
            </p>
          ) : (
            <div id={`${baseId}-list`} role="listbox" aria-label="Kết quả tìm kiếm">
              {SEARCH_GROUP_ORDER.map((kind) =>
                groups[kind].length ? (
                  <div key={kind} role="group" aria-labelledby={`${baseId}-${kind}`} className="mb-2 last:mb-0">
                    <p id={`${baseId}-${kind}`} className="px-3 pt-1 pb-1.5 text-xs font-semibold text-ink-soft">
                      {SEARCH_GROUP_LABEL[kind]}
                    </p>
                    {groups[kind].map((r) => {
                      index += 1;
                      const i = index;
                      const selected = i === active;
                      return (
                        <Link
                          key={r.id}
                          id={optionId(i)}
                          to={r.to}
                          role="option"
                          aria-selected={selected}
                          tabIndex={-1}
                          onMouseMove={() => setActive(i)}
                          onClick={onClose}
                          className={`block rounded-lg px-3 py-2 ${selected ? "bg-oss-soft" : ""}`}
                        >
                          <span className={`flex items-center gap-2 font-semibold ${selected ? "text-oss" : "text-ink"}`}>
                            {r.eventType && (() => {
                              const Icon = EVENT_ICON[r.eventType];
                              return <Icon className="size-[0.9em] shrink-0" aria-hidden />;
                            })()}
                            {r.title}
                          </span>
                          <span className="block text-sm text-ink-soft">{r.subtitle}</span>
                        </Link>
                      );
                    })}
                  </div>
                ) : null,
              )}
            </div>
          )}
        </div>
        <p className="hidden border-t border-oss/10 px-5 py-2.5 text-xs text-ink-soft md:block">
          ↑ ↓ để chọn · Enter để mở · Esc để đóng
        </p>
      </div>
    </dialog>
  );
}
