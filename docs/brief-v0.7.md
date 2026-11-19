# Yêu cầu v0.7: chuốt giao diện, đợt 2 (Kit đã duyệt)

Đọc `CLAUDE.md` trước. **Trình bày kế hoạch (file nào, sửa gì) trước khi sửa.** Xong mỗi mục chạy `npm run build` và `npm run typecheck`. Không thêm thư viện npm mới. Không sửa dữ liệu trong `src/data/`. Mọi chuyển động tôn trọng `prefers-reduced-motion`.

Brief này làm **sau** v0.6, dùng lại các phần đã có: `PageHeader`, `PersonPhoto` (ảnh giữ chỗ mới), `roundLabel` / `resultLabel`, các hàm tính kỷ lục của Bảng vàng, hàm tìm kiếm không dấu của OSSPEDIA.

---

## 0. Chốt font tiêu đề

Kit ghi lựa chọn trong lời nhắn kèm brief này: **a** (Bricolage Grotesque), **b** (Fraunces) hoặc **giữ** (Be Vietnam Pro).
- Bỏ cơ chế `?font=` tạm thời của v0.6 (code đọc tham số, CSS `[data-font]`, ghi chú `TẠM`).
- Nếu chọn a hoặc b: thêm font đó vào thẻ `<link>` Google Fonts có sẵn trong `index.html` (cùng URL như v0.6) và đặt `--font-display` thẳng trong `@theme`. Nếu chọn giữ: `--font-display` = font hiện tại, không nạp thêm.
- Cập nhật `CLAUDE.md` và `README.md` (bỏ hướng dẫn `?font=`).

## 1. Ô tìm kiếm chung trên thanh menu

- **Nút tìm kiếm** trên header: icon `PiMagnifyingGlass`, `aria-label="Tìm kiếm"`. Máy tính: bên phải các mục menu. Điện thoại: cạnh nút menu.
- Bấm nút, hoặc phím `/` (khi không đang gõ trong ô nhập liệu), hoặc `Ctrl+K` / `⌘K` → mở **hộp tìm kiếm** dạng hộp nổi giữa màn hình (điện thoại: chiếm toàn màn hình), con trỏ đặt sẵn trong ô nhập.
- **Tìm không dấu**: tách hàm tìm kiếm đang dùng ở OSSPEDIA ra `src/lib/` để dùng chung. Kết quả chia 3 nhóm, mỗi nhóm tối đa 6 dòng:
  - **Thí sinh** (chỉ thí sinh OSS): tên; dòng phụ "{trường} · Mùa {các mùa}".
  - **Mùa giải**: khớp khi gõ "mùa 4", "mua 4", "oss4" hoặc "4"; dòng phụ "Quán quân {tên}".
  - **Trường**: tên trường; dòng phụ "{n} thí sinh".
- Chưa gõ gì: hiện dòng gợi ý "Gõ tên thí sinh, mùa (vd: mùa 4) hoặc tên trường". Không có kết quả: "Không tìm thấy “{từ khóa}”. Thử gõ ngắn hơn, ví dụ chỉ tên." 
- **Bàn phím**: ↑ ↓ chọn dòng, Enter mở, Esc đóng. Focus giữ trong hộp khi mở, trả về nút tìm kiếm khi đóng. Đóng khi chuyển trang.
- Ô "Tìm trong OSSPEDIA" ở trang chủ OSSPEDIA: bấm vào thì mở chính hộp tìm kiếm này. Ô lọc trên trang danh sách Thí sinh giữ nguyên cách lọc hiện tại.

## 2. Xem nhanh thí sinh khi rê chuột

- Áp dụng cho các **link chữ** dẫn tới hồ sơ thí sinh (`/wiki/thi-sinh/:id`): bảng Vòng loại, Bán kết, Chung kết, danh sách Thí sinh, trang trường, bảng xếp hạng Kỷ lục, đoạn văn trang mùa, dòng thời gian. **Không** áp dụng cho các thẻ ảnh (Hall of Fame, thẻ THPT Sóc Sơn, dải 2 năm liên tiếp) và kết quả tìm kiếm.
- Chỉ bật trên thiết bị có `(hover: hover) and (pointer: fine)`. Điện thoại không có.
- Rê chuột 350ms thì hiện; rời link 150ms thì ẩn; rê vào thẻ thì thẻ giữ nguyên.
- **Nội dung thẻ** (rộng ~280px): `PersonPhoto` nhỏ (48×64), tên đậm, trường, "Mùa {các mùa}", danh hiệu OSS cao nhất nếu có (vd "Quán quân mùa 9"), và nếu có thành tích Đường lên đỉnh Olympia thì thêm 1 dòng "Olympia năm thứ {N}".
- Vị trí: dưới link, tự lật lên trên nếu không đủ chỗ, không tràn ra ngoài màn hình. Hiện/ẩn mờ dần 120ms.
- Một thẻ dùng chung cho cả trang (render qua portal), không tạo một thẻ cho mỗi link. Thẻ `aria-hidden="true"` (thông tin đầy đủ đã có ở trang hồ sơ).

## 3. Trang chủ

Thứ tự mới: ảnh lớn (lật ô, đã làm ở v0.6) → giới thiệu (giữ) → **Lối vào** (mới) → **Bạn có biết?** (mới) → Quán quân qua các mùa (giữ).

### 3a. Lối vào
- 4 ô dẫn tới 4 phần chính, mỗi ô: icon, tên phần, 1 câu mô tả, 1 dòng số liệu **tự tính**:

| Ô | Icon | Mô tả | Số liệu |
| --- | --- | --- | --- |
| OSSPEDIA | `PiBooks` | Các mùa giải, hồ sơ thí sinh và các trường. | "10 mùa · 91 thí sinh · 5 trường" |
| Bảng vàng | `PiTrophy` | Quán quân, kỷ lục và thành tích tại Đường lên đỉnh Olympia. | "8 Quán quân · 9 vòng nguyệt quế" (số Quán quân = số người khác nhau từng vô địch; vòng nguyệt quế theo phạm vi toàn bộ) |
| Human of OSS | `PiChatsCircle` | Những con người và câu chuyện phía sau OSS. | "{n} câu chuyện" |
| Về chúng tôi | `PiFlag` | Lịch sử, cơ cấu tổ chức và liên hệ. | "Thành lập năm 2017" |

- **Ô OSSPEDIA là ô chính:** to hơn, có thêm một ô tìm kiếm giả bên trong; bấm vào ô tìm kiếm giả thì mở hộp tìm kiếm ở mục 1 (bấm chỗ khác trong ô thì vào trang OSSPEDIA).
- Bố cục máy tính: lưới 2 cột, **ô OSSPEDIA bên trái cao bằng cả 3 ô kia**; bên phải 3 ô còn lại xếp dọc, mỗi ô dạng ngang (icon bên trái, chữ bên phải). Điện thoại: 1 cột, OSSPEDIA trên cùng.
- Cả ô là link. Rê chuột / focus: viền chuyển màu `oss`, nhấc nhẹ 2px.

### 3b. Bạn có biết?
- Một khối riêng: icon `PiLightbulb`, nhãn "Bạn có biết?", câu sự thật cỡ chữ lớn hơn chữ thường (`1.125rem` → `1.25rem`), link "Xem chi tiết" tới trang liên quan, và nút "Sự thật khác".
- Mỗi lần tải trang chọn ngẫu nhiên 1 câu; bấm "Sự thật khác" thì đổi sang câu khác (không lặp lại ngay câu vừa xem). Đổi câu bằng hiệu ứng mờ chéo 200ms. Vùng chứa câu có `aria-live="polite"`.
- **Mọi câu đều tự sinh từ dữ liệu** trong `src/lib/facts.ts`, không gõ tay số liệu. Các loại câu:

| Loại | Mẫu câu | Link |
| --- | --- | --- |
| Kỷ lục (6 câu) | "Kỷ lục điểm {Khởi động} là {120}, thuộc về {A} ({Mùa 6, Chung kết})." Nhiều người cùng giữ: "…, cùng thuộc về {A} và {B}." | Bảng vàng |
| Lội ngược dòng | "Ở Chung kết mùa {n}, {A} dẫn đầu sau Tăng tốc với {x} điểm, nhưng {Quán quân} vượt lên ở Về đích và vô địch với {y} điểm." Nhiều người cùng dẫn: "{A} và {B} cùng dẫn đầu…" | Trang mùa |
| Câu hỏi phụ | "Ở {Bán kết 2 mùa 7}, {A} và {B} cùng có {140} điểm; {A} giành chiến thắng ở câu hỏi phụ." | Trang mùa |
| Vô địch liên tiếp | "{A} vô địch 2 mùa liên tiếp: Mùa {n} và Mùa {n+1}." | Hồ sơ |
| Cách biệt Chung kết | Lớn nhất: "Cách biệt lớn nhất ở một trận Chung kết là {160} điểm: {A} {290} – {B} {130} (Mùa {9})." Nhỏ nhất (lớn hơn 0): tương tự. | Trang mùa |
| Trường | "THPT Sóc Sơn chiếm {77}% số lượt vào top 12 qua {10} mùa." | Các trường |
| Đường lên đỉnh Olympia | "THPT Sóc Sơn đã có {2} cầu truyền hình Chung kết Đường lên đỉnh Olympia." (phạm vi toàn bộ) | Bảng vàng |
| Ghi chú mùa | Lấy từ `notes[]` trong `seasons.json`, **chỉ** những ghi chú bắt đầu bằng "Đây là" và dài ≤ 200 ký tự; hiển thị "Mùa {n}: {ghi chú, chữ "Đây là" viết thường thành "đây là"}". | Trang mùa |

- Kiểm tra số liệu: lội ngược dòng chỉ có **mùa 2** (Nguyễn Thanh Hà dẫn 230, Chu Đức Huy vô địch 265) và **mùa 10** (Nguyễn Tuấn Hùng và Võ Danh Sơn cùng dẫn 180, Phạm Ngô Bảo Minh vô địch 195). Câu hỏi phụ có đúng 3 câu (Chung kết mùa 4, Bán kết 2 mùa 7, Bán kết 1 mùa 8). Vô địch liên tiếp: Chu Đức Huy (1, 2), Nguyễn Việt Thành (5, 6). Cách biệt lớn nhất 160 (mùa 9: 290 – 130); nhỏ nhất lớn hơn 0 là 5 (mùa 3: Trần Hải Linh 165 – Nguyễn Thùy Dương 160).

## 4. Cập nhật tài liệu

- `CLAUDE.md`: hộp tìm kiếm chung (hàm tìm không dấu dùng chung ở `src/lib/`), thẻ xem nhanh (chỉ link chữ, chỉ thiết bị có chuột), `facts.ts` (mọi câu tự sinh từ dữ liệu, cách thêm loại câu mới), font tiêu đề đã chốt.
- `README.md`: phím tắt `/` và `Ctrl/⌘ K`.

---

## Kiểm tra trước khi báo xong

- `npm run build` và `npm run typecheck` pass. Không còn code `?font=`.
- Hộp tìm kiếm: gõ "duc" ra Nghiêm Trung Đức, Chu Đức Huy…; gõ "mua 4" và "oss4" ra Mùa 4; gõ "da phuc" ra THPT Đa Phúc; phím `/`, `Ctrl/⌘ K`, ↑ ↓ Enter Esc hoạt động; ở 390px hộp chiếm toàn màn hình.
- Thẻ xem nhanh hiện ở bảng Bán kết mùa 10 khi rê chuột, không hiện trên điện thoại, không tràn mép màn hình khi link nằm sát mép phải.
- Trang chủ: 4 ô Lối vào có số đúng (10 mùa · 91 thí sinh · 5 trường; 8 Quán quân · 9 vòng nguyệt quế); "Bạn có biết?" đổi câu được nhiều lần, các câu kiểm tra ở mục 3b ra đúng số.
- Thử ở 1280px và 390px; Tab tới được nút tìm kiếm, các ô Lối vào, nút "Sự thật khác".

Báo lại: file đã sửa/thêm/xóa, kết quả build/typecheck, danh sách đầy đủ các câu "Bạn có biết?" sinh ra được (để Kit duyệt nội dung).
