# Yêu cầu v0.6: chuốt giao diện, đợt 1 (Kit đã duyệt)

Đọc `CLAUDE.md` trước. **Trình bày kế hoạch (file nào, sửa gì) trước khi sửa.** Xong mỗi mục chạy `npm run build` và `npm run typecheck`. Không thêm thư viện npm mới (biểu đồ, hiệu ứng đều tự viết bằng SVG/CSS/React). Không sửa dữ liệu trong `src/data/`.

Mọi chuyển động phải tôn trọng `prefers-reduced-motion: reduce`: khi bật thì không chạy hiệu ứng, hiện thẳng trạng thái cuối.

---

## 1. Tiêu đề, đầu trang và nhịp khoảng cách

### 1a. Bỏ chữ in hoa ở tiêu đề
- Mọi `h1`, `h2`, `h3` dùng **chữ thường như câu** (viết hoa chữ đầu và tên riêng như nội dung gốc), **không** `uppercase`, không giãn chữ (`tracking`). Ví dụ: "Bảng vàng", "Quán quân các mùa", "THPT Sóc Sơn tại Đường lên đỉnh Olympia", "Kỷ lục", "Human of OSS", "Thư viện".
- Dòng nhỏ "HALL OF FAME" phía trên "Quán quân các mùa" → "Hall of Fame", chữ thường, cỡ nhỏ, màu vàng kim.
- Câu khẩu hiệu trên ảnh lớn trang chủ ("Từ đỉnh núi Sóc đến đỉnh Olympia") cũng bỏ in hoa.
- **Giữ in hoa** chỉ ở: chữ "OLYMPIA SÓC SƠN" cạnh logo (header, footer) và các mục menu trên máy tính.
- Thang cỡ chữ dùng chung (đặt thành token / class trong `src/index.css`):
  - `h1`: `clamp(2rem, 4vw, 2.75rem)`, đậm 700
  - `h2`: `1.5rem` (điện thoại) → `1.875rem` (máy tính), đậm 700
  - `h3`: `1.125rem` → `1.25rem`, đậm 600
  - `line-height` tiêu đề **1.25** (tiếng Việt có dấu chồng, không để thấp hơn).

### 1b. Font tiêu đề: thử 2 phương án bằng tham số trên đường dẫn (tạm thời)
- Thêm token `--font-display` trong `@theme`. Mặc định `--font-display` = font hiện tại (Be Vietnam Pro). Dùng `--font-display` cho: `h1`, `h2`, `h3`, 3 chữ "O S S" và câu khẩu hiệu ở trang chủ, các con số lớn (Con số ấn tượng, ô Kỷ lục), tên trong thẻ Hall of Fame. Chữ thường giữ Be Vietnam Pro.
- Lúc khởi động (trong `main.tsx`, trước khi render), đọc `font` từ `window.location.search` (phần **trước** dấu `#`):
  - `?font=a` → nạp `https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600..800&display=swap`, đặt `document.documentElement.dataset.font = "a"`, CSS: `--font-display: "Bricolage Grotesque", <font hiện tại>`; tiêu đề đậm 700.
  - `?font=b` → nạp `https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600..800&display=swap`, `dataset.font = "b"`, `--font-display: "Fraunces", Georgia, serif`; tiêu đề đậm 650.
  - Không có tham số → giữ nguyên như hiện tại, **không** nạp thêm font nào.
- Cả hai font đều có bộ dấu tiếng Việt. Thẻ `<link>` font được chèn bằng JS, chỉ khi có tham số.
- Ghi chú trong code: `// TẠM: so sánh font, sẽ bỏ ở v0.7`.
- Cách xem (để Kit so sánh): `https://hoanghv2605.github.io/olympia-soc-son/?font=a#/bang-vang` và `?font=b#/bang-vang`. Kiểm tra tham số vẫn giữ khi bấm chuyển trang (HashRouter chỉ đổi phần sau `#`).

### 1c. Đầu trang thống nhất
- Tạo component `PageHeader` (dòng chỉ đường nếu có, `h1`, 1 dòng mô tả nếu có, khoảng cách trên/dưới cố định). Dùng cho mọi trang cấp 1 và trang OSSPEDIA: Về chúng tôi, OSSPEDIA, Các mùa giải, trang mùa (kèm nút chuyển mùa), Thí sinh, Các trường, trang trường, Bảng vàng, Human of OSS, bài Human of OSS, Thư viện, 404. Hồ sơ thí sinh giữ bố cục riêng nhưng `h1` cùng kiểu chữ.
- Có 2 tông: `light` (mặc định) và `dark` (**chỉ** Bảng vàng, vì nối liền khối Hall of Fame nền tối).
- Trang chưa có dòng mô tả thì thêm 1 dòng ngắn: Thư viện → "Ảnh và tư liệu qua các mùa Olympia Sóc Sơn." (các trang khác nếu thiếu, đề xuất câu trong kế hoạch để Kit duyệt).

### 1d. Nhịp khoảng cách
- Khoảng cách giữa các mục lớn trong trang dùng **2 mức** cố định (vd `py-12 md:py-16` cho mục thường, `py-16 md:py-24` cho khối nền màu như Hall of Fame). Rà lại mọi trang cho đúng 2 mức này.
- Sửa khoảng trắng thừa phía dưới mục "Các thí sinh vào Chung kết 2 năm liên tiếp" trước footer.

## 2. Ảnh giữ chỗ mới (khi chưa có ảnh thật)

Áp dụng cho `PersonPhoto` và ảnh thẻ Human of OSS (gộp về một component nếu đang tách).

- **Tông màu theo người:** 5 tông trong bảng màu OSS, chọn cố định theo id (tổng mã ký tự của id chia lấy dư 5), để mỗi người một màu nhưng không đổi giữa các lần tải:

| Tông | Nền | Chữ và họa tiết |
| --- | --- | --- |
| Tím | `#EDE7FB` | `#5B21B6` |
| Chàm | `#E4E6FA` | `#3730A3` |
| Xanh | `#DCEAFB` | `#1E4FB8` |
| Hồng | `#FBE3EE` | `#A3245E` |
| Tím hồng | `#F6E3FA` | `#86198F` |

- **Chữ cái đầu** (giữ quy tắc 2 chữ cuối của tên) nhỏ lại, khoảng **28% bề ngang khung**, đậm 700, dùng `--font-display`.
- **Họa tiết:** một khối lập phương nhìn nghiêng (3 mặt hình thoi, giống logo OSS), **chỉ vẽ nét**, đặt góc dưới phải và tràn ra ngoài khung, độ đậm ~10% màu chữ của tông. Vẽ bằng SVG nội tuyến.
- **Không còn trạng thái xám/trống khi ảnh đang tải:** luôn hiện ảnh giữ chỗ trước; ảnh thật tải xong thì hiện đè lên (mờ dần 200ms). Ảnh lỗi thì giữ ảnh giữ chỗ. (Hiện các dải "2 năm liên tiếp" đang xám trống trong lúc tải.)
- Lớp chuyển màu tối phía dưới để đọc tên (thẻ THPT Sóc Sơn, dải 2 năm liên tiếp) giữ nguyên.

## 3. Bảng trên điện thoại

Áp dụng dưới `md` (768px):
- Mọi bảng nằm trong khung cuộn ngang. **Cột đầu (tên) dính bên trái** khi cuộn.
- Bảng Bán kết / Chung kết: **cột Tổng dính bên phải**. Bảng thành tích trong hồ sơ: **cột Kết quả dính bên phải**. Cạnh trong của cột dính có bóng mờ nhẹ để báo còn nội dung cuộn được.
- Ô dính phải có **nền đặc cùng màu với dòng** (kể cả dòng được tô màu ở mục 4), không để trong suốt.
- Ô số gọn hơn: `px-2`, `text-sm`, `min-width: 2.75rem`, `font-variant-numeric: tabular-nums` (áp dụng cho cả máy tính).
- Danh sách Thí sinh (`/wiki/thi-sinh`): ẩn cột Trường, đưa tên trường thành dòng nhỏ dưới tên.
- Bảng Vòng loại: ẩn cột Lớp và Trường, đưa "{lớp} - {trường}" thành dòng nhỏ dưới tên (giống bảng Bán kết); tiêu đề cột "Nhóm hạt giống" rút thành "Nhóm".
- Máy tính giữ bố cục cột như hiện tại.

## 4. Màu bảng Bán kết rõ hơn

- **Nhất trận, vào Chung kết:** nền cả dòng màu `oss` (`#6d28d9`), toàn bộ chữ trắng (tên, dòng lớp - trường với độ mờ 80%, các con số, Tổng đậm).
- **Nhì cao điểm nhất, vào Chung kết:** **không tô nền**, viền 2px màu `oss` bao quanh cả dòng (làm bằng `box-shadow: inset` trên từng ô, vì `outline` trên `<tr>` không ổn định ở Safari), tên đậm.
- Dòng chú thích phía trên: ô mẫu 16px, ô đặc màu `oss` cho "Nhất trận…", ô viền `oss` cho "Nhì cao điểm nhất…". Chữ `sr-only` giữ nguyên.
- Màu Chung kết (vàng / bạc / đồng) giữ nguyên.

## 5. Thanh menu, menu điện thoại, nút lên đầu trang

- **Thanh menu thu gọn khi cuộn:** cuộn xuống quá 24px thì header thấp lại (vd 64px → 52px), logo nhỏ lại một chút, nền đặc hơn có `backdrop-blur` và viền dưới mảnh. Chuyển trạng thái 200ms.
- **Menu điện thoại:** tấm phủ toàn màn hình trượt xuống từ header; mục menu chữ thường như câu, cỡ `1.25rem`, mỗi mục cao ≥ 48px; mục đang mở có vạch màu `oss` bên trái. Khóa cuộn trang nền khi mở; đóng khi chuyển trang, khi bấm Esc; focus giữ trong menu khi mở và trả về nút menu khi đóng.
- **Nút lên đầu trang:** nút tròn 44px góc dưới phải, icon `PiArrowUp`, `aria-label="Lên đầu trang"`; chỉ hiện khi đã cuộn quá 1,5 lần chiều cao màn hình; bấm thì cuộn mượt lên đầu (giảm chuyển động: nhảy thẳng).

## 6. Ảnh lớn trang chủ lật như ô Vượt chướng ngại vật

- Khung ảnh lớn trang chủ được che bởi **4 ô góc** (chia 4 phần tư, đánh số 1–4 màu trắng ở giữa mỗi ô) và **1 ô trung tâm** (~34% bề ngang × 34% chiều cao, nằm giữa, đè lên 4 ô kia, không đánh số). Màu ô: các sắc tím của `oss` (ô trung tâm đậm hơn), khe giữa các ô 3px.
- Thứ tự xếp lớp: ảnh < các ô < chữ trên ảnh (câu khẩu hiệu, chú thích). **Chữ luôn đọc được ngay từ đầu.**
- Khi trang chủ hiện ra: chờ 400ms, rồi lật mở lần lượt ô 1 → 2 → 3 → 4 → trung tâm. Mỗi ô lật bằng `rotateY` tới 90° kèm mờ dần trong 380ms (có `perspective`), các ô cách nhau 180ms; tổng ~1,7 giây. Xong thì gỡ các ô khỏi DOM.
- **Chỉ chạy lần đầu trong phiên** (lưu cờ trong `sessionStorage`, bọc `try/catch`); quay lại trang chủ trong cùng phiên thì hiện ảnh luôn. Giảm chuyển động: không có ô.
- Các ô `aria-hidden="true"`, `pointer-events: none`.
- Chưa có ảnh `hero-main.jpg` thì phần lộ ra là nền tím chuyển màu hiện tại kèm họa tiết khối lập phương như mục 2.

## 7. Biểu đồ "Đường lên đỉnh" ở trang mùa

Component mới `ClimbChart`, đặt **dưới bảng Chung kết** (và dưới dòng chú thích câu hỏi phụ nếu có) ở cả 10 trang mùa. Tự vẽ bằng SVG.

- **Tiêu đề** `h3`: "Diễn biến điểm số"; dòng mô tả nhỏ: "Điểm cộng dồn của 4 thí sinh sau từng vòng thi."
- **Dữ liệu** (tự tính từ `matches.json`, trận Chung kết): mỗi thí sinh 5 điểm: Xuất phát `0` → sau Khởi động `kd` → sau Vượt chướng ngại vật `kd+vcnv` → sau Tăng tốc `kd+vcnv+tt` → Về đích `total` (lấy đúng `total` trong dữ liệu, đã áp quy tắc không âm).
- **Trục ngang:** 5 nhãn "Xuất phát", "Khởi động", "Vượt chướng ngại vật", "Tăng tốc", "Về đích" (nhãn dài được xuống dòng, không viết tắt). **Trục dọc** từ 0, vạch lưới ngang mờ theo bước 50 hoặc 100 (chọn sao cho 4–6 vạch).
- **Màu đường theo danh hiệu:** Quán quân `#B08600` (dày 3px), Á quân `#6B7280`, Quý quân `#A0612F` (dày 2px). Mỗi điểm có chấm tròn.
- **Nhãn trực tiếp ở cuối đường** (máy tính): "{tên} {tổng}". Hai người bằng điểm (vd mùa 4: 220–220, mùa 10: 180–180) thì **dời nhãn** cho cách nhau tối thiểu 16px, không chồng lên nhau. **Điện thoại (< 640px):** bỏ nhãn cuối đường, thay bằng danh sách chú giải dưới biểu đồ (đoạn màu + tên + tổng).
- **Tương tác:** rê chuột vào đường hoặc nhãn (điện thoại: chạm vào mục chú giải) → làm nổi đường đó, làm mờ các đường khác, hiện số điểm cộng dồn trên từng chấm của đường đó.
- **Chuyển động:** khi biểu đồ cuộn vào màn hình (IntersectionObserver), các đường tự vẽ ra từ trái sang phải trong 900ms (`stroke-dashoffset`), chấm và nhãn hiện sau; chỉ chạy 1 lần.
- **Trợ năng:** `role="img"` và `aria-label` tóm tắt, vd "Biểu đồ điểm cộng dồn trận Chung kết mùa 10: Phạm Ngô Bảo Minh 195, Nguyễn Tuấn Hùng 180, Võ Danh Sơn 180, Trương Tuấn Minh 30." (bảng điểm phía trên đã có đủ số liệu).

Kiểm tra số liệu:

| Mùa | Thí sinh | Xuất phát → KĐ → VCNV → TT → VĐ |
| --- | --- | --- |
| 10 | Phạm Ngô Bảo Minh (Quán quân) | 0 → 40 → 50 → 160 → 195 |
| 10 | Nguyễn Tuấn Hùng (Á quân) | 0 → 100 → 110 → 180 → 180 |
| 10 | Võ Danh Sơn (Á quân) | 0 → 80 → 140 → 180 → 180 |
| 10 | Trương Tuấn Minh (Quý quân) | 0 → 20 → 30 → 60 → 30 |
| 2 | Chu Đức Huy (Quán quân) | 0 → 70 → 70 → 220 → 265 |
| 2 | Nguyễn Thanh Hà (Á quân) | 0 → 20 → 110 → 230 → 210 |

## 8. Con số ấn tượng chạy tăng dần

- Ở mục "Những con số ấn tượng" (Về chúng tôi): khi mục cuộn vào màn hình (hiện ≥ 50%), các số chạy từ 0 tới giá trị thật trong 1,2 giây, chậm dần về cuối; chỉ 1 lần. "400+" chạy tới 400 rồi hiện dấu "+".
- Số đang chạy `aria-hidden`; bên cạnh có chữ `sr-only` là giá trị cuối. Giảm chuyển động: hiện thẳng số cuối.
- Chỉ áp dụng ở mục này.

## 9. Cập nhật tài liệu

- `CLAUDE.md`: quy tắc tiêu đề chữ thường + thang cỡ chữ; `PageHeader`; 2 mức khoảng cách; tông màu ảnh giữ chỗ; quy tắc bảng trên điện thoại (cột dính); màu Bán kết mới; quy tắc chuyển động (chỉ 3 điểm nhấn: lật ô trang chủ, biểu đồ trang mùa, số chạy; luôn tôn trọng giảm chuyển động); ghi chú cơ chế `?font=` là tạm thời.
- `README.md`: thêm cách xem so sánh font bằng `?font=a` / `?font=b`.

---

## Kiểm tra trước khi báo xong

- `npm run build` và `npm run typecheck` pass.
- Không còn tiêu đề in hoa nào ngoài các chỗ được giữ ở 1a.
- `?font=a` và `?font=b` đổi font tiêu đề, giữ được khi chuyển trang; không có tham số thì giống hệt font hiện tại và không nạp font thêm (xem tab Network).
- Ảnh giữ chỗ: 8 thẻ Hall of Fame có ít nhất 3 tông khác nhau; không còn khung xám khi tải; thả tạm 1 ảnh thật vào `public/images/thi-sinh/<id>.jpg` thì ảnh thật hiện đè lên, xóa đi thì về ảnh giữ chỗ.
- Ở 390px: bảng Bán kết mùa 10 thấy được cột Tên và cột Tổng cùng lúc; dòng Nhất trận tô `oss` chữ trắng, dòng Nhì cao điểm nhất có viền; danh sách Thí sinh không còn cột Trường.
- Menu điện thoại: mở/đóng bằng nút và Esc, Tab không thoát ra ngoài menu khi đang mở.
- Trang chủ: lần đầu thấy 5 ô lật đúng thứ tự; tải lại trong cùng tab không lật nữa (mở tab mới thì lật lại); bật giảm chuyển động thì không có ô.
- Biểu đồ mùa 2 và mùa 10 đúng bảng số liệu ở mục 7; nhãn 180–180 mùa 10 và 220–220 mùa 4 không chồng nhau.
- Về chúng tôi: các số chạy tới 10, 400+, 7, 6, 1.
- Thử ở 1280px và 390px.

Báo lại: file đã sửa/thêm/xóa, kết quả build/typecheck, những chỗ phải xử lý khác brief (nếu có) và lý do.
