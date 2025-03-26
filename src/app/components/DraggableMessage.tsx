'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Message } from '../types';

interface DraggableMessageProps {
  message: Message;
  onPositionChange: (id: string, position: { x: number; y: number }) => void;
  onClick: () => void;
  wallRef: React.RefObject<HTMLDivElement>;
}

export default function DraggableMessage({ 
  message,
  onPositionChange,
  onClick,
  wallRef
}: DraggableMessageProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState(message.position);
  const messageRef = useRef<HTMLDivElement>(null);
  
  // Track the initial mouse position when dragging starts
  const dragStart = useRef<{ x: number; y: number } | null>(null);
  
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    
    // Store the initial mouse position
    dragStart.current = { x: e.clientX, y: e.clientY };
  };
  
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !dragStart.current || !wallRef.current) return;
    
    // Calculate the mouse movement delta
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    
    // Get the wall dimensions
    const wallWidth = wallRef.current.offsetWidth;
    const wallHeight = wallRef.current.offsetHeight;
    
    // Update position as percentage of wall dimensions
    const newX = position.x + (dx / wallWidth) * 100;
    const newY = position.y + (dy / wallHeight) * 100;
    
    // Keep the position within bounds (0-100%)
    const boundedX = Math.max(0, Math.min(100, newX));
    const boundedY = Math.max(0, Math.min(100, newY));
    
    // Update local state
    setPosition({ x: boundedX, y: boundedY });
    
    // Reset the drag start position for the next movement calculation
    dragStart.current = { x: e.clientX, y: e.clientY };
  }, [isDragging, position, wallRef]);
  
  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      dragStart.current = null;
      
      // Notify parent component of the position change
      onPositionChange(message.id, position);
    }
  }, [isDragging, message.id, onPositionChange, position]);
  
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);
  
  // Update local position state if the message prop changes
  useEffect(() => {
    setPosition(message.position);
  }, [message.position]);
  
  return (
    <div 
      ref={messageRef}
      className={`absolute cursor-pointer transform p-4 transition-shadow ${isDragging ? 'shadow-lg' : 'shadow hover:shadow-md'}`}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        color: message.color,
        fontSize: `${message.fontSize}px`,
        fontFamily: message.fontFamily || 'inherit',
        transform: `translate(-50%, -50%) rotate(${message.rotation || 0}deg)`,
        zIndex: isDragging ? 10 : 1,
      }}
      onMouseDown={handleMouseDown}
      onClick={(e) => {
        // Only trigger click handler if not dragging
        if (!isDragging) {
          e.stopPropagation();
          onClick();
        }
      }}
    >
      {message.text}
    </div>
  );
}