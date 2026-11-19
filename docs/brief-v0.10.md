# Yêu cầu v0.10: quy ước ảnh mới (Kit đã duyệt)

Đọc `CLAUDE.md` trước. **Trình bày kế hoạch trước khi sửa.** Làm theo 2 đợt, xong mỗi đợt chạy `npm run build`, `npm run typecheck` rồi `git commit`:
- **Đợt 1:** mục 1–4 (code), commit "v0.10 code".
- **Đợt 2:** mục 5 (đổi tên ảnh cũ), commit "v0.10 đổi tên ảnh".

Không thêm thư viện npm. Không sửa dữ liệu thi đấu, trừ những trường ghi rõ dưới đây. Ảnh mẫu (có chuỗi `OSS-ANH-MAU`) vẫn coi là **chưa có ảnh**, như quy tắc hiện tại.

---

## 1. Ảnh thí sinh theo mùa

### 1a. Quy ước tên file (trong `public/images/thi-sinh/`)
- Thí sinh OSS, **mỗi lượt vào top 12 một ảnh** (theo từng dòng `qualifying.json`): **`s{mùa}-{slug họ tên}-{mã trường}.jpg`**
  - Ví dụ: `s10-pham-ngo-bao-minh-ss.jpg`, `s2-nguyen-thi-ngoc-anh-xg.jpg`, `s8-nguyen-thi-ngoc-anh-ss.jpg`.
  - Trường lấy từ dòng `qualifying.json` của mùa đó.
- Người chỉ thi Đường lên đỉnh Olympia (không có trong `qualifying.json`): **`o{năm Olympia nhỏ nhất}-{slug họ tên}-{mã trường}.jpg`**, vd `o17-ha-viet-hoang-ss.jpg`.
- **Slug họ tên** (viết 1 hàm dùng chung trong `src/lib/`, script Node dùng lại đúng hàm này): đổi `Đ`→`D`, `đ`→`d`; `normalize('NFD')` rồi bỏ mọi ký tự trong khoảng `̀–ͯ`; chữ thường; mọi chuỗi ký tự không thuộc `[a-z0-9]` thay bằng một dấu `-`; bỏ `-` ở đầu và cuối.
- **Mã trường** = slug của trường `short` trong `schools.json`: `ss`, `dp`, `tg`, `mp`, `xg`.
- Tổng cộng 123 file (120 lượt OSS + 3 người chỉ thi Đường lên đỉnh Olympia).
- **Kiểm tra lúc build:** script tạo danh sách ảnh tính toàn bộ tên file theo quy ước; nếu **2 lượt khác nhau ra cùng một tên file** thì dừng build và in ra 2 lượt đó.

### 1b. Chọn ảnh hiển thị
Hàm dùng chung `personPhoto(personId, season?)` trả về danh sách ảnh ứng viên theo thứ tự, chỉ lấy ảnh có thật:
- Có `season`: ảnh đúng mùa đó → ảnh các mùa khác (mới trước).
- Không có `season`: ảnh mùa mới nhất → mùa cũ hơn.
- Người chỉ thi Đường lên đỉnh Olympia: ảnh `o…`.
- Không có ảnh nào → ảnh giữ chỗ như hiện tại.

**Chỗ truyền `season`** (gắn với một mùa cụ thể):
- Dải giữ chỗ 4 thí sinh ở trên mỗi bảng Bán kết và dưới biểu đồ Chung kết (trang mùa): vòng tròn của người nào có ảnh mùa đó thì **hiện ảnh thật cắt tròn** thay cho chữ cái đầu.
- Thẻ xem nhanh khi rê chuột **trên trang mùa** (dùng mùa của trang).
- Khối "Chung kết mùa {n}" ở trang chủ.
- Thẻ Quán quân mùa n ở chế độ Thẻ trang tổng hợp các mùa (nếu có ảnh người).

**Những chỗ khác** (Hall of Fame, THPT Sóc Sơn tại Đường lên đỉnh Olympia, 2 năm liên tiếp, danh sách thí sinh, trang trường, tìm kiếm, thẻ xem nhanh ngoài trang mùa): không truyền `season` → ảnh mùa mới nhất.

### 1c. Hồ sơ thí sinh: nút chọn mùa dưới ảnh
- Chỉ hiện khi người đó có **từ 2 mùa** OSS: hàng nút ngay dưới ảnh trong ô thông tin, mỗi mùa 1 nút "Mùa {n}" (tăng dần), dạng nút bật/tắt (`aria-pressed`), cả hàng có `role="group"` và `aria-label="Ảnh theo mùa"`.
- Mặc định chọn **mùa mới nhất**. Bấm nút thì đổi ảnh (mờ chéo 200ms; giảm chuyển động: đổi tức thì). Mùa chưa có ảnh thì hiện ảnh giữ chỗ (không lấy ảnh mùa khác ở đây).
- Thử với Chu Đức Huy (Mùa 1, Mùa 2), Võ Danh Sơn (Mùa 9, Mùa 10).

## 2. Ảnh 4 ban

- Quy ước: **`public/images/ban/ban-{id}.jpg`** (`ban-chuyen-mon.jpg`, `ban-ki-thuat.jpg`, `ban-truyen-thong.jpg`, `ban-hau-can.jpg`), ngang 4:3.
- Bỏ trường `photo` trong `departments.json`, đường dẫn suy ra từ `id`. Trang Cơ cấu tổ chức dùng quy ước này.

## 3. Human of OSS: gom thư mục, đánh số ảnh

- **Một thư mục duy nhất:** `public/images/human-of-oss/`. Bỏ mọi tham chiếu tới `images/humans/`.
- Thêm trường **`"stt": số`** vào mỗi câu chuyện trong `humans.json` (Anh Chương Hải Lam: `"stt": 1`); bỏ trường `photo`. Ảnh = **`human-of-oss/{stt 2 chữ số}.jpg`** (vd `01.jpg`). Trang Human of OSS xếp theo `stt` tăng dần; build báo lỗi nếu 2 câu chuyện trùng `stt`.
- File mẫu `_mau.md` và README: cập nhật hướng dẫn (chọn `stt` tiếp theo, ảnh đặt tên theo số đó).

## 4. Trang chủ: ảnh lớn và chữ OSS lấy từ ảnh Chung kết

### 4a. Chọn mùa
- `heroSeason` = mùa **lớn nhất có ảnh Chung kết thật** (`tran-dau/oss{n}-ck.jpg`).
- 3 chữ bên trái dùng 3 mùa trước đó, cũ → mới từ trên xuống: **O = heroSeason − 3, S trên = heroSeason − 2, S dưới = heroSeason − 1** (vd ảnh lớn mùa 10 → O mùa 7, S mùa 8, S mùa 9).
- Chưa mùa nào có ảnh Chung kết: ảnh lớn dùng `hero/hero-main.jpg` nếu có, không thì nền chuyển màu và họa tiết như hiện tại; 3 chữ giữ màu chuyển sắc như hiện tại.

### 4b. Ảnh lớn
- Ảnh Chung kết của `heroSeason`, `object-fit: cover`, `filter: saturate(0.85)`. **Không làm nhoè.**
- **Lớp phủ tối** để chữ luôn đọc rõ: một lớp chuyển màu từ góc trên phải (nơi có câu khẩu hiệu, độ đậm ~75% màu tím rất đậm, vd `rgba(30,10,60,.75)`) nhạt dần về trái (~15%), cộng một dải tối mỏng ở mép dưới cho dòng chú thích. Kiểm tra tương phản chữ trắng trên nền ảnh đạt mức dễ đọc.
- Chú thích tự đổi: "Chung kết Olympia Sóc Sơn mùa {heroSeason}"; `alt` cùng nội dung.
- Hiệu ứng lật ô Vượt chướng ngại vật giữ nguyên (lật ra chính ảnh này).

### 4c. Chữ O S S
- Chữ nào có ảnh Chung kết của mùa tương ứng thì **lấp ảnh vào trong nét chữ**: `background-image` là ảnh đó, `background-size: cover`, `background-position: center`, `-webkit-background-clip: text; background-clip: text; color: transparent`. Có thể thêm lớp chuyển màu tím rất nhạt chồng lên ảnh (cùng `background`) để 3 chữ vẫn đồng bộ màu OSS.
- Chữ có ảnh thì là **link** tới trang mùa đó, `aria-label="Chung kết mùa {n}"`; rê chuột / focus hiện nhãn nhỏ "Chung kết mùa {n}" ngay cạnh chữ. Chữ chưa có ảnh: giữ màu chuyển sắc như hiện tại, không là link.
- Áp dụng cả máy tính và điện thoại (giữ bố cục chữ hiện tại).

## 5. Đổi tên ảnh cũ sang quy ước mới (đợt 2)

Viết script **`scripts/doi-quy-uoc-anh.mjs`** (chạy 1 lần), có chế độ thử **`--thu`** chỉ in ra, không đổi gì. Quy tắc:

| Ảnh cũ | Nếu là ảnh mẫu | Nếu là ảnh thật |
| --- | --- | --- |
| `thi-sinh/<person id>.jpg` | xoá | đổi sang tên **mùa mới nhất** của người đó (người chỉ thi Đường lên đỉnh Olympia: tên `o…`) |
| `humans/<slug>.jpg` | xoá | chuyển sang `human-of-oss/{stt}.jpg` theo `humans.json`; xoá thư mục `humans/` nếu trống |
| `about/ban-<id>.jpg`, `ban/<id>.jpg` | xoá | chuyển sang `ban/ban-<id>.jpg` |

- Nếu file đích **đã tồn tại**: đích là ảnh mẫu → ghi đè; đích là ảnh thật → **không** ghi đè, in cảnh báo.
- Chỉ xử lý file `.jpg`; gặp `.jpeg` / `.JPG` / `.png` trong `thi-sinh/` thì in cảnh báo, không động vào.
- Cuối cùng in bảng: đã đổi tên (cũ → mới), đã xoá, cảnh báo.
- **Quy trình:** chạy `node scripts/doi-quy-uoc-anh.mjs --thu`, **dừng lại cho Kit xem kết quả**, Kit đồng ý thì mới chạy thật, rồi `npm run anh-con-thieu`, build, commit.

## 6. Cập nhật script và tài liệu

- `npm run anh-con-thieu`: nhóm Thí sinh in theo tên mới (123 file), kèm tên người và mùa; thêm nhóm Các ban (4) và Human of OSS (10 ô, theo `HUMAN_SLOTS`); bỏ `hero/hero-main.jpg` khỏi danh sách bắt buộc (ghi là "tuỳ chọn").
- `CLAUDE.md` và `README.md`: quy ước tên ảnh thí sinh (kèm cách tự tính slug và bảng mã trường), quy tắc chọn ảnh theo mùa, ảnh ban, Human of OSS theo `stt`, ảnh lớn trang chủ lấy từ ảnh Chung kết mới nhất.

---

## Kiểm tra trước khi báo xong

- Build, typecheck pass; không lỗi 404 ảnh.
- Build dừng nếu cố tình tạo 2 tên file ảnh trùng nhau (thử bằng dữ liệu giả rồi bỏ).
- Hồ sơ Chu Đức Huy có 2 nút Mùa 1 / Mùa 2, mặc định Mùa 2; hồ sơ Phạm Ngô Bảo Minh có Mùa 9 / Mùa 10; người thi 1 mùa không có nút.
- Thả tạm 1 ảnh thật vào `thi-sinh/s9-vo-danh-son-ss.jpg`: trang mùa 9 hiện ảnh đó trong vòng tròn của Võ Danh Sơn; trang mùa 10 và Hall of Fame vẫn ảnh giữ chỗ / ảnh mùa 10 (vì ưu tiên mùa 10, mùa 10 chưa có thì dùng ảnh mùa 9 ở chỗ không gắn mùa).
- Thả tạm ảnh thật vào `tran-dau/oss10-ck.jpg` và `oss8-ck.jpg`: ảnh lớn trang chủ là mùa 10 có lớp phủ tối, chữ khẩu hiệu đọc rõ; chữ S trên (mùa 8) lấp ảnh và là link; O (mùa 7), S dưới (mùa 9) giữ màu chuyển sắc. Xoá ảnh đi thì về như cũ.
- `npm run anh-con-thieu` báo Thí sinh "đã có x / 123", Các ban "/ 4", Human of OSS "/ 10".

Báo lại: file đã sửa/thêm/xóa, kết quả script đổi tên (bảng), kết quả build/typecheck.
