export type Message = {
  id: string;
  text: string;
  position: { x: number; y: number };
  color: string;
  rotation: number;
  fontSize: number;
  fontFamily?: string;
};