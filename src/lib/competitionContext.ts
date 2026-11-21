import { createContext, useContext } from "react";
import { ossCompetition } from "./data";
import type { Competition } from "../types";

/** Nguồn dữ liệu của bảng / biểu đồ cuộc thi đang xem. Mặc định OSS; trang DOC3 bọc bằng `doc3Competition`. */
export const CompetitionContext = createContext<Competition>(ossCompetition);

export const useCompetition = () => useContext(CompetitionContext);
