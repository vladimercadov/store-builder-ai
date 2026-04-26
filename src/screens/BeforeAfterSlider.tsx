import React, { useState, useRef, useEffect } from 'react';
import { clsx } from 'clsx';
import { MoveHorizontal } from 'lucide-react';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({ beforeImage, afterImage }) => {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percentage = (x / rect.width) * 100;
    setPosition(percentage);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  useEffect(() => {
    const handleWindowMouseMove = (e: MouseEvent) => {
      if (isDragging.current) handleMove(e.clientX);
    };
    const handleWindowMouseUp = () => {
      isDragging.current = false;
    };
    
    window.addEventListener('mousemove', handleWindowMouseMove);
    window.addEventListener('mouseup', handleWindowMouseUp);
    
    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove);
      window.removeEventListener('mouseup', handleWindowMouseUp);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full cursor-col-resize select-none border border-outline-variant rounded-xl overflow-hidden shadow-xl"
      onMouseDown={handleMouseDown}
      onTouchMove={handleTouchMove}
    >
      {/* Before Image (underneath) */}
      <img 
        src={beforeImage} 
        alt="Antes" 
        className="absolute inset-0 w-full h-full object-cover"
         draggable="false"
      />
      
      {/* After Image (clipped on top) */}
      <div 
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${position}%` }}
      >
        <img 
          src={afterImage} 
          alt="Después" 
          className="absolute inset-0 w-full h-full object-cover max-w-none"
          style={{ width: '100vw', minWidth: '100%' }} // Keep image size constant while clipping container
          draggable="false"
        />
        <img 
          src={afterImage} 
          alt="Después" 
          className="absolute inset-x-0 inset-y-0 h-full w-auto max-w-none object-cover" 
          style={{ width: containerRef.current?.offsetWidth || '100%' }}
          draggable="false"
        />
      </div>

       <div 
        className="absolute inset-0"
        style={{ 
          clipPath: `inset(0 ${100 - position}% 0 0)`
        }}
      >
        <img 
          src={afterImage} 
          alt="Después" 
          className="absolute inset-0 w-full h-full object-cover" 
          draggable="false"
        />
      </div>

      {/* Slider Line & Handle */}
      <div 
        className="absolute top-0 bottom-0 w-1 bg-white cursor-col-resize flex items-center justify-center shadow-[0_0_10px_rgba(0,0,0,0.5)]"
        style={{ left: `calc(${position}% - 2px)` }}
      >
        <div className="w-8 h-8 bg-white text-surface rounded-full flex items-center justify-center shadow-lg -ml-[14px]">
           <MoveHorizontal size={18} />
        </div>
      </div>
      
      {/* Labels */}
      <div className="absolute top-4 left-4 bg-surface/80 backdrop-blur px-3 py-1 text-[10px] font-mono font-bold tracking-widest uppercase rounded border border-outline-variant">
        Después (AR)
      </div>
      <div className="absolute top-4 right-4 bg-surface/80 backdrop-blur px-3 py-1 text-[10px] font-mono font-bold tracking-widest uppercase rounded border border-outline-variant">
        Antes
      </div>
    </div>
  );
};
