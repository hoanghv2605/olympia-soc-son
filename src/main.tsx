import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router";
import App from "./App";
import "./index.css";
import { trackInputModality } from "./lib/inputModality";
import { LOGO_FILE } from "./components/Logo";
import { asset } from "./lib/format";

// Vòng focus chỉ hiện khi dùng bàn phím (xem src/lib/inputModality.ts)
trackInputModality();

// Favicon: cùng file với logo (logo-oss.svg → logo-oss.png → logo-oss-tam.svg, theo danh sách ảnh có sẵn)
const favicon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
if (favicon) {
  favicon.href = asset(LOGO_FILE);
  favicon.type = LOGO_FILE.endsWith(".png") ? "image/png" : "image/svg+xml";
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* HashRouter: URL dạng /#/wiki/thi-sinh – không bị lỗi 404 khi F5 trên GitHub Pages */}
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
);
