import { useEffect, useRef, type ReactNode } from "react";
import { PiXBold } from "react-icons/pi";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  labelledBy: string;
  children: ReactNode;
}

/**
 * Hộp nổi dùng <dialog> gốc của trình duyệt (showModal): phần còn lại của trang bị khóa,
 * focus nằm trong hộp; Esc, nút × hoặc bấm ra ngoài để đóng. Điện thoại: toàn màn hình.
 */
export default function Modal({ open, onClose, labelledBy, children }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-modal="true"
      aria-labelledby={labelledBy}
      className="modal"
      onClose={onClose}
      onClick={(e) => {
        // Bấm vào nền mờ (ngoài khung nội dung) thì đóng
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-panel">
        <button
          type="button"
          onClick={onClose}
          aria-label="Đóng"
          className="absolute top-3 right-3 grid size-10 place-items-center rounded-full text-ink-soft hover:bg-oss-soft hover:text-oss"
        >
          <PiXBold className="size-5" aria-hidden />
        </button>
        {open && children}
      </div>
    </dialog>
  );
}
