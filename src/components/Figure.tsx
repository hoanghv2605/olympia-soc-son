import { Fragment } from "react";

/**
 * Dòng số liệu "A · B · C": mỗi phần không bao giờ bị ngắt giữa chừng (white-space: nowrap);
 * chỉ được xuống dòng giữa các phần (dấu "·" đi cùng phần đứng trước, không rơi xuống đầu dòng sau).
 */
export default function Figure({ text, className = "" }: { text: string; className?: string }) {
  const parts = text.split(" · ");
  return (
    <p className={className}>
      {parts.map((part, i) => (
        <Fragment key={i}>
          {i > 0 && " "}
          <span className="whitespace-nowrap">{i < parts.length - 1 ? `${part} ·` : part}</span>
        </Fragment>
      ))}
    </p>
  );
}
