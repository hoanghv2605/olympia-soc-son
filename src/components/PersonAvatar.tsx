import PersonPhoto from "./PersonPhoto";
import { personName, personPhoto, type PhotoOptions } from "../lib/data";

/**
 * Ảnh tròn nhỏ cạnh tên (bảng trận): 28px trên điện thoại, 36px từ md. Ảnh thật nếu có, chưa có thì chữ cái đầu
 * (tông màu như ảnh giữ chỗ). Ảnh trang trí (alt rỗng) vì tên đã nằm ngay cạnh.
 */
export default function PersonAvatar({ id, photo, ring = false }: { id: string; photo?: PhotoOptions; ring?: boolean }) {
  return (
    <PersonPhoto
      decorative
      src={personPhoto(id, photo)}
      seed={id}
      name={personName(id)}
      className={`size-7 shrink-0 rounded-full md:size-9 ${ring ? "ring-2 ring-white" : ""}`}
    />
  );
}
