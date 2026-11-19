import { useRef, useState, type MouseEvent } from "react";
import { Link } from "react-router";
import PersonPhoto from "./PersonPhoto";
import { PLACEMENT_LABEL, consecutiveFinalists, personPath, personPhoto } from "../lib/data";

/**
 * Dải ảnh hình bình hành nghiêng phải, đặt sát nhau trên 1 hàng.
 * Máy tính: rê chuột / focus → dải giãn ra, hiện tên + 2 mùa.
 * Điện thoại: hàng vuốt ngang; chạm lần đầu để giãn dải, chạm lần nữa để mở hồ sơ.
 */
export default function FinalistStrips() {
  const list = consecutiveFinalists();
  const [active, setActive] = useState<number | null>(null);
  // true khi thao tác hiện tại là chạm (không phải chuột / bàn phím)
  const touching = useRef(false);

  function onClick(e: MouseEvent, i: number) {
    if (!touching.current) return;
    touching.current = false;
    if (active !== i) {
      e.preventDefault();
      setActive(i);
    }
  }

  return (
    <ul
      className={`strips${active !== null ? " has-active" : ""}`}
      onPointerLeave={(e) => e.pointerType === "mouse" && setActive(null)}
    >
      {list.map(({ person, entries }, i) => {
        const seasonsText = entries
          .map((e) => `Mùa ${e.season}: ${e.placement ? PLACEMENT_LABEL[e.placement] : "Chung kết"}`)
          .join(" · ");
        return (
          <li key={person.id} className={`strip${active === i ? " is-active" : ""}`}>
            <Link
              to={personPath(person.id)}
              aria-label={`${person.name}. ${seasonsText}`}
              className="strip-inner block"
              onPointerDown={(e) => (touching.current = e.pointerType !== "mouse")}
              onPointerEnter={(e) => e.pointerType === "mouse" && setActive(i)}
              onFocus={() => !touching.current && setActive(i)}
              onBlur={() => setActive((a) => (a === i ? null : a))}
              onClick={(e) => onClick(e, i)}
            >
              <PersonPhoto src={personPhoto(person.id)} seed={person.id} name={person.name} className="size-full" />
              <span className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/80 to-transparent" aria-hidden />
              <span className="strip-caption" aria-hidden>
                <span className="block text-lg leading-tight font-bold">{person.name}</span>
                <span className="mt-1 block text-sm text-white/85">{seasonsText}</span>
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
