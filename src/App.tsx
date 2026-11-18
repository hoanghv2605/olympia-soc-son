import { Route, Routes } from "react-router";
import SiteLayout from "./components/SiteLayout";
import HomePage from "./pages/HomePage";
import AboutLayout from "./pages/about/AboutLayout";
import IntroPage from "./pages/about/IntroPage";
import StructurePage from "./pages/about/StructurePage";
import RulesPage from "./pages/about/RulesPage";
import ContactPage from "./pages/about/ContactPage";
import LibraryPage from "./pages/LibraryPage";
import HumanOfOssPage from "./pages/HumanOfOssPage";
import HallOfFamePage from "./pages/HallOfFamePage";
import WikiHome from "./pages/wiki/WikiHome";
import SeasonList from "./pages/wiki/SeasonList";
import SeasonDetail from "./pages/wiki/SeasonDetail";
import ContestantList from "./pages/wiki/ContestantList";
import ContestantDetail from "./pages/wiki/ContestantDetail";
import SchoolList from "./pages/wiki/SchoolList";
import SchoolDetail from "./pages/wiki/SchoolDetail";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route index element={<HomePage />} />

        <Route path="ve-chung-toi" element={<AboutLayout />}>
          <Route index element={<IntroPage />} />
          <Route path="co-cau-to-chuc" element={<StructurePage />} />
          <Route path="the-le" element={<RulesPage />} />
          <Route path="lien-he" element={<ContactPage />} />
        </Route>

        <Route path="bang-vang" element={<HallOfFamePage />} />
        <Route path="thu-vien" element={<LibraryPage />} />
        <Route path="human-of-oss" element={<HumanOfOssPage />} />

        <Route path="wiki">
          <Route index element={<WikiHome />} />
          <Route path="cuoc-thi" element={<SeasonList />} />
          <Route path="cuoc-thi/:slug" element={<SeasonDetail />} />
          <Route path="thi-sinh" element={<ContestantList />} />
          <Route path="thi-sinh/:id" element={<ContestantDetail />} />
          <Route path="truong" element={<SchoolList />} />
          <Route path="truong/:id" element={<SchoolDetail />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
