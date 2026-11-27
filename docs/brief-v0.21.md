# Yêu cầu v0.21 (Kit đã duyệt): số liệu đăng kí dự thi, giới tính trong hồ sơ, Vòng loại mở cho THCS

Đọc `CLAUDE.md` trước. **Trình bày kế hoạch trước khi sửa.** Làm 2 đợt, xong mỗi đợt chạy `npm run build`, `npm run typecheck` rồi commit:
- **Đợt 1:** mục 1–5, commit "v0.21 đợt 1". Xong đợt 1 thì **dừng lại báo Kit**, chờ Kit kiểm tra trên web rồi mới làm đợt 2.
- **Đợt 2:** mục 6–10, commit "v0.21 đợt 2".

Không thêm thư viện npm (biểu đồ tự vẽ bằng HTML/SVG như `ClimbChart`). Không đổi font, router (giữ `#/`). Không sửa kết quả, điểm số, lớp, trường của thí sinh, trừ 3 chỗ sửa lớp Kit đã chốt ở mục 1.

**Quy tắc riêng tư cho cả bản này:**
- Dữ liệu mới chỉ có **số đếm** theo mùa. Không hiện tên, không có danh sách người đăng kí ở bất kì đâu trên web hay trong repo.
- Mỗi biểu đồ chỉ chia theo **một** tiêu chí (khối, giới tính hoặc trường). Không chia chéo kiểu "trường X, nữ, lớp 12".
- Thông tin cá nhân duy nhất được thêm là giới tính của người đã có hồ sơ OSSPEDIA.

Dữ liệu Kit đặt sẵn trong `docs/du-lieu-v0.21/`:
- `dang-ky.json`: số liệu đăng kí 10 mùa (492 đơn hợp lệ), đã tổng hợp, không có tên.
- `gioi-tinh.json`: giới tính của 94 người trong `people.json` (`nam` / `nu`).

---

## ĐỢT 1

## 1. Đưa dữ liệu vào dự án

- Chép `docs/du-lieu-v0.21/dang-ky.json` sang `src/data/dang-ky.json` (giữ nguyên nội dung, kể cả `_ghiChu`).
- Gộp `gioi-tinh.json` vào `src/data/people.json`: thêm trường `"gender"` ngay sau `"school"` cho đúng 94 mã có trong file (91 thí sinh từng vào top 12 và 3 người chỉ thi Đường lên đỉnh Olympia). Mã nào trong `gioi-tinh.json` không có trong `people.json`, hoặc người nào trong `people.json` không có trong `gioi-tinh.json`, thì **dừng lại báo Kit**.
- **Sửa lớp 3 thí sinh** (Kit đã chốt theo danh sách đăng kí):

  | Mã thí sinh | Mùa | Lớp cũ | Lớp mới |
  | --- | --- | --- | --- |
  | `nguyen-thi-ngoc-anh-xuan16` | 2 | 12C | 12A |
  | `nguyen-anh-quan` | 3 | 11A1 | 11A |
  | `nguyen-khac-trieu` | 10 | 10A2 | 10A6 |

  - Sửa ở `qualifying.json` và mọi trận của người đó **trong đúng mùa đó** ở `matches.json` (bản trước đó thấy ở `oss2-bk2`, `oss3-bk1`, `oss10-bk1`), cùng mọi file dữ liệu khác có ghi lớp của họ trong mùa đó.
  - Không sửa mùa khác. Lớp cũ trong dữ liệu không khớp bảng trên thì **dừng lại báo Kit**.
- `src/types.ts`:
  - `Person`: thêm `gender?: "nam" | "nu"`.
  - `Season`: thêm `qualifyingNote?: string` (dùng ở mục 5).
  - Kiểu mới cho `dang-ky.json`: `otherSchools: { id: string; name: string }[]` và `seasons: { season; total; byGrade: Record<string, number>; byGender: { nam?: number; nu?: number }; bySchool: Record<string, number> }[]`. Khóa `byGrade` là `"9"`, `"10"`, `"11"`, `"12"` (9 = học sinh THCS). Khóa `bySchool` là `School.id` hoặc mã trong `otherSchools` (`kim-anh`, `thcs`).
- `src/lib/data.ts`: thêm các hàm dùng chung cho đợt 2:
  - `registrationOf(season)`: số liệu đăng kí của một mùa, `undefined` nếu chưa có.
  - `totalRegistrations()`: tổng `total` các mùa.
  - `schoolLabel(id)`: tên trường trong `schools.json`, không có thì tìm trong `otherSchools`.
  - `top12Breakdown(season)`: đếm 12 người vào Bán kết theo khối (số đầu của `class` trong `qualifying.json`), giới tính (`people.gender`), trường (`qualifying.school`).
  - `genderFunnel()`: số nam / nữ ở 4 chặng, **tính theo lượt**:
    - Đăng kí: cộng `byGender` các mùa.
    - Top 12: các dòng `qualifying.json`.
    - Chung kết: kết quả các trận `chung-ket`.
    - Quán quân: dòng `placement: "vo-dich"`.

## 2. Kiểm tra dữ liệu (`scripts/kiem-tra-du-lieu.mjs`)

**Lỗi (dừng build):**
- `dang-ky.json`: mỗi mùa phải có `total` = tổng `byGrade` = tổng `byGender` = tổng `bySchool`.
- Khóa `byGrade` ngoài 9–12; khóa `bySchool` không có trong `schools.json` hay `otherSchools`; mùa không có trong `seasons.json`; một mùa xuất hiện 2 lần.
- Top 12 của một mùa nhiều hơn số đăng kí cùng nhóm, ví dụ top 12 có 3 nữ mà đăng kí chỉ có 2 nữ. Kiểm cả 3 tiêu chí.
- `people.gender` có giá trị khác `nam` / `nu`.

**Cảnh báo (không dừng build):**
- Mùa có trong `seasons.json` mà chưa có trong `dang-ky.json` (mùa mới chưa nhập).
- Người từng vào top 12 mà chưa có `gender`.

Dữ liệu hiện tại phải qua. Bổ sung `README.md` 2 dòng về các kiểm tra mới.

## 3. Giới tính trên hồ sơ thí sinh

- Khung "Thông tin nhanh": thêm dòng **"Giới tính"** ngay dưới "Năm sinh", giá trị "Nam" hoặc "Nữ".
  - Biểu tượng cùng bộ với các dòng khác (hình người).
  - Không có `gender` thì **ẩn dòng**.
- **Chỉ là chữ**: không tô màu tên, khung ảnh, nhãn hay huy hiệu theo giới tính. Màu xanh / hồng chỉ dùng trong biểu đồ ở đợt 2.

## 4. "Những con số ấn tượng": tổng lượt đăng kí tính từ dữ liệu

- Mục `registrations` trong `src/data/stats.json`:
  - Bỏ `"value": "450+"` và `"manual": true`.
  - Đổi nhãn thành **"lượt đăng kí dự thi"**.
- Giá trị lấy từ `totalRegistrations()`, hiện số chính xác (hiện tại **492**), không thêm dấu "+".
- Lý do ghi "lượt": một người đăng kí nhiều mùa được đếm nhiều lần.

## 5. Mùa 7 và mùa 8: Vòng loại mở cho học sinh THCS

- `seasons.json`, mùa 7 và mùa 8, thêm:
  `"qualifyingNote": "Riêng Vòng loại, Ban Tổ chức mở đơn đăng kí cho cả học sinh THCS."`
- Trang mùa: hiện câu này **ngay sau câu "Đối tượng tham gia là …"**, cùng đoạn đó. Không sửa chuỗi `eligibility`.
- Mùa 7: thêm vào **cuối** `notes`:
  `"Đây là mùa đầu tiên Vòng loại mở đơn đăng kí cho cả học sinh THCS."`
  Câu này bắt đầu bằng "Đây là" nên sẽ tự vào "Bạn có biết?"; kiểm tra là có.

---

## ĐỢT 2

### Quy ước chung cho biểu đồ ở mục 6–8

Làm một component dùng chung, ví dụ `RatioBar`: một thanh 100% chia đoạn theo số đếm.

**Chữ trong thanh và chú thích**
- Đoạn rộng từ khoảng 12% trở lên thì ghi số đếm trong đoạn. Đoạn hẹp hơn thì không ghi trong thanh.
- **Chú thích luôn hiện dưới thanh**, ghi đủ mọi nhóm: "Nam 43 · 80%". Chú thích là chữ thật, không chỉ là màu.
- Phần trăm làm tròn số nguyên, tổng không cần đúng 100. Số thập phân hiện kiểu Việt Nam, 1 chữ số: `4,1`.

**Màu**

| Nhóm | Màu | Chữ trong thanh |
| --- | --- | --- |
| Nam | `#2563EB` | trắng |
| Nữ | `#DB2777` | trắng |
| Lớp 9 (THCS) | `#EDE9FE` | màu chữ chính |
| Lớp 10 | `#C4B5FD` | màu chữ chính |
| Lớp 11 | `#7C3AED` | trắng |
| Lớp 12 | `#4C1D95` | trắng |
| THPT Sóc Sơn | `#6D28D9` | trắng |
| THPT Đa Phúc | `#0F766E` | trắng |
| THPT Minh Phú | `#B45309` | trắng |
| THPT Trung Giã | `#0369A1` | trắng |
| THPT Xuân Giang | `#BE123C` | trắng |
| THPT Kim Anh | `#4D7C0F` | trắng |
| Các trường THCS | `#6B7280` | trắng |

- Thứ tự đoạn:
  - Khối: từ thấp lên cao.
  - Giới tính: Nam rồi Nữ.
  - Trường: theo thứ tự trong bảng trên.
- Giữa các đoạn có khe trắng 2px.

**Trợ năng và điện thoại**
- Mỗi thanh có `role="img"` và `aria-label` đọc đủ số liệu.
- Trên điện thoại: nhãn hàng nằm trên thanh, thanh rộng hết khung, không tràn ngang.
- Không thêm hiệu ứng chạy khi cuộn tới.

## 6. Trang mùa: số liệu đăng kí ở mục Vòng loại

Chèn khối mới **giữa đoạn "12 thí sinh có kết quả cao nhất…" và bảng xếp hạng Vòng loại**. Mùa chưa có trong `dang-ky.json` thì không hiện khối.

**Hai ô số** (kiểu giống ô số trang trường):
- "{total} thí sinh đăng kí".
- "12 vào Bán kết · {12/total}%".

Trong một mùa, mỗi đơn là một người nên ở đây ghi **"thí sinh"**. Chỉ con số cộng nhiều mùa mới ghi "lượt".

**Ba hàng thanh tỉ lệ:** Khối, Giới tính, Trường.
- Nhãn khối: "Lớp 10"… Riêng lớp 9 ghi "Lớp 9 (THCS)".
- Nhãn trường lấy từ `schoolLabel`.
- Chỉ hiện nhóm có số lớn hơn 0.

**Nút bật/tắt "So với top 12"** (mặc định tắt, có `aria-pressed`):
- Khi bật, dưới mỗi thanh "Đăng kí" thêm thanh "Top 12", số liệu từ `top12Breakdown`.
- Hai thanh dùng cùng màu, cùng thứ tự, và có nhãn nhỏ "Đăng kí" / "Top 12" ở đầu.

**Kiểm với số thật:**
- Mùa 7: 54 thí sinh, 22% vào Bán kết.
  - Khối: Lớp 9 (THCS) 2 · Lớp 10 23 · Lớp 11 29.
  - Giới tính: Nam 43 · Nữ 11.
  - Trường: Sóc Sơn 37 · Đa Phúc 11 · Minh Phú 2 · Trung Giã 2 · Các trường THCS 2.
  - Top 12: 3 nữ.
- Mùa 1: Lớp 12 có 6.
- Mùa 9: top 12 không có nữ.

## 7. Trang trường: phần "Đăng kí dự thi"

Thêm mục `h2` "Đăng kí dự thi" **giữa hàng ô số và bảng "Thí sinh"**. Áp dụng cho 5 trường trong `schools.json`. Không tạo trang cho Kim Anh hay THCS.

**Một câu tóm tắt:**
"Qua {n} mùa, {trường} có {dk} lượt đăng kí dự thi và {t} lượt vào top 12: cứ khoảng {dk/t} lượt đăng kí thì có 1 lượt vào top 12."
- Nếu `t = 0` thì thay vế sau bằng "chưa có lượt nào vào top 12".

**Danh sách theo mùa**, mỗi mùa một hàng:
- "Mùa n" là liên kết tới mục Vòng loại của mùa đó (`?tran=vl`).
- Thanh ngang dài theo số đăng kí, so với mùa đông nhất của chính trường đó, màu của trường.
- Nhãn "{dk} đăng kí · {t} vào top 12".
- Mùa không có đơn: hiện chữ xám "Không có đơn đăng kí", không vẽ thanh.

**Kiểm với số thật:**
- THPT Sóc Sơn: 337 lượt, 92 lượt top 12, khoảng 3,7.
- THPT Minh Phú: 35 lượt, 4 lượt top 12, khoảng 8,8.
- THPT Đa Phúc: 77 lượt, 17 lượt top 12, khoảng 4,5.

## 8. Trang "Các mùa giải": mục "Toàn cảnh {n} mùa"

Thêm mục `h2` "Toàn cảnh {n} mùa" **dưới danh sách các mùa**. Mục gồm 2 phần.

**8a. Thí sinh đăng kí qua các mùa:**
- Mỗi mùa một hàng: "Mùa n" (liên kết `?tran=vl`), thanh ngang màu `#6D28D9` dài theo số đăng kí so với mùa đông nhất, nhãn "{total} thí sinh · {total/12} đơn cho một suất Bán kết".
- Một dòng tổng ở trên: "{tổng} lượt đăng kí cho {số dòng qualifying} suất vào Bán kết."

**8b. Phễu "Từ đơn đăng kí tới ngôi Quán quân":**
- 4 hàng: Đăng kí dự thi → Top 12 → Chung kết → Quán quân.
- Mỗi hàng có nhãn "{tên chặng} · {tổng} lượt", một thanh 100% Nam / Nữ (số liệu từ `genderFunnel()`), và chữ "Nữ {x}%" ở cuối hàng.
- Chú thích nhỏ dưới phễu: "Tính theo lượt: một người vào top 12 ở hai mùa được tính hai lượt."
- Kiểm với số thật: 492 → 120 → 40 → 10 lượt; nữ 36% → 18% → 18% → 20%.

## 9. "Bạn có biết?": 4 câu mới từ số liệu đăng kí

Viết trong `src/lib/facts.ts` theo cách các hàm đang có, **tính từ dữ liệu**, không gõ cứng số.

**1. Mùa đông nhất:**
"Mùa {m} có nhiều thí sinh đăng kí nhất: {n} thí sinh."
- Nhiều mùa bằng nhau thì nối bằng `joinViText`.
- Link tới Vòng loại mùa đó.
- Hiện tại: mùa 5, 69.

**2. Độ cạnh tranh:**
"Qua {N} mùa có {tổng} lượt đăng kí cho {suất} suất vào Bán kết, trung bình {a} lượt cho một suất; cạnh tranh nhất là mùa {m} với {b} lượt cho một suất."
- Link "/wiki/cuoc-thi".
- Hiện tại: 492, 120, 4,1; mùa 5 với 5,8.

**3. Phễu giới:**
"Nữ chiếm {a}% số lượt đăng kí dự thi nhưng chỉ chiếm {b}% số lượt vào top 12."
- Nếu `b ≥ a` thì đổi "nhưng chỉ chiếm" thành "và chiếm".
- Link "/wiki/cuoc-thi".
- Hiện tại: 36% và 18%.

**4. Tỉ lệ nữ qua các mùa:**
"Tỉ lệ nữ trong số thí sinh đăng kí cao nhất ở {các mùa} ({x}%), thấp nhất ở {các mùa} ({y}%)."
- So bằng phần trăm đã làm tròn; các mùa bằng nhau thì nối lại.
- Hiện tại: "mùa 3 và mùa 5 (48%)", "mùa 7 (20%)".

## 10. Script cập nhật cho mùa sau (`npm run tong-hop-dang-ky`)

Để mùa 11 trở đi Kit tự cập nhật, không cần gửi số liệu ra ngoài.

**Đầu vào:**
- File CSV đặt trong thư mục `du-lieu-rieng/`.
- Cột: `STT, Mùa, Họ và tên, Lớp, Trường, Giới tính`, đúng như tab danh sách Kit đang giữ.

**Bảo vệ danh sách gốc:**
- Thêm `du-lieu-rieng/` vào `.gitignore`.
- Thêm vào `.githooks/pre-commit`: từ chối commit nếu có file nào nằm trong `du-lieu-rieng/`.

**Script `scripts/tong-hop-dang-ky.mjs` làm 3 việc:**
1. **Chuẩn hoá:**
   - Tên: Unicode NFC.
   - Lớp: bỏ chữ "Lớp", viết hoa ("10a2" → "10A2"). Khối là số đầu của lớp.
   - Trường: đối chiếu theo tên trong `schools.json` và `otherSchools`. Tên bắt đầu bằng "THCS" thì xếp vào `thcs`. Trường không nhận ra thì dừng và liệt kê.
   - Giới tính: "Nam" / "Nữ".
2. **Ghi lại `src/data/dang-ky.json`** theo đúng cấu trúc hiện có. Giữ `_ghiChu` và `otherSchools`.
   - Chỉ ghi nhóm có số lớn hơn 0.
   - Thứ tự khóa: `byGender` là nam rồi nu; `bySchool` theo thứ tự `schools.json` rồi `otherSchools`.
   - Ghi bằng `JSON.stringify(…, null, 2)` cộng xuống dòng cuối file.
3. **Điền `gender` còn thiếu** cho người vào top 12:
   - Ghép mỗi dòng `qualifying.json` với dòng CSV cùng mùa, cùng trường, cùng họ tên (không phân biệt hoa thường, coi "thuỷ" = "thủy").
   - Không ghi đè `gender` đã có.
   - Dòng nào không ghép được, ghép được nhiều người, hoặc lệch giới tính giữa các mùa: liệt kê ra, không tự đoán.

**Không in** tên người đăng kí ra màn hình, trừ các dòng top 12 bị lỗi ghép.

**Kiểm tra:** xuất CSV tab danh sách 10 mùa hiện tại (492 dòng), chạy script. Kết quả phải **giống hệt** `dang-ky.json`, và không đổi giới tính nào đã gộp ở mục 1 (`git diff` không đổi gì). Ghi cách dùng vào `README.md`.

---

## Kit kiểm tra sau mỗi đợt

**Đợt 1**
- Hồ sơ Nguyễn Thùy Dương có dòng "Giới tính: Nữ" dưới Năm sinh; Chu Đức Huy "Nam"; Hà Việt Hoàng "Nam". Tên, ảnh không đổi màu.
- Lớp mới: mùa 2 Bán kết 2 Nguyễn Thị Ngọc Ánh 12A; mùa 3 Bán kết 1 Nguyễn Anh Quân 11A; mùa 10 Bán kết 1 Nguyễn Khắc Triệu 10A6 (kể cả bảng Vòng loại và hồ sơ).
- Trang chủ hiện "492 lượt đăng kí dự thi".
- Mùa 7 và mùa 8 có câu THCS ngay sau câu "Đối tượng tham gia…"; mùa 6 và 9 không có.
- Mùa 7 có thêm dòng trong "Sự kiện đáng nhớ"; bấm "Sự thật khác" ở trang chủ sẽ gặp câu này.
- `npm run kiem-tra-du-lieu` qua. Thử sửa tạm `total` mùa 1 thành 23 thì build phải dừng (xong nhớ trả lại).

**Đợt 2**
- Mùa 7 → Vòng loại: số liệu đúng như mục 6; bật "So với top 12" thấy thanh thứ hai.
- Trang THPT Sóc Sơn và THPT Minh Phú: số đúng như mục 7.
- Các mùa giải: mùa 5 dài nhất (69); phễu 492 → 120 → 40 → 10.
- "Sự thật khác" có 4 câu mới.
- Mở trên điện thoại: thanh không tràn, đoạn nhỏ không bị cắt chữ (số nằm ở chú thích).
- Chạy `npm run tong-hop-dang-ky` với file CSV 10 mùa: `git diff` trống.
