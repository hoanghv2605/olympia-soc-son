# Yêu cầu v0.9 (Kit đã duyệt)

Đọc `CLAUDE.md` trước. **Trình bày kế hoạch (file nào, sửa gì) trước khi sửa.** Xong mỗi mục chạy `npm run build` và `npm run typecheck`. Không thêm thư viện npm mới. Không sửa dữ liệu thi đấu (`matches.json`, `qualifying.json`, `olympia.json`, `people.json`, `seasons.json`); được sửa `departments.json`, `contacts.json`, `site.json` như ghi dưới đây. Mọi chuyển động tôn trọng `prefers-reduced-motion`. Mọi ảnh đi qua danh sách ảnh tự sinh (`hasImage` / `pickImage`) như v0.8.

Quy ước ảnh trận đấu (mới, dùng ở mục 3, 4, 5): **`public/images/tran-dau/<id trận>.jpg`**, `<id trận>` lấy đúng `id` trong `matches.json` (vd `oss10-bk1.jpg`, `oss10-ck.jpg`). Ảnh ngang tỉ lệ 3:2, ~1500×1000, < 400KB.

---

## 1. Liên hệ chuyển vào Footer

- **Bỏ khối "Liên hệ"** ở trang Về chúng tôi (cả bản đồ nhúng).
- Nếu địa chỉ / link bản đồ đang viết cứng trong code, chuyển vào `src/data/site.json` (vd `address`, `mapEmbedUrl`, `mapLink`).
- **Footer mới** (máy tính 4 cột, điện thoại xếp dọc):
  1. Logo, "Olympia Sóc Sơn", khẩu hiệu, 1 câu giới thiệu ngắn (lấy câu mở đầu trang chủ, rút gọn ≤ 25 từ).
  2. **Liên hệ**: những người trong `contacts.json` (tên đậm, chức vụ dòng nhỏ dưới).
  3. **Kết nối**: Fanpage, email (giữ icon như hiện tại), và dòng địa chỉ kèm link **"Xem bản đồ"** mở Google Maps ở tab mới.
  4. **Khám phá**: 5 mục menu chính.
  - Hàng dưới cùng giữ "© 2017–{năm hiện tại} Olympia Sóc Sơn".
  - Tiêu đề cột viết thường như câu (theo quy tắc tiêu đề).
- Ô "Về chúng tôi" trong khối Lối vào ở trang chủ: đổi mô tả thành "Lịch sử và cơ cấu tổ chức."

## 2. Trang chủ: khối bản đồ

- Thêm khối **cuối trang chủ** (sau "Đối tác đồng hành", ngay trước footer): `h2` "Tìm đến Olympia Sóc Sơn".
- Máy tính: bản đồ nhúng bên trái (khoảng 2/3 bề rộng, tỉ lệ 16:9, bo góc lớn), bên phải là dòng địa chỉ và nút "Mở trong Google Maps". Điện thoại: xếp dọc, bản đồ trước.
- `iframe` có `loading="lazy"`, `title="Bản đồ đường đến Olympia Sóc Sơn"`, `referrerpolicy="no-referrer-when-downgrade"`. Bản đồ chỉ có ở trang chủ, **không** ở footer.

## 3. Cơ cấu tổ chức (`/ve-chung-toi/co-cau-to-chuc`)

### 3a. Dữ liệu
- Thêm trường `leader` vào mỗi ban trong `departments.json`, mặc định `"Nguyễn Văn A"` cho cả 4 ban.
- Ảnh ban: giữ quy ước hiện có nếu đã có; nếu chưa thì `public/images/ban/<id>.jpg` (ngang 4:3).
- **Bỏ** dòng "Olympia Sóc Sơn vận hành với bốn ban. Chọn từng ban để xem nhiệm vụ."

### 3b. Máy tính (≥ `lg`)
- **Trạng thái sơ đồ (mặc định):** logo OSS trong vòng tròn (~200px) **ở giữa**; 4 ô ban (dạng viên thuốc như hiện tại, rộng ~280px) ở **4 góc** quanh logo (trên trái, trên phải, dưới trái, dưới phải). Từ mép logo có **4 đường nối mảnh** (SVG, màu `oss` 30%, dày 1,5px, dạng gấp khúc hoặc cong nhẹ) tới cạnh trong của từng ô. Khi khối cuộn vào màn hình, các đường tự vẽ ra (600ms, 1 lần). Logo lúc này không bấm được.
- **Bấm 1 ban → trạng thái chi tiết:** bố cục **đúng như ảnh Kit gửi**: logo nằm bên trái, 4 ô xếp dọc ngay bên phải logo, ô đang chọn tô đặc màu `oss` chữ trắng; bên phải là khung thông tin: ảnh ban (4:3, bo góc lớn) và thẻ thông tin trắng đè lên mép dưới ảnh, gồm:
  - tên ban (`h3`, màu `oss`)
  - **"Trưởng ban: {leader}"** (icon `PiUserCircle` trước nhãn, tên đậm)
  - nhiệm vụ của ban.
- **Hiệu ứng chuyển** (tự viết theo kỹ thuật FLIP, dùng `element.animate()`): trước khi đổi trạng thái, đo vị trí logo và 4 ô; sau khi đổi, cho chúng **trượt từ vị trí cũ sang vị trí mới** (450ms, chậm dần). Các đường nối mờ đi. Khung thông tin hiện sau 150ms (mờ dần + trượt nhẹ 300ms).
- Đang ở trạng thái chi tiết mà bấm ban khác: logo và các ô đứng yên, chỉ đổi ô được tô và **đổi nội dung khung** (mờ chéo 200ms).
- **Quay về sơ đồ:** bấm **logo** (lúc này là `<button aria-label="Quay về sơ đồ cơ cấu tổ chức">`) hoặc phím **Esc** → chạy hiệu ứng ngược lại, các đường nối hiện lại.
- Trợ năng: mỗi ô ban là `<button>` có `aria-expanded` và `aria-controls` trỏ tới khung thông tin; Esc trả focus về ô ban vừa chọn.

### 3c. Điện thoại và máy tính bảng (< `lg`)
Không dùng sơ đồ tỏa: logo căn giữa ở trên (~120px), 4 ô xếp lưới 2×2 bên dưới; chạm 1 ô thì khung thông tin (ảnh + thẻ) mở ngay dưới lưới, chạm lại ô đó thì đóng. Không có hiệu ứng FLIP.

### 3d. Giảm chuyển động
Không vẽ đường, không trượt; đổi trạng thái tức thì.

## 4. Trang mùa

### 4a. Chú thích chuyển vào biểu tượng ⓘ
- **Bỏ** dòng chú thích màu và dòng "KĐ: Khởi động · …" phía trên các bảng Bán kết.
- Thêm nút nhỏ **ⓘ** (`PiInfo`, `aria-label="Chú thích bảng Bán kết"`) ngay sau tiêu đề "Vòng Bán kết". Rê chuột (máy tính) hoặc bấm/chạm thì mở hộp chú thích nhỏ gồm: 2 ô màu mẫu ("Nhất trận, vào Chung kết" ô đặc `oss`; "Nhì cao điểm nhất, vào Chung kết" ô viền `oss`) và dòng "KĐ: Khởi động · VCNV: Vượt chướng ngại vật · TT: Tăng tốc · VĐ: Về đích". Đóng khi bấm ra ngoài hoặc Esc. Nút có `aria-expanded` và `aria-controls`.
- Làm tương tự cho tiêu đề "Trận Chung kết": hộp chú thích có 3 ô màu vàng / bạc / đồng (Quán quân / Á quân / Quý quân) và cùng dòng giải thích viết tắt.
- Chữ `sr-only` trong từng dòng bảng giữ nguyên; `<abbr title>` ở tiêu đề cột giữ nguyên.

### 4b. Ảnh mỗi trận Bán kết (**trên** bảng điểm)
- Đặt ngay dưới tiêu đề "Bán kết n", **trên** bảng; căn giữa, rộng tối đa 720px (điện thoại: hết bề ngang), tỉ lệ 3:2, bo góc. Dưới ảnh: chú thích chữ nghiêng nhỏ, căn giữa "Các thí sinh của trận Bán kết {n}".
- **Bấm ảnh để phóng to**: hộp nổi nền tối, ảnh lớn vừa màn hình, đóng bằng Esc / nút đóng / bấm ra ngoài, giữ focus trong hộp.
- **Chưa có ảnh:** hiện **dải giữ chỗ gọn** (rộng tối đa 720px, cao ~176px, nền tông nhạt của ảnh giữ chỗ): 4 vòng tròn chữ cái đầu (56px) **của đúng 4 thí sinh trận đó** theo thứ tự trong `matches.json`, tên mỗi người chữ nhỏ bên dưới; chú thích "Ảnh trận đấu đang được cập nhật". Dải giữ chỗ không bấm phóng to được.

### 4c. Ảnh Chung kết (**dưới** biểu đồ Diễn biến điểm số)
- Đặt dưới biểu đồ "Diễn biến điểm số", cùng kiểu như 4b, chú thích "Các thí sinh trận Chung kết mùa {n}". Chưa có ảnh thì dùng dải giữ chỗ như 4b với 4 thí sinh Chung kết.

### 4d. Dải ảnh mờ ở đầu trang mùa
- **Chỉ khi có ảnh Chung kết** của mùa đó: đặt ảnh làm nền cho vùng đầu trang (phía sau dòng chỉ đường, `h1`, nút chuyển mùa, dòng mô tả), cao ~320px (điện thoại ~220px), `object-fit: cover`, làm mờ nhẹ (`blur(2px)`) và nhạt (độ đậm ~35%), **tan dần xuống dưới** vào nền trang (`mask-image: linear-gradient(to bottom, black 45%, transparent)`). Thêm lớp phủ màu nền nhạt để chữ tiêu đề luôn đủ tương phản. Ảnh `aria-hidden`, `alt=""`.
- Chưa có ảnh thì đầu trang giữ như hiện tại, không có dải.
- Không áp dụng nền ảnh cho phần còn lại của trang.

## 5. Trang tổng hợp các mùa (`/wiki/cuoc-thi`)

- Dưới đầu trang: 1 dòng số liệu tự tính "{10} mùa · {91} thí sinh · {8} Quán quân" (Quán quân = số người khác nhau từng vô địch) và **nút chuyển "Thẻ / Bảng"** (`aria-pressed`). Mặc định **Thẻ**; nhớ lựa chọn bằng `localStorage` (bọc `try/catch`).
- **Chế độ Bảng:** giữ bảng như hiện tại.
- **Chế độ Thẻ:** lưới 3 cột (máy tính), 2 cột (máy tính bảng), 1 cột (điện thoại); thứ tự **Mùa 1 → Mùa 10**. Mỗi thẻ:
  - **Ảnh đầu thẻ** 3:2: ảnh Chung kết của mùa (`tran-dau/<oss{n}-ck>.jpg`) nếu có; chưa có thì nền tông màu (theo mùa) với **số mùa rất to** bằng `--font-display` và họa tiết khối lập phương. Góc dưới trái ảnh có nhãn "Mùa {n}".
  - **Thân thẻ**: 3 dòng có chấm huy chương (token gold / silver / bronze): Quán quân (tên đậm, điểm Chung kết căn phải), Á quân (các tên cách nhau dấu phẩy), Quý quân (các tên cách nhau dấu phẩy).
  - **Chân thẻ** chữ nhỏ: "{năm học} · Chung kết {dd/mm/yyyy}".
  - Cả thẻ là 1 link tới trang mùa (tên người trong thẻ là chữ thường, không lồng link). Rê chuột / focus: nhấc nhẹ 2px, viền chuyển màu `oss`.
- Kiểm tra: mùa 10 hiện Á quân "Nguyễn Tuấn Hùng, Võ Danh Sơn", Quý quân "Trương Tuấn Minh"; mùa 1 Quý quân "Nguyễn Minh Khải, Trương Tấn Dũng".

## 6. Lệnh liệt kê ảnh còn thiếu

- Script `scripts/anh-con-thieu.mjs`, thêm vào `package.json`: `"anh-con-thieu": "node scripts/anh-con-thieu.mjs"`. Chỉ đọc, không sửa file nào.
- In ra theo nhóm, mỗi nhóm có dòng "đã có x / y" rồi liệt kê **đường dẫn đầy đủ của từng file còn thiếu** (kèm tên người / trận để dễ nhận ra):
  - Thí sinh OSS (`images/thi-sinh/<id>.jpg`) và người trong mục THPT Sóc Sơn tại Đường lên đỉnh Olympia
  - Trận đấu (`images/tran-dau/<id trận>.jpg`, 30 Bán kết + 10 Chung kết)
  - Cột mốc, Nhận xét, Đối tác (`.svg` hoặc `.png`), Human of OSS, Các ban, Logo trường (`.svg` hoặc `.png`), ảnh trang chủ / giới thiệu, logo OSS.
- Dùng chung logic quét thư mục với script danh sách ảnh của v0.8.

## 7. Cập nhật tài liệu

- `CLAUDE.md`: quy ước ảnh trận đấu; footer chứa liên hệ (không còn khối Liên hệ riêng); bản đồ chỉ ở trang chủ; trường `leader` của ban; lệnh `npm run anh-con-thieu`.
- `README.md`: bảng tổng hợp **mọi loại ảnh** (thư mục, cách đặt tên, tỉ lệ, kích thước gợi ý) và hướng dẫn dùng `npm run anh-con-thieu`.

---

## Kiểm tra trước khi báo xong

- `npm run build` và `npm run typecheck` pass; không có lỗi 404 ảnh trong console.
- Footer hiện liên hệ trên mọi trang; Về chúng tôi không còn khối Liên hệ; trang chủ có khối bản đồ cuối trang, footer không có bản đồ.
- Cơ cấu tổ chức (1280px): mặc định logo giữa, 4 ban 4 góc có đường nối; bấm "Ban Hậu cần" → các phần tử trượt sang bố cục như ảnh, khung có "Trưởng ban: Nguyễn Văn A"; bấm ban khác chỉ đổi nội dung; bấm logo hoặc Esc → về sơ đồ. Ở 390px: lưới 2×2, chạm mở / đóng.
- Trang mùa 10: không còn dòng chú thích phía trên bảng; nút ⓘ ở "Vòng Bán kết" và "Trận Chung kết" mở đúng nội dung; mỗi Bán kết có dải giữ chỗ với đúng 4 tên (vd Bán kết 1: Nguyễn Quốc Huy, Nguyễn Khắc Triệu, Trương Tuấn Minh, Phạm Ngô Bảo Minh) nằm **trên** bảng; dải giữ chỗ Chung kết nằm **dưới** biểu đồ; không có dải ảnh đầu trang (vì chưa có ảnh).
- Thả tạm 1 ảnh bất kỳ tên `public/images/tran-dau/oss10-ck.jpg`, chạy lại `npm run dev`: trang mùa 10 có dải ảnh mờ ở đầu trang, ảnh dưới biểu đồ, thẻ Mùa 10 ở trang tổng hợp dùng ảnh đó, bấm ảnh thì phóng to. Xóa ảnh đi thì tất cả về giữ chỗ.
- Trang tổng hợp các mùa: mặc định chế độ Thẻ, 10 thẻ đúng thứ tự và đúng tên; chuyển sang Bảng rồi tải lại trang vẫn nhớ chế độ Bảng.
- `npm run anh-con-thieu` in đúng các nhóm, nhóm Trận đấu "đã có 0 / 40".
- Thử ở 1280px và 390px.

Báo lại: file đã sửa/thêm/xóa, kết quả build/typecheck, những chỗ phải xử lý khác brief (nếu có) và lý do.
