# Yêu cầu v0.4 (Kit đã duyệt)

Đọc `CLAUDE.md` trước. **Trình bày kế hoạch (file nào, sửa gì) trước khi sửa.** Xong mỗi mục chạy `npm run build` và `npm run typecheck`. Không thêm thư viện mới.

---

## 1. Bảng Bán kết và Chung kết (trang mùa, cả 10 mùa)

- **Bỏ cột "Kết quả" và cột "Trường"** ở cả bảng Bán kết và bảng Chung kết.
- Dòng phụ dưới tên thí sinh đổi thành **`{lớp} - {tên trường đầy đủ}`**, ví dụ `11A1 - THPT Sóc Sơn`.
- Thứ tự thí sinh vẫn giữ đúng như `matches.json` (không sắp xếp). Giữ cách tô màu hiện có:
  - Bán kết: người Nhất tô tím đậm, người Nhì cao điểm nhất (đi tiếp) tô tím nhạt.
  - Chung kết: Quán quân vàng, Á quân bạc, Quý quân đồng.
- Thêm **1 dòng chú thích màu phía trên các bảng Bán kết** (chỉ 1 lần cho cả vòng): ô màu tím đậm "Nhất trận, vào Chung kết" và ô màu tím nhạt "Nhì cao điểm nhất, vào Chung kết". Mỗi dòng được tô màu có thêm chữ ẩn cho trình đọc màn hình (`sr-only`) nói kết quả tương ứng (vd "Nhất trận, vào Chung kết", "Quán quân").
- **Câu hỏi phụ:** bỏ nhãn "Thắng câu hỏi phụ" trong bảng. Thay bằng **1 dòng chú thích dưới bảng** (cùng kiểu chữ nhỏ như chú thích ở bảng kỷ lục), đặt dấu `*` sau tên người thắng trong bảng:
  `* {người thắng} thắng câu hỏi phụ trước {những người bằng điểm}.`
  Người bằng điểm = các thí sinh cùng trận có `total` bằng người thắng. Có 3 trận như vậy:
  - Chung kết mùa 4: Nguyễn Thùy Dương thắng trước Trần Kim Cương (220)
  - Bán kết 2 mùa 7: Lê Quang Hưng thắng trước Lê Minh Khôi (140)
  - Bán kết 1 mùa 8: Nguyễn Hữu Phú An thắng trước Nghiêm Trung Đức (150)

## 2. Hồ sơ thí sinh (`/wiki/thi-sinh/:id`)

- Cột ảnh + ô thông tin bên phải phải **bắt đầu ngang hàng với tên thí sinh** (tên nằm trong cột trái, không chiếm cả hàng phía trên).
- Trong ô thông tin: **chỉ hiện dòng "Danh hiệu OSS" khi có danh hiệu** và **chỉ hiện dòng "Tham dự Đường lên đỉnh Olympia" khi có dữ liệu**. Bảng "Đường lên đỉnh Olympia" bên trái cũng chỉ hiện khi có dữ liệu.
- Thành tích có `beforeOss: true` (mục 3) hiển thị chú thích nhỏ "Tham gia trước khi dự thi OSS" ngay dòng đó.

## 3. Bổ sung dữ liệu

### 3a. `src/data/olympia.json`: thêm trường tùy chọn `beforeOss?: boolean` vào kiểu dữ liệu, và cho phép `ossSeason: number | null` (`null` = thí sinh không thi OSS). Thêm các dòng sau, giữ nguyên các dòng cũ:

```json
{ "person": "nguyen-thi-ngoc-anh-xuan16", "ossSeason": 2, "year": 18, "stage": "tuan", "round": "Tuần 3 - Tháng 3 - Quý 1", "result": "Giải Ba", "note": null, "beforeOss": true },
{ "person": "phan-huy-cuong", "ossSeason": 4, "year": 22, "stage": "tuan", "round": "Tuần 2 - Tháng 1 - Quý 2", "result": "Giải Nhất", "note": null },
{ "person": "phan-huy-cuong", "ossSeason": 4, "year": 22, "stage": "thang", "round": "Tháng 1 - Quý 2", "result": "Giải Ba", "note": null },
{ "person": "dang-hong-thai", "ossSeason": null, "year": 7, "stage": "tuan", "round": "Tuần ? - Tháng ? - Quý ?", "result": "Giải Ba", "note": null },
{ "person": "nguyen-hoang-phi", "ossSeason": null, "year": 13, "stage": "tuan", "round": "Tuần 2 - Tháng 1 - Quý 4", "result": "Giải Ba", "note": null },
{ "person": "ha-viet-hoang", "ossSeason": null, "year": 17, "stage": "tuan", "round": "Tuần 3 - Tháng 1 - Quý 2", "result": "Giải Nhất", "note": null },
{ "person": "ha-viet-hoang", "ossSeason": null, "year": 17, "stage": "thang", "round": "Tháng 1 - Quý 2", "result": "Giải Nhất", "note": null },
{ "person": "ha-viet-hoang", "ossSeason": null, "year": 17, "stage": "quy", "round": "Quý 2", "result": "Giải Nhất", "note": "Cầu truyền hình Chung kết Đường lên đỉnh Olympia lần đầu tiên của THPT Sóc Sơn" },
{ "person": "ha-viet-hoang", "ossSeason": null, "year": 17, "stage": "nam", "round": "Chung kết năm", "result": "Quý quân", "note": null }
```

### 3b. `src/data/people.json`: thêm 3 người (không thi OSS):

```json
{ "id": "dang-hong-thai", "name": "Đặng Hồng Thái", "school": "soc-son" },
{ "id": "nguyen-hoang-phi", "name": "Nguyễn Hoàng Phi", "school": "soc-son" },
{ "id": "ha-viet-hoang", "name": "Hà Việt Hoàng", "school": "soc-son" }
```

### 3c. Quy tắc dùng dữ liệu (thêm vào `src/lib/data.ts`)
- **Thí sinh OSS** = người có ít nhất 1 dòng trong `qualifying.json`. OSSPEDIA (danh sách thí sinh, tìm kiếm, trang trường, hồ sơ) **chỉ dùng thí sinh OSS**: vẫn là 91 người. Truy cập hồ sơ của người không thi OSS → trang 404. 3 người mới không có trang hồ sơ.
- **Cầu truyền hình tính tự động** = số dòng `olympia.json` có `stage: "quy"` và `result: "Giải Nhất"`. Bỏ giá trị nhập tay của `tvBridges` trong `stats.json`, chuyển sang tự tính.
- **Phạm vi "từ OSS"** = dòng có `ossSeason` khác `null` và không có `beforeOss: true`. **Phạm vi "toàn bộ"** = mọi dòng. Cả hai đều lọc theo trường THPT Sóc Sơn khi nói về THPT Sóc Sơn.
- Hàm tính số thí sinh / vòng nguyệt quế / cầu truyền hình nhận tham số phạm vi trường và phạm vi thời gian.

## 4. Con số ấn tượng (trang Giới thiệu)

Giữ cách tính **từ OSS**: 7 thí sinh, 6 vòng nguyệt quế, 1 cầu truyền hình (cả 3 số đều tự tính). Đổi nhãn nhóm thứ hai thành **"Thí sinh OSS của THPT Sóc Sơn tại Đường lên đỉnh Olympia"**.

## 5. Bảng vàng

### 5a. Quán quân các mùa → kiểu Hall of Fame
- Mảng **nền tối** (`paper-dark`), điểm nhấn **vàng kim** (dùng token màu vàng đã có; viền thẻ, số mùa, tiêu đề nhỏ). Tiêu đề giữ "Quán quân các mùa".
- **Mỗi người 1 thẻ** (8 thẻ), xếp theo mùa vô địch đầu tiên: ảnh `PersonPhoto` dọc 3:4, tên, và **các huy hiệu mùa** dạng chip vàng, mỗi chip ghi `Mùa {n} · {điểm CK}` (vd Chu Đức Huy: `Mùa 1 · 210`, `Mùa 2 · 265`). Người vô địch nhiều mùa có thêm dòng nhỏ "{k} lần Quán quân". Bấm thẻ → hồ sơ OSSPEDIA.
- Máy tính 4 cột, điện thoại 2 cột. Kiểm tra: Chu Đức Huy (1: 210, 2: 265), Trần Hải Linh (3: 165), Nguyễn Thùy Dương (4: 220), Nguyễn Việt Thành (5: 220, 6: 290), Lê Trà My (7: 250), Nguyễn Minh Chính (8: 240), Nghiêm Trung Đức (9: 290), Phạm Ngô Bảo Minh (10: 195).

### 5b. THPT Sóc Sơn tại Đường lên đỉnh Olympia
- **Đổi tiêu đề** thành "THPT Sóc Sơn tại Đường lên đỉnh Olympia".
- **2 nút chọn dưới tiêu đề** (dạng nút bật/tắt, `aria-pressed`): **Toàn bộ thí sinh** (mặc định) · **Các thí sinh từ OSS**. Dòng số liệu nhỏ đổi theo lựa chọn:

| Lựa chọn | Thí sinh | Vòng nguyệt quế | Cầu truyền hình |
| --- | --- | --- | --- |
| Toàn bộ thí sinh | 10 | 9 | 2 |
| Các thí sinh từ OSS | 7 | 6 | 1 |

- Chỉ thí sinh trường **THPT Sóc Sơn**. Xếp theo năm Olympia đầu tiên (Đặng Hồng Thái, Nguyễn Hoàng Phi, Hà Việt Hoàng, Hoàng Đức Thái, Chu Đức Huy, …).
- **Thiết kế lại thẻ** (bớt cứng): ảnh tràn hết thẻ (dọc 3:4), **tên nằm đè lên phần dưới ảnh** trên lớp chuyển màu tối, ngay dưới tên là dòng nhỏ "OSS mùa N" (người không thi OSS: "Olympia năm thứ N") và **hàng chấm huy chương**. **Không hiện thành tích trên thẻ.** Bo góc lớn hơn, không viền cứng; rê chuột/focus thì thẻ nhấc nhẹ lên và đổ bóng mềm. Máy tính 5 cột, điện thoại 2 cột.
- Bấm thẻ → hộp nổi như hiện tại (ảnh, tên, toàn bộ thành tích có `MedalBadge`, ghi chú). Nút **"Xem hồ sơ đầy đủ" chỉ hiện với thí sinh OSS**. Thành tích `beforeOss` có chú thích "Tham gia trước khi dự thi OSS".

### 5c. Các thí sinh vào Chung kết 2 năm liên tiếp
- **Đổi tiêu đề** từ "Vào Chung kết nhiều lần" thành "Các thí sinh vào Chung kết 2 năm liên tiếp". Danh sách **tự tính** = người có trong Chung kết mùa n và mùa n+1.
- **Kiểu hiển thị: dải ảnh hình bình hành nghiêng sang phải, đặt sát nhau trên 1 hàng** (7 dải). Khung nghiêng bằng `skewX(-12deg)` (hoặc `clip-path`), ảnh bên trong nghiêng ngược lại để **mặt người không bị méo**; ảnh dùng `PersonPhoto`.
- **Rê chuột / focus vào 1 dải → dải đó giãn rộng ra** (vd `flex-grow` tăng, chuyển động ~250ms), các dải khác co lại và hơi tối đi; trên dải đang mở hiện tên + 2 mùa kèm danh hiệu, vd "Mùa 3: Quý quân · Mùa 4: Á quân". Rời chuột thì về trạng thái đều nhau. Mỗi dải focus được bằng Tab và là link tới hồ sơ.
- **Điện thoại (dưới `md`):** dải nằm trong hàng vuốt ngang (scroll-snap), chạm vào dải để giãn ra (chạm dải khác thì dải cũ thu lại); không ép 7 dải vào bề ngang màn hình.
- Tôn trọng `prefers-reduced-motion` (không chuyển động, chỉ đổi trạng thái).
- Kiểm tra danh hiệu: Chu Đức Huy (1 Quán quân, 2 Quán quân), Trần Kim Cương (3 Quý quân, 4 Á quân), Nguyễn Thùy Dương (3 Á quân, 4 Quán quân), Nguyễn Đoàn Hồng Thái (5 Á quân, 6 Á quân), Nguyễn Sỹ Hoàng (5 Quý quân, 6 Quý quân), Nguyễn Việt Thành (5 Quán quân, 6 Quán quân), Võ Danh Sơn (9 Quý quân, 10 Á quân).

Các phần khác của Bảng vàng (Kỷ lục) giữ nguyên.

## 6. Logo: hỗ trợ cả SVG và PNG

- Đổi tên logo tạm hiện tại `public/logo-oss.svg` thành **`public/logo-oss-tam.svg`** (dùng `git mv`).
- Component `Logo` thử lần lượt: `logo-oss.svg` → `logo-oss.png` → `logo-oss-tam.svg` (chuyển sang file kế tiếp khi ảnh lỗi tải). Kit chỉ cần thả logo thật tên `logo-oss.svg` **hoặc** `logo-oss.png` vào `public/`.
- Favicon: chọn theo cùng thứ tự bằng một đoạn script nhỏ lúc tải trang (thử tải ảnh, file nào tải được thì gán vào `<link rel="icon">`); trong `index.html` để sẵn `logo-oss-tam.svg` làm mặc định.

## 7. Cập nhật tài liệu

- `CLAUDE.md`: thêm quy tắc "thí sinh OSS", phạm vi "từ OSS"/"toàn bộ", cầu truyền hình tự tính, trường `beforeOss` và `ossSeason: null`, quy ước logo.
- `README.md`: cập nhật mục logo và mục dữ liệu `olympia.json`.

---

## Kiểm tra trước khi báo xong

- `npm run build` và `npm run typecheck` pass.
- Trang mùa 4 / mùa 7 / mùa 8 có dòng chú thích câu hỏi phụ đúng như mục 1; bảng không còn cột Kết quả, Trường; dòng phụ dưới tên dạng "11A1 - THPT Sóc Sơn".
- Hồ sơ Nguyễn Thị Ngọc Ánh (Xuân Giang) có thành tích năm thứ 18 kèm chú thích "trước khi dự thi OSS"; hồ sơ Phan Huy Cường có 2 dòng năm thứ 22; hồ sơ Trần Ngọc Hải không còn dòng "Danh hiệu OSS" và "Tham dự Đường lên đỉnh Olympia".
- OSSPEDIA vẫn 91 thí sinh; `/wiki/thi-sinh/ha-viet-hoang` ra 404.
- Trang Giới thiệu: 7 / 6 / 1 với nhãn mới.
- Bảng vàng: 8 thẻ Hall of Fame đúng điểm; mục THPT Sóc Sơn đúng số liệu bảng 5b theo từng lựa chọn; mục 2 năm liên tiếp đúng 7 người và danh hiệu.
- Thử ở 1280px và 390px; Tab tới được các thẻ, các dải ảnh, nút chọn; Esc đóng hộp nổi.

Báo lại: file đã sửa/thêm/xóa, kết quả build/typecheck, các số đã đối chiếu.
