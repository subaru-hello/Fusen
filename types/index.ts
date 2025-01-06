export type TMask = { x1: number; y1: number; x2: number; y2: number };
export type TImage = {
  id: number;
  uri: string;
  masks: TMask[];
};
export type RectMask = {
  x1: number; // 相対座標（0~1）
  y1: number;
  x2: number;
  y2: number;
};
