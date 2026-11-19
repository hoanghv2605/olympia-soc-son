import { createContext, useContext } from "react";

export interface SearchContextValue {
  /** Mở hộp tìm kiếm. `opener`: phần tử sẽ nhận lại focus khi đóng (mặc định: nút tìm kiếm trên header). */
  open: (opener?: HTMLElement | null) => void;
}

export const SearchContext = createContext<SearchContextValue>({ open: () => {} });

export function useSearch() {
  return useContext(SearchContext);
}
