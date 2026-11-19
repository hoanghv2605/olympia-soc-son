# Yêu cầu v0.8 (Kit đã duyệt)

Đọc `CLAUDE.md` trước. **Trình bày kế hoạch (file nào, sửa gì) trước khi sửa.** Xong mỗi mục chạy `npm run build` và `npm run typecheck`. Không thêm thư viện npm mới. Không sửa các file dữ liệu cũ trong `src/data/` (được **thêm** file dữ liệu mới ở mục 2). Mọi chuyển động tôn trọng `prefers-reduced-motion`.

---

## 0. Sửa lỗi (làm trước tiên)

### 0a. Bảng Bán kết: dòng "Nhất trận" bị mất tên
Dòng tô nền `oss` đang để link tên màu `oss` (chìm vào nền) và dòng "lớp - trường" màu xám. Sửa trong dòng này: link tên **màu trắng**, đậm, gạch chân trắng khi rê chuột; dòng "lớp - trường" trắng độ mờ 80%; dấu `*` câu hỏi phụ cũng trắng; vòng focus của link màu trắng. Kiểm tra cả máy tính và điện thoại, cả 10 mùa.

### 0b. Con số ấn tượng chạy từ số âm
Hiện số chạy kiểu −60415 → −6528 → 400 và mất 3–4 giây. Nguyên nhân khả năng cao: mốc thời gian bắt đầu và thời gian của `requestAnimationFrame` lệch nhau. Sửa: lấy mốc bắt đầu từ chính tham số `now` của khung hình `requestAnimationFrame` đầu tiên; `progress = clamp((now - start) / 1200, 0, 1)`; `value = round(target * easeOutCubic(progress))`. Số chỉ đi từ 0 lên giá trị thật, xong trong 1,2 giây.

### 0c. Câu khẩu hiệu trên ảnh lớn trang chủ hiện chậm
Câu "Từ đỉnh núi Sóc đến đỉnh Olympia" và chú thích ảnh phải **hiện ngay khi trang tải**, không chờ. Nếu muốn có hiệu ứng thì chỉ mờ dần tối đa 200ms, không có độ trễ.

### 0d. Thẻ xem nhanh không được gỡ
Khi ẩn, thẻ xem nhanh vẫn nằm trong trang (kể cả sau khi chuyển trang) và trình đọc màn hình vẫn đọc được. Sửa: **gỡ hẳn** khỏi DOM khi ẩn (sau hiệu ứng mờ), đóng ngay khi chuyển trang hoặc cuộn trang; khi hiện thì `aria-hidden="true"`.

### 0e. Viền focus hiện cả khi bấm chuột
Bấm chuột vào mục menu (vd "Human of OSS") hoặc nút tìm kiếm thì hiện viền focus to, nhìn như lỗi. Đổi toàn bộ style focus của header, menu điện thoại, các nút và thẻ link sang **`:focus-visible`** (chỉ hiện khi dùng bàn phím). Không bỏ viền focus cho bàn phím.

## 1. Danh sách ảnh có sẵn (bớt lỗi tải ảnh)

Hiện các trang gọi tải nhiều ảnh chưa tồn tại (vd Bảng vàng ~30 ảnh) → lỗi 404 trong console.
- Viết script `scripts/gen-image-manifest.mjs`: quét `public/images/**` và các file logo trong `public/`, ghi danh sách đường dẫn (tính từ `public/`) vào `src/data/generated/images.json` (có commit file này).
- Thêm vào `package.json`: `"predev"`, `"prebuild"`, `"pretypecheck"` đều chạy script trên.
- Viết hàm dùng chung trong `src/lib/` (vd `hasImage(path)`, `pickImage(candidates)`): mọi component ảnh (`PersonPhoto`, `Logo`, `SchoolBadge`, ảnh hero, ảnh giới thiệu, ảnh cột mốc, ảnh nhận xét, logo đối tác ở mục 2) **chỉ gọi tải ảnh có trong danh sách**; không có thì dùng ảnh giữ chỗ luôn. Giữ `onError` làm phương án dự phòng.
- README ghi rõ: thêm ảnh mới vào `public/images/...` thì **chạy lại `npm run dev`** để thấy; khi đưa lên GitHub, bản build tự cập nhật danh sách.

## 2. Trang chủ

### 2a. Thứ tự mới
Ảnh lớn → Giới thiệu → Lối vào → **Mùa gần nhất** (mới) → Bạn có biết? → **Cảm nhận về Olympia Sóc Sơn** (mới) → **Đối tác đồng hành** (mới). **Bỏ** khối "Quán quân qua các mùa" (đã có ở Bảng vàng).

### 2b. Ô OSSPEDIA trong Lối vào
Lấp khoảng trống giữa dòng số liệu và ô tìm kiếm bằng **3 lối tắt** dạng nút viền nhỏ, xếp ngang (xuống dòng nếu hẹp): "Mùa {n mới nhất}" → trang mùa đó (tự tính mùa lớn nhất), "Danh sách thí sinh" → `/wiki/thi-sinh`, "Các trường" → `/wiki/truong`.

### 2c. Mùa gần nhất
- `h2`: "Chung kết mùa {n}", dòng phụ "Ngày {dd/mm/yyyy}". `n` = mùa lớn nhất có trận Chung kết (tự tính, hiện là 10).
- Máy tính 2 cột:
  - **Trái:** thẻ Quán quân (`PersonPhoto` dọc 3:4 rộng ~120px, tên, "Quán quân · {điểm} điểm"); bên dưới 3 dòng gọn cho những người còn lại theo thứ tự danh hiệu rồi điểm: tên, danh hiệu (Á quân / Quý quân), điểm. Tên là link tới hồ sơ.
  - **Phải:** `ClimbChart` của trận đó, thêm prop `compact` (không tiêu đề, không dòng mô tả, cao ~240px, giữ nhãn cuối đường trên máy tính).
- Dưới cùng: link "Xem toàn bộ mùa {n}". Điện thoại: 1 cột, thẻ Quán quân trước, biểu đồ sau.

### 2d. Cảm nhận về Olympia Sóc Sơn (thay chỗ "Quán quân qua các mùa")

**Dữ liệu mới** `src/data/testimonials.json`, mặc định **6 mục giữ chỗ** để Kit điền sau:
```json
[
  { "id": "nhan-xet-1", "name": "Họ và tên", "role": "Vai trò với Olympia Sóc Sơn", "position": "Chức danh hiện tại", "quote": "Nội dung nhận xét đang được cập nhật." },
  … "nhan-xet-2" … "nhan-xet-6" (giống hệt, chỉ khác id)
]
```
- `name` gồm cả cách xưng hô (vd "Chị Nguyễn Văn A"); `role`, `position` không bắt buộc; `quote` cho phép nhiều đoạn, ngăn bằng `\n\n`. Thứ tự hiển thị = thứ tự trong file.
- Ảnh: `public/images/nhan-xet/<id>.jpg` (vuông, ~600×600). Chưa có ảnh: hình tròn tông màu như ảnh giữ chỗ, ở giữa icon `PiQuotes` (không dùng chữ cái đầu vì tên giữ chỗ).

**Giao diện** (tham khảo bố cục Kit gửi, nhưng dùng màu OSS):
- `h2` "Cảm nhận về Olympia Sóc Sơn".
- Mỗi trang trình chiếu: **ảnh tròn** 160px (điện thoại 120px) có 2 vòng tròn mảnh đồng tâm bao ngoài (1 vòng màu `oss` 30%, 1 vòng vàng kim 40%, lệch nhau ~12px); bên phải ảnh là **2 nhãn bo tròn** xếp dọc: nhãn 1 nền trắng, chữ `oss`: `{name}` + (nếu có) ` – ` + **`{role}` đậm**; nhãn 2 nền tím rất nhạt (`#EDE7FB`), chữ `oss-deep`: `{position}` (ẩn nếu không có).
- Dưới là **dấu ngoặc kép mở** lớn (màu vàng kim), nội dung nhận xét cỡ `1.125rem` (máy tính `1.25rem`), `line-height` 1.7, tối đa ~70 ký tự mỗi dòng; **dấu ngoặc kép đóng** ở góc dưới phải.
- Điện thoại: ảnh và 2 nhãn căn giữa, xếp dọc phía trên nội dung.
- **Chiều cao khung cố định** theo nhận xét dài nhất (xếp mọi trang chồng lên nhau trong cùng một ô lưới, chỉ hiện trang đang chọn) để trang không bị giật khi chuyển.

**Chuyển trang:**
- Hàng **chấm tròn** căn giữa bên dưới (6 chấm): chấm đang chọn màu `oss` và dài hơn (viên thuốc), các chấm khác xám nhạt. Mỗi chấm là `<button>` có `aria-label="Nhận xét {i} / {n}"`, chấm đang chọn có `aria-current="true"`.
- **Tự chuyển** sau mỗi 7 giây, quay vòng. **Dừng tự chuyển** khi rê chuột hoặc focus vào khối, khi tab trình duyệt bị ẩn; có **nút Tạm dừng / Tiếp tục** nhỏ (icon `PiPause` / `PiPlay`) cạnh hàng chấm.
- Vuốt trái/phải trên điện thoại; phím ← → khi đang focus trong khối.
- Hiệu ứng chuyển: mờ chéo + trượt nhẹ 16px, 400ms. Giảm chuyển động: **không tự chuyển**, đổi trang tức thì.
- Trợ năng: khối có `role="region"`, `aria-roledescription="carousel"`, `aria-label="Cảm nhận về Olympia Sóc Sơn"`; mỗi trang `role="group"`, `aria-roledescription="slide"`, `aria-label="{i} / {n}"`; vùng nội dung `aria-live="off"` khi đang tự chuyển, `"polite"` khi đã dừng.

### 2e. Đối tác đồng hành

**Dữ liệu mới** `src/data/partners.json`, mặc định **10 mục giữ chỗ**:
```json
[
  { "id": "doi-tac-1", "name": "Đối tác 1", "url": "" },
  … đến "doi-tac-10" / "Đối tác 10"
]
```
- Tùy chọn `"tier": "chinh"` cho đối tác chính. Logo: `public/images/doi-tac/<id>.svg` hoặc `.png` (nền trong suốt).

**Giao diện:**
- `h2` "Đối tác đồng hành", dòng phụ "Cảm ơn các đơn vị đã đồng hành cùng Olympia Sóc Sơn."
- Nền sáng như các khối khác. **Ô logo**: nền trắng, bo góc lớn, viền mảnh, 176×112px (điện thoại 136×88), logo `object-contain` cách mép 16px, giữ màu gốc. Chưa có logo: hiện tên đối tác chữ xám, căn giữa. Có `url` thì ô là link mở tab mới (`rel="noopener noreferrer"`).
- **Bố cục:** ≤ 6 đối tác → 1 hàng; nhiều hơn → **2 hàng**. Nếu có đối tác `tier: "chinh"`: hàng 1 là đối tác chính với ô to hơn (1,5 lần), hàng 2 là còn lại; nếu không có thì chia đôi danh sách. Mặc định 10 → 2 hàng × 5.
- **Hiệu ứng chạy:** mỗi hàng trôi ngang liên tục, **hai hàng ngược chiều nhau** (hàng 1 sang trái, hàng 2 sang phải), tốc độ đều ~30px/giây (thời lượng tính theo bề rộng nội dung). Nhân bản danh sách đủ để vòng lặp liền mạch, các bản sao `aria-hidden="true"` và `tabIndex={-1}`. Hai mép trái phải mờ dần (`mask-image`). **Dừng khi rê chuột hoặc focus** vào hàng.
- Giảm chuyển động: không chạy, các ô xếp lưới căn giữa, không nhân bản.

## 3. Bảng vàng: "Các thí sinh vào Chung kết 2 năm liên tiếp"

- **Chuyển trái/phải bằng mũi tên:**
  - Trạng thái "dải đang mở" (`activeIndex`). Rê chuột vào dải nào thì dải đó mở (như hiện tại).
  - **Phím ← →**: khi chuột đang nằm trong khối, hoặc khi một dải đang được focus, bấm ← → để mở dải bên trái/phải (quay vòng từ đầu sang cuối). Chặn cuộn ngang mặc định của phím. Nếu đang focus thì focus đi theo dải được mở.
  - **Nút mũi tên trên màn hình**: 2 nút tròn 40px (`PiCaretLeft`, `PiCaretRight`, `aria-label` "Thí sinh trước" / "Thí sinh sau") ở hai mép khối, giữa theo chiều dọc. Máy tính: hiện khi rê chuột hoặc focus trong khối; điện thoại: luôn hiện. Chưa có dải nào mở thì ← mở dải cuối, → mở dải đầu.
  - Rời chuột khỏi khối (và không còn focus bên trong) → về trạng thái các dải đều nhau.
- **Tỉ lệ bề rộng:** dải đang mở `flex-grow: 4`, dải khác `flex-grow: 1` với bề rộng tối thiểu 56px (hiện các dải thu lại quá mỏng, chữ không đọc được). Dải thu lại hiện **tên người theo chiều dọc** (`writing-mode: vertical-rl`, xoay để đọc từ dưới lên), chữ trắng cỡ nhỏ trên lớp chuyển màu tối.
- **Chữ cái đầu của ảnh giữ chỗ** quá to khi dải mở rộng (vd "SH" chiếm cả khung). Sửa trong `PersonPhoto`: đặt `container-type: size` cho khung, cỡ chữ `clamp(1.25rem, 28cqmin, 6rem)` để theo cạnh **ngắn** của khung.
- Điện thoại: giữ hàng vuốt ngang; nút mũi tên cuộn tới dải trước/sau và mở dải đó.

## 4. Bảng Vòng loại: bỏ cột "Nhóm hạt giống"

Bỏ cột "Nhóm hạt giống" (điện thoại là "Nhóm") ở bảng Vòng loại **cả 10 mùa**, cả máy tính và điện thoại. Giữ nguyên đoạn mô tả cách chia nhóm phía trên bảng.

## 5. Human of OSS: 10 ô

- Hằng số `HUMAN_SLOTS = 10` (một chỗ duy nhất). Trang hiện các câu chuyện thật trước, rồi **thêm ô giữ chỗ cho đủ 10** (có từ 10 câu chuyện trở lên thì không còn ô giữ chỗ).
- Lưới: máy tính 3 cột, máy tính bảng 2 cột, điện thoại 1 cột; mọi ô cùng chiều cao với thẻ thật.
- **Ô giữ chỗ:** viền nét đứt màu `oss` 30%, vùng ảnh là ảnh giữ chỗ tông nhạt với icon `PiPenNib` mờ ở giữa, tiêu đề "Câu chuyện sắp ra mắt", dòng phụ "Một gương mặt của Olympia Sóc Sơn sẽ xuất hiện tại đây." Không phải link, không focus được, `aria-hidden="true"`; thêm 1 dòng `sr-only` "Còn {k} câu chuyện sắp ra mắt."
- Số "{n} câu chuyện" ở ô Lối vào trang chủ vẫn chỉ đếm câu chuyện thật.
- Tạo file mẫu `src/content/human-of-oss/_mau.md` (bộ nạp nội dung **bỏ qua** file bắt đầu bằng `_`) kèm mẫu dòng cần thêm vào `humans.json`, để Kit chép ra khi viết bài mới.

## 6. Cập nhật tài liệu

- `CLAUDE.md`: danh sách ảnh tự sinh và quy tắc chỉ tải ảnh có trong danh sách; `testimonials.json`, `partners.json` (trường dữ liệu, đường dẫn ảnh/logo); **chỉ đăng nhận xét, ảnh và logo khi người/đơn vị đó đồng ý**; quy tắc `HUMAN_SLOTS`; `:focus-visible`.
- `README.md`: hướng dẫn từng bước **thêm một nhận xét**, **thêm/sửa một đối tác** (gồm `tier: "chinh"`), **thêm một câu chuyện Human of OSS** (từ file `_mau.md`), và nhắc chạy lại `npm run dev` sau khi thêm ảnh.

---

## Kiểm tra trước khi báo xong

- `npm run build` và `npm run typecheck` pass; trang Bảng vàng và trang chủ **không còn lỗi 404 ảnh** trong console.
- Bảng Bán kết mùa 4 và mùa 10: dòng Nhất trận đọc rõ tên (chữ trắng), ở 1280px và 390px.
- Về chúng tôi: số chạy từ 0 lên 10 / 400+ / 7 / 6 / 1 trong ~1,2 giây, không có số âm.
- Trang chủ: câu khẩu hiệu hiện ngay; thứ tự khối đúng mục 2a; không còn "Quán quân qua các mùa"; khối Mùa gần nhất ra mùa 10 (Phạm Ngô Bảo Minh 195; Nguyễn Tuấn Hùng 180, Võ Danh Sơn 180 Á quân; Trương Tuấn Minh 30 Quý quân) kèm biểu đồ.
- Cảm nhận: 6 chấm; tự chuyển mỗi 7 giây; dừng khi rê chuột; bấm chấm, nút tạm dừng, phím ← → và vuốt đều chạy; khung không đổi chiều cao khi chuyển.
- Đối tác: 2 hàng × 5 chạy ngược chiều, dừng khi rê chuột; bật giảm chuyển động thì thành lưới tĩnh.
- Bảng vàng: rê chuột vào 1 dải rồi bấm ← → chuyển được sang dải bên cạnh; nút mũi tên chạy; dải thu lại đọc được tên dọc; chữ cái đầu không còn chiếm cả khung.
- Vòng loại cả 10 mùa không còn cột Nhóm hạt giống.
- Human of OSS: 1 thẻ thật + 9 ô "Câu chuyện sắp ra mắt".
- Bấm chuột vào mục menu không còn hiện viền focus; dùng Tab vẫn có viền.

Báo lại: file đã sửa/thêm/xóa, kết quả build/typecheck, những chỗ phải xử lý khác brief (nếu có) và lý do.
