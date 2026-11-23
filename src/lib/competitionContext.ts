import { createContext, useContext } from "react";
import { ossCompetition } from "./data";
import type { Competition } from "../types";

/** Nguồn dữ liệu của bảng / biểu đồ cuộc thi đang xem. Hiện chỉ có nguồn OSS (mặc định); sự kiện dạng mùa thi (DOC) có bảng riêng ở DocSections. */
export const CompetitionContext = createContext<Competition>(ossCompetition);

export const useCompetition = () => useContext(CompetitionContext);
