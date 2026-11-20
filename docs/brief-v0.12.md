# Yêu cầu v0.12 (Kit đã duyệt)

Đọc `CLAUDE.md` trước. **Trình bày kế hoạch trước khi sửa.** Làm **3 đợt**, xong mỗi đợt chạy `npm run build`, `npm run typecheck` rồi `git commit`:
- **Đợt 1:** mục 0–3, commit "v0.12 đợt 1".
- **Đợt 2:** mục 4, commit "v0.12 đợt 2".
- **Đợt 3:** mục 5–6, commit "v0.12 đợt 3".

Không thêm thư viện npm. Không sửa dữ liệu thi đấu. Ảnh mẫu (`OSS-ANH-MAU`) vẫn coi là chưa có ảnh. Mọi chuyển động tôn trọng `prefers-reduced-motion`.

---

## 0. Sửa lỗi mất dấu ở chữ in hoa

- Ở Hall of Fame, "TRẦN" hiện thành "TRÂN", "NGUYỄN" thành "NGUYÊN": các chữ hoa có **2 dấu chồng phía trên** (Ầ, Ễ…) bị cắt mất phần trên. Nguyên nhân khả năng cao: dòng tên có `overflow: hidden` (từ `-webkit-line-clamp` / `line-clamp`) kết hợp `line-height` thấp.
- Sửa: dòng tên **không dùng `overflow: hidden` / line-clamp** (giữ `text-wrap: balance`, chiều cao tối thiểu 2 dòng như hiện tại); `line-height` **≥ 1.35** cho mọi dòng chữ in hoa; thêm `padding-top: 0.12em`.
- **Rà toàn site** mọi chỗ có `uppercase` hoặc `overflow: hidden` / line-clamp trên chữ có thể chứa tiếng Việt (header, menu, nhãn, thẻ, tiêu đề dùng `--font-display`), sửa tương tự nếu có nguy cơ cắt dấu.
- Kiểm tra bằng chuỗi "TRẦN NGUYỄN ẪỄỖẦỀỒ" ở đúng các kiểu chữ đó: mọi dấu phải hiện đủ.

## 1. Bảng vàng: tiêu đề Hall of Fame

- Bỏ `h2` "Quán quân các mùa" và dòng nhỏ "Hall of Fame" phía trên.
- Thay bằng **một `h2` "Hall of Fame"**: in hoa (`text-transform: uppercase`), màu vàng `#E9C46A`, `--font-display`, giãn chữ ~0.08em, **căn giữa**, hai bên có 2 nét gạch mảnh màu vàng 40% (dài ~48px). Bỏ icon cúp ở tiêu đề này.

## 2. Ảnh cột mốc (trang Về chúng tôi)

- Ảnh cột mốc: `cot-moc/{YYYY-MM-DD}.jpg` (như cũ). **Chỉ cột mốc có ảnh thật** mới có các tương tác dưới đây; cột mốc chưa có ảnh không còn hộp xem trước.
- Cột mốc có ảnh: thêm nút nhỏ biểu tượng máy ảnh (`PiCamera`, `aria-label="Xem ảnh cột mốc {dd/mm/yyyy}"`) cạnh ngày.
- **Xem trước khi rê chuột** (chỉ thiết bị có chuột): hộp ảnh rộng **min(560px, 42vw)**, tỉ lệ 4:3, bo góc lớn, bóng đổ; hiện ở **phía còn trống của dòng thời gian** (phía cột ngày), không đè lên chữ của cột mốc; mờ dần 150ms.
- **Bấm** nút máy ảnh, bấm vào hộp xem trước, hoặc bấm vào vùng trống của dòng cột mốc (trừ link tên) → mở **hộp xem ảnh lớn** (mục 2a) gồm toàn bộ ảnh cột mốc theo thứ tự thời gian, bắt đầu từ cột mốc vừa bấm. Chú thích dưới ảnh: "{dd/mm/yyyy} · {nội dung cột mốc, chữ thường}".

### 2a. Hộp xem ảnh dùng chung (`Lightbox`)
Tổng quát hoá hộp phóng to ảnh trận đấu đã có thành component dùng chung (cột mốc, thư viện, ảnh trận đấu):
- Nhận danh sách ảnh `{ src, alt, caption? }` và vị trí bắt đầu. Ảnh hiện tối đa 92vw × 82vh, `object-fit: contain`, nền tối.
- Nút ‹ › hai bên và phím ← → để chuyển ảnh; vuốt trái/phải trên điện thoại; bộ đếm "3 / 12"; tải trước ảnh liền trước và liền sau.
- Esc / nút đóng / bấm nền để đóng; giữ focus trong hộp; trả focus về chỗ đã mở.
- Danh sách 1 ảnh thì ẩn nút chuyển và bộ đếm.

## 3. Trang chủ OSSPEDIA (`/wiki`)

- Giữ đầu trang và **thanh tìm kiếm** (mở hộp tìm kiếm chung).
- **Bỏ** 3 cột danh sách hiện tại (danh sách mùa, khối Thí sinh, danh sách trường).
- Thay bằng **3 ô lớn** (máy tính 3 cột bằng nhau, điện thoại 1 cột), cả ô là link, rê chuột / focus: nhấc nhẹ 2px, viền chuyển `oss`:

| Ô | Icon (40px, trong vòng tròn tím nhạt) | Mô tả | Số liệu (tự tính) | Phần xem trước (trang trí, `aria-hidden`) | Link |
| --- | --- | --- | --- | --- | --- |
| Mùa giải | `PiCalendarBlank` | Kết quả từng vòng, bảng điểm và diễn biến các trận Chung kết. | "10 mùa · 2017–2026" | hàng chip nhỏ "1 2 … 10" | `/wiki/cuoc-thi` |
| Thí sinh | `PiUsersThree` | Hồ sơ, điểm số và danh hiệu của các thí sinh từng vào top 12. | "91 thí sinh" | 5 ảnh tròn xếp chồng (Quán quân 5 mùa gần nhất, ảnh mùa mới nhất) + "+86" | `/wiki/thi-sinh` |
| Trường | `PiGraduationCap` | Thành tích của các trường có thí sinh vào top 12. | "5 trường" | 5 `SchoolBadge` 32px xếp chồng | `/wiki/truong` |

- Các ô cao bằng nhau; tên ô là `h2`.

## 4. Trang danh sách thí sinh (`/wiki/thi-sinh`)

### 4a. Thanh công cụ
- Ô tìm theo tên (giữ cách tìm không dấu hiện có).
- 3 bộ lọc (`<select>` có nhãn): **Trường** (Tất cả + 5 trường), **Mùa** (Tất cả + Mùa 1…10), **Giải**: Tất cả / Quán quân / Á quân / Quý quân / Top 12 (không vào Chung kết).
- **Sắp xếp**: Tên A–Z (**mặc định**) / Thành tích / Mùa.
- Nút chuyển **Thẻ / Bảng** (`aria-pressed`), **mặc định Thẻ**, nhớ bằng `localStorage` (bọc `try/catch`).
- Dòng "Hiển thị {x} / 91 thí sinh" (`aria-live="polite"`) và nút "Xoá bộ lọc" (chỉ hiện khi có bộ lọc / ô tìm đang dùng).
- Điện thoại: các bộ lọc và sắp xếp gom vào nút "Bộ lọc" (kèm số bộ lọc đang bật), bấm mở bảng chọn ngay bên dưới; ô tìm và nút Thẻ / Bảng luôn hiện.

### 4b. Quy tắc lọc
- **Trường**: trường của thí sinh.
- **Mùa n**: thí sinh có trong top 12 mùa n.
- **Giải**, khi **có chọn Mùa n**: tính trong mùa n (Quán quân / Á quân / Quý quân = danh hiệu ở Chung kết mùa n; Top 12 = vào top 12 mùa n nhưng không dự Chung kết mùa n).
- **Giải**, khi **không chọn Mùa**: Quán quân / Á quân / Quý quân = từng có danh hiệu đó ở bất kỳ mùa nào; Top 12 = **chưa từng** dự Chung kết.
- Các bộ lọc và ô tìm kết hợp với nhau (AND).

### 4c. Quy tắc sắp xếp
- **Tên A–Z** (kiểu Việt Nam): so sánh **tên** (từ cuối), rồi tên đệm và họ (đọc ngược từ cuối lên đầu), dùng `Intl.Collator('vi')`; trùng hoàn toàn thì theo mùa đầu tiên.
- **Thành tích**: số lần Quán quân (nhiều trước) → số lần Á quân → số lần Quý quân → kết quả Bán kết tốt nhất (`rank` nhỏ nhất) → hạng vòng loại tốt nhất → Tên A–Z. Khi có chọn Mùa n thì chỉ tính các kết quả **trong mùa n**.
- **Mùa**: mùa đầu tiên tăng dần, cùng mùa thì theo hạng vòng loại mùa đó. Khi có chọn Mùa n thì theo hạng vòng loại mùa n.

### 4d. Ghi bộ lọc lên địa chỉ trang
- Lưu trạng thái vào query của địa chỉ (dùng `useSearchParams`, `replace: true`): `q`, `truong` (id trường), `mua` (số), `giai` (`quan-quan` | `a-quan` | `quy-quan` | `top-12`), `sap-xep` (`ten` | `thanh-tich` | `mua`). Giá trị mặc định thì không ghi. Ví dụ `#/wiki/thi-sinh?mua=4&giai=a-quan`.
- Mở link có query → áp dụng đúng bộ lọc. Vào hồ sơ rồi bấm Back → quay lại đúng danh sách đã lọc.
- Link từ trang trường (nếu có "Xem tất cả thí sinh") có thể dùng `?truong=...`.

### 4e. Hai cách xem
- **Thẻ** (mặc định): lưới 4 cột (máy tính), 3 (máy tính bảng), 2 (điện thoại). Mỗi thẻ: `PersonPhoto` 3:4 (`season` = mùa đang lọc nếu có, không thì mùa mới nhất), tên đậm, tên trường (chữ nhỏ), "Mùa 8, 9", và **danh hiệu cao nhất** dạng `ResultBadge` (vd "Quán quân") nếu có, không có thì chữ nhỏ "Top 12". Cả thẻ là link tới hồ sơ.
- **Bảng**: giữ bảng hiện tại (Thí sinh, Trường, Mùa tham dự, Danh hiệu OSS), thêm ảnh tròn 28px cạnh tên.
- Không có kết quả: "Không có thí sinh nào khớp bộ lọc." kèm nút "Xoá bộ lọc".

## 5. Thư viện

### 5a. Ảnh
- Ảnh thư viện: **`public/images/thu-vien/mua-{n}/`**, **tên file tuỳ ý**, đuôi `.jpg`, `.jpeg`, `.png`, `.webp` (riêng thư mục này chấp nhận cả `.jpeg`). Đưa vào danh sách ảnh tự sinh (vẫn loại ảnh mẫu).
- Thứ tự trong 1 mùa: các **ảnh trận đấu** của mùa đó có thật (`tran-dau/oss{n}-bk1…bk3`, rồi `oss{n}-ck`) đứng đầu, sau đó ảnh trong `thu-vien/mua-{n}/` sắp theo tên file kiểu tự nhiên (`localeCompare` với `numeric: true`, để `2.jpg` đứng trước `10.jpg`).
- Script danh sách ảnh **in cảnh báo** (không dừng build) cho mọi ảnh trong `public/images/` **lớn hơn 500KB**, kèm dung lượng, để Kit nén lại.

### 5b. Trang `/thu-vien` (tổng quan)
- `PageHeader` như hiện tại. Bỏ khối "đang được xây dựng".
- Lưới ô mùa, **Mùa 1 → 10**, 3 cột (máy tính), 2 (máy tính bảng), 1 (điện thoại). Mỗi ô: ảnh bìa 3:2 (ảnh đầu tiên của mùa đó theo thứ tự 5a; chưa có ảnh nào thì nền tông màu với số mùa to, như thẻ mùa ở trang tổng hợp), nhãn "Mùa {n}", dòng nhỏ "{năm học} · {x} ảnh".
- Mùa có ảnh: cả ô là link tới `/thu-vien/mua-{n}`. Mùa chưa có ảnh: ô mờ (độ đậm ~55%), ghi "Chưa có ảnh", không phải link.
- Cuối trang: dòng "Xem thêm ảnh và video trên fanpage Olympia Sóc Sơn" kèm nút mở fanpage.

### 5c. Trang `/thu-vien/mua-{n}`
- `PageHeader`: dòng chỉ đường "Thư viện / Mùa {n}", `h1` "Thư viện ảnh mùa {n}", mô tả "{năm học} · {x} ảnh"; bên phải: nút "Trang mùa {n}" (tới OSSPEDIA) và nút "‹ Mùa n−1" / "Mùa n+1 ›" (chỉ những mùa **có ảnh**).
- Lưới ảnh 4 cột (máy tính), 3 (máy tính bảng), 2 (điện thoại), ô vuông bo góc, `object-fit: cover`, `loading="lazy"`, `decoding="async"`. Bấm ảnh → `Lightbox` với toàn bộ ảnh của mùa.
- `alt`: ảnh trận đấu "Các thí sinh trận Bán kết {k} mùa {n}" / "… trận Chung kết mùa {n}"; ảnh thư viện "Ảnh Olympia Sóc Sơn mùa {n} ({số thứ tự})".
- Mùa không tồn tại → trang 404. Mùa chưa có ảnh → thông báo "Mùa này chưa có ảnh" và nút mở fanpage.

### 5d. Liên kết từ OSSPEDIA
- **Trang mùa**: nút "Thư viện ảnh" (`PiImages`) cạnh nút chuyển mùa, **chỉ hiện khi mùa đó có ảnh**.
- **Trang tổng hợp các mùa, chế độ Thẻ**: chân thẻ thêm link "Thư viện ảnh ({x})" khi có ảnh. Thẻ dùng kiểu "link phủ cả thẻ" (link chính dùng lớp phủ `::after` toàn thẻ, link thư viện đặt `position: relative; z-index` cao hơn) để **không lồng link trong link**.

## 6. Script và tài liệu

- `npm run anh-con-thieu`: thêm phần thông tin **"Thư viện"** liệt kê số ảnh từng mùa (không tính là thiếu).
- `CLAUDE.md`: `Lightbox` dùng chung; quy tắc lọc / sắp xếp danh sách thí sinh và tham số địa chỉ; thư mục thư viện và thứ tự ảnh; cảnh báo ảnh > 500KB; quy tắc chữ in hoa (line-height ≥ 1.35, không cắt `overflow`).
- `README.md`: cách thêm ảnh thư viện (thư mục theo mùa, đặt tên tuỳ ý, nên rộng ~1600px và < 400KB, chạy lại `npm run dev`), cách tạo link danh sách thí sinh đã lọc.

---

## Kiểm tra trước khi báo xong

- Build, typecheck pass; không lỗi 404 ảnh.
- Hall of Fame: "TRẦN HẢI LINH", "NGUYỄN THÙY DƯƠNG", "NGUYỄN VIỆT THÀNH" hiện đủ dấu; tiêu đề "HALL OF FAME" vàng, căn giữa.
- Về chúng tôi: cột mốc chưa có ảnh không có hộp xem trước; thả tạm ảnh thật vào `cot-moc/2017-07-26.jpg` (chạy lại `npm run dev`) → có nút máy ảnh, rê chuột hiện ảnh ~560px không đè chữ, bấm mở hộp xem ảnh lớn, ← → chạy.
- OSSPEDIA: thanh tìm kiếm + 3 ô lớn đúng số liệu, bấm đúng trang.
- Danh sách thí sinh: mặc định Thẻ, Tên A–Z (An, Anh, Ánh… đứng đầu); lọc **Quán quân** → 8; **Á quân** → 10; **Quý quân** → 18; **Top 12** (không chọn mùa) → 58; **Mùa 4 + Á quân** → chỉ Trần Kim Cương; **Mùa 9 + Top 12** → 8; mở `#/wiki/thi-sinh?mua=4&giai=a-quan` ra đúng kết quả; vào hồ sơ rồi Back giữ bộ lọc; chuyển Bảng rồi tải lại trang vẫn là Bảng.
- Thư viện: 10 ô mùa; thả tạm 2 ảnh vào `thu-vien/mua-10/` → ô Mùa 10 có ảnh bìa và "2 ảnh", trang mùa 10 có lưới ảnh và hộp xem ảnh; trang mùa 10 ở OSSPEDIA có nút "Thư viện ảnh"; thẻ Mùa 10 ở trang tổng hợp có link "Thư viện ảnh (2)" bấm được riêng.
- Thử ở 1280px và 390px.

Báo lại: file đã sửa/thêm/xóa, kết quả build/typecheck, chỗ nào phải làm khác brief và lý do.
