import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// base: "./" + HashRouter => chạy được ở mọi nơi (localhost, github.io/<ten-repo>/, tên miền riêng)
// mà không cần khai báo tên repo.
export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss()],
});
