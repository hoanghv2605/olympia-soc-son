# Yêu cầu: chuyển sang dữ liệu v2 + làm cấu trúc web đã duyệt

Đọc `CLAUDE.md` trước. Làm theo thứ tự dưới đây, **trình bày kế hoạch trước khi sửa**, mỗi bước xong chạy `npm run build` + `npm run typecheck`.

> **Bản v2.2 (đã có quyết định của Kit).** Nếu dữ liệu v2 trước đó **đã được chuyển** vào `src/data` rồi: chỉ cần chép đè `seasons.json`, `stats.json`, `rules.json`, `olympia.json`, `milestones.json` từ `src/data/v2/` sang `src/data/`, xóa lại thư mục `v2`, rồi làm 2 việc: (1) thêm trường `seededDraw: boolean` vào kiểu `Season` và ẩn cột/mô tả nhóm hạt giống ở trang mùa khi `seededDraw` là `false` (mùa 3); (2) nhãn con số cầu truyền hình lấy đúng từ `stats.json` ("cầu truyền hình"). Nếu **chưa** chuyển thì bỏ qua đoạn này và làm từ Bước 1.

## Bước 1. Đưa dữ liệu v2 vào

Dữ liệu mới nằm ở `src/data/v2/` (chuẩn hóa từ 11 trang Fandom wiki OSS, mùa 1–10):

| File | Nội dung |
| --- | --- |
| `schools.json` | 5 trường: `id`, `name`, `short` |
| `people.json` | 91 thí sinh: `id`, `name`, `school` |
| `seasons.json` | 10 mùa: ngày VL/CK, năm học, địa điểm, MC, luật ĐLĐO năm thứ, đối tượng dự thi, `notes` (sự kiện đáng nhớ), `seededDraw` (mùa có bốc thăm theo nhóm hạt giống hay không; mùa 3 = `false`) |
| `qualifying.json` | Top 12 vòng loại mỗi mùa: `season`, `rank`, `person`, `class`, `school`, `score` |
| `matches.json` | 40 trận (3 BK + 1 CK mỗi mùa). Mỗi kết quả: `kd`, `vcnv`, `tt`, `vd`, `total`, `rank`; BK có `advanced`; CK có `placement` (`vo-dich` / `a-quan` / `giai-ba`). Trận có thể có `tiebreakWinner`, `notes` |
| `olympia.json` | 23 thành tích ĐLĐO của 12 cựu thí sinh OSS: `person`, `ossSeason`, `year`, `stage` (`tuan`/`thang`/`quy`/`nam`), `round`, `result`, `date?`, `note?` |
| `milestones.json` | Dòng thời gian (dùng `person` là mã thí sinh thay vì tên) |
| `stats.json` | Con số ấn tượng: mục `manual: true` nhập tay; mục còn lại tính từ dữ liệu (`olympiaContestants`, `olympiaLaurels`, phạm vi `scope: "soc-son"`) |
| `rules.json` | Nội dung trang Thể lệ: các vòng, phần thi, ghi chú luật, lịch sử đối tượng dự thi, thuật ngữ |

Việc cần làm:
1. Chuyển các file trong `src/data/v2/` lên `src/data/` (ghi đè `seasons.json`, `milestones.json`, `stats.json`), xóa `src/data/contestants.json` và thư mục `v2`.
2. Viết lại `src/types.ts` theo cấu trúc trên.
3. Viết lại `src/lib/data.ts`: hàm lấy dữ liệu + các hàm **tính** sau (không gõ tay số liệu):
   - quán quân / á quân / giải ba từng mùa (từ `placement` trận CK)
   - hồ sơ thí sinh: các mùa tham dự (hạng + điểm VL, các trận đã thi), danh hiệu OSS, thành tích ĐLĐO, cột mốc liên quan
   - thống kê trường: lượt top 12, vô địch, á quân, giải ba
   - kỷ lục: top theo điểm VL, Khởi động, VCNV, Tăng tốc, Về đích, Tổng điểm (giữ đồng hạng, không cắt giữa các người bằng điểm)
   - thí sinh vào CK ≥ 2 lần, thí sinh bảo vệ ngôi vô địch
   - số thí sinh ĐLĐO và vòng nguyệt quế (= số lần `result` là "Giải Nhất"), có tham số phạm vi: chỉ THPT Sóc Sơn hoặc mọi trường

## Bước 2. Menu và trang

- Menu chính: Về chúng tôi · OSSPEDIA · Bảng vàng · Human of OSS · Thư viện. Đổi "Wiki" thành **OSSPEDIA**. Bỏ tab OSSPEDIA trong Về chúng tôi (xóa `OsspediaTeaser`).
- **Về chúng tôi → Thể lệ** (`/ve-chung-toi/the-le`, đặt giữa Cơ cấu tổ chức và Liên hệ): lấy từ `rules.json`, có bảng đối tượng dự thi theo giai đoạn và bảng thuật ngữ.
- **Trang Giới thiệu**: phần Con số ấn tượng lấy từ `stats.json` + hàm tính (kết quả đúng phải là 400+, 7, 6, 1). Dòng thời gian đọc `milestones.json` (đổi mã thí sinh thành tên).
- **Trang mùa giải** `/wiki/cuoc-thi/mua-N`: hộp thông tin (thời gian, địa điểm CK, MC, luật ĐLĐO năm thứ, đối tượng), các `notes`, bảng Vòng loại (hạng, tên, lớp, trường, điểm, nhóm hạt giống; **chỉ hiện cột nhóm hạt giống và câu mô tả bốc thăm khi `seededDraw` là `true`**), 3 bảng Bán kết và bảng Chung kết (4 phần thi + tổng; đánh dấu người vào CK, danh hiệu ở CK, người thắng câu hỏi phụ). Tên thí sinh dẫn tới hồ sơ.
- **Danh sách thí sinh** `/wiki/thi-sinh`: bảng 91 người, lọc theo trường, tìm không dấu. **Hồ sơ** `/wiki/thi-sinh/:id`: các mùa tham dự với điểm từng trận, danh hiệu, thành tích ĐLĐO, dòng thời gian.
- **Trường** `/wiki/truong` và `/wiki/truong/:id`: thống kê và danh sách thí sinh của trường.
- **Bảng vàng** `/bang-vang`: Quán quân các mùa (điểm CK), OSS tại Đường lên đỉnh Olympia (cả 12 người, ghi rõ trường; hiển thị cả hai con số: chỉ THPT Sóc Sơn 7 thí sinh / 6 nguyệt quế, mọi trường 12 / 9), Kỷ lục, thí sinh vào CK nhiều lần.
- **Trang chủ**: danh sách quán quân đủ 10 mùa.
- Tìm kiếm OSSPEDIA: thí sinh, mùa, trường.

## Kiểm tra trước khi báo xong

So số trên web với các giá trị đúng sau:
- Quán quân: M1 Chu Đức Huy 210 · M2 Chu Đức Huy 265 · M3 Trần Hải Linh 165 · M4 Nguyễn Thùy Dương 220 (thắng câu hỏi phụ) · M5 Nguyễn Việt Thành 220 · M6 Nguyễn Việt Thành 290 · M7 Lê Trà My 250 · M8 Nguyễn Minh Chính 240 · M9 Nghiêm Trung Đức 290 · M10 Phạm Ngô Bảo Minh 195. Mùa 10 có **đồng Á quân** (Nguyễn Tuấn Hùng, Võ Danh Sơn, 180).
- Lượt top 12 theo trường: Sóc Sơn 92 · Đa Phúc 17 · Trung Giã 6 · Minh Phú 4 · Xuân Giang 1 (tổng 120).
- Kỷ lục tổng điểm: 400 – Nguyễn Việt Thành (M6, BK3) và Nghiêm Trung Đức (M9, BK1).
- Vào CK 2 lần: Chu Đức Huy, Nguyễn Thùy Dương, Trần Kim Cương, Nguyễn Việt Thành, Nguyễn Đoàn Hồng Thái, Nguyễn Sỹ Hoàng, Võ Danh Sơn.
- Hai trường hợp tổng 0: Nguyễn Hữu Phú An (CK M8), Nguyễn Quốc Huy (BK1 M10).
- Nguyễn Việt Thành, Chung kết năm Olympia năm thứ 23: kết quả hiển thị đúng chữ **"Quý quân"** (lấy từ dữ liệu, không đổi thành "Giải Ba").
- MC mùa 10: Đồng Lưu Nguyên Khang, Nguyễn Trần Đắc Phú, Ngô Mai Anh (BK), Trần Kim Cương (CK), Nguyễn Diệu Vy (BK + CK).

Báo lại: file đã sửa, kết quả build/typecheck, các số đã đối chiếu.
