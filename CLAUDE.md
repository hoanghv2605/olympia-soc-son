# Olympia Sóc Sơn – website (ghi chú cho Claude Code)

Website lưu trữ lịch sử, kết quả và con người của **Olympia Sóc Sơn (OSS)**: sân chơi trí tuệ mô phỏng Đường lên đỉnh Olympia (ĐLĐO) cho học sinh THPT Sóc Sơn, Hà Nội, thành lập tháng 7/2017. Chủ dự án: Kit. Trả lời bằng tiếng Việt.

## Lệnh
- `npm run dev`: chạy thử (http://localhost:5173)
- `npm run build`: đóng gói. **Luôn chạy và phải pass trước khi báo xong.**
- `npm run typecheck`: kiểm tra TypeScript. Chạy kèm build.

## Công nghệ
React 19, TypeScript, Vite 8, Tailwind CSS 4 (cấu hình trong `src/index.css`, không có tailwind.config), React Router 8 dùng `HashRouter` (URL dạng `/#/...`), `vite.config.ts` có `base: "./"`. Deploy GitHub Pages qua `.github/workflows/deploy.yml`. Icon: `react-icons`. Markdown: `react-markdown`.

## Cấu trúc web (đã duyệt, v0.3)
Menu chính: **Về chúng tôi · OSSPEDIA · Bảng vàng · Human of OSS · Thư viện**
- Về chúng tôi (`/ve-chung-toi`): **Giới thiệu** (gồm cả phần Liên hệ ở cuối trang) và **Cơ cấu tổ chức**. Menu con căn phải. Không còn trang Thể lệ; `/ve-chung-toi/the-le` và `/ve-chung-toi/lien-he` chuyển hướng về `/ve-chung-toi`.
  - Thứ tự trang Giới thiệu (xen kẽ tối/sáng): Giới thiệu (tối) → Những cột mốc đáng nhớ (sáng) → Những con số ấn tượng (tối, 2 nhóm) → Liên hệ (sáng) → Footer (tối).
- OSSPEDIA (`/wiki`): mùa giải (`/wiki/cuoc-thi/mua-N`), thí sinh (`/wiki/thi-sinh/:id`), trường (`/wiki/truong/:id`), tìm kiếm
- Bảng vàng (`/bang-vang`): Quán quân các mùa (Hall of Fame nền tối, mỗi người 1 thẻ, chip vàng "Mùa n · điểm CK"), THPT Sóc Sơn tại Đường lên đỉnh Olympia (2 nút Toàn bộ thí sinh / Các thí sinh từ OSS, thẻ + hộp nổi), Kỷ lục, Các thí sinh vào Chung kết 2 năm liên tiếp (dải ảnh hình bình hành, `FinalistStrips`)
- Human of OSS (`/human-of-oss`, bài viết `/human-of-oss/:slug`), Thư viện

## Dữ liệu (quy tắc bắt buộc)
- Toàn bộ dữ liệu ở `src/data/*.json`; **mọi trang chỉ lấy dữ liệu qua `src/lib/data.ts`**.
- **Không gõ tay số liệu tính được** (quán quân, số thí sinh ĐLĐO, vòng nguyệt quế, cầu truyền hình, kỷ lục, thống kê trường…). Tính từ `matches.json`, `qualifying.json`, `olympia.json`. Chỉ các mục `"manual": true` trong `stats.json` là nhập tay.
- **Ô trống (`null`) ≠ 0**: `null` = không có dữ liệu / không thi; `0` = có thi, được 0 điểm. Không đổi `null` thành 0 khi hiển thị hay tính toán.
- Tổng điểm không âm: nếu 4 phần thi cộng ra số âm thì `total` = 0 (giữ nguyên điểm từng phần).
- Hòa điểm: `tiebreakWinner` của trận là người thắng câu hỏi phụ; `rank` trong trận đã tính sẵn.
- **Thí sinh OSS** = người có ít nhất 1 dòng trong `qualifying.json`. `people.json` có thể chứa người chỉ thi ĐLĐO (không thi OSS); OSSPEDIA (danh sách, tìm kiếm, trang trường, hồ sơ) chỉ dùng thí sinh OSS (`people` / `getPerson` trong `data.ts`), hồ sơ người không thi OSS ra 404.
- `olympia.json`: `ossSeason: number | null` (`null` = không thi OSS); `beforeOss: true` = tham gia ĐLĐO trước khi dự thi OSS (hiển thị chú thích "Tham gia trước khi dự thi OSS").
- Phạm vi ĐLĐO (`OlympiaPeriod`): **"từ OSS"** (`"oss"`) = dòng có `ossSeason` khác `null` và không `beforeOss`; **"toàn bộ"** (`"all"`) = mọi dòng. Lọc thêm theo trường (`"soc-son"` / `"all"`). Hàm: `olympiaRows`, `olympiaPeople`, `olympiaContestantCount`, `olympiaLaurelCount`, `olympiaTvBridgeCount`. Con số ấn tượng trang Giới thiệu dùng phạm vi "từ OSS".
- Vòng nguyệt quế = số dòng `result: "Giải Nhất"`; **cầu truyền hình** = số dòng `stage: "quy"` và `result: "Giải Nhất"` (tự tính, không nhập tay).
- Câu hỏi phụ: trong bảng trận đặt `*` sau tên người thắng, chú thích dưới bảng "* A thắng câu hỏi phụ trước B." (`tiebreakInfo`, `TiebreakNote`).
- **Không viết tắt tên vòng / kết quả trong giao diện** (không "BK", "CK", "VL", "ĐLĐO", "Vào Chung kết"). Luôn dùng `roundLabel(match?)` ("Vòng loại" / "Bán kết n" / "Chung kết") và `resultLabel(match?, entry)` trong `src/lib/data.ts`: Vòng loại → "Hạng N"; Bán kết theo `rank` → Giải Nhất (1) / Giải Nhì (2) / Giải Ba (3 và 4); Chung kết theo `placement` → Quán quân / Á quân / Quý quân. Chữ nhập tay trong `hosts` (`seasons.json`) được mở rộng "BK"/"CK" lúc đọc. Ngoại lệ có chủ đích: "OSS", "THPT", chữ `short` của trường trong `SchoolBadge`, và tiêu đề cột KĐ / VCNV / TT / VĐ (dùng `<abbr title>` qua `ScoreHeads`, trang mùa có dòng giải nghĩa trong `SemiLegend`).
- Thẻ Đường lên đỉnh Olympia ở Bảng vàng: dòng dưới tên = "Olympia năm thứ N" (nhiều năm thì tăng dần, cách dấu phẩy); hộp nổi của thí sinh OSS thêm "Thí sinh OSS mùa …" (`ossSeasonsOf`).
- Trang Các trường: thẻ trường (huy hiệu, huy chương, thanh tỉ lệ lượt top 12), sắp theo lượt top 12 ↓ → số thí sinh ↓ → tên (`schoolStats`).
- Thuật ngữ danh hiệu OSS: dùng thống nhất **Quán quân / Á quân / Quý quân** (không viết "Vô địch", "Giải ba"). Khóa `placement` giữ nguyên (`vo-dich` / `a-quan` / `giai-ba`); nhãn hiển thị lấy từ `PLACEMENT_LABEL` trong `src/lib/data.ts`. Thành tích ĐLĐO giữ nguyên chữ trong `olympia.json` ("Giải Nhất", "Giải Nhì", "Giải Ba", "Quý quân"). Top 12 = qua vòng loại.
- Bảng trận BK/CK giữ **đúng thứ tự thí sinh trong `matches.json`** (thứ tự đứng trên sân khấu), không sắp lại theo điểm. Bảng chỉ có cột Thí sinh (dòng phụ "lớp - tên trường đầy đủ") và điểm; kết quả thể hiện bằng màu dòng (BK: Nhất tím đậm, Nhì cao điểm nhất tím nhạt, có 1 dòng chú thích màu `SemiLegend`; CK: vàng/bạc/đồng) kèm chữ `sr-only`.
- Kỷ lục xếp hạng **kiểu Olympic (1-1-3)**: bằng điểm cùng hạng, người tiếp theo nhảy hạng; bảng lấy mọi dòng có điểm ≥ điểm dòng thứ 10 (`topRecords` trong `data.ts`).
- Human of OSS: thông tin bài ở `src/data/humans.json`, nội dung ở `src/content/human-of-oss/<slug>.md` (markdown, hiển thị bằng `react-markdown`, không bật HTML thô).
- Mã thí sinh (`people.json` → `id`) là cố định, dùng làm đường dẫn. Người trùng tên có hậu tố, ví dụ `nguyen-thi-ngoc-anh-xuan16`.
- Ngày lưu `YYYY-MM-DD`, hiển thị `dd/mm/yyyy`.

## Ảnh (theo quy ước tên file, không khai báo trong JSON)
- Thí sinh: `public/images/thi-sinh/<mã-thí-sinh>.jpg` (mã = `id` trong `people.json`)
- Cột mốc: `public/images/cot-moc/<YYYY-MM-DD>.jpg` (theo `date` của cột mốc)
- Human of OSS: `public/images/human-of-oss/<slug>.jpg`
- Logo: `public/logo-oss.svg` hoặc `public/logo-oss.png` (logo thật); `public/logo-oss-tam.svg` là logo tạm. Component `Logo` và favicon (script trong `index.html`) thử lần lượt `logo-oss.svg` → `logo-oss.png` → `logo-oss-tam.svg`.
- Logo trường: `public/images/truong/<id-trường>.svg` hoặc `.png` (id trong `schools.json`); `SchoolBadge` thử svg → png, chưa có thì hiện chữ `short`.
- Chưa có ảnh: người → ảnh giữ chỗ `Placeholder` (qua `PersonPhoto`, truyền `seed` = id thí sinh / slug Human of OSS): 1 trong 5 tông (tím, chàm, xanh, hồng, tím hồng; `src/lib/placeholder.ts`) chọn cố định theo tổng mã ký tự của `seed` chia dư 5; chữ viết tắt (chữ cái đầu 2 từ cuối, vd Lê Trà My → "TM") ~28% bề ngang khung, font `--font-display`; họa tiết khối lập phương chỉ vẽ nét (`CubeOutline`) tràn góc dưới phải. Cột mốc → logo OSS trên gradient tím (`MilestonePhoto`).
- `Photo` luôn hiện lớp giữ chỗ trước, ảnh thật tải xong thì mờ dần đè lên (200ms); lỗi tải thì giữ lớp giữ chỗ. Không có trạng thái trống/xám.

## Quyền riêng tư (đa số thí sinh dưới 18 tuổi)
Chỉ hiển thị họ tên, lớp, trường, kết quả thi. Không thêm số điện thoại, Facebook cá nhân, học lực hay lý do riêng của thí sinh. Ảnh cá nhân chỉ dùng khi có đồng ý.

## Thiết kế
Hiện đại, chất "học thuật", nền sáng tím nhạt kiểu màu nước, chữ tối (`ink`), màu chủ đạo tím `oss` (#6d28d9), điểm nhấn xanh/hồng lấy từ logo khối lập phương. Các mảng tối dùng lớp `paper-dark`. Font Be Vietnam Pro. Hiệu ứng chuyển động tiết chế, tôn trọng `prefers-reduced-motion`. Không nhồi chi tiết thừa. Giữ các token màu và lớp dùng chung trong `src/index.css` thay vì viết màu cứng.
- Màu huy chương: token `gold-*`, `silver-*`, `bronze-*` (nền `-bg`, viền, chữ `-ink`) trong `@theme`. Dùng `medalOf()` (`src/lib/medal.ts`) + component `MedalBadge`. Ánh xạ: hạng 1 / Quán quân / Giải Nhất → vàng; hạng 2 / Á quân / Giải Nhì → bạc; hạng 3 / Quý quân / Giải Ba → đồng.

### Tiêu đề và đầu trang
- Tiêu đề `h1`/`h2`/`h3` viết **chữ thường như câu**, không `uppercase`, không giãn chữ. Chỉ giữ in hoa ở chữ "OLYMPIA SÓC SƠN" cạnh logo (`wordmark` ở header/footer, chữ đi kèm logo lớn ở khối Giới thiệu) và mục menu trên máy tính.
- Thang cỡ chữ (lớp trong `src/index.css`): `.h1` `clamp(2rem, 4vw, 2.75rem)` đậm 700; `.h2` 1.5rem → 1.875rem đậm 700 (`.section-title` = `.h2` màu `oss`); `.h3` 1.125rem → 1.25rem đậm 600; line-height tiêu đề 1.25 (không thấp hơn, vì dấu tiếng Việt).
- Font tiêu đề **đã chốt (v0.7): Bricolage Grotesque** (nạp cùng Be Vietnam Pro trong thẻ Google Fonts ở `index.html`), qua token `--font-display` trong `@theme`; tiêu đề đậm 700. Dùng cho h1/h2/h3, chữ O-S-S và khẩu hiệu trang chủ, số lớn (Con số ấn tượng, ô Kỷ lục), tên thẻ Hall of Fame (lớp `.font-display`). Chữ thường vẫn là Be Vietnam Pro.
- Đầu trang dùng `PageHeader` (dòng chỉ đường, `h1`, 1 dòng mô tả, `actions`, `leading`) cho mọi trang cấp 1 và OSSPEDIA; tông `light` mặc định, `dark` **chỉ** ở Bảng vàng. Hồ sơ thí sinh giữ bố cục riêng nhưng `h1` dùng `.h1`.
- Khoảng cách giữa các mục lớn: **2 mức** `.section` (`py-12 md:py-16`, mục thường) và `.section-band` (`py-16 md:py-24`, khối nền màu).

### Bảng
- Ô số dùng lớp `.num` (`px-2 text-sm`, `min-width: 2.75rem`, `tabular-nums`).
- Dưới `md`: bảng trong khung cuộn ngang; cột đầu `.sticky-start` dính trái; bảng Bán kết/Chung kết cột Tổng và bảng thành tích hồ sơ cột Kết quả `.sticky-end` dính phải; ô dính có nền đặc cùng màu dòng và bóng mờ cạnh trong. Cột phụ (Trường, Lớp) ẩn `hidden md:table-cell`, đưa thành dòng nhỏ dưới tên.
- Bán kết: Nhất trận `data-tone="winner"` (nền `oss`, chữ trắng, dòng lớp - trường trắng 80%); Nhì cao điểm nhất `data-tone="outline"` (không tô nền, viền `oss` 2px bằng `box-shadow: inset` trên từng ô, tên đậm). Chung kết giữ vàng/bạc/đồng.

### Tìm kiếm, xem nhanh, "Bạn có biết?"
- **Tìm kiếm chung:** hàm tìm không dấu dùng chung ở `src/lib/search.ts` (`searchAll`: 3 nhóm Thí sinh (chỉ thí sinh OSS) / Mùa giải ("mùa 4", "mua 4", "oss4", "4") / Trường, mỗi nhóm tối đa 6 dòng). Hộp tìm kiếm `SearchDialog` do `SearchProvider` (bọc trong `SiteLayout`) quản lý; mở bằng nút tìm kiếm trên header, phím `/` hoặc `Ctrl/⌘ K`, hoặc `useSearch().open()` (vd `SearchTrigger` ở OSSPEDIA và ô Lối vào trang chủ). ↑ ↓ Enter Esc; đóng khi chuyển trang; trả focus về phần tử đã mở. Ô lọc ở trang danh sách Thí sinh là bộ lọc riêng.
- **Thẻ xem nhanh thí sinh** (`PersonPreview`, 1 thẻ cho cả trang, portal): chỉ cho **link chữ** có `data-person-preview="<id>"` (`PersonLink` tự gắn; link tên ở dòng thời gian). Không gắn cho thẻ ảnh hay kết quả tìm kiếm. Chỉ bật trên thiết bị có chuột `(hover: hover) and (pointer: fine)`; hiện sau 350ms, ẩn sau 150ms; thẻ `aria-hidden`.
- **"Bạn có biết?"** (trang chủ): mọi câu tự sinh từ dữ liệu trong `src/lib/facts.ts` (`buildFacts()`), không gõ tay số liệu. Thêm loại câu mới: viết 1 hàm trả về `Fact[]` (`{ id, text, to }`) rồi thêm vào danh sách trong `buildFacts()`. Ghi chú mùa chỉ lấy câu bắt đầu "Đây là" và ≤ 200 ký tự.

### Chuyển động
- Chỉ 3 điểm nhấn: lật ô ảnh lớn trang chủ (`HeroTiles`, lần đầu trong phiên, cờ `sessionStorage`), biểu đồ "Diễn biến điểm số" ở trang mùa (`ClimbChart`, vẽ dần khi cuộn tới), số chạy ở "Những con số ấn tượng" (`CountUp`). Ngoài ra chỉ có chuyển trạng thái nhỏ (header thu gọn, menu, hover).
- Luôn tôn trọng `prefers-reduced-motion: reduce`: không chạy hiệu ứng, hiện thẳng trạng thái cuối.

## Icon
- Icon mới dùng Phosphor (`react-icons/pi`) nét thường (không Fill/Bold); icon đã có từ trước giữ nguyên.
- Chỉ ở **tiêu đề và nhãn**, mỗi chỗ tối đa 1 icon, đứng trước chữ, `aria-hidden`, dùng component `IconLabel` (`inline-flex items-center gap-2`).
- Không đặt icon trong ô bảng, dòng danh sách, đoạn văn, menu, nút bấm, thẻ trường.
- Cỡ / màu: nhãn ô thông tin `size-4` màu chữ phụ; tiêu đề mục `size-[0.9em]` màu `oss` (nền tối Hall of Fame: `gold`); ô Kỷ lục `size-5` màu `oss`.

## Cách làm việc
- Thay đổi lớn: trình bày kế hoạch (file nào, sửa gì) trước khi sửa.
- Sau khi sửa: chạy `npm run build` và `npm run typecheck`, sửa hết lỗi rồi mới báo xong; nói rõ đã kiểm tra những gì.
- Không tự thêm thư viện mới nếu chưa hỏi. Thư viện đã được duyệt thêm: `react-markdown` (Human of OSS).
