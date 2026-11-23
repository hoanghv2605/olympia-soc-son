# Yêu cầu v0.16 (Kit đã duyệt): Human of OSS 6–9, nhập phiếu nội dung, sự kiện đầy đủ, DOC3 và DOC4

Đọc `CLAUDE.md` trước. **Trình bày kế hoạch trước khi sửa.** Làm 4 đợt, xong mỗi đợt chạy `npm run build`, `npm run typecheck` rồi `git commit`:
- **Đợt 1:** mục 1, 2, 3, commit "v0.16 đợt 1".
- **Đợt 2:** mục 4, 5, 6, 7, commit "v0.16 đợt 2".
- **Đợt 3:** mục 8, 9, 10, commit "v0.16 đợt 3".
- **Đợt 4:** mục 11, 12, 13, commit "v0.16 đợt 4".

Không thêm thư viện npm. Không sửa dữ liệu thi đấu OSS. Ảnh mẫu (`OSS-ANH-MAU`) vẫn coi là chưa có ảnh. Mọi chuyển động tôn trọng `prefers-reduced-motion`. Tiêu đề viết thường như câu; dòng có chữ in hoa giữ `line-height` ≥ 1.35.

Kit đã giải nén sẵn vào dự án:
- 4 bài Human of OSS trong `src/content/human-of-oss/`: `tran-kim-cuong.md`, `nguyen-doan-hong-thai.md`, `nguyen-sy-hoang.md`, `le-xuan-tung.md` (ảnh `human-of-oss/06.jpg` … `09.jpg` đã có);
- `docs/du-lieu-v0.16/events.json`, `doc3.json`, `doc4.json` (dữ liệu đã kiểm, **không sửa nội dung**);
- ảnh mẫu `bia/gapnhau2023-bia.jpg`, `bia/doc4-bia.jpg` và 2 thư mục rỗng `thu-vien/su-kien/gapnhau2023/`, `thu-vien/su-kien/doc4/`.

Kit đã tự thêm: ảnh người chơi tại sự kiện trong `thi-sinh/` (mục 9) và 6 ảnh trao giải trong `tran-dau/` (mục 8).

**Kiểm tra id:** mọi `person` / `ossPerson` trong 3 file dữ liệu phải có trong `people.json`; thiếu thì báo lại, không tự thêm.

---

## 1. Human of OSS: tập 6–9 và cập nhật tập 2–5

- 4 bài mới **giữ nguyên nội dung**, cùng định dạng các tập trước. `le-xuan-tung.md` mở đầu bằng một danh sách 3 dòng: kiểm tra trang bài hiển thị danh sách gọn (có dấu đầu dòng); nếu CSS bài viết đang bỏ kiểu danh sách thì thêm lại.
- Sửa các mục đã có trong `humans.json`:

| stt | `date` | `title` |
| --- | --- | --- |
| 2 | 2019-12-26 | Founder Olympia Sóc Sơn |
| 3 | 2020-03-25 | MC Olympia Sóc Sơn mùa 2, 3, 4 |
| 4 | 2021-11-09 | (giữ) Quán quân OSS3 |
| 5 | 2022-08-23 | Co-founder Olympia Sóc Sơn |

- Thêm sau tập 5:

```json
{ "slug": "tran-kim-cuong", "stt": 6, "name": "Trần Kim Cương", "title": "Á quân OSS4, MC OSS từ mùa 5 đến nay", "headline": "Chàng MC điển trai của OSS", "quote": "Những thế hệ sau này của ngôi nhà OSS vẫn cháy hết mình với đam mê được chinh phục đỉnh núi tri thức.", "date": "2023-08-25", "person": "tran-kim-cuong" },
{ "slug": "nguyen-doan-hong-thai", "stt": 7, "name": "Nguyễn Đoàn Hồng Thái", "title": "Á quân OSS5, OSS6", "headline": "Bài toán nào khó, đã có Thái lo", "quote": "Chông gai, đáng nhớ, tự hào.", "date": "2024-09-22", "person": "nguyen-doan-hong-thai" },
{ "slug": "nguyen-sy-hoang", "stt": 8, "name": "Nguyễn Sỹ Hoàng", "title": "Quý quân OSS5, OSS6", "headline": "Người hùng thầm lặng của OSS", "quote": "Mỗi khi nhắc đến OSS, mình lại nhớ về một gia đình đầy niềm vui và sự ấm áp.", "date": "2024-09-23", "person": "nguyen-sy-hoang" },
{ "slug": "le-xuan-tung", "stt": 9, "name": "Lê Xuân Tùng", "title": "Quý quân OSS4", "headline": "Nhiếp ảnh gia có 1-0-2 của OSS", "quote": "Bản lĩnh từ sân chơi OSS cũng giúp anh có tâm lý ổn định và vững vàng hơn.", "date": "2025-08-18", "person": "le-xuan-tung" }
```

- `HUMAN_SLOTS` giữ 10: 9 thẻ thật (so le tiếp nối), 1 ô chờ "Tập 10". Khi số tập thật ≥ `HUMAN_SLOTS` thì không còn ô chờ (kiểm tra logic không âm).

## 2. Hồ sơ thí sinh ↔ Human of OSS

- Khung thông tin bên phải của hồ sơ: người có tập Human of OSS (`person` trỏ tới) có thêm dòng **"Human of OSS"** (icon `PiNewspaper`): link "Tập {stt}: “{headline}”" tới bài. Nhiều tập thì liệt kê theo `stt`.
- Mong đợi: Nguyễn Thanh Hà (1), Trần Hải Linh (4), Trần Kim Cương (6), Nguyễn Đoàn Hồng Thái (7), Nguyễn Sỹ Hoàng (8), Lê Xuân Tùng (9).

## 3. Tìm kiếm chung

- Thêm các tập Human of OSS: tìm theo `name`, `headline`, `title`; icon `PiNewspaper`; dòng phụ "Human of OSS · Tập {stt}"; nhóm **Human of OSS** đặt sau nhóm Sự kiện.
- Sự kiện tìm được cả theo `aka` (vd "GNDN 2024", "RCV 2023").
- Câu gợi ý trong hộp tìm kiếm: "Gõ tên thí sinh, mùa (vd: mùa 4), tên trường, sự kiện hoặc Human of OSS".

---

## 4. Lời mở đầu trang mùa OSS (đợt 2)

- Tìm chỗ sinh câu đầu đang ghi "… là năm thứ {n} cuộc thi Olympia Sóc Sơn dành cho học sinh THPT tại Sóc Sơn." Đổi thành:

> **Olympia Sóc Sơn mùa {n}**, thường được gọi tắt là **OSS{n}**, là mùa giải {thứ tự} của cuộc thi Olympia Sóc Sơn, cuộc thi kiến thức dành cho học sinh Trung học Phổ thông do trường THPT Sóc Sơn phối hợp với Olympia Sóc Sơn tổ chức.

- {thứ tự}: 1 "đầu tiên", 2 "thứ hai", 3 "thứ ba", 4 "thứ tư", 5 "thứ năm", 6 "thứ sáu", 7 "thứ bảy", 8 "thứ tám", 9 "thứ chín", 10 "thứ mười" (mùa sau 10: "thứ {số}").
- Phần câu sau (ngày vòng loại, ngày và địa điểm Chung kết) giữ nguyên.
- `seasons.json`, **chỉ mùa 9 và mùa 10**: trong `eligibility` đổi "trên địa bàn xã Sóc Sơn" thành "trên địa bàn huyện Sóc Sơn cũ".

## 5. Cơ cấu tổ chức (đợt 2)

- `departments.json`, dùng đúng tên trường hiện có; thêm 2 trường mới `leaderTitle` ("Anh" / "Chị") và `leaderPerson` (tuỳ chọn, id hồ sơ):

| Ban | `leaderTitle` | `leader` | `leaderPerson` |
| --- | --- | --- | --- |
| Ban Tổ chức | Anh | Nguyễn Việt Thành | `nguyen-viet-thanh` |
| Ban Chuyên môn | Anh | Nghiêm Trung Đức | `nghiem-trung-duc` |
| Ban Kĩ thuật | Anh | Mầu Tuấn Kiệt | `mau-tuan-kiet` |
| Ban Truyền thông | Chị | Nguyễn Thu Hà | — |
| Ban Hậu cần | Chị | Lê Thị Duyên | — |

- Hiển thị "Trưởng ban: {leaderTitle} **{leader}**"; có `leaderPerson` và người đó có hồ sơ thì phần tên là link hồ sơ (máy tính và điện thoại).
- Nhiệm vụ (thay toàn bộ, hiển thị dạng danh sách như hiện tại):
  - **Ban Tổ chức:** Xây dựng kế hoạch, điều phối và giám sát toàn bộ hoạt động của cuộc thi. · Quản lý nhân sự, phân công nhiệm vụ và phối hợp giữa các ban. · Làm việc với Ban Giám hiệu, nhà trường, đối tác và xử lý các vấn đề phát sinh.
  - **Ban Chuyên môn:** Xây dựng, biên soạn, thẩm định và quản lý ngân hàng câu hỏi. · Điều hành nội dung chuyên môn, chấm điểm và giải quyết khiếu nại liên quan đến câu hỏi, đáp án.
  - **Ban Kĩ thuật:** Thiết lập, vận hành và kiểm soát hệ thống kỹ thuật phục vụ thi đấu. · Quản lý phần mềm, trình chiếu, âm thanh, ánh sáng, thiết bị ghi hình và hệ thống tính điểm. · Kiểm thử hệ thống, giám sát vận hành và xử lý sự cố kỹ thuật trong cuộc thi.
  - **Ban Truyền thông:** Xây dựng kế hoạch truyền thông, quản lý các kênh thông tin và hình ảnh OSS. · Thiết kế ấn phẩm, sản xuất nội dung, chụp ảnh, quay phim và đưa tin về cuộc thi. · Quảng bá cuộc thi, kết nối cộng đồng thí sinh, cựu thí sinh và khán giả.
  - **Ban Hậu cần:** Chuẩn bị địa điểm, cơ sở vật chất, trang thiết bị và vật dụng phục vụ cuộc thi. · Phụ trách đón tiếp, hướng dẫn thí sinh, khách mời và hỗ trợ công tác tổ chức tại hiện trường. · Quản lý vật tư, quà tặng, giải thưởng, ăn uống và các nhu cầu hậu cần khác.

  (Dấu " · " chỉ ngăn cách các ý trong brief: mỗi ý là một dòng của danh sách.)

## 6. Liên hệ và con số (đợt 2)

- Footer "Liên hệ" thành **4 người**, theo thứ tự:
  1. Cô Nguyễn Thị Chung – Bí thư Đoàn trường THPT Sóc Sơn
  2. Anh Nguyễn Việt Thành – Chủ nhiệm Olympia Sóc Sơn
  3. Chị Lê Trà My – Phó Trưởng ban Tổ chức Olympia Sóc Sơn
  4. Anh Nghiêm Trung Đức – Trưởng Ban Chuyên môn
- Email, fanpage, địa chỉ giữ nguyên. Footer vẫn gọn ở 1280px và 390px với 4 người.
- "Những con số ấn tượng" (Về chúng tôi): "400+ thí sinh đăng kí dự thi" → **"450+"**.

## 7. Cảm nhận và Đối tác hiện lại (đợt 2)

- Bỏ cơ chế `draft` của v0.15: xoá trường `draft` khỏi `testimonials.json` và `partners.json`, bỏ phần lọc và nhãn "Nháp".
- Khối **Cảm nhận** và **Đối tác đồng hành** ở trang chủ **luôn hiện**, kể cả khi còn nội dung mẫu (như trước v0.15). Giữ cách hiện tĩnh, căn giữa cho hạng có ít logo của v0.15.
- Kit sẽ tự thêm logo vào `doi-tac/` theo tên có sẵn (`vang-1.png` …); không cần sửa `partners.json`.

---

## 8. Sự kiện: dữ liệu mới và trang sự kiện (đợt 3)

### 8a. Dữ liệu
- Thay `src/data/events.json` bằng `docs/du-lieu-v0.16/events.json` (10 sự kiện; thêm `gapnhau2023` và `doc4`, các id cũ giữ nguyên nên link không đổi). Cập nhật kiểu dữ liệu. Trường mới hoặc đổi:

| Trường | Ý nghĩa |
| --- | --- |
| `aka` | Tên khác (vd "GNDN 2024") |
| `date`, `endDate` | ngày bắt đầu, ngày kết thúc (tuỳ chọn) |
| `occasion` | dòng "Sự kiện" trong khung thông tin (AllStars) |
| `hosts` | danh sách dẫn chương trình |
| `winner` | `{label, name, person?}`: dòng "{label}" trong khung thông tin |
| `awardPhoto` | `{src, caption}`: ảnh trao giải trong `tran-dau/` |
| `matches` | các trận: `{title, participants[]}` (thay `participants` cũ của Truyền lửa) |
| `teams` | các đội (RCV 2024): `{name, result, members?[]}` |
| `participants` | người tham gia không hiện thành bảng trên trang (RCV 2023), hoặc người chơi AllStars |
| `result` | **thay `rank`**: `giai-nhat`, `giai-nhi`, `giai-ba`, `giai-khuyen-khich`, `quan-quan`, `a-quan`, `quy-quan`, `tham-du`, `khach-moi` |
| `dataFile` | file dữ liệu của sự kiện dạng mùa thi (DOC3, DOC4) |

- Nhãn kết quả: Giải Nhất · Giải Nhì · Giải Ba · Giải Khuyến khích · Quán quân · Á quân · Quý quân · Tham dự · Khách mời. Màu: Nhất / Quán quân vàng, Nhì / Á quân bạc, Ba / Quý quân đồng; ba loại còn lại không tô màu.
- Bỏ `participantLabel` (AllStars giờ dùng `result: "khach-moi"`).
- **Thứ tự sự kiện ở mọi nơi: theo `date` tăng dần** (file đã xếp sẵn, `stt` khớp thứ tự đó). Số liệu ô OSSPEDIA tự thành "10 sự kiện · 2023–2026"; 3 chip đầu tự đổi theo thứ tự mới.
- `schoolYear` hiển thị bằng gạch dài như mọi chỗ khác.

### 8b. Khung thông tin trang sự kiện
Các dòng theo thứ tự, **dòng nào không có dữ liệu thì ẩn** (bỏ chữ "Đang cập nhật"): Tên khác · Loại · Sự kiện (`occasion`) · Năm học · Thời gian (`date`, hoặc "19/05/2024 – 25/05/2024" khi có `endDate`) · Phạm vi · Đơn vị tổ chức · Vai trò của OSS · Dẫn chương trình (`hosts` nối bằng dấu phẩy) · {`winner.label`} (`winner.name`, link nếu có hồ sơ). Với `format: "mua-thi"`, dòng "Quán quân" lấy từ dữ liệu Chung kết (mục 11).

### 8c. Phần riêng theo `format`
- **`xep-hang`** (Truyền lửa, Gặp nhau đầu năm): mỗi trận một bảng như bảng Truyền lửa hiện tại (Thí sinh kèm ảnh tròn, Lớp, Trường; màu dòng theo `result`; thứ tự = vị trí đứng). Có 1 trận: `h2` = tên trận ("Trận đấu giao hữu"). Nhiều trận: `h2` "Các trận giao hữu", mỗi trận một `h3` ("Trận 1", "Trận 2"…). Nút ⓘ một lần cho cả phần.
- **`doi`** (RCV 2024): `h2` = `sectionTitle` ("Chung kết"); bảng 2 cột **Đội**, **Kết quả**, theo thứ tự trong file, màu dòng như trên. Không hiện thành viên.
- **`nguoi-choi`** (AllStars): giữ như hiện tại.
- **`null`** (RCV 2023): không có bảng; `participants` chỉ dùng cho hồ sơ (mục 9).
- **Ảnh trao giải** (`awardPhoto`, chỉ khi là ảnh thật): đặt ngay sau phần riêng (hoặc sau Giới thiệu nếu không có phần riêng), cùng kiểu ảnh Chung kết ở trang mùa (có chú thích `caption`, bấm mở `Lightbox`).
- Giới thiệu (`intro`) là markdown, có đoạn và chữ nghiêng.

## 9. Hồ sơ thí sinh: ảnh và bảng sự kiện (đợt 3)

### 9a. Người tham gia
Một người "tham gia" sự kiện khi có `person` (hoặc `ossPerson` ở DOC) trong: `matches[].participants`, `participants`, `teams[].members`, hoặc vòng loại / bán kết / chung kết của file DOC.

### 9b. Nút chọn ảnh
- Mỗi sự kiện có `photoKey` mà người đó tham gia → nút `photoLabel`, ảnh `thi-sinh/{photoKey}-{slug họ tên}-{mã trường}.jpg`. Thứ tự: các nút mùa, nút O, rồi các sự kiện theo ngày. Ẩn / hiện theo đúng quy tắc của các nút hiện có. Nút xuống dòng gọn khi nhiều.
- Nhãn mới: "GNDN '23", "GNDN '24", "GNDN '25", "GNDN '26", "RCV 2024", "DOC3", "DOC4" (cùng "Truyền lửa", "AllStars").
- Kết quả mong đợi (43 ảnh): mỗi người có đúng các nút như danh sách `anh-con-thieu` ở mục 13 in ra; ví dụ Nghiêm Trung Đức: Mùa 8 · Mùa 9 · O26 · DOC3 · GNDN '25; Lê Trà My: Mùa 6 · Mùa 7 · O24 · GNDN '23 · Truyền lửa · AllStars.

### 9c. Bảng "Sự kiện khác"
- Một dòng cho mỗi sự kiện người đó tham gia, theo ngày. Cột: **Sự kiện** (`shortName ?? name`, link) · **Năm** (năm học) · **Kết quả**: `ResultBadge` cho 6 kết quả có màu, chữ thường cho 3 kết quả còn lại, kèm ngữ cảnh:
  - nhiều trận: "Giải Nhất (Trận 2)";
  - đội: "Giải Khuyến khích (đội THE NEVER SETTING SUN)";
  - DOC: vào Chung kết thì lấy kết quả Chung kết; không thì kết quả Bán kết kèm "(Bán kết {n})".
- Ví dụ: Lê Trà My có 4 dòng (GNDN 2023 · Giải Ba (Trận 2); RCV 2023 · Quán quân; Truyền lửa · Giải Nhất; AllStars · Khách mời). Mầu Tuấn Kiệt: GNDN 2023 · Giải Nhất (Trận 1); RCV 2023 · Tham dự; Truyền lửa · Giải Ba. Đỗ Ngô Thiện Nhân: DOC3 · Á quân; GNDN 2025 · Giải Nhất (Trận 3).

## 10. Sự kiện lên dòng thời gian (đợt 3)

### 10a. "Những cột mốc đáng nhớ" (Về chúng tôi)
- Mọi sự kiện có ngày được tự đưa vào dòng thời gian (không chép vào `milestones.json`), theo ngày **`endDate ?? date`**, đúng nhóm năm.
- Kiểu mới **"Sự kiện khác"** cạnh 2 kiểu hiện có, màu riêng (vd tông `teal`, đủ tương phản ở chế độ sáng / tối), thêm vào chú thích màu (chỉ hiện khi có ít nhất 1 sự kiện).
- Nội dung dòng: tên sự kiện (đậm, link trang sự kiện); dòng phụ "{nhãn loại} · {phạm vi}" (bỏ phần trống). Nút xem ảnh: ảnh trao giải nếu có, không thì ảnh bìa, chỉ khi là ảnh thật.

### 10b. Dòng thời gian trong hồ sơ
- Thêm dòng cho mỗi sự kiện người đó tham gia, cùng kiểu dòng hiện có: "{tên} **giành Giải Nhất**", "{tên} **trở thành Quán quân**", "{tên} **tham dự**"… theo `result`; dòng phụ là tên sự kiện (link). Ngày = `endDate ?? date`.

---

## 11. DOC3 và DOC4: trang như mùa OSS (đợt 4)

### 11a. Dữ liệu
- `docs/du-lieu-v0.16/doc3.json` và `doc4.json`: `qualifying` (top 12: `rank`, `name`, `class`, `school`, `score`, `ossPerson?`), `semifinals` (3 trận, mỗi trận `no` và `results` theo vị trí đứng), `final.results`. Không có điểm Bán kết / Chung kết.
- Đưa vào `src/data/su-kien/doc3.json` (thay bộ khung rỗng) và `src/data/su-kien/doc4.json`. Được đổi cấu trúc 2 file này cho khớp dữ liệu, hoặc chuyển sang cấu trúc kiểu OSS đang dùng: chọn cách gọn nhất, miễn trang hiển thị đúng. **Vẫn tách hoàn toàn khỏi thống kê OSS** như v0.14.

### 11b. Trang `/wiki/su-kien/doc3` và `/doc4`
Bố cục như trang mùa OSS:
1. Dải ảnh đầu trang, `PageHeader` (`h1` tên đầy đủ, nút Thư viện ảnh, sự kiện trước / sau).
2. **Lời mở đầu** = `intro` trong `events.json` (đã viết theo mẫu trang mùa, có in đậm tên và tên tắt), đặt ở chỗ lời mở đầu của trang mùa; khung thông tin bên phải như 8b.
3. **Mục lục** như trang mùa: Vòng loại · Bán kết 1 · Bán kết 2 · Bán kết 3 · Chung kết.
4. **Vòng loại**: bảng Hạng · Thí sinh (ảnh tròn, link nếu có hồ sơ) · Lớp · Trường · Điểm (định dạng tiếng Việt: 62,5; 37,25). Cùng kiểu bảng Vòng loại OSS.
5. **Bán kết 1–3**: bảng Thí sinh · Lớp · Trường · Kết quả, theo vị trí đứng. **Tô nổi bật như bảng Bán kết OSS** những người vào Chung kết (người Nhất mỗi trận và người Nhì cao nhất; vì không có điểm, xác định bằng việc có tên trong Chung kết). ⓘ giải thích như OSS.
6. **Chung kết**: bảng Thí sinh · Lớp · Trường · Kết quả, theo vị trí đứng, tô vàng / bạc / đồng như bảng Chung kết OSS (2 Quý quân cùng màu đồng). Không có biểu đồ diễn biến điểm.
7. **Ảnh trao giải** (`awardPhoto`) ngay sau bảng Chung kết, như ảnh Chung kết ở trang mùa.
- Ảnh tròn: `thi-sinh/{doc3|doc4}-{slug}-{mã trường}.jpg` → ảnh mặc định của hồ sơ (nếu có `ossPerson`) → giữ chỗ. Trường dùng tên ngắn như bảng OSS (THPT Trung Giã có trong `schools.json`).
- Bỏ khối "Dữ liệu đang được cập nhật" khi đã có dữ liệu.

## 12. Thư viện và ảnh (đợt 4)

- Thư viện có 10 ô sự kiện theo ngày (thêm Gặp nhau đầu năm 2023 và DOC4).
- Thứ tự ảnh trong một sự kiện: ảnh bìa → ảnh trao giải → ảnh trong thư mục. "{x} ảnh" tính cả ảnh trao giải.
- Ưu tiên ảnh cho thẻ / ô / dải ảnh đầu trang sự kiện: ảnh bìa → ảnh trao giải → ảnh đầu tiên của thư mục → nền tông màu.

## 13. `anh-con-thieu` và tài liệu (đợt 4)

- `npm run anh-con-thieu`: các nhóm sự kiện **tự tính từ dữ liệu**, không ghi cứng:
  - **Người chơi tại sự kiện**: mọi cặp (sự kiện có `photoKey`, người tham gia có hồ sơ) → hiện có 43 file;
  - **Ảnh trao giải sự kiện**: 6 file;
  - **Ảnh bìa sự kiện**: 10 file.
- `CLAUDE.md`, `README.md`: cấu trúc mới của `events.json` (bảng 8a), cách thêm một sự kiện Gặp nhau đầu năm (copy một mục, đổi trận), cấu trúc file DOC và cách thêm DOC5, `leaderTitle` / `leaderPerson`, bỏ cơ chế `draft`.

---

## Kiểm tra trước khi báo xong

- Build, typecheck pass; không lỗi 404 ảnh.
- **OSS không đổi**: 91 thí sinh, 5 trường; lọc Quán quân 8, Á quân 10, Quý quân 18; kỷ lục, Hall of Fame như cũ.
- Trang mùa 1: câu đầu "… là mùa giải đầu tiên của cuộc thi Olympia Sóc Sơn, …"; mùa 10: "mùa giải thứ mười", đối tượng ghi "huyện Sóc Sơn cũ"; mùa 8 vẫn ghi như cũ ở phần đối tượng.
- `/human-of-oss`: 9 thẻ, 1 ô chờ; thẻ 2 ghi "Tập 2 · 26/12/2019"; trang chủ "9 câu chuyện"; hồ sơ Trần Kim Cương có dòng Human of OSS.
- Cơ cấu tổ chức: "Trưởng ban: Anh Nguyễn Việt Thành" (tên là link); Ban Truyền thông "Chị Nguyễn Thu Hà" (không link); nhiệm vụ đủ ý.
- Footer 4 người; Về chúng tôi "450+"; trang chủ có lại khối Cảm nhận và Đối tác.
- `/wiki/su-kien`: 10 thẻ, Gặp nhau đầu năm 2023 đứng đầu, Gặp nhau đầu năm 2026 cuối.
- GNDN 2024: 3 bảng "Trận 1–3"; khung thông tin có Tên khác, Năm học 2023–2024, Thời gian 18/02/2024, Vai trò "Đồng tổ chức", 5 người dẫn chương trình.
- RCV 2024: Thời gian "19/05/2024 – 25/05/2024"; bảng 6 đội đúng màu; ảnh trao giải. RCV 2023: không có bảng, khung có "Quán quân: Lê Trà My" (link). AllStars: có dòng "Sự kiện: Kỉ niệm 40 năm thành lập trường THPT Sóc Sơn".
- DOC3: Vòng loại 12 dòng, Quỳnh Ngân 62,5; Bán kết 3 tô nổi bật Chí Thành và Thiện Nhân; Chung kết Quỳnh Ngân vàng, Thiện Nhân bạc, Gia Long và Chí Thành đồng; khung "Quán quân: Đỗ Thị Quỳnh Ngân" (link). DOC4 tương tự (Bán kết 3 tô nổi bật Tuấn Hùng và Mạnh Tiến).
- Hồ sơ Lê Trà My, Mầu Tuấn Kiệt, Đỗ Ngô Thiện Nhân đúng như ví dụ mục 9c; hồ sơ Nguyễn Thị Ngọc Ánh (OSS8) có nút "GNDN '24" và "RCV 2024".
- Về chúng tôi: có chú thích "Sự kiện khác" và 10 dòng sự kiện đúng chỗ theo năm.
- Tìm "gndn 2025", "doc4", "kim cuong" ra đúng kết quả.
- Thử ở 1280px và 390px.

Báo lại: file đã sửa/thêm/xóa, kết quả build/typecheck, kết quả `npm run anh-con-thieu` (nhất là ảnh sự kiện còn thiếu), chỗ nào phải làm khác brief và lý do.
