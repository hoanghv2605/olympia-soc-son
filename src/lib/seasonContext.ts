import { createContext } from "react";

/** Mùa của trang đang xem (trang mùa). PersonLink gắn `data-person-season` để thẻ xem nhanh dùng ảnh đúng mùa. */
export const SeasonContext = createContext<number | undefined>(undefined);
