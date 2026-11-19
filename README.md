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

**So sánh font tiêu đề (tạm thời, sẽ bỏ ở v0.7):** thêm `?font=a` (Bricolage Grotesque) hoặc `?font=b` (Fraunces) vào **trước** dấu `#` của đường dẫn, vd

- `https://hoanghv2605.github.io/olympia-soc-son/?font=a#/bang-vang`
- `https://hoanghv2605.github.io/olympia-soc-son/?font=b#/bang-vang`
- Chạy trên máy: `http://localhost:5173/?font=a#/bang-vang`

Bấm chuyển trang vẫn giữ font đã chọn. Không có `?font=` thì web dùng font hiện tại (Be Vietnam Pro) và không nạp thêm font nào.

---

## 2. Sửa nội dung: chỉ cần sửa file trong `src/data/`

| File | Nội dung |
| --- | --- |
| `site.json` | Tên, khẩu hiệu, 2 đoạn giới thiệu, fanpage, email, địa chỉ bản đồ, đường dẫn ảnh |
| `schools.json` | Các trường: `id`, `name`, `short` |
| `people.json` | Thí sinh: `id` (mã cố định, dùng làm đường dẫn), `name`, `school`. Gồm cả vài người chỉ thi ĐLĐO (không thi OSS); những người này không có hồ sơ OSSPEDIA |
| `seasons.json` | Các mùa: ngày VL/CK, năm học, địa điểm, MC, luật ĐLĐO năm thứ, đối tượng, `notes`, `seededDraw` |
| `qualifying.json` | Top 12 vòng loại mỗi mùa |
| `matches.json` | Các trận Bán kết / Chung kết: điểm 4 phần thi, tổng, hạng, `advanced` (BK), `placement` (CK) |
| `olympia.json` | Thành tích Đường lên đỉnh Olympia. `ossSeason`: mùa OSS của thí sinh, `null` = không thi OSS. `beforeOss: true` = tham gia ĐLĐO trước khi dự thi OSS. Giải Nhất cuộc thi Quý được tính là 1 cầu truyền hình |
| `milestones.json` | Dòng thời gian (`person` là mã thí sinh). `kind`: `"oss"` = chấm tím, `"olympia"` = chấm hồng |
| `stats.json` | Những con số ấn tượng: mục `"manual": true` nhập tay, còn lại web tự tính |
| `departments.json` | 4 ban và nhiệm vụ từng ban |
| `contacts.json` | Người liên hệ. Ô nào để trống `""` thì web tự ẩn |
| `humans.json` | Danh sách bài Human of OSS: `slug`, `name`, `title` (vai trò), `quote` (câu trích ngắn trên thẻ) |

**Nội dung bài Human of OSS** viết bằng markdown ở `src/content/human-of-oss/<slug>.md` (tên file = `slug` trong `humans.json`). Hỗ trợ tiêu đề `##`, **đậm**, *nghiêng*, danh sách, trích dẫn `>`, ảnh `![mô tả](images/...)`.

Quán quân, kỷ lục, thống kê trường, số thí sinh ĐLĐO, vòng nguyệt quế và cầu truyền hình **không gõ tay**: web tự tính từ `matches.json`, `qualifying.json`, `olympia.json` (xem `src/lib/data.ts`). Ô `null` = không có dữ liệu, khác với `0` điểm.

Ngày luôn ghi dạng `YYYY-MM-DD` (vd `2023-10-08`); web tự hiển thị thành `08/10/2023`.

Thêm một mùa mới = thêm mùa vào `seasons.json`, top 12 vào `qualifying.json`, 4 trận vào `matches.json` (và thí sinh mới vào `people.json`). Trang chủ, OSSPEDIA, Bảng vàng, ô tìm kiếm tự cập nhật.

---

## 3. Ảnh: bỏ vào `public/`, đúng tên là hiện

Chưa có ảnh thì web hiện ô màu nhạt (khi chạy `npm run dev` ô đó ghi luôn đường dẫn cần đặt ảnh).

| Đường dẫn | Vị trí trên web |
| --- | --- |
| `public/logo-oss.svg` **hoặc** `public/logo-oss.png` | Logo thật (cả logo trên web và favicon). Web thử lần lượt `logo-oss.svg` → `logo-oss.png` → `logo-oss-tam.svg` (logo tạm hiện có), file nào có thì dùng |
| `public/images/hero/hero-main.jpg` | Ảnh lớn trang chủ |
| `public/images/hero/letter-o.jpg`, `letter-s1.jpg`, `letter-s2.jpg` | Ảnh lồng trong 3 chữ O-S-S ở trang chủ |
| `public/images/about/tap-the-1.jpg`, `tap-the-2.jpg` | 2 ảnh ở mục Giới thiệu |
| `public/images/about/ban-chuyen-mon.jpg` | Ảnh Ban Chuyên môn (ban khác: thêm `"photo"` trong `departments.json`) |
| `public/images/thi-sinh/<mã-thí-sinh>.jpg` | Ảnh thí sinh (hồ sơ, thẻ Bảng vàng). Mã = `id` trong `people.json`, vd `le-tra-my.jpg`. Nên dùng ảnh dọc 3:4 |
| `public/images/cot-moc/<YYYY-MM-DD>.jpg` | Ảnh cột mốc (hiện khi rê chuột/chạm vào dòng thời gian), theo `date` của cột mốc. Nên dùng ảnh 4:3 |
| `public/images/human-of-oss/<slug>.jpg` | Chân dung Human of OSS |
| `public/images/truong/<id-trường>.svg` hoặc `.png` | Logo trường (huy hiệu tròn ở trang Các trường và trang trường). Tên file = `id` trong `schools.json`: `soc-son`, `da-phuc`, `trung-gia`, `minh-phu`, `xuan-giang`. Ảnh vuông khoảng 256×256, nền trong suốt. Chưa có logo thì hiện chữ viết tắt của trường |

Ảnh thí sinh, cột mốc, Human of OSS **không cần khai báo trong JSON**: đặt đúng tên file là hiện. Chưa có ảnh thì web hiện chữ viết tắt tên (người) hoặc logo OSS (cột mốc) trên nền tím. Thư mục cũ `public/images/humans/` không còn dùng, có thể xóa.

Mẹo: nén ảnh dưới ~400 KB (squoosh.app) để web tải nhanh. Ảnh chữ O-S-S nên là ảnh dọc, nhiều màu sắc.

---

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
