// Tông màu ảnh giữ chỗ (khi chưa có ảnh thật): 5 tông trong bảng màu OSS,
// chọn cố định theo mã (tổng mã ký tự chia lấy dư 5) để mỗi người một màu nhưng không đổi giữa các lần tải.

export interface PlaceholderTone {
  name: string;
  bg: string;
  ink: string; // màu chữ và họa tiết
}

export const PLACEHOLDER_TONES: PlaceholderTone[] = [
  { name: "tím", bg: "#EDE7FB", ink: "#5B21B6" },
  { name: "chàm", bg: "#E4E6FA", ink: "#3730A3" },
  { name: "xanh", bg: "#DCEAFB", ink: "#1E4FB8" },
  { name: "hồng", bg: "#FBE3EE", ink: "#A3245E" },
  { name: "tím hồng", bg: "#F6E3FA", ink: "#86198F" },
];

export function placeholderTone(seed: string): PlaceholderTone {
  let sum = 0;
  for (let i = 0; i < seed.length; i++) sum += seed.charCodeAt(i);
  return PLACEHOLDER_TONES[sum % PLACEHOLDER_TONES.length];
}
