# Yêu cầu v0.16.1 (Kit đã duyệt): tinh chỉnh sau v0.16

Đọc `CLAUDE.md` trước. **Trình bày kế hoạch trước khi sửa.** Làm 2 đợt, xong mỗi đợt chạy `npm run build`, `npm run typecheck` rồi `git commit`:
- **Đợt 1:** mục 1, 2, 3, 4, 5, commit "v0.16.1 đợt 1".
- **Đợt 2:** mục 6, 7, commit "v0.16.1 đợt 2".

Không thêm thư viện npm. Không sửa dữ liệu thi đấu. Mọi chuyển động tôn trọng `prefers-reduced-motion`.

---

## 1. Bảng trận giao hữu có cột Kết quả

- Bảng của `format: "xep-hang"` (Truyền lửa, Gặp nhau đầu năm 2023–2026) thêm **cột cuối "Kết quả"**: `ResultBadge` theo `result` (Giải Nhất / Giải Nhì / Giải Ba), giống cột Kết quả của bảng Bán kết OSS. Giữ màu dòng như hiện tại.
- Bỏ chữ `sr-only` kết quả trong ô tên (đã có cột riêng).
- Điện thoại: bảng cuộn ngang như các bảng khác.

## 2. Hồ sơ: nút chọn ảnh theo thời gian

- Xếp **tất cả** nút chọn ảnh (mùa OSS, O, sự kiện) theo thời gian tăng dần, theo ngày của từng mục:

| Nút | Ngày dùng để xếp |
| --- | --- |
| Mùa {n} | `startDate` của mùa đó trong `seasons.json` |
| O{năm} | `date` của trận Olympia **sớm nhất** của người đó trong năm thứ đó |
| Sự kiện | `date` của sự kiện |

- Ví dụ Lê Trà My: Mùa 6 · GNDN '23 · Truyền lửa · Mùa 7 · O24 · AllStars. Nghiêm Trung Đức: Mùa 8 · DOC3 · GNDN '25 · Mùa 9 · O26.
- **Ảnh mặc định khi mở hồ sơ giữ nguyên quy tắc hiện tại** (chỉ đổi thứ tự nút).

## 3. Hồ sơ: thêm dòng "Năm sinh"

- Khung thông tin bên phải, dòng **"Năm sinh"** (icon `PiCake`) đặt **ngay trước** dòng "Trường".
- Tính từ dữ liệu, không thêm trường vào `people.json`: lấy một lần thi OSS bất kỳ của người đó (vòng loại), **năm sinh = năm đầu của `schoolYear` mùa đó − khối − 5**, với khối là 2 chữ số đầu của lớp (10, 11, 12).
  - Ví dụ: Lê Trà My thi mùa 6 (2022-2023) lớp 10A1 → 2022 − 10 − 5 = **2007**. Chu Đức Huy → 2002. Lứa lớn nhất 2000 (lớp 12 mùa 1), nhỏ nhất 2011 (lớp 10 mùa 10).
- Đã kiểm: cả 91 thí sinh cho cùng một năm sinh ở mọi mùa đã thi, không ai lệch. Vẫn viết kiểm tra trong `predev` / `prebuild`: nếu một người ra 2 năm sinh khác nhau thì in cảnh báo tên người đó (không chặn build).
- Không có dữ liệu OSS (không xảy ra với người có hồ sơ) → ẩn dòng.

## 4. Bỏ sự kiện khỏi "Những cột mốc đáng nhớ"

- Trang Về chúng tôi: **bỏ** các dòng sự kiện và mục chú thích "Sự kiện khác" thêm ở v0.16. Dòng thời gian chỉ còn 2 kiểu như trước.
- **Giữ** các dòng sự kiện trong dòng thời gian của **hồ sơ thí sinh**.

## 5. DOC3, DOC4 hiện tên đầy đủ

- Xoá `shortName` của `doc3` và `doc4` trong `events.json` (giữ `aka` "DOC3", "DOC4" cho dòng Tên khác và tìm kiếm).
- Mọi chỗ hiển thị dùng tên đầy đủ **"DAPHUC Olympia Championship 3"**, **"DAPHUC Olympia Championship 4"**: ô thư viện, dòng chỉ đường, bảng "Sự kiện khác" trong hồ sơ, tên tab, kết quả tìm kiếm, nút sự kiện trước / sau. Nút chọn ảnh trong hồ sơ vẫn dùng `photoLabel` ("DOC3", "DOC4").
- Nếu không còn sự kiện nào dùng `shortName` thì bỏ hẳn trường này khỏi kiểu dữ liệu và code.

---

## 6. Trang danh sách sự kiện: 5 thẻ một hàng (đợt 2)

- `/wiki/su-kien`: lưới **5 cột** từ 1280px (4 cột từ 1024px, 3 cột từ 768px, 2 cột dưới đó), cùng nhịp với lưới ô ở `/thu-vien`.
- Thẻ gọn lại theo: ảnh 3:2; chip loại, tên (`h2`, cỡ chữ nhỏ hơn hiện tại, cho xuống dòng, không cắt), nhãn thời gian, phạm vi (cỡ chữ phụ), link "Thư viện ảnh ({x})". Khoảng đệm trong thẻ giảm tương ứng.
- Kiểm tra ở 390px: 2 cột, chữ không tràn, thẻ cao bằng nhau trong một hàng.

## 7. Trang chủ: một khối nền tối làm điểm nhấn (đợt 2)

- **Chỉ khối "Cảm nhận về Olympia Sóc Sơn"** chuyển sang nền tối, **dùng đúng màu nền, màu chữ và kiểu của khối giới thiệu tối ở trang Về chúng tôi** (tái dùng token / class, không tạo màu mới). Khối chạy tràn chiều ngang như khối đó.
- Trong khối tối: tiêu đề và chữ sáng; thẻ nhận xét giữ nền sáng như hiện tại (nổi trên nền tối); chấm chuyển, nút tạm dừng và vòng focus đủ tương phản trên nền tối.
- Các khối khác giữ nền sáng. Footer vẫn tối; giữa khối Cảm nhận và footer còn khối Đối tác và bản đồ nền sáng nên không bị dính nhau.
- Có thể làm bằng một prop / biến thể `tone="dark"` cho khung section dùng chung, để sau này đổi khối khác sang tối dễ dàng.

---

## Kiểm tra trước khi báo xong

- Build, typecheck pass.
- Truyền lửa và GNDN 2024: bảng có cột Kết quả, đúng giải từng người.
- Hồ sơ Lê Trà My: nút theo thứ tự Mùa 6 · GNDN '23 · Truyền lửa · Mùa 7 · O24 · AllStars; ảnh mặc định như trước; có dòng "Năm sinh: 2007" trước "Trường".
- Hồ sơ Phạm Ngô Bảo Minh: Năm sinh 2010. Hồ sơ Chu Đức Huy: 2002.
- Về chúng tôi: không còn dòng sự kiện, chú thích chỉ 2 mục. Hồ sơ Lê Trà My vẫn có dòng sự kiện trong dòng thời gian.
- `/thu-vien`, `/wiki/su-kien`, hồ sơ Nghiêm Trung Đức, tìm "doc3": đều ghi "DAPHUC Olympia Championship 3".
- `/wiki/su-kien` ở 1440px: 2 hàng × 5 thẻ; 390px: 2 cột.
- Trang chủ: khối Cảm nhận nền tối, khớp khối tối ở Về chúng tôi; dùng bàn phím thấy rõ vòng focus.

Báo lại: file đã sửa/thêm/xóa, kết quả build/typecheck, chỗ nào phải làm khác brief và lý do.
