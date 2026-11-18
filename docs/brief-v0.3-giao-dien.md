# Yêu cầu v0.3: chỉnh giao diện và cấu trúc (Kit đã duyệt)

Đọc `CLAUDE.md` trước. **Trình bày kế hoạch (file nào, sửa gì) trước khi sửa.** Làm theo thứ tự các mục; xong mỗi mục chạy `npm run build` và `npm run typecheck`. Không đổi nội dung dữ liệu trong `src/data` ngoài những chỗ ghi rõ dưới đây.

Được phép thêm **1 thư viện**: `react-markdown` (mục 9). Không thêm thư viện nào khác.

---

## 0. Quy ước dùng chung (làm trước)

**Thuật ngữ danh hiệu OSS:** dùng thống nhất **Quán quân / Á quân / Quý quân** trên toàn web (bảng, hồ sơ, thống kê trường, đoạn văn, nhãn). Không còn chữ "Vô địch" hay "Giải ba" cho danh hiệu Chung kết OSS. Khóa dữ liệu `placement` giữ nguyên (`vo-dich` → Quán quân, `a-quan` → Á quân, `giai-ba` → Quý quân); chỉ đổi nhãn hiển thị qua một hàm/bảng ánh xạ dùng chung. Thành tích Đường lên đỉnh Olympia giữ nguyên chữ trong `olympia.json` ("Giải Nhất", "Giải Nhì", "Giải Ba", "Quý quân").

**Màu huy chương:** thêm token vào `@theme` trong `src/index.css` và một component dùng chung (ví dụ `MedalBadge`) + hàm `medalOf(...)`. Gợi ý màu (nền nhạt + chữ đậm, phải đủ tương phản trên nền sáng):
- Vàng: nền `#FBF1C7`, viền/điểm nhấn `#C9A227`, chữ `#7A5C00`
- Bạc: nền `#EEF1F5`, viền `#9AA4B2`, chữ `#4B5563`
- Đồng: nền `#F6E3D3`, viền `#B8743F`, chữ `#7A4520`

Ánh xạ: hạng 1 / Quán quân / Giải Nhất → vàng; hạng 2 / Á quân / Giải Nhì → bạc; hạng 3 / Quý quân / Giải Ba → đồng.

**Ảnh theo quy ước tên file** (không cần sửa JSON; file chưa có thì hiện ảnh thay thế, dùng cơ chế fallback sẵn có của `Photo`):
- Thí sinh: `public/images/thi-sinh/<mã-thí-sinh>.jpg` (mã = `id` trong `people.json`, vd `le-tra-my.jpg`)
- Cột mốc: `public/images/cot-moc/<YYYY-MM-DD>.jpg` (theo `date` của cột mốc)
- Human of OSS: `public/images/human-of-oss/<slug>.jpg`

Tạo 3 thư mục trên (kèm `.gitkeep`), xóa thư mục `public/images/osspedia/`.

**Ảnh thay thế:**
- Người (thí sinh, Human of OSS): ô có **chữ viết tắt** trên nền gradient tím của OSS. Lấy chữ cái đầu của **2 từ cuối** trong họ tên, viết hoa (Lê Trà My → "TM", Nguyễn Việt Thành → "VT", Chu Đức Huy → "ĐH"). Tạo component dùng chung (vd `PersonPhoto`) cho hồ sơ, thẻ Bảng vàng, hộp nổi, Human of OSS.
- Cột mốc: logo OSS (`logo-oss.svg`) trên nền gradient tím.

---

## 1. Về chúng tôi

- **Bỏ hẳn Thể lệ:** xóa route `/ve-chung-toi/the-le`, trang, mục menu, `src/data/rules.json` và kiểu dữ liệu liên quan; xóa mọi liên kết tới Thể lệ ở nơi khác.
- **Gộp Liên hệ vào cuối trang Giới thiệu:** xóa route `/ve-chung-toi/lien-he`. Hai đường dẫn cũ `/ve-chung-toi/the-le` và `/ve-chung-toi/lien-he` chuyển hướng về `/ve-chung-toi`.
- **Menu con** còn 2 mục: Giới thiệu, Cơ cấu tổ chức. **Căn phải**, mép phải thẳng hàng với menu chính phía trên.
- **Thứ tự các phần trên trang Giới thiệu**, xen kẽ nền tối/sáng:
  1. Giới thiệu (nền tối như hiện tại)
  2. Những cột mốc đáng nhớ (nền sáng)
  3. Những con số ấn tượng (nền tối)
  4. Liên hệ (**chuyển sang nền sáng**: logo, fanpage, email, người liên hệ, bản đồ; chỉnh lại màu chữ/icon cho nền sáng)
  5. Footer (nền tối, giữ nguyên)
- **2 đoạn văn trắng ở phần Giới thiệu:** căn đều 2 bên (`text-align: justify`) **chỉ từ màn hình `md` trở lên**; điện thoại giữ căn trái.

## 2. Những cột mốc đáng nhớ

- **Thứ tự giữ cũ → mới.** Thêm **vạch chia theo năm** (2017, 2018, …) mỗi khi sang năm mới: máy tính đặt giữa trên đường kẻ, điện thoại đặt bên trái.
- **Tương tác** (vùng tương tác là **cả dòng**, không chỉ chấm tròn):
  - Máy tính: khi rê chuột hoặc focus bằng bàn phím vào một dòng → chấm tròn to lên, chữ dòng đó đậm màu hơn, các dòng khác mờ nhẹ (khoảng 55% độ đậm), và **ảnh của cột mốc hiện ở nửa trống bên kia đường kẻ, cạnh ngày tháng** (rộng khoảng 200–240px, tỉ lệ 4:3, bo góc, hiện mờ dần ~150ms).
  - Điện thoại (dưới `md`): chạm vào dòng để mở/đóng ảnh ngay dưới phần chữ; mỗi lúc chỉ mở 1 dòng.
  - Mỗi dòng phải focus được bằng Tab (`tabIndex={0}`), có viền focus rõ; tôn trọng `prefers-reduced-motion` (tắt hiệu ứng mờ dần/phóng to).
- **Ảnh:** `images/cot-moc/<date>.jpg`, chưa có thì dùng ảnh thay thế cột mốc (mục 0).

## 3. Những con số ấn tượng

5 ô, chia **2 nhóm có nhãn**, giữa 2 nhóm có vạch ngăn dọc (điện thoại: xếp nhóm trên/dưới, vạch ngang):
- **Nhóm "Olympia Sóc Sơn":** `10` mùa giải (**tự tính** = số mùa trong `seasons.json`, icon gợi ý: cúp) · `400+` thí sinh đăng kí dự thi (nhập tay)
- **Nhóm "THPT Sóc Sơn tại Đường lên đỉnh Olympia":** `7` thí sinh tham gia · `6` vòng nguyệt quế · `1` cầu truyền hình

Cập nhật `stats.json`: thêm mục `seasons` (tự tính), thêm trường `group` (`"oss"` / `"soc-son-olympia"`) cho từng mục. **Xóa dòng chú thích** "Các số liệu chỉ tính riêng trường THPT Sóc Sơn." (nhãn nhóm đã thay thế).

## 4. OSSPEDIA – trang chủ và danh sách mùa

- Dòng mô tả dưới chữ OSSPEDIA phải nằm **trên 1 dòng ở màn hình máy tính** (bỏ giới hạn bề rộng của đoạn này từ `lg` trở lên; dùng `text-wrap: balance` khi xuống dòng trên điện thoại).
- Bảng **Các mùa Olympia Sóc Sơn** (`/wiki/cuoc-thi`): thêm cột **Quý quân** sau cột Á quân; nhiều người thì xếp dọc từng tên như cột Á quân hiện tại. Kiểm tra: mùa 1 = Nguyễn Minh Khải, Trương Tấn Dũng; mùa 10 = Trương Tuấn Minh.

## 5. Hồ sơ thí sinh

Thêm ảnh ở **đầu ô thông tin bên phải**, tỉ lệ dọc **3:4**, chiếm hết bề rộng ô. Nguồn `images/thi-sinh/<id>.jpg`, chưa có thì hiện chữ viết tắt (mục 0).

## 6. Trang mùa (`/wiki/cuoc-thi/mua-N`, áp dụng cho cả 10 mùa)

Bố cục theo kiểu Fandom: đoạn văn bên trái, ô thông tin ngắn bên phải, bảng kết quả toàn bề rộng phía dưới.

**Ô thông tin bên phải** chỉ còn 5 dòng: Tên khác (`OSS7`), Năm học, Thời gian (`19/11/2023 – 03/12/2023`), Dẫn chương trình (mỗi người 1 dòng), Quán quân (tên có link + lớp, trường).

**Đoạn văn bên trái** (tự sinh từ dữ liệu, ngày dạng `dd/mm/yyyy`; số thứ tự mùa viết bằng chữ cho mùa 1–10: thứ nhất, thứ hai, thứ ba, thứ tư, thứ năm, thứ sáu, thứ bảy, thứ tám, thứ chín, thứ mười; từ 11 trở đi dùng số):
1. "**Olympia Sóc Sơn mùa {n}**, thường được gọi tắt là **{OSSn}**, là năm {thứ …} cuộc thi Olympia Sóc Sơn dành cho học sinh THPT tại Sóc Sơn. Cuộc thi bắt đầu từ vòng loại ngày {startDate} và trận Chung kết diễn ra ngày {finalDate} tại {venue}."
2. "Đối tượng tham gia là {eligibility}. Luật chơi của {OSSn} được mô phỏng dựa theo luật chơi của chương trình Đường lên đỉnh Olympia năm thứ {rulesBasedOn, nối bằng "và"}."
3. "Quán quân của {OSSn} là **{tên}**, học sinh lớp {lớp} trường {trường}. Á quân là … Quý quân là … và …" — tên có link tới hồ sơ. Khi có 2 Á quân (mùa 10) viết "Đồng Á quân là A (…) và B (…)".
4. Mục **Sự kiện đáng nhớ** từ `notes` (nếu có).

**Mục lục** (khung nhỏ bên trái, dưới đoạn văn): Vòng loại · Vòng Bán kết (Bán kết 1, 2, 3) · Trận Chung kết. Bấm để cuộn mượt tới bảng tương ứng bằng `scrollIntoView` (**không dùng `href="#..."`** vì web dùng HashRouter).

**Chuyển mùa:** nút "‹ Mùa {n-1}" và "Mùa {n+1} ›" ở **cả đầu trang** (ngang hàng tiêu đề, bên phải) **và cuối trang**. Mùa 1 không có nút lùi, mùa 10 không có nút tiến.

Giữ quy tắc `seededDraw` (mùa 3 không có cột/mô tả nhóm hạt giống).

## 7. Bảng Bán kết và Chung kết (trang mùa)

- **Giữ đúng thứ tự thí sinh như trong `matches.json`** (đó là thứ tự đứng trên sân khấu, khớp wiki). **Không sắp xếp** theo điểm. Kiểm tra: Bán kết 1 mùa 3 phải theo thứ tự Trần Kim Cương, Nguyễn Anh Quân, Trần Ngọc Hải, Lê Xuân Tùng.
- **Bỏ cột "Hạng" ở đầu bảng.** Cột **Kết quả** (cuối bảng) hiển thị:
  - Bán kết: thứ hạng trong trận bằng chữ **Nhất / Nhì / Ba / Tư** (từ `rank`; đồng hạng thì cùng chữ), kèm nhãn **"Vào Chung kết"** cho người đi tiếp.
  - Chung kết: **Quán quân / Á quân / Quý quân** bằng `MedalBadge`.
- **Tô nền dòng:**
  - Bán kết: người **Nhất** tô tím đậm hơn; người **Nhì cao điểm nhất** (đi tiếp với tư cách Nhì) tô tím nhạt hơn, nhãn "Vào Chung kết (Nhì cao nhất)".
  - Chung kết: cả 4 dòng tô theo huy chương (Quán quân vàng, Á quân bạc, Quý quân đồng). Mùa 10: 1 vàng, 2 bạc, 1 đồng.
- Giữ nhãn "Thắng câu hỏi phụ" như hiện tại.

## 8. Bảng vàng

### 8a. OSS tại Đường lên đỉnh Olympia
- **Chỉ hiện thí sinh THPT Sóc Sơn** (7 người), xếp theo mùa OSS. Bỏ ô số "Mọi trường". Phía trên lưới có dòng số liệu nhỏ: 7 thí sinh, 6 vòng nguyệt quế (tự tính, phạm vi THPT Sóc Sơn). Thí sinh trường khác vẫn giữ trong dữ liệu và OSSPEDIA.
- **Lưới thẻ** (máy tính 3–4 cột, điện thoại 2 cột): ảnh `PersonPhoto` (3:4), tên, "OSS mùa N", **thành tích cao nhất** và hàng chấm màu huy chương (mỗi thành tích 1 chấm).
  - Thành tích cao nhất: ưu tiên vòng cao hơn trước (Chung kết năm > Quý > Tháng > Tuần), cùng vòng thì Nhất > Nhì > Ba/Quý quân. Ví dụ Nguyễn Việt Thành → "Quý quân Chung kết năm, năm thứ 23".
- **Bấm thẻ → hộp nổi** (`role="dialog"`, `aria-modal`): ảnh, tên, trường, danh hiệu OSS, danh sách toàn bộ thành tích Đường lên đỉnh Olympia (mỗi dòng có `MedalBadge`, vòng thi, năm thứ, ngày nếu có, ghi chú nếu có), nút **"Xem hồ sơ đầy đủ"** tới `/wiki/thi-sinh/:id`. Đóng bằng Esc, nút ×, hoặc bấm ra ngoài; giữ focus trong hộp khi mở và trả focus về thẻ khi đóng. Điện thoại: hộp chiếm toàn màn hình.
- Màu: Giải Nhất vàng, Giải Nhì bạc, Giải Ba và Quý quân đồng.

### 8b. Kỷ lục
- **6 ô** theo thứ tự: Vòng loại, Khởi động, Vượt chướng ngại vật, Tăng tốc, Về đích, Tổng điểm. Mỗi ô hiện điểm kỷ lục và tên người giữ (tối đa 2 tên, nhiều hơn thì "+N").
- **Bấm ô → bảng xếp hạng hiện ngay dưới hàng ô** (mặc định chưa mở bảng nào; mỗi lúc mở 1 bảng; bấm lại để đóng; ô có `aria-expanded`).
- **Cách xếp hạng kiểu Olympic (1-1-3):** bằng điểm thì cùng hạng, người tiếp theo nhảy hạng (400, 400, 360 → hạng 1, 1, 3).
- **Số dòng:** tất cả các dòng có điểm ≥ điểm của dòng thứ 10 (top 10 + những người bằng điểm hạng 10).
- **Tô màu theo số hạng:** hạng 1 vàng, hạng 2 bạc, hạng 3 đồng (vì vậy có bảng không có bạc hoặc không có đồng; đó là đúng).
- Cột: Hạng · Thí sinh (link) · Mùa · Trận (Vòng loại / BK1… / CK) · Điểm.
- Kiểm tra theo dữ liệu hiện tại:

| Bảng | Số dòng | Vàng | Bạc | Đồng |
| --- | --- | --- | --- | --- |
| Vòng loại | 11 | 1 | 1 | 1 |
| Khởi động | 12 | 2 | 0 | 4 |
| Vượt chướng ngại vật | 10 | 2 | 0 | 5 |
| Tăng tốc | 11 | 1 | 2 | 0 |
| Về đích | 11 | 1 | 1 | 2 |
| Tổng điểm | 11 | 2 | 0 | 2 |

Các phần khác của Bảng vàng giữ nguyên.

## 9. Human of OSS

- Cài `react-markdown`. Mỗi bài viết: thông tin trong `src/data/humans.json` (`slug`, `name`, `title`, `quote` – câu trích ngắn hiện trên thẻ) + nội dung trong **`src/content/human-of-oss/<slug>.md`**. Đọc file bằng `import.meta.glob('../content/human-of-oss/*.md', { query: '?raw', import: 'default', eager: true })` (điều chỉnh đường dẫn cho đúng vị trí file). Không bật hiển thị HTML thô trong markdown.
- **Trang danh sách** `/human-of-oss`: lưới thẻ (ảnh `PersonPhoto` theo `images/human-of-oss/<slug>.jpg`, tên, vai trò, câu trích giới hạn 3 dòng). Bấm thẻ → `/human-of-oss/:slug`.
- **Trang bài viết** `/human-of-oss/:slug`: đường dẫn quay lại, ảnh, tên, vai trò, câu trích nổi bật, nội dung markdown với kiểu chữ của web (tiêu đề, đoạn, đậm/nghiêng, danh sách, trích dẫn, ảnh), bề rộng chữ tối đa ~68 ký tự. Slug không tồn tại → trang 404.
- **Chuyển bài mẫu hiện có** (Anh Chương Hải Lam): tạo `chuong-hai-lam.md` với nội dung là đúng câu trích đang có. **Không tự viết thêm nội dung.**

## 10. Cập nhật tài liệu

- `CLAUDE.md`: cấu trúc mới (Về chúng tôi chỉ còn Giới thiệu + Cơ cấu tổ chức, không còn Thể lệ; Human of OSS có trang bài viết), thuật ngữ Quán quân/Á quân/Quý quân, quy ước ảnh, màu huy chương, cách xếp hạng kỷ lục kiểu Olympic, thư viện `react-markdown`, vị trí `src/content/human-of-oss/`.
- `README.md`: cập nhật bảng dữ liệu (bỏ `rules.json`, thêm `src/content/human-of-oss/`) và bảng ảnh theo quy ước mới.

---

## Kiểm tra trước khi báo xong

- `npm run build` và `npm run typecheck` pass.
- Tìm trong `src/` không còn nhãn "Vô địch" hoặc "Giải ba" cho danh hiệu Chung kết OSS.
- Thử ở bề rộng 1280px và 390px: menu con căn phải; trang Giới thiệu đúng thứ tự 5 phần; cột mốc hover/focus/chạm đúng mô tả; 5 con số chia 2 nhóm; bảng mùa có cột Quý quân; trang mùa có mục lục và nút chuyển mùa ở đầu và cuối; bảng trận giữ thứ tự gốc; Bảng vàng có 7 thẻ và hộp nổi; 6 ô kỷ lục khớp bảng kiểm tra; Human of OSS mở được bài viết.
- Bàn phím: Tab tới được dòng cột mốc, thẻ Bảng vàng, ô kỷ lục; Esc đóng hộp nổi.

Báo lại: danh sách file đã sửa/thêm/xóa, kết quả build/typecheck, và các số đã đối chiếu.
