# Yêu cầu v0.13 (Kit đã duyệt)

Đọc `CLAUDE.md` trước. **Trình bày kế hoạch trước khi sửa.** Làm 2 đợt, xong mỗi đợt chạy `npm run build`, `npm run typecheck` rồi `git commit`:
- **Đợt 1:** mục 0, 1, 3, 4, commit "v0.13 đợt 1".
- **Đợt 2:** mục 2, 5, commit "v0.13 đợt 2".

Không thêm thư viện npm. Không sửa dữ liệu thi đấu. Ảnh mẫu (`OSS-ANH-MAU`) vẫn coi là chưa có ảnh. Mọi chuyển động tôn trọng `prefers-reduced-motion`.

Kit đã giải nén sẵn vào dự án: 10 ảnh mẫu `public/images/bia/oss{n}-bia.jpg` và bài viết `src/content/human-of-oss/nguyen-thanh-ha.md`.

---

## 0. Giữ mặt người khi cắt ảnh

- Hàm dùng chung `imageFocus(path, kind)` trả về `object-position`:
  - Ảnh người (`thi-sinh/*`, `human-of-oss/*`, `nhan-xet/*`, ảnh tròn nhỏ, Hall of Fame): mặc định **`50% 25%`** (ưu tiên giữ phần trên, nơi thường có mặt người; nhiều ảnh là poster có chữ ở đầu).
  - Ảnh nhóm / ảnh ngang (`tran-dau/*`, `bia/*`, `thu-vien/*`, `cot-moc/*`, ảnh lớn trang chủ): mặc định **`50% 35%`**.
- **Tuỳ chỉnh từng ảnh** (Kit tự sửa khi thấy ảnh bị cắt mất mặt): file `src/data/tieu-diem-anh.json` dạng `{ "thi-sinh/s8-nguyen-huu-phu-an-ss.jpg": "50% 10%" }` (đường dẫn tính từ `images/`). Có trong file thì dùng giá trị đó. Tạo file với `{}`.
- Áp dụng cho **mọi** ảnh dùng `object-fit: cover` trên site (`PersonPhoto`, ảnh tròn, Hall of Fame, thẻ thí sinh, dải 2 năm liên tiếp, ảnh trận đấu, thư viện, ảnh bìa, cột mốc, ảnh lớn trang chủ, chữ O S S dùng `background-position`).
- README: hướng dẫn ngắn cách chỉnh (giá trị thứ hai nhỏ hơn = lấy phần cao hơn của ảnh).

## 1. Danh sách thí sinh: thẻ nhỏ lại

- Lưới chế độ Thẻ: **6 cột** (≥ 1280px), 5 (≥ 1024px), 4 (≥ 768px), 3 (≥ 560px), 2 (nhỏ hơn). Khoảng cách giữa thẻ 12–16px.
- Thẻ gọn: ảnh 3:4, tên (`0.95rem`, đậm, cho phép xuống 2 dòng, **không** dùng line-clamp / `overflow: hidden`, `line-height` 1.4), tên trường (`0.8rem`, màu phụ), "Mùa 8, 9" (`0.8rem`), `ResultBadge` cỡ nhỏ hoặc chữ "Top 12". Padding thẻ ~12px.

## 2. Human of OSS

### 2a. Dữ liệu
- **Xoá** câu chuyện Chương Hải Lam (mục trong `humans.json` và file `chuong-hai-lam.md`).
- Thêm tập 1 (bài viết đã có ở `src/content/human-of-oss/nguyen-thanh-ha.md`, giữ nguyên nội dung):

```json
{
  "slug": "nguyen-thanh-ha",
  "stt": 1,
  "name": "Nguyễn Thanh Hà",
  "title": "Á quân OSS2",
  "headline": "Nước mắt em lau bằng tình yêu mới",
  "quote": "Hãy cố gắng hết mình trước khi cảm thấy tiếc nuối.",
  "date": "2019-09-23",
  "person": "nguyen-thanh-ha"
}
```
- Trường mới: `headline` (tiêu đề bài), `quote` (câu trích ngắn cho thẻ), `date` (`YYYY-MM-DD`), `person` (tuỳ chọn: id thí sinh OSSPEDIA). Cập nhật kiểu dữ liệu, `_mau.md` và README.
- **Ảnh**: `human-of-oss/{stt 2 chữ số}.jpg` → nếu chưa có và có `person` thì ảnh thí sinh mùa mới nhất của người đó → ảnh giữ chỗ.

### 2b. Trang danh sách (`/human-of-oss`): thẻ ngang xếp so le
- **Một cột**, các thẻ xếp theo `stt`. Máy tính: mỗi thẻ rộng ~80% khung nội dung; thẻ lẻ (1, 3, 5…) **sát trái**, thẻ chẵn **sát phải** (tạo nhịp chữ chi). Điện thoại: rộng 100%.
- **Thẻ lẻ:** ảnh tròn bên **trái**, khối chữ bên phải. **Thẻ chẵn:** ảnh tròn bên **phải**, khối chữ bên trái (tên và title căn phải, sát ảnh).
- Ảnh tròn 128px (điện thoại 80px), viền `oss` 2px cách ảnh 3px; căn giữa theo chiều dọc của thẻ.
- Khối chữ:
  1. **Tên** (`h2`, `1.25rem`, đậm, màu `oss`).
  2. **Title** (chữ nhỏ, màu phụ).
  3. **Câu trích**: trong ngoặc kép “…”, **in nghiêng**, `text-align: justify` (dòng cuối căn theo phía của khối chữ), cỡ `1rem`, `line-height` 1.7.
  4. **Dòng cuối**: "Tập {stt} · {dd/mm/yyyy}" (chữ nhỏ, màu phụ), căn theo phía của khối chữ.
- Thẻ nền trắng, bo góc lớn, bóng nhẹ; cả thẻ là link tới bài. Rê chuột / focus: nhấc 2px, viền `oss` 30%.
- **Ô chờ** (đủ `HUMAN_SLOTS` = 10): cùng bố cục so le và đúng vị trí lẻ/chẵn tiếp theo; viền nét đứt, ảnh tròn tông nhạt có icon `PiPenNib`, tên "Câu chuyện sắp ra mắt", title "Tập {n}", câu trích "Một gương mặt của Olympia Sóc Sơn sẽ xuất hiện tại đây.", không có ngày; không phải link, `aria-hidden` như hiện tại.

### 2c. Trang bài viết (`/human-of-oss/:slug`)
- Đầu bài: ảnh tròn 160px, `h1` tên, title, tiêu đề bài `headline` trong ngoặc kép in nghiêng, dòng "Tập {stt} · {dd/mm/yyyy}".
- Nội dung: khung đọc tối đa ~68 ký tự/dòng; đoạn chỉ gồm chữ đậm (câu hỏi phỏng vấn) màu `oss-deep`; đường kẻ `---` thành gạch ngang mảnh.
- Cuối bài: nếu có `person` thì link "Xem hồ sơ OSSPEDIA của {tên}"; nút "‹ Tập trước" / "Tập sau ›" (chỉ các tập thật).
- `/human-of-oss/chuong-hai-lam` → trang 404.

## 3. Thư viện: thu nhỏ lưới

- **Trang `/thu-vien`**: **5 cột** (≥ 1280px), 4 (≥ 1024px), 3 (≥ 768px), 2 (nhỏ hơn). Thu nhỏ chữ trong ô cho cân.
- **Trang `/thu-vien/mua-{n}`**: **6 cột** (≥ 1280px), 5 (≥ 1024px), 4 (≥ 768px), 3 (≥ 560px), 2 (nhỏ hơn); khoảng cách 8px.

## 4. Ảnh bìa mùa

- Quy ước: **`public/images/bia/oss{n}-bia.jpg`** (ngang 3:2, ~1500×1000).
- Thứ tự ưu tiên:

| Chỗ dùng | Ưu tiên |
| --- | --- |
| Ô mùa ở trang `/thu-vien` | ảnh bìa → ảnh đầu tiên của thư viện mùa → giữ chỗ |
| Thư viện mùa (`/thu-vien/mua-{n}`) | ảnh bìa **đứng đầu** lưới, rồi ảnh trận đấu, rồi `thu-vien/mua-{n}/` |
| Thẻ mùa ở trang tổng hợp các mùa (OSSPEDIA) | ảnh bìa → ảnh Chung kết → giữ chỗ |
| Dải ảnh mờ đầu trang mùa (OSSPEDIA) | ảnh bìa → ảnh Chung kết → không có dải |

- Ảnh lớn trang chủ và chữ O S S **giữ nguyên** (dùng ảnh Chung kết).
- Số ảnh "{x} ảnh" của mùa tính cả ảnh bìa.

## 5. Script và tài liệu

- `npm run anh-con-thieu`: thêm nhóm **Ảnh bìa mùa (10)**; nhóm Human of OSS theo `stt` (tập 1 tính là có nếu dùng được ảnh thí sinh thay thế, ghi chú rõ "đang dùng ảnh thí sinh").
- `CLAUDE.md` và `README.md`: `imageFocus` và `tieu-diem-anh.json`, ảnh bìa mùa và thứ tự ưu tiên, dữ liệu Human of OSS mới (`headline`, `quote`, `date`, `person`), bố cục thẻ so le.

---

## Kiểm tra trước khi báo xong

- Build, typecheck pass; không lỗi 404 ảnh.
- Danh sách thí sinh ở 1440px: 6 thẻ một hàng; ở 390px: 2 thẻ; tên dài (vd "Nguyễn Đồng Đức Anh") xuống dòng không bị cắt dấu.
- Thêm `"thi-sinh/s8-nguyen-huu-phu-an-ss.jpg": "50% 0%"` vào `tieu-diem-anh.json` → ảnh thẻ đó dịch lên đúng; xoá đi → về mặc định.
- Human of OSS: thẻ 1 Nguyễn Thanh Hà (ảnh trái, "Á quân OSS2", câu trích in nghiêng trong ngoặc kép, "Tập 1 · 23/09/2019"); thẻ 2 là ô chờ "Tập 2" ảnh bên phải; tổng 10 ô; bài viết hiển thị đúng phần hỏi đáp và có link hồ sơ OSSPEDIA; `/human-of-oss/chuong-hai-lam` ra 404.
- Thư viện: 5 ô mùa một hàng ở 1440px; trang mùa 6 ảnh một hàng.
- Thả tạm ảnh thật vào `bia/oss2-bia.jpg` (chạy lại `npm run dev`) → ô Mùa 2 ở Thư viện, thẻ Mùa 2 ở trang tổng hợp các mùa và dải đầu trang mùa 2 đều dùng ảnh đó; ảnh đứng đầu thư viện mùa 2.
- Thử ở 1280px và 390px.

Báo lại: file đã sửa/thêm/xóa, kết quả build/typecheck, chỗ nào phải làm khác brief và lý do.
