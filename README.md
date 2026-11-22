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
| `npm run thu-nho-anh` | Thu nhỏ ảnh trong `public/` (chỉ macOS, dùng lệnh `sips` có sẵn). Thêm `-- --thu` để chỉ xem danh sách, không sửa file. **Nên chạy trước mỗi lần commit ảnh mới** (bảng giới hạn ở mục 3) |
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
| `departments.json` | 5 ban (Ban Tổ chức đứng đầu, `id` `to-chuc`): tên, `leader` (Trưởng ban), nhiệm vụ (ảnh ban đặt theo `id`, không khai báo trong JSON) |
| `events.json` | **Sự kiện khác** (OSSPEDIA, Thư viện). Mỗi sự kiện: `id` (mã, dùng cho đường dẫn, ảnh bìa, thư mục thư viện), `stt` (thứ tự hiển thị ở mọi nơi), `name`, `shortName` (tuỳ chọn, chỗ chật), `type` (`rung-chuong-vang` / `toa-dam` / `giao-luu` / `dac-biet` / `cuoc-thi`), `year`, `schoolYear` (vd `"2023-2024"` hoặc `null`), `date` (`YYYY-MM-DD` hoặc `null`), `scope`, `organizer`, `role` (`to-chuc` / `dong-to-chuc` / `tham-gia` / `null`), `intro` (markdown hoặc `null`), `format` (`null` / `xep-hang` / `nguoi-choi` / `mua-thi`), `photoKey` + `photoLabel` (tiền tố tên ảnh người chơi; nhãn nút ảnh ở hồ sơ), `sectionTitle`, `participantLabel`, `participants[]` (`name`, `person`, `class`, `school` **hoặc** `schoolName`, `rank` 1–3, `note`). Ô trống hiện "Đang cập nhật". Sự kiện nằm **ngoài mọi thống kê OSS**. **Bổ sung thông tin:** điền `date`, `role`, `intro`... vào đúng sự kiện. **Thêm sự kiện mới:** thêm một mục với `id` và `stt` mới, đặt ảnh bìa `bia/{id}-bia.jpg` |
| `su-kien/doc3.json` | Dữ liệu cuộc thi **DOC3** (DAPHUC Olympia Championship 3), cùng hình dạng dữ liệu OSS: `season`, `people[]` (`id`, `name`, `school`, `ossPerson?` = id hồ sơ OSSPEDIA nếu người đó cũng thi OSS), `qualifying[]`, `matches[]` (id trận `doc3-bk1`, `doc3-ck`...; `person` trỏ tới `people` của DOC3). Rỗng thì trang DOC3 ghi "Dữ liệu DOC3 đang được cập nhật."; có dữ liệu thì tự hiện bảng, biểu đồ như trang mùa. **Không** tính vào thống kê OSS |
| `contacts.json` | Người liên hệ, hiện ở footer (tên và chức vụ). Ô nào để trống `""` thì web tự ẩn |
| `humans.json` | Danh sách bài Human of OSS: `slug`, `stt` (số thứ tự, **không trùng nhau**; quyết định thứ tự trang và tên ảnh `NN.jpg`), `name`, `title` (vai trò), `headline` (tiêu đề bài), `quote` (câu trích ngắn trên thẻ), `date` (YYYY-MM-DD, **để `null` nếu chưa có**: thẻ chỉ ghi "Tập n"), `person` (tuỳ chọn: id người trong `people.json`; link hồ sơ OSSPEDIA chỉ hiện khi người đó có hồ sơ) |

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
| `public/images/ban/ban-{id}.jpg` | Ảnh từng ban ở Cơ cấu tổ chức: `ban-to-chuc.jpg`, `ban-chuyen-mon.jpg`, `ban-ki-thuat.jpg`, `ban-truyen-thong.jpg`, `ban-hau-can.jpg` | 4:3 | ~1200×900 |
| `public/images/thi-sinh/s{mùa}-{slug họ tên}-{mã trường}.jpg` | Ảnh thí sinh, **mỗi lượt vào top 12 một ảnh** (vd `s10-pham-ngo-bao-minh-ss.jpg`, `s8-nguyen-thi-ngoc-anh-ss.jpg`). Người chỉ thi Đường lên đỉnh Olympia: `o{năm}-{slug}-{mã trường}.jpg` (vd `o17-ha-viet-hoang-ss.jpg`). Cách tính tên: xem mục dưới | dọc 3:4 | ~600×800 |
| `public/images/tran-dau/<id trận>.jpg` | Ảnh mỗi trận Bán kết / Chung kết ở trang mùa; ảnh Chung kết còn làm dải mờ đầu trang mùa và ảnh đầu thẻ mùa. `id trận` = `id` trong `matches.json`, vd `oss10-bk1.jpg`, `oss10-ck.jpg` | ngang 3:2 | ~1500×1000, < 400 KB |
| `public/images/cot-moc/<YYYY-MM-DD>.jpg` | Ảnh cột mốc ở trang Giới thiệu, theo `date` của cột mốc. Chỉ cột mốc có ảnh thật mới có nút máy ảnh, ảnh xem trước khi rê chuột và hộp xem ảnh lớn | 4:3 | ~1200×900 |
| `public/images/thu-vien/mua-{n}/<tên tùy ý>.jpg` | **Ảnh Thư viện** của mùa n (`.jpg`, `.jpeg`, `.png`, `.webp`). Tên file đặt tùy ý, web xếp theo tên kiểu tự nhiên (`2.jpg` trước `10.jpg`), đứng sau các ảnh trận đấu của mùa. Thêm ảnh xong chạy lại `npm run dev`. Ảnh lớn hơn 500KB sẽ bị cảnh báo khi chạy | nên ngang, ~1600px rộng | < 400 KB |
| `public/images/bia/{mã sự kiện}-bia.jpg` | Ảnh bìa sự kiện (`events.json` → `id`), vd `rcv2023-bia.jpg`. Ưu tiên: ảnh bìa → ảnh đầu thư viện sự kiện → nền tông màu có icon loại | ngang 3:2 | ~1500×1000 |
| `public/images/thu-vien/su-kien/{mã sự kiện}/<tên tùy ý>.jpg` | **Ảnh Thư viện sự kiện** (`.jpg`, `.jpeg`, `.png`, `.webp`), xếp tên kiểu tự nhiên; thứ tự: ảnh bìa → (DOC3: ảnh trận `tran-dau/doc3-bk1…`, `doc3-ck`) → ảnh trong thư mục | nên ngang | < 400 KB |
| `public/images/thi-sinh/{photoKey}-{slug họ tên}-{mã trường}.jpg` | Ảnh người chơi tại sự kiện (vd `truyenlua2023-le-tra-my-ss.jpg`, `allstars-chu-duc-huy-ss.jpg`), chỉ cho người chơi có trường trong `schools.json`. DOC3: `doc3-{slug}-{mã trường}.jpg`. Hiện ở trang sự kiện và nút ảnh ở hồ sơ | dọc 3:4 | ~600×800 |
| `public/images/human-of-oss/{stt 2 chữ số}.jpg` | Chân dung Human of OSS, theo `stt` trong `humans.json` (vd `01.jpg`). Thư mục `images/humans/` không còn dùng | dọc | ~800×1000 |
| `public/images/nhan-xet/<id>.jpg` | Ảnh người nhận xét ở trang chủ. `id` trong `testimonials.json` | vuông | ~600×600 |
| `public/images/doi-tac/{id}.svg` hoặc `.png` | Logo đối tác (nền trong suốt, giữ màu gốc), tên file = `id` trong `partners.json`: `vang-1`…`vang-5`, `bac-1`…`bac-10`, `dong-hanh-1`…`dong-hanh-10`. Đổi hạng: xem mục "Thêm / sửa một đối tác" | tự do | SVG, hoặc PNG ngang ~600 px |
| `public/images/thi-sinh/o{năm}-{slug họ tên}-{mã trường}.jpg` | Ảnh **Đường lên đỉnh Olympia**, mỗi năm một ảnh, cho cả thí sinh OSS và người chỉ thi Olympia (vd `o26-nghiem-trung-duc-ss.jpg`). Mã trường theo trường của người đó trong `people.json`. Hiện ở hồ sơ (nút "O26") và mục THPT Sóc Sơn tại Đường lên đỉnh Olympia ở Bảng vàng | dọc 3:4 | ~600×800 |
| `public/images/thi-sinh/s{mùa}-{slug họ tên}-{mã trường}-win.jpg` | Ảnh **Quán quân** ở Hall of Fame (Bảng vàng), mùa vô địch gần nhất của người đó (vd `s9-nghiem-trung-duc-ss-win.jpg`). Chưa có thì dùng ảnh mùa đó (không `-win`), rồi ảnh mùa khác | vuông | ~800×800 |
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

**Web chọn ảnh thế nào:** ở trang một mùa (ảnh tròn nhỏ cạnh tên trong bảng Bán kết / Chung kết, thẻ xem nhanh) và khối "Chung kết mùa n" trang chủ thì ưu tiên ảnh đúng mùa đó, chưa có thì dùng ảnh mùa khác (mới trước). Ở chỗ khác (Bảng vàng, danh sách, trang trường, tìm kiếm...) dùng ảnh mùa mới nhất. Hồ sơ thí sinh có nút "Mùa n" và "O{năm}" dưới ảnh (hiện khi có từ 2 nút) để xem ảnh từng mùa / từng năm Olympia (chưa có ảnh thì hiện ảnh giữ chỗ). Mục THPT Sóc Sơn tại Đường lên đỉnh Olympia ưu tiên ảnh `o…`. Hall of Fame dùng ảnh `-win`. Hai lượt thi khác nhau mà ra cùng một tên file thì `npm run build` dừng lại và báo 2 lượt đó.

### Ảnh bìa mùa
`public/images/bia/oss{n}-bia.jpg` (ngang 3:2, ~1500×1000). Ưu tiên: ô mùa ở Thư viện = ảnh bìa → ảnh đầu thư viện → giữ chỗ; thư viện mùa = ảnh bìa đứng đầu, rồi ảnh trận đấu, rồi `thu-vien/mua-{n}/`; thẻ mùa và dải mờ đầu trang mùa (OSSPEDIA) = ảnh bìa → ảnh Chung kết. Ảnh lớn trang chủ vẫn dùng ảnh Chung kết.

### Ảnh bị cắt mất mặt? Chỉnh tiêu điểm
Ảnh cắt khung (`object-fit: cover`) lấy vị trí mặc định: ảnh người (`thi-sinh`, `human-of-oss`, `nhan-xet`) `50% 25%`, ảnh ngang (`tran-dau`, `bia`, `thu-vien`, `cot-moc`, ảnh lớn) `50% 35%`. Muốn chỉnh riêng một ảnh, thêm vào `src/data/tieu-diem-anh.json` (đường dẫn tính từ `images/`):
```json
{ "thi-sinh/s8-nguyen-huu-phu-an-ss.jpg": "50% 10%" }
```
Giá trị thứ hai nhỏ hơn = lấy phần cao hơn của ảnh (0% = sát mép trên, 100% = sát mép dưới).

### Thu nhỏ ảnh (`npm run thu-nho-anh`)
Chỉ chạy trên macOS (dùng `sips`). `npm run thu-nho-anh -- --thu` in danh sách ảnh sẽ xử lý, không sửa file; `npm run thu-nho-anh` thu nhỏ thật (ghi đè đúng file cũ, PNG giữ PNG, bỏ qua ảnh mẫu). Không bao giờ phóng to; JPEG chất lượng 80; JPEG nặng hơn 400KB mà chưa vượt giới hạn cạnh thì chỉ nén lại.

| Thư mục | Cạnh dài tối đa |
| --- | --- |
| `thi-sinh/`, `human-of-oss/`, `nhan-xet/`, `ban/` | 1200px |
| `bia/`, `tran-dau/`, `thu-vien/**`, `cot-moc/`, `hero/`, `about/` | 1600px |
| `truong/`, `doi-tac/`, `logo-oss.png` | 600px |

### Xem ảnh nào còn thiếu

```bash
npm run anh-con-thieu
```

Lệnh in từng nhóm (thí sinh theo mùa, ảnh Olympia, Quán quân Hall of Fame, ảnh bìa mùa, trận đấu, cột mốc, nhận xét, đối tác Vàng / Bạc / Đồng hành, Human of OSS, các ban, logo trường, ảnh trang chủ / giới thiệu, logo OSS) kèm dòng "đã có x / y" và **đường dẫn đầy đủ của từng file còn thiếu** (kèm tên người / trận để dễ nhận ra). Lệnh chỉ đọc, không sửa file nào.

**Ảnh mẫu giữ chỗ:** nếu một file ảnh có chuỗi `OSS-ANH-MAU` trong 4 KB đầu (vd nằm trong phần chú thích của file SVG, hoặc trong metadata của JPG) thì web và `npm run anh-con-thieu` coi như **chưa có ảnh**: web vẫn hiện ảnh giữ chỗ, lệnh vẫn báo thiếu. Khi thay bằng ảnh thật (không còn chuỗi này) thì ảnh tự được tính là đã có.

Ảnh thí sinh, trận đấu, cột mốc, Human of OSS **không cần khai báo trong JSON**: đặt đúng tên file là hiện. Chưa có ảnh thì web hiện chữ viết tắt tên (người), logo OSS (cột mốc) hoặc không hiện gì (ảnh trận đấu; không còn dải giữ chỗ). Thư mục cũ `public/images/humans/` không còn dùng, có thể xóa.

**Link danh sách thí sinh đã lọc:** bộ lọc nằm trên địa chỉ trang, vd `/#/wiki/thi-sinh?mua=4&giai=a-quan` (Mùa 4, Á quân), `?truong=soc-son`, `?giai=quan-quan&sap-xep=mua`. Các khóa: `q` (tên), `truong` (id trường trong `schools.json`), `mua` (số), `giai` (`quan-quan` | `a-quan` | `quy-quan` | `top-12`), `sap-xep` (`ten` | `thanh-tich` | `mua`).

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

Đối tác chia 3 hạng, hiện thành 3 hàng trên trang chủ theo thứ tự **Vàng → Bạc → Đồng hành** (hạng nào không có đối tác thì ẩn cả hàng). Mặc định có 25 mục giữ chỗ: `vang-1`…`vang-5`, `bac-1`…`bac-10`, `dong-hanh-1`…`dong-hanh-10`.

1. Mở `src/data/partners.json`, sửa mục giữ chỗ hoặc thêm mục mới:
   ```json
   { "id": "vang-1", "name": "Công ty ABC", "url": "https://abc.vn", "tier": "vang" }
   ```
   `tier` là `"vang"`, `"bac"` hoặc `"dong-hanh"`. `url` để `""` nếu không cần link. Xóa các mục giữ chỗ không dùng.
2. Logo: `public/images/doi-tac/{id}.svg` hoặc `.png` (tên file = `id`), nền trong suốt. Chưa có logo thì web hiện tên đối tác.
3. **Đổi hạng một đối tác** (vd từ Bạc lên Vàng): đổi `"tier"` trong `partners.json`, rồi đổi `id` cho hợp hạng mới (vd `bac-3` → `vang-6`) và đổi tên file logo theo `id` mới. Thứ tự trong hàng = thứ tự trong file.
4. Chạy lại `npm run dev`.

### Thêm một câu chuyện Human of OSS

1. Chép `src/content/human-of-oss/_mau.md` thành `src/content/human-of-oss/<slug>.md` (vd `nguyen-van-a.md`). File bắt đầu bằng `_` không hiện trên web.
2. Thêm 1 mục vào `src/data/humans.json` với cùng `slug` (mẫu có sẵn ở đầu file `_mau.md`): `slug`, `stt`, `name`, `title` (vai trò), `headline` (tiêu đề bài), `quote` (câu trích ngắn), `date`, `person` (tuỳ chọn, id thí sinh: có thì cuối bài có link hồ sơ OSSPEDIA và dùng ảnh thí sinh khi chưa có ảnh riêng). **`stt` = số tiếp theo chưa dùng** (1, 2, 3...), không được trùng; trùng thì build báo lỗi.
3. Ảnh chân dung (nếu có): `public/images/human-of-oss/{stt 2 chữ số}.jpg` (vd `stt` là 2 thì `02.jpg`); chưa có thì dùng ảnh thí sinh của `person`, không có nữa thì ảnh giữ chỗ. Trang danh sách xếp thẻ ngang so le: tập lẻ ảnh bên trái, tập chẵn ảnh bên phải.
4. Viết bài trong file `.md`, rồi chạy lại `npm run dev`. Trang Human of OSS luôn có 10 ô; mỗi câu chuyện mới thay một ô "Câu chuyện sắp ra mắt".

### Ẩn nội dung mẫu: `"draft": true`
Mục nào trong `testimonials.json` và `partners.json` có dòng `"draft": true` thì **không hiện trên web đã đưa lên mạng**; khi chạy `npm run dev` thì vẫn hiện, có viền nét đứt và nhãn "Nháp" để xem trước bố cục. Điền nội dung thật (khi người đó đã đồng ý) rồi **xóa dòng `"draft": true`** để mục được hiện. Không còn nhận xét / đối tác nào hiện thì cả khối đó tự ẩn khỏi trang chủ. Hạng đối tác ít logo thì hiện tĩnh, căn giữa.

### Trưởng ban
Trong `departments.json`, `"leader": null` thì ẩn dòng "Trưởng ban". Điền tên (`"leader": "Nguyễn Văn B"`) để hiện.

### Tên tab trình duyệt
| Trang | Tên tab |
| --- | --- |
| Trang chủ | Olympia Sóc Sơn |
| `/wiki` | OSSPEDIA · Olympia Sóc Sơn |
| Danh sách OSSPEDIA | Mùa giải · OSSPEDIA, Thí sinh · OSSPEDIA, Các trường · OSSPEDIA, Sự kiện khác · OSSPEDIA |
| Trang mùa / hồ sơ / trường / sự kiện | Mùa {n} · OSSPEDIA, {họ tên} · OSSPEDIA, {tên trường} · OSSPEDIA, {tên sự kiện (ngắn)} · OSSPEDIA |
| Bài Human of OSS | {tên} · Human of OSS |
| Thư viện mùa / sự kiện | Thư viện ảnh mùa {n} · Olympia Sóc Sơn, Thư viện ảnh {tên sự kiện} · Olympia Sóc Sơn |
| Các trang còn lại | {tiêu đề trang} · Olympia Sóc Sơn |
| 404 | Không tìm thấy trang · Olympia Sóc Sơn |

### Ảnh và mô tả khi chia sẻ link
Thẻ chia sẻ nằm trong `index.html`; ảnh là `public/og-image.jpg` (1200×630). Vì web dùng địa chỉ có `#` (`/#/...`), **mọi trang đều chia sẻ cùng một ảnh và một mô tả**, không riêng từng trang. Facebook nhớ ảnh cũ: sau khi đổi ảnh hoặc mô tả, vào Sharing Debugger (`https://developers.facebook.com/tools/debug/`), dán địa chỉ web, bấm **Scrape Again** để làm mới.

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
