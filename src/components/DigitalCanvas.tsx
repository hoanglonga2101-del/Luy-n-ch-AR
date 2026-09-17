import React, { useRef, useState, useEffect } from 'react';
import { Eraser, RotateCcw, Check, Sparkles, Volume2, ArrowLeft } from 'lucide-react';
import { GridType } from '../types';
import { playStrokeSound, speakText, playASMRPenScratch } from '../utils/audio';
import { awardExp } from '../utils/gamification';

interface DigitalCanvasProps {
  charOrText: string;
  language: 'vi' | 'en' | 'ja' | 'zh';
  reading?: string;
  translation?: string;
  tips?: string;
  gridType?: GridType;
  onBack: () => void;
  onLaunchAR: () => void;
}

export const DigitalCanvas: React.FC<DigitalCanvasProps> = ({
  charOrText,
  language,
  reading,
  translation,
  tips,
  gridType = 'oly_vi',
  onBack,
  onLaunchAR,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [inkColor, setInkColor] = useState<string>('#1e40af'); // blue ink by default
  const [brushWidth, setBrushWidth] = useState<number>(6);
  const [hasDrawn, setHasDrawn] = useState<boolean>(false);
  const [strokeHistory, setStrokeHistory] = useState<ImageData[]>([]);
  const [showUnderlay, setShowUnderlay] = useState<boolean>(true);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set high DPI resolution
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const strokeCounterRef = useRef<number>(0);
  const letterStrokesRef = useRef<number>(0);

  const startDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Save snapshot for undo
    const dpr = window.devicePixelRatio || 1;
    const snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setStrokeHistory((prev) => [...prev.slice(-10), snapshot]);

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasDrawn(true);
    letterStrokesRef.current += 1;
    playStrokeSound(1);
    playASMRPenScratch();
  };

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.strokeStyle = inkColor;
    ctx.lineWidth = brushWidth;
    ctx.lineTo(x, y);
    ctx.stroke();

    strokeCounterRef.current += 1;
    if (strokeCounterRef.current % 12 === 0) {
      playASMRPenScratch();
    }
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    // Anti-spam: Only award 2 EXP after completing a letter with at least 4 strokes, capped at 20 EXP/day
    if (letterStrokesRef.current >= 4) {
      awardExp(2, 'Hoàn thành chữ cái trên bảng số', { isCanvas: true });
      letterStrokesRef.current = 0;
    }
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
    setStrokeHistory([]);
  };

  const handleUndo = () => {
    if (strokeHistory.length === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const last = strokeHistory[strokeHistory.length - 1];
    ctx.putImageData(last, 0, 0);
    setStrokeHistory((prev) => prev.slice(0, -1));
  };

  const getFontClass = () => {
    if (language === 'vi') return 'font-["Itim",cursive]';
    if (language === 'en') return 'font-["Patrick_Hand",cursive]';
    if (language === 'ja') return 'font-["Klee_One",sans-serif]';
    if (language === 'zh') return 'font-["Ma_Shan_Zheng",serif]';
    return 'font-sans';
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 flex flex-col items-center">
      {/* Top action row */}
      <div className="w-full flex items-center justify-between mb-4">
        <button
          id="canvas-back-btn"
          onClick={onBack}
          className="px-3.5 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium flex items-center gap-1.5 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Quay lại
        </button>

        <div className="flex items-center gap-2">
          {reading && (
            <span className="text-xs font-mono text-cyan-400 bg-cyan-950/40 px-2.5 py-1 rounded-lg border border-cyan-800/40">
              {reading}
            </span>
          )}
          <button
            id="canvas-speak-btn"
            onClick={() => speakText(charOrText, language)}
            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition"
            title="Nghe phát âm chuẩn"
          >
            <Volume2 className="w-4 h-4 text-emerald-400" />
          </button>
          <button
            id="launch-ar-from-canvas"
            onClick={onLaunchAR}
            className="px-4 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-emerald-950/40 flex items-center gap-1.5 transition"
          >
            <Sparkles className="w-3.5 h-3.5" /> Hắt hình AR lên giấy thật
          </button>
        </div>
      </div>

      {/* Main Drawing Pad */}
      <div className="relative w-full max-w-xl aspect-square bg-[#fdfbf7] rounded-2xl shadow-2xl border-2 border-neutral-300 overflow-hidden touch-none flex items-center justify-center">
        {/* Background Grid Pattern */}
        {gridType === 'oly_vi' && (
          <div className="absolute inset-0 pointer-events-none opacity-40">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="canvas_oly" width="40" height="40" patternUnits="userSpaceOnUse">
                  <rect width="40" height="40" fill="none" stroke="#0284c7" strokeWidth="0.8" strokeOpacity="0.5" />
                  <line x1="0" y1="10" x2="40" y2="10" stroke="#0284c7" strokeWidth="0.4" strokeDasharray="2,2" strokeOpacity="0.4" />
                  <line x1="0" y1="20" x2="40" y2="20" stroke="#0284c7" strokeWidth="0.4" strokeDasharray="2,2" strokeOpacity="0.4" />
                  <line x1="0" y1="30" x2="40" y2="30" stroke="#0284c7" strokeWidth="0.4" strokeDasharray="2,2" strokeOpacity="0.4" />
                  <line x1="0" y1="40" x2="40" y2="40" stroke="#0369a1" strokeWidth="1.5" strokeOpacity="0.7" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#canvas_oly)" />
            </svg>
          </div>
        )}

        {(gridType === 'mizi_zh' || gridType === 'tian_zh') && (
          <div className="absolute inset-0 pointer-events-none opacity-40">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#dc2626" strokeDasharray="4,4" strokeWidth="1" />
              <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#dc2626" strokeDasharray="4,4" strokeWidth="1" />
              {gridType === 'mizi_zh' && (
                <>
                  <line x1="0" y1="0" x2="100%" y2="100%" stroke="#dc2626" strokeDasharray="4,4" strokeWidth="0.6" />
                  <line x1="100%" y1="0" x2="0" y2="100%" stroke="#dc2626" strokeDasharray="4,4" strokeWidth="0.6" />
                </>
              )}
            </svg>
          </div>
        )}

        {/* Ghost Tracing Underlay */}
        {showUnderlay && (
          <div 
            className={`absolute inset-0 flex items-center justify-center pointer-events-none select-none text-neutral-300/60 font-medium ${getFontClass()}`}
            style={{
              fontSize: charOrText.length > 5 ? 'clamp(2rem, 8vw, 4rem)' : 'clamp(5rem, 20vw, 12rem)',
              fontStyle: language === 'en' || language === 'vi' ? 'italic' : 'normal',
            }}
          >
            {charOrText}
          </div>
        )}

        {/* Drawing HTML Canvas */}
        <canvas
          ref={canvasRef}
          onPointerDown={startDrawing}
          onPointerMove={draw}
          onPointerUp={stopDrawing}
          onPointerLeave={stopDrawing}
          className="absolute inset-0 w-full h-full cursor-crosshair z-10"
        />
      </div>

      {/* Toolbar controls */}
      <div className="w-full max-w-xl mt-4 bg-neutral-900 border border-neutral-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-xl text-neutral-200 text-xs">
        {/* Color Palette */}
        <div className="flex items-center gap-1.5">
          <span className="text-neutral-400 mr-1">Màu mực:</span>
          {[
            { id: '#1e40af', name: 'Xanh mực', bg: 'bg-blue-700' },
            { id: '#171717', name: 'Đen bút', bg: 'bg-neutral-900 border border-neutral-600' },
            { id: '#b91c1c', name: 'Đỏ chấm', bg: 'bg-red-700' },
            { id: '#047857', name: 'Xanh lá', bg: 'bg-emerald-700' },
          ].map((c) => (
            <button
              key={c.id}
              onClick={() => setInkColor(c.id)}
              className={`w-6 h-6 rounded-full ${c.bg} transition transform ${
                inkColor === c.id ? 'ring-2 ring-white scale-110' : 'opacity-70 hover:opacity-100'
              }`}
              title={c.name}
            />
          ))}
        </div>

        {/* Brush Size */}
        <div className="flex items-center gap-1.5">
          <span className="text-neutral-400 mr-1">Nét:</span>
          {[
            { w: 4, label: 'Thanh' },
            { w: 7, label: 'Vừa' },
            { w: 12, label: 'Đậm' },
          ].map((b) => (
            <button
              key={b.w}
              onClick={() => setBrushWidth(b.w)}
              className={`px-2.5 py-1 rounded-lg border transition ${
                brushWidth === b.w
                  ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40 font-semibold'
                  : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:text-white'
              }`}
            >
              {b.label}
            </button>
          ))}
        </div>

        {/* Underlay Toggle & Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowUnderlay(!showUnderlay)}
            className={`px-2.5 py-1 rounded-lg border transition ${
              showUnderlay ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-neutral-800 border-neutral-700 text-neutral-400'
            }`}
          >
            {showUnderlay ? 'Ẩn nét mẫu' : 'Hiện nét mẫu'}
          </button>

          <button
            onClick={handleUndo}
            disabled={strokeHistory.length === 0}
            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 disabled:opacity-40 transition"
            title="Hoàn tác (Undo)"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={handleClear}
            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-rose-400 hover:text-rose-300 transition"
            title="Xóa trắng canvas"
          >
            <Eraser className="w-4 h-4" />
          </button>
        </div>
      </div>

      {tips && (
        <div className="w-full max-w-xl mt-3 p-3 rounded-xl bg-neutral-900/60 border border-neutral-800 text-xs text-neutral-400 text-center">
          💡 <strong className="text-neutral-300">Lưu ý luyện nét:</strong> {tips}
        </div>
      )}
    </div>
  );
};
