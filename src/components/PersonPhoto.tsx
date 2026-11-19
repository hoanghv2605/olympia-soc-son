import Photo from "./Photo";
import Placeholder from "./Placeholder";

interface Props {
  src?: string; // vd images/thi-sinh/s10-ten-ss.jpg; không có thì chỉ hiện ảnh giữ chỗ
  /** Mã cố định (id thí sinh / slug Human of OSS) để chọn tông màu ảnh giữ chỗ */
  seed: string;
  name: string;
  className?: string;
}

/** Ảnh người (thí sinh, Human of OSS); luôn hiện ảnh giữ chỗ trước, ảnh thật tải xong thì mờ dần đè lên. */
export default function PersonPhoto({ src, seed, name, className = "" }: Props) {
  return (
    <Photo key={src} src={src} alt={`Ảnh ${name}`} className={className} fallback={<Placeholder seed={seed} name={name} />} />
  );
}
