import React, { useEffect, useState } from 'react';

export const AudioSpectrum = ({ isActive }) => {
  const [bars, setBars] = useState(new Array(20).fill(2));

  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => {
      setBars(prev => prev.map(() => Math.floor(Math.random() * 20) + 2));
    }, 100);
    return () => clearInterval(interval);
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