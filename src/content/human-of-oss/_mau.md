<!--
FILE MẪU – không hiển thị trên web (file bắt đầu bằng "_" được bỏ qua).

Cách thêm một câu chuyện Human of OSS:
1. Chép file này thành src/content/human-of-oss/<slug>.md, vd nguyen-van-a.md
   (slug: chữ thường không dấu, nối bằng gạch ngang; dùng làm đường dẫn /human-of-oss/<slug>).
2. Thêm 1 dòng vào src/data/humans.json (giữ dấu phẩy giữa các mục):

   {
     "slug": "nguyen-van-a",
     "stt": 2,
     "name": "Anh Nguyễn Văn A",
     "title": "Vai trò với Olympia Sóc Sơn, vd Quán quân mùa 3",
     "quote": "Một câu trích ngắn hiện trên thẻ và ở đầu bài."
   }

   `stt` = số thứ tự tiếp theo chưa dùng (không được trùng; trùng thì build báo lỗi). Trang xếp theo `stt` tăng dần.
3. (Tuỳ chọn) Ảnh chân dung: public/images/human-of-oss/{stt 2 chữ số}.jpg, vd stt 2 → 02.jpg,
   rồi chạy lại `npm run dev`.
4. Viết bài bên dưới (xóa đoạn chú thích này đi). Chỉ đăng khi người được viết đã đồng ý.
-->

## Tiêu đề đoạn

Đoạn mở đầu câu chuyện. Có thể dùng **chữ đậm**, *chữ nghiêng*.

> Một câu trích dẫn nổi bật.

- Ý thứ nhất
- Ý thứ hai

![Mô tả ảnh](images/human-of-oss/ten-anh.jpg)
