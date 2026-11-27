# Yêu cầu v0.23 (Kit đã duyệt): slogan mới, trang chủ gọn và có màu từ nội dung, phễu và Thư viện

Đọc `CLAUDE.md` trước. **Trình bày kế hoạch trước khi sửa.** Làm 1 đợt (mục 1–6). Xong chạy `npm run build`, `npm run typecheck`, `npm run kiem-tra-du-lieu` rồi commit "v0.23".

Không thêm thư viện npm. Không đổi font, router (giữ `#/`). Không thêm màu mới ngoài những màu ghi trong brief này hoặc màu đã có trong CSS. Không sửa kết quả, điểm số. Ảnh người chỉ dùng ảnh đã đăng trên web.

Kit đặt sẵn trong `docs/`: `brief-v0.23.md`, `og-image-moi.jpg` (ảnh chia sẻ có slogan mới).

---

## 1. Slogan mới

- `src/data/site.json`: đổi `slogan` thành **"Tri thức ở đâu, chúng tôi vươn cao tới đó"**.
- Tìm mọi chỗ còn chữ "Từ đỉnh núi Sóc đến đỉnh Olympia", đổi thành slogan mới, hoặc cho đọc từ `site.json`. Gồm: `index.html` (thẻ meta), chân trang, `README.md`, `CLAUDE.md` nếu có nhắc.
- Thay ảnh chia sẻ đang dùng (ảnh `og:image` khai báo trong `index.html`) bằng `docs/og-image-moi.jpg`. Giữ nguyên tên file và đường dẫn cũ để thẻ meta không phải đổi.

**Ảnh lớn đầu trang chủ:**
- Slogan hiện **2 dòng**, ngắt ngay sau dấu phẩy:
  - dòng 1: "Tri thức ở đâu,"
  - dòng 2: "chúng tôi vươn cao tới đó"
- Ngắt dòng bằng code (tách tại dấu phẩy đầu tiên), không gõ cứng chuỗi thứ hai.
- **Cỡ chữ nhỏ hơn hiện tại khoảng một phần ba.** Trên màn hình rộng, mỗi vế nằm gọn một dòng. Trên điện thoại, dòng 2 có thể tự xuống dòng.
- Giữ dấu ngoặc kép, màu chữ và vị trí góc trên bên phải như hiện tại.
- Chữ phải đọc rõ trên ảnh: nếu chỗ chữ nằm còn sáng hoặc rối, tăng nhẹ lớp phủ tối ở góc đó. Không đổi ảnh.

Chân trang hiện slogan trên một dòng như cũ.

## 2. Khối lối vào trang chủ

**Bố cục**
- **Bỏ ô "Về chúng tôi"**, vì liên kết "Tìm hiểu về Olympia Sóc Sơn" ngay phía trên và menu đã dẫn tới đó.
- Bên trái giữ ô OSSPEDIA. Bên phải còn 2 ô Bảng vàng và Human of OSS, **giãn ra để tổng chiều cao bằng ô OSSPEDIA**.
- Điện thoại: xếp dọc theo thứ tự OSSPEDIA, Bảng vàng, Human of OSS.
- Rê chuột vào ô thì viền chuyển tím nhẹ. Không thêm hiệu ứng chạy.

**Ô OSSPEDIA**
- Thay chip "Mùa 10" bằng **một dải bìa các mùa**:
  - Mỗi bìa là ô vuông nhỏ (khoảng 40–48px), không cắt logo.
  - Bấm vào bìa thì mở trang mùa đó. Mùa mới nhất có viền tím.
  - Rê chuột hiện tên "Mùa n" (dùng hộp số của v0.22 hoặc nhãn đơn giản). Mỗi bìa có `aria-label` "Mùa n".
  - Thứ tự từ mùa 1 tới mùa mới nhất. Không đủ chỗ thì xuống hàng.
- Giữ dòng số liệu, các chip còn lại và ô tìm kiếm.

**Ô Bảng vàng: tông tối, chữ vàng**
- Dùng đúng nền tối và màu chữ vàng đang dùng ở phần đầu trang Bảng vàng. Lấy từ CSS hiện có, không tạo màu mới.
- Nội dung:
  - biểu tượng và tiêu đề;
  - câu mô tả;
  - dòng "8 nhà vô địch OSS · 9 vòng nguyệt quế tại Đường lên đỉnh Olympia" (giữ cách tính tự động);
  - **một hàng ảnh đại diện của các nhà vô địch OSS**: mỗi người một lần, xếp theo mùa vô địch đầu tiên.
    - Ảnh lấy giống ảnh hồ sơ (không có ảnh thì hiện chữ viết tắt như các chỗ khác).
    - Bấm vào ảnh thì mở hồ sơ; rê chuột hiện tên.
- Kiểm tra tương phản: chữ thường đạt tối thiểu 4.5:1 trên nền tối, kể cả chữ mô tả.

**Ô Human of OSS: một câu chuyện ngẫu nhiên**
- Mỗi lần tải trang, chọn **ngẫu nhiên 1 bài** trong `humans.json` (bỏ file mẫu `_mau`).
  - Chọn một lần khi trang tải (ví dụ khởi tạo state), không đổi khi trang vẽ lại.
- Bố cục giống thẻ trên trang Human of OSS nhưng **ảnh đại diện nằm bên phải**:
  - tên (màu tím), vai trò;
  - câu trích in nghiêng, tối đa 3 dòng (quá thì cắt bằng dấu "…");
  - dòng "Tập n · ngày" (không có ngày thì chỉ "Tập n", như trang Human of OSS).
- Hai nút: **"Đọc câu chuyện"** (mở bài đó) và **"Tất cả câu chuyện"** (mở trang Human of OSS).
- Tiêu đề ô "Human of OSS" và dòng "{n} câu chuyện" vẫn giữ ở đầu ô.

## 3. Ô "Cảm nhận về Olympia Sóc Sơn": thu gọn

- Ô rộng tối đa khoảng 760px, căn giữa.
- **Ảnh đại diện khoảng 56px**, nằm cùng hàng với tên và vai trò (tên đậm, vai trò chữ xám bên dưới). Bỏ khung tên dạng viên thuốc hiện tại.
- Câu trích cỡ 18–20px. Bỏ hai dấu ngoặc kép lớn, chỉ giữ ngoặc kép thường trong câu.
- "Đọc bài phỏng vấn" ngay dưới câu trích.
- **Chiều cao ô = chiều cao câu trích dài nhất** trong các câu đang có, đo lại khi đổi cỡ màn hình. Chuyển câu thì khung không nhảy.
- Giữ chấm chuyển, nút tạm dừng và tự chuyển như cũ.

## 4. Ô "Bạn có biết?": thu gọn

- Rộng bằng ô Cảm nhận (tối đa khoảng 760px), căn giữa, khoảng đệm nhỏ lại.
- Câu chữ cỡ khoảng 18px.
- **"Xem chi tiết" và nút "Sự thật khác" nằm cùng một hàng**: liên kết bên trái, nút bên phải.
- Phần chữ có chiều cao cố định vừa 3 dòng, để đổi câu thì khung không co giãn. Câu dài hơn 3 dòng thì ô được cao thêm, không cắt chữ.

## 5. Phễu "Từ đơn đăng kí tới ngôi Quán quân": số hiện khi rê chuột

Làm theo cách các biểu đồ ở v0.22:
- Trong thanh **không ghi số**. Bỏ chú thích riêng dưới từng hàng. Bỏ cột "Nữ x%" bên phải.
- **Một chú thích chung** Nam / Nữ (ô màu và tên) dưới cùng, ngay trên dòng ghi chú "Tính theo lượt…".
- Bên trái mỗi hàng giữ tên chặng (đậm) và tổng lượt (chữ nhỏ, xám), ví dụ "Đăng kí dự thi" / "492 lượt".
- Rê chuột hoặc chạm vào phần Nam / Nữ: hộp số của v0.22 ghi "{chặng} · Nam" và "{số} lượt · {%}".
- Bốn thanh dài bằng nhau như hiện tại.

## 6. Thư viện: ô sự kiện cùng cỡ ô mùa, không cắt logo

- Ô "Các sự kiện khác" dùng **cùng kích thước, khung ảnh 1:1 và lưới cột** như ô các mùa.
- Ảnh bìa sự kiện co lại cho vừa trọn trong khung, **không cắt**.
- Phần thừa trong khung lấp bằng chính ảnh đó phóng to, làm mờ và tối đi một chút, để không lộ dải trắng. Lớp mờ chỉ để trang trí: `aria-hidden`, không có `alt`.
- Tiêu đề dài như "Gặp nhau đầu năm 2023 – The Rassembler" được xuống dòng. Các ô trong cùng một hàng cao bằng nhau.
- Ô mùa giữ nguyên.

---

## Kit kiểm tra

- Trang chủ: ảnh lớn hiện "Tri thức ở đâu," / "chúng tôi vươn cao tới đó", chữ nhỏ hơn, đọc rõ. Chân trang có slogan mới.
- Dán link web vào Messenger/Zalo: ảnh xem trước có slogan mới. Có thể phải chờ hoặc xoá bộ nhớ đệm của ứng dụng.
- Khối lối vào:
  - Không còn ô "Về chúng tôi"; hai ô bên phải cao bằng ô OSSPEDIA.
  - Bấm bìa mùa 3 mở mùa 3.
  - Bảng vàng nền tối, chữ vàng, có hàng ảnh 8 nhà vô địch.
  - F5 vài lần: ô Human of OSS đổi bài, hai nút mở đúng chỗ.
- Cảm nhận và Bạn có biết: gọn, chuyển câu không nhảy khung.
- Phễu: không còn số trong thanh; rê chuột thấy số.
- Thư viện: ô sự kiện cùng cỡ ô mùa, thấy trọn logo The Rassembler, Truyền lửa Olympia, Gặp nhau đầu năm 2024.
- Điện thoại: mọi phần trên không tràn ngang.
