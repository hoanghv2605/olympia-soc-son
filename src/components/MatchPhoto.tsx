import AwardPhoto from "./AwardPhoto";
import { matchPhoto } from "../lib/data";
import type { Match } from "../types";

/**
 * Ảnh một trận (images/tran-dau/<id trận>.jpg, 3:2), căn giữa, tối đa 720px, bấm để phóng to.
 * Chưa có ảnh thật thì không hiện gì (không còn dải giữ chỗ); nơi gọi nên kiểm tra `matchPhoto(id)` trước
 * để không để lại khoảng cách thừa.
 */
export default function MatchPhoto({ match, caption }: { match: Match; caption: string }) {
  return <AwardPhoto src={matchPhoto(match.id)} caption={caption} />;
}
