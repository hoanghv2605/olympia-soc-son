# Yêu cầu v0.11 (Kit đã duyệt)

Đọc `CLAUDE.md` trước. **Trình bày kế hoạch trước khi sửa.** Làm 2 đợt, xong mỗi đợt chạy `npm run build`, `npm run typecheck` rồi `git commit`:
- **Đợt 1:** mục 0–2, commit "v0.11 đợt 1".
- **Đợt 2:** mục 3–5, commit "v0.11 đợt 2".

Không thêm thư viện npm. Không sửa dữ liệu thi đấu. Ảnh mẫu (chuỗi `OSS-ANH-MAU`) vẫn coi là chưa có ảnh. Mọi chuyển động tôn trọng `prefers-reduced-motion`.

Màu huy chương dùng chung (đã có token): **vàng** nền `#FBF1C7` / viền `#C9A227` / chữ `#7A5C00`; **bạc** `#EEF1F5` / `#9AA4B2` / `#4B5563`; **đồng** `#F6E3D3` / `#B8743F` / `#7A4520`.

---

## 0. Chỉnh trang chủ

- **Chữ O S S** (đang lấp ảnh Chung kết): chồng thêm một lớp chuyển màu tím mỏng lên ảnh trong chữ (cùng `background`, vd `linear-gradient(rgba(109,40,217,.35), rgba(109,40,217,.35))` đặt trước ảnh) để vùng sáng của ảnh (áo trắng, tường) không làm chữ bị chìm. Chữ vẫn nhìn thấy ảnh.
- **Ảnh lớn:** làm tối thêm riêng góc trên phải (nơi có câu khẩu hiệu): tăng độ đậm lớp phủ ở góc đó lên ~85%, thêm `text-shadow` mềm cho câu khẩu hiệu (vd `0 2px 12px rgba(0,0,0,.45)`). Phần còn lại của ảnh giữ như hiện tại.

## 1. Bảng Bán kết và Chung kết (trang mùa)

- **Ảnh nhỏ bên trái tên** mỗi thí sinh: hình tròn 36px (điện thoại 28px), ảnh lấy theo `personPhoto(personId, { season })` với `season` = mùa của trận; chưa có ảnh thì vòng tròn chữ cái đầu (tông màu như ảnh giữ chỗ). Ảnh `alt=""` (tên đã ở cạnh). Căn ảnh theo dòng tên (dòng "lớp - trường" vẫn nằm dưới tên, thẳng hàng với tên).
- Trên dòng "Nhất trận" (nền `oss`): ảnh có viền trắng 2px.
- Cột tên đang dính trái trên điện thoại: tính thêm bề rộng ảnh, không để tên bị cắt.
- **Bỏ dải giữ chỗ 4 vòng tròn** khi trận **chưa có ảnh** (cả Bán kết và Chung kết). Trận có ảnh thật thì vẫn hiện ảnh như hiện tại (Bán kết: trên bảng; Chung kết: dưới biểu đồ).

## 2. Hồ sơ thí sinh

### 2a. Ảnh Olympia
- Thí sinh OSS có tham gia Đường lên đỉnh Olympia: ảnh **`thi-sinh/o{năm}-{slug họ tên}-{mã trường}.jpg`**, mã trường lấy theo trường của người đó (`people.json`). Mỗi năm Olympia một ảnh. Hiện có 14 người (kèm 3 người chỉ thi Olympia đã có quy ước này từ trước).
- Hàng nút chọn ảnh dưới ảnh: các nút **"Mùa n"** (tăng dần), rồi các nút **"O{năm}"** (vd "O26", `aria-label="Đường lên đỉnh Olympia năm thứ 26"`). Hiện hàng nút khi có **từ 2 nút** trở lên (vd người thi 1 mùa OSS và có Olympia vẫn có 2 nút). Mặc định chọn **mùa OSS mới nhất**. Ô chưa có ảnh thì hiện ảnh giữ chỗ.
- Mở rộng hàm `personPhoto(personId, { season?, olympia?: true })`: khi `olympia: true` thì thứ tự ưu tiên là ảnh `o…` (năm mới trước) → ảnh mùa OSS mới nhất → mùa cũ hơn → giữ chỗ.
- **Bảng vàng, mục "THPT Sóc Sơn tại Đường lên đỉnh Olympia"** (thẻ và hộp nổi): dùng `{ olympia: true }`.

### 2b. Bảng Đường lên đỉnh Olympia
- **Bỏ cột "Ngày".**

### 2c. Nhãn kết quả (cột "Kết quả" của bảng Olympia Sóc Sơn và bảng Đường lên đỉnh Olympia trong hồ sơ)
Component `ResultBadge`: nhãn bo tròn, **chữ đậm**, nền + viền + chữ theo màu huy chương:

| Màu | Kết quả |
| --- | --- |
| Vàng | Hạng 1 (Vòng loại), Giải Nhất, Quán quân |
| Bạc | Hạng 2, Giải Nhì, Á quân |
| Đồng | Hạng 3, Giải Ba, Quý quân |
| Không nhãn, chỉ chữ đậm màu `ink` | Hạng 4 trở xuống; mọi kết quả khác |

Có `sr-only` không cần thêm (chữ đã nói kết quả). Kiểm tra: Nghiêm Trung Đức (Hạng 5 chữ đậm thường; Giải Ba đồng; Hạng 1 vàng; Giải Nhất vàng; Quán quân vàng; Olympia: Giải Nhất vàng, Giải Nhì bạc); Hà Việt Hoàng không có hồ sơ nên không áp dụng.

## 3. Đối tác đồng hành: 3 hạng

### 3a. Dữ liệu
- `partners.json`: mỗi mục `{ "id", "name", "url", "tier" }`, `tier` là `"vang"`, `"bac"` hoặc `"dong-hanh"`. Bỏ cách `tier: "chinh"` cũ.
- Mặc định **25 mục giữ chỗ**: `vang-1`…`vang-5` ("Đối tác Vàng 1"…), `bac-1`…`bac-10`, `dong-hanh-1`…`dong-hanh-10`; `url` rỗng.
- Logo: **`doi-tac/{id}.svg`** hoặc **`.png`**.

### 3b. Giao diện
- 3 hàng theo thứ tự **Vàng → Bạc → Đồng hành**, mỗi hàng có nhãn nhỏ phía trên ("Đối tác Vàng", "Đối tác Bạc", "Đối tác đồng hành"). Hạng nào không có đối tác thì ẩn cả hàng.
- Ô logo nền trắng, bo góc lớn:

| Hạng | Viền | Cỡ ô (máy tính / điện thoại) |
| --- | --- | --- |
| Vàng | 2px `#C9A227`, bóng mờ vàng nhẹ | 240×150 / 176×110 |
| Bạc | 1.5px `#9AA4B2` | 176×112 / 136×88 |
| Đồng hành | 1px `oss` 30% | 152×96 / 120×76 |

- **Hiệu ứng chạy giữ như hiện tại**: mỗi hàng trôi ngang, chiều xen kẽ (Vàng sang trái, Bạc sang phải, Đồng hành sang trái); Vàng chậm hơn (~20px/giây, hai hàng kia ~30px/giây). Nhân bản đủ để luôn lấp kín bề ngang kể cả khi hàng ít đối tác (vd 5 ô Vàng trên màn rộng). Dừng khi rê chuột / focus. Giảm chuyển động: mỗi hàng là lưới tĩnh căn giữa.

## 4. Hall of Fame: vòng nguyệt quế

- Giữ lưới hiện tại (máy tính 4 cột, điện thoại 2 cột), nền tối, mỗi người 1 ô, cả ô là link tới hồ sơ.
- **Ảnh tròn** (~68% bề rộng ô, tối đa 200px), viền vàng mảnh, đặt giữa **vòng nguyệt quế tự vẽ bằng SVG** (component `Laurel`): hai nhành lá đối xứng mọc từ dưới giữa vòng lên hai bên, uốn theo vòng tròn bao quanh ảnh, **để hở phía trên** (~60°); mỗi nhành ~10–12 lá hình bầu dục nhọn xếp so le trong/ngoài, cuống mảnh; tô chuyển màu vàng (`#F2D27A` → `#B8860B`). **Không có ruy băng.** Không dùng ảnh nguyệt quế từ ngoài.
- **Dưới vòng nguyệt quế, 2 dòng căn giữa, màu vàng** `#E9C46A` (đủ tương phản trên nền tối), chữ đậm:
  - Dòng 1: **tên viết in hoa** (`text-transform: uppercase`, `--font-display`, giãn chữ nhẹ 0.02em, `text-wrap: balance`, tối đa 2 dòng). Đây là ngoại lệ có chủ đích của quy tắc "không in hoa".
  - Dòng 2: **"Quán quân OSS{n}"**; người vô địch nhiều mùa: **"Quán quân OSS1, OSS2"**. Không ghi điểm.
  - Khối chữ có chiều cao tối thiểu bằng 2 dòng tên để các ô thẳng hàng.
- **Bỏ** chip "Mùa n · điểm" và dòng "2 lần Quán quân".
- **Ảnh:** `thi-sinh/s{mùa vô địch gần nhất}-{slug}-{mã trường}-win.jpg` (vuông ~800×800). Chưa có thì ảnh mùa đó (`s{n}-…jpg`), rồi ảnh mùa khác, rồi chữ cái đầu. 8 người: Chu Đức Huy (s2), Trần Hải Linh (s3), Nguyễn Thùy Dương (s4), Nguyễn Việt Thành (s6), Lê Trà My (s7), Nguyễn Minh Chính (s8), Nghiêm Trung Đức (s9), Phạm Ngô Bảo Minh (s10).
- Rê chuột / focus: ảnh phóng nhẹ 1.03 và vòng nguyệt quế sáng lên (`drop-shadow` vàng); giảm chuyển động: chỉ đổi độ sáng.

## 5. Script và tài liệu

- **Dọn logo đối tác cũ:** thêm quy tắc vào `scripts/doi-quy-uoc-anh.mjs`: `doi-tac/doi-tac-{n}.png|svg` là ảnh mẫu thì xoá; **là logo thật thì không xoá, dừng lại và báo Kit** (Kit sẽ tự đổi tên theo hạng). Chạy `--thu` trước rồi chạy thật.
- `npm run anh-con-thieu`: các nhóm **Thí sinh theo mùa (120)**, **Ảnh Olympia (17)**, **Quán quân Hall of Fame (8)**, **Đối tác Vàng (5) / Bạc (10) / Đồng hành (10)**, cùng các nhóm cũ.
- `CLAUDE.md`, `README.md`: quy ước ảnh `o…` cho thí sinh OSS, ảnh `-win`, đối tác 3 hạng (tên file, cách đổi hạng), `ResultBadge`, nguyệt quế tự vẽ.

---

## Kiểm tra trước khi báo xong

- Build, typecheck pass; không lỗi 404 ảnh.
- Trang mùa 9: bảng Bán kết 2 có ảnh nhỏ cạnh 4 tên (Võ Danh Sơn hiện ảnh thật nếu có `s9-vo-danh-son-ss.jpg`); không còn dải 4 vòng tròn ở các trận chưa có ảnh; ở 390px tên không bị cắt.
- Hồ sơ Nghiêm Trung Đức: 3 nút Mùa 8 / Mùa 9 / O26, mặc định Mùa 9; bảng Olympia không còn cột Ngày; nhãn kết quả đúng màu như mục 2c. Hồ sơ Trương Tấn Dũng (1 mùa OSS + Olympia năm 18): 2 nút Mùa 1 / O18.
- Bảng vàng: mục THPT Sóc Sơn tại Đường lên đỉnh Olympia dùng ảnh `o…` nếu có; Hall of Fame 8 ô có vòng nguyệt quế, dòng "CHU ĐỨC HUY" / "Quán quân OSS1, OSS2", "NGHIÊM TRUNG ĐỨC" / "Quán quân OSS9".
- Trang chủ: 3 hàng đối tác 5 / 10 / 10, đúng màu viền, chạy xen kẽ chiều, dừng khi rê chuột; chữ O S S rõ hơn; câu khẩu hiệu nổi rõ.
- `npm run anh-con-thieu` in đủ các nhóm ở mục 5.
- Thử ở 1280px và 390px.

Báo lại: file đã sửa/thêm/xóa, kết quả script dọn logo, kết quả build/typecheck.
