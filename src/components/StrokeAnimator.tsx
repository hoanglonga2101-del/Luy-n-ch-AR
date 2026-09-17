import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, ChevronLeft, ChevronRight } from 'lucide-react';
import { StrokePath, GridType } from '../types';
import { playStrokeSound } from '../utils/audio';

interface StrokeAnimatorProps {
  strokes: StrokePath[];
  gridType?: GridType;
  showNumbers?: boolean;
  color?: string;
  className?: string;
  size?: number;
  autoPlay?: boolean;
}

export const StrokeAnimator: React.FC<StrokeAnimatorProps> = ({
  strokes = [],
  gridType = 'oly_vi',
  showNumbers = true,
  color = '#2563eb', // vivid primary ink
  className = '',
  size = 280,
  autoPlay = false,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(strokes.length);
  const [isPlaying, setIsPlaying] = useState<boolean>(autoPlay);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    setCurrentStep(strokes.length);
  }, [strokes]);

  useEffect(() => {
    if (isPlaying) {
      if (currentStep >= strokes.length) {
        setCurrentStep(1);
        if (soundEnabled) playStrokeSound(1);
      }

      timerRef.current = window.setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= strokes.length) {
            setIsPlaying(false);
            return strokes.length;
          }
          const next = prev + 1;
          if (soundEnabled) playStrokeSound(next * 0.2 + 0.8);
          return next;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, strokes.length, currentStep, soundEnabled]);

  const handlePrev = () => {
    setIsPlaying(false);
    setCurrentStep((prev) => Math.max(1, prev - 1));
    if (soundEnabled) playStrokeSound(0.9);
  };

  const handleNext = () => {
    setIsPlaying(false);
    setCurrentStep((prev) => Math.min(strokes.length, prev + 1));
    if (soundEnabled) playStrokeSound(1.2);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(1);
    if (soundEnabled) playStrokeSound(1);
  };

  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      {/* SVG Canvas with Grid Background */}
      <div 
        className="relative bg-white/95 rounded-2xl shadow-inner border border-neutral-300 overflow-hidden flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full pointer-events-none"
        >
          {/* Grid Background Layers */}
          {gridType === 'oly_vi' && (
            <g opacity="0.3" stroke="#0284c7" strokeWidth="0.5">
              {/* Vietnam Primary 4-grid line with base line */}
              <line x1="0" y1="20" x2="100" y2="20" strokeDasharray="1,1" />
              <line x1="0" y1="40" x2="100" y2="40" strokeDasharray="1,1" />
              <line x1="0" y1="60" x2="100" y2="60" strokeDasharray="1,1" />
              <line x1="0" y1="80" x2="100" y2="80" strokeWidth="1.2" stroke="#0369a1" />
              {/* Vertical grids */}
              <line x1="20" y1="0" x2="20" y2="100" strokeDasharray="1,2" />
              <line x1="40" y1="0" x2="40" y2="100" strokeDasharray="1,2" />
              <line x1="60" y1="0" x2="60" y2="100" strokeDasharray="1,2" />
              <line x1="80" y1="0" x2="80" y2="100" strokeDasharray="1,2" />
            </g>
          )}

          {gridType === 'four_line_en' && (
            <g opacity="0.4">
              {/* English headline, midline, baseline, descender line */}
              <line x1="0" y1="20" x2="100" y2="20" stroke="#ef4444" strokeWidth="0.8" />
              <line x1="0" y1="40" x2="100" y2="40" stroke="#3b82f6" strokeWidth="0.8" strokeDasharray="2,2" />
              <line x1="0" y1="60" x2="100" y2="60" stroke="#3b82f6" strokeWidth="1.2" />
              <line x1="0" y1="80" x2="100" y2="80" stroke="#ef4444" strokeWidth="0.8" />
            </g>
          )}

          {(gridType === 'mizi_zh' || gridType === 'tian_zh') && (
            <g opacity="0.35" stroke="#dc2626" strokeWidth="0.6">
              {/* Border box */}
              <rect x="5" y="5" width="90" height="90" fill="none" strokeWidth="1" />
              {/* Crosshair (Tian Zi Ge) */}
              <line x1="5" y1="50" x2="95" y2="50" strokeDasharray="2,2" />
              <line x1="50" y1="5" x2="50" y2="95" strokeDasharray="2,2" />
              {/* Diagonal lines (Mi Zi Ge) */}
              {gridType === 'mizi_zh' && (
                <>
                  <line x1="5" y1="5" x2="95" y2="95" strokeDasharray="2,2" strokeWidth="0.5" />
                  <line x1="95" y1="5" x2="5" y2="95" strokeDasharray="2,2" strokeWidth="0.5" />
                </>
              )}
            </g>
          )}

          {/* Render All Strokes Ghost Underlay */}
          {strokes.map((stroke) => (
            <path
              key={`ghost-${stroke.id}`}
              d={stroke.d}
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}

          {/* Render Active / Completed Strokes */}
          {strokes.map((stroke, index) => {
            const isCompleted = index + 1 <= currentStep;
            const isCurrent = index + 1 === currentStep;

            if (!isCompleted) return null;

            return (
              <g key={`stroke-${stroke.id}`}>
                <path
                  d={stroke.d}
                  fill="none"
                  stroke={isCurrent ? '#ef4444' : color}
                  strokeWidth={isCurrent ? '6' : '5'}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-all duration-300"
                />

                {/* Stroke number badge and arrow indicator on active/completed */}
                {showNumbers && (
                  <g>
                    <circle
                      cx={stroke.startPoint.x}
                      cy={stroke.startPoint.y}
                      r="4.2"
                      fill={isCurrent ? '#ef4444' : '#1e293b'}
                      stroke="#ffffff"
                      strokeWidth="1.2"
                    />
                    <text
                      x={stroke.startPoint.x}
                      y={stroke.startPoint.y + 1.6}
                      fill="#ffffff"
                      fontSize="4.2"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {stroke.id}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        {/* Current stroke badge indicator */}
        <div className="absolute top-2 right-2 px-2.5 py-1 bg-neutral-900/80 backdrop-blur-md rounded-full text-[11px] font-mono text-white flex items-center gap-1.5 shadow">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          Nét {currentStep}/{strokes.length}
        </div>
      </div>

      {/* Controller Buttons */}
      <div className="w-full mt-4 flex items-center justify-between gap-2 px-2">
        <div className="flex items-center gap-1">
          <button
            id="stroke-anim-prev"
            onClick={handlePrev}
            disabled={currentStep <= 1}
            className="p-2 rounded-lg bg-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-700 disabled:opacity-40 disabled:hover:bg-neutral-800 transition"
            title="Nét trước"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            id="stroke-anim-play"
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs flex items-center gap-1.5 transition shadow"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" /> Dừng
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" /> Tự động vẽ
              </>
            )}
          </button>

          <button
            id="stroke-anim-next"
            onClick={handleNext}
            disabled={currentStep >= strokes.length}
            className="p-2 rounded-lg bg-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-700 disabled:opacity-40 disabled:hover:bg-neutral-800 transition"
            title="Nét tiếp theo"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button
            id="stroke-anim-reset"
            onClick={handleReset}
            className="p-2 rounded-lg bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700 transition"
            title="Vẽ lại từ đầu"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            id="stroke-anim-sound"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-lg bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700 transition"
            title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Active Stroke Label Description */}
      {strokes[currentStep - 1] && (
        <div className="mt-2 text-xs text-neutral-300 text-center font-medium bg-neutral-800/80 border border-neutral-700/60 px-3 py-1.5 rounded-lg max-w-xs">
          {strokes[currentStep - 1].label}
        </div>
      )}
    </div>
  );
};
