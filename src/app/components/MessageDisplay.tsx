'use client';

interface Message {
  text: string;
  position: {
    x: number;
    y: number;
  };
  color: string;
  rotation: number;
  fontSize: number;
  fontFamily?: string;
}

type MessageDisplayProps = {
  message: Message;
  onClick?: () => void;
};

export default function MessageDisplay({ message, onClick }: MessageDisplayProps) {
  return (
    <div
      className="absolute whitespace-pre-wrap max-w-xs cursor-pointer"
      style={{
        left: `${message.position.x}%`,
        top: `${message.position.y}%`,
        color: message.color,
        transform: `translate(-50%, -50%) rotate(${message.rotation}deg)`,
        fontSize: `${message.fontSize}px`,
        fontFamily: message.fontFamily || 'inherit',
      }}
      onClick={onClick}
    >
      {message.text}
    </div>
  );
}