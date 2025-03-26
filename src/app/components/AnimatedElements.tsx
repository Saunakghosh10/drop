'use client';

import { useEffect, useState } from 'react';

interface FloatingElementProps {
  children?: React.ReactNode;
  delay?: number;
  className?: string;
  x?: number;
  y?: number;
  speed?: number;
}

export function FloatingElement({ 
  children, 
  delay = 0, 
  className = '', 
  x = 0, 
  y = 0, 
  speed = 1 
}: FloatingElementProps) {
  const [position, setPosition] = useState(0);
  
  useEffect(() => {
    const startTime = Date.now();
    let animationFrame: number;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      // Simple sine wave animation for floating effect
      const newPosition = Math.sin(elapsed / 1000) * 5 * speed;
      setPosition(newPosition);
      animationFrame = requestAnimationFrame(animate);
    };
    
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [delay, speed]);
  
  return (
    <div 
      className={className}
      style={{ 
        transform: `translateY(${position}px)`,
        position: 'absolute',
        left: `${x}%`,
        top: `${y}%`
      }}
    >
      {children}
    </div>
  );
}

interface FadeInElementProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export function FadeInElement({ children, delay = 0, className = '' }: FadeInElementProps) {
  const [opacity, setOpacity] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setOpacity(1);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [delay]);
  
  return (
    <div 
      className={className}
      style={{ 
        opacity, 
        transition: 'opacity 1s ease-in-out' 
      }}
    >
      {children}
    </div>
  );
}