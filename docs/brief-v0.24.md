# Yêu cầu v0.24 (Kit đã duyệt): logo trường ở ô OSSPEDIA, ảnh vô địch ở ô Bảng vàng, slogan ngẫu nhiên

Đọc `CLAUDE.md` trước. **Trình bày kế hoạch trước khi sửa.** Làm 1 đợt (mục 1–3). Xong chạy `npm run build`, `npm run typecheck`, `npm run kiem-tra-du-lieu` rồi commit "v0.24".

Không thêm thư viện npm. Không đổi font, router (giữ `#/`). Không thêm màu mới. Ảnh người chỉ dùng ảnh đã đăng trên web.

---

## 1. Ô OSSPEDIA: thêm hàng logo 5 trường

- Thêm **một hàng logo các trường** ngay dưới dải bìa các mùa, làm giống dải bìa mùa:
  - Cùng cỡ ô (khoảng 40–48px).
  - Dùng logo trường đang hiện ở các trang khác (`SchoolBadge`), giữ nguyên hình dạng logo.
  - Thứ tự theo `schools.json`.
  - Bấm vào logo thì mở trang trường đó.
  - Rê chuột hiện tên trường; mỗi logo có `aria-label` là tên trường.
- Trên mỗi hàng thêm một nhãn nhỏ chữ xám (khoảng 12px):
  - "Mùa giải" trên dải bìa mùa, là liên kết tới danh sách mùa.
  - "Trường" trên hàng logo, là liên kết tới danh sách trường.
- Chip "Các trường" bỏ đi, vì nhãn "Trường" đã dẫn tới đó. Giữ chip "Danh sách thí sinh" và "Sự kiện khác".
- Ô tìm kiếm vẫn nằm cuối ô. Khoảng trống giữa hàng logo và ô tìm kiếm thu lại cho cân.

## 2. Ô Bảng vàng: dùng ảnh vô địch

- Hàng ảnh nhà vô địch dùng **đúng ảnh vô địch mà trang Bảng vàng đang dùng** cho mỗi người: ảnh lúc nhận giải, đội vòng nguyệt quế hoặc cầm cúp. Không dùng ảnh hồ sơ theo mùa như hiện tại.
- Tìm xem trang Bảng vàng lấy ảnh đó từ đâu (component, đường dẫn ảnh) và dùng lại đúng nguồn đó.
- Người vô địch nhiều lần: lấy ảnh của **lần vô địch gần nhất**.
- Người chưa có ảnh vô địch: dùng ảnh hồ sơ như hiện tại.
- Ảnh cắt tròn, **ưu tiên thấy mặt**:
  - Dùng cùng điểm lấy nét mà trang Bảng vàng đang dùng cho ảnh đó.
  - Nếu trang đó không đặt gì thì lấy phần trên của ảnh (`object-position` khoảng giữa ngang, 20–25% từ trên xuống).
- Rê chuột hiện "{Tên} · Quán quân mùa {các mùa}". Bấm vào ảnh thì mở hồ sơ.

## 3. Ảnh lớn đầu trang chủ: slogan ngẫu nhiên

**Dữ liệu (`src/data/site.json`)**
- Giữ `slogan` = "Tri thức ở đâu, chúng tôi vươn cao tới đó". Đây là slogan chính thức, dùng ở chân trang, thẻ meta và ảnh chia sẻ, không đổi ngẫu nhiên.
- Thêm `heroSlogans`, mỗi slogan là một chuỗi, **" / " là chỗ xuống dòng**. Giữ đúng từng chữ và dấu câu:
  ```json
  "heroSlogans": [
    "Tri thức ở đâu / chúng tôi vươn cao tới đó!",
    "Từ đỉnh núi Sóc / đến đỉnh Olympia...",
    "Sóc Sơn không chỉ có truyền thuyết Thánh Gióng / không chỉ có Nội Bài / mà hoàn toàn có thể có Cầu Truyền hình!"
  ]
  ```
- Ghi vào `CLAUDE.md` và `README.md`: thêm, bớt slogan bằng cách sửa danh sách này; " / " là xuống dòng.
- Thêm kiểu cho `heroSlogans` trong `src/types.ts`. Danh sách rỗng hoặc thiếu thì ảnh lớn hiện `slogan` như cũ.

**Chọn slogan**
- Mỗi lần tải trang chọn ngẫu nhiên 1 slogan. Chọn một lần khi trang tải, không đổi khi trang vẽ lại.
- **Không trùng với slogan của lần tải trước:** lưu chỉ số vừa hiện vào `sessionStorage`, bọc trong try/catch. Lỗi thì cứ chọn ngẫu nhiên.

**Hiển thị**
- Tách tại " / ", mỗi phần một dòng. Giữ dấu ngoặc kép quanh cả câu, căn phải ở góc trên như v0.23.
- **Cỡ chữ theo độ dài:**
  - Slogan 2 dòng giữ cỡ hiện tại.
  - Slogan 3 dòng, hoặc có dòng dài hơn khoảng 30 ký tự, nhỏ hơn khoảng một phần tư.
  - Khối chữ không được lấn xuống quá nửa trên của ảnh. Không đè lên nút "Xem kết quả mùa…", "Tra cứu thí sinh" và dòng chú thích ảnh.
- Điện thoại: dòng dài được tự xuống dòng. Chữ không nhỏ hơn khoảng 22px. Khối chữ vẫn nằm ở nửa trên ảnh.
- Giữ lớp phủ tối ở góc trên như v0.23 để chữ đọc rõ, kể cả với slogan 3 dòng.
- Trình đọc màn hình đọc slogan thành một câu liền: các dòng nối bằng dấu cách, không đọc dấu "/".

---

## Kit kiểm tra

- Trang chủ, ô OSSPEDIA:
  - Có hàng "Mùa giải" (10 bìa) và hàng "Trường" (5 logo).
  - Bấm logo Đa Phúc thì mở trang THPT Đa Phúc.
  - Không còn chip "Các trường".
- Ô Bảng vàng: 8 ảnh là ảnh lúc vô địch, thấy rõ mặt. Rê chuột thấy tên và các mùa vô địch.
- F5 nhiều lần:
  - Ảnh lớn đổi qua 3 slogan, không lần nào lặp lại slogan vừa hiện.
  - Slogan "Sóc Sơn không chỉ có…" hiện đủ 3 dòng, chữ nhỏ hơn, không đè lên người trong ảnh và các nút.
- Chân trang và ảnh xem trước khi chia sẻ link vẫn là "Tri thức ở đâu, chúng tôi vươn cao tới đó".
- Điện thoại: slogan dài vẫn đọc được, không tràn ngang.
