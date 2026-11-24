# Yêu cầu v0.18 (Kit đã duyệt): chữ liền nhau, ngày thi đấu lên dòng thời gian hồ sơ, khối Đồng hành

Đọc `CLAUDE.md` trước. **Trình bày kế hoạch trước khi sửa.** Làm 2 đợt, xong mỗi đợt chạy `npm run build`, `npm run typecheck` rồi commit:
- **Đợt 1:** mục 1, 2, commit "v0.18 đợt 1".
- **Đợt 2:** mục 3, 4, commit "v0.18 đợt 2".

Không thêm thư viện npm. Không sửa kết quả thi đấu (chỉ thêm ngày).

Kit đã giải nén sẵn vào dự án:
- `docs/du-lieu-v0.18/ngay-thi-dau.json`: ngày từng vòng của 10 mùa OSS và DAPHUC Olympia Championship 3, 4 (khoá `oss{n}-vl`, `oss{n}-bk1..3`, `oss{n}-ck`, `doc3-…`, `doc4-…`); đã kiểm thứ tự ngày, **không sửa nội dung**;
- 8 ảnh mẫu logo `public/images/doi-tac/phoi-hop-1.png`, `phoi-hop-2.png`, `tai-tro-1.png` … `tai-tro-6.png`.

---

## 1. Sửa chữ liền nhau trên toàn web

- Lỗi: "**Lê Đức Cường**tham dự" (dòng thời gian hồ sơ, câu "tham dự"). Nguyên nhân là JSX ghép phần tử in đậm với chữ thường mà không có khoảng trắng.
- **Rà toàn bộ** `src/` những chỗ đặt `<strong>`, `<b>`, `<a>`, `<Link>`, `<span>` sát cạnh chữ hoặc biến chữ (dạng `</strong>{verb}`, `{name}<strong>`, xuống dòng trong JSX làm mất khoảng trắng), nhất là: câu dòng thời gian (hồ sơ, Về chúng tôi), "Bạn có biết?", lời mở đầu trang mùa / sự kiện, khung thông tin, thẻ Human of OSS, câu trong Hall of Fame. Sửa bằng `{" "}` hoặc ghép chuỗi đúng chỗ.
- **Nhãn trục biểu đồ Chung kết** ("Vượt chướng" / "ngại vật" xuống 2 dòng bằng `tspan`): máy đọc màn hình đang đọc thành "chướngngại". Thêm khoảng trắng giữa các `tspan` (hoặc `aria-label` đủ chữ), hình hiển thị không đổi.
- Thêm một hàm dùng chung cho câu dòng thời gian (dạng `{tên} {động từ} {phần nổi bật}`), mọi loại dòng đều đi qua hàm này để không lặp lại lỗi.
- Báo lại danh sách chỗ đã sửa.

## 2. Ngày thi đấu: thêm vào dữ liệu

- `matches.json`: thêm `date` cho **mọi** trận Bán kết và Chung kết OSS từ `ngay-thi-dau.json` (`oss{n}-bk{k}`, `oss{n}-ck`).
- Vòng loại OSS dùng `startDate` của mùa trong `seasons.json`. Đối chiếu `oss{n}-vl` với `startDate` và `oss{n}-ck` với `finalDate`: **khác nhau thì dừng lại báo Kit**, không tự sửa.
- `su-kien/doc3.json`, `doc4.json`: thêm ngày cho vòng loại, từng trận Bán kết và Chung kết (đặt tên trường theo cấu trúc file hiện có).
- Cập nhật kiểu dữ liệu.

---

## 3. Dòng thời gian hồ sơ: thêm các vòng thi (đợt 2)

Chỉ thêm vào **dòng thời gian trong hồ sơ thí sinh**. Trang Về chúng tôi ("Những cột mốc đáng nhớ") **không đổi**.

Giữ đúng kiểu hiển thị hiện tại: dòng ngày, câu chính (tên in đậm, phần nổi bật tô màu đậm như "giải Nhất" hiện nay), dòng phụ màu xám. **Câu chính chỉ chứa thành tích; tên vòng và tên giải nằm ở dòng phụ.**

| Vòng | Câu chính | Dòng phụ | Chấm |
| --- | --- | --- | --- |
| Vòng loại OSS | {tên} đạt **hạng {n}** | Vòng loại · Olympia Sóc Sơn mùa {m} · {điểm} điểm | tím (như dòng OSS) |
| Bán kết OSS | {tên} giành **giải Nhất / giải Nhì / giải Ba** | Bán kết {k} · Olympia Sóc Sơn mùa {m} | tím |
| Chung kết OSS (không vô địch) | {tên} trở thành **Á quân Olympia Sóc Sơn mùa {m}** / **Quý quân Olympia Sóc Sơn mùa {m}** | (không có) | tím |
| Chung kết OSS (vô địch) | giữ dòng Quán quân đang có, **không thêm dòng trùng** | | |
| DAPHUC Olympia Championship | như 3 dòng trên, đổi tên giải thành "DAPHUC Olympia Championship {n}"; Chung kết ghi cả Quán quân | | xanh (như dòng sự kiện) |

- Nhãn kết quả trong câu theo quy tắc hiện có (Bán kết: hạng 1 giải Nhất, 2 giải Nhì, 3 và 4 giải Ba). Điểm vòng loại định dạng tiếng Việt (37,25).
- Vòng loại và Bán kết của DAPHUC Olympia Championship chỉ có dòng với người có `ossPerson`.
- Sắp tất cả dòng theo ngày; cùng ngày thì theo thứ tự vòng (vòng loại → bán kết → chung kết), rồi dòng sự kiện / Olympia.
- Trận chưa có ngày: bỏ dòng đó (không đoán ngày).
- Ví dụ mong đợi, hồ sơ Nguyễn Minh Chính (6 dòng):
  19/11/2023 đạt hạng 9 (Vòng loại · Olympia Sóc Sơn mùa 7 · 31 điểm) → 26/11/2023 giành giải Ba (Bán kết 2 · Olympia Sóc Sơn mùa 7) → 18/02/2024 giành giải Nhất (Gặp nhau đầu năm 2024) → 06/10/2024 đạt hạng 12 (Vòng loại · Olympia Sóc Sơn mùa 8 · 38 điểm) → 13/10/2024 giành giải Nhất (Bán kết 3 · Olympia Sóc Sơn mùa 8) → 20/10/2024 trở thành Quán quân Olympia Sóc Sơn mùa 8.

## 4. Khối "Đồng hành cùng Olympia Sóc Sơn" (trang chủ, đợt 2)

### 4a. Dữ liệu
Thay `partners.json` bằng 14 mục (tên tạm, Kit sửa tên và logo sau):

```json
[
  { "id": "phoi-hop-1", "group": "phoi-hop", "name": "Đơn vị phối hợp tổ chức 1" },
  { "id": "phoi-hop-2", "group": "phoi-hop", "name": "Đơn vị phối hợp tổ chức 2" },
  { "id": "tai-tro-1", "group": "tai-tro", "name": "Nhà tài trợ 1" },
  { "id": "tai-tro-2", "group": "tai-tro", "name": "Nhà tài trợ 2" },
  { "id": "tai-tro-3", "group": "tai-tro", "name": "Nhà tài trợ 3" },
  { "id": "tai-tro-4", "group": "tai-tro", "name": "Nhà tài trợ 4" },
  { "id": "tai-tro-5", "group": "tai-tro", "name": "Nhà tài trợ 5" },
  { "id": "tai-tro-6", "group": "tai-tro", "name": "Nhà tài trợ 6" },
  { "id": "dong-hanh-1", "group": "dong-hanh", "name": "Đơn vị đồng hành 1" },
  { "id": "dong-hanh-2", "group": "dong-hanh", "name": "Đơn vị đồng hành 2" },
  { "id": "dong-hanh-3", "group": "dong-hanh", "name": "Đơn vị đồng hành 3" },
  { "id": "dong-hanh-4", "group": "dong-hanh", "name": "Đơn vị đồng hành 4" },
  { "id": "dong-hanh-5", "group": "dong-hanh", "name": "Đơn vị đồng hành 5" },
  { "id": "dong-hanh-6", "group": "dong-hanh", "name": "Đơn vị đồng hành 6" }
]
```

- Trường tuỳ chọn cho sau này: `role` (dòng chữ nhỏ dưới logo, vd "Bảo trợ truyền thông"), `url` (logo thành link mở tab mới). Chưa mục nào có.
- Logo: `doi-tac/{id}.png` hoặc `.svg` như hiện tại; chưa có thì ô hiện tên đơn vị.
- Bỏ trường `tier` và mọi chỗ dùng nó.
- **Ảnh mẫu cũ** `doi-tac/vang-*`, `bac-*`, `dong-hanh-7` … `dong-hanh-10`: xoá **chỉ khi là ảnh mẫu** (`OSS-ANH-MAU`); file nào là logo thật thì giữ và báo lại tên để Kit đổi tên.

### 4b. Hiển thị
- Tiêu đề khối: **"Đồng hành cùng Olympia Sóc Sơn"**. Dòng dưới: "{số đơn vị} đơn vị đã đồng hành cùng Olympia Sóc Sơn." (tự đếm).
- 3 hàng, mỗi hàng một tiêu đề nhỏ, theo thứ tự: **Đơn vị phối hợp tổ chức** (`phoi-hop`) · **Nhà tài trợ** (`tai-tro`) · **Đơn vị đồng hành** (`dong-hanh`). Nhóm trống thì ẩn.
- Logo **đứng yên, căn giữa**, xuống dòng khi hẹp; **bỏ** hiệu ứng chạy ngang và phần nhân đôi danh sách.
- Cỡ ô: hàng 1 lớn nhất, hàng 2 vừa, hàng 3 nhỏ hơn (giữ tỉ lệ ô hiện có). Bỏ viền màu vàng / bạc theo hạng; dùng một kiểu viền nhẹ chung.
- Có `role` thì hiện dưới logo, cỡ chữ phụ.
- Điện thoại (390px): hàng 1 hai ô một hàng, hàng 2 và 3 mỗi hàng 2–3 ô, không cuộn ngang.

### 4c. Tài liệu
`CLAUDE.md`, `README.md`: cấu trúc `partners.json` mới (`group`, `role`, `url`), cách đặt tên file logo, cách thêm đơn vị.

---

## Kiểm tra trước khi báo xong

- Build, typecheck pass.
- Hồ sơ Lê Đức Cường: "Lê Đức Cường tham dự" có khoảng trắng; dòng thời gian có Vòng loại mùa 5 (21/11/2021, hạng 1, 49 điểm) và Bán kết 1 mùa 5 (05/12/2021, giải Ba) trước dòng Rung chuông vàng 2023.
- Hồ sơ Nguyễn Minh Chính: đúng 6 dòng như ví dụ mục 3.
- Hồ sơ Đỗ Ngô Thiện Nhân: có dòng Vòng loại, Bán kết 3 và "trở thành Á quân DAPHUC Olympia Championship 3" (chấm xanh), xen đúng ngày với các dòng OSS.
- Hồ sơ Lê Trà My: dòng Quán quân mùa 7 chỉ xuất hiện **một lần**.
- Trang Về chúng tôi: số dòng và nội dung "Những cột mốc đáng nhớ" như trước.
- Trang chủ: khối "Đồng hành cùng Olympia Sóc Sơn", 3 hàng (2 · 6 · 6), không chạy ngang, dòng "14 đơn vị…". Thử 1280px và 390px.

Báo lại: file đã sửa/thêm/xóa, các chỗ chữ liền nhau đã sửa, ảnh logo cũ đã xoá / giữ, kết quả build/typecheck.
