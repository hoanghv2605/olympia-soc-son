# Yêu cầu v0.15 (Kit đã duyệt): sửa nhỏ sau v0.14 + chuẩn bị ra mắt

Đọc `CLAUDE.md` trước. **Trình bày kế hoạch trước khi sửa.** Làm 3 đợt, xong mỗi đợt chạy `npm run build`, `npm run typecheck` rồi `git commit`:
- **Đợt 1:** mục 1, 2, 3, 4, commit "v0.15 đợt 1".
- **Đợt 2:** mục 5, 6, 7, 10, commit "v0.15 đợt 2".
- **Đợt 3:** mục 8, 9, commit "v0.15 đợt 3"; riêng việc thu nhỏ ảnh thật commit tách riêng "Thu nhỏ ảnh" (xem 8c).

Không thêm thư viện npm. Không sửa dữ liệu thi đấu. Mọi chuyển động tôn trọng `prefers-reduced-motion`.

Kit đã giải nén sẵn vào dự án: `public/og-image.jpg` (1200×630) và 4 bài Human of OSS trong `src/content/human-of-oss/` (`ha-viet-hoang.md`, `dinh-nguyen-thuong.md`, `tran-hai-linh.md`, `tran-duc-hoang-long.md`).

---

## 1. Số liệu không bị ngắt giữa chừng

- Ở 4 ô OSSPEDIA và các dòng số liệu ở khối Lối vào trang chủ: tách chuỗi theo " · " thành từng phần, mỗi phần `white-space: nowrap`. Chỉ được xuống dòng **giữa** các phần, không bao giờ trong một phần (không còn "2023–" một dòng, "2026" một dòng).

## 2. Năm học dùng gạch dài ở mọi nơi

- Hàm dùng chung định dạng năm học: `"2017-2018"` → `"2017–2018"` (gạch dài U+2013). Dữ liệu JSON **giữ nguyên**.
- Áp dụng cho **mọi chỗ** hiển thị `schoolYear`: ô mùa ở `/thu-vien`, trang thư viện mùa, trang mùa (infobox), trang tổng hợp các mùa (thẻ và bảng), hồ sơ, tìm kiếm, infobox DOC3, sự kiện. Tìm hết các chỗ đang in thẳng `schoolYear`.

## 3. Hồ sơ thí sinh: đổi thứ tự

Thứ tự các phần ở cột trái: **Olympia Sóc Sơn → Đường lên đỉnh Olympia → Sự kiện khác → Dòng thời gian** (bảng nào không có thì bỏ qua, các phần còn lại giữ thứ tự).

## 4. Câu chữ nhắc tới sự kiện

| Chỗ | Nội dung mới |
| --- | --- |
| Mô tả trang `/wiki` | Bách khoa thư về Olympia Sóc Sơn: các mùa giải, thí sinh, trường, sự kiện và thành tích tại Đường lên đỉnh Olympia. |
| Thanh tìm kiếm ở `/wiki` | "Tìm trong OSSPEDIA: thí sinh, mùa giải, trường, sự kiện"; dưới 640px rút gọn thành "Tìm trong OSSPEDIA" |
| Ô nhập trong hộp tìm kiếm | "Tìm thí sinh, mùa giải, trường, sự kiện" |
| Trang chủ, khối Lối vào, ô OSSPEDIA | mô tả "Các mùa giải, hồ sơ thí sinh, các trường và sự kiện khác."; số liệu "10 mùa · 91 thí sinh · 5 trường · 8 sự kiện" (tự tính); thêm link **"Sự kiện khác"** (`/wiki/su-kien`) sau "Các trường"; nút tìm ghi "Tìm thí sinh, mùa giải, trường, sự kiện" |
| Mô tả trang `/thu-vien` | Ảnh và tư liệu qua các mùa Olympia Sóc Sơn và các sự kiện khác. |

---

## 5. Ẩn nội dung còn là bản mẫu

### 5a. Quy tắc `draft`
- Thêm `"draft": true` vào **cả 6 mục** trong `testimonials.json` và **cả 25 mục** trong `partners.json` (đều đang là nội dung mẫu). Cập nhật kiểu dữ liệu.
- **Bản build (GitHub Pages):** mục có `draft: true` **không hiện**.
- **Khi chạy `npm run dev`** (`import.meta.env.DEV`): mục nháp **vẫn hiện**, có viền nét đứt và nhãn nhỏ "Nháp", để Kit xem trước bố cục trên máy.

### 5b. Khối "Cảm nhận về Olympia Sóc Sơn" (trang chủ)
- Chỉ dùng các mục không phải nháp. Không còn mục nào → **ẩn cả khối** (kể cả tiêu đề).
- Còn đúng 1 mục → không hiện chấm chuyển, nút tạm dừng và không tự chuyển.

### 5c. Khối "Đối tác đồng hành" (trang chủ)
- Mỗi hạng (Vàng / Bạc / Đồng hành) chỉ dùng mục không phải nháp; hạng không còn mục nào thì ẩn hạng đó; cả 3 hạng đều trống → **ẩn cả khối**.
- Hạng có ít logo, không đủ lấp đầy chiều ngang: hiện **tĩnh, căn giữa**, không nhân đôi danh sách, không chạy ngang.

### 5d. Trưởng ban
- Trong `departments.json`, ban nào `leader` đang là `"Nguyễn Văn A"` thì đổi thành `null`. Tên khác giữ nguyên.
- `leader` là `null` hoặc rỗng → **ẩn dòng "Trưởng ban"** (máy tính và điện thoại).

## 6. Tên tab theo từng trang

Hook dùng chung (vd `usePageTitle`) đặt `document.title`, không thêm thư viện:

| Trang | Tên tab |
| --- | --- |
| `/` | Olympia Sóc Sơn |
| `/wiki` | OSSPEDIA · Olympia Sóc Sơn |
| Trang danh sách trong OSSPEDIA | Mùa giải · OSSPEDIA; Thí sinh · OSSPEDIA; Các trường · OSSPEDIA; Sự kiện khác · OSSPEDIA |
| Trang mùa | Mùa {n} · OSSPEDIA |
| Hồ sơ thí sinh | {họ tên} · OSSPEDIA |
| Trang trường | {tên trường} · OSSPEDIA |
| Trang sự kiện | {shortName ?? name} · OSSPEDIA |
| Bài Human of OSS | {tên} · Human of OSS |
| Thư viện mùa / sự kiện | Thư viện ảnh mùa {n} · Olympia Sóc Sơn; Thư viện ảnh {shortName ?? name} · Olympia Sóc Sơn |
| Các trang còn lại | {tiêu đề h1} · Olympia Sóc Sơn |
| 404 | Không tìm thấy trang · Olympia Sóc Sơn |

## 7. Ảnh và mô tả khi chia sẻ link (`index.html`)

- Giữ `<html lang="vi">`. Thêm vào `<head>`:
  - `<meta name="description" content="Olympia Sóc Sơn: sân chơi kiến thức của học sinh Sóc Sơn từ năm 2017. Các mùa thi, hồ sơ thí sinh, kỷ lục và câu chuyện của OSS.">`
  - Open Graph: `og:type` = `website`, `og:locale` = `vi_VN`, `og:site_name` = `Olympia Sóc Sơn`, `og:title` = `Olympia Sóc Sơn`, `og:description` (cùng nội dung description), `og:url` = `https://hoanghv2605.github.io/olympia-soc-son/`, `og:image` = `https://hoanghv2605.github.io/olympia-soc-son/og-image.jpg` (**đường dẫn tuyệt đối**), `og:image:width` 1200, `og:image:height` 630, `og:image:alt` = "Logo và tên Olympia Sóc Sơn".
  - `twitter:card` = `summary_large_image`.
  - `theme-color` = `#6d28d9`.
- Nếu chưa có favicon: dùng `logo-oss.png` (`<link rel="icon">` và `<link rel="apple-touch-icon">`).
- Vì web dùng địa chỉ có `#`, mọi trang chia sẻ cùng **một** ảnh và mô tả này. Ghi rõ điều đó trong README.

---

## 10. Human of OSS tập 2–5 (đợt 2)

- 4 bài đã có sẵn (xem đầu brief), **giữ nguyên nội dung**, cùng định dạng tập 1.
- Thêm vào `humans.json`, sau tập 1:

```json
{ "slug": "ha-viet-hoang", "stt": 2, "name": "Hà Việt Hoàng", "title": "Đồng sáng lập Olympia Sóc Sơn", "headline": "Người thắp lửa cho trí tuệ Sóc Sơn", "quote": "Cách ghi nhớ tốt nhất chính là nắm rõ kiến thức đó.", "date": null, "person": "ha-viet-hoang" },
{ "slug": "dinh-nguyen-thuong", "stt": 3, "name": "Đinh Nguyên Thương", "title": "MC Olympia Sóc Sơn mùa 2–4", "headline": "MC quốc dân của Olympia Sóc Sơn", "quote": "Bí kíp của chị chỉ có hai chữ “yêu thương” thôi!", "date": null, "person": null },
{ "slug": "tran-hai-linh", "stt": 4, "name": "Trần Hải Linh", "title": "Quán quân OSS3", "headline": "Cơn gió lạ của Olympia Sóc Sơn", "quote": "Muốn trở thành người giỏi nhất, bạn phải cố gắng để đánh bại người giỏi nhất.", "date": null, "person": "tran-hai-linh" },
{ "slug": "tran-duc-hoang-long", "stt": 5, "name": "Trần Đức Hoàng Long", "title": "Đồng sáng lập Olympia Sóc Sơn", "headline": "Mạch DNA còn lại của Olympia Sóc Sơn", "quote": "OSS là đại diện cho tuổi trẻ nhiệt huyết của mình.", "date": null, "person": null }
```

- **`date` có thể `null`** (Kit bổ sung sau): thẻ và đầu bài chỉ ghi "Tập {stt}", không có dấu " · " thừa. Cập nhật kiểu dữ liệu.
- **Link "Xem hồ sơ OSSPEDIA"** chỉ hiện khi người đó **có hồ sơ OSSPEDIA**. `ha-viet-hoang` có trong `people.json` nhưng không có hồ sơ, nên bài tập 2 không có link (không được dẫn tới trang 404).
- **Ảnh**: `human-of-oss/{stt 2 chữ số}.jpg` → nếu chưa có (hoặc là ảnh mẫu) và có `person`: ảnh mặc định của người đó theo `personPhoto`, **kể cả ảnh Olympia** với người chỉ thi Olympia (Hà Việt Hoàng → `o17-ha-viet-hoang-ss.jpg`) → ảnh giữ chỗ.
- Trang danh sách: 5 thẻ thật (so le trái / phải như tập 1), rồi 5 ô chờ "Tập 6" … "Tập 10". Số "{n} câu chuyện" ở trang chủ tự tính.

---

## 8. Thu nhỏ ảnh (đợt 3)

### 8a. Script `npm run thu-nho-anh`
- File `scripts/thu-nho-anh.mjs` dùng lệnh **`sips`** có sẵn trên macOS (gọi qua `child_process`, không thêm thư viện). Không phải macOS → báo "Script này chỉ chạy trên macOS" và thoát.
- Quét `public/images/**` (`.jpg`, `.jpeg`, `.png`, `.webp`) và `public/logo-oss.png`. **Bỏ qua ảnh mẫu** (có `OSS-ANH-MAU` trong 4KB đầu).
- Cạnh dài tối đa:

| Nhóm | Cạnh dài tối đa |
| --- | --- |
| `thi-sinh/`, `human-of-oss/`, `nhan-xet/`, `ban/` | 1200px |
| `bia/`, `tran-dau/`, `thu-vien/**`, `cot-moc/`, `hero/`, `about/` | 1600px |
| `truong/`, `doi-tac/`, `logo-oss.png` | 600px |

- Chỉ xử lý ảnh **lớn hơn** giới hạn (đọc kích thước bằng `sips -g pixelWidth -g pixelHeight`); **không bao giờ phóng to**. Thu nhỏ bằng `sips -Z {giới hạn}`; với JPEG thêm `-s formatOptions 80`.
- JPEG không vượt giới hạn nhưng nặng hơn 400KB: chỉ nén lại (`-s formatOptions 80`), không đổi kích thước.
- Ghi đè đúng file cũ (cùng tên, cùng đuôi). PNG giữ PNG (giữ nền trong suốt).
- **`--thu`**: chỉ in danh sách sẽ xử lý, không sửa file.
- In bảng kết quả: file, kích thước cũ → mới, dung lượng cũ → mới; cuối cùng là tổng dung lượng trước / sau.

### 8b. Cảnh báo
Cảnh báo ảnh > 500KB đã có: thêm câu gợi ý "Chạy `npm run thu-nho-anh` để thu nhỏ".

### 8c. Chạy thật
1. Chạy `npm run thu-nho-anh -- --thu` và đưa danh sách vào báo cáo.
2. Commit "v0.15 đợt 3" (chỉ code, chưa đụng ảnh).
3. Chạy `npm run thu-nho-anh`, kiểm tra vài ảnh vẫn hiện đúng (`npm run dev`), rồi commit **riêng** "Thu nhỏ ảnh" (để có thể hoàn tác bằng `git revert` nếu cần).

## 9. Tài liệu

`CLAUDE.md` và `README.md`:
- Human of OSS: `date` có thể để `null`, link hồ sơ chỉ hiện khi có hồ sơ;
- quy tắc `draft` (bỏ dòng `"draft": true` thì mục được hiện; khi `npm run dev` thì mục nháp vẫn hiện để xem trước);
- `leader: null` thì ẩn dòng Trưởng ban;
- bảng tên tab;
- ảnh chia sẻ `public/og-image.jpg` (1200×630, dùng chung mọi trang), cách làm mới ảnh trên Facebook bằng Sharing Debugger (`https://developers.facebook.com/tools/debug/`, bấm "Scrape Again");
- `npm run thu-nho-anh` (nên chạy trước mỗi lần commit ảnh mới) và bảng giới hạn kích thước.

---

## Kiểm tra trước khi báo xong

- Build, typecheck pass; không lỗi 404 ảnh.
- `/wiki` ở 1440px: ô Sự kiện khác ghi "8 sự kiện · 2023–2026", không có số năm nào bị tách dòng; thử 1024px và 390px.
- Ô Mùa 1 ở `/thu-vien` ghi "2017–2018"; infobox DOC3 ghi "2024–2025"; trang mùa 1 cũng dùng gạch dài.
- Hồ sơ Lê Trà My: thứ tự 4 phần đúng mục 3.
- Trang chủ khi chạy `npm run build && npm run preview`: **không có** khối Cảm nhận và khối Đối tác; khi chạy `npm run dev`: 2 khối hiện, các mục có nhãn "Nháp". Thử bỏ `"draft": true` ở 1 nhận xét → bản preview hiện khối Cảm nhận với 1 mục, không có chấm chuyển (xong thì trả lại).
- Cơ cấu tổ chức: ban có `leader: null` không có dòng Trưởng ban.
- Human of OSS: 5 thẻ đúng thứ tự, thẻ 2 (Hà Việt Hoàng) ảnh **phải**, ghi "Tập 2" không có ngày; bài tập 2 không có link hồ sơ, bài tập 4 (Trần Hải Linh) có link; nút "‹ Tập trước" / "Tập sau ›" đi đủ 1 → 5; trang chủ ghi "5 câu chuyện"; các đoạn hỏi đáp tập 2–5 hiển thị như tập 1 (câu hỏi đậm, đường kẻ `---` mảnh).
- Tên tab đúng ở: trang chủ, `/wiki`, hồ sơ Lê Trà My ("Lê Trà My · OSSPEDIA"), Mùa 7, DOC3 ("DOC3 · OSSPEDIA"), Thư viện mùa 1, trang 404.
- `index.html` sau build có đủ thẻ `og:` với `og:image` là đường dẫn tuyệt đối; mở `/og-image.jpg` trên bản preview thấy ảnh.
- `npm run thu-nho-anh -- --thu` liệt kê được ảnh lớn (vd `thi-sinh/truyenlua2023-le-tra-my-ss.jpg` 2048×2048 → 1200×1200) và **không** liệt kê ảnh mẫu.

Báo lại: file đã sửa/thêm/xóa, kết quả build/typecheck, danh sách ảnh đã thu nhỏ và tổng dung lượng trước / sau, chỗ nào phải làm khác brief và lý do.
