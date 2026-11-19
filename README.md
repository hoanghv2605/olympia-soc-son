# Olympia Sóc Sơn – Website

Website chính thức của Olympia Sóc Sơn (OSS): giới thiệu, cột mốc, cơ cấu tổ chức, Human of OSS và OSSPEDIA (wiki các mùa giải, thí sinh).

Công nghệ: React 19 + TypeScript + Vite 8 + Tailwind CSS 4 + React Router 8. Dữ liệu là file JSON tĩnh, đưa lên GitHub Pages bằng GitHub Actions.

---

## 1. Chạy trên máy

Cần cài trước: Node.js bản LTS, Git, VS Code (xem hướng dẫn setup Mac M2).

```bash
cd olympia-soc-son
npm install        # chỉ cần chạy lần đầu, hoặc khi package.json thay đổi
npm run dev        # mở http://localhost:5173
```

Sửa file nào, trình duyệt tự cập nhật ngay. Dừng server: `Ctrl + C`.

| Lệnh | Tác dụng |
| --- | --- |
| `npm run dev` | Chạy bản xem thử trên máy |
| `npm run build` | Đóng gói ra thư mục `dist/` (GitHub Actions tự chạy lệnh này) |
| `npm run preview` | Xem thử bản đã đóng gói |
| `npm run typecheck` | Kiểm tra lỗi TypeScript (không bắt buộc) |
| `npm run anh-con-thieu` | Liệt kê ảnh còn thiếu, theo nhóm (chỉ đọc, không sửa file) |

**Tìm kiếm nhanh trên web:** bấm biểu tượng kính lúp trên thanh menu, hoặc gõ phím `/` hay `Ctrl + K` (máy Mac: `⌘ + K`) ở bất kỳ trang nào. Gõ không dấu cũng được (vd `duc`, `mua 4`, `da phuc`); dùng ↑ ↓ để chọn, Enter để mở, Esc để đóng.

---

## 2. Sửa nội dung: chỉ cần sửa file trong `src/data/`

| File | Nội dung |
| --- | --- |
| `site.json` | Tên, khẩu hiệu, 2 đoạn giới thiệu, fanpage, email, địa chỉ (`address`), bản đồ (`mapEmbedUrl` nhúng ở trang chủ, `mapLink` mở Google Maps ở footer), đường dẫn ảnh |
| `schools.json` | Các trường: `id`, `name`, `short` |
| `people.json` | Thí sinh: `id` (mã cố định, dùng làm đường dẫn), `name`, `school`. Gồm cả vài người chỉ thi ĐLĐO (không thi OSS); những người này không có hồ sơ OSSPEDIA |
| `seasons.json` | Các mùa: ngày VL/CK, năm học, địa điểm, MC, luật ĐLĐO năm thứ, đối tượng, `notes`, `seededDraw` |
| `qualifying.json` | Top 12 vòng loại mỗi mùa |
| `matches.json` | Các trận Bán kết / Chung kết: điểm 4 phần thi, tổng, hạng, `advanced` (BK), `placement` (CK) |
| `olympia.json` | Thành tích Đường lên đỉnh Olympia. `ossSeason`: mùa OSS của thí sinh, `null` = không thi OSS. `beforeOss: true` = tham gia ĐLĐO trước khi dự thi OSS. Giải Nhất cuộc thi Quý được tính là 1 cầu truyền hình |
| `milestones.json` | Dòng thời gian (`person` là mã thí sinh). `kind`: `"oss"` = chấm tím, `"olympia"` = chấm hồng |
| `stats.json` | Những con số ấn tượng: mục `"manual": true` nhập tay, còn lại web tự tính |
| `departments.json` | 4 ban: tên, `leader` (Trưởng ban), nhiệm vụ (ảnh ban đặt theo `id`, không khai báo trong JSON) |
| `contacts.json` | Người liên hệ, hiện ở footer (tên và chức vụ). Ô nào để trống `""` thì web tự ẩn |
| `humans.json` | Danh sách bài Human of OSS: `slug`, `stt` (số thứ tự, **không trùng nhau**; quyết định thứ tự trang và tên ảnh `NN.jpg`), `name`, `title` (vai trò), `quote` (câu trích ngắn trên thẻ) |

**Nội dung bài Human of OSS** viết bằng markdown ở `src/content/human-of-oss/<slug>.md` (tên file = `slug` trong `humans.json`). Hỗ trợ tiêu đề `##`, **đậm**, *nghiêng*, danh sách, trích dẫn `>`, ảnh `![mô tả](images/...)`.

Quán quân, kỷ lục, thống kê trường, số thí sinh ĐLĐO, vòng nguyệt quế và cầu truyền hình **không gõ tay**: web tự tính từ `matches.json`, `qualifying.json`, `olympia.json` (xem `src/lib/data.ts`). Ô `null` = không có dữ liệu, khác với `0` điểm.

Ngày luôn ghi dạng `YYYY-MM-DD` (vd `2023-10-08`); web tự hiển thị thành `08/10/2023`.

Thêm một mùa mới = thêm mùa vào `seasons.json`, top 12 vào `qualifying.json`, 4 trận vào `matches.json` (và thí sinh mới vào `people.json`). Trang chủ, OSSPEDIA, Bảng vàng, ô tìm kiếm tự cập nhật.

---

## 3. Ảnh: bỏ vào `public/`, đúng tên là hiện

Chưa có ảnh thì web hiện ảnh giữ chỗ (khi chạy `npm run dev` ô đó ghi luôn đường dẫn cần đặt ảnh).

> **Quan trọng:** web chỉ tải những ảnh có trong danh sách ảnh tự sinh (`src/data/generated/images.json`), để không bị lỗi 404. Thêm ảnh mới vào `public/images/...` xong thì **tắt và chạy lại `npm run dev`** mới thấy ảnh. Khi đưa lên GitHub, bản build tự cập nhật danh sách này.

| Thư mục / tên file | Dùng ở đâu | Tỉ lệ | Kích thước gợi ý |
| --- | --- | --- | --- |
| `public/logo-oss.svg` **hoặc** `logo-oss.png` | Logo thật (trên web và favicon). Web thử lần lượt `logo-oss.svg` → `logo-oss.png` → `logo-oss-tam.svg` (logo tạm hiện có) | vuông | SVG, hoặc PNG nền trong suốt ≥ 512×512 |
| `public/images/hero/hero-main.jpg` | **Tùy chọn.** Ảnh lớn dự phòng trang chủ, chỉ dùng khi chưa mùa nào có ảnh Chung kết. Bình thường ảnh lớn là ảnh Chung kết của mùa mới nhất, 3 chữ O-S-S là ảnh Chung kết của 3 mùa liền trước (xem `tran-dau/` bên dưới) | ngang ~3:2 | ~1800×1200, < 400 KB |
| `public/images/about/tap-the-1.jpg`, `tap-the-2.jpg` | 2 ảnh ở mục Giới thiệu | 4:3 | ~1200×900 |
| `public/images/ban/ban-{id}.jpg` | Ảnh từng ban ở Cơ cấu tổ chức: `ban-chuyen-mon.jpg`, `ban-ki-thuat.jpg`, `ban-truyen-thong.jpg`, `ban-hau-can.jpg` | 4:3 | ~1200×900 |
| `public/images/thi-sinh/s{mùa}-{slug họ tên}-{mã trường}.jpg` | Ảnh thí sinh, **mỗi lượt vào top 12 một ảnh** (vd `s10-pham-ngo-bao-minh-ss.jpg`, `s8-nguyen-thi-ngoc-anh-ss.jpg`). Người chỉ thi Đường lên đỉnh Olympia: `o{năm}-{slug}-{mã trường}.jpg` (vd `o17-ha-viet-hoang-ss.jpg`). Cách tính tên: xem mục dưới | dọc 3:4 | ~600×800 |
| `public/images/tran-dau/<id trận>.jpg` | Ảnh mỗi trận Bán kết / Chung kết ở trang mùa; ảnh Chung kết còn làm dải mờ đầu trang mùa và ảnh đầu thẻ mùa. `id trận` = `id` trong `matches.json`, vd `oss10-bk1.jpg`, `oss10-ck.jpg` | ngang 3:2 | ~1500×1000, < 400 KB |
| `public/images/cot-moc/<YYYY-MM-DD>.jpg` | Ảnh cột mốc (rê chuột/chạm vào dòng thời gian), theo `date` của cột mốc | 4:3 | ~1200×900 |
| `public/images/human-of-oss/{stt 2 chữ số}.jpg` | Chân dung Human of OSS, theo `stt` trong `humans.json` (vd `01.jpg`). Thư mục `images/humans/` không còn dùng | dọc | ~800×1000 |
| `public/images/nhan-xet/<id>.jpg` | Ảnh người nhận xét ở trang chủ. `id` trong `testimonials.json` | vuông | ~600×600 |
| `public/images/doi-tac/<id>.svg` hoặc `.png` | Logo đối tác (nền trong suốt, giữ màu gốc). `id` trong `partners.json` | tự do | SVG, hoặc PNG ngang ~600 px |
| `public/images/truong/<id-trường>.svg` hoặc `.png` | Logo trường (huy hiệu tròn). Tên file = `id` trong `schools.json`: `soc-son`, `da-phuc`, `trung-gia`, `minh-phu`, `xuan-giang`. Chưa có logo thì hiện chữ viết tắt của trường | vuông | ~256×256, nền trong suốt |

### Cách đặt tên ảnh thí sinh (tự tính, không phải nhớ)

`s{mùa}-{slug họ tên}-{mã trường}.jpg`. Trường lấy từ **dòng top 12 của mùa đó** (cùng một người có thể học trường khác ở mùa khác). **Slug họ tên:** đổi `Đ→D`, `đ→d`; bỏ dấu tiếng Việt; chữ thường; mọi cụm ký tự không phải chữ hoặc số thành một dấu `-`; bỏ `-` ở đầu và cuối. Vd "Phạm Ngô Bảo Minh" → `pham-ngo-bao-minh`. Cách dễ nhất: chạy `npm run anh-con-thieu`, lệnh in sẵn đúng tên file cần đặt (kèm tên người và mùa).

| Trường | Mã |
| --- | --- |
| THPT Sóc Sơn | `ss` |
| THPT Đa Phúc | `dp` |
| THPT Trung Giã | `tg` |
| THPT Minh Phú | `mp` |
| THPT Xuân Giang | `xg` |

**Web chọn ảnh thế nào:** ở trang một mùa (vòng tròn thí sinh, thẻ xem nhanh) và khối "Chung kết mùa n" trang chủ thì ưu tiên ảnh đúng mùa đó, chưa có thì dùng ảnh mùa khác (mới trước). Ở chỗ khác (Bảng vàng, danh sách, trang trường, tìm kiếm...) dùng ảnh mùa mới nhất. Hồ sơ thí sinh có từ 2 mùa thì có nút "Mùa n" dưới ảnh để xem ảnh từng mùa (mùa chưa có ảnh thì hiện ảnh giữ chỗ). Hai lượt thi khác nhau mà ra cùng một tên file thì `npm run build` dừng lại và báo 2 lượt đó.

### Xem ảnh nào còn thiếu

```bash
npm run anh-con-thieu
```

Lệnh in từng nhóm (thí sinh, trận đấu, cột mốc, nhận xét, đối tác, Human of OSS, các ban, logo trường, ảnh trang chủ / giới thiệu, logo OSS) kèm dòng "đã có x / y" và **đường dẫn đầy đủ của từng file còn thiếu** (kèm tên người / trận để dễ nhận ra). Lệnh chỉ đọc, không sửa file nào.

**Ảnh mẫu giữ chỗ:** nếu một file ảnh có chuỗi `OSS-ANH-MAU` trong 4 KB đầu (vd nằm trong phần chú thích của file SVG, hoặc trong metadata của JPG) thì web và `npm run anh-con-thieu` coi như **chưa có ảnh**: web vẫn hiện ảnh giữ chỗ, lệnh vẫn báo thiếu. Khi thay bằng ảnh thật (không còn chuỗi này) thì ảnh tự được tính là đã có.

Ảnh thí sinh, trận đấu, cột mốc, Human of OSS **không cần khai báo trong JSON**: đặt đúng tên file là hiện. Chưa có ảnh thì web hiện chữ viết tắt tên (người), logo OSS (cột mốc) hoặc dải chữ cái đầu của 4 thí sinh (trận đấu). Thư mục cũ `public/images/humans/` không còn dùng, có thể xóa.

Mẹo: nén ảnh dưới ~400 KB (squoosh.app) để web tải nhanh. Ảnh chữ O-S-S nên là ảnh dọc, nhiều màu sắc.

---

### Thêm một nhận xét (khối "Cảm nhận về Olympia Sóc Sơn" ở trang chủ)

> Chỉ đăng nhận xét và ảnh khi người đó đã đồng ý.

1. Mở `src/data/testimonials.json`. Sửa một mục giữ chỗ (`nhan-xet-1`…`nhan-xet-6`) hoặc thêm mục mới (nhớ dấu phẩy giữa các mục):
   ```json
   {
     "id": "nhan-xet-7",
     "name": "Chị Nguyễn Văn A",
     "role": "Quán quân mùa 3",
     "position": "Sinh viên Đại học Bách khoa Hà Nội",
     "quote": "Đoạn thứ nhất.\n\nĐoạn thứ hai."
   }
   ```
   `name` ghi cả cách xưng hô; `role`, `position` có thể bỏ; xuống đoạn bằng `\n\n`. Thứ tự trên web = thứ tự trong file.
2. Ảnh (nếu có): `public/images/nhan-xet/<id>.jpg`, ảnh vuông khoảng 600×600.
3. Chạy lại `npm run dev` để xem.

### Thêm / sửa một đối tác (khối "Đối tác đồng hành")

> Chỉ đăng logo khi đơn vị đó đã đồng ý.

1. Mở `src/data/partners.json`, sửa mục giữ chỗ hoặc thêm mục mới:
   ```json
   { "id": "cong-ty-abc", "name": "Công ty ABC", "url": "https://abc.vn", "tier": "chinh" }
   ```
   `url` để `""` nếu không cần link. `"tier": "chinh"` (tùy chọn) = đối tác chính: xếp riêng hàng trên, ô to hơn. Xóa các mục giữ chỗ không dùng.
2. Logo: `public/images/doi-tac/<id>.svg` hoặc `.png`, nền trong suốt. Chưa có logo thì web hiện tên đối tác.
3. Chạy lại `npm run dev`.

### Thêm một câu chuyện Human of OSS

1. Chép `src/content/human-of-oss/_mau.md` thành `src/content/human-of-oss/<slug>.md` (vd `nguyen-van-a.md`). File bắt đầu bằng `_` không hiện trên web.
2. Thêm 1 mục vào `src/data/humans.json` với cùng `slug` (mẫu có sẵn ở đầu file `_mau.md`): `slug`, `stt`, `name`, `title` (vai trò), `quote` (câu trích ngắn). **`stt` = số tiếp theo chưa dùng** (1, 2, 3...), không được trùng; trùng thì build báo lỗi.
3. Ảnh chân dung (nếu có): `public/images/human-of-oss/{stt 2 chữ số}.jpg`, vd `stt` là 2 thì `02.jpg`.
4. Viết bài trong file `.md`, rồi chạy lại `npm run dev`. Trang Human of OSS luôn có 10 ô; mỗi câu chuyện mới thay một ô "Câu chuyện sắp ra mắt".

## 4. Đưa lên mạng (GitHub Pages)

Lần đầu (trong thư mục dự án):

```bash
git init
git add .
git commit -m "Khởi tạo website Olympia Sóc Sơn"
git branch -M main
gh repo create olympia-soc-son --public --source=. --remote=origin --push
```

Sau đó vào repo trên github.com → **Settings → Pages → Build and deployment → Source: GitHub Actions**.
Nếu lần chạy đầu báo đỏ (do chưa bật Pages), vào tab **Actions** → chọn lần chạy đó → **Re-run all jobs**.

Web sẽ ở địa chỉ: `https://<tên-github-của-bạn>.github.io/olympia-soc-son/`

Những lần sau chỉ cần:

```bash
git add .
git commit -m "Cập nhật kết quả mùa 10"
git push
```

Khoảng 1–2 phút sau web tự cập nhật (theo dõi ở tab **Actions**).

> File `package-lock.json` (tạo ra khi chạy `npm install`) phải được commit cùng, vì GitHub Actions dùng nó để cài đúng phiên bản.

---

## 5. Cấu trúc thư mục

```
src/
  data/          ← nội dung (JSON)
  pages/         ← từng trang
    about/       ← Về chúng tôi: Giới thiệu (có phần Liên hệ), Cơ cấu tổ chức
    wiki/        ← OSSPEDIA: mùa giải, thí sinh, trường
  content/human-of-oss/ ← nội dung bài Human of OSS (markdown)
    HallOfFamePage.tsx ← Bảng vàng
  components/    ← phần dùng chung: header, footer, dòng thời gian, ảnh...
  lib/           ← đọc dữ liệu, định dạng ngày, tìm kiếm không dấu
  index.css      ← màu sắc, font, kiểu dáng chung
  App.tsx        ← danh sách đường dẫn (route)
public/          ← logo, ảnh
.github/workflows/deploy.yml  ← tự động đưa lên GitHub Pages
```

Ghi chú kỹ thuật:
- Dùng `HashRouter` nên đường dẫn có dạng `/#/wiki/...`. Nhờ vậy F5 ở trang con trên GitHub Pages không bị lỗi 404, và không cần khai báo tên repo trong `vite.config.ts` (`base: "./"`).
- Toàn bộ dữ liệu đi qua `src/lib/data.ts`. Sau này chuyển sang Google Sheets/Supabase chỉ cần sửa file này.
