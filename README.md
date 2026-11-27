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
| `npm run kiem-tra-du-lieu` | Kiểm tra dữ liệu (chỉ đọc). **Tự chạy trước `npm run build`**, kể cả trên GitHub Actions; xem "Kiểm tra dữ liệu" ở mục 2 |
| `npm run tong-hop-dang-ky` | Tổng hợp số liệu đăng kí từ file CSV trong `du-lieu-rieng/`; xem "Cập nhật số liệu đăng kí" ở mục 2 |

**Tìm kiếm nhanh trên web:** bấm biểu tượng kính lúp trên thanh menu, hoặc gõ phím `/` hay `Ctrl + K` (máy Mac: `⌘ + K`) ở bất kỳ trang nào. Gõ không dấu cũng được (vd `duc`, `mua 4`, `da phuc`); dùng ↑ ↓ để chọn, Enter để mở, Esc để đóng.

---

## 2. Sửa nội dung: chỉ cần sửa file trong `src/data/`

| File | Nội dung |
| --- | --- |
| `site.json` | Tên, khẩu hiệu chính thức `slogan` (chân trang; đổi thì đổi cả ảnh chia sẻ `public/og-image.jpg`), `heroSlogans` (các slogan ở ảnh lớn trang chủ, mỗi lần tải trang hiện ngẫu nhiên 1 câu; thêm, bớt bằng cách sửa danh sách này; " / " là chỗ xuống dòng; để trống thì hiện `slogan`), 2 đoạn giới thiệu, fanpage, email, địa chỉ (`address`), bản đồ (`mapEmbedUrl` nhúng ở trang chủ, `mapLink` mở Google Maps ở footer), đường dẫn ảnh |
| `schools.json` | Các trường: `id`, `name`, `short` |
| `people.json` | Thí sinh: `id` (mã cố định, dùng làm đường dẫn), `name`, `school`, `gender` (`"nam"` / `"nu"`, hiện ở hồ sơ). Gồm cả vài người chỉ thi ĐLĐO (không thi OSS); những người này không có hồ sơ OSSPEDIA |
| `seasons.json` | Các mùa: ngày VL/CK, năm học, địa điểm, MC, luật ĐLĐO năm thứ, đối tượng, `notes`, `seededDraw`, `qualifyingNote` (tuỳ chọn: câu hiện ngay sau câu "Đối tượng tham gia…") |
| `qualifying.json` | Top 12 vòng loại mỗi mùa |
| `dang-ky.json` | Số liệu đăng kí dự thi từng mùa: `total` và số đếm theo `byGrade` (9 = học sinh THCS), `byGender`, `bySchool`; trường ngoài `schools.json` khai ở `otherSchools`. **Chỉ có số đếm, không đưa tên hay danh sách người đăng kí vào repo** |
| `matches.json` | Các trận Bán kết / Chung kết: điểm 4 phần thi, tổng, hạng, `advanced` (BK), `placement` (CK) |
| `olympia.json` | Thành tích Đường lên đỉnh Olympia. `ossSeason`: mùa OSS của thí sinh, `null` = không thi OSS. `beforeOss: true` = tham gia ĐLĐO trước khi dự thi OSS. Giải Nhất cuộc thi Quý được tính là 1 cầu truyền hình. `round` chỉ ghi phần đã biết (vd `"Tháng 2 - Quý 3"` khi chưa biết tuần), không biết gì thì `null`; **không ghi `"?"`** |
| `milestones.json` | Dòng thời gian (`person` là mã thí sinh). `kind`: `"oss"` = chấm tím, `"olympia"` = chấm hồng |
| `stats.json` | Những con số ấn tượng: mục `"manual": true` nhập tay, còn lại web tự tính |
| `departments.json` | 5 ban (Ban Tổ chức đứng đầu, `id` `to-chuc`): tên, `leaderTitle` ("Anh" / "Chị"), `leader` (Trưởng ban; `null` = ẩn dòng), `leaderPerson` (tuỳ chọn: id hồ sơ OSSPEDIA, có hồ sơ thì tên là link), nhiệm vụ `duties[]` (ảnh ban đặt theo `id`) |
| `events.json` | **Sự kiện khác** (OSSPEDIA, Thư viện, dòng thời gian). Xếp theo `stt` = theo `date` tăng dần. Trường: `id` (mã: đường dẫn, ảnh bìa, thư mục thư viện), `stt`, `name`, `aka?` (tên khác, vd "GNDN 2024"; tìm kiếm được), `type` (`rung-chuong-vang` / `toa-dam` / `giao-luu` / `dac-biet` / `cuoc-thi`), `year`, `schoolYear`, `date` + `endDate?`, `scope`, `organizer`, `role` (`to-chuc` / `dong-to-chuc` / `tham-gia`), `occasion?` (dòng "Sự kiện"), `hosts[]?` (dẫn chương trình), `winner?` (`{label, name, person?}`), `intro` (markdown), `awardPhoto?` (`{src, caption}`, ảnh trong `tran-dau/`), `photoKey` + `photoLabel` (tiền tố ảnh người chơi; nhãn nút ở hồ sơ), `sectionTitle?`, và theo `format`: `xep-hang` → `matches[]` (`{title, participants[]}`); `doi` → `teams[]` (`{name, result, members?[]}`); `nguoi-choi` → `participants[]`; `mua-thi` → `dataFile` (file dữ liệu bên dưới); `null` → chỉ có `participants[]` (dùng cho hồ sơ). Người tham gia: `name`, `person?`, `class?`, `school` **hoặc** `schoolName`, `result?`, `note?`. `result`: `giai-nhat` / `giai-nhi` / `giai-ba` / `giai-khuyen-khich` / `quan-quan` / `a-quan` / `quy-quan` / `tham-du` / `khach-moi` (3 loại đầu + Quán quân / Á quân / Quý quân có màu vàng-bạc-đồng). Khung thông tin ẩn dòng nào không có dữ liệu. Sự kiện **ngoài mọi thống kê OSS**. **Thêm một sự kiện Gặp nhau đầu năm:** sao chép một mục `gapnhau20xx`, đổi `id`, `stt` (và `photoKey`: `gndn26`…), `aka`, `name`, `date`, `year`, `schoolYear`, `intro`, rồi sửa các trận trong `matches` (người đứng theo vị trí); đặt ảnh bìa `bia/{id}-bia.jpg`, ảnh người chơi `thi-sinh/{photoKey}-…jpg` |
| `su-kien/doc3.json`, `doc4.json` | Dữ liệu cuộc thi dạng mùa thi (DAPHUC Olympia Championship), nối vào sự kiện qua `dataFile` (`"su-kien/doc3.json"`) với `format: "mua-thi"`. Cấu trúc: `id`, `qualifying[]` (`rank`, `name`, `class`, `school`, `score`, `ossPerson?`), `semifinals[]` (`no`, `results[]` theo vị trí đứng: `name`, `class`, `school`, `result`, `ossPerson?`), `final.results[]` (cùng dạng, `result` = `quan-quan` / `a-quan` / `quy-quan`). `ossPerson` = id hồ sơ OSSPEDIA nếu người đó cũng thi OSS (có hồ sơ thì tên là link). Không có điểm Bán kết / Chung kết. **Thêm DOC5:** thêm mục vào `events.json` (`format: "mua-thi"`, `dataFile: "su-kien/doc5.json"`, `photoKey: "doc5"`) và tạo `su-kien/doc5.json` cùng cấu trúc; trang tự hiện Vòng loại, 3 Bán kết, Chung kết. **Không** tính vào thống kê OSS |
| `contacts.json` | Người liên hệ, hiện ở footer (tên và chức vụ). Ô nào để trống `""` thì web tự ẩn |
| `humans.json` | Danh sách bài Human of OSS: `slug`, `stt` (số thứ tự, **không trùng nhau**; quyết định thứ tự trang và tên ảnh `NN.jpg`), `name`, `title` (vai trò), `headline` (tiêu đề bài), `quote` (câu trích ngắn trên thẻ), `date` (YYYY-MM-DD, **để `null` nếu chưa có**: thẻ chỉ ghi "Tập n"), `tranLienQuan` (tuỳ chọn: trận được kể trong bài, vd `[{ "mua": 3, "tran": "ck" }]`, `tran` = `vl` / `bk1` / `bk2` / `bk3` / `ck`; tạo link hai chiều giữa bài và trang mùa), `person` (tuỳ chọn: id người trong `people.json`; link hồ sơ OSSPEDIA chỉ hiện khi người đó có hồ sơ) |

### Cập nhật số liệu đăng kí (từ mùa 11)

Làm hoàn toàn trên máy, không phải gửi danh sách đi đâu.

1. Xuất tab danh sách đăng kí ra CSV, **gồm mọi mùa** (cả mùa cũ), với các cột `STT, Mùa, Họ và tên, Lớp, Trường, Giới tính`.
2. Đặt file vào thư mục `du-lieu-rieng/` ở gốc dự án (chưa có thì tự tạo). Chỉ để **một** file `.csv`; nhiều file thì chạy `npm run tong-hop-dang-ky -- du-lieu-rieng/ten-file.csv`.
3. Mùa mới thì thêm vào `seasons.json` trước (và `qualifying.json`, `people.json` nếu đã có top 12), rồi chạy `npm run tong-hop-dang-ky`.
4. Xem `git diff`, chạy `npm run kiem-tra-du-lieu`, rồi mới commit.

Script ghi lại `src/data/dang-ky.json` (chỉ số đếm) và điền `gender` còn thiếu cho người vào top 12 (không ghi đè `gender` đã có). Cuối cùng nó liệt kê những người vào top 12 không ghép được, ghép được nhiều dòng hoặc lệch giới tính để Kit tự xem. Script **dừng và không ghi gì** khi: thiếu cột, lớp không thuộc khối 9–12, giới tính khác "Nam" / "Nữ", trường không nhận ra (tên bắt đầu bằng "THCS" được xếp vào "Các trường THCS"; trường THPT mới thì khai thêm ở `otherSchools` trong `dang-ky.json`, và thêm màu `--ratio-<mã>` ở `index.css` cùng mã đó trong `ratio.ts`, nếu không sẽ tô xám), hoặc CSV thiếu một mùa đang có số liệu. Câu `_ghiChu` đầu file được giữ nguyên, muốn đổi số trong đó thì sửa tay.

> **Riêng tư:** danh sách gốc có họ tên, **không bao giờ đưa lên repo**. `du-lieu-rieng/` nằm trong `.gitignore`, và git hook từ chối commit nếu có file trong thư mục này (hook chạy sau `npm run prepare`; đừng dùng `git commit --no-verify` khi có file ở đó).

### Kiểm tra dữ liệu

`npm run kiem-tra-du-lieu` in từng lỗi theo dạng "file → mục: lý do". **LỖI làm build dừng** (web đang chạy giữ bản cũ):

| Lỗi | Nghĩa là | Cách sửa |
| --- | --- | --- |
| `… "x" không tồn tại` | Mã người / trường / mùa / trận / sự kiện / bài được nhắc tới nhưng không có (thường do gõ sai) | Sửa lại mã, hoặc thêm mục còn thiếu |
| `trùng …` / `có mục thiếu …` | Hai mục cùng `id`, `slug`, `stt` (hoặc cùng một người hai lần trong một trận / một mùa vòng loại), hay thiếu hẳn mã | Đặt mã riêng |
| `ô điểm … phải là số hoặc null` | Điểm gõ dạng chữ hoặc bỏ mất ô | Ghi số (không có dấu ngoặc kép), không có điểm thì `null` |
| `giá trị là "?"`, `"round" còn dấu "?"` | Thông tin chưa biết bị ghi bằng "?" | Ghi `null`, hoặc chỉ giữ phần đã biết |
| `Chung kết phải có đúng 1 Quán quân` | Trận Chung kết có 0 hoặc nhiều `"placement": "vo-dich"` | Sửa `placement` |
| `trích dẫn không còn trong bài` | Câu ở `testimonials.json` không khớp nguyên văn bài Human of OSS (không tính emoji và dấu kết câu) | Chép lại đúng câu trong bài |
| `total = … nhưng tổng … = …`, `top 12 có … nhưng đăng kí chỉ có …` | `dang-ky.json`: mỗi mùa `total` phải bằng tổng theo khối, giới tính, trường; nhóm hợp lệ (khối 9–12, trường trong `schools.json` / `otherSchools`), mùa có thật và không lặp; top 12 không nhiều hơn số đăng kí cùng nhóm | Sửa số trong `dang-ky.json` (hoặc kiểm lại lớp / giới tính / trường của top 12) |
| `"gender" phải là "nam" hoặc "nu"` | `people.json` ghi giới tính khác 2 giá trị này | Sửa lại; chưa biết thì bỏ hẳn trường `gender` |
| `Chung kết thiếu "placement" hợp lệ`, `… người vào Chung kết nhưng top 12 chỉ có …` | `matches.json`: mỗi dòng Chung kết phải có `placement`; một trường không thể vào Chung kết nhiều hơn số người trong top 12 cùng mùa (nếu không, thanh 5 chặng ở trang trường bị âm) | Sửa `placement` hoặc `school` ở `matches.json` / `qualifying.json` |
| `sai cú pháp JSON` | Thiếu / thừa dấu phẩy, ngoặc | Sửa file được nêu tên |

**CẢNH BÁO không làm dừng build:** ảnh được nhắc tới (ảnh trao giải, ảnh trong bài, `tieu-diem-anh.json`, ảnh trang Giới thiệu) mà chưa có file (web dùng ảnh thay thế), mùa có trong `seasons.json` mà chưa có trong `dang-ky.json`, người từng vào top 12 chưa có `gender`, hoặc bài trong `humans.json` chưa có file `.md`.

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
| `public/images/bia/{mã sự kiện}-bia.jpg` | Ảnh bìa sự kiện (`events.json` → `id`), vd `rcv2023-bia.jpg`. Ưu tiên: ảnh bìa → ảnh trao giải → ảnh đầu thư viện sự kiện → nền tông màu có icon loại | ngang 3:2 | ~1500×1000 |
| `public/images/thu-vien/su-kien/{mã sự kiện}/<tên tùy ý>.jpg` | **Ảnh Thư viện sự kiện** (`.jpg`, `.jpeg`, `.png`, `.webp`), xếp tên kiểu tự nhiên; thứ tự: ảnh bìa → ảnh trao giải (`awardPhoto`) → ảnh trong thư mục | nên ngang | < 400 KB |
| `public/images/thi-sinh/{photoKey}-{slug họ tên}-{mã trường}.jpg` | Ảnh người chơi tại sự kiện (vd `truyenlua2023-le-tra-my-ss.jpg`, `allstars-chu-duc-huy-ss.jpg`), chỉ cho người chơi có trường trong `schools.json`. DOC3: `doc3-{slug}-{mã trường}.jpg`. Hiện ở trang sự kiện và nút ảnh ở hồ sơ | dọc 3:4 | ~600×800 |
| `public/images/human-of-oss/{stt 2 chữ số}.jpg` | Chân dung Human of OSS, theo `stt` trong `humans.json` (vd `01.jpg`). Thư mục `images/humans/` không còn dùng | dọc | ~800×1000 |
| `public/images/bia/oss{n}-bia.jpg` | Ảnh bìa mùa (logo), xem mục "Ảnh bìa mùa" | **vuông 1:1** | ~1254×1254 |
| `public/images/doi-tac/{id}.svg` hoặc `.png` | Logo đối tác (nền trong suốt, giữ màu gốc), tên file = `id` trong `partners.json`: `phoi-hop-1`…`phoi-hop-2`, `tai-tro-1`…`tai-tro-6`, `dong-hanh-1`…`dong-hanh-6`. Đổi nhóm: xem mục "Thêm / sửa một đơn vị đồng hành" | tự do | SVG, hoặc PNG ngang ~600 px |
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
`public/images/bia/oss{n}-bia.jpg` (**vuông 1:1**, ~1254×1254; web luôn hiện trọn ảnh, không cắt). Ưu tiên: ô mùa ở Thư viện = ảnh bìa → ảnh đầu thư viện → giữ chỗ; thư viện mùa = ảnh bìa đứng đầu, rồi ảnh trận đấu, rồi `thu-vien/mua-{n}/`; thẻ mùa và dải mờ đầu trang mùa (OSSPEDIA) = ảnh bìa → ảnh Chung kết. Ảnh lớn trang chủ vẫn dùng ảnh Chung kết.

### Ảnh bị cắt mất mặt? Chỉnh tiêu điểm
Ảnh cắt khung (`object-fit: cover`) lấy vị trí mặc định: ảnh người (`thi-sinh`, `human-of-oss`, `nhan-xet`) `50% 25%`, ảnh ngang (`tran-dau`, `bia`, `thu-vien`, `cot-moc`, ảnh lớn) `50% 35%`. Muốn chỉnh riêng một ảnh, thêm vào `src/data/tieu-diem-anh.json` (đường dẫn tính từ `images/`):
```json
{ "thi-sinh/s8-nguyen-huu-phu-an-ss.jpg": "50% 10%" }
```
Giá trị thứ hai nhỏ hơn = lấy phần cao hơn của ảnh (0% = sát mép trên, 100% = sát mép dưới).

### Thu nhỏ ảnh (`npm run thu-nho-anh`)
Chỉ chạy trên macOS (dùng `sips`). `npm run thu-nho-anh -- --thu` in danh sách ảnh sẽ xử lý, không sửa file; `npm run thu-nho-anh` thu nhỏ thật (ghi đè đúng file cũ, PNG giữ PNG, bỏ qua ảnh mẫu). Không bao giờ phóng to; JPEG chất lượng 80; JPEG nặng hơn 400KB mà chưa vượt giới hạn cạnh thì chỉ nén lại.

**Tự thu nhỏ khi commit:** thư mục `.githooks/` có hook `pre-commit`: mỗi lần `git commit`, ảnh được thêm / sửa trong `public/images/**` (và `public/logo-oss.png`) tự được thu nhỏ rồi đưa lại vào commit, kèm dòng "Đã thu nhỏ N ảnh (X MB → Y MB)". Không thu nhỏ được (không phải macOS, script lỗi) thì chỉ cảnh báo, vẫn commit. Bỏ qua một lần: `git commit --no-verify`.
- Hook được bật bằng `npm run prepare` (đặt `core.hooksPath` thành `.githooks`); `npm install` tự chạy lệnh này. **Chép dự án sang máy khác thì chạy `npm run prepare` một lần.**
- Thu nhỏ từng file bằng tay: `npm run thu-nho-anh -- public/images/a.jpg public/images/b.png` (chỉ xử lý các file đó; thêm `--thu` để chỉ xem).

| Thư mục | Cạnh dài tối đa |
| --- | --- |
| `thi-sinh/`, `human-of-oss/`, `nhan-xet/`, `ban/` | 1200px |
| `bia/`, `tran-dau/`, `thu-vien/**`, `cot-moc/`, `hero/`, `about/` | 1600px |
| `truong/`, `doi-tac/`, `logo-oss.png` | 600px |

### Xem ảnh nào còn thiếu

```bash
npm run anh-con-thieu
```

Lệnh in từng nhóm (thí sinh theo mùa, ảnh Olympia, Quán quân Hall of Fame, ảnh bìa mùa, trận đấu, cột mốc, nhận xét, đơn vị phối hợp / tài trợ / đồng hành, Human of OSS, các ban, logo trường, ảnh trang chủ / giới thiệu, logo OSS) kèm dòng "đã có x / y" và **đường dẫn đầy đủ của từng file còn thiếu** (kèm tên người / trận để dễ nhận ra). Lệnh chỉ đọc, không sửa file nào.

**Ảnh mẫu giữ chỗ:** nếu một file ảnh có chuỗi `OSS-ANH-MAU` trong 4 KB đầu (vd nằm trong phần chú thích của file SVG, hoặc trong metadata của JPG) thì web và `npm run anh-con-thieu` coi như **chưa có ảnh**: web vẫn hiện ảnh giữ chỗ, lệnh vẫn báo thiếu. Khi thay bằng ảnh thật (không còn chuỗi này) thì ảnh tự được tính là đã có.

Ảnh thí sinh, trận đấu, cột mốc, Human of OSS **không cần khai báo trong JSON**: đặt đúng tên file là hiện. Chưa có ảnh thì web hiện chữ viết tắt tên (người), logo OSS (cột mốc) hoặc không hiện gì (ảnh trận đấu; không còn dải giữ chỗ). Thư mục cũ `public/images/humans/` không còn dùng, có thể xóa.

**Link tới đúng trận / đúng mục:** `/#/wiki/cuoc-thi/mua-6?tran=bk3` (`vl`, `bk1`, `bk2`, `bk3`, `ck`; dùng được cả cho trang DAPHUC, vd `/#/wiki/su-kien/doc3?tran=ck`); `/#/bang-vang?muc=ky-luc&o=total` (`muc` = `hall-of-fame` / `olympia` / `ky-luc` / `chung-ket-lien-tiep`; `o` = `vl` / `kd` / `vcnv` / `tt` / `vd` / `total`).

**Link danh sách thí sinh đã lọc:** bộ lọc nằm trên địa chỉ trang, vd `/#/wiki/thi-sinh?mua=4&giai=a-quan` (Mùa 4, Á quân), `?truong=soc-son`, `?giai=quan-quan&sap-xep=mua`. Các khóa: `q` (tên), `truong` (id trường trong `schools.json`), `mua` (số), `giai` (`quan-quan` | `a-quan` | `quy-quan` | `top-12`), `sap-xep` (`ten` | `thanh-tich` | `mua`).

Mẹo: nén ảnh dưới ~400 KB (squoosh.app) để web tải nhanh. Ảnh chữ O-S-S nên là ảnh dọc, nhiều màu sắc.

---

### Thêm một nhận xét (khối "Cảm nhận về Olympia Sóc Sơn" ở trang chủ)

> Chỉ đăng nhận xét khi người đó đã đồng ý.

Các nhận xét là **trích nguyên văn từ bài Human of OSS**. Mở `src/data/testimonials.json`, thêm một mục (nhớ dấu phẩy giữa các mục):
```json
{
  "id": "tran-hai-linh",
  "name": "Trần Hải Linh",
  "role": "Quán quân OSS3",
  "humanSlug": "tran-hai-linh",
  "quote": "Câu chép đúng nguyên văn từ bài."
}
```
`humanSlug` = `slug` của bài trong `humans.json` (tạo link "Đọc bài phỏng vấn"). `role`, `position` (chức danh hiện tại) có thể bỏ, bỏ thì dòng đó ẩn; xuống đoạn bằng `\n\n`; `quote` để trống thì mục không hiện. Thứ tự trên web = thứ tự trong file. **Ảnh tự lấy** từ hồ sơ OSSPEDIA của người trong bài (`person` trong `humans.json`); không có hồ sơ thì hiện chữ viết tắt. Thư mục `images/nhan-xet/` không còn dùng.

### Thêm / sửa một đơn vị đồng hành (khối "Đồng hành cùng Olympia Sóc Sơn")

> Chỉ đăng logo khi đơn vị đó đã đồng ý.

Các đơn vị chia 3 nhóm, hiện thành 3 hàng trên trang chủ theo thứ tự **Đơn vị phối hợp tổ chức** (`phoi-hop`, ô lớn nhất) → **Nhà tài trợ** (`tai-tro`) → **Đơn vị đồng hành** (`dong-hanh`); nhóm nào không có đơn vị thì ẩn cả hàng. Logo đứng yên, căn giữa, xuống dòng khi hẹp. Dòng dưới tiêu đề tự đếm "{n} đơn vị đã đồng hành cùng Olympia Sóc Sơn." Mặc định có 14 mục giữ chỗ: `phoi-hop-1`…`phoi-hop-2`, `tai-tro-1`…`tai-tro-6`, `dong-hanh-1`…`dong-hanh-6`.

1. Mở `src/data/partners.json`, sửa mục giữ chỗ hoặc thêm mục mới:
   ```json
   { "id": "tai-tro-1", "group": "tai-tro", "name": "Công ty ABC", "role": "Bảo trợ truyền thông", "url": "https://abc.vn" }
   ```
   `group` là `"phoi-hop"`, `"tai-tro"` hoặc `"dong-hanh"`. `role` (tuỳ chọn) là dòng chữ nhỏ dưới logo. `url` (tuỳ chọn) làm logo thành link mở tab mới. Xóa các mục giữ chỗ không dùng.
2. Logo: `public/images/doi-tac/{id}.svg` hoặc `.png` (tên file = `id`), nền trong suốt. Chưa có logo thì ô hiện tên đơn vị.
3. **Đổi nhóm một đơn vị**: đổi `"group"`, rồi đổi `id` cho hợp nhóm mới (vd `tai-tro-3` → `dong-hanh-7`) và đổi tên file logo theo `id` mới. Thứ tự trong hàng = thứ tự trong file.
4. Chạy lại `npm run dev`.

### Thêm một câu chuyện Human of OSS

1. Chép `src/content/human-of-oss/_mau.md` thành `src/content/human-of-oss/<slug>.md` (vd `nguyen-van-a.md`). File bắt đầu bằng `_` không hiện trên web.
2. Thêm 1 mục vào `src/data/humans.json` với cùng `slug` (mẫu có sẵn ở đầu file `_mau.md`): `slug`, `stt`, `name`, `title` (vai trò), `headline` (tiêu đề bài), `quote` (câu trích ngắn), `date`, `person` (tuỳ chọn, id thí sinh: có thì cuối bài có link hồ sơ OSSPEDIA và dùng ảnh thí sinh khi chưa có ảnh riêng). **`stt` = số tiếp theo chưa dùng** (1, 2, 3...), không được trùng; trùng thì build báo lỗi.
3. Ảnh chân dung (nếu có): `public/images/human-of-oss/{stt 2 chữ số}.jpg` (vd `stt` là 2 thì `02.jpg`); chưa có thì dùng ảnh thí sinh của `person`, không có nữa thì ảnh giữ chỗ. Trang danh sách xếp thẻ ngang so le: tập lẻ ảnh bên trái, tập chẵn ảnh bên phải.
4. Viết bài trong file `.md`, rồi chạy lại `npm run dev`. Trang Human of OSS luôn có 10 ô; mỗi câu chuyện mới thay một ô "Câu chuyện sắp ra mắt".

### Nhận xét và đối tác luôn hiện
Khối "Cảm nhận" và "Đồng hành cùng Olympia Sóc Sơn" ở trang chủ luôn hiện (không còn cơ chế `draft`). Chưa có logo thì ô hiện tên.

### Trưởng ban
Trong `departments.json`: `leaderTitle` ("Anh" / "Chị") + `leader` hiện thành "Trưởng ban: Anh Nguyễn Việt Thành"; `"leader": null` thì ẩn dòng. Thêm `leaderPerson` (id hồ sơ) để tên thành link tới hồ sơ OSSPEDIA.

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
Thẻ chia sẻ nằm trong `index.html`; ảnh là `public/og-image.jpg` (1200×630). Vì web dùng địa chỉ có `#` (`/#/...`), **mọi trang đều chia sẻ cùng một ảnh và một mô tả**, không riêng từng trang. Facebook nhớ ảnh cũ: sau khi đổi ảnh hoặc mô tả, vào Sharing Debugger (`https://developers.facebook.com/tools/debug/`), dán địa chỉ web, bấm **Scrape Again** để làm mới. Khẩu hiệu được in sẵn trong ảnh này, nên đổi `slogan` thì phải thay ảnh (giữ nguyên tên file). Messenger và Zalo cũng nhớ ảnh cũ một thời gian.

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
