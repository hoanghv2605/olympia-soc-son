# Yêu cầu v0.22 (Kit đã duyệt): biểu đồ dễ đọc hơn, số hiện khi rê chuột, trả lại ảnh bìa đầu trang mùa

Đọc `CLAUDE.md` trước. **Trình bày kế hoạch trước khi sửa.** Làm 1 đợt (mục 1–5). Xong chạy `npm run build`, `npm run typecheck`, `npm run kiem-tra-du-lieu` rồi commit "v0.22".

Không thêm thư viện npm (biểu đồ tự vẽ bằng SVG/HTML). Không đổi font, router (giữ `#/`). Không sửa dữ liệu trong `src/data/`. Quy tắc riêng tư của v0.21 giữ nguyên: chỉ số đếm, không tên người đăng kí, mỗi biểu đồ một tiêu chí.

---

## 1. Hộp số liệu nổi khi rê chuột (component dùng chung)

Làm một component, ví dụ `ChartTooltip`, dùng cho mục 3, 4, 5.

**Hiển thị**
- Rê chuột vào một phần của biểu đồ thì một hộp nhỏ nổi lên **cạnh con trỏ**, đi theo con trỏ.
- Hộp: nền trắng, viền mảnh, bo góc, chữ 13px. Dòng đầu đậm là tên phần, các dòng sau là số.
- Gần mép phải hoặc mép dưới thì hộp lật sang phía còn lại, không tràn khỏi màn hình.
- **Bỏ mọi dòng chữ đọc số cố định bên dưới biểu đồ.** Số chỉ hiện trong hộp.
- Không dùng thuộc tính `title` của trình duyệt.

**Điện thoại và bàn phím**
- Điện thoại: chạm vào một phần thì hiện hộp; chạm chỗ khác thì ẩn.
- Bàn phím: mỗi phần nhận được focus (Tab). Khi focus, hộp hiện cạnh phần đó; Esc ẩn.
- Mỗi phần có `aria-label` đọc đủ số, vì hộp nổi chỉ để nhìn.

## 2. Trả lại ảnh bìa ở đầu trang mùa

- **Nguyên nhân:** mục 6b của brief v0.19 ghi khung 1:1 cho "mọi nơi hiển thị bìa mùa, kể cả đầu trang mùa". Ghi vậy là sai phạm vi. Kết quả: ảnh bìa ở đầu trang mùa thành ô vuông ở góc phải, và các nút "Thư viện ảnh", "‹ Mùa n", "Mùa n ›" đè lên ảnh.
- **Sửa:** đưa riêng phần đầu trang mùa về đúng như commit ngay trước "v0.19 đợt 1". Ở đó ảnh bìa nằm trên đầu trang và mờ dần xuống nền.
  - Dùng `git log` tìm commit đó, đọc lại code cũ của phần đầu trang mùa (các component đầu trang và bìa mùa) rồi khôi phục.
  - **Không** hoàn nguyên các thay đổi khác của v0.19.
- Các nút chuyển mùa và "Thư viện ảnh" về đúng vị trí như trước v0.19, không đè lên ảnh.
- Khung 1:1 (không cắt logo) **chỉ** giữ ở Thư viện và danh sách mùa trong OSSPEDIA.

## 3. Trang mùa, mục Vòng loại: bố cục và 3 biểu đồ donut

**Bố cục**
- Đoạn chữ "12 thí sinh có kết quả cao nhất…", hai ô số và khối biểu đồ đều **rộng hết cột nội dung**.
- Thẳng lề trái và phải với bảng Vòng loại và các bảng Bán kết bên dưới. Không bó trong khung hẹp hơn.
- Hai ô số giữ nguyên.

**Ba donut thay cho 3 thanh tỉ lệ**
- Ba donut cùng một hàng: **Khối, Giới tính, Trường**. Mỗi donut có tiêu đề ở trên.
- Giữa vòng ghi số lớn và chữ nhỏ bên dưới:
  - Chế độ Đăng kí: tổng thí sinh, ví dụ "43" / "thí sinh".
  - Chế độ Top 12: "12" / "top 12".
- Chú thích dưới mỗi donut: ô màu và tên nhóm. **Không ghi số, không ghi %.**
- Rê chuột hoặc chạm vào một phần: hộp ở mục 1 ghi 2 dòng:
  - Tên nhóm, ví dụ "Lớp 10".
  - Số và %, ví dụ "30 thí sinh · 70%". Ở chế độ Top 12 thì ghi "4 người · 33%".
- Màu, thứ tự nhóm và nhãn giữ như v0.21. Riêng lớp 9 vẫn ghi "Lớp 9 (THCS)".
- Giữa các phần có khe trắng nhỏ. Phần chỉ 1 đơn vẫn vẽ, rộng tối thiểu khoảng 4° để chạm được.
- Vẽ bằng SVG, không có hiệu ứng vẽ dần.

**Đổi chế độ**
- Thay nút bật/tắt "So với top 12" bằng **2 nút liền nhau "Đăng kí" | "Top 12"**, có `aria-pressed`, mặc định "Đăng kí".
- Bấm thì cả 3 donut đổi số liệu, giữ nguyên màu và thứ tự.

**Điện thoại:** donut xếp dọc, mỗi cái rộng khoảng 160px, chú thích ở dưới.

**Kiểm với số thật**
- Mùa 10: 43 thí sinh. Rê vào phần Nam thấy "30 thí sinh · 70%". Bấm Top 12: giữa vòng là 12, phần Nữ là "3 người · 25%".
- Mùa 7: donut Khối có "Lớp 9 (THCS)".

## 4. Trang trường, phần "Đăng kí dự thi": thanh 5 chặng

Thay danh sách thanh theo mùa hiện tại bằng:
- **Câu tóm tắt** giữ nguyên.
- **Hàng "Tổng":** một thanh đầy bề ngang, chia 5 phần.
- **10 hàng mùa:**
  - "Mùa n" là liên kết `?tran=vl` như cũ.
  - Thanh chia 5 phần, dài theo số đăng kí của mùa đó so với mùa đông nhất của chính trường đó.
  - Mùa không có đơn: chữ xám "Không có đơn đăng kí".
- **Chú thích một lần ở dưới cùng:** 5 ô màu và tên, không số.

**Cách chia: mỗi lượt đăng kí tính vào chặng xa nhất nó đi được**, theo trường, theo mùa:

| Phần | Cách tính | Màu |
| --- | --- | --- |
| Dừng ở Vòng loại | số đăng kí (`dang-ky.json`, `bySchool`) − số vào top 12 (`qualifying.json`) | `#DDD6FE` |
| Dừng ở Bán kết | số vào top 12 − số vào Chung kết | `#8B5CF6` |
| Quý quân | dòng `placement: "giai-ba"` trong trận `chung-ket` của mùa đó | màu đồng của nhãn kết quả đang có |
| Á quân | `placement: "a-quan"` | màu bạc của nhãn kết quả |
| Quán quân | `placement: "vo-dich"` | màu vàng của nhãn kết quả |

- Trường của một người lấy theo dòng kết quả trận và `qualifying.json`.
- Năm phần cộng lại phải bằng số đăng kí. Thêm vào `kiem-tra-du-lieu`: phần nào âm thì báo lỗi.
- Không lấy được màu đồng, bạc, vàng của nhãn kết quả thì dùng `#B87333`, `#9CA3AF`, `#D4A017`.

**Trong thanh không ghi số.** Phần nhỏ nhất rộng tối thiểu 5px.

**Rê chuột hoặc chạm**, hộp ghi:
- "{10 mùa hoặc Mùa n} · {tên phần}".
- "{số} lượt · {%}".
- Riêng phần "Dừng ở Bán kết" thêm dòng "Tổng vào top 12: {t} lượt".
- Dòng cuối, chữ xám: "{số đăng kí} lượt đăng kí".

**Kiểm với số thật**
- THPT Sóc Sơn, hàng Tổng: 245 · 60 · 13 · 9 · 10 (cộng 337). Rê vào "Dừng ở Bán kết" thấy "60 lượt · 18%" và "Tổng vào top 12: 92 lượt".
- THPT Sóc Sơn, mùa 10: 25 · 7 · 0 · 2 · 1. Mùa 10 có hai đồng Á quân.
- THPT Đa Phúc, hàng Tổng: 60 · 11 · 5 · 1 · 0.

## 5. Trang "Các mùa giải", mục "Toàn cảnh": cột nam / nữ

Thay danh sách thanh ngang "Thí sinh đăng kí qua các mùa" bằng **biểu đồ cột**:
- 10 cột theo thứ tự mùa. Mỗi cột chồng 2 phần: Nam ở dưới (`#2563EB`), Nữ ở trên (`#DB2777`).
- Giữa hai phần có khe trắng 2px. Đầu cột bo nhẹ.
- **Số tổng ghi trên đầu mỗi cột.** Nhãn "Mùa n" ở dưới cột. Không trục dọc, không đường lưới.
- Chú thích Nam / Nữ dưới biểu đồ, không số.
- Rê chuột hoặc chạm vào cột, hộp ghi:
  - "Mùa n: {tổng} thí sinh".
  - "Nam {a} · Nữ {b}".
  - Chữ xám: "{x,x} đơn cho một suất Bán kết".
- Nhãn "Mùa n" dưới cột là liên kết tới Vòng loại mùa đó (`?tran=vl`). Chạm vào thân cột chỉ hiện hộp số, không chuyển trang.
- Điện thoại (dưới khoảng 480px): nhãn dưới cột chỉ ghi số mùa, thêm chữ "Mùa" ở đầu trục.
- Giữ dòng "492 lượt đăng kí cho 120 suất vào Bán kết." ở trên biểu đồ. Phễu "Từ đơn đăng kí tới ngôi Quán quân" giữ nguyên.

**Kiểm với số thật:** cột mùa 5 cao nhất, ghi 69. Rê vào thấy "Nam 36 · Nữ 33" và "5,8 đơn cho một suất Bán kết".

Nếu component thanh tỉ lệ của v0.21 không còn dùng ở đâu ngoài phễu thì giữ lại cho phễu. Không xoá.

---

## Kit kiểm tra

- Mùa 10: đầu trang có ảnh bìa mờ dần như trước v0.19, các nút không đè lên ảnh. Thư viện: bìa vẫn vuông, không bị cắt.
- Mùa 10, Vòng loại:
  - Đoạn chữ, ô số và donut thẳng lề với bảng.
  - Chú thích không có số.
  - Rê vào từng phần thấy hộp số; bấm "Top 12" thì cả 3 donut đổi.
- Mùa 7: donut Khối có "Lớp 9 (THCS)".
- Trang THPT Sóc Sơn: thanh Tổng và 10 thanh mùa, đúng số ở mục 4.
- Các mùa giải: cột mùa 5 cao nhất; rê vào thấy nam, nữ, số đơn mỗi suất.
- Điện thoại: chạm thì hiện hộp, chạm chỗ khác thì ẩn; không tràn ngang.
- Bàn phím: Tab tới từng phần thì thấy hộp số.
