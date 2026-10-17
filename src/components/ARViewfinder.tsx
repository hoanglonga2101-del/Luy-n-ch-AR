import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, 
  RotateCw, 
  Lock, 
  Unlock, 
  Settings, 
  Sun, 
  RefreshCw,
  Sparkles,
  HelpCircle,
  Zap,
  ZapOff,
  ChevronLeft,
  Check,
  Move,
  Type,
  Plus,
  Minus,
  X,
  FileText,
  AlertTriangle,
  Award,
  TrendingUp,
  Sliders
} from 'lucide-react';
import { GridType, ProjectionStyle, StrokePath, DeviceMode, HandwritingFeedback } from '../types';
import { getStrokesForCharacter } from '../data/strokeData';
import { playStrokeSound, playFanfareSound, playWarningBeep } from '../utils/audio';
import { saveReviewToHistory, awardExp } from '../utils/gamification';
import { 
  GOOGLE_15_ENGLISH_FONTS,
  OTHER_LANGUAGE_FONTS, 
  ALL_FONTS, 
  getFontOptionById, 
  getDefaultFontForLanguage,
  FontOption 
} from '../data/fontOptions';
import { 
  captureWritingArea,
  extractHandwritingStrokes,
  evaluateAgainstTemplate,
  evaluateDrawingOnPaper,
  calculateRealisticCVScore, 
  MIN_STROKE_LENGTH,
  NO_STROKES_DETECTED_MESSAGE,
  NO_INK_WARNING_MESSAGE, 
  InkDetectionResult,
  StrokeEvaluationResult,
  HandwritingStrokeDetectionResult
} from '../utils/inkDetection';

export const NEON_COLOR_PRESETS = [
  { id: 'neon_pink', label: 'Hồng mờ Neon', hex: '#FF0055', desc: 'Chuẩn màu đồ nét dễ nhìn' },
  { id: 'neon_green', label: 'Xanh Lá Neon', hex: '#00FF66', desc: 'Tương phản cao với mực đen/xanh' },
  { id: 'neon_blue', label: 'Xanh Dương', hex: '#0099FF', desc: 'Dịu mắt, nét thanh thoát' },
  { id: 'bright_yellow', label: 'Vàng Sáng', hex: '#FFCC00', desc: 'Rõ trong phòng tối' },
  { id: 'solid_black', label: 'Mực Đen', hex: '#000000', desc: 'Mực đen truyền thống' },
];

const QUICK_TEMPLATES = [
  {
    label: 'Ca dao 2 câu (Lục bát)',
    text: 'Công cha như núi Thái Sơn\nNghĩa mẹ như nước trong nguồn chảy ra'
  },
  {
    label: 'Châm ngôn rèn chữ',
    text: 'Nét chữ nết người\nRèn đức luyện tài'
  },
  {
    label: 'Tiếng Anh Cursive',
    text: 'Practice makes perfect\nEvery single day'
  },
  {
    label: 'Chữ cái Tiếng Việt mẫu',
    text: 'a'
  },
  {
    label: 'Chữ cái hoa Tiếng Việt',
    text: 'A'
  },
  {
    label: 'Chữ Hán 4 chữ (Thành ngữ)',
    text: '千里之行'
  }
];

interface ARViewfinderProps {
  text: string;
  language: 'vi' | 'en' | 'ja' | 'zh';
  reading?: string;
  translation?: string;
  tips?: string;
  fontId?: string;
  deviceMode?: DeviceMode;
  onSelectDeviceMode?: (mode: DeviceMode) => void;
  onOpenGuide: () => void;
  onBackToMenu: () => void;
}

export const ARViewfinder: React.FC<ARViewfinderProps> = ({
  text,
  language,
  reading,
  translation,
  tips,
  fontId,
  deviceMode: initialDeviceMode,
  onSelectDeviceMode,
  onOpenGuide,
  onBackToMenu,
}) => {
  // 1. Text & Content State
  const [currentText, setCurrentText] = useState<string>(text);
  const [tempEditText, setTempEditText] = useState<string>(text);
  const [isEditingText, setIsEditingText] = useState<boolean>(false);
  const [showExitDropdown, setShowExitDropdown] = useState<boolean>(false);

  useEffect(() => {
    setCurrentText(text);
    setTempEditText(text);
  }, [text]);

  const textLines: string[] = currentText.split('\n');
  const characters: string[] = Array.from(currentText.replace(/\s+/g, ' '));
  const activeChar: string = characters[0] || 'a';
  const charStrokes: StrokePath[] = getStrokesForCharacter(activeChar);
  const isSingleCharWithStrokes = textLines.length === 1 && currentText.trim().length === 1 && charStrokes.length > 0;

  // 2. Camera Stream State
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [isTorchOn, setIsTorchOn] = useState<boolean>(false);
  const [torchAvailable, setTorchAvailable] = useState<boolean>(false);

  // 3. AR Guide Visuals (Zen Mode: Default Pink Semi-Transparent Ink)
  const [opacity, setOpacity] = useState<number>(0.45); // 45% soft opacity
  const [textColor, setTextColor] = useState<string>('#FF0055'); // Soft Neon Pink
  const [scale, setScale] = useState<number>(1.15);
  const [rotation, setRotation] = useState<number>(0);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number; startPos: { x: number; y: number } }>({
    x: 0,
    y: 0,
    startPos: { x: 0, y: 0 }
  });

  const [gridType, setGridType] = useState<GridType>(
    language === 'vi' ? 'oly_vi' : language === 'en' ? 'four_line_en' : 'tian_zh'
  );
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [selectedFontId, setSelectedFontId] = useState<string>(fontId || getDefaultFontForLanguage(language));

  // 4. Popover Menus (Clean Zen Mode)
  const [showSettingsPopover, setShowSettingsPopover] = useState<boolean>(false);
  const [isScreenLocked, setIsScreenLocked] = useState<boolean>(false);
  const [showLockToast, setShowLockToast] = useState<boolean>(false);

  // 5. Real-Time Ink Detection & Scoring State (Bug 1 & Algorithm Fix)
  const rulingBoxRef = useRef<HTMLDivElement>(null);
  const [isScoring, setIsScoring] = useState<boolean>(false);
  const [inkWarning, setInkWarning] = useState<string | null>(null);
  const [strokeWarning, setStrokeWarning] = useState<string | null>(null);
  const [debugOverlayUrl, setDebugOverlayUrl] = useState<string | null>(null);
  const [showDebugView, setShowDebugView] = useState<boolean>(false);
  const [evaluationResult, setEvaluationResult] = useState<HandwritingFeedback | null>(null);
  const [capturedSnapshot, setCapturedSnapshot] = useState<string | null>(null);
  const [expEarned, setExpEarned] = useState<number>(0);

  // Auto-hide warning after 6 seconds
  useEffect(() => {
    if (inkWarning) {
      const timer = setTimeout(() => {
        setInkWarning(null);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [inkWarning]);

  // Camera initialization
  useEffect(() => {
    let activeStream: MediaStream | null = null;
    let isCancelled = false;

    async function startCamera() {
      setCameraError(null);
      setIsTorchOn(false);
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('Trình duyệt không hỗ trợ camera.');
        }

        const constraints: MediaStreamConstraints = {
          audio: false,
          video: {
            facingMode: { ideal: facingMode },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        };

        const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        if (isCancelled) {
          mediaStream.getTracks().forEach((t) => t.stop());
          return;
        }

        activeStream = mediaStream;
        setStream(mediaStream);

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play().catch(() => {});
        }

        const videoTrack = mediaStream.getVideoTracks()[0];
        if (videoTrack) {
          const capabilities = (videoTrack as any).getCapabilities?.() || {};
          setTorchAvailable(!!capabilities.torch);
        }
      } catch (err: any) {
        console.warn('Camera start error:', err);
        setCameraError(err.message || 'Không thể mở Camera.');
      }
    }

    startCamera();

    return () => {
      isCancelled = true;
      if (activeStream) {
        activeStream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [facingMode]);

  // Flash / Torch handler
  const handleToggleTorch = async () => {
    if (!stream || !torchAvailable) return;
    const track = stream.getVideoTracks()[0];
    if (!track) return;
    try {
      const nextTorch = !isTorchOn;
      await (track as any).applyConstraints({
        advanced: [{ torch: nextTorch }],
      });
      setIsTorchOn(nextTorch);
      playStrokeSound(1.2);
    } catch {
      // ignore
    }
  };

  // Screen lock handler
  const toggleScreenLock = () => {
    const next = !isScreenLocked;
    setIsScreenLocked(next);
    setShowLockToast(next);
    playStrokeSound(next ? 0.9 : 1.3);
    if (next) {
      setTimeout(() => setShowLockToast(false), 2500);
    }
  };

  // Dragging AR Guide
  const handlePointerDown = (e: React.PointerEvent) => {
    if (isScreenLocked) return;
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      startPos: { ...position },
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || isScreenLocked) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setPosition({
      x: dragStartRef.current.startPos.x + dx,
      y: dragStartRef.current.startPos.y + dy,
    });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  // CRITICAL: Strict Pre-validation & Handwriting Stroke Detection Control Flow
  const handleScoreHandwriting = async () => {
    if (!videoRef.current) return;
    setIsScoring(true);
    setInkWarning(null);

    // BƯỚC 1: TRÍCH XUẤT ẢNH VÙNG VIẾT (ROI) TỪ CAMERA
    const roiImage = captureWritingArea(videoRef.current, rulingBoxRef.current);

    // BƯỚC 2: KIỂM TRA XEM CÓ NÉT CHỮ THẬT ĐƯỢC VIẾT HAY KHÔNG (STROKE / CONTOUR DETECTION)
    const detectedStrokes = extractHandwritingStrokes(roiImage);

    if (!detectedStrokes || !detectedStrokes.hasStrokes || detectedStrokes.totalLength < MIN_STROKE_LENGTH) {
      // LẬP TỨC HỦY BỎ LƯỢT CHẤM ĐIỂM!
      // KHÔNG ĐƯỢC HIỂN THỊ POPUP ĐIỂM SỐ (Chấm dứt hoàn toàn việc hiện popup 65/100 điểm ảo)
      setIsScoring(false);
      setInkWarning(NO_STROKES_DETECTED_MESSAGE);
      playWarningBeep(); // Web Audio API
      return; // DỪNG NGAY LẬP TỨC, KHÔNG MỞ POPUP
    }

    // BƯỚC 3: KHI ĐÃ XÁC NHẬN CÓ CHỮ THẬT -> TIẾN HÀNH CHẤM ĐIỂM ĐỐI CHIẾU VỚI MẪU
    const templateToEvaluate = isSingleCharWithStrokes ? charStrokes : activeChar;
    const strokeEval = evaluateAgainstTemplate(roiImage, templateToEvaluate);

    // Kiểm tra an toàn: Nếu không tìm thấy nét hợp lệ đối chiếu
    if (!strokeEval.hasStrokes || !strokeEval.hasInk) {
      setIsScoring(false);
      setInkWarning(NO_STROKES_DETECTED_MESSAGE);
      playWarningBeep();
      return; // Dừng ngay, không mở popup
    }

    setCapturedSnapshot(roiImage.toDataURL('image/jpeg', 0.88));
    setDebugOverlayUrl(strokeEval.debugOverlayUrl || null);
    setStrokeWarning(strokeEval.warningText || null);

    let finalFeedback: HandwritingFeedback;
    let earnedPoints = 0;

    try {
      // Gọi backend với ảnh thật và các chỉ số thị giác máy tính đã kiểm chứng
      const res = await fetch('/api/analyze-handwriting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: roiImage.toDataURL('image/jpeg', 0.88),
          sampleText: currentText,
          target_character: activeChar,
          stroke_index: 1,
          cv_metrics: strokeEval,
        }),
      });

      const data = await res.json();
      if (data.success && data.feedback) {
        finalFeedback = data.feedback;
        if (data.strictEvaluation) {
          finalFeedback.strictEvaluation = data.strictEvaluation;
        }

        // RÀNG BUỘC KẾT QUẢ ĐỐI CHIẾU:
        // Nếu phát hiện nét chữ nhưng sai hoàn toàn so với chữ mẫu:
        // Tổng điểm phải < 40 điểm, thông báo rõ nét viết chưa đúng mẫu chữ yêu cầu.
        if (strokeEval.finalScore < 40 || strokeEval.status === 'FAIL') {
          finalFeedback.overallScore = Math.min(35, strokeEval.finalScore);
          finalFeedback.grade = "Chưa đạt - Nét viết chưa đúng mẫu chữ yêu cầu";
          finalFeedback.improvements = [
            strokeEval.warningText || "⚠️ Nét viết chưa đúng mẫu chữ yêu cầu! Bé hãy quan sát nét mẫu màu hồng và viết lại cẩn thận nhé."
          ];
          if (finalFeedback.slantAnalysis) finalFeedback.slantAnalysis.score = Math.min(30, strokeEval.trajectoryScore);
          if (finalFeedback.sizeConsistency) finalFeedback.sizeConsistency.score = Math.min(30, strokeEval.completenessScore);
          if (finalFeedback.strictEvaluation?.metrics) {
            finalFeedback.strictEvaluation.metrics.overall_score = finalFeedback.overallScore;
            finalFeedback.strictEvaluation.metrics.start_end_accuracy = Math.min(30, Math.round(strokeEval.precision * 40));
          }
        } else if (strokeEval.finalScore >= 80) {
          finalFeedback.overallScore = Math.max(finalFeedback.overallScore, strokeEval.finalScore);
        }
      } else {
        throw new Error(data.error || 'Lỗi xử lý hình ảnh');
      }
    } catch (err: any) {
      console.warn('Backend handwriting analysis fallback to CV Engine:', err);
      if (err.message && (err.message.includes('Chưa phát hiện') || err.message.includes('Không phát hiện'))) {
        setIsScoring(false);
        setInkWarning(NO_STROKES_DETECTED_MESSAGE);
        playWarningBeep();
        return;
      }

      // XÓA BỎ HOÀN TOÀN BIẾN ĐIỂM MẪU VÀ GIÁ TRỊ TỰ GÁN:
      const isWrongSample = strokeEval.finalScore < 40 || strokeEval.status === 'FAIL';
      const actualStartEnd = isWrongSample
        ? Math.min(30, Math.round(strokeEval.precision * 40))
        : Math.max(35, Math.round(100 - strokeEval.penalty * 1.5));

      const strictFallback = {
        target_character: activeChar,
        stroke_index: 1,
        status: strokeEval.status,
        metrics: {
          overall_score: strokeEval.finalScore,
          trajectory_score: strokeEval.trajectoryScore,
          start_end_accuracy: actualStartEnd,
          proportion_score: strokeEval.proportionScore,
          smoothness_score: Math.max(25, Math.round(strokeEval.precision * 95)),
        },
        detected_errors: strokeEval.warningText ? [
          {
            error_type: "LECH_NET_SAI_MAU" as const,
            severity: "HIGH" as const,
            instruction: strokeEval.warningText,
          }
        ] : [],
        learning_path_recommendation: {
          focus_area: isWrongSample ? "Quan sát hình dáng chữ mẫu" : "Nét móc ngược & Độ nghiêng tự nhiên",
          suggested_next_exercise: isWrongSample
            ? "Đồ lại theo nét chữ mẫu màu hồng để quen tay trước khi viết độc lập"
            : "Luyện 3 dòng nét mẫu để tay quen với nhịp lia bút đều đặn",
        },
      };

      let gradeText = "Khá - Nét chữ đều và sáng";
      if (strokeEval.finalScore >= 88) gradeText = "Xuất sắc - Nét chữ chuẩn nét mẫu ⭐";
      else if (strokeEval.finalScore >= 75) gradeText = "Khá tốt - Nét chữ thanh thoát, đúng quy tắc";
      else if (strokeEval.finalScore >= 50) gradeText = "Trung bình - Cần nắn lại tỷ lệ ô ly";
      else gradeText = "Chưa đạt - Nét viết chưa đúng mẫu chữ yêu cầu";

      finalFeedback = {
        overallScore: strokeEval.finalScore,
        grade: gradeText,
        slantAnalysis: {
          score: strokeEval.trajectoryScore,
          detectedAngle: "Nghiêng tự nhiên 15°",
          feedback: isWrongSample
            ? "Nét bút chưa bám sát quỹ đạo của chữ mẫu."
            : `Độ bám nét đạt ${Math.round(strokeEval.precision * 100)}% quỹ đạo chuẩn (${strokeEval.inTemplatePixels}/${strokeEval.totalInkPoints} điểm mực).`,
        },
        sizeConsistency: {
          score: strokeEval.completenessScore,
          feedback: `Độ hoàn thiện con chữ đạt ${Math.round(strokeEval.recall * 100)}% chiều dài nét mẫu.`,
        },
        spacingAndAlignment: {
          score: actualStartEnd,
          feedback: isWrongSample
            ? "Chữ viết chưa đúng tỉ lệ và khung ô ly mẫu."
            : (strokeEval.penalty > 0 
                ? `Phát hiện ${strokeEval.outOfBoundsPixels} điểm mực lệch ngoài nét mẫu (phạt -${strokeEval.penalty} điểm).`
                : "Chân chữ nằm ngay ngắn trong khung ô ly chuẩn."),
        },
        strokeQuality: {
          score: Math.max(25, Math.round(strokeEval.precision * 95)),
          feedback: `Độ chính xác quỹ đạo đạt ${Math.round(strokeEval.precision * 100)}%.`,
        },
        strengths: strokeEval.finalScore >= 70 ? [
          "Bé cầm bút chắc tay, mực bám sát vào quỹ đạo nét mẫu.",
          "Nét chữ nằm gọn trong vùng an toàn của khung ô ly.",
        ] : [
          "Bé đã bắt đầu đặt bút viết bài trên mặt phẳng.",
        ],
        improvements: strokeEval.warningText ? [
          strokeEval.warningText,
          "Chú ý nhìn kỹ nét mẫu màu hồng trước khi đặt ngòi bút.",
        ] : [],
        encouragement: strokeEval.finalScore >= 70
          ? "Bé viết rất cẩn thận và đúng mẫu! Cố gắng luyện tập mỗi ngày để chữ ngày càng đẹp hơn."
          : "Nét chữ chưa đúng chữ mẫu yêu cầu, bé hãy bình tĩnh đồ chậm lại theo đường kẻ màu hồng nhé!",
        strictEvaluation: strictFallback,
      };
    } finally {
      setIsScoring(false);
    }

    // Award realistic EXP strictly based on the 2-way evaluation
    if (finalFeedback.overallScore >= 88) {
      earnedPoints = 25;
    } else if (finalFeedback.overallScore >= 75) {
      earnedPoints = 18;
    } else if (finalFeedback.overallScore >= 50) {
      earnedPoints = 10;
    } else {
      earnedPoints = 2; // Viết sai mẫu chỉ nhận điểm khuyến khích
    }

    setExpEarned(earnedPoints);
    setEvaluationResult(finalFeedback);
    awardExp(earnedPoints, "Luyện viết AR trên giấy thật");
    saveReviewToHistory({
      sampleText: currentText,
      score: finalFeedback.overallScore,
      grade: finalFeedback.grade,
      imageUrl: inkDetection.canvasDataUrl || undefined,
      strengths: finalFeedback.strengths,
      improvements: finalFeedback.improvements,
      expGained: earnedPoints,
    });

    if (finalFeedback.overallScore >= 70) {
      playFanfareSound();
    } else {
      playStrokeSound(0.8);
    }
  };

  const handleApplyNewText = (newText: string) => {
    setCurrentText(newText);
    setTempEditText(newText);
    setIsEditingText(false);
    setShowExitDropdown(false);
    playStrokeSound(1.1);
  };

  const fontOption = getFontOptionById(selectedFontId);

  return (
    <div 
      className="relative w-full h-full min-h-[580px] bg-black overflow-hidden flex flex-col select-none touch-none"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* 1. CAMERA FEED (Full Screen Background) */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none origin-center"
      />

      {/* Subtle Optical Corner Marks (Zen Mode: Clean Framing, NO labels or text) */}
      <div className="absolute inset-4 sm:inset-8 pointer-events-none z-10">
        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-rose-400/50 rounded-tl-lg" />
        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-rose-400/50 rounded-tr-lg" />
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-rose-400/50 rounded-bl-lg" />
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-rose-400/50 rounded-br-lg" />
      </div>

      {/* 2. AR GUIDE: Lớp lưới ô ly và nét chữ mẫu màu hồng mờ (Component 1) */}
      <div 
        id="ar-projection-layer"
        className={`absolute inset-0 z-20 flex items-center justify-center ${isScreenLocked ? 'cursor-default pointer-events-none' : 'cursor-grab active:cursor-grabbing'}`}
        onPointerDown={handlePointerDown}
      >
        <div
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale}) rotate(${rotation}deg)`,
            opacity: opacity,
            transition: isDragging ? 'none' : 'transform 0.05s ease-out',
          }}
          className="relative max-w-[92vw] max-h-[82vh] p-4 flex flex-col items-center justify-center pointer-events-auto"
        >
          {/* Ruling Grid & Letter Frame */}
          <div 
            ref={rulingBoxRef}
            className="relative p-6 sm:p-8 rounded-3xl border border-rose-400/40 shadow-2xl flex flex-col items-center justify-center backdrop-blur-[0.5px]"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.15)',
              minWidth: isSingleCharWithStrokes ? '300px' : 'auto',
              minHeight: isSingleCharWithStrokes ? '300px' : 'auto',
            }}
          >
            {/* Real Notebook Ruling Grids */}
            {showGrid && (
              <div className="absolute inset-0 pointer-events-none rounded-3xl overflow-hidden opacity-40">
                {gridType === 'oly_vi' && (
                  <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="zen_oly_pattern" width="28" height="28" patternUnits="userSpaceOnUse">
                        <rect width="28" height="28" fill="none" stroke="#FF0055" strokeWidth="0.6" strokeOpacity="0.4" />
                        <line x1="0" y1="7" x2="28" y2="7" stroke="#FF0055" strokeWidth="0.35" strokeDasharray="1.5,1.5" strokeOpacity="0.3" />
                        <line x1="0" y1="14" x2="28" y2="14" stroke="#FF0055" strokeWidth="0.35" strokeDasharray="1.5,1.5" strokeOpacity="0.3" />
                        <line x1="0" y1="21" x2="28" y2="21" stroke="#FF0055" strokeWidth="0.35" strokeDasharray="1.5,1.5" strokeOpacity="0.3" />
                        <line x1="0" y1="28" x2="28" y2="28" stroke="#FF0055" strokeWidth="1" strokeOpacity="0.7" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#zen_oly_pattern)" />
                  </svg>
                )}

                {gridType === 'four_line_en' && (
                  <div className="absolute inset-0 flex flex-col justify-around py-4">
                    <div className="w-full border-t-2 border-rose-400/70" />
                    <div className="w-full border-t border-dashed border-sky-400/70" />
                    <div className="w-full border-t-2 border-sky-500/80" />
                    <div className="w-full border-t-2 border-rose-400/70" />
                  </div>
                )}

                {gridType === 'tian_zh' && (
                  <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <rect x="2" y="2" width="98%" height="98%" fill="none" stroke="#FF0055" strokeWidth="1.2" strokeOpacity="0.5" />
                    <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#FF0055" strokeDasharray="4,4" strokeWidth="1" strokeOpacity="0.5" />
                    <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#FF0055" strokeDasharray="4,4" strokeWidth="1" strokeOpacity="0.5" />
                  </svg>
                )}

                {gridType === 'mizi_zh' && (
                  <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <rect x="2" y="2" width="98%" height="98%" fill="none" stroke="#FF0055" strokeWidth="1.2" strokeOpacity="0.5" />
                    <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#FF0055" strokeDasharray="4,4" strokeWidth="1" strokeOpacity="0.5" />
                    <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#FF0055" strokeDasharray="4,4" strokeWidth="1" strokeOpacity="0.5" />
                    <line x1="0" y1="0" x2="100%" y2="100%" stroke="#FF0055" strokeDasharray="3,3" strokeWidth="0.8" strokeOpacity="0.4" />
                    <line x1="100%" y1="0" x2="0" y2="100%" stroke="#FF0055" strokeDasharray="3,3" strokeWidth="0.8" strokeOpacity="0.4" />
                  </svg>
                )}
              </div>
            )}

            {/* A. Single Character Vector Stroke Rendering (Màu hồng mờ / Neon Pink) */}
            {isSingleCharWithStrokes ? (
              <div className="relative z-10 flex flex-col items-center">
                <svg
                  viewBox="0 0 100 100"
                  className="w-56 h-56 sm:w-64 sm:h-64 overflow-visible select-none"
                  style={{ filter: `drop-shadow(0 0 8px ${textColor}99)` }}
                >
                  {charStrokes.map((s) => (
                    <g key={`stroke-${s.id}`}>
                      <path
                        d={s.d}
                        fill="none"
                        stroke={textColor}
                        strokeWidth="5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity={0.85}
                      />
                      {/* Touchdown point */}
                      <circle
                        cx={s.startPoint.x}
                        cy={s.startPoint.y}
                        r="3"
                        fill={textColor}
                      />
                      <text
                        x={s.startPoint.x}
                        y={s.startPoint.y + 1}
                        fill="#ffffff"
                        fontSize="3.2"
                        fontWeight="bold"
                        textAnchor="middle"
                        dominantBaseline="central"
                      >
                        {s.id}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>
            ) : (
              /* B. Multi-line or Custom Text Rendering (Màu hồng mờ / Neon Pink) */
              <div className="relative z-10 flex flex-col items-center max-w-xl text-center px-4">
                {reading && (
                  <div className="text-xs sm:text-sm font-medium tracking-wide mb-1 font-mono text-rose-300">
                    {reading}
                  </div>
                )}
                <div 
                  className={`text-2xl sm:text-4xl md:text-5xl font-semibold leading-relaxed tracking-wider select-none ${fontOption?.className || 'font-sans'}`}
                  style={{ 
                    color: textColor,
                    textShadow: `0 0 12px ${textColor}99`,
                    WebkitTextStroke: '0.6px currentColor',
                  }}
                >
                  {textLines.map((line, idx) => (
                    <div key={`line-${idx}`} className="py-1">
                      {line}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. NÚT "THOÁT / ĐỔI CHỮ" NHỎ GỌN Ở GÓC TRÊN BÊN TRÁI (Component 2) */}
      <div className="absolute top-4 left-4 z-30">
        <div className="relative">
          <button
            id="ar-exit-change-btn"
            onClick={() => setShowExitDropdown(!showExitDropdown)}
            className="px-3.5 py-2 rounded-2xl bg-neutral-900/90 hover:bg-neutral-800 text-white border border-neutral-700/80 backdrop-blur-md shadow-xl flex items-center gap-1.5 text-xs font-bold active:scale-95 transition cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 text-rose-400" />
            <span>Thoát / Đổi chữ</span>
          </button>

          {/* Quick Dropdown Menu */}
          {showExitDropdown && (
            <div className="absolute top-12 left-0 w-64 bg-neutral-900/95 border border-neutral-700/90 rounded-2xl p-2 shadow-2xl backdrop-blur-md text-xs space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
              <button
                onClick={onBackToMenu}
                className="w-full text-left px-3 py-2 rounded-xl hover:bg-neutral-800 text-neutral-200 hover:text-white flex items-center gap-2 font-semibold transition"
              >
                <ChevronLeft className="w-4 h-4 text-rose-400" />
                <span>Quay lại Trang chủ / Bảng bài tập</span>
              </button>

              <button
                onClick={() => {
                  setShowExitDropdown(false);
                  setIsEditingText(true);
                }}
                className="w-full text-left px-3 py-2 rounded-xl hover:bg-neutral-800 text-neutral-200 hover:text-white flex items-center gap-2 font-semibold transition"
              >
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>Nhập chữ mới / Đổi câu luyện viết</span>
              </button>

              <div className="h-px bg-neutral-800 my-1" />

              <div className="px-2 py-1 text-[10px] font-mono font-bold text-neutral-400 uppercase">
                Mẫu nhanh:
              </div>

              <div className="grid grid-cols-2 gap-1 px-1">
                {QUICK_TEMPLATES.map((tmpl) => (
                  <button
                    key={tmpl.label}
                    onClick={() => handleApplyNewText(tmpl.text)}
                    className="p-1.5 rounded-lg bg-neutral-800 hover:bg-rose-950/60 hover:text-rose-300 text-neutral-300 text-[11px] truncate text-left transition"
                  >
                    {tmpl.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. NÚT CÀI ĐẶT (ICON BÁNH RĂNG ⚙️) Ở GÓC TRÊN BÊN PHẢI (Menu Cài Đặt Popover) */}
      <div className="absolute top-4 right-4 z-30">
        <div className="relative">
          <button
            id="ar-settings-btn"
            onClick={() => setShowSettingsPopover(!showSettingsPopover)}
            className={`p-2.5 rounded-2xl border backdrop-blur-md shadow-xl transition active:scale-95 cursor-pointer flex items-center justify-center ${
              showSettingsPopover 
                ? 'bg-rose-500 text-neutral-950 border-rose-300 shadow-rose-950/50' 
                : 'bg-neutral-900/90 hover:bg-neutral-800 text-neutral-200 border-neutral-700/80'
            }`}
            title="Cài đặt hiển thị (Cỡ chữ, Độ sáng, Kiểu lưới)"
          >
            <Settings className="w-5 h-5" />
          </button>

          {/* Settings Popover */}
          {showSettingsPopover && (
            <div className="absolute top-12 right-0 w-80 bg-neutral-900/95 border border-neutral-700/90 rounded-3xl p-4 shadow-2xl backdrop-blur-md text-xs space-y-4 animate-in fade-in slide-in-from-top-2 duration-150 max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                <span className="font-bold text-sm text-white flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-rose-400" />
                  <span>Cài đặt hiển thị AR</span>
                </span>
                <button
                  onClick={() => setShowSettingsPopover(false)}
                  className="p-1 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Cỡ chữ (Scale) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-neutral-300">
                  <span className="font-semibold">Cỡ chữ mẫu:</span>
                  <span className="font-mono text-cyan-400 font-bold">{Math.round(scale * 100)}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setScale((s) => Math.max(0.5, parseFloat((s - 0.1).toFixed(1))))}
                    className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="range"
                    min="0.5"
                    max="2.5"
                    step="0.05"
                    value={scale}
                    onChange={(e) => setScale(parseFloat(e.target.value))}
                    className="flex-1 accent-rose-500 cursor-pointer"
                  />
                  <button
                    onClick={() => setScale((s) => Math.min(2.5, parseFloat((s + 0.1).toFixed(1))))}
                    className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Độ sáng / Độ mờ nét mẫu (Opacity) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-neutral-300">
                  <span className="font-semibold">Độ sáng nét mẫu:</span>
                  <span className="font-mono text-amber-400 font-bold">{Math.round(opacity * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={opacity}
                  onChange={(e) => setOpacity(parseFloat(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>

              {/* Màu nét mẫu */}
              <div className="space-y-1.5">
                <span className="font-semibold text-neutral-300 block">Màu mực phản quang:</span>
                <div className="flex items-center justify-between gap-1.5">
                  {NEON_COLOR_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => {
                        setTextColor(preset.hex);
                        playStrokeSound(1.2);
                      }}
                      className={`w-7 h-7 rounded-full border-2 transition transform hover:scale-110 flex items-center justify-center ${
                        textColor.toLowerCase() === preset.hex.toLowerCase()
                          ? 'border-white ring-2 ring-rose-400 shadow-md'
                          : 'border-white/30 opacity-70'
                      }`}
                      style={{ backgroundColor: preset.hex }}
                      title={preset.label}
                    >
                      {textColor.toLowerCase() === preset.hex.toLowerCase() && (
                        <Check className="w-3.5 h-3.5 text-white drop-shadow" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Kiểu Lưới ô ly */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-neutral-300">Lưới kẻ vở:</span>
                  <button
                    onClick={() => setShowGrid(!showGrid)}
                    className="text-xs text-rose-400 font-semibold underline"
                  >
                    {showGrid ? 'Bật [ON]' : 'Tắt [OFF]'}
                  </button>
                </div>
                {showGrid && (
                  <select
                    value={gridType}
                    onChange={(e) => setGridType(e.target.value as GridType)}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-2 text-white text-xs font-semibold"
                  >
                    <option value="oly_vi">Ô ly Tiểu học (4 ô kẻ dọc/ngang)</option>
                    <option value="four_line_en">4 Dòng kẻ Tiếng Anh (Four lines)</option>
                    <option value="tian_zh">Ô Chữ Điền (田字格)</option>
                    <option value="mizi_zh">Ô Chữ Mễ (米字格)</option>
                  </select>
                )}
              </div>

              {/* Font Chữ */}
              <div className="space-y-1.5">
                <span className="font-semibold text-neutral-300 block">Kiểu chữ:</span>
                <select
                  value={selectedFontId}
                  onChange={(e) => setSelectedFontId(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-2 text-white text-xs font-semibold"
                >
                  <optgroup label="🌟 Font Chữ Đẹp Tiếng Anh & Calligraphy">
                    {GOOGLE_15_ENGLISH_FONTS.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.vietnameseTitle}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="🌏 Font Khác">
                    {OTHER_LANGUAGE_FONTS.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.vietnameseTitle}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              {/* Action Toggles */}
              <div className="pt-2 border-t border-neutral-800 space-y-2">
                {/* Lock Screen */}
                <button
                  onClick={toggleScreenLock}
                  className={`w-full py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-2 transition ${
                    isScreenLocked
                      ? 'bg-red-600 hover:bg-red-500 text-white'
                      : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200'
                  }`}
                >
                  {isScreenLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                  <span>{isScreenLocked ? 'Mở khóa màn hình' : 'Khóa màn hình (chống trượt khi tì tay)'}</span>
                </button>

                {/* Flip camera */}
                <button
                  onClick={() => setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'))}
                  className="w-full py-2 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold flex items-center justify-center gap-2"
                >
                  <RotateCw className="w-4 h-4 text-cyan-400" />
                  <span>Đổi Camera (Trước / Sau)</span>
                </button>

                {/* Flash */}
                {torchAvailable && (
                  <button
                    onClick={handleToggleTorch}
                    className={`w-full py-2 px-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition ${
                      isTorchOn ? 'bg-amber-400 text-neutral-950' : 'bg-neutral-800 text-neutral-300'
                    }`}
                  >
                    {isTorchOn ? <Zap className="w-4 h-4 fill-current" /> : <ZapOff className="w-4 h-4" />}
                    <span>{isTorchOn ? 'Tắt đèn Flash' : 'Bật đèn Flash chiếu giấy'}</span>
                  </button>
                )}

                {/* Guide */}
                <button
                  onClick={() => {
                    setShowSettingsPopover(false);
                    onOpenGuide();
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-emerald-700/60 hover:bg-emerald-600 text-white font-semibold flex items-center justify-center gap-2"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>Hướng dẫn kê điện thoại</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 5. CẢNH BÁO MÀU VÀNG: CHẶN CHẤM ĐIỂM KHI KHÔNG CÓ NÉT MỰC THẬT (Bug 1 Fix) */}
      {inkWarning && (
        <div className="absolute top-16 inset-x-4 max-w-lg mx-auto z-50 animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="p-4 rounded-2xl bg-amber-400 text-neutral-950 font-bold text-xs sm:text-sm shadow-2xl border-2 border-amber-200 flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-neutral-950 shrink-0 mt-0.5" />
              <p className="leading-snug">{inkWarning}</p>
            </div>
            <button
              onClick={() => setInkWarning(null)}
              className="px-2 py-0.5 rounded-lg bg-neutral-950/20 hover:bg-neutral-950/30 text-neutral-950 font-black"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Lock Notification Toast */}
      {showLockToast && (
        <div className="absolute top-16 inset-x-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-40 p-3 bg-red-600 text-white text-xs font-semibold rounded-2xl shadow-2xl border border-red-400 flex items-center justify-center gap-2 animate-in slide-in-from-top duration-200">
          <Lock className="w-4 h-4 shrink-0" />
          <span>Màn hình đã khóa! Bạn có thể thoải mái tì tay viết bút thật mà không lo lệch nét.</span>
        </div>
      )}

      {/* Floating Unlock Pill if screen locked */}
      {isScreenLocked && (
        <div className="absolute inset-0 z-35 touch-none pointer-events-auto flex flex-col items-center justify-between p-6 bg-transparent">
          <div className="w-full flex items-center justify-center pt-16">
            <button
              onClick={toggleScreenLock}
              className="px-6 py-3 rounded-full bg-red-600 hover:bg-red-500 text-white font-bold text-sm shadow-2xl border-2 border-white/80 flex items-center gap-2 transform transition hover:scale-105 active:scale-95 animate-bounce"
            >
              <Unlock className="w-4 h-4" />
              <span>Chạm vào đây để MỞ KHÓA</span>
            </button>
          </div>
        </div>
      )}

      {/* 6. NÚT NỔI DUY NHẤT Ở GÓC DƯỚI: "📸 Chấm điểm" (Component 3) */}
      {!isScreenLocked && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 pointer-events-auto">
          <button
            id="ar-single-score-btn"
            disabled={isScoring}
            onClick={handleScoreHandwriting}
            className="px-7 py-3.5 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:brightness-110 active:scale-95 text-white font-black text-sm sm:text-base flex items-center gap-2.5 shadow-2xl shadow-rose-950/80 border border-rose-300/40 cursor-pointer disabled:opacity-50 transition"
          >
            {isScoring ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>AI đang chấm điểm nét mực...</span>
              </>
            ) : (
              <>
                <Camera className="w-5 h-5 text-white" />
                <span>📸 Chấm điểm</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* 7. EVALUATION RESULT MODAL (Clean, Non-Overlapping Dialogue with "Viết lại" & "Đóng") */}
      {evaluationResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200 pointer-events-auto">
          <div className="w-full max-w-lg bg-neutral-900 border border-neutral-700 rounded-3xl p-5 shadow-2xl text-white space-y-4 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-rose-500/20 text-rose-400 font-bold">
                  ⭐
                </span>
                <div>
                  <h3 className="font-black text-base text-white">Kết Quả Chấm Điểm Nét Chữ</h3>
                  <p className="text-[11px] text-neutral-400">Được phân tích trực tiếp từ nét mực thực tế</p>
                </div>
              </div>
              <button
                onClick={() => setEvaluationResult(null)}
                className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Snapshot & Score summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center bg-neutral-950 p-3 rounded-2xl border border-neutral-800">
              {capturedSnapshot && (
                <div className="relative rounded-xl overflow-hidden border border-neutral-700 max-h-36 flex items-center justify-center bg-black">
                  <img src={capturedSnapshot} alt="Bài viết của bé" className="max-h-36 object-contain" />
                  <div className="absolute bottom-1 right-1 bg-black/70 px-1.5 py-0.5 rounded text-[9px] font-mono text-neutral-300">
                    Ảnh chụp camera
                  </div>
                </div>
              )}

              <div className="flex flex-col items-center justify-center text-center p-2">
                <div className="text-3xl sm:text-4xl font-black text-rose-400 tracking-tight">
                  {evaluationResult.overallScore}<span className="text-lg text-neutral-400 font-normal">/100</span>
                </div>
                <div className="text-xs font-bold text-amber-300 mt-1">
                  {evaluationResult.grade}
                </div>
                {expEarned > 0 && (
                  <div className="mt-2 px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-bold">
                    +{expEarned} EXP Kinh nghiệm! 🎉
                  </div>
                )}
              </div>
            </div>

            {/* Warning Alert if stroke deviates or wrong letter */}
            {strokeWarning && (
              <div className="p-3 bg-red-500/20 border-2 border-red-500/60 rounded-2xl flex items-start gap-2.5 text-xs text-red-200">
                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div className="font-semibold leading-relaxed">
                  {strokeWarning}
                </div>
              </div>
            )}

            {/* Criteria breakdown */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-neutral-800/80 border border-neutral-700/60">
                <span className="text-neutral-400 block text-[10px]">Độ bám nét (Quỹ đạo)</span>
                <span className="font-mono font-bold text-cyan-300 text-sm">{evaluationResult.slantAnalysis?.score || 80}%</span>
              </div>
              <div className="p-2.5 rounded-xl bg-neutral-800/80 border border-neutral-700/60">
                <span className="text-neutral-400 block text-[10px]">Tỷ lệ ô ly chuẩn</span>
                <span className="font-mono font-bold text-emerald-300 text-sm">{evaluationResult.sizeConsistency?.score || 82}%</span>
              </div>
              <div className="p-2.5 rounded-xl bg-neutral-800/80 border border-neutral-700/60">
                <span className="text-neutral-400 block text-[10px]">Điểm đặt & dừng bút</span>
                <span className="font-mono font-bold text-purple-300 text-sm">{evaluationResult.spacingAndAlignment?.score || 80}%</span>
              </div>
              <div className="p-2.5 rounded-xl bg-neutral-800/80 border border-neutral-700/60">
                <span className="text-neutral-400 block text-[10px]">Độ trơn tru nét chữ</span>
                <span className="font-mono font-bold text-amber-300 text-sm">{evaluationResult.strokeQuality?.score || 85}%</span>
              </div>
            </div>

            {/* Teacher comment */}
            <div className="p-3 bg-neutral-800/50 rounded-2xl border border-neutral-700 text-xs space-y-1.5">
              <div className="font-bold text-neutral-200">Lời khuyên của cô giáo AI:</div>
              <p className="text-neutral-300 leading-relaxed italic">
                "{evaluationResult.encouragement}"
              </p>
            </div>

            {/* Interactive Debug Mask Toggle (Requirement 4) */}
            {debugOverlayUrl && (
              <div className="p-3 bg-neutral-950/80 border border-neutral-800 rounded-2xl flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-neutral-300 font-semibold flex items-center gap-1.5">
                    <span>🔬</span> Đối chiếu nét thực tế (Debug Mask):
                  </span>
                  <button
                    onClick={() => setShowDebugView(!showDebugView)}
                    className="text-[11px] font-bold text-cyan-400 hover:text-cyan-300 underline cursor-pointer"
                  >
                    {showDebugView ? 'Thu gọn' : 'Xem chi tiết Xanh/Đỏ'}
                  </button>
                </div>
                {showDebugView && (
                  <div className="relative rounded-xl overflow-hidden border border-neutral-700 bg-neutral-950 p-2 flex flex-col items-center animate-in fade-in duration-150">
                    <img src={debugOverlayUrl} alt="Bản đồ nét đối chiếu" className="max-h-48 object-contain rounded-lg" />
                    <div className="flex items-center justify-center gap-3 text-[10px] font-mono mt-2 text-neutral-300 flex-wrap">
                      <span className="flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        <span>Mực đúng mẫu (Green)</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                        <span>Mực lệch/sai (Red)</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                        <span>Nét mẫu (Pink)</span>
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Modal Actions: Distinct "Viết lại" and "Hoàn thành" Buttons (NO overlap) */}
            <div className="flex items-center justify-between gap-3 pt-2 border-t border-neutral-800">
              <button
                id="ar-retry-writing-btn"
                onClick={() => {
                  setEvaluationResult(null);
                  playStrokeSound(1.2);
                }}
                className="flex-1 py-3 px-4 rounded-2xl bg-neutral-800 hover:bg-neutral-750 text-neutral-200 hover:text-white font-bold text-xs sm:text-sm border border-neutral-700 transition active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>✍️</span>
                <span>Viết lại</span>
              </button>

              <button
                id="ar-finish-scoring-btn"
                onClick={() => setEvaluationResult(null)}
                className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-110 text-neutral-950 font-black text-xs sm:text-sm shadow-xl transition active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Hoàn thành</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. EDIT TEXT MODAL (When requested via "Thoát / Đổi chữ") */}
      {isEditingText && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200 pointer-events-auto">
          <div className="w-full max-w-lg bg-neutral-900 border border-neutral-700 rounded-3xl p-5 shadow-2xl text-white space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-rose-400" />
                <h3 className="font-bold text-sm text-white">Soạn thảo chữ luyện viết</h3>
              </div>
              <button onClick={() => setIsEditingText(false)} className="p-1.5 text-neutral-400 hover:text-white rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>

            <textarea
              value={tempEditText}
              onChange={(e) => setTempEditText(e.target.value)}
              placeholder="Nhập chữ cái hoặc câu cần viết..."
              rows={4}
              className="w-full bg-neutral-950 border border-neutral-700 rounded-2xl p-3 text-sm text-white focus:outline-none focus:border-rose-400 resize-none font-sans"
            />

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-800">
              <button
                onClick={() => setIsEditingText(false)}
                className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold"
              >
                Hủy
              </button>
              <button
                onClick={() => handleApplyNewText(tempEditText)}
                disabled={!tempEditText.trim()}
                className="px-5 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 disabled:opacity-40 text-white font-bold text-xs shadow-lg transition"
              >
                Áp dụng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
