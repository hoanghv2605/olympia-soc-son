# Yêu cầu v0.17 (Kit đã duyệt): sửa 3 lỗi nhỏ + tự thu nhỏ ảnh khi commit

Đọc `CLAUDE.md` trước. **Trình bày kế hoạch trước khi sửa.** Làm 1 đợt; xong chạy `npm run build`, `npm run typecheck` rồi commit "v0.17". Riêng việc thu nhỏ ảnh đang có (mục 3d) commit tách riêng.

Không thêm thư viện npm. Không sửa dữ liệu thi đấu.

---

## 1. Bảng 4 cột trên điện thoại: kết quả hiện dưới tên

Áp dụng cho các bảng có cột Kết quả nằm cuối và **không** có cột điểm từng phần: bảng trận giao hữu (`format: "xep-hang"`), bảng Bán kết và Chung kết của DAPHUC Olympia Championship 3 / 4. (Bảng mùa OSS nhiều cột điểm giữ cách cuộn ngang như hiện tại.)

- **Dưới 640px:**
  - ẩn cột Kết quả (cả ô tiêu đề);
  - trong ô Thí sinh, hiện `ResultBadge` cỡ nhỏ **ngay dưới tên** (căn theo tên, không theo ảnh tròn);
  - bảng vừa khung 390px, **không còn cuộn ngang**: tên và tên trường được xuống dòng (không cắt chữ, không `line-clamp`), cột Lớp hẹp lại.
- **Từ 640px trở lên:** như hiện tại (cột Kết quả riêng, không có badge dưới tên).
- Trợ năng: ở mỗi độ rộng màn hình, kết quả chỉ được đọc **một lần** (phần bị ẩn dùng `display: none`, không chỉ ẩn bằng mắt).
- Màu dòng và kiểu tô nổi bật của bảng Bán kết giữ nguyên.

## 2. Dòng thời gian: viết thống nhất "giải Nhất"

- Trong **câu** của dòng thời gian (hồ sơ thí sinh và trang Về chúng tôi), chữ "giải" viết thường: "giành **giải Nhất**", "giành **giải Ba**", "giành **giải Khuyến khích**". Hiện dòng sự kiện đang ghi "giành Giải Ba": sửa cho giống dòng Olympia.
- Danh hiệu giữ chữ hoa như hiện tại: "trở thành **Quán quân**", "trở thành **Quán quân Olympia Sóc Sơn mùa 7**".
- **Không đổi** các nhãn đứng riêng: `ResultBadge`, ô Kết quả trong bảng, chú thích ⓘ vẫn ghi "Giải Nhất", "Giải Nhì", "Giải Ba".
- Làm bằng một hàm dùng chung cho chữ trong câu, không sửa tay từng chỗ.

## 3. Tự thu nhỏ ảnh mỗi lần commit

### 3a. Script nhận danh sách file
- `scripts/thu-nho-anh.mjs` nhận thêm tham số là **đường dẫn file cụ thể**: `npm run thu-nho-anh -- public/images/a.jpg public/images/b.png`. Có đường dẫn thì chỉ xử lý các file đó; không có thì quét toàn bộ như hiện tại. `--thu` vẫn dùng được với cả hai cách.
- File không nằm trong `public/images/` (trừ `public/logo-oss.png`), không phải ảnh, hoặc là ảnh mẫu (`OSS-ANH-MAU`) thì bỏ qua, không báo lỗi.
- Giới hạn kích thước, cách nén giữ như v0.15.

### 3b. Git hook `pre-commit`
- Tạo thư mục **`.githooks/`** (được commit cùng dự án) với file `pre-commit` (có quyền chạy, `chmod +x`).
- `package.json` thêm script `"prepare": "git config core.hooksPath .githooks"`, để ai `npm install` cũng tự bật hook. **Chạy `npm run prepare` một lần** trên máy Kit.
- Hook làm:
  1. Lấy các file **được thêm hoặc sửa** trong lần commit này (`git diff --cached --name-only --diff-filter=AM -z`, xử lý đúng tên file có dấu cách) thuộc `public/images/**` hoặc là `public/logo-oss.png`, đuôi `.jpg`, `.jpeg`, `.png`, `.webp`.
  2. Không có file nào: thoát ngay, không in gì.
  3. Có: gọi `node scripts/thu-nho-anh.mjs` với đúng các file đó, rồi `git add` lại chúng để bản đã thu nhỏ được commit.
  4. In một dòng tóm tắt, ví dụ: "Đã thu nhỏ 3 ảnh (4,2 MB → 0,6 MB)".
- **Không chặn commit** khi không thu nhỏ được (không phải macOS, script lỗi): in cảnh báo rồi vẫn cho commit (thoát mã 0).
- Bỏ qua hook khi cần: `git commit --no-verify`.

### 3c. Thử hook trên nhánh tạm (không để lại commit thử trên `main`)
1. `git switch -c thu-hook`
2. Chép một ảnh lớn đang có thành `public/images/thu-vien/mua-1/thu-hook.jpg` (nếu không còn ảnh nào lớn hơn 1600px thì tạo bằng `sips -Z 2400` từ một ảnh bất kỳ).
3. `git add` rồi `git commit -m "thu hook"` → hook in dòng tóm tắt; kiểm tra file trong commit (`git show HEAD:public/images/thu-vien/mua-1/thu-hook.jpg > /tmp/x.jpg` rồi `sips -g pixelWidth -g pixelHeight /tmp/x.jpg`) có cạnh dài ≤ 1600.
4. Commit một file không phải ảnh trên nhánh đó → hook không in gì.
5. `git switch main` rồi `git branch -D thu-hook`, xoá file thử nếu còn.

### 3d. Thu nhỏ ảnh đang có
Chạy `npm run thu-nho-anh -- --thu`, đưa danh sách vào báo cáo, rồi `npm run thu-nho-anh` và commit riêng "Thu nhỏ ảnh" (nếu danh sách trống thì bỏ qua).

### 3e. Tài liệu
`CLAUDE.md` và `README.md`: hook tự thu nhỏ ảnh khi commit, lệnh `npm run prepare` khi chép dự án sang máy khác, `--no-verify` để bỏ qua, cách thu nhỏ từng file bằng tay.

---

## Kiểm tra trước khi báo xong

- Build, typecheck pass.
- Ở 390px: trang Gặp nhau đầu năm 2024 và DAPHUC Olympia Championship 3 (Bán kết 1, Chung kết) không cuộn ngang; kết quả hiện dưới tên. Ở 1280px: vẫn có cột Kết quả, không có badge dưới tên.
- Hồ sơ Lê Trà My: dòng thời gian ghi "giành giải Ba" (Gặp nhau đầu năm 2023), "giành giải Nhất" (Truyền lửa), "trở thành Quán quân" (Rung chuông vàng 2023). Bảng "Sự kiện khác" vẫn ghi "Giải Ba (Trận 2)".
- Đã thử hook theo 3c, nhánh `thu-hook` đã xoá, `main` không có commit thử.
- `git config core.hooksPath` trả về `.githooks`.

Báo lại: file đã sửa/thêm/xóa, kết quả build/typecheck, kết quả thử hook, danh sách ảnh đã thu nhỏ ở 3d và tổng dung lượng trước / sau.
