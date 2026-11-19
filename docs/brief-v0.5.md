# Yêu cầu v0.5 (Kit đã duyệt)

Đọc `CLAUDE.md` trước. **Trình bày kế hoạch (file nào, sửa gì) trước khi sửa.** Xong mỗi mục chạy `npm run build` và `npm run typecheck`. Không thêm thư viện mới (icon dùng `react-icons` đã có). Không sửa dữ liệu trong `src/data/`.

---

## 1. Tên vòng và kết quả: bỏ viết tắt trên toàn web

### 1a. Hai hàm dùng chung (đặt trong `src/lib/`, mọi chỗ hiển thị đều gọi qua đây)

- `roundLabel(...)`: tên vòng đầy đủ
  - vòng loại → **"Vòng loại"**
  - bán kết số n → **"Bán kết n"** (vd "Bán kết 3")
  - chung kết → **"Chung kết"**
- `resultLabel(...)`: kết quả của một thí sinh ở một vòng
  - Vòng loại → **"Hạng {rank}"** (giữ như hiện tại)
  - Bán kết, lấy theo `rank` trong `matches.json`: `1` → **"Giải Nhất"**, `2` → **"Giải Nhì"**, `3` hoặc `4` → **"Giải Ba"**. Đồng hạng thì cùng giải (`rank` đã xử lý sẵn đồng hạng và câu hỏi phụ, không tự tính lại).
  - Chung kết, lấy theo `placement`: `vo-dich` → **"Quán quân"**, `a-quan` → **"Á quân"**, `giai-ba` → **"Quý quân"**.
- Không còn chỗ nào hiện "Vào Chung kết" hay "Hạng N" cho Bán kết.

### 1b. Quét toàn bộ chữ hiển thị trong `src/` (trừ `src/data/`)

Thay mọi chữ viết tắt **đang hiện ra cho người xem**:

| Đang ghi | Đổi thành |
| --- | --- |
| `BK3`, `BK 3` | `Bán kết 3` |
| `CK` | `Chung kết` |
| `VL` | `Vòng loại` |
| `ĐLĐO` | `Đường lên đỉnh Olympia` |

Ví dụ bảng Kỷ lục: "Mùa 6, BK3" → **"Mùa 6, Bán kết 3"**; "Mùa 9, CK" → **"Mùa 9, Chung kết"**.
**Không đụng** vào id, key, tên biến, class CSS (vd `oss7-bk2`, `ban-ket`). Báo lại danh sách các chỗ đã thay.

**Giữ nguyên (ngoại lệ có chủ đích):**
- "OSS", "THPT".
- Chữ viết tắt trường (`short`: SS, ĐP, …) **chỉ** dùng trong huy hiệu tròn ở mục 4, luôn có tên đầy đủ đứng cạnh.
- Tiêu đề cột điểm **KĐ, VCNV, TT, VĐ** trong các bảng (viết đầy đủ sẽ vỡ bề ngang trên điện thoại). Xử lý theo 1c.

### 1c. Tiêu đề cột KĐ / VCNV / TT / VĐ

- Bọc bằng `<abbr title="Khởi động">KĐ</abbr>`, tương tự "Vượt chướng ngại vật", "Tăng tốc", "Về đích"; con trỏ rê vào hiện tên đầy đủ.
- Trên trang mùa, thêm vào **dòng chú thích màu đã có phía trên các bảng Bán kết** một dòng chữ nhỏ: `KĐ: Khởi động · VCNV: Vượt chướng ngại vật · TT: Tăng tốc · VĐ: Về đích` (để người dùng điện thoại, không rê chuột được, vẫn biết).
- 6 ô Kỷ lục ở Bảng vàng: tên ô viết đầy đủ ("Khởi động", "Vượt chướng ngại vật", …), không viết tắt.

## 2. Hồ sơ thí sinh (`/wiki/thi-sinh/:id`): bảng thành tích OSS

- **Cột Vòng:** dùng `roundLabel` → "Vòng loại", "Bán kết 1", "Chung kết".
- **Cột Kết quả:** dùng `resultLabel`. Giữ cách tô màu / `MedalBadge` hiện có của dòng Chung kết.
- Kiểm tra:

| Thí sinh | Mùa | Vòng | Kết quả |
| --- | --- | --- | --- |
| Nghiêm Trung Đức | 8 | Vòng loại | Hạng 5 |
| | 8 | Bán kết 1 | Giải Ba (thua câu hỏi phụ, cùng 150) |
| | 9 | Vòng loại | Hạng 1 |
| | 9 | Bán kết 1 | Giải Nhất |
| | 9 | Chung kết | Quán quân |
| Phạm Ngô Bảo Minh | 9 | Bán kết 3 | Giải Ba (hạng 4) |
| | 10 | Bán kết 1 | Giải Nhất |
| | 10 | Chung kết | Quán quân |
| Nguyễn Thị Ngọc Ánh (THPT Sóc Sơn) | 8 | Bán kết 2 | Giải Nhì (đồng hạng 2) |
| Nguyễn Đức Minh | 8 | Bán kết 3 | Giải Ba (đồng hạng 3) |

## 3. Bảng vàng: mục "THPT Sóc Sơn tại Đường lên đỉnh Olympia"

- **Dòng nhỏ dưới tên trên mọi thẻ** thống nhất là **"Olympia năm thứ N"** (cả thí sinh OSS lẫn không thi OSS), vì đây là thành tích tại Olympia. N = năm Olympia (`year`) của thí sinh đó trong `olympia.json`; nếu một người có nhiều năm thì ghi tăng dần, cách nhau dấu phẩy ("Olympia năm thứ 17, 18").
- **Hộp nổi khi bấm thẻ:** dòng dưới tên cũng là "Olympia năm thứ N". Với thí sinh OSS, thêm 1 dòng nhỏ **"Thí sinh OSS mùa {các mùa có trong `qualifying.json`}"** (vd Chu Đức Huy: "Thí sinh OSS mùa 1, 2"). Người không thi OSS không có dòng này.
- Thứ tự thẻ, nút chọn Toàn bộ / Từ OSS, số liệu 10 / 9 / 2 và 7 / 6 / 1: giữ nguyên.
- Kiểm tra (Toàn bộ thí sinh): Đặng Hồng Thái 7, Nguyễn Hoàng Phi 13, Hà Việt Hoàng 17, Hoàng Đức Thái 18, Chu Đức Huy 19, Trần Hải Linh 20, Nguyễn Thùy Dương 21, Nguyễn Việt Thành 23, Lê Trà My 24, Nghiêm Trung Đức 26.

## 4. Trang Các trường (OSSPEDIA): thay bảng bằng thẻ trường

Bỏ bảng hiện tại. Thay bằng danh sách thẻ, mỗi trường 1 thẻ. Mọi con số tự tính từ dữ liệu.

### 4a. Bố cục chung
- Dưới tiêu đề trang: 1 câu ngắn tự tính, vd **"91 thí sinh từ 5 trường đã vào top 12 qua 10 mùa OSS."**
- Thẻ xếp **1 cột**, rộng theo khung nội dung của trang, khoảng cách giữa thẻ 12–16px.
- Sắp xếp: số lượt vào top 12 giảm dần → số thí sinh giảm dần → tên trường.
- **Cả thẻ là 1 link** tới trang chi tiết trường (như hiện tại). Nền và bo góc theo kiểu thẻ đang dùng trên site, viền mảnh. Rê chuột / focus: viền chuyển màu `oss`, thẻ nhấc nhẹ (`translateY(-2px)`), có vòng focus rõ khi dùng Tab. `prefers-reduced-motion`: không nhấc, chỉ đổi viền.

### 4b. Nội dung một thẻ

```
Máy tính (≥ md):
┌──────────────────────────────────────────────────────────────────┐
│ (SS)  THPT Sóc Sơn                        (10)    (9)     (13)    │
│       67 thí sinh · 92 lượt vào top 12    Quán quân Á quân Quý quân│
│ ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬░░░░░░░░░░░░  77%  │
└──────────────────────────────────────────────────────────────────┘

Điện thoại (< md):
┌──────────────────────────────┐
│ (SS)  THPT Sóc Sơn            │
│       67 thí sinh · 92 lượt   │
│       vào top 12              │
│ (10)      (9)       (13)      │
│ Quán quân Á quân    Quý quân  │
│ ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬░░░░░  77% │
└──────────────────────────────┘
```

- **Huy hiệu trường** (component mới `SchoolBadge`, dùng lại ở 4c): hình tròn 56px (điện thoại 44px).
  - Có logo: thử lần lượt `public/images/truong/<id>.svg` → `public/images/truong/<id>.png` (chuyển file kế tiếp khi lỗi tải); ảnh `object-contain` trên nền trắng, `alt=""` (tên trường đã đứng cạnh).
  - Chưa có logo: nền tím nhạt, chữ `short` của trường (SS, ĐP, TG, MP, XG) màu tím đậm, chữ đậm.
  - Id trường: `soc-son`, `da-phuc`, `trung-gia`, `minh-phu`, `xuan-giang`. Hiện chưa có file logo nào: tất cả đang hiện chữ.
- **Tên trường** đầy đủ, chữ đậm, cỡ lớn hơn chữ thường một bậc. Dưới tên: dòng nhỏ màu chữ phụ **"{số thí sinh} thí sinh · {số lượt} lượt vào top 12"**.
- **3 ô huy chương** (căn phải trên máy tính, thành 1 hàng riêng trên điện thoại): mỗi ô là vòng tròn màu vàng / bạc / đồng (dùng token gold / silver / bronze đã có) chứa con số, nhãn nhỏ bên dưới "Quán quân" / "Á quân" / "Quý quân". Số **0** → cả ô mờ (khoảng 35% độ đậm), vẫn giữ chỗ để các thẻ thẳng cột. Mỗi ô có `aria-label`, vd "10 Quán quân".
- **Thanh tỉ lệ** ở đáy thẻ: cao ~6px, bo tròn, nền tím rất nhạt; phần tô màu `oss` = lượt top 12 của trường ÷ tổng lượt top 12 (120). Bên phải thanh ghi nhỏ phần trăm làm tròn số nguyên. Thanh có `role="img"` và `aria-label`, vd "Chiếm 77% trong 120 lượt vào top 12".

### 4c. Trang chi tiết trường
Thêm `SchoolBadge` (cỡ 64px) cạnh tên trường ở đầu trang. Phần còn lại giữ nguyên.

### 4d. Số liệu phải ra đúng

| Trường | Thí sinh | Lượt top 12 | Quán quân | Á quân | Quý quân | Tỉ lệ |
| --- | --- | --- | --- | --- | --- | --- |
| THPT Sóc Sơn | 67 | 92 | 10 | 9 | 13 | 77% |
| THPT Đa Phúc | 14 | 17 | 0 | 1 | 5 | 14% |
| THPT Trung Giã | 6 | 6 | 0 | 0 | 1 | 5% |
| THPT Minh Phú | 3 | 4 | 0 | 1 | 0 | 3% |
| THPT Xuân Giang | 1 | 1 | 0 | 0 | 0 | 1% |

## 5. Icon (chỉ ở tiêu đề và nhãn, không lạm dụng)

### 5a. Quy tắc
- Icon mới dùng bộ **Phosphor** (`react-icons/pi`), nét thường (không Fill/Bold). Icon đã có ở chỗ khác (vd ô Con số ấn tượng): giữ nguyên.
- Mỗi nhãn / tiêu đề **tối đa 1 icon**, đứng trước chữ, `aria-hidden="true"`, căn giữa theo dòng chữ (`inline-flex items-center gap-2`).
- **Không** đặt icon trong ô bảng, dòng danh sách, đoạn văn, menu, nút bấm, hay thẻ trường ở mục 4.
- Cỡ và màu: nhãn trong ô thông tin 16px, màu chữ phụ; tiêu đề mục ~0.9em cỡ chữ tiêu đề, màu `oss` (trên nền tối của Hall of Fame dùng màu vàng kim); ô Kỷ lục 20px, màu `oss`.

### 5b. Vị trí

| Vị trí | Nhãn → icon |
| --- | --- |
| Ô thông tin trang mùa | Thời gian → `PiCalendarBlank` · Dẫn chương trình → `PiMicrophone` · Địa điểm → `PiMapPin` · Quán quân → `PiCrown` |
| Ô thông tin hồ sơ thí sinh | Trường → `PiGraduationCap` · Mùa tham dự → `PiCalendarBlank` · Danh hiệu OSS → `PiTrophy` · Tham dự Đường lên đỉnh Olympia → `PiTelevisionSimple` |
| Tiêu đề các mục Bảng vàng | Quán quân các mùa → `PiTrophy` · THPT Sóc Sơn tại Đường lên đỉnh Olympia → `PiTelevisionSimple` · Kỷ lục → `PiChartBar` · Các thí sinh vào Chung kết 2 năm liên tiếp → `PiRepeat` |
| 6 ô Kỷ lục | Vòng loại → `PiClipboardText` · Khởi động → `PiLightning` · Vượt chướng ngại vật → `PiPuzzlePiece` · Tăng tốc → `PiRocketLaunch` · Về đích → `PiFlagCheckered` · Tổng điểm → `PiTrophy` |
| Trang chủ OSSPEDIA, 3 khối | Các mùa giải → `PiCalendarBlank` · Thí sinh → `PiUsersThree` · Các trường → `PiGraduationCap` |

Nếu tên component nào không có trong phiên bản `react-icons` đang cài, chọn icon Phosphor gần nghĩa nhất và ghi lại trong báo cáo. Ô thông tin nào không hiện dòng đó (vd hồ sơ không có Danh hiệu OSS) thì đương nhiên không có icon.

## 6. Cập nhật tài liệu

- `CLAUDE.md`, thêm:
  - Không viết tắt tên vòng trong giao diện; luôn dùng `roundLabel` / `resultLabel`. Kết quả Bán kết = Giải Nhất / Nhì / Ba theo `rank` (3 và 4 đều là Giải Ba). Ngoại lệ: tiêu đề cột KĐ / VCNV / TT / VĐ dùng `<abbr>`.
  - Dòng dưới tên trên thẻ Đường lên đỉnh Olympia = "Olympia năm thứ N".
  - Quy tắc icon ở mục 5a.
  - Quy ước logo trường `public/images/truong/<id>.svg|png`.
- `README.md`: thêm mục logo trường (thư mục, tên file theo id, svg hoặc png, kích thước gợi ý vuông ~256×256, nền trong suốt).

---

## Kiểm tra trước khi báo xong

- `npm run build` và `npm run typecheck` pass.
- Tìm trong `src/` (trừ `src/data/`): không còn chữ hiển thị "BK", "CK", "VL", "ĐLĐO", "Vào Chung kết" (trừ id/key/class).
- Hồ sơ Nghiêm Trung Đức, Phạm Ngô Bảo Minh, Nguyễn Thị Ngọc Ánh (THPT Sóc Sơn), Nguyễn Đức Minh đúng như bảng mục 2.
- Bảng Kỷ lục ghi "Bán kết n" / "Chung kết" / "Vòng loại"; số dòng và màu huy chương không đổi (Vòng loại 11, Khởi động 12, Vượt chướng ngại vật 10, Tăng tốc 11, Về đích 11, Tổng điểm 11).
- Mục THPT Sóc Sơn tại Đường lên đỉnh Olympia: 10 thẻ đúng năm như mục 3; hộp nổi của Chu Đức Huy có "Thí sinh OSS mùa 1, 2", của Hà Việt Hoàng thì không.
- Trang Các trường: 5 thẻ đúng thứ tự và số liệu bảng 4d; ô huy chương số 0 bị mờ; cả 5 trường đang hiện chữ viết tắt (chưa có logo). Thử thả tạm 1 ảnh bất kỳ tên `public/images/truong/soc-son.png` → thẻ Sóc Sơn hiện ảnh; xóa đi → về chữ.
- Icon đúng các vị trí ở 5b, không xuất hiện ở chỗ khác ngoài icon đã có từ trước.
- Thử ở 1280px và 390px; Tab tới được từng thẻ trường, có vòng focus; rê chuột vào KĐ hiện "Khởi động".

Báo lại: file đã sửa/thêm/xóa, danh sách chỗ đã thay chữ viết tắt, icon nào phải đổi tên, kết quả build/typecheck, các số đã đối chiếu.
