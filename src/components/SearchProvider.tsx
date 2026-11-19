import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useLocation } from "react-router";
import SearchDialog from "./SearchDialog";
import { SearchContext } from "../lib/searchContext";

/** Đang gõ trong ô nhập liệu thì không bắt phím "/" */
function isTyping(target: EventTarget | null) {
  const el = target as HTMLElement | null;
  if (!el) return false;
  return el.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName);
}

/**
 * Quản lý hộp tìm kiếm chung: mở bằng nút tìm kiếm, phím "/" hoặc Ctrl+K / ⌘K;
 * đóng khi chuyển trang; khi đóng trả focus về phần tử đã mở (mặc định nút tìm kiếm trên header).
 */
export default function SearchProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const openerRef = useRef<HTMLElement | null>(null);
  const { pathname } = useLocation();

  const open = useCallback((opener?: HTMLElement | null) => {
    openerRef.current = opener ?? null;
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    const target = openerRef.current ?? document.querySelector<HTMLElement>("[data-search-button]");
    requestAnimationFrame(() => target?.focus());
  }, []);

  // Phím tắt
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        open();
      } else if (e.key === "/" && !e.ctrlKey && !e.metaKey && !e.altKey && !isTyping(e.target)) {
        e.preventDefault();
        open();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // Đóng khi chuyển trang
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const value = useMemo(() => ({ open }), [open]);

  return (
    <SearchContext.Provider value={value}>
      {children}
      <SearchDialog open={isOpen} onClose={close} />
    </SearchContext.Provider>
  );
}
