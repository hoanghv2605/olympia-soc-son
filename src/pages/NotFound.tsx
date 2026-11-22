import { Link } from "react-router";
import PageHeader from "../components/PageHeader";
import { usePageTitle } from "../lib/hooks";

export default function NotFound() {
  usePageTitle("Không tìm thấy trang · Olympia Sóc Sơn");
  return (
    <>
      <PageHeader
        title="Không tìm thấy trang này"
        description="Lỗi 404: đường dẫn có thể đã thay đổi hoặc nội dung chưa được đăng."
      />
      <section className="mx-auto max-w-6xl px-5 pb-12 md:pb-16">
        <Link to="/" className="btn-primary">
          Về trang chủ
        </Link>
      </section>
    </>
  );
}
