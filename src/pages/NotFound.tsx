import { Link } from "react-router";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-24 text-center">
      <p className="text-7xl font-extrabold text-oss/20">404</p>
      <h1 className="mt-4 text-2xl font-bold text-ink">Không tìm thấy trang này</h1>
      <p className="mt-2 text-ink-soft">Đường dẫn có thể đã thay đổi hoặc nội dung chưa được đăng.</p>
      <Link to="/" className="btn-primary mt-8">
        Về trang chủ
      </Link>
    </section>
  );
}
