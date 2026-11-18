# Olympia Sóc Sơn – website (ghi chú cho Claude Code)

Website lưu trữ lịch sử, kết quả và con người của **Olympia Sóc Sơn (OSS)**: sân chơi trí tuệ mô phỏng Đường lên đỉnh Olympia (ĐLĐO) cho học sinh THPT Sóc Sơn, Hà Nội, thành lập tháng 7/2017. Chủ dự án: Kit. Trả lời bằng tiếng Việt.

## Lệnh
- `npm run dev`: chạy thử (http://localhost:5173)
- `npm run build`: đóng gói. **Luôn chạy và phải pass trước khi báo xong.**
- `npm run typecheck`: kiểm tra TypeScript. Chạy kèm build.

## Công nghệ
React 19, TypeScript, Vite 8, Tailwind CSS 4 (cấu hình trong `src/index.css`, không có tailwind.config), React Router 8 dùng `HashRouter` (URL dạng `/#/...`), `vite.config.ts` có `base: "./"`. Deploy GitHub Pages qua `.github/workflows/deploy.yml`. Icon: `react-icons`. Markdown: `react-markdown`.

## Cấu trúc web (đã duyệt, v0.3)
Menu chính: **Về chúng tôi · OSSPEDIA · Bảng vàng · Human of OSS · Thư viện**
- Về chúng tôi (`/ve-chung-toi`): **Giới thiệu** (gồm cả phần Liên hệ ở cuối trang) và **Cơ cấu tổ chức**. Menu con căn phải. Không còn trang Thể lệ; `/ve-chung-toi/the-le` và `/ve-chung-toi/lien-he` chuyển hướng về `/ve-chung-toi`.
  - Thứ tự trang Giới thiệu (xen kẽ tối/sáng): Giới thiệu (tối) → Những cột mốc đáng nhớ (sáng) → Những con số ấn tượng (tối, 2 nhóm) → Liên hệ (sáng) → Footer (tối).
- OSSPEDIA (`/wiki`): mùa giải (`/wiki/cuoc-thi/mua-N`), thí sinh (`/wiki/thi-sinh/:id`), trường (`/wiki/truong/:id`), tìm kiếm
- Bảng vàng (`/bang-vang`): quán quân các mùa, OSS tại ĐLĐO (chỉ thí sinh THPT Sóc Sơn, thẻ + hộp nổi), kỷ lục, vào Chung kết nhiều lần
- Human of OSS (`/human-of-oss`, bài viết `/human-of-oss/:slug`), Thư viện

## Dữ liệu (quy tắc bắt buộc)
- Toàn bộ dữ liệu ở `src/data/*.json`; **mọi trang chỉ lấy dữ liệu qua `src/lib/data.ts`**.
- **Không gõ tay số liệu tính được** (quán quân, số thí sinh ĐLĐO, vòng nguyệt quế, kỷ lục, thống kê trường…). Tính từ `matches.json`, `qualifying.json`, `olympia.json`. Chỉ các mục `"manual": true` trong `stats.json` là nhập tay.
- **Ô trống (`null`) ≠ 0**: `null` = không có dữ liệu / không thi; `0` = có thi, được 0 điểm. Không đổi `null` thành 0 khi hiển thị hay tính toán.
- Tổng điểm không âm: nếu 4 phần thi cộng ra số âm thì `total` = 0 (giữ nguyên điểm từng phần).
- Hòa điểm: `tiebreakWinner` của trận là người thắng câu hỏi phụ; `rank` trong trận đã tính sẵn.
- Thuật ngữ danh hiệu OSS: dùng thống nhất **Quán quân / Á quân / Quý quân** (không viết "Vô địch", "Giải ba"). Khóa `placement` giữ nguyên (`vo-dich` / `a-quan` / `giai-ba`); nhãn hiển thị lấy từ `PLACEMENT_LABEL` trong `src/lib/data.ts`. Thành tích ĐLĐO giữ nguyên chữ trong `olympia.json` ("Giải Nhất", "Giải Nhì", "Giải Ba", "Quý quân"). Top 12 = qua vòng loại.
- Bảng trận BK/CK giữ **đúng thứ tự thí sinh trong `matches.json`** (thứ tự đứng trên sân khấu), không sắp lại theo điểm.
- Kỷ lục xếp hạng **kiểu Olympic (1-1-3)**: bằng điểm cùng hạng, người tiếp theo nhảy hạng; bảng lấy mọi dòng có điểm ≥ điểm dòng thứ 10 (`topRecords` trong `data.ts`).
- Human of OSS: thông tin bài ở `src/data/humans.json`, nội dung ở `src/content/human-of-oss/<slug>.md` (markdown, hiển thị bằng `react-markdown`, không bật HTML thô).
- Mã thí sinh (`people.json` → `id`) là cố định, dùng làm đường dẫn. Người trùng tên có hậu tố, ví dụ `nguyen-thi-ngoc-anh-xuan16`.
- Ngày lưu `YYYY-MM-DD`, hiển thị `dd/mm/yyyy`.

## Ảnh (theo quy ước tên file, không khai báo trong JSON)
- Thí sinh: `public/images/thi-sinh/<mã-thí-sinh>.jpg` (mã = `id` trong `people.json`)
- Cột mốc: `public/images/cot-moc/<YYYY-MM-DD>.jpg` (theo `date` của cột mốc)
- Human of OSS: `public/images/human-of-oss/<slug>.jpg`
- Chưa có ảnh: người → chữ viết tắt (chữ cái đầu 2 từ cuối, vd Lê Trà My → "TM") trên gradient tím (`PersonPhoto`); cột mốc → logo OSS trên gradient tím (`MilestonePhoto`).

## Quyền riêng tư (đa số thí sinh dưới 18 tuổi)
Chỉ hiển thị họ tên, lớp, trường, kết quả thi. Không thêm số điện thoại, Facebook cá nhân, học lực hay lý do riêng của thí sinh. Ảnh cá nhân chỉ dùng khi có đồng ý.

## Thiết kế
Hiện đại, chất "học thuật", nền sáng tím nhạt kiểu màu nước, chữ tối (`ink`), màu chủ đạo tím `oss` (#6d28d9), điểm nhấn xanh/hồng lấy từ logo khối lập phương. Các mảng tối dùng lớp `paper-dark`. Font Be Vietnam Pro. Hiệu ứng chuyển động tiết chế, tôn trọng `prefers-reduced-motion`. Không nhồi chi tiết thừa. Giữ các token màu và lớp dùng chung trong `src/index.css` thay vì viết màu cứng.
- Màu huy chương: token `gold-*`, `silver-*`, `bronze-*` (nền `-bg`, viền, chữ `-ink`) trong `@theme`. Dùng `medalOf()` (`src/lib/medal.ts`) + component `MedalBadge`. Ánh xạ: hạng 1 / Quán quân / Giải Nhất → vàng; hạng 2 / Á quân / Giải Nhì → bạc; hạng 3 / Quý quân / Giải Ba → đồng.

## Cách làm việc
- Thay đổi lớn: trình bày kế hoạch (file nào, sửa gì) trước khi sửa.
- Sau khi sửa: chạy `npm run build` và `npm run typecheck`, sửa hết lỗi rồi mới báo xong; nói rõ đã kiểm tra những gì.
- Không tự thêm thư viện mới nếu chưa hỏi. Thư viện đã được duyệt thêm: `react-markdown` (Human of OSS).
