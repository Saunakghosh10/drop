export interface Message {
  id?: string;
  content: string;
  position: {
    x: number;
    y: number;
  };
  size?: {
    width: number;
    height: number;
  };
  color: string;
  created_at?: string;
  updated_at?: string;
  user_id?: string;
  author?: string;
} 