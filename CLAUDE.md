# Olympia Sóc Sơn – website (ghi chú cho Claude Code)

Website lưu trữ lịch sử, kết quả và con người của **Olympia Sóc Sơn (OSS)**: sân chơi trí tuệ mô phỏng Đường lên đỉnh Olympia (ĐLĐO) cho học sinh THPT Sóc Sơn, Hà Nội, thành lập tháng 7/2017. Chủ dự án: Kit. Trả lời bằng tiếng Việt.

## Lệnh
- `npm run dev`: chạy thử (http://localhost:5173)
- `npm run build`: đóng gói. **Luôn chạy và phải pass trước khi báo xong.**
- `npm run typecheck`: kiểm tra TypeScript. Chạy kèm build.

## Công nghệ
React 19, TypeScript, Vite 8, Tailwind CSS 4 (cấu hình trong `src/index.css`, không có tailwind.config), React Router 8 dùng `HashRouter` (URL dạng `/#/...`), `vite.config.ts` có `base: "./"`. Deploy GitHub Pages qua `.github/workflows/deploy.yml`. Icon: `react-icons`.

## Cấu trúc web (đã duyệt)
Menu chính: **Về chúng tôi · OSSPEDIA · Bảng vàng · Human of OSS · Thư viện**
- Về chúng tôi (`/ve-chung-toi`): Giới thiệu, Cơ cấu tổ chức, Thể lệ, Liên hệ
- OSSPEDIA (`/wiki`): mùa giải (`/wiki/cuoc-thi/mua-N`), thí sinh (`/wiki/thi-sinh/:id`), trường (`/wiki/truong/:id`), tìm kiếm
- Bảng vàng (`/bang-vang`): quán quân các mùa, OSS tại ĐLĐO, kỷ lục
- Human of OSS, Thư viện

## Dữ liệu (quy tắc bắt buộc)
- Toàn bộ dữ liệu ở `src/data/*.json`; **mọi trang chỉ lấy dữ liệu qua `src/lib/data.ts`**.
- **Không gõ tay số liệu tính được** (quán quân, số thí sinh ĐLĐO, vòng nguyệt quế, kỷ lục, thống kê trường…). Tính từ `matches.json`, `qualifying.json`, `olympia.json`. Chỉ các mục `"manual": true` trong `stats.json` là nhập tay.
- **Ô trống (`null`) ≠ 0**: `null` = không có dữ liệu / không thi; `0` = có thi, được 0 điểm. Không đổi `null` thành 0 khi hiển thị hay tính toán.
- Tổng điểm không âm: nếu 4 phần thi cộng ra số âm thì `total` = 0 (giữ nguyên điểm từng phần).
- Hòa điểm: `tiebreakWinner` của trận là người thắng câu hỏi phụ; `rank` trong trận đã tính sẵn.
- Thuật ngữ: Vô địch = Quán quân; Á quân = hạng 2 CK; **Quý quân = giải Ba Chung kết** (thường là đồng giải Ba); Top 12 = qua vòng loại.
- Mã thí sinh (`people.json` → `id`) là cố định, dùng làm đường dẫn. Người trùng tên có hậu tố, ví dụ `nguyen-thi-ngoc-anh-xuan16`.
- Ngày lưu `YYYY-MM-DD`, hiển thị `dd/mm/yyyy`.

## Quyền riêng tư (đa số thí sinh dưới 18 tuổi)
Chỉ hiển thị họ tên, lớp, trường, kết quả thi. Không thêm số điện thoại, Facebook cá nhân, học lực hay lý do riêng của thí sinh. Ảnh cá nhân chỉ dùng khi có đồng ý.

## Thiết kế
Hiện đại, chất "học thuật", nền sáng tím nhạt kiểu màu nước, chữ tối (`ink`), màu chủ đạo tím `oss` (#6d28d9), điểm nhấn xanh/hồng lấy từ logo khối lập phương. Các mảng tối dùng lớp `paper-dark`. Font Be Vietnam Pro. Hiệu ứng chuyển động tiết chế, tôn trọng `prefers-reduced-motion`. Không nhồi chi tiết thừa. Giữ các token màu và lớp dùng chung trong `src/index.css` thay vì viết màu cứng.

## Cách làm việc
- Thay đổi lớn: trình bày kế hoạch (file nào, sửa gì) trước khi sửa.
- Sau khi sửa: chạy `npm run build` và `npm run typecheck`, sửa hết lỗi rồi mới báo xong; nói rõ đã kiểm tra những gì.
- Không tự thêm thư viện mới nếu chưa hỏi.
