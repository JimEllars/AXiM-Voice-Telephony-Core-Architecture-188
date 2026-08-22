import React, { useEffect, useState, useRef } from 'react';

export const AudioSpectrum = ({ isActive, isLive }) => {
  const [bars, setBars] = useState(new Array(20).fill(2));
  const requestRef = useRef();
  const lastUpdateRef = useRef(0);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const sourceRef = useRef(null);
  const streamRef = useRef(null);

  const initAudio = async () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 64;
        const bufferLength = analyserRef.current.frequencyBinCount;
        dataArrayRef.current = new Uint8Array(bufferLength);
      }

      if (!streamRef.current || streamRef.current.getTracks().every(t => t.readyState === 'ended')) {
        // Get microphone access
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        streamRef.current = stream;

        if (sourceRef.current) {
          sourceRef.current.disconnect();
        }
        sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
        sourceRef.current.connect(analyserRef.current);
      }

      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }
    } catch (err) {
      console.warn("Audio initialization failed:", err);
    }
  };

  const animateSynthetic = (time) => {
    if (time - lastUpdateRef.current > 100) {
      setBars(prev => prev.map(() => Math.floor(Math.random() * 20) + 2));
      lastUpdateRef.current = time;
    }
    requestRef.current = requestAnimationFrame(animateSynthetic);
  };

  const animateLive = () => {
    if (analyserRef.current && dataArrayRef.current) {
      analyserRef.current.getByteFrequencyData(dataArrayRef.current);

      // Map 32 bins to 20 bars
      const newBars = [];
      const step = Math.floor(dataArrayRef.current.length / 20);
      for (let i = 0; i < 20; i++) {
        let sum = 0;
        for (let j = 0; j < step; j++) {
            sum += dataArrayRef.current[i * step + j];
        }
        let avg = sum / step;
        // Normalize 0-255 to 2-25
        let val = Math.max(2, Math.floor((avg / 255) * 25));
        newBars.push(val);
      }
      setBars(newBars);
    }
    requestRef.current = requestAnimationFrame(animateLive);
  };

  useEffect(() => {
    if (isActive) {
      if (isLive) {
        if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
          audioContextRef.current.resume();
        }
        initAudio().then(() => {
          if (requestRef.current) cancelAnimationFrame(requestRef.current);
          requestRef.current = requestAnimationFrame(animateLive);
        });
      } else {
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
        requestRef.current = requestAnimationFrame(animateSynthetic);
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
      }
    } else {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      setBars(new Array(20).fill(2));
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(console.error);
        audioContextRef.current = null;
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(console.error);
        audioContextRef.current = null;
      }
    };
  }, [isActive, isLive]);

  // Clean up audio context on unmount
  useEffect(() => {
    return () => {
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
            audioContextRef.current.close().catch(console.error);
            audioContextRef.current = null;
        }
    };
  }, []);

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
