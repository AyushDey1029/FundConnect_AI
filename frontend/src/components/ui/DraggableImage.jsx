import React, { useState, useRef, useEffect } from 'react';

const DraggableImage = ({ src, alt, initialPosition = '50% 50%', onPositionChange }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  useEffect(() => {
    if (initialPosition) {
      const parts = initialPosition.split(' ').map(p => parseFloat(p));
      if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        setPosition({ x: parts[0], y: parts[1] });
      }
    }
  }, [initialPosition]);

  const handlePointerDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setStartPos({ x: e.clientX, y: e.clientY });
    if (containerRef.current) {
      containerRef.current.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e) => {
    if (!isDragging || !containerRef.current) return;
    
    const dx = e.clientX - startPos.x;
    const dy = e.clientY - startPos.y;
    
    const rect = containerRef.current.getBoundingClientRect();
    const percentX = (dx / rect.width) * 100;
    const percentY = (dy / rect.height) * 100;

    // Dragging mouse down (positive dy) should move object-position towards 0%
    let newX = position.x - percentX; 
    let newY = position.y - percentY;

    // Clamp between 0 and 100
    newX = Math.max(0, Math.min(100, newX));
    newY = Math.max(0, Math.min(100, newY));

    setPosition({ x: newX, y: newY });
    setStartPos({ x: e.clientX, y: e.clientY });
  };

  const handlePointerUp = (e) => {
    if (!isDragging) return;
    setIsDragging(false);
    if (containerRef.current) {
      containerRef.current.releasePointerCapture(e.pointerId);
    }
    if (onPositionChange) {
      onPositionChange(`${Math.round(position.x)}% ${Math.round(position.y)}%`);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="w-full h-full relative overflow-hidden cursor-move touch-none group"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      title="Drag to reposition image"
    >
      <img 
        src={src} 
        alt={alt} 
        className="w-full h-full object-cover pointer-events-none transition-transform group-hover:scale-[1.02]"
        style={{ objectPosition: `${position.x}% ${position.y}%` }}
      />
      
      {/* Overlay guide during hover or drag */}
      <div className={`absolute inset-0 pointer-events-none flex items-center justify-center transition-opacity ${isDragging ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
         {!isDragging && (
           <div className="bg-black/50 text-white text-xs px-3 py-1.5 rounded-full font-medium flex items-center shadow-lg">
             <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5"><polyline points="5 9 2 12 5 15"></polyline><polyline points="9 5 12 2 15 5"></polyline><polyline points="19 9 22 12 19 15"></polyline><polyline points="9 19 12 22 15 19"></polyline><line x1="2" y1="12" x2="22" y2="12"></line><line x1="12" y1="2" x2="12" y2="22"></line></svg>
             Drag to adjust
           </div>
         )}
         {isDragging && (
           <div className="bg-black/70 text-white text-xs px-2 py-1 rounded-md font-mono border border-white/20">
             {Math.round(position.x)}% {Math.round(position.y)}%
           </div>
         )}
      </div>
    </div>
  );
};

export default DraggableImage;
