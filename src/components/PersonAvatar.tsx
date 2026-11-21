import PersonPhoto from "./PersonPhoto";
import { useCompetition } from "../lib/competitionContext";
import type { PhotoOptions } from "../lib/data";

/**
 * Ảnh tròn nhỏ cạnh tên (bảng trận): 28px trên điện thoại, 36px từ md. Ảnh thật nếu có, chưa có thì chữ cái đầu
 * (tông màu như ảnh giữ chỗ). Ảnh trang trí (alt rỗng) vì tên đã nằm ngay cạnh.
 */
export default function PersonAvatar({ id, photo, ring = false }: { id: string; photo?: PhotoOptions; ring?: boolean }) {
  const comp = useCompetition();
  return (
    <PersonPhoto
      decorative
      src={comp.avatar(id, photo?.season)}
      seed={id}
      name={comp.personName(id)}
      className={`size-7 shrink-0 rounded-full md:size-9 ${ring ? "ring-2 ring-white" : ""}`}
    />
  );
}
