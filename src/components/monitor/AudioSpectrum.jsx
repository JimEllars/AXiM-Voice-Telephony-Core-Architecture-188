import React, { useEffect, useState, useRef } from 'react';

export const AudioSpectrum = ({ isActive }) => {
  const [bars, setBars] = useState(new Array(20).fill(2));
  const requestRef = useRef();
  const lastUpdateRef = useRef(0);

  const animate = (time) => {
    if (time - lastUpdateRef.current > 100) {
      setBars(prev => prev.map(() => Math.floor(Math.random() * 20) + 2));
      lastUpdateRef.current = time;
    }
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (isActive) {
      requestRef.current = requestAnimationFrame(animate);
    } else {
      setBars(new Array(20).fill(2));
    }
    return () => cancelAnimationFrame(requestRef.current);
  }, [isActive]);

  return (
    <div className="flex items-end gap-1 h-8">
      {bars.map((h, i) => (
        <div 
          key={i} 
          className="w-1 bg-indigo-500/60 rounded-full transition-all duration-100 ease-out" 
          style={{ height: isActive ? `${h * 4}%` : '4px' }}
        />
      ))}
    </div>
  );
};