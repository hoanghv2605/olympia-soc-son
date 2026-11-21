import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router";
import SiteLayout from "./components/SiteLayout";
import HomePage from "./pages/HomePage";
import AboutLayout from "./pages/about/AboutLayout";
import IntroPage from "./pages/about/IntroPage";
import StructurePage from "./pages/about/StructurePage";
import LibraryPage from "./pages/LibraryPage";
import LibrarySeasonPage from "./pages/LibrarySeasonPage";
import HumanOfOssPage from "./pages/HumanOfOssPage";
import HallOfFamePage from "./pages/HallOfFamePage";
import WikiHome from "./pages/wiki/WikiHome";
import SeasonList from "./pages/wiki/SeasonList";
import SeasonDetail from "./pages/wiki/SeasonDetail";
import ContestantList from "./pages/wiki/ContestantList";
import ContestantDetail from "./pages/wiki/ContestantDetail";
import SchoolList from "./pages/wiki/SchoolList";
import SchoolDetail from "./pages/wiki/SchoolDetail";
import EventList from "./pages/wiki/EventList";
import NotFound from "./pages/NotFound";

// Trang bài viết dùng react-markdown: tách thành gói riêng, chỉ tải khi mở bài
// Trang sự kiện dùng react-markdown (phần giới thiệu): cũng tải riêng
const EventDetail = lazy(() => import("./pages/wiki/EventDetail"));
const HumanStoryPage = lazy(() => import("./pages/HumanStoryPage"));

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route index element={<HomePage />} />

        <Route path="ve-chung-toi" element={<AboutLayout />}>
          <Route index element={<IntroPage />} />
          <Route path="co-cau-to-chuc" element={<StructurePage />} />
          {/* Đường dẫn cũ: Thể lệ đã bỏ, Liên hệ đã gộp vào trang Giới thiệu */}
          <Route path="the-le" element={<Navigate to="/ve-chung-toi" replace />} />
          <Route path="lien-he" element={<Navigate to="/ve-chung-toi" replace />} />
        </Route>

        <Route path="bang-vang" element={<HallOfFamePage />} />
        <Route path="thu-vien" element={<LibraryPage />} />
        <Route path="thu-vien/:slug" element={<LibrarySeasonPage />} />
        <Route path="human-of-oss" element={<HumanOfOssPage />} />
        <Route
          path="human-of-oss/:slug"
          element={
            <Suspense fallback={<div className="min-h-[60vh]" />}>
              <HumanStoryPage />
            </Suspense>
          }
        />

        <Route path="wiki">
          <Route index element={<WikiHome />} />
          <Route path="cuoc-thi" element={<SeasonList />} />
          <Route path="cuoc-thi/:slug" element={<SeasonDetail />} />
          <Route path="thi-sinh" element={<ContestantList />} />
          <Route path="thi-sinh/:id" element={<ContestantDetail />} />
          <Route path="truong" element={<SchoolList />} />
          <Route path="truong/:id" element={<SchoolDetail />} />
          <Route path="su-kien" element={<EventList />} />
          <Route
            path="su-kien/:id"
            element={
              <Suspense fallback={<div className="min-h-[60vh]" />}>
                <EventDetail />
              </Suspense>
            }
          />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
