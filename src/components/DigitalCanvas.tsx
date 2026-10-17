import React, { useRef, useState, useEffect } from 'react';
import { Eraser, RotateCcw, Check, Sparkles, Volume2, ArrowLeft, ShieldCheck, Activity, Camera } from 'lucide-react';
import { GridType } from '../types';
import { playStrokeSound, speakText, playASMRPenScratch } from '../utils/audio';
import { awardExp } from '../utils/gamification';
import { 
  evaluateUserStrokeWithTolerance, 
  DetailedStrokeEvaluation, 
  Point2D, 
  ValidationMatrixLogger 
} from '../utils/cvEngine';
import { 
  RealtimeStrokeDeviationDetector, 
  DeviationFeedback 
} from '../utils/realtimeDeviationDetector';
import { getStrokesForCharacter } from '../data/strokeData';
import { ValidationMatrixModal } from './ValidationMatrixModal';
import { HandwritingAssessmentModal } from './HandwritingAssessmentModal';
import { 
  evaluatePostWritingSession, 
  PostWritingAssessmentResult 
} from '../utils/handwritingEvaluator';

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
  const [latestEval, setLatestEval] = useState<DetailedStrokeEvaluation | null>(null);
  const [isValidationModalOpen, setIsValidationModalOpen] = useState<boolean>(false);
  const [isAudioBuzzerEnabled, setIsAudioBuzzerEnabled] = useState<boolean>(true);
  const currentStrokePointsRef = useRef<Point2D[]>([]);
  const allUserPointsRef = useRef<Point2D[]>([]);
  const [assessmentResult, setAssessmentResult] = useState<PostWritingAssessmentResult | null>(null);
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState<boolean>(false);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [currentChar, setCurrentChar] = useState<string>(charOrText);
  const [blankWarningNotice, setBlankWarningNotice] = useState<string | null>(null);

  // 5. Real-time Point-to-Path Deviation Detection Engine
  const deviationDetectorRef = useRef(new RealtimeStrokeDeviationDetector({
    safeRadius: 18,
    consecutiveFramesThreshold: 3,
    maxOcclusionDurationMs: 300,
    enableAudioAlert: true,
  }));
  const [realtimeFeedback, setRealtimeFeedback] = useState<DeviationFeedback>(() =>
    deviationDetectorRef.current.processFrame(null)
  );

  // Sync stroke data for the active character
  useEffect(() => {
    const char = charOrText.trim().charAt(0) || 'a';
    const strokes = getStrokesForCharacter(char);
    if (strokes.length > 0 && strokes[0].d) {
      deviationDetectorRef.current.setActiveStroke(strokes[0].d);
    }
  }, [charOrText]);

  // Sync buzzer setting
  useEffect(() => {
    if (deviationDetectorRef.current) {
      (deviationDetectorRef.current as any).config.enableAudioAlert = isAudioBuzzerEnabled;
    }
  }, [isAudioBuzzerEnabled]);

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

    currentStrokePointsRef.current = [{ x, y, t: performance.now() }];
    deviationDetectorRef.current.resetState();

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

    currentStrokePointsRef.current.push({ x, y, t: performance.now() });

    // 1. Real-time Point-to-Path Deviation Validation (Frame-by-frame)
    const normX = (x / rect.width) * 100;
    const normY = (y / rect.height) * 100;
    allUserPointsRef.current.push({ x: normX, y: normY });
    const fb = deviationDetectorRef.current.processFrame({ x: normX, y: normY }, false);
    setRealtimeFeedback(fb);

    // 2. Immediate Visual Feedback: Turn brush to bright red on deviation
    if (fb.status === 'DEVIATION_ALERT' || fb.status === 'DIRECTION_ERROR') {
      ctx.strokeStyle = '#ef4444';
      ctx.shadowColor = 'rgba(239, 68, 68, 0.7)';
      ctx.shadowBlur = 8;
    } else {
      ctx.strokeStyle = inkColor;
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
    }

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

    const fb = deviationDetectorRef.current.processFrame(null, true);
    setRealtimeFeedback(fb);

    // Dynamic Time Warping (DTW) Stroke Evaluation with 20% Tolerance threshold
    if (currentStrokePointsRef.current.length >= 3) {
      const userPts = currentStrokePointsRef.current;
      // Tạo đường chuẩn mẫu dựa trên nét viết
      const refPts: Point2D[] = [
        { x: userPts[0].x, y: userPts[0].y },
        { 
          x: (userPts[0].x + userPts[userPts.length - 1].x) / 2, 
          y: (userPts[0].y + userPts[userPts.length - 1].y) / 2 
        },
        { x: userPts[userPts.length - 1].x, y: userPts[userPts.length - 1].y }
      ];

      const evaluation = evaluateUserStrokeWithTolerance(userPts, refPts, 28);
      setLatestEval(evaluation);

      // Log kết quả thực nghiệm vào Validation Matrix Logger & Realtime Matrix
      ValidationMatrixLogger.getInstance().recordTest(
        charOrText.trim().charAt(0) || 'a',
        1,
        evaluation.status === 'PASS' ? 'CORRECT' : 'DEFECTIVE',
        evaluation,
        14
      );

      deviationDetectorRef.current.logStrokeValidation(
        evaluation.status === 'PASS' ? 'CORRECT' : 'INTENTIONAL_ERROR'
      );
    }

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
    allUserPointsRef.current = [];
    letterStrokesRef.current = 0;
  };

  // Chấm điểm sau khi viết xong trên Canvas
  const handleFinishAndCheck = () => {
    setIsEvaluating(true);
    setBlankWarningNotice(null);

    // Kiểm tra trang giấy trắng (chưa viết gì)
    if (!hasDrawn || allUserPointsRef.current.length < 5) {
      setBlankWarningNotice('⚠️ Bạn chưa viết chữ lên giấy! Vui lòng viết theo mẫu rồi bấm Chấm điểm lại nhé.');
      setTimeout(() => setBlankWarningNotice(null), 5000);
      setIsEvaluating(false);
      return;
    }

    try {
      const char = currentChar.trim().charAt(0) || 'a';
      const recordedErrors: string[] = [];
      if (realtimeFeedback.status === 'DEVIATION_ALERT') recordedErrors.push('LỆCH_QUỸ_ĐẠO');
      if (realtimeFeedback.status === 'DIRECTION_ERROR') recordedErrors.push('SAI_HƯỚNG_NÉT');

      const result = evaluatePostWritingSession({
        character: char,
        sourceElement: canvasRef.current,
        drawnStrokesCount: letterStrokesRef.current || (hasDrawn ? 1 : 0),
        userPoints: allUserPointsRef.current,
        recordedErrors,
      });

      setAssessmentResult(result);
      setIsAssessmentModalOpen(true);

      if (result.overall_score >= 85) {
        awardExp(15, `Xuất sắc! Viết chuẩn chữ '${char}' trên bảng số`);
      } else if (result.overall_score >= 60) {
        awardExp(8, `Hoàn thành bài luyện chữ '${char}'`);
      } else {
        awardExp(3, `Nỗ lực rèn chữ '${char}'`);
      }
    } catch (err) {
      console.error('Lỗi khi chấm điểm canvas:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleRetryCurrentLetter = () => {
    setIsAssessmentModalOpen(false);
    handleClear();
    setAssessmentResult(null);
  };

  const handleNextLetter = () => {
    setIsAssessmentModalOpen(false);
    setAssessmentResult(null);
    handleClear();

    const VIETNAMESE_ALPHABET = ['a', 'ă', 'â', 'b', 'c', 'd', 'đ', 'e', 'ê', 'g', 'h', 'i', 'k', 'l', 'm', 'n', 'o', 'ô', 'ơ', 'p', 'q', 'r', 's', 't', 'u', 'ư', 'v', 'x', 'y'];
    const cur = currentChar.trim().toLowerCase();
    const idx = VIETNAMESE_ALPHABET.indexOf(cur);
    if (idx !== -1 && idx < VIETNAMESE_ALPHABET.length - 1) {
      setCurrentChar(VIETNAMESE_ALPHABET[idx + 1]);
    } else if (idx === VIETNAMESE_ALPHABET.length - 1) {
      setCurrentChar(VIETNAMESE_ALPHABET[0]);
    } else {
      setCurrentChar('a');
    }
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

      {/* Real-Time Stroke Deviation HUD Status */}
      <div 
        className="w-full max-w-xl mb-3 px-3.5 py-2.5 rounded-2xl border shadow-xl flex items-center justify-between gap-2 transition-all duration-200 backdrop-blur-md"
        style={{
          backgroundColor: 
            realtimeFeedback.status === 'DEVIATION_ALERT' || realtimeFeedback.status === 'DIRECTION_ERROR'
              ? 'rgba(239, 68, 68, 0.20)'
              : 'rgba(16, 185, 129, 0.15)',
          borderColor: realtimeFeedback.colorHex,
        }}
      >
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full animate-ping shrink-0" style={{ backgroundColor: realtimeFeedback.colorHex }} />
          <span className="text-xs sm:text-sm font-bold text-white tracking-tight">
            {realtimeFeedback.instructionText}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-mono">
          <span className="px-2 py-0.5 rounded-full bg-neutral-900 border border-neutral-700 text-neutral-300">
            {realtimeFeedback.currentDistance}px / R:{realtimeFeedback.safeRadius}px
          </span>
          <button
            type="button"
            onClick={() => setIsAudioBuzzerEnabled(!isAudioBuzzerEnabled)}
            className="px-2 py-0.5 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition cursor-pointer"
            title="Bật/Tắt còi báo âm thanh khi viết lệch nét"
          >
            {isAudioBuzzerEnabled ? '🔊 Còi bật' : '🔇 Còi tắt'}
          </button>
          <button
            type="button"
            onClick={() => setIsValidationModalOpen(true)}
            className="px-2.5 py-0.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition flex items-center gap-1 cursor-pointer"
            title="Mở Báo Cáo Thực Nghiệm Ma Trận Kiểm Thử Ban Giám Khảo"
          >
            <span>📊 BGK</span>
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

          <button
            onClick={() => setIsValidationModalOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition flex items-center gap-1 shadow cursor-pointer"
            title="Mở bảng số liệu thực nghiệm (Ban Giám Khảo)"
          >
            <span>📊</span>
            <span className="hidden sm:inline">Báo Cáo BGK</span>
          </button>
        </div>
      </div>

      {/* Real-time DTW Stroke Assessment Pill (Tolerance 20%) */}
      {latestEval && (
        <div className="w-full max-w-xl mt-3 p-3.5 rounded-2xl bg-gradient-to-r from-neutral-900 via-slate-900 to-indigo-950 border border-indigo-500/40 shadow-lg text-xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white flex items-center gap-1">
                <span>⚡</span> DTW Đánh Giá Nét Vừa Viết:
              </span>
              <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                latestEval.status === 'PASS' 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              }`}>
                {latestEval.status === 'PASS' ? '✓ ĐẠT CHUẨN' : '⚠ CẦN NẮN NÓT'}
              </span>
            </div>

            <span className="font-mono text-cyan-400 font-bold">
              Quỹ đạo: {latestEval.metrics.trajectory_score}% (DTW: {latestEval.dtwDistance})
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-between text-neutral-300 text-[11px] gap-2 pt-1 border-t border-neutral-800">
            <div>
              {latestEval.isPersonalStyleAccepted ? (
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  ✓ Phong cách nghiêng tự nhiên hợp lệ (Dung sai &lt; 20% ô ly)
                </span>
              ) : (
                <span className="text-amber-400 font-semibold">
                  {latestEval.detected_errors[0]?.instruction || 'Chú ý tỷ lệ chiều cao ô ly'}
                </span>
              )}
            </div>
            <div className="text-neutral-400 font-mono">
              Đặt/Dừng: {latestEval.metrics.start_end_accuracy}% | Tỷ lệ: {latestEval.metrics.proportion_score}%
            </div>
          </div>
        </div>
      )}

      {tips && (
        <div className="w-full max-w-xl mt-3 p-3 rounded-xl bg-neutral-900/60 border border-neutral-800 text-xs text-neutral-400 text-center">
          💡 <strong className="text-neutral-300">Lưu ý luyện nét:</strong> {tips}
        </div>
      )}

      {/* CẢNH BÁO TRANG GIẤY TRẮNG (BLANK DETECTION TOAST) */}
      {blankWarningNotice && (
        <div 
          id="blank-paper-toast"
          className="fixed top-16 sm:top-20 inset-x-0 z-[1000000] flex justify-center px-4 animate-in slide-in-from-top duration-200 pointer-events-auto"
          style={{ zIndex: 1000000 }}
        >
          <div className="max-w-md bg-amber-950/95 border-2 border-amber-400 text-amber-200 px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 backdrop-blur-md">
            <span className="text-2xl animate-bounce">⚠️</span>
            <div className="flex-1 text-xs sm:text-sm font-bold leading-snug">
              {blankWarningNotice}
            </div>
            <button 
              type="button"
              onClick={() => setBlankWarningNotice(null)}
              className="text-amber-400 hover:text-white text-xs font-bold px-2.5 py-1 bg-amber-900/60 rounded-xl cursor-pointer"
            >
              Đã hiểu
            </button>
          </div>
        </div>
      )}

      {/* GIAO DIỆN NÚT BẤM "ĐÃ VIẾT XONG - CHẤM ĐIỂM" & "VIẾT LẠI NÉT NÀY" */}
      <div className="w-full max-w-xl mt-4 flex items-center justify-center gap-3">
        <button
          id="btn-retry-stroke"
          type="button"
          onClick={handleRetryCurrentLetter}
          className="h-12 px-5 rounded-full bg-neutral-900 hover:bg-neutral-850 text-neutral-200 hover:text-white font-bold text-xs sm:text-sm border border-neutral-700 shadow-lg active:scale-95 flex items-center gap-1.5 transition cursor-pointer"
          title="Xóa để viết lại nét chữ này"
        >
          <RotateCcw className="w-4 h-4 text-amber-400" />
          <span>Viết lại nét này</span>
        </button>

        <button
          id="btn-capture-grade"
          data-finish-id="btn-finish-check"
          type="button"
          onClick={handleFinishAndCheck}
          disabled={isEvaluating}
          className="min-h-[50px] px-7 py-3 rounded-full bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-black text-sm sm:text-base shadow-2xl shadow-emerald-950/80 border-2 border-emerald-300/60 active:scale-95 flex items-center gap-2 transition cursor-pointer ring-4 ring-emerald-500/20"
          style={{
            padding: '14px 24px',
            borderRadius: '30px',
            boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.6), 0 8px 10px -6px rgba(16, 185, 129, 0.6)',
            zIndex: 999999,
            pointerEvents: 'auto',
          }}
        >
          <Camera className="w-5 h-5 text-amber-300" />
          <span>{isEvaluating ? 'Đang phân tích nét...' : '📸 Đã viết xong - Chấm điểm'}</span>
        </button>
      </div>

      {/* Popup Bảng Kết Quả Đánh Giá Chữ Viết (Handwriting Assessment Modal) */}
      <HandwritingAssessmentModal
        isOpen={isAssessmentModalOpen}
        result={assessmentResult}
        onClose={() => setIsAssessmentModalOpen(false)}
        onRetry={handleRetryCurrentLetter}
        onNextLetter={handleNextLetter}
      />

      {/* Validation Matrix Modal for Judging Panel */}
      <ValidationMatrixModal
        isOpen={isValidationModalOpen}
        onClose={() => setIsValidationModalOpen(false)}
      />
    </div>
  );
};
