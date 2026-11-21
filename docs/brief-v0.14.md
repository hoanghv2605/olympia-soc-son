# Yêu cầu v0.14 (Kit đã duyệt): Sự kiện khác, Thư viện sự kiện, Ban Tổ chức

Đọc `CLAUDE.md` trước. **Trình bày kế hoạch trước khi sửa.** Làm 3 đợt, xong mỗi đợt chạy `npm run build`, `npm run typecheck` rồi `git commit`:
- **Đợt 1:** mục 0, 1, 2, 3, 4, commit "v0.14 đợt 1".
- **Đợt 2:** mục 5, 6, commit "v0.14 đợt 2".
- **Đợt 3:** mục 7, 8, commit "v0.14 đợt 3".

Không thêm thư viện npm. Không sửa dữ liệu thi đấu OSS. Ảnh mẫu (`OSS-ANH-MAU`) vẫn coi là chưa có ảnh. Mọi chuyển động tôn trọng `prefers-reduced-motion`. Tiêu đề viết thường như câu; dòng có chữ in hoa giữ `line-height` ≥ 1.35, không cắt `overflow`.

Kit đã giải nén sẵn vào dự án:
- `src/data/events.json` (8 sự kiện, **không sửa nội dung**),
- 6 ảnh mẫu `public/images/thi-sinh/{truyenlua2023|allstars}-*.jpg`,
- 8 ảnh mẫu `public/images/bia/{mã sự kiện}-bia.jpg`,
- ảnh mẫu `public/images/ban/ban-to-chuc.jpg`,
- 8 thư mục rỗng `public/images/thu-vien/su-kien/{mã sự kiện}/`.

---

## 0. Dữ liệu sự kiện (`events.json`)

Thêm kiểu TypeScript và hàm truy xuất trong `src/lib/data.ts`. Ý nghĩa các trường:

| Trường | Ý nghĩa |
| --- | --- |
| `id` | mã sự kiện, dùng cho đường dẫn, ảnh bìa, thư mục thư viện |
| `stt` | thứ tự hiển thị ở **mọi nơi** (tăng dần) |
| `name`, `shortName` | tên đầy đủ; tên ngắn (chỉ DOC3), dùng ở chỗ chật (dòng chỉ đường, bảng hồ sơ, ô thư viện) |
| `type` | loại sự kiện, xem bảng dưới |
| `year` | năm, dùng cho số liệu "2023–2026" |
| `schoolYear` | `"2023-2024"` → hiển thị `2023–2024`; có thể `null` |
| `date` | `YYYY-MM-DD` → hiển thị `dd/mm/yyyy`; có thể `null` |
| `scope`, `organizer` | phạm vi; đơn vị tổ chức (chỉ hiện khi có) |
| `role` | `"to-chuc"` Tổ chức · `"dong-to-chuc"` Đồng tổ chức · `"tham-gia"` Tham gia · `null` |
| `intro` | đoạn giới thiệu (markdown) hoặc `null` |
| `format` | phần riêng của trang: `null` (chỉ khung chung) · `"xep-hang"` · `"nguoi-choi"` · `"mua-thi"` |
| `photoKey`, `photoLabel` | tiền tố tên ảnh người chơi; nhãn nút chọn ảnh trong hồ sơ |
| `sectionTitle` | tiêu đề phần riêng (mặc định: "Kết quả" cho `xep-hang`, "Người chơi" cho `nguoi-choi`) |
| `participantLabel` | chữ ghi ở cột Kết quả trong hồ sơ khi người đó không có `rank` |
| `participants[]` | `name` (luôn có), `person` (id `people.json`, tuỳ chọn), `class`, `school` (id `schools.json`) **hoặc** `schoolName` (trường ngoài, chỉ hiện chữ), `rank` (1 Giải Nhất, 2 Giải Nhì, 3 Giải Ba, như cách gọi Bán kết OSS), `note` |

Loại sự kiện:

| `type` | Nhãn | Icon |
| --- | --- | --- |
| `rung-chuong-vang` | Rung chuông vàng | `PiBell` |
| `toa-dam` | Tọa đàm | `PiChatsCircle` |
| `giao-luu` | Giao lưu | `PiHandshake` |
| `dac-biet` | Sự kiện đặc biệt | `PiStar` |
| `cuoc-thi` | Cuộc thi | `PiTrophy` |

- **Nhãn thời gian** (hàm dùng chung): có `schoolYear` → "Năm học 2023–2024"; không thì "{year}".
- Trường trống hiển thị "Đang cập nhật" (màu phụ).
- Kiểm tra các `person` (`le-tra-my`, `mau-tuan-kiet`, `chu-duc-huy`, `nguyen-viet-thanh`, `ha-viet-hoang`) có trong `people.json`; thiếu thì báo lại, không tự thêm. `ha-viet-hoang` **không có hồ sơ OSSPEDIA** (giữ quy tắc hiện có), nên tên không phải link.
- **Sự kiện nằm ngoài mọi thống kê OSS**: số thí sinh (91), danh sách thí sinh, kỷ lục, Hall of Fame, Các trường, số liệu trang chủ giữ nguyên.

## 1. OSSPEDIA: ô thứ 4 và trang danh sách sự kiện

### 1a. Trang `/wiki`
- Thành **4 ô**: 4 cột (≥ 1280px), 2 cột (≥ 768px), 1 cột (nhỏ hơn). Các ô vẫn cao bằng nhau; phần xem trước của 3 ô cũ được xuống dòng / thu nhỏ để không tràn khi ô hẹp lại.
- Ô mới (cùng kiểu 3 ô cũ):

| Ô | Icon | Mô tả | Số liệu (tự tính) | Phần xem trước (`aria-hidden`) | Link |
| --- | --- | --- | --- | --- | --- |
| Sự kiện khác | `PiConfetti` | Rung chuông vàng, tọa đàm giao lưu và các sự kiện OSS tổ chức hoặc phối hợp tổ chức. | "{số sự kiện} sự kiện · {year nhỏ nhất}–{year lớn nhất}" (hiện: "8 sự kiện · 2023–2026") | chip của 3 loại đầu tiên khác nhau theo `stt` (hiện: Rung chuông vàng, Tọa đàm, Giao lưu) | `/wiki/su-kien` |

- Nếu menu có danh sách mục con của OSSPEDIA thì thêm "Sự kiện khác".

### 1b. Trang `/wiki/su-kien`
- `PageHeader`: dòng chỉ đường "OSSPEDIA / Sự kiện khác", `h1` "Sự kiện khác", mô tả "Các sự kiện Olympia Sóc Sơn tổ chức, phối hợp tổ chức hoặc tham gia ngoài các mùa thi."
- Lưới thẻ **cùng kiểu và số cột** với chế độ Thẻ ở trang tổng hợp các mùa (không cần chế độ Bảng), xếp theo `stt`.
- Thẻ: ảnh 3:2 (ảnh bìa → ảnh đầu tiên của thư viện sự kiện → nền tông màu có icon loại 48px), chip loại (icon + nhãn), tên (`h2`, cho xuống dòng, không cắt), dòng nhỏ nhãn thời gian, dòng nhỏ phạm vi (nếu có). Link phủ cả thẻ; chân thẻ "Thư viện ảnh ({x})" khi có ảnh, cùng kỹ thuật không lồng link như thẻ mùa.

## 2. Trang sự kiện (`/wiki/su-kien/:id`)

`id` không tồn tại → trang 404.

### 2a. Khung chung (mọi sự kiện), theo bố cục trang mùa
- **Dải ảnh mờ đầu trang**: ảnh bìa → ảnh đầu tiên của thư viện sự kiện → không có dải.
- **`PageHeader`**: dòng chỉ đường "OSSPEDIA / Sự kiện khác / {shortName ?? name}", `h1` tên đầy đủ, dòng phụ: chip loại + nhãn thời gian. Bên phải: nút "Thư viện ảnh" (`PiImages`, chỉ khi có ảnh), nút "‹ Sự kiện trước" / "Sự kiện sau ›" theo `stt` (`title` là tên sự kiện đích).
- **Khung thông tin** (cùng kiểu infobox trang mùa; máy tính bên phải, điện thoại ở trên): Loại · Năm học · Thời gian · Phạm vi · Đơn vị tổ chức (chỉ khi có) · Vai trò của OSS.
- **"Giới thiệu"** (`h2`): `intro` qua `react-markdown`; `null` → "Thông tin về sự kiện đang được cập nhật." (màu phụ).
- Sau đó là phần riêng theo `format`.

### 2b. `format: "xep-hang"` (Truyền lửa Olympia 2023)
- `h2` = `sectionTitle` ("Trận đấu giao hữu"), sau đó nút **ⓘ** (cùng kiểu ⓘ trang mùa): 3 ô màu vàng / bạc / đồng = Giải Nhất / Giải Nhì / Giải Ba, và dòng "Thứ tự theo vị trí đứng của thí sinh trong trận."
- Bảng 3 cột: **Thí sinh** (ảnh tròn 32px + tên; link hồ sơ nếu có hồ sơ), **Lớp**, **Trường** (trường trong `schools.json` hiển thị như bảng mùa; trường ngoài hiển thị chữ `schoolName`).
- Thứ tự dòng = thứ tự trong `participants` (My, Huyền, Hiệp, Kiệt). Màu dòng theo `rank`, dùng **đúng kiểu tô màu vàng / bạc / đồng của bảng Chung kết** (My vàng, Huyền bạc, Hiệp và Kiệt đồng), kèm chữ `sr-only` "Giải Nhất" / "Giải Nhì" / "Giải Ba". Điện thoại: cuộn ngang như các bảng hiện có.
- Ảnh tròn: ảnh sự kiện (mục 3) → ảnh mặc định của người đó → kiểu giữ chỗ hiện có của `PersonPhoto`. Huyền và Hiệp không có ảnh (giữ chỗ).

### 2c. `format: "nguoi-choi"` (AllStars 2024)
- `h2` = `sectionTitle` ?? "Người chơi". Lưới 4 thẻ (≥ 1024px), 2 thẻ (nhỏ hơn), theo thứ tự `participants`.
- Thẻ gọn như thẻ danh sách thí sinh: ảnh 3:4 (ảnh sự kiện → ảnh mặc định của người đó → giữ chỗ), tên (link nếu có hồ sơ), `note` (màu phụ). Không có bảng kết quả.

### 2d. `format: null`
Chỉ khung chung. `format: "mua-thi"` (DOC3) làm ở mục 5; đợt 1 tạm chỉ hiện khung chung.

## 3. Ảnh người chơi tại sự kiện và hồ sơ thí sinh

- Quy ước: **`thi-sinh/{photoKey}-{slug họ tên}-{mã trường}.jpg`** (slug và mã trường như ảnh thí sinh hiện có), chỉ áp dụng cho người có `school` thuộc `schools.json`. Hiện có 6 file: `truyenlua2023-le-tra-my-ss`, `truyenlua2023-mau-tuan-kiet-ss`, `allstars-ha-viet-hoang-ss`, `allstars-chu-duc-huy-ss`, `allstars-nguyen-viet-thanh-ss`, `allstars-le-tra-my-ss` (`.jpg`).
- Mở rộng `personPhoto(personId, { season?, olympia?, event? })`.
- **Nút chọn ảnh trong hồ sơ**: thêm nút `photoLabel` cho mỗi sự kiện người đó tham gia (có `photoKey`), đặt sau các nút mùa và nút O, theo `stt`; hiện / ẩn theo đúng quy tắc của các nút hiện có. Ảnh mặc định của hồ sơ **giữ nguyên quy tắc hiện tại**. Ví dụ Lê Trà My: Mùa 6 · Mùa 7 · O24 · Truyền lửa · AllStars.
- **Bảng "Sự kiện khác"** trong hồ sơ (cùng kiểu các bảng hồ sơ, đặt sau bảng cuối cùng hiện có), chỉ hiện khi người đó có sự kiện:
  - Cột: **Sự kiện** (`shortName ?? name`, link trang sự kiện) · **Năm** (nhãn thời gian, bỏ chữ "Năm học") · **Kết quả**: có `rank` → `ResultBadge` Giải Nhất / Giải Nhì / Giải Ba; không có → `participantLabel` (chữ thường); không có cả hai → "—".
  - Thứ tự theo `stt`.
  - Kết quả mong đợi: Trà My 2 dòng (Truyền lửa Olympia 2023 · Giải Nhất; AllStars 2024 · Khách mời); Kiệt 1 dòng (Giải Ba); Huy, Thành mỗi người 1 dòng (Khách mời).

## 4. Tìm kiếm chung

- Thêm sự kiện vào chỉ mục: `name`, `shortName`, nhãn loại; tìm không dấu như hiện có.
- Kết quả: icon loại, tên, dòng phụ "Sự kiện · {nhãn thời gian}"; nhóm Sự kiện đặt sau các nhóm hiện có.
- Người không có hồ sơ (Huyền, Hiệp, Hà Việt Hoàng) không thành kết quả tìm kiếm.

---

## 5. DOC3: trang giống hệt trang mùa OSS (đợt 2)

### 5a. Dữ liệu, tách riêng khỏi OSS
- File mới **`src/data/su-kien/doc3.json`**, cùng hình dạng dữ liệu OSS:
  `{ "season": {…cùng dạng một mục seasons.json, code "DOC3", schoolYear "2024-2025", các trường khác null / []}, "people": [], "qualifying": [], "matches": [] }`.
- `people[]`: `{ id, name, school, ossPerson? }`. `person` trong `qualifying` / `matches` trỏ tới `people` của DOC3; `ossPerson` là id hồ sơ OSSPEDIA (nếu thí sinh đó cũng thi OSS).
- **Không gộp** DOC3 vào bất kỳ chỗ nào của OSS: danh sách và số thí sinh, kỷ lục, Hall of Fame, Các trường, trang chủ, ảnh lớn trang chủ, tìm kiếm thí sinh, nhóm Thí sinh của `anh-con-thieu`.

### 5b. Dùng lại các phần của trang mùa
- Tách các phần của trang mùa (infobox mùa, Vòng loại, Bán kết, Chung kết, Diễn biến điểm số, ảnh trận đấu, ⓘ) để **nhận dữ liệu qua props** (hoặc một context "nguồn dữ liệu cuộc thi") thay vì đọc thẳng dữ liệu OSS. **Trang mùa OSS phải hiển thị y như cũ.**
- Trang `/wiki/su-kien/doc3`: dải ảnh đầu và `PageHeader` như mục 2a (`h1` "DAPHUC Olympia Championship 3"); khung thông tin là **infobox trang mùa** lấy từ `doc3.json` (trường trống ghi "Đang cập nhật"), thêm 2 dòng "Đơn vị tổ chức" và "Vai trò của OSS" từ `events.json`; mục Giới thiệu; rồi các phần của trang mùa theo đúng thứ tự trang mùa OSS.
- **Chưa có dữ liệu** (`qualifying` và `matches` rỗng): sau Giới thiệu hiện một khối thông báo "Dữ liệu DOC3 đang được cập nhật." (`PiHourglass`), không hiện các phần trống. Có dữ liệu một phần: phần nào rỗng thì ẩn.
- Tên thí sinh DOC3: link hồ sơ OSSPEDIA nếu có `ossPerson` (và người đó có hồ sơ), còn lại là chữ thường.
- Ảnh: thí sinh `thi-sinh/doc3-{slug}-{mã trường}.jpg`; trận đấu `tran-dau/doc3-bk{k}.jpg`, `tran-dau/doc3-ck.jpg`; chưa có thì giữ chỗ như OSS. **Chưa** tạo ảnh mẫu, chưa đưa vào `anh-con-thieu`.
- Hồ sơ người có `ossPerson`: bảng "Sự kiện khác" có dòng DOC3 với kết quả cao nhất theo cách gọi OSS; nút ảnh "DOC3" theo mục 3 (`photoKey` = `doc3`).
- **Thử tạm** (không commit): chép Bán kết + Chung kết mùa 10 vào `doc3.json` (kèm `people` tương ứng, đổi id trận thành `doc3-…`), gắn `ossPerson` cho 1 người → trang DOC3 hiện đủ bảng, ⓘ và biểu đồ; hồ sơ người đó có dòng DOC3. Xong **trả `doc3.json` về rỗng**.

## 6. Thư viện: thêm các sự kiện (đợt 2)

### 6a. Trang `/thu-vien`
- Hai khối, mỗi khối có `h2`: **"Các mùa Olympia Sóc Sơn"** (10 ô như hiện tại), bên dưới **"Các sự kiện khác"** (8 ô theo `stt`). Cùng lưới, cùng kiểu ô.
- Ô sự kiện: ảnh (ảnh bìa → ảnh đầu tiên của thư viện sự kiện → nền tông màu có icon loại), tên (`shortName ?? name`, cho 2 dòng, không cắt), dòng nhỏ "{nhãn thời gian} · {x} ảnh". Chưa có ảnh: ô mờ, "Chưa có ảnh", không phải link (như ô mùa).

### 6b. Ảnh và thứ tự
- Thư mục **`public/images/thu-vien/su-kien/{id}/`**, tên file tuỳ ý, đuôi `.jpg`, `.jpeg`, `.png`, `.webp`. Đưa vào danh sách ảnh tự sinh (vẫn loại ảnh mẫu).
- Ảnh bìa **`bia/{id}-bia.jpg`** (ngang 3:2).
- Thứ tự trong 1 sự kiện: ảnh bìa → ảnh trận đấu (chỉ DOC3: `doc3-bk1…`, `doc3-ck`) → ảnh trong thư mục, sắp tên tự nhiên. "{x} ảnh" tính cả ảnh bìa.

| Chỗ dùng ảnh bìa sự kiện | Ưu tiên |
| --- | --- |
| Ô sự kiện ở `/thu-vien`, thẻ ở `/wiki/su-kien` | ảnh bìa → ảnh đầu tiên của thư viện sự kiện → nền tông màu |
| Dải ảnh mờ đầu trang sự kiện | ảnh bìa → ảnh đầu tiên của thư viện sự kiện → không có dải |

### 6c. Trang `/thu-vien/su-kien/:id`
- Giống trang thư viện mùa: dòng chỉ đường "Thư viện / {shortName ?? name}", `h1` "Thư viện ảnh {name}", mô tả "{nhãn thời gian} · {x} ảnh"; nút "Trang sự kiện" và "‹ Sự kiện trước" / "Sự kiện sau ›" (chỉ những sự kiện **có ảnh**); lưới 6 cột như thư viện mùa; bấm ảnh mở `Lightbox`.
- `alt`: ảnh bìa "Ảnh bìa {name}", ảnh khác "Ảnh {name} ({số thứ tự})".
- `id` không tồn tại → 404. Chưa có ảnh → "Sự kiện này chưa có ảnh" và nút mở fanpage.

---

## 7. Ban Tổ chức (đợt 3)

### 7a. Dữ liệu
- Thêm vào **đầu** `departments.json` (dùng đúng tên trường của các ban khác): id `to-chuc`, tên "Ban Tổ chức", `leader` "Nguyễn Văn A", nhiệm vụ "Điều phối chung hoạt động của Olympia Sóc Sơn: lên kế hoạch cho từng mùa thi và sự kiện, phân công và kết nối công việc giữa các ban." (nội dung tạm, Kit sửa sau).
- Ảnh `ban/ban-to-chuc.jpg` (đã có ảnh mẫu).
- Tìm và sửa mọi chữ "bốn ban" / "4 ban" trên site thành "năm ban" / "5 ban".

### 7b. Máy tính (≥ `lg`)
- **Trạng thái sơ đồ:** Ban Tổ chức **chính giữa phía trên** logo, đường nối **thẳng đứng** từ giữa cạnh dưới ô tới đỉnh vòng tròn logo. 4 ban còn lại giữ ở 4 góc như hiện tại. Tăng chiều cao khối để ô Ban Tổ chức cách 2 ô góc trên ≥ 24px theo chiều dọc. 5 đường nối tự vẽ ra như hiện tại.
- **Trạng thái chi tiết:** cột **5 ô**, Ban Tổ chức đứng đầu; hiệu ứng FLIP áp dụng cho cả 5 ô.
- Tính lại vị trí cả 5 đường nối khi **quay về sơ đồ** và khi **đổi kích thước cửa sổ** (tránh lại lỗi đường nối lệch đã gặp ở v0.9).

### 7c. Điện thoại và máy tính bảng (< `lg`)
Logo ở trên, rồi ô Ban Tổ chức **chiếm cả hàng**, 4 ban còn lại lưới 2×2 bên dưới; chạm mở / đóng khung thông tin như hiện tại.

## 8. Script và tài liệu (đợt 3)

- `npm run anh-con-thieu`:
  - Các ban **"/ 5"**.
  - Nhóm mới **Ảnh bìa sự kiện (8)** và **Người chơi tại sự kiện (6)** (ghi tên người + tên sự kiện).
  - Nhóm Thí sinh giữ nguyên **123** file (không đếm lẫn ảnh sự kiện).
  - Phần thông tin Thư viện liệt kê thêm số ảnh từng sự kiện.
- `CLAUDE.md` và `README.md`:
  - các trường của `events.json`, cách sửa (thêm `date`, `role`, `intro`) và cách thêm sự kiện mới;
  - quy ước ảnh bìa, thư mục thư viện sự kiện, ảnh người chơi tại sự kiện;
  - DOC3: file `su-kien/doc3.json`, quy tắc tách khỏi thống kê OSS, quy ước ảnh `doc3-…`;
  - Ban Tổ chức.

---

## Kiểm tra trước khi báo xong

- Build, typecheck pass; không lỗi 404 ảnh trong console.
- **OSS không đổi**: OSSPEDIA vẫn "91 thí sinh", "5 trường"; danh sách thí sinh lọc Quán quân ra 8, Á quân 10, Quý quân 18; kỷ lục và Hall of Fame như cũ; trang mùa 2, 7, 10 hiển thị như trước.
- `/wiki` ở 1440px: 4 ô một hàng, cao bằng nhau, ô 4 ghi "8 sự kiện · 2023–2026" và 3 chip đúng; 768px: 2×2; 390px: 1 cột.
- `/wiki/su-kien`: 8 thẻ đúng thứ tự (Rung chuông vàng 2023 → Gặp nhau đầu năm 2026); thẻ DOC3 ghi "Năm học 2024–2025".
- `/wiki/su-kien/truyenlua2023`: bảng 4 dòng My, Huyền, Hiệp, Kiệt; màu vàng, bạc, đồng, đồng; My và Kiệt là link hồ sơ; ⓘ mở đúng chú thích; khung thông tin có "Năm học 2023–2024" và "Vai trò của OSS: Đang cập nhật".
- `/wiki/su-kien/allstars2024`: 4 thẻ theo thứ tự Hoàng, Huy, Thành, My; Hoàng không phải link; dòng ghi chú đúng.
- `/wiki/su-kien/doc3`: có "Đơn vị tổ chức: THPT Đa Phúc" và khối "Dữ liệu DOC3 đang được cập nhật."; đã thử tạm với dữ liệu mùa 10 rồi trả về rỗng. `/wiki/su-kien/abc` → 404.
- Hồ sơ Lê Trà My: 5 nút ảnh, bấm "Truyền lửa" và "AllStars" ra đúng ảnh; bảng "Sự kiện khác" 2 dòng. Hồ sơ Mầu Tuấn Kiệt: nút "Truyền lửa", bảng 1 dòng Giải Ba. Hồ sơ người không dự sự kiện: không có bảng.
- Tìm "truyen lua" và "doc3" ra đúng sự kiện.
- Thư viện: 2 khối, 10 + 8 ô; thả tạm 1 ảnh vào `thu-vien/su-kien/rcv2023/` (chạy lại `npm run dev`) → ô Rung chuông vàng 2023 có ảnh và "1 ảnh", trang sự kiện có nút "Thư viện ảnh" và dải ảnh đầu trang, trang thư viện sự kiện mở `Lightbox` được. Xoá ảnh thử sau khi xong.
- Cơ cấu tổ chức ở 1280px: Ban Tổ chức giữa phía trên, đường nối thẳng tới logo; bấm Ban Tổ chức → cột 5 ô, khung có "Trưởng ban: Nguyễn Văn A"; bấm logo hoặc Esc → về sơ đồ, 5 đường nối khớp; đổi cỡ cửa sổ đường nối vẫn khớp. Ở 390px: Ban Tổ chức một hàng, 2×2 bên dưới.
- `npm run anh-con-thieu` in đúng các nhóm mới.
- Thử ở 1280px và 390px.

Báo lại: file đã sửa/thêm/xóa, kết quả build/typecheck, chỗ nào phải làm khác brief và lý do.
