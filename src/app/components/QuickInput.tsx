'use client';

import { useState } from 'react';

type QuickInputProps = {
  onSubmit: (text: string) => void;
};

export default function QuickInput({ onSubmit }: QuickInputProps) {
  const [text, setText] = useState('');

  const handleSubmit = () => {
    if (text.trim()) {
      onSubmit(text);
      setText('');
    }
  };

  return (
    <div className="bg-white rounded-full shadow-lg flex items-center p-1 w-80">
      <input
        type="text"
        placeholder="Write anything"
        className="flex-1 px-4 py-2 bg-transparent outline-none text-sm rounded-full"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSubmit();
          }
        }}
      />
      <button 
        className="bg-black text-white rounded-full px-4 py-2 text-sm"
        onClick={handleSubmit}
      >
        Create
      </button>
    </div>
  );
}