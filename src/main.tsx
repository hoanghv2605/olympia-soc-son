import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* HashRouter: URL dạng /#/wiki/thi-sinh – không bị lỗi 404 khi F5 trên GitHub Pages */}
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
);
