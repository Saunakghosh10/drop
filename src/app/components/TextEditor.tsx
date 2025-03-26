'use client';

import { useState } from 'react';

type TextEditorProps = {
  onSave: (text: string, options: TextOptions) => void;
  onCancel: () => void;
  initialText?: string;
  initialOptions?: Partial<TextOptions>;
};

export type TextOptions = {
  color: string;
  rotation: number;
  fontSize: number;
  fontFamily: string;
};

export default function TextEditor({ 
  onSave, 
  onCancel, 
  initialText = '', 
  initialOptions = {}
}: TextEditorProps) {
  const [text, setText] = useState(initialText);
  const [options, setOptions] = useState<TextOptions>({
    color: initialOptions.color || '#000000',
    rotation: initialOptions.rotation || 0,
    fontSize: initialOptions.fontSize || 14,
    fontFamily: initialOptions.fontFamily || 'inherit',
  });

  const handleSave = () => {
    if (text.trim()) {
      onSave(text, options);
    }
  };

  const handleRotate = () => {
    // Rotate by 15 degrees each time, cycling through -45 to 45 degrees
    const newRotation = (options.rotation + 15) % 60;
    setOptions({ ...options, rotation: newRotation > 45 ? -45 : newRotation });
  };

  const handleFontChange = () => {
    // Cycle through a few font options
    const fonts = ['inherit', 'var(--font-caveat)', 'monospace', 'serif'];
    const currentIndex = fonts.indexOf(options.fontFamily);
    const nextIndex = (currentIndex + 1) % fonts.length;
    setOptions({ ...options, fontFamily: fonts[nextIndex] });
  };

  const handleColorChange = () => {
    // Cycle through some colors
    const colors = ['#000000', '#ff0000', '#0000ff', '#2e8b57', '#8b4513', '#800080'];
    const currentIndex = colors.indexOf(options.color);
    const nextIndex = (currentIndex + 1) % colors.length;
    setOptions({ ...options, color: colors[nextIndex] });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 w-96 max-w-full">
      {/* Text input area */}
      <div className="mb-6">
        {text.trim() === '' && (
          <div className="absolute text-sm font-caveat text-gray-500" style={{ color: options.color }}>
            
          </div>
        )}
        <textarea
          autoFocus
          className="w-full bg-transparent border border-gray-200 rounded-lg p-4 outline-none resize-none"
          placeholder="Write your message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{
            color: options.color,
            fontSize: `${options.fontSize}px`,
            fontFamily: options.fontFamily,
            minHeight: '120px',
          }}
        />
      </div>
      
      {/* Control buttons */}
      <div className="flex justify-center space-x-6 mb-6">
        <button 
          onClick={handleRotate}
          className="p-2 hover:bg-gray-100 rounded-full"
          title="Rotate text"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M20 4V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        
        <button 
          onClick={handleFontChange}
          className="p-2 hover:bg-gray-100 rounded-full"
          title="Change font"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 7H20M6 12H18M8 17H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        
        <button 
          onClick={handleColorChange}
          className="p-2 hover:bg-gray-100 rounded-full"
          title="Change color"
          style={{ color: options.color }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2"/>
            <circle cx="12" cy="12" r="4" fill="currentColor"/>
          </svg>
        </button>
      </div>
      
      {/* Action buttons */}
      <div className="flex justify-end gap-2">
        <button 
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-sm transition-colors"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button 
          className="px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-md text-sm transition-colors"
          onClick={handleSave}
        >
          Post
        </button>
      </div>
    </div>
  );
}