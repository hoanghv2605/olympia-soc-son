# Yêu cầu v0.19 (Kit đã duyệt): sửa nội dung và con số, lối vào mùa mới nhất, mở đúng trận, kiểm tra dữ liệu

Đọc `CLAUDE.md` trước. **Trình bày kế hoạch trước khi sửa.** Làm 2 đợt, xong mỗi đợt chạy `npm run build`, `npm run typecheck` rồi commit:
- **Đợt 1:** mục 1–6, commit "v0.19 đợt 1". Xong đợt 1 thì **dừng lại báo Kit**, chờ Kit kiểm tra trên web rồi mới làm đợt 2.
- **Đợt 2:** mục 7–12, commit "v0.19 đợt 2".

Không thêm thư viện npm. Không đổi font, bảng màu, router (giữ `#/`). Không sửa kết quả hay điểm số thi đấu, trừ chỗ ghi rõ ở mục 4. Không xoá ảnh trong `public/images/`.

---

## ĐỢT 1

## 1. Khối "Cảm nhận về Olympia Sóc Sơn": trích từ Human of OSS

Thay toàn bộ nội dung mẫu trong `src/data/testimonials.json` bằng 6 trích dẫn dưới đây, lấy từ các bài Human of OSS đã đăng (Kit sẽ sửa sau). Ánh xạ vào cấu trúc file hiện có; thêm trường liên kết tới bài gốc (ví dụ `humanSlug`).

| # | Họ và tên | Vai trò | Bài gốc | Trích dẫn |
| --- | --- | --- | --- | --- |
| 1 | Trần Đức Hoàng Long | Đồng sáng lập Olympia Sóc Sơn | `tran-duc-hoang-long` | OSS là đại diện cho tuổi trẻ nhiệt huyết của mình. Tất cả những gì đặc trưng nhất của tuổi trẻ: đam mê, nhiệt huyết, tận tâm, khao khát khẳng định bản thân,... mình đều dành cho OSS và đến bây giờ cũng chỉ có OSS. |
| 2 | Trần Hải Linh | Quán quân OSS3 | `tran-hai-linh` | Mình không bao giờ thấy phiền cả, chỉ cần thấy các thí sinh khóa sau luôn chăm chỉ và biết phấn đấu, mình sẵn sàng truyền đạt tất cả những gì mình có. |
| 3 | Đinh Nguyên Thương | MC Olympia Sóc Sơn | `dinh-nguyen-thuong` | OSS là nơi mang lại cho chị rất nhiều thứ: tình cảm, kinh nghiệm và đặc biệt là những người anh chị, bạn bè, những người em siêu giỏi giang, thân thiện. |
| 4 | Trần Kim Cương | Á quân OSS4, MC Olympia Sóc Sơn | `tran-kim-cuong` | Đứng ở vị trí MC, mình cảm thấy rất tự hào vì những thế hệ sau này của ngôi nhà OSS vẫn cháy hết mình với đam mê được chinh phục đỉnh núi tri thức. |
| 5 | Lê Xuân Tùng | Quý quân OSS4, Trưởng ban Truyền thông OSS6–OSS7 | `le-xuan-tung` | OSS là một hoạt động ngoại khóa, cung cấp cho anh một môi trường năng động, nhiệt huyết và các mối quan hệ giá trị. |
| 6 | Nguyễn Đoàn Hồng Thái | Á quân OSS5, OSS6 | `nguyen-doan-hong-thai` | OSS đã đem cho mình nhiều giá trị, kỷ niệm, tình bạn và sự gắn kết nên mình vô cùng tự hào vì bản thân là một phần trong Olympia Sóc Sơn. |

- **Đối chiếu từng trích dẫn với file bài trong `src/content/human-of-oss/`** (so sau khi bỏ emoji và dấu câu cuối). Câu nào không tìm thấy trong bài thì **dừng lại báo Kit**, không tự viết lại. Slug bài không khớp tên file thì dùng đúng slug trong dự án và báo lại.
- Dòng "Chức danh hiện tại": để trống, **ẩn dòng này khi trống** (không hiện chữ mẫu).
- Ảnh: người có hồ sơ thí sinh OSSPEDIA thì dùng ảnh hồ sơ; không có thì hiện chữ viết tắt như các thẻ khác. Không dùng ảnh mẫu cũ trong `nhan-xet/`.
- Dưới mỗi trích dẫn thêm liên kết nhỏ "Đọc bài phỏng vấn" mở bài Human of OSS tương ứng.
- Số chấm chuyển và việc tự chuyển lấy theo số mục thật. Mục nào thiếu trích dẫn thì không hiện.

## 2. "Bạn có biết?": sửa câu về cách biệt nhỏ nhất ở Chung kết

- Hiện có câu nêu 5 điểm là cách biệt nhỏ nhất ở một trận Chung kết. Sai: Chung kết mùa 4 hòa 220–220, Nguyễn Thùy Dương thắng Trần Kim Cương ở câu hỏi phụ (cách biệt 0).
- Tìm chỗ sinh câu này. **Tính từ dữ liệu**, không gõ cứng:
  - Nếu có trận Chung kết mà Quán quân và người về nhì bằng điểm: câu "Chung kết mùa {m} là trận Chung kết {duy nhất / một trong {k} trận} hòa điểm ({x}–{x}): {Quán quân} thắng {người bằng điểm} ở câu hỏi phụ."
  - Câu riêng cho trận phân thắng thua bằng tổng điểm sát nhất: "Trận Chung kết được phân định bằng tổng điểm sát nút nhất là mùa {m}: {Quán quân} hơn {người về nhì} {d} điểm ({a}–{b})."
- Kiểm lại các câu "Bạn có biết?" khác có dùng cách biệt điểm hoặc thứ hạng Chung kết: trận hòa không được tính thành cách biệt 0 hay bị bỏ qua mà không nói rõ.

## 3. (Đã bỏ)

Các bảng trận xếp theo **vị trí đứng trên sân khấu**, đây là chủ ý. **Giữ nguyên thứ tự này ở mọi bảng trận**, không sắp lại theo điểm. Nếu đã sửa phần sắp xếp theo mục 3 cũ thì hoàn tác.

## 4. Bỏ dấu "?" khỏi thành tích Đường lên đỉnh Olympia

- Bảng vàng, Đặng Hồng Thái (năm thứ 7) đang hiện "Giải Ba Tuần ? - Tháng ? - Quý ?". Chưa có nguồn chính xác, nên hiển thị **"Giải Ba cuộc thi tuần"**.
- Quy tắc chung: phần tuần / tháng / quý chưa biết thì **bỏ phần đó**, chỉ ghi phần đã biết (ví dụ biết tháng, quý mà chưa biết tuần: "Giải Ba cuộc thi tuần · Tháng 2 - Quý 3"). Không bao giờ hiện "?" ra web.
- Trong dữ liệu, giá trị chưa biết lưu là `null`, không lưu `"?"`. Đây là chỗ duy nhất được sửa dữ liệu thành tích: chỉ đổi `"?"` thành `null`.

## 5. Ảnh lớn đầu trang chủ dẫn vào mùa mới nhất

- Ảnh lớn (đang ghi "Chung kết Olympia Sóc Sơn mùa 10") hiện không bấm được. Cho cả ảnh mở trang mùa mới nhất.
- Thêm 2 nút trong khối ảnh, gần dòng chú thích: **"Xem kết quả mùa {n}"** (mở trang mùa đó) và **"Tra cứu thí sinh"** (mở `#/wiki/thi-sinh`).
- Mùa mới nhất và số {n} **lấy tự động từ dữ liệu** (cùng cách khối "Chung kết mùa 10" đang dùng), để khi có mùa 11 không phải sửa tay.
- Nút đọc rõ trên ảnh (nền/viền đủ tương phản), bấm được bằng bàn phím, không che mặt người trong ảnh ở 375 px. Giữ nguyên 3 chữ O, S, S và khẩu hiệu.

## 6. Nhãn số liệu ở thẻ Bảng vàng (trang chủ) và bìa mùa không bị cắt

**6a.** Thẻ Bảng vàng đang ghi "8 Quán quân · 9 vòng nguyệt quế", gộp hai chủ thể. Đổi thành:
**"{a} nhà vô địch OSS · {b} vòng nguyệt quế tại Đường lên đỉnh Olympia"**
- {a} = số **người** từng vô địch OSS (hiện 8, 10 danh hiệu); {b} = số vòng nguyệt quế của toàn bộ thí sinh THPT Sóc Sơn (hiện 9, đúng con số chế độ "Toàn bộ thí sinh" trong Bảng vàng). Giữ cách tính tự động.

**6b.** Bìa các mùa (logo vuông 1:1) đang bị cắt mất đáy trong khung chữ nhật ở Thư viện (thấy rõ mùa 1, 2, 3, 5, 9, 10).
- **Mọi nơi** hiển thị bìa mùa (Thư viện, danh sách mùa trong OSSPEDIA, đầu trang mùa nếu có): khung **1:1**, hoặc giữ khung cũ nhưng ảnh `object-contain` trên nền cùng màu. Không phần nào của logo bị cắt.
- Không đổi bìa sang ảnh khác. Bìa sự kiện giữ nguyên.
- Mùa 7, 8 đang chưa có bìa: báo Kit tên file và kích thước cần đặt.

---

## ĐỢT 2

## 7. Mở đúng trận đấu bằng đường dẫn

- Mỗi trận trong trang mùa có mã ổn định: `vl`, `bk1`, `bk2`, `bk3`, `ck`. Đường dẫn dạng `#/wiki/cuoc-thi/mua-6?tran=bk3`: mở trang, cuộn tới đúng tiêu đề trận (không bị thanh menu che) và làm nổi bảng đó trong chốc lát. Tải lại trang hoặc dán sang tab mới vẫn mở đúng trận.
- Bấm mục lục trong trang mùa thì cập nhật đường dẫn (thay, không thêm lịch sử) để sao chép được.
- Dùng cùng cơ chế cho trang DAPHUC Olympia Championship 3, 4 nếu dùng chung thành phần; không thì báo lại.
- **Bảng vàng → Kỷ lục:** trong bảng top 10 của từng ô kỷ lục, **tên trận** ("Bán kết 3", "Chung kết"…) thành liên kết tới đúng trận. Kiểm: ô "Tổng điểm 400" có 2 dòng đồng hạng; dòng Nguyễn Việt Thành mở Bán kết 3 mùa 6, dòng Nghiêm Trung Đức mở Bán kết 1 mùa 9, mỗi dòng một lần bấm.
- Nơi khác đang ghi tên trận dạng chữ (bảng điểm theo mùa trong hồ sơ, dòng thời gian hồ sơ): nếu gắn liên kết đơn giản thì gắn luôn, báo lại chỗ đã gắn.

## 8. Tìm kiếm: thêm các mục của Bảng vàng

- Thêm vào dữ liệu tìm kiếm: Hall of Fame, THPT Sóc Sơn tại Đường lên đỉnh Olympia, Kỷ lục, Các thí sinh vào Chung kết 2 năm liên tiếp; và từng ô kỷ lục (Vòng loại, Khởi động, Vượt chướng ngại vật, Tăng tốc, Về đích, Tổng điểm), tên kết quả kèm điểm và người giữ, ví dụ "Kỷ lục Tổng điểm · 400 · Nguyễn Việt Thành, Nghiêm Trung Đức".
- Từ khoá phải khớp không dấu: "ky luc", "tong diem", "400", "hall of fame", "vong nguyet que".
- Chọn kết quả: mở Bảng vàng và cuộn tới đúng mục (đường dẫn dạng `#/bang-vang?muc=ky-luc`); với ô kỷ lục thì mở luôn bảng top 10 của ô đó nếu làm được gọn.
- Kiểm lại các ca đang chạy đúng, không được hỏng: "vo danh son", "mua 10", "OSS10", "nguyen thi ngoc anh" (2 hồ sơ phân biệt bằng trường và mùa), Enter mở kết quả đang chọn.

## 9. Nối bài Human of OSS với trận đấu được kể

- Thêm trường tuỳ chọn trong dữ liệu Human of OSS, ví dụ `tranLienQuan: [{ "mua": 3, "tran": "ck" }]`.
- Cuối bài: khối "Trận đấu được nhắc tới trong bài" với liên kết "Xem diễn biến Chung kết mùa {m}" (mở `?tran=ck` của mục 7).
- Trang mùa, dưới biểu đồ / bảng của trận đó: "Câu chuyện liên quan: {tiêu đề bài}" dẫn về bài.
- Dữ liệu ban đầu (3 bài có kể về đúng trận Chung kết): Trần Hải Linh → Chung kết mùa 3; Nguyễn Thanh Hà → Chung kết mùa 2; Lê Xuân Tùng → Chung kết mùa 4. Slug thực tế lấy theo dự án.

## 10. Gợi ý vuốt ngang cho bảng điểm rộng

- Bảng điểm nào rộng hơn vùng hiển thị (thường ở màn hẹp): hiện dòng chữ nhỏ "Vuốt ngang để xem điểm từng phần thi" ngay trên bảng. Bảng vừa khung thì không hiện. Áp dụng cho bảng trận và bảng điểm theo mùa trong hồ sơ.
- Giữ cột tên và cột Tổng đang ghim.

## 11. Kiểm tra dữ liệu tự động trước khi build

- Script `scripts/kiem-tra-du-lieu.mjs`, lệnh `npm run kiem-tra-du-lieu`, và gắn vào `prebuild` để chạy cả khi build trên máy lẫn GitHub Actions.
- **Lỗi (build dừng, in rõ file, mục, lý do):**
  - mã người / mùa / trận / sự kiện / bài được tham chiếu mà không tồn tại (trong matches, qualifying, olympia, events, `su-kien/*.json`, humans, testimonials, partners);
  - trùng `id` hoặc slug trong cùng một tập;
  - ô điểm không phải số hoặc `null`;
  - giá trị chuỗi đúng bằng `"?"`;
  - một trận Chung kết OSS không có đúng 1 Quán quân;
  - trích dẫn trong testimonials không còn nằm trong bài gốc (so như mục 1).
- **Cảnh báo (không dừng build):** ảnh được tham chiếu nhưng không có file (đã có ảnh thay thế khi thiếu).
- **Chạy trên dữ liệu hiện tại phải qua.** Nếu bắt được lỗi thật trong dữ liệu đang có: **dừng lại, liệt kê cho Kit**, không tự sửa dữ liệu.
- Ghi vào `README.md` cách chạy và ý nghĩa từng loại lỗi (ngắn gọn).

## 12. Dòng liên hệ sửa / gỡ thông tin ở hồ sơ thí sinh

- Cuối mỗi trang hồ sơ thí sinh, chữ nhỏ màu xám: "Nếu bạn là người trong hồ sơ này và muốn sửa hoặc gỡ thông tin, hình ảnh, vui lòng liên hệ olympiasocson@gmail.com." Địa chỉ email là liên kết `mailto:`.

---

## Kit kiểm tra sau mỗi đợt

**Đợt 1**
- Trang chủ: khối Cảm nhận có 6 trích dẫn thật, không còn "Họ và tên"; "Đọc bài phỏng vấn" mở đúng bài.
- Bấm "Sự thật khác" nhiều lần: không còn câu 5 điểm là cách biệt nhỏ nhất; có câu về trận hòa mùa 4.
- Các bảng trận vẫn theo vị trí đứng như cũ (ví dụ Bán kết 1 mùa 4: Thùy Dương, Duy Hưng, Trung Kiên, Huy Cường).
- Bảng vàng: Đặng Hồng Thái ghi "Giải Ba cuộc thi tuần".
- Trang chủ: bấm ảnh lớn và nút "Xem kết quả mùa 10" đều mở mùa 10; "Tra cứu thí sinh" mở danh sách. Thẻ Bảng vàng ghi "8 nhà vô địch OSS · 9 vòng nguyệt quế tại Đường lên đỉnh Olympia".
- Thư viện: bìa 10 mùa hiện trọn khối lập phương, cả trên điện thoại.

**Đợt 2**
- Bảng vàng → Tổng điểm 400 → bấm tên trận: mở đúng Bán kết 3 mùa 6 và Bán kết 1 mùa 9. Sao chép đường dẫn, mở tab mới vẫn đúng trận.
- Tìm "ky luc", "400": ra mục Kỷ lục.
- Bài Hải Linh → "Xem diễn biến Chung kết mùa 3" và ngược lại từ trang mùa 3.
- Điện thoại: bảng Chung kết mùa 10 có dòng "Vuốt ngang…".
- `npm run kiem-tra-du-lieu` qua; thử sửa tạm một mã thí sinh sai trong `matches.json` thì build phải dừng (xong nhớ trả lại).
