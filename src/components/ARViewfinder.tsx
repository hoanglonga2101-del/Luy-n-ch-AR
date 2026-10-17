import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, 
  RotateCw, 
  RotateCcw,
  Lock, 
  Unlock, 
  Sliders, 
  Maximize2, 
  Minimize2, 
  Sun, 
  Palette, 
  Grid, 
  RefreshCw,
  Sparkles,
  HelpCircle,
  Play,
  Pause,
  Zap,
  ZapOff,
  ChevronLeft,
  ChevronRight,
  Eye,
  Layers,
  Check,
  Move,
  Type,
  Edit3,
  ArrowUp,
  ArrowDown,
  Plus,
  Minus,
  AlignLeft,
  AlignCenter,
  X,
  FileText,
  ZoomIn,
  ZoomOut,
  Smartphone,
  Laptop,
  PanelLeftClose,
  PanelLeft,
  PanelRightClose,
  PanelRight,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { GridType, ProjectionStyle, StrokePath, DeviceMode } from '../types';
import { getStrokesForCharacter } from '../data/strokeData';
import { playStrokeSound } from '../utils/audio';
import { 
  GOOGLE_15_ENGLISH_FONTS,
  ENGLISH_PRIORITY_FONTS, 
  OTHER_LANGUAGE_FONTS, 
  ALL_FONTS, 
  getFontOptionById, 
  getDefaultFontForLanguage,
  FontOption 
} from '../data/fontOptions';
import { FontSelector } from './FontSelector';
import { VisualZoomControls, TEXT_COLOR_PRESETS } from './VisualZoomControls';
import { ARControlTabs } from './ARControlTabs';
import { ValidationMatrixModal } from './ValidationMatrixModal';
import { 
  PaperPlaneStabilizer, 
  getPerspectiveTransform, 
  homographyToCSSMatrix3D, 
  PenTipKalmanFilter,
  PaperCorners,
  Point2D 
} from '../utils/cvEngine';
import { 
  RealtimeStrokeDeviationDetector, 
  DeviationFeedback, 
  DeviationStatus 
} from '../utils/realtimeDeviationDetector';
import {
  startCamera as startCameraManager,
  stopCurrentStream,
  parseCameraError,
  openAppInNewTab,
} from '../utils/cameraManager';
import { HandwritingAssessmentModal } from './HandwritingAssessmentModal';
import { 
  evaluatePostWritingSession, 
  PostWritingAssessmentResult 
} from '../utils/handwritingEvaluator';
import { 
  RealtimeStrokeOrderTracker, 
  detectBlankPaper, 
  evaluateComprehensiveWriting, 
  playAssessmentAudio,
  ComprehensiveAssessmentScore
} from '../utils/opticalStrokeOrderTracker';
import { awardExp } from '../utils/gamification';

export const NEON_COLOR_PRESETS = [
  { id: 'neon_pink', label: 'Đỏ Neon', hex: '#FF0055', desc: 'Rực rỡ trên nền giấy trắng' },
  { id: 'neon_green', label: 'Xanh Lá Neon', hex: '#00FF66', desc: 'Tương phản cao với bút xanh/đen' },
  { id: 'neon_blue', label: 'Xanh Dương', hex: '#0099FF', desc: 'Dịu mắt, tương phản tốt với bút đỏ' },
  { id: 'solid_black', label: 'Đen chuẩn', hex: '#000000', desc: 'Mực đen truyền thống' },
  { id: 'bright_yellow', label: 'Vàng Bright', hex: '#FFCC00', desc: 'Sáng rõ trong điều kiện thiếu sáng' },
];

const QUICK_TEMPLATES = [
  {
    label: 'Ca dao 2 câu (Lục bát)',
    text: 'Công cha như núi Thái Sơn\nNghĩa mẹ như nước trong nguồn chảy ra'
  },
  {
    label: 'Thơ lục bát 4 câu',
    text: 'Trâu ơi ta bảo trâu này\nTrâu ra ngoài ruộng trâu cày với ta\nCấy cày vốn nghiệp nông gia\nTa đây trâu đấy ai mà quản công'
  },
  {
    label: 'Châm ngôn rèn chữ',
    text: 'Nét chữ nết người\nRèn đức luyện tài'
  },
  {
    label: 'Tiếng Anh 3 dòng',
    text: 'Practice makes perfect\nEvery single day\nNever stop learning'
  },
  {
    label: 'Thơ Đường 4 câu',
    text: '白日依山尽\n黄河入海流\n欲穷千里目\n更上一层楼'
  },
  {
    label: 'Haiku Nhật 3 câu',
    text: '古池や\n蛙飛び込む\n水の音'
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
  // Device Mode State: 'mobile' (phone) vs 'desktop' (computer/laptop)
  const [deviceMode, setDeviceMode] = useState<DeviceMode>(() => {
    if (initialDeviceMode) return initialDeviceMode;
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768 || 'ontouchstart' in window ? 'mobile' : 'desktop';
    }
    return 'mobile';
  });

  // Desktop Sidebars collapsed states
  const [desktopLeftOpen, setDesktopLeftOpen] = useState<boolean>(true);
  const [desktopRightOpen, setDesktopRightOpen] = useState<boolean>(true);

  // Sync with prop if provided
  useEffect(() => {
    if (initialDeviceMode) {
      setDeviceMode(initialDeviceMode);
    }
  }, [initialDeviceMode]);

  // 1. Text & Multi-Line Management
  const [currentText, setCurrentText] = useState<string>(text);
  const [isEditingText, setIsEditingText] = useState<boolean>(false);
  const [tempEditText, setTempEditText] = useState<string>(text);

  useEffect(() => {
    setCurrentText(text);
    setTempEditText(text);
  }, [text]);

  const textLines: string[] = currentText.split('\n');
  const isMultiLine = textLines.length > 1;

  // Typography & Layout Controls
  const [fontSizePx, setFontSizePx] = useState<number>(isMultiLine ? 36 : 56);
  const [lineSpacingPx, setLineSpacingPx] = useState<number>(36);
  const [lineHeightRatio, setLineHeightRatio] = useState<number>(language === 'vi' ? 1.8 : 1.6);
  const [scrollOffsetY, setScrollOffsetY] = useState<number>(0);
  const [focusedLineIndex, setFocusedLineIndex] = useState<number>(0);
  const [focusLineMode, setFocusLineMode] = useState<boolean>(false);
  const [textAlign, setTextAlign] = useState<'center' | 'left'>('center');

  // Font Selection & Tracing Clarity State
  const [selectedFontId, setSelectedFontId] = useState<string>(fontId || getDefaultFontForLanguage(language));
  const [crispOutline, setCrispOutline] = useState<boolean>(true);
  const [letterSpacingEm, setLetterSpacingEm] = useState<number>(language === 'en' ? 0.05 : 0.03);
  const [boldTracing, setBoldTracing] = useState<boolean>(false);

  useEffect(() => {
    if (fontId) {
      setSelectedFontId(fontId);
    } else {
      setSelectedFontId(getDefaultFontForLanguage(language));
    }
  }, [fontId, language]);

  const currentFontOption = getFontOptionById(selectedFontId);

  // 2. Camera & Video Stream State
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isAutoplayBlocked, setIsAutoplayBlocked] = useState<boolean>(false);
  const [isRequestingPermission, setIsRequestingPermission] = useState<boolean>(false);
  const [isIframeBlocked, setIsIframeBlocked] = useState<boolean>(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [isSimulatedPaper, setIsSimulatedPaper] = useState<boolean>(false);

  const handleDeviceModeChange = (newMode: DeviceMode) => {
    setDeviceMode(newMode);
    if (onSelectDeviceMode) {
      onSelectDeviceMode(newMode);
    }
    // Auto switch camera facing: environment for mobile (rear camera facing paper), user for desktop (webcam)
    if (newMode === 'mobile') {
      setFacingMode('environment');
    } else {
      setFacingMode('user');
    }
  };
  const [torchAvailable, setTorchAvailable] = useState<boolean>(false);
  const [isTorchOn, setIsTorchOn] = useState<boolean>(false);
  const [torchNotice, setTorchNotice] = useState<string | null>(null);

  // 3. AR Projection Transform, Visual & Zoom Controls
  const [opacity, setOpacity] = useState<number>(0.4); // 10% to 100%, default 40% (0.4)
  const [textColor, setTextColor] = useState<string>('#FF0055'); // Default: Đỏ Neon (#FF0055)
  const [zoomLevel, setZoomLevel] = useState<number>(1.0); // 1.0x to 5.0x
  const [zoomCapabilities, setZoomCapabilities] = useState<{ min: number; max: number; step: number } | null>(null);
  const [isHardwareZoomSupported, setIsHardwareZoomSupported] = useState<boolean>(false);
  const [isHardwareZoomActive, setIsHardwareZoomActive] = useState<boolean>(false);
  const [scale, setScale] = useState<number>(1.1);
  const [rotation, setRotation] = useState<number>(0);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number; startPos: { x: number; y: number } }>({
    x: 0,
    y: 0,
    startPos: { x: 0, y: 0 }
  });
  const rafRef = useRef<number | null>(null);
  const pendingPosRef = useRef<{ x: number; y: number } | null>(null);
  const [isSmooth60fps, setIsSmooth60fps] = useState<boolean>(true);
  const [showNudgePad, setShowNudgePad] = useState<boolean>(false);

  // Micro-adjustment Nudge handler for phones
  const handleNudge = (dx: number, dy: number) => {
    setPosition((prev) => ({
      x: prev.x + dx,
      y: prev.y + dy,
    }));
    playStrokeSound(1.2);
  };

  // 4. Physical Experience: Screen Lock / Freeze Mode
  const [isScreenLocked, setIsScreenLocked] = useState<boolean>(false);
  const [showLockToast, setShowLockToast] = useState<boolean>(false);

  // 5. Visual Calibration: Grid, Style & Paper Plane Calibration
  const [gridType, setGridType] = useState<GridType>(
    language === 'vi' ? 'oly_vi' : language === 'en' ? 'four_line_en' : 'tian_zh'
  );
  const [gridOpacity, setGridOpacity] = useState<number>(0.5);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [projectionStyle, setProjectionStyle] = useState<ProjectionStyle>('neon_ar');
  const [showPlaneCalibration, setShowPlaneCalibration] = useState<boolean>(true);
  const [antiJitterStabilization, setAntiJitterStabilization] = useState<boolean>(true);
  const [isValidationModalOpen, setIsValidationModalOpen] = useState<boolean>(false);
  const [penTip, setPenTip] = useState<{ x: number; y: number; isOccluded: boolean; isExtrapolated: boolean } | null>(null);
  const kalmanRef = useRef(new PenTipKalmanFilter());
  const stabilizerRef = useRef(new PaperPlaneStabilizer(0.25));
  const [paperCorners, setPaperCorners] = useState<PaperCorners>({
    topLeft: { x: 0.1, y: 0.1 },
    topRight: { x: 0.9, y: 0.1 },
    bottomRight: { x: 0.9, y: 0.9 },
    bottomLeft: { x: 0.1, y: 0.9 },
  });

  // 5.1 Real-time Stroke Deviation Detection & Alert Engine (Point-to-Path Validation)
  const deviationDetectorRef = useRef(new RealtimeStrokeDeviationDetector({
    safeRadius: 16,
    consecutiveFramesThreshold: 3,
    maxOcclusionDurationMs: 300,
    enableAudioAlert: true,
  }));
  const [realtimeFeedback, setRealtimeFeedback] = useState<DeviationFeedback>(() => 
    deviationDetectorRef.current.processFrame(null)
  );
  const [livePenPoint, setLivePenPoint] = useState<Point2D | null>(null);
  const [showLiveDeviationHUD, setShowLiveDeviationHUD] = useState<boolean>(true);
  const isUserTouchingRef = useRef<boolean>(false);
  const [isAudioBuzzerEnabled, setIsAudioBuzzerEnabled] = useState<boolean>(true);
  const [showJudgeTestbench, setShowJudgeTestbench] = useState<boolean>(true);
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Sync audio buzzer setting with detector engine
  useEffect(() => {
    if (deviationDetectorRef.current) {
      (deviationDetectorRef.current as any).config.enableAudioAlert = isAudioBuzzerEnabled;
    }
  }, [isAudioBuzzerEnabled]);

  // On mobile phones, start with collapsed controls so the camera & real paper are immediately visible without lag
  const [showControls, setShowControls] = useState<boolean>(false);

  // 6. Step-by-Step Stroke Guidance
  const characters: string[] = Array.from(currentText.replace(/\s+/g, ' '));
  const [selectedCharIndex, setSelectedCharIndex] = useState<number>(0);
  const activeChar: string = characters[selectedCharIndex] || characters[0] || 'A';
  const charStrokes: StrokePath[] = getStrokesForCharacter(activeChar);
  const isSingleCharWithStrokes = textLines.length === 1 && currentText.trim().length === 1 && charStrokes.length > 0;

  const [activeTab, setActiveTab] = useState<'text_layout' | 'font_selector' | 'visual_zoom' | 'step_stroke' | 'opacity_size' | 'grid_style'>(
    isSingleCharWithStrokes ? 'step_stroke' : 'text_layout'
  );
  const [desktopLeftTab, setDesktopLeftTab] = useState<'text_layout' | 'font_selector'>('text_layout');
  const [desktopRightTab, setDesktopRightTab] = useState<'opacity_size' | 'grid_style' | 'step_stroke'>('opacity_size');

  // Stroke Step Mode: 1 to charStrokes.length, or 0 (All strokes view)
  const [strokeMode, setStrokeMode] = useState<'step' | 'full'>('step');
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);
  const [stepDuration, setStepDuration] = useState<number>(1200); // ms per stroke step
  const [showFutureOutline, setShowFutureOutline] = useState<boolean>(true);

  // 9. Post-Writing Assessment & Completion Grading State
  const [assessmentResult, setAssessmentResult] = useState<ComprehensiveAssessmentScore | PostWritingAssessmentResult | null>(null);
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState<boolean>(false);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [blankWarningNotice, setBlankWarningNotice] = useState<string | null>(null);

  // Real-time Optical Stroke Order Tracker (chạy liên tục qua camera)
  const strokeOrderTrackerRef = useRef(new RealtimeStrokeOrderTracker(activeChar));

  // Đồng bộ ký tự đang luyện tập với bộ theo dõi thứ tự nét
  useEffect(() => {
    if (strokeOrderTrackerRef.current) {
      strokeOrderTrackerRef.current.setCharacter(activeChar);
    }
  }, [activeChar]);

  // Xử lý khi người dùng bấm nút: "📸 Đã viết xong - Chấm điểm" (#btn-capture-grade / #btn-finish-check)
  const handleFinishAndCheck = () => {
    setIsEvaluating(true);
    setBlankWarningNotice(null);

    try {
      // 1. KIỂM TRA PHÁT HIỆN TRANG GIẤY TRẮNG (BLANK DETECTION)
      // Nếu mật độ mực trên giấy < 1%, lập tức hủy chấm điểm và hiện cảnh báo màu vàng
      const blankCheck = detectBlankPaper(videoRef.current);
      if (blankCheck.isBlank && !isSimulatedPaper) {
        setBlankWarningNotice(blankCheck.message);
        playStrokeSound(0.9);
        setTimeout(() => setBlankWarningNotice(null), 5000);
        setIsEvaluating(false);
        return;
      }

      // 2. Chụp ảnh snapshot minh chứng từ camera
      let snapshotUrl = '';
      if (videoRef.current) {
        const off = document.createElement('canvas');
        off.width = 640;
        off.height = Math.round((640 * (videoRef.current.videoHeight || 480)) / (videoRef.current.videoWidth || 640));
        const ctx = off.getContext('2d');
        if (ctx) {
          ctx.drawImage(videoRef.current, 0, 0, off.width, off.height);
          snapshotUrl = off.toDataURL('image/jpeg', 0.85);
        }
      }

      // 3. ĐỐI CHIẾU & CHẤM ĐIỂM TỔNG HỢP (HÌNH DÁNG + THỨ TỰ NÉT)
      const result = evaluateComprehensiveWriting({
        character: activeChar,
        sourceElement: videoRef.current,
        strokeOrderTracker: strokeOrderTrackerRef.current,
        userPoints: livePenPoint ? [livePenPoint] : [],
        snapshotUrl,
      });

      setAssessmentResult(result);
      setIsAssessmentModalOpen(true);

      // 4. PHÁT ÂM THANH THEO KẾT QUẢ ĐÁNH GIÁ (Web Audio API synth)
      playAssessmentAudio(result.isPass);

      // 5. Thưởng EXP nếu làm bài tốt
      if (result.isPass) {
        awardExp(15, `Xuất sắc! Viết đúng thứ tự nét chữ '${activeChar}' đạt ${result.overall_score} điểm`);
      } else if (result.overall_score >= 60) {
        awardExp(8, `Hoàn thành bài luyện chữ '${activeChar}'`);
      } else {
        awardExp(3, `Nỗ lực rèn chữ '${activeChar}'`);
      }
    } catch (err) {
      console.error('Lỗi khi chấm điểm bài viết:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  // Nút phụ: "🔄 Viết lại nét này"
  const handleRetryCurrentLetter = () => {
    setIsAssessmentModalOpen(false);
    setCurrentStep(1);
    setAssessmentResult(null);
    setBlankWarningNotice(null);
    strokeOrderTrackerRef.current.reset();
    playStrokeSound(1.1);
  };

  // Nút chuyển sang bài tiếp theo từ Modal
  const handleNextLetter = () => {
    setIsAssessmentModalOpen(false);
    setAssessmentResult(null);
    setBlankWarningNotice(null);
    setCurrentStep(1);
    strokeOrderTrackerRef.current.reset();

    const VIETNAMESE_ALPHABET = ['a', 'ă', 'â', 'b', 'c', 'd', 'đ', 'e', 'ê', 'g', 'h', 'i', 'k', 'l', 'm', 'n', 'o', 'ô', 'ơ', 'p', 'q', 'r', 's', 't', 'u', 'ư', 'v', 'x', 'y'];
    const cur = activeChar.toLowerCase();
    const idx = VIETNAMESE_ALPHABET.indexOf(cur);
    if (idx !== -1 && idx < VIETNAMESE_ALPHABET.length - 1) {
      setCurrentText(VIETNAMESE_ALPHABET[idx + 1]);
    } else if (idx === VIETNAMESE_ALPHABET.length - 1) {
      setCurrentText(VIETNAMESE_ALPHABET[0]);
    } else {
      setCurrentText('Công cha như núi Thái Sơn');
    }
    playStrokeSound(1.3);
  };

  // Universal Controls open/collapsed state
  const isControlsOpen = deviceMode === 'desktop'
    ? (desktopLeftOpen || desktopRightOpen)
    : showControls;

  const handleToggleUniversalControls = () => {
    if (deviceMode === 'desktop') {
      const willOpen = !(desktopLeftOpen || desktopRightOpen);
      setDesktopLeftOpen(willOpen);
      setDesktopRightOpen(willOpen);
    } else {
      setShowControls((prev) => !prev);
    }
  };

  // User gesture button click to grant camera or bypass iOS Safari autoplay restrictions
  const handleUserGrantCamera = async () => {
    setIsRequestingPermission(true);
    setCameraError(null);
    setIsAutoplayBlocked(false);
    setIsSimulatedPaper(false);

    try {
      if (!videoRef.current) {
        throw new Error('Thẻ video chưa sẵn sàng trong DOM.');
      }

      const res = await startCameraManager(videoRef.current, { facingMode });
      if (res.success && res.stream) {
        setStream(res.stream);
        setIsAutoplayBlocked(res.isAutoplayBlocked);
        setIsIframeBlocked(false);
        setCameraError(null);

        // Check torch & zoom capabilities
        const videoTrack = res.stream.getVideoTracks()[0];
        if (videoTrack && typeof videoTrack.getCapabilities === 'function') {
          const capabilities = videoTrack.getCapabilities() as any;
          setTorchAvailable(Boolean(capabilities?.torch));
          if (capabilities?.zoom) {
            setIsHardwareZoomSupported(true);
            setZoomCapabilities({
              min: capabilities.zoom.min || 1,
              max: capabilities.zoom.max || 5,
              step: capabilities.zoom.step || 0.1,
            });
          }
        }
      } else if (res.error) {
        setCameraError(res.error.userGuide);
        setIsIframeBlocked(res.error.isIframeBlocked);
        setIsAutoplayBlocked(false);
      }
    } catch (err: any) {
      const parsed = parseCameraError(err);
      setCameraError(parsed.userGuide);
      setIsIframeBlocked(parsed.isIframeBlocked);
    } finally {
      setIsRequestingPermission(false);
    }
  };

  // Initialize camera stream on mount or facingMode change
  useEffect(() => {
    let isCancelled = false;

    async function launchCamera() {
      if (isSimulatedPaper) return;
      if (!videoRef.current) return;

      setCameraError(null);
      setIsTorchOn(false);
      setIsAutoplayBlocked(false);

      const res = await startCameraManager(videoRef.current, { facingMode });
      if (isCancelled) {
        if (res.stream) stopCurrentStream(res.stream);
        return;
      }

      if (res.success && res.stream) {
        setStream(res.stream);
        setIsAutoplayBlocked(res.isAutoplayBlocked);
        setIsIframeBlocked(false);

        // Check torch & zoom capabilities
        const videoTrack = res.stream.getVideoTracks()[0];
        if (videoTrack && typeof videoTrack.getCapabilities === 'function') {
          const capabilities = videoTrack.getCapabilities() as any;
          setTorchAvailable(Boolean(capabilities?.torch));
          if (capabilities?.zoom) {
            setIsHardwareZoomSupported(true);
            setZoomCapabilities({
              min: capabilities.zoom.min || 1,
              max: capabilities.zoom.max || 5,
              step: capabilities.zoom.step || 0.1,
            });
          } else {
            setIsHardwareZoomSupported(false);
            setZoomCapabilities(null);
          }
        }
      } else if (res.error) {
        console.warn('Camera error during initial start:', res.error);
        setCameraError(res.error.userGuide);
        setIsIframeBlocked(res.error.isIframeBlocked);
        // Nếu bị chặn quyền trong iframe, kích hoạt giấy mô phỏng để người học vẫn xem trước bài luyện
        if (res.error.isIframeBlocked) {
          setIsSimulatedPaper(true);
        }
      }
    }

    launchCamera();

    return () => {
      isCancelled = true;
      stopCurrentStream();
    };
  }, [facingMode]);

  // Real-time Optical Camera Pen-Tip Tracking Loop (Frame-by-Frame CV)
  useEffect(() => {
    if (!stream || isSimulatedPaper) return;
    let isCancelled = false;
    let animId: number;

    if (!offscreenCanvasRef.current && typeof document !== 'undefined') {
      const cvs = document.createElement('canvas');
      cvs.width = 160;
      cvs.height = 120;
      offscreenCanvasRef.current = cvs;
    }
    const offscreen = offscreenCanvasRef.current;
    const ctx = offscreen?.getContext('2d', { willReadFrequently: true });

    let frameCount = 0;
    const processCameraVideoFrame = () => {
      if (isCancelled) return;
      frameCount++;
      const video = videoRef.current;

      // Sample every 2nd frame (~30fps) for fast real-time response without CPU lag
      if (video && video.readyState >= 2 && ctx && !isDragging && frameCount % 2 === 0) {
        ctx.drawImage(video, 0, 0, 160, 120);
        try {
          const imgData = ctx.getImageData(0, 0, 160, 120);
          const data = imgData.data;

          let minLum = 255;
          let bestX = -1;
          let bestY = -1;

          for (let y = 30; y < 100; y += 3) {
            for (let x = 32; x < 128; x += 3) {
              const idx = (y * 160 + x) * 4;
              const r = data[idx];
              const g = data[idx + 1];
              const b = data[idx + 2];
              const lum = 0.299 * r + 0.587 * g + 0.114 * b;
              if (lum < minLum && lum < 70) {
                minLum = lum;
                bestX = x;
                bestY = y;
              }
            }
          }

          if (bestX > 0 && bestY > 0 && minLum < 65) {
            const normX = ((bestX - 32) / 96) * 100;
            const normY = ((bestY - 30) / 70) * 100;
            const smoothed = kalmanRef.current.update(normX, normY);

            if (!isUserTouchingRef.current) {
              const pt = { x: Math.round(smoothed.x), y: Math.round(smoothed.y) };
              setLivePenPoint(pt);
              strokeOrderTrackerRef.current.updatePoint(pt); // Theo dõi thứ tự nét thời gian thực
              const fb = deviationDetectorRef.current.processFrame(pt, false);
              setRealtimeFeedback({ ...fb });
            }
          } else {
            if (!isUserTouchingRef.current) {
              const occl = kalmanRef.current.handleOcclusion();
              if (occl.isExtrapolated) {
                const fb = deviationDetectorRef.current.processFrame(occl.point, true);
                setRealtimeFeedback({ ...fb });
              } else {
                const fb = deviationDetectorRef.current.processFrame(null, false);
                setRealtimeFeedback({ ...fb });
              }
            }
          }
        } catch {
          // safe fallback
        }
      }

      animId = requestAnimationFrame(processCameraVideoFrame);
    };

    animId = requestAnimationFrame(processCameraVideoFrame);
    return () => {
      isCancelled = true;
      cancelAnimationFrame(animId);
    };
  }, [stream, isSimulatedPaper, isDragging]);

  // Camera Zoom Handler (Hardware MediaStreamTrack applyConstraints + Digital CSS Zoom Fallback)
  const handleZoomChange = async (newZoom: number) => {
    const clampedZoom = Math.min(5.0, Math.max(1.0, parseFloat(newZoom.toFixed(1))));
    setZoomLevel(clampedZoom);

    if (!stream) {
      setIsHardwareZoomActive(false);
      return;
    }
    const videoTrack = stream.getVideoTracks()[0];
    if (!videoTrack) {
      setIsHardwareZoomActive(false);
      return;
    }

    if (isHardwareZoomSupported && typeof (videoTrack as any).applyConstraints === 'function') {
      try {
        const minZ = zoomCapabilities?.min ?? 1;
        const maxZ = zoomCapabilities?.max ?? 5;
        const targetHardwareZoom = Math.min(maxZ, Math.max(minZ, clampedZoom));
        await (videoTrack as any).applyConstraints({
          advanced: [{ zoom: targetHardwareZoom }]
        });
        setIsHardwareZoomActive(true);
      } catch (err) {
        console.warn('Hardware zoom applyConstraints failed, falling back to CSS Digital Zoom:', err);
        setIsHardwareZoomActive(false);
      }
    } else {
      setIsHardwareZoomActive(false);
    }
  };

  // Flash / Torch Toggle Handler
  const handleToggleTorch = async () => {
    if (!stream) {
      setTorchNotice('Camera chưa sẵn sàng để bật đèn pin.');
      setTimeout(() => setTorchNotice(null), 3000);
      return;
    }

    const videoTrack = stream.getVideoTracks()[0];
    if (!videoTrack) return;

    try {
      const nextTorchState = !isTorchOn;
      await (videoTrack as any).applyConstraints({
        advanced: [{ torch: nextTorchState }]
      });
      setIsTorchOn(nextTorchState);
      setTorchNotice(nextTorchState ? 'Đã bật đèn Flash chiếu giấy' : 'Đã tắt đèn Flash');
      setTimeout(() => setTorchNotice(null), 2500);
    } catch (err) {
      console.warn('Torch constraint error:', err);
      setTorchNotice('Thiết bị này không hỗ trợ đèn Flash (thường chỉ có trên điện thoại di động).');
      setTimeout(() => setTorchNotice(null), 3500);
    }
  };

  // Toggle Full Screen Lock
  const toggleScreenLock = () => {
    const nextState = !isScreenLocked;
    setIsScreenLocked(nextState);
    if (nextState) {
      setShowControls(false);
      setShowLockToast(true);
      setTimeout(() => setShowLockToast(false), 3500);
    }
  };

  // Pointer drag events for aligning overlay onto real notebook paper
  const handlePointerDown = (e: React.PointerEvent) => {
    if (isScreenLocked) return;
    // Don't trigger drag when tapping buttons, inputs, or textareas
    if ((e.target as HTMLElement).closest('button, input, textarea, a')) return;

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (err) {
      // safe fallback
    }

    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      startPos: { ...position }
    };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || isScreenLocked) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    pendingPosRef.current = {
      x: Math.round(dragStartRef.current.startPos.x + dx),
      y: Math.round(dragStartRef.current.startPos.y + dy),
    };

    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(() => {
        if (pendingPosRef.current) {
          setPosition(pendingPosRef.current);
        }
        rafRef.current = null;
      });
    }
  };

  const handlePointerUp = (e?: React.PointerEvent) => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (pendingPosRef.current) {
      setPosition(pendingPosRef.current);
    }
    if (e) {
      try {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
          e.currentTarget.releasePointerCapture(e.pointerId);
        }
      } catch (err) {}
    }
    setIsDragging(false);
  };

  // Multi-line line navigation & scrolling
  const handleNextLine = () => {
    if (focusedLineIndex < textLines.length - 1) {
      const nextIdx = focusedLineIndex + 1;
      setFocusedLineIndex(nextIdx);
      // Smooth scroll offset matching font size + line spacing
      const estimatedStep = Math.round(fontSizePx * (lineHeightRatio - 0.5) + lineSpacingPx);
      setScrollOffsetY(nextIdx * estimatedStep);
      playStrokeSound(1.2);
    }
  };

  const handlePrevLine = () => {
    if (focusedLineIndex > 0) {
      const prevIdx = focusedLineIndex - 1;
      setFocusedLineIndex(prevIdx);
      const estimatedStep = Math.round(fontSizePx * (lineHeightRatio - 0.5) + lineSpacingPx);
      setScrollOffsetY(prevIdx * estimatedStep);
      playStrokeSound(0.9);
    }
  };

  const handleResetPanAndScroll = () => {
    setPosition({ x: 0, y: 0 });
    setScrollOffsetY(0);
    setFocusedLineIndex(0);
    setScale(1.1);
    setRotation(0);
  };

  const handleApplyText = () => {
    if (!tempEditText.trim()) return;
    setCurrentText(tempEditText.trim());
    setFocusedLineIndex(0);
    setScrollOffsetY(0);
    setIsEditingText(false);
  };

  // Auto-play timer for Step-by-Step Stroke Animation
  useEffect(() => {
    let timer: number | null = null;
    if (isAutoPlaying && strokeMode === 'step') {
      timer = window.setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= charStrokes.length) {
            setIsAutoPlaying(false);
            return charStrokes.length;
          }
          const next = prev + 1;
          playStrokeSound(next * 0.2 + 0.9);
          return next;
        });
      }, stepDuration);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isAutoPlaying, strokeMode, charStrokes.length, stepDuration]);

  // Reset alignment
  const handleResetPosition = () => {
    setPosition({ x: 0, y: 0 });
    setScale(1.1);
    setRotation(0);
    setOpacity(0.7);
    setScrollOffsetY(0);
    setFocusedLineIndex(0);
  };

  // Switch to next/previous stroke step
  const handleNextStep = () => {
    if (currentStep < charStrokes.length) {
      const next = currentStep + 1;
      setCurrentStep(next);
      playStrokeSound(next * 0.2 + 0.9);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      playStrokeSound(currentStep * 0.2 + 0.8);
    }
  };

  const handleRestartSteps = () => {
    setCurrentStep(1);
    playStrokeSound(1.0);
  };

  // Current active stroke metadata
  const activeStrokeInfo = charStrokes[currentStep - 1] || charStrokes[0];

  // Sync real-time stroke deviation detector with active stroke path
  useEffect(() => {
    if (activeStrokeInfo && activeStrokeInfo.d) {
      deviationDetectorRef.current.setActiveStroke(activeStrokeInfo.d);
    }
  }, [activeStrokeInfo?.d, currentStep]);

  // Pointer event handlers for real-time tracking on AR screen
  const handleSvgPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    handleSvgPointerMove(e);
  };

  const handleSvgPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const pt = { x, y };
    setLivePenPoint(pt);

    const fb = deviationDetectorRef.current.processFrame(pt, false);
    setRealtimeFeedback({ ...fb });
  };

  const handleSvgPointerUp = () => {
    const fb = deviationDetectorRef.current.processFrame(null, true);
    setRealtimeFeedback({ ...fb });
  };

  // Nút test sai lệch cố tình để Ban Giám Khảo nghiệm thu trực tiếp
  const handleSimulateJudgeTest = (testType: 'normal' | 'deviate_left' | 'deviate_right' | 'reverse' | 'occlude') => {
    if (!activeStrokeInfo) return;
    const start = activeStrokeInfo.startPoint;
    let targetPt: Point2D = { x: start.x, y: start.y };
    let isOccluded = false;

    if (testType === 'normal') {
      targetPt = { x: start.x + 2, y: start.y + 4 };
    } else if (testType === 'deviate_left') {
      targetPt = { x: Math.max(5, start.x - 24), y: start.y + 10 };
    } else if (testType === 'deviate_right') {
      targetPt = { x: Math.min(95, start.x + 26), y: start.y + 10 };
    } else if (testType === 'reverse') {
      targetPt = { x: start.x, y: start.y - 18 };
    } else if (testType === 'occlude') {
      isOccluded = true;
    }

    setLivePenPoint(targetPt);
    for (let f = 0; f < 3; f++) {
      deviationDetectorRef.current.processFrame(isOccluded ? null : targetPt, isOccluded);
    }
    const fb = deviationDetectorRef.current.processFrame(isOccluded ? null : targetPt, isOccluded);
    setRealtimeFeedback({ ...fb });

    if (testType === 'normal') {
      deviationDetectorRef.current.logStrokeValidation('CORRECT');
    } else if (testType !== 'occlude') {
      deviationDetectorRef.current.logStrokeValidation('INTENTIONAL_ERROR');
    }
  };

  // Font class for sentence/fallback text
  const getFontClass = () => {
    return currentFontOption.className || 'font-sans';
  };

  // Ink style definitions
  const getInkColors = () => {
    const isMobile = deviceMode === 'mobile';
    const enableGlow = !isSmooth60fps && !isMobile;
    switch (projectionStyle) {
      case 'neon_ar':
        return {
          current: '#ef4444', // Vibrant Red for current pen target
          completed: '#06b6d4', // Cyan neon for finished lines
          ghost: '#64748b', // Slate for remaining outline
          glow: enableGlow ? 'drop-shadow(0 0 8px rgba(6, 182, 212, 0.8))' : 'none',
          textClass: enableGlow ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]' : 'text-cyan-400 font-bold',
        };
      case 'red_guide':
        return {
          current: '#f59e0b', // Amber for current
          completed: '#dc2626', // Red ink for finished lines
          ghost: '#cbd5e1',
          glow: enableGlow ? 'drop-shadow(0 0 4px rgba(220, 38, 38, 0.5))' : 'none',
          textClass: enableGlow ? 'text-rose-600 drop-shadow-[0_0_4px_rgba(225,29,72,0.4)]' : 'text-rose-600 font-bold',
        };
      case 'solid_ink':
        return {
          current: '#ef4444',
          completed: '#0f172a', // Deep black ink
          ghost: '#94a3b8',
          glow: 'none',
          textClass: 'text-neutral-900',
        };
      case 'dotted_trace':
        return {
          current: '#ef4444',
          completed: '#2563eb', // Blue pen
          ghost: '#cbd5e1',
          glow: 'none',
          textClass: 'text-blue-600',
        };
      case 'blueprint':
        return {
          current: '#f43f5e',
          completed: '#38bdf8',
          ghost: '#475569',
          glow: enableGlow ? 'drop-shadow(0 0 6px rgba(56,189,248,0.7))' : 'none',
          textClass: enableGlow ? 'text-sky-300 drop-shadow-[0_0_6px_rgba(56,189,248,0.7)]' : 'text-sky-300 font-bold',
        };
      default:
        return {
          current: '#ef4444',
          completed: '#06b6d4',
          ghost: '#64748b',
          glow: 'none',
          textClass: 'text-cyan-400',
        };
    }
  };

  const ink = getInkColors();

  const arControlTabsProps = {
    selectedFontId,
    setSelectedFontId,
    playStrokeSound,
    language,
    crispOutline,
    setCrispOutline,
    letterSpacingEm,
    setLetterSpacingEm,
    boldTracing,
    setBoldTracing,
    fontSizePx,
    setFontSizePx,
    lineSpacingPx,
    setLineSpacingPx,
    setLineHeightRatio,
    scrollOffsetY,
    setScrollOffsetY,
    textLines,
    focusedLineIndex,
    handlePrevLine,
    handleNextLine,
    textAlign,
    setTextAlign,
    focusLineMode,
    setFocusLineMode,
    currentText,
    setTempEditText,
    setIsEditingText,
    strokeMode,
    setStrokeMode,
    charStrokes,
    currentStep,
    setCurrentStep,
    handleRestartSteps,
    handlePrevStep,
    handleNextStep,
    isAutoPlaying,
    setIsAutoPlaying,
    tips,
    opacity,
    setOpacity,
    textColor,
    setTextColor,
    zoomLevel,
    handleZoomChange,
    isHardwareZoomActive,
    scale,
    setScale,
    rotation,
    setRotation,
    position,
    handleResetPosition,
    showGrid,
    setShowGrid,
    gridType,
    setGridType,
    gridOpacity,
    setGridOpacity,
    projectionStyle,
    setProjectionStyle,
  };

  return (
    <div 
      className="relative w-full h-[100dvh] bg-black overflow-hidden flex flex-col select-none touch-none"
      style={{ height: '100dvh', maxHeight: '100dvh' }}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* iOS Safari / WebRTC Camera Permission & Autoplay Unlock Prompt */}
      {(isAutoplayBlocked || cameraError) && !isSimulatedPaper && (
        <div 
          id="ios-camera-permission-modal"
          className="absolute inset-0 z-[9999] flex flex-col items-center justify-center p-6 bg-black/85 backdrop-blur-md pointer-events-auto"
          style={{ zIndex: 9999 }}
        >
          <div className="w-full max-w-sm bg-neutral-900 border border-cyan-500/50 rounded-3xl p-6 sm:p-8 text-center shadow-2xl flex flex-col items-center gap-4 animate-in fade-in zoom-in-95 duration-200 pointer-events-auto">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-lg shadow-cyan-950">
              <Camera className="w-8 h-8 text-cyan-400 animate-pulse" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-white">
                {isAutoplayBlocked ? 'Chạm để kích hoạt Camera' : 'Cấp quyền truy cập Camera'}
              </h3>
              <p className="text-xs text-neutral-300 leading-relaxed">
                {isAutoplayBlocked 
                  ? 'Trình duyệt iOS Safari yêu cầu bạn chạm vào màn hình để bắt đầu luồng phát video camera.'
                  : cameraError || 'Vui lòng chạm nút bên dưới để cấp quyền mở camera sau và chiếu nét chữ lên giấy thật.'}
              </p>
            </div>

            {/* Large Touch Target Button - Min 56px height for effortless iOS Safari touch */}
            <button
              id="ios-grant-camera-btn"
              type="button"
              onClick={handleUserGrantCamera}
              disabled={isRequestingPermission}
              className="w-full min-h-[56px] px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 active:scale-95 text-white font-bold text-sm sm:text-base shadow-xl shadow-cyan-950/80 border border-cyan-300/40 flex items-center justify-center gap-2.5 transition cursor-pointer pointer-events-auto relative z-[9999]"
              style={{ zIndex: 9999 }}
            >
              <Camera className="w-5 h-5 text-white" />
              <span>
                {isRequestingPermission 
                  ? 'Đang kết nối camera...' 
                  : isAutoplayBlocked 
                    ? 'Chạm để kích hoạt Camera' 
                    : 'Chạm để cấp quyền mở Camera'}
              </span>
            </button>

            {/* Nút mở tab mới nếu phát hiện bị chặn sandbox trong iframe */}
            {isIframeBlocked && (
              <button
                type="button"
                onClick={openAppInNewTab}
                className="w-full py-2.5 px-4 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/40 text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer pointer-events-auto"
              >
                <Maximize2 className="w-4 h-4" />
                <span>Mở tab mới (Toàn màn hình)</span>
              </button>
            )}

            <div className="flex items-center justify-between w-full pt-2 border-t border-neutral-800 text-xs">
              <button
                type="button"
                onClick={() => {
                  setIsSimulatedPaper(true);
                  setIsAutoplayBlocked(false);
                  setCameraError(null);
                }}
                className="text-neutral-400 hover:text-white underline text-[11px] cursor-pointer pointer-events-auto"
              >
                Dùng mặt giấy mô phỏng
              </button>

              <button
                type="button"
                onClick={onBackToMenu}
                className="text-neutral-400 hover:text-white underline text-[11px] cursor-pointer pointer-events-auto"
              >
                Quay lại menu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 1. CAMERA FEED (Full Screen Background) - Luôn duy trì trong DOM để videoRef không bao giờ null */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`absolute inset-0 w-full h-full object-cover z-0 pointer-events-none origin-center ${
          isSimulatedPaper ? 'hidden' : 'block'
        }`}
        style={{
          transform: !isHardwareZoomActive && zoomLevel > 1 ? `scale(${zoomLevel})` : undefined,
          willChange: 'transform',
        }}
      />

      {/* Realistic Paper Fallback khi người dùng chọn xem trước trên giấy ảo */}
      {isSimulatedPaper && (
        <div 
          className="absolute inset-0 w-full h-full bg-[#f2ede4] z-0 flex items-center justify-center p-6 transition-transform duration-100 ease-out origin-center pointer-events-none"
          style={{
            transform: zoomLevel > 1 ? `scale(${zoomLevel})` : undefined,
          }}
        >
          <div className="w-full max-w-2xl h-[85%] bg-white shadow-2xl rounded-2xl border border-neutral-300 p-8 relative overflow-hidden flex flex-col justify-between pointer-events-auto">
            <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#64748b_1px,transparent_1px)] [background-size:20px_20px]" />
            <div className="text-xs text-neutral-500 font-mono flex items-center justify-between border-b pb-2 pointer-events-none">
              <span className="font-semibold">MÔ PHỎNG GIẤY TRẮNG TRÊN BÀN</span>
              <span className="text-amber-600 font-medium">Chế độ xem trước (Camera chưa kết nối)</span>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center text-neutral-400 text-sm font-medium gap-2">
              <p className="pointer-events-none text-center">Đặt điện thoại trên cốc/giá đỡ và bật camera sau để nhìn thấy giấy thật qua màn hình.</p>
              <button
                type="button"
                onClick={() => {
                  setIsSimulatedPaper(false);
                  handleUserGrantCamera();
                }}
                className="mt-2 min-h-[52px] px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 active:scale-95 text-white font-bold text-xs shadow-xl shadow-cyan-950/60 border border-cyan-400/40 flex items-center gap-2 cursor-pointer pointer-events-auto relative z-[9999]"
                style={{ zIndex: 9999 }}
              >
                <Camera className="w-4 h-4 text-white" /> Bật lại Camera sau
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Optical Alignment Frame Corners & Paper Plane Calibration */}
      <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
        {showPlaneCalibration && (
          <div className="absolute inset-6 sm:inset-10 border border-cyan-400/30 rounded-2xl pointer-events-none flex flex-col justify-between p-2">
            <div className="flex items-center justify-between pointer-events-none">
              <span className="bg-neutral-950/80 border border-cyan-400/50 text-cyan-300 px-2 py-0.5 rounded text-[10px] font-mono pointer-events-none">
                Góc 1: (0.00, 0.00)
              </span>
              <span className="bg-neutral-950/80 border border-cyan-400/50 text-cyan-300 px-2 py-0.5 rounded text-[10px] font-mono pointer-events-none">
                Góc 2: (1.00, 0.00)
              </span>
            </div>

            <div className="flex items-center justify-center pointer-events-none">
              <span className="bg-neutral-950/85 backdrop-blur-md border border-cyan-500/40 text-cyan-200 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold shadow-lg flex items-center gap-1.5 pointer-events-none">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Paper Plane: Khóa mặt phẳng ô ly & Chống rung [0, 1]</span>
              </span>
            </div>

            <div className="flex items-center justify-between pointer-events-none">
              <span className="bg-neutral-950/80 border border-cyan-400/50 text-cyan-300 px-2 py-0.5 rounded text-[10px] font-mono pointer-events-none">
                Góc 4: (0.00, 1.00)
              </span>
              <span className="bg-neutral-950/80 border border-cyan-400/50 text-cyan-300 px-2 py-0.5 rounded text-[10px] font-mono pointer-events-none">
                Góc 3: (1.00, 1.00)
              </span>
            </div>
          </div>
        )}

        <div className="absolute top-5 left-5 w-8 h-8 border-t-2 border-l-2 border-cyan-400/70 rounded-tl-lg pointer-events-none" />
        <div className="absolute top-5 right-5 w-8 h-8 border-t-2 border-r-2 border-cyan-400/70 rounded-tr-lg pointer-events-none" />
        <div className="absolute bottom-5 left-5 w-8 h-8 border-b-2 border-l-2 border-cyan-400/70 rounded-bl-lg pointer-events-none" />
        <div className="absolute bottom-5 right-5 w-8 h-8 border-b-2 border-r-2 border-cyan-400/70 rounded-br-lg pointer-events-none" />
      </div>

      {/* 2. AR OVERLAY LAYER (Transparent Vector SVG + Real-paper Grids) - Container is pointer-events-none to prevent blocking iOS taps */}
      <div 
        id="ar-projection-layer"
        className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
      >
        <div
          id="ar-draggable-box"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale}) rotate(${rotation}deg)`,
            opacity: opacity,
            transition: isDragging ? 'none' : 'transform 0.05s ease-out',
          }}
          className={`relative max-w-[94vw] max-h-[85vh] p-4 flex flex-col items-center justify-center ${
            isScreenLocked ? 'pointer-events-none' : 'pointer-events-auto cursor-grab active:cursor-grabbing'
          }`}
          onPointerDown={handlePointerDown}
        >
          {/* Practice Frame Container */}
          <div 
            className="relative p-6 sm:p-8 rounded-3xl border-2 border-cyan-400/50 shadow-2xl flex flex-col items-center justify-center"
            style={{
              backgroundColor: projectionStyle === 'solid_ink' ? 'rgba(255, 255, 255, 0.35)' : 'rgba(0, 0, 0, 0.25)',
              minWidth: charStrokes.length > 0 && characters.length === 1 ? '320px' : 'auto',
              minHeight: charStrokes.length > 0 && characters.length === 1 ? '320px' : 'auto',
            }}
          >
            {/* Real Notebook Ruling Grids */}
            {showGrid && (
              <div 
                className="absolute inset-0 pointer-events-none rounded-3xl overflow-hidden"
                style={{ opacity: gridOpacity }}
              >
                {/* 1. Lưới Ô ly Tiểu học Việt Nam (4 ô ly chuẩn dòng kẻ) */}
                {gridType === 'oly_vi' && (
                  <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="ar_oly_pattern_full" width="28" height="28" patternUnits="userSpaceOnUse">
                        <rect width="28" height="28" fill="none" stroke="currentColor" strokeWidth="0.6" strokeOpacity="0.45" />
                        <line x1="0" y1="7" x2="28" y2="7" stroke="currentColor" strokeWidth="0.35" strokeDasharray="1.5,1.5" strokeOpacity="0.35" />
                        <line x1="0" y1="14" x2="28" y2="14" stroke="currentColor" strokeWidth="0.35" strokeDasharray="1.5,1.5" strokeOpacity="0.35" />
                        <line x1="0" y1="21" x2="28" y2="21" stroke="currentColor" strokeWidth="0.35" strokeDasharray="1.5,1.5" strokeOpacity="0.35" />
                        <line x1="0" y1="28" x2="28" y2="28" stroke="currentColor" strokeWidth="1" strokeOpacity="0.8" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#ar_oly_pattern_full)" className="text-cyan-400" />
                  </svg>
                )}

                {/* 2. Lưới Chữ Điền (田字格 - Tian Zi Ge) */}
                {gridType === 'tian_zh' && (
                  <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <rect x="2" y="2" width="98%" height="98%" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-rose-500/80" />
                    <line x1="0" y1="50%" x2="100%" y2="50%" stroke="currentColor" strokeDasharray="4,4" strokeWidth="1.2" className="text-rose-500/80" />
                    <line x1="50%" y1="0" x2="50%" y2="100%" stroke="currentColor" strokeDasharray="4,4" strokeWidth="1.2" className="text-rose-500/80" />
                  </svg>
                )}

                {/* 3. Lưới Chữ Mễ (米字格 - Mi Zi Ge) */}
                {gridType === 'mizi_zh' && (
                  <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <rect x="2" y="2" width="98%" height="98%" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-rose-500/80" />
                    <line x1="0" y1="50%" x2="100%" y2="50%" stroke="currentColor" strokeDasharray="4,4" strokeWidth="1.2" className="text-rose-500/80" />
                    <line x1="50%" y1="0" x2="50%" y2="100%" stroke="currentColor" strokeDasharray="4,4" strokeWidth="1.2" className="text-rose-500/80" />
                    <line x1="0" y1="0" x2="100%" y2="100%" stroke="currentColor" strokeDasharray="3,3" strokeWidth="0.8" className="text-rose-400/60" />
                    <line x1="100%" y1="0" x2="0" y2="100%" stroke="currentColor" strokeDasharray="3,3" strokeWidth="0.8" className="text-rose-400/60" />
                  </svg>
                )}

                {/* 4. 4 Dòng kẻ Tiểu học tiếng Anh (Four-line English) */}
                {gridType === 'four_line_en' && (
                  <div className="absolute inset-0 flex flex-col justify-around py-4">
                    <div className="w-full border-t-2 border-rose-500/80" />
                    <div className="w-full border-t border-dashed border-sky-400/80" />
                    <div className="w-full border-t-2 border-sky-600/90" />
                    <div className="w-full border-t-2 border-rose-500/80" />
                  </div>
                )}
              </div>
            )}

            {/* A. VECTOR SVG STROKE RENDERING (If single character with stroke data) */}
            {charStrokes.length > 0 && characters.length === 1 ? (
              <div className="relative z-10 flex flex-col items-center">
                <svg
                  viewBox="0 0 100 100"
                  className="w-56 h-56 sm:w-64 sm:h-64 overflow-visible cursor-crosshair touch-none select-none"
                  style={{ filter: ink.glow }}
                  onPointerDown={(e) => {
                    isUserTouchingRef.current = true;
                    handleSvgPointerDown(e);
                  }}
                  onPointerMove={(e) => {
                    if (isUserTouchingRef.current) {
                      handleSvgPointerMove(e);
                    }
                  }}
                  onPointerUp={() => {
                    isUserTouchingRef.current = false;
                    handleSvgPointerUp();
                  }}
                  onPointerLeave={() => {
                    isUserTouchingRef.current = false;
                    handleSvgPointerUp();
                  }}
                >
                  {/* Future Strokes (Ghost Guide Outline) */}
                  {showFutureOutline && charStrokes.map((s) => {
                    const isFuture = strokeMode === 'step' && s.id > currentStep;
                    if (!isFuture) return null;
                    return (
                      <path
                        key={`ghost-${s.id}`}
                        d={s.d}
                        fill="none"
                        stroke={ink.ghost}
                        strokeWidth="3.5"
                        strokeDasharray="3,3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity={0.4}
                      />
                    );
                  })}

                  {/* Completed Strokes */}
                  {charStrokes.map((s) => {
                    const isCompleted = strokeMode === 'full' || s.id < currentStep;
                    if (!isCompleted) return null;
                    return (
                      <g key={`comp-${s.id}`}>
                        <path
                          d={s.d}
                          fill="none"
                          stroke={textColor}
                          strokeWidth="5.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        {/* Stroke order number badge */}
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
                          fontSize="3.5"
                          fontWeight="bold"
                          textAnchor="middle"
                          dominantBaseline="central"
                        >
                          {s.id}
                        </text>
                      </g>
                    );
                  })}

                  {/* Current Active Stroke (Highlighted in vibrant color with pen touchdown indicator) */}
                  {strokeMode === 'step' && activeStrokeInfo && (
                    <g key={`active-${activeStrokeInfo.id}`}>
                      {/* Active Path with animated pulse */}
                      <path
                        d={activeStrokeInfo.d}
                        fill="none"
                        stroke={
                          realtimeFeedback.status === 'DEVIATION_ALERT' || realtimeFeedback.status === 'DIRECTION_ERROR'
                            ? '#ef4444'
                            : ink.current
                        }
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="animate-pulse"
                      />

                      {/* Pen Tip Touchdown Circle (Điểm đặt bút thật trên giấy) */}
                      <circle
                        cx={activeStrokeInfo.startPoint.x}
                        cy={activeStrokeInfo.startPoint.y}
                        r="6"
                        className="fill-red-500/30 animate-ping"
                      />
                      <circle
                        cx={activeStrokeInfo.startPoint.x}
                        cy={activeStrokeInfo.startPoint.y}
                        r="4"
                        fill="#ef4444"
                        stroke="#ffffff"
                        strokeWidth="1"
                      />
                      <text
                        x={activeStrokeInfo.startPoint.x}
                        y={activeStrokeInfo.startPoint.y + 0.5}
                        fill="#ffffff"
                        fontSize="3.5"
                        fontWeight="900"
                        textAnchor="middle"
                        dominantBaseline="central"
                      >
                        {activeStrokeInfo.id}
                      </text>
                    </g>
                  )}

                  {/* LIVE PEN-TIP TRACKING & DEVIATION BEACON (Camera or Touch Tracking) */}
                  {livePenPoint && (
                    <g key="live-pen-tracking-beacon" className="pointer-events-none">
                      {/* Radar concentric wave */}
                      <circle
                        cx={livePenPoint.x}
                        cy={livePenPoint.y}
                        r={
                          realtimeFeedback.status === 'DEVIATION_ALERT' || realtimeFeedback.status === 'DIRECTION_ERROR'
                            ? 11
                            : 6.5
                        }
                        fill="none"
                        stroke={realtimeFeedback.colorHex}
                        strokeWidth="1.5"
                        className="animate-ping"
                        opacity="0.8"
                      />

                      {/* Deviation Line & Target Projection Point */}
                      {(realtimeFeedback.status === 'DEVIATION_ALERT' || realtimeFeedback.status === 'DIRECTION_ERROR') && (
                        <>
                          {/* Dashed line to closest point on reference path */}
                          <line
                            x1={livePenPoint.x}
                            y1={livePenPoint.y}
                            x2={realtimeFeedback.closestPoint.x}
                            y2={realtimeFeedback.closestPoint.y}
                            stroke="#ef4444"
                            strokeWidth="1.4"
                            strokeDasharray="2,2"
                          />
                          {/* Target Projection Dot on Stroke */}
                          <circle
                            cx={realtimeFeedback.closestPoint.x}
                            cy={realtimeFeedback.closestPoint.y}
                            r="2.8"
                            fill="#10b981"
                            stroke="#ffffff"
                            strokeWidth="0.8"
                          />
                          {/* Deviation distance badge */}
                          <rect
                            x={livePenPoint.x - 14}
                            y={livePenPoint.y - 11}
                            width="28"
                            height="6"
                            rx="2"
                            fill="#09090b"
                            stroke="#ef4444"
                            strokeWidth="0.7"
                            opacity="0.95"
                          />
                          <text
                            x={livePenPoint.x}
                            y={livePenPoint.y - 7}
                            fill="#ef4444"
                            fontSize="3"
                            fontWeight="bold"
                            textAnchor="middle"
                          >
                            {realtimeFeedback.deviationDirection === 'REVERSE'
                              ? 'NGƯỢC HƯỚNG'
                              : `LỆCH ${realtimeFeedback.currentDistance}px`}
                          </text>
                        </>
                      )}

                      {/* Inner Pen Tip Solid Dot */}
                      <circle
                        cx={livePenPoint.x}
                        cy={livePenPoint.y}
                        r="3.5"
                        fill={realtimeFeedback.colorHex}
                        stroke="#ffffff"
                        strokeWidth="1.2"
                        filter="drop-shadow(0 0 4px rgba(0,0,0,0.8))"
                      />
                    </g>
                  )}
                </svg>

                {/* Subtitle with stroke name & instruction */}
                {strokeMode === 'step' && activeStrokeInfo && (
                  <div className="mt-2.5 px-3 py-1 bg-neutral-900/95 border border-neutral-700/80 rounded-full text-xs font-semibold text-white shadow flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span>Nét {currentStep}/{charStrokes.length}: {activeStrokeInfo.label}</span>
                  </div>
                )}

                {/* REAL-TIME DEVIATION STATUS HUD BANNER */}
                {showLiveDeviationHUD && (
                  <div 
                    className="mt-3 w-full max-w-md px-3.5 py-2.5 rounded-2xl shadow-2xl border transition-all duration-200 backdrop-blur-md flex flex-col gap-1.5"
                    style={{
                      backgroundColor: 
                        realtimeFeedback.status === 'DEVIATION_ALERT' || realtimeFeedback.status === 'DIRECTION_ERROR'
                          ? 'rgba(239, 68, 68, 0.25)'
                          : realtimeFeedback.status === 'OCCLUDED'
                          ? 'rgba(245, 158, 11, 0.25)'
                          : 'rgba(16, 185, 129, 0.20)',
                      borderColor: realtimeFeedback.colorHex,
                    }}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span 
                          className="w-2.5 h-2.5 rounded-full animate-ping shrink-0" 
                          style={{ backgroundColor: realtimeFeedback.colorHex }} 
                        />
                        <span className="text-xs sm:text-sm font-bold text-white tracking-tight">
                          {realtimeFeedback.instructionText}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-black/70 text-white border border-white/20 shrink-0">
                        {realtimeFeedback.currentDistance}px / R:{realtimeFeedback.safeRadius}px
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-neutral-300 font-medium">
                      <span>
                        Frame lệch: <strong className={realtimeFeedback.consecutiveAlertFrames >= 3 ? 'text-red-400 font-bold' : 'text-neutral-200'}>{realtimeFeedback.consecutiveAlertFrames}/3</strong>
                      </span>
                      <span>
                        Tiến độ: <strong className="text-cyan-300">{Math.round(realtimeFeedback.progress * 100)}%</strong>
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsAudioBuzzerEnabled(!isAudioBuzzerEnabled)}
                        className="text-[10px] text-neutral-400 hover:text-white underline cursor-pointer"
                        title="Bật/Tắt còi báo âm thanh khi lệch nét"
                      >
                        {isAudioBuzzerEnabled ? '🔊 Còi: Bật' : '🔇 Còi: Tắt'}
                      </button>
                    </div>
                  </div>
                )}

                {/* BAN GIÁM KHẢO REAL-TIME VALIDATION TESTBENCH */}
                {showJudgeTestbench && (
                  <div className="mt-3 p-2 sm:p-2.5 rounded-2xl bg-neutral-950/90 border border-indigo-500/50 shadow-2xl backdrop-blur-md flex flex-wrap items-center justify-center gap-1.5 text-xs max-w-md">
                    <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-indigo-300">
                      <span>⚖️ Ban Giám Khảo Test:</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSimulateJudgeTest('normal')}
                      className="px-2 py-1 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/60 text-emerald-300 text-[11px] font-bold transition flex items-center gap-1 cursor-pointer active:scale-95"
                      title="Mô phỏng viết đúng quỹ đạo nét mẫu (< R)"
                    >
                      <span>✓ Nét đúng</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSimulateJudgeTest('deviate_left')}
                      className="px-2 py-1 rounded-xl bg-red-600/30 hover:bg-red-600/50 border border-red-500/60 text-red-300 text-[11px] font-bold transition flex items-center gap-1 cursor-pointer active:scale-95"
                      title="Mô phỏng ngòi bút lệch sang trái > 15px trong 3 frames liên tiếp"
                    >
                      <span>⚠️ Lệch trái</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSimulateJudgeTest('deviate_right')}
                      className="px-2 py-1 rounded-xl bg-red-600/30 hover:bg-red-600/50 border border-red-500/60 text-red-300 text-[11px] font-bold transition flex items-center gap-1 cursor-pointer active:scale-95"
                      title="Mô phỏng ngòi bút lệch sang phải > 15px trong 3 frames liên tiếp"
                    >
                      <span>⚠️ Lệch phải</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSimulateJudgeTest('reverse')}
                      className="px-2 py-1 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/60 text-purple-300 text-[11px] font-bold transition flex items-center gap-1 cursor-pointer active:scale-95"
                      title="Mô phỏng nét bút đi ngược chiều vector hướng dẫn"
                    >
                      <span>⛔ Ngược chiều</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSimulateJudgeTest('occlude')}
                      className="px-2 py-1 rounded-xl bg-amber-600/30 hover:bg-amber-600/50 border border-amber-500/60 text-amber-300 text-[11px] font-bold transition flex items-center gap-1 cursor-pointer active:scale-95"
                      title="Mô phỏng tay che khuất đầu bút < 300ms (Hệ thống tạm dừng, KHÔNG báo lỗi giả)"
                    >
                      <span>✋ Che khuất</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsValidationModalOpen(true)}
                      className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-[11px] font-bold transition flex items-center gap-1 shadow cursor-pointer active:scale-95"
                      title="Mở Bảng Báo Cáo Thực Nghiệm Ma Trận Đánh Giá chi tiết"
                    >
                      <span>📊 Báo Cáo Ma Trận ({deviationDetectorRef.current.getMetrics().accuracy}%)</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* B. MULTI-LINE TEXT & TYPOGRAPHY OVERLAY (Real physical paper tracing) */
              <div className="relative z-10 w-full flex flex-col items-center">
                {reading && (
                  <div className="text-xs sm:text-sm font-medium tracking-wide mb-2 opacity-90 font-mono text-cyan-300 text-center">
                    {reading}
                  </div>
                )}

                {/* Multi-line scroll & pan container */}
                <div 
                  className="relative w-full max-w-2xl px-2 transition-transform duration-100 ease-out"
                  style={{
                    transform: `translateY(${-scrollOffsetY}px)`,
                  }}
                >
                  {textLines.map((lineStr, idx) => {
                    const isFocused = idx === focusedLineIndex;
                    const isDimmed = focusLineMode && !isFocused;

                    return (
                      <div
                        key={`ar-line-${idx}`}
                        className={`relative transition-all duration-200 ${
                          textAlign === 'left' ? 'text-left' : 'text-center'
                        } ${isDimmed ? 'opacity-20 filter blur-[0.4px]' : 'opacity-100'}`}
                        style={{
                          marginBottom: idx === textLines.length - 1 ? 0 : `${lineSpacingPx}px`,
                          lineHeight: lineHeightRatio,
                        }}
                      >
                        {/* Line index badge for multi-line practice */}
                        {textLines.length > 1 && (
                          <div className={`flex items-center mb-1 ${textAlign === 'left' ? 'justify-start' : 'justify-center'}`}>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setFocusedLineIndex(idx);
                              }}
                              className={`px-2 py-0.5 rounded-full text-[10px] font-mono flex items-center gap-1 border transition ${
                                isFocused
                                  ? 'bg-cyan-500 text-neutral-950 font-bold border-cyan-300 shadow-md shadow-cyan-500/40 ring-1 ring-cyan-200'
                                  : 'bg-neutral-900/80 text-neutral-400 border-neutral-700/80 hover:text-white'
                              }`}
                              title={`Chuyển trọng tâm viết sang dòng ${idx + 1}`}
                            >
                              <span>Dòng {idx + 1}/{textLines.length}</span>
                              {isFocused && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />}
                            </button>
                          </div>
                        )}

                        {/* Line text with custom font size, high-legibility font & crisp outline */}
                        <div
                          className={`select-none transition-all ar-tracing-text ${getFontClass()} ${
                            crispOutline ? 'ar-crisp-outline' : ''
                          } ${boldTracing ? 'font-bold' : 'font-normal'}`}
                          style={{
                            fontFamily: currentFontOption.fontFamily,
                            fontSize: `${fontSizePx}px`,
                            letterSpacing: `${letterSpacingEm}em`,
                            fontStyle: 'normal',
                            color: textColor,
                            filter: textColor === '#000000' 
                              ? 'none' 
                              : `drop-shadow(0 0 6px ${textColor}99)`,
                            textShadow: textColor === '#000000' 
                              ? '0 1px 2px rgba(0,0,0,0.5)' 
                              : `0 0 8px ${textColor}55`,
                          }}
                        >
                          {lineStr || ' '}
                        </div>

                        {/* Notebook line ruling guide under line if grid is active */}
                        {showGrid && (
                          <div 
                            className="w-full h-px mt-1.5 pointer-events-none opacity-40 border-b border-dashed"
                            style={{
                              borderColor: projectionStyle === 'solid_ink' ? '#374151' : '#38bdf8'
                            }}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>

                {translation && (
                  <div className="text-xs sm:text-sm mt-3 opacity-80 max-w-md font-sans text-neutral-300 text-center">
                    {translation}
                  </div>
                )}
              </div>
            )}

            {/* Alignment indicator when unlocked */}
            {!isScreenLocked && (
              <div className="absolute -top-3 -right-3 px-2.5 py-1 bg-cyan-500 text-neutral-950 font-bold text-[10px] rounded-full shadow-lg flex items-center gap-1 animate-pulse">
                <Move className="w-3 h-3" /> Kéo để căn giấy
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. PHYSICAL EXPERIENCE TOOLBAR - TOP HUD */}
      <div 
        className="absolute top-0 inset-x-0 z-[9999] p-2 sm:p-4 bg-gradient-to-b from-black/90 via-black/50 to-transparent flex items-center justify-between pointer-events-none"
        style={{ zIndex: 9999 }}
      >
        {/* Left: Back Button & Essential Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
          <button
            id="ar-back-btn"
            onClick={onBackToMenu}
            className="px-2.5 sm:px-3 py-2 bg-neutral-900/95 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold border border-neutral-700/80 transition flex items-center gap-1 shadow cursor-pointer active:scale-95 pointer-events-auto"
          >
            ← Thoát
          </button>

          {/* Device Switcher (Mobile vs Desktop) - hidden on small mobile to save space */}
          <div className="hidden sm:flex items-center gap-0.5 bg-neutral-900/95 p-0.5 sm:p-1 rounded-xl border border-neutral-700/80 shadow">
            <button
              id="ar-device-mobile-btn"
              onClick={() => handleDeviceModeChange('mobile')}
              className={`px-2 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                deviceMode === 'mobile'
                  ? 'bg-cyan-500/25 text-cyan-400 border border-cyan-500/50 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
              title="Chế độ Điện thoại (Camera sau, thanh cuộn ngang, nút chạm to)"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Điện thoại</span>
            </button>
            <button
              id="ar-device-desktop-btn"
              onClick={() => handleDeviceModeChange('desktop')}
              className={`px-2 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                deviceMode === 'desktop'
                  ? 'bg-indigo-500/25 text-indigo-300 border border-indigo-500/50 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
              title="Chế độ Máy tính (Webcam trước, Bảng điều khiển Sidebar 2 bên)"
            >
              <Laptop className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Máy tính</span>
            </button>
          </div>

          {/* Quick Edit Text Modal Button */}
          <button
            id="ar-edit-text-btn"
            onClick={() => {
              setTempEditText(currentText);
              setIsEditingText(true);
            }}
            className="px-2.5 sm:px-3 py-2 bg-neutral-900/95 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold border border-neutral-700/80 transition flex items-center gap-1.5 shadow cursor-pointer active:scale-95"
            title="Nhập văn bản nhiều dòng hoặc đổi câu luyện viết"
          >
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span>Sửa chữ</span>
          </button>

          {/* Multi-line indicator badge */}
          {textLines.length > 1 && (
            <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 bg-cyan-950/80 border border-cyan-800/60 rounded-xl text-xs font-mono text-cyan-300">
              <span>{focusedLineIndex + 1}/{textLines.length} dòng</span>
            </div>
          )}

          {/* Direct Font Dropdown Selector in HUD (shown on md+ screens) */}
          <div className="hidden md:flex items-center gap-1.5 bg-neutral-900/95 hover:bg-neutral-800 px-2.5 py-1.5 rounded-xl border border-neutral-700/80 shadow">
            <Type className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <select
              id="ar-hud-font-dropdown"
              value={selectedFontId}
              onChange={(e) => {
                setSelectedFontId(e.target.value);
                playStrokeSound(1.1);
              }}
              className="bg-transparent text-white text-xs font-semibold focus:outline-none cursor-pointer max-w-[130px] xs:max-w-[170px] sm:max-w-[210px] truncate"
              title="Chọn trong 15 Google Fonts Tiếng Anh"
            >
              <optgroup label="🌟 15 Google Fonts Tiếng Anh">
                {GOOGLE_15_ENGLISH_FONTS.map((font) => (
                  <option key={font.id} value={font.id} className="bg-neutral-900 text-white">
                    {font.order}. {font.vietnameseTitle}
                  </option>
                ))}
              </optgroup>
              <optgroup label="🌏 Font chuyên dụng khác">
                {OTHER_LANGUAGE_FONTS.map((font) => (
                  <option key={font.id} value={font.id} className="bg-neutral-900 text-white">
                    {font.vietnameseTitle}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* Quick HUD Zoom Toggle */}
          <button
            id="ar-hud-zoom-btn"
            onClick={() => {
              const nextZoom = zoomLevel >= 3.0 ? 1.0 : parseFloat((zoomLevel + 0.5).toFixed(1));
              handleZoomChange(nextZoom);
              playStrokeSound(1.2);
            }}
            className="hidden md:flex items-center gap-1 bg-neutral-900/95 hover:bg-neutral-800 px-2.5 py-1.5 rounded-xl border border-neutral-700/80 text-xs transition shadow text-neutral-300"
            title="Nhấn để đổi nhanh mức Zoom (1x -> 1.5x -> 2x -> 2.5x -> 3x -> 1x)"
          >
            <ZoomIn className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-mono text-cyan-300 font-bold">{zoomLevel.toFixed(1)}x</span>
            <span className="text-[9px] text-neutral-500 font-mono">{isHardwareZoomActive ? 'Opt' : 'Dig'}</span>
          </button>
        </div>

        {/* Center Torch Notice (if any) */}
        {torchNotice && (
          <div className="hidden sm:flex px-3 py-1 bg-amber-500 text-neutral-950 text-xs font-bold rounded-full shadow-lg animate-in fade-in duration-200">
            {torchNotice}
          </div>
        )}

        {/* Right Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
          {/* UNIVERSAL COLLAPSE / EXPAND BUTTON (Desktop only, mobile has bottom dock) */}
          {deviceMode === 'desktop' && (
            <button
              id="ar-top-collapse-btn"
              onClick={handleToggleUniversalControls}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 shadow cursor-pointer ${
                isControlsOpen
                  ? 'bg-neutral-900/95 hover:bg-neutral-800 text-cyan-300 border-cyan-500/50 hover:border-cyan-400'
                  : 'bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white border-cyan-400/60 shadow-lg shadow-cyan-950/60 ring-2 ring-cyan-400/30'
              }`}
              title={isControlsOpen ? 'Thu gọn các bảng điều khiển để quan sát mặt giấy rộng nhất' : 'Mở lại các bảng điều khiển AR'}
            >
              {isControlsOpen ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Thu gọn</span>
                </>
              ) : (
                <>
                  <Sliders className="w-3.5 h-3.5 text-white" />
                  <span>Mở bảng</span>
                </>
              )}
            </button>
          )}

          {/* FLASH / TORCH BUTTON (Chiếu sáng mặt giấy thật) */}
          <button
            id="ar-flash-btn"
            onClick={handleToggleTorch}
            className={`px-2.5 sm:px-3 py-2 rounded-xl text-xs font-semibold border transition flex items-center gap-1.5 shadow cursor-pointer active:scale-95 ${
              isTorchOn 
                ? 'bg-amber-400 text-neutral-950 border-amber-300 shadow-amber-500/50' 
                : 'bg-neutral-900/95 text-neutral-300 border-neutral-700/80 hover:text-white'
            }`}
            title={isTorchOn ? 'Tắt đèn Flash chiếu giấy' : 'Bật đèn Flash chiếu sáng mặt giấy thật'}
          >
            {isTorchOn ? <Zap className="w-3.5 h-3.5 fill-current text-neutral-950" /> : <ZapOff className="w-3.5 h-3.5 text-amber-400" />}
            <span className="hidden xs:inline">{isTorchOn ? 'Đèn bật' : 'Flash'}</span>
          </button>

          {/* PAPER PLANE CALIBRATION & PERSPECTIVE TRANSFORM TOGGLE */}
          <button
            id="ar-plane-calibration-btn"
            onClick={() => setShowPlaneCalibration(!showPlaneCalibration)}
            className={`px-2.5 sm:px-3 py-2 rounded-xl text-xs font-semibold border transition flex items-center gap-1.5 shadow cursor-pointer active:scale-95 ${
              showPlaneCalibration
                ? 'bg-cyan-500/25 text-cyan-300 border-cyan-500/50 shadow-cyan-950/50'
                : 'bg-neutral-900/95 text-neutral-400 border-neutral-700/80 hover:text-white'
            }`}
            title={showPlaneCalibration ? 'Ẩn khung chuẩn hóa mặt phẳng [0, 1]' : 'Bật khung căn 4 góc trang giấy & chống rung'}
          >
            <span>📐</span>
            <span className="hidden sm:inline">{showPlaneCalibration ? 'Căn mặt phẳng [ON]' : 'Căn mặt phẳng'}</span>
          </button>

          {/* VALIDATION MATRIX & BGK EXPERIMENTAL REPORT BUTTON */}
          <button
            id="ar-validation-matrix-btn"
            onClick={() => setIsValidationModalOpen(true)}
            className="px-2.5 sm:px-3 py-2 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 shadow cursor-pointer active:scale-95 bg-gradient-to-r from-indigo-600/80 to-purple-600/80 hover:from-indigo-500 hover:to-purple-500 text-white border-indigo-400/50 shadow-indigo-950/60"
            title="Mở Báo Cáo Thực Nghiệm & Ma Trận Đánh Giá (Ban Giám Khảo)"
          >
            <span>📊</span>
            <span className="hidden sm:inline">Báo Cáo BGK</span>
          </button>

          {/* SCREEN LOCK (Desktop fallback; Mobile has it on bottom bar) */}
          <button
            id="ar-lock-toggle"
            onClick={toggleScreenLock}
            className={`hidden sm:flex px-3 py-2 rounded-xl text-xs font-bold border transition items-center gap-1.5 shadow cursor-pointer active:scale-95 ${
              isScreenLocked 
                ? 'bg-red-500 text-white border-red-400 shadow-lg shadow-red-900/50 animate-pulse' 
                : 'bg-neutral-900/95 text-white border-neutral-700/80 hover:bg-neutral-800'
            }`}
            title={isScreenLocked ? 'Màn hình đang khóa chống trượt nét. Nhấn để mở khóa' : 'Khóa màn hình để tì tay viết bút thật mà không lo lệch chữ'}
          >
            {isScreenLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5 text-neutral-400" />}
            <span>{isScreenLocked ? 'Đã khóa' : 'Khóa'}</span>
          </button>

          {/* Switch Camera */}
          {!cameraError && (
            <button
              id="ar-camera-toggle"
              onClick={() => setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'))}
              className="p-2 rounded-xl bg-neutral-900/95 hover:bg-neutral-800 text-white border border-neutral-700/80 transition shadow cursor-pointer active:scale-95 pointer-events-auto"
              title="Đổi camera trước / sau"
            >
              <RotateCw className="w-4 h-4 text-cyan-300" />
            </button>
          )}

          {/* Setup Guide */}
          <button
            id="ar-guide-btn"
            onClick={onOpenGuide}
            className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-500/60 transition shadow cursor-pointer active:scale-95 pointer-events-auto"
            title="Xem cách kê điện thoại trên cốc/sách"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4. FULL SCREEN TOUCH SHIELD WHEN LOCKED (Blocks all inadvertent palm/finger taps) */}
      {isScreenLocked && (
        <div 
          id="ar-screen-lock-shield"
          className="absolute inset-0 z-[9998] touch-none pointer-events-auto flex flex-col items-center justify-between p-6 bg-transparent"
          style={{ zIndex: 9998 }}
        >
          {/* Floating Unlock Pill (The ONLY interactive element when locked) */}
          <div className="w-full flex items-center justify-center pt-12">
            <button
              id="ar-floating-unlock-btn"
              onClick={toggleScreenLock}
              className="px-6 py-3 rounded-full bg-red-600 hover:bg-red-500 text-white font-bold text-sm shadow-2xl border-2 border-white/80 flex items-center gap-2 transform transition hover:scale-105 active:scale-95 animate-bounce z-[9999] pointer-events-auto cursor-pointer"
              style={{ zIndex: 9999 }}
            >
              <Unlock className="w-4 h-4" />
              <span>Chạm vào đây để MỞ KHÓA</span>
            </button>
          </div>

          {/* Persistent calm reminder at bottom */}
          <div className="px-4 py-2 bg-neutral-950/90 border border-white/20 rounded-2xl text-xs text-neutral-200 shadow-xl text-center max-w-sm pointer-events-none">
            🔒 <strong>Đã cố định màn hình:</strong> Bạn có thể tì tay lên mép điện thoại hoặc viết bút thật trên giấy mà không sợ trượt nét.
          </div>
        </div>
      )}

      {/* Lock Notification Toast */}
      {showLockToast && (
        <div className="absolute top-16 inset-x-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-[9999] p-3 bg-red-600 text-white text-xs font-semibold rounded-2xl shadow-2xl border border-red-400 flex items-center justify-center gap-2 animate-in slide-in-from-top duration-300 pointer-events-none" style={{ zIndex: 9999 }}>
          <Lock className="w-4 h-4 shrink-0" />
          <span>Màn hình đã khóa hoàn toàn! Bạn có thể thoải mái tì tay viết bút thật.</span>
        </div>
      )}

      {/* 4B. FLOATING MULTI-LINE QUICK NAVIGATOR (On-the-fly line scrolling while holding real pen) */}
      {!isScreenLocked && textLines.length > 1 && (
        <div 
          id="ar-floating-line-nav"
          className="absolute left-3 top-20 z-[9999] flex flex-col items-center gap-1.5 p-1.5 bg-neutral-900/95 border border-neutral-700/80 rounded-2xl shadow-2xl pointer-events-auto"
          style={{ zIndex: 9999 }}
        >
          <button
            id="quick-nav-prev-line"
            onClick={(e) => {
              e.stopPropagation();
              handlePrevLine();
            }}
            disabled={focusedLineIndex <= 0}
            className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 disabled:opacity-30 text-white transition shadow cursor-pointer pointer-events-auto"
            title="Dòng trước (Cuộn lên)"
          >
            <ArrowUp className="w-4 h-4 text-cyan-400" />
          </button>

          <div className="px-1.5 py-1 bg-neutral-950 rounded-lg text-[10px] font-mono font-bold text-white text-center min-w-[36px] pointer-events-none">
            {focusedLineIndex + 1}/{textLines.length}
          </div>

          <button
            id="quick-nav-next-line"
            onClick={(e) => {
              e.stopPropagation();
              handleNextLine();
            }}
            disabled={focusedLineIndex >= textLines.length - 1}
            className="p-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-30 text-white transition shadow shadow-cyan-950 cursor-pointer pointer-events-auto"
            title="Dòng sau (Cuộn xuống)"
          >
            <ArrowDown className="w-4 h-4 text-white" />
          </button>

          <div className="w-full h-px bg-neutral-700 my-0.5 pointer-events-none" />

          <button
            id="quick-nav-focus-toggle"
            onClick={(e) => {
              e.stopPropagation();
              setFocusLineMode(!focusLineMode);
            }}
            className={`p-2 rounded-xl transition cursor-pointer pointer-events-auto ${
              focusLineMode 
                ? 'bg-amber-500 text-neutral-950 font-bold shadow' 
                : 'bg-neutral-800 text-neutral-400 hover:text-white'
            }`}
            title={focusLineMode ? 'Đang làm sáng duy nhất dòng viết hiện tại' : 'Làm sáng duy nhất dòng viết hiện tại (làm mờ dòng khác)'}
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 4C. FLOATING QUICK VISUAL & ZOOM CONTROLLER (Desktop when Right Sidebar collapsed) */}
      {!isScreenLocked && deviceMode === 'desktop' && !desktopRightOpen && (
        <div 
          id="ar-floating-quick-visual-bar"
          className="absolute right-3 top-20 z-[9999] flex flex-col items-center gap-1.5 p-1.5 bg-neutral-900/95 border border-neutral-700/80 rounded-2xl shadow-2xl pointer-events-auto"
          style={{ zIndex: 9999 }}
        >
          <button
            id="quick-nav-prev-line"
            onClick={(e) => {
              e.stopPropagation();
              handlePrevLine();
            }}
            disabled={focusedLineIndex <= 0}
            className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 disabled:opacity-30 text-white transition shadow"
            title="Dòng trước (Cuộn lên)"
          >
            <ArrowUp className="w-4 h-4 text-cyan-400" />
          </button>

          <div className="px-1.5 py-1 bg-neutral-950 rounded-lg text-[10px] font-mono font-bold text-white text-center min-w-[36px]">
            {focusedLineIndex + 1}/{textLines.length}
          </div>

          <button
            id="quick-nav-next-line"
            onClick={(e) => {
              e.stopPropagation();
              handleNextLine();
            }}
            disabled={focusedLineIndex >= textLines.length - 1}
            className="p-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-30 text-white transition shadow shadow-cyan-950"
            title="Dòng sau (Cuộn xuống)"
          >
            <ArrowDown className="w-4 h-4 text-white" />
          </button>

          <div className="w-full h-px bg-neutral-700 my-0.5" />

          <button
            id="quick-nav-focus-toggle"
            onClick={(e) => {
              e.stopPropagation();
              setFocusLineMode(!focusLineMode);
            }}
            className={`p-2 rounded-xl transition ${
              focusLineMode 
                ? 'bg-amber-500 text-neutral-950 font-bold shadow' 
                : 'bg-neutral-800 text-neutral-400 hover:text-white'
            }`}
            title={focusLineMode ? 'Đang làm sáng duy nhất dòng viết hiện tại' : 'Làm sáng duy nhất dòng viết hiện tại (làm mờ dòng khác)'}
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 4C. FLOATING QUICK VISUAL & ZOOM CONTROLLER (Desktop when Right Sidebar collapsed) */}
      {!isScreenLocked && deviceMode === 'desktop' && !desktopRightOpen && (
        <div 
          id="ar-floating-quick-visual-bar"
          className="absolute right-3 top-20 z-30 flex flex-col items-center gap-1.5 p-1.5 bg-neutral-900/95 border border-neutral-700/80 rounded-2xl shadow-2xl pointer-events-auto"
        >
          {/* Zoom In */}
          <button
            id="quick-zoom-in"
            onClick={() => handleZoomChange(zoomLevel + 0.5)}
            disabled={zoomLevel >= 5.0}
            className="p-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 disabled:opacity-30 text-white transition shadow"
            title="Phóng to Camera (+0.5x)"
          >
            <ZoomIn className="w-3.5 h-3.5 text-cyan-400" />
          </button>

          {/* Current Zoom badge */}
          <button
            id="quick-zoom-reset"
            onClick={() => handleZoomChange(1.0)}
            className="px-1.5 py-1 bg-neutral-950 rounded-lg text-[10px] font-mono font-bold text-cyan-300 text-center min-w-[36px] hover:bg-neutral-800 transition"
            title="Bấm để quay về Zoom 1.0x"
          >
            {zoomLevel.toFixed(1)}x
          </button>

          {/* Zoom Out */}
          <button
            id="quick-zoom-out"
            onClick={() => handleZoomChange(zoomLevel - 0.5)}
            disabled={zoomLevel <= 1.0}
            className="p-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 disabled:opacity-30 text-white transition shadow"
            title="Thu nhỏ Camera (-0.5x)"
          >
            <ZoomOut className="w-3.5 h-3.5 text-neutral-300" />
          </button>

          <div className="w-full h-px bg-neutral-700 my-0.5" />

          {/* Quick Opacity Toggle / Preset (40% default) */}
          <button
            id="quick-opacity-pill"
            onClick={() => {
              const nextOpacity = opacity <= 0.25 ? 0.40 : opacity <= 0.45 ? 0.70 : opacity <= 0.75 ? 1.0 : 0.20;
              setOpacity(nextOpacity);
            }}
            className="px-1 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-750 text-[10px] font-mono font-bold text-amber-300 text-center min-w-[36px] transition flex flex-col items-center"
            title="Độ mờ chữ mẫu: Bấm để đổi nhanh (20% -> 40% -> 70% -> 100%)"
          >
            <Sun className="w-3 h-3 mb-0.5 text-amber-400" />
            <span>{Math.round(opacity * 100)}%</span>
          </button>

          <div className="w-full h-px bg-neutral-700 my-0.5" />

          {/* Quick Color Dots (5 Presets) */}
          <div className="flex flex-col gap-1 items-center py-0.5">
            {NEON_COLOR_PRESETS.map((preset) => (
              <button
                key={preset.id}
                id={`quick-dot-${preset.id}`}
                onClick={() => {
                  setTextColor(preset.hex);
                  playStrokeSound(1.2);
                }}
                className={`w-4 h-4 rounded-full border transition transform hover:scale-125 ${
                  textColor.toLowerCase() === preset.hex.toLowerCase()
                    ? 'border-white scale-110 shadow-lg ring-1 ring-white/70'
                    : 'border-white/30 opacity-70 hover:opacity-100'
                }`}
                style={{ 
                  backgroundColor: preset.hex,
                  boxShadow: preset.hex === '#000000' ? 'none' : `0 0 6px ${preset.hex}99`
                }}
                title={`Màu ${preset.label} (${preset.hex})`}
              />
            ))}
          </div>
        </div>
      )}

      {/* 5. AR RESPONSIVE CONTROLS: MOBILE DRAWER VS DESKTOP DUAL SIDEBARS */}
      {!isScreenLocked && (
        <>
          {/* 5A. DESKTOP MODE (Fixed Dual Sidebars: Left = Text/Fonts, Right = Visuals/Grid/Strokes) */}
          {deviceMode === 'desktop' && (
            <>
              {/* Left Sidebar: Chữ & Font mẫu */}
              {desktopLeftOpen ? (
                <aside 
                  id="desktop-left-sidebar"
                  className="absolute left-4 top-20 bottom-8 z-30 w-80 max-w-[340px] bg-neutral-900/95 border border-neutral-700/80 rounded-3xl p-4 text-white shadow-2xl pointer-events-auto flex flex-col animate-in slide-in-from-left duration-200"
                >
                  {/* Header & Tabs */}
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-2.5 mb-3">
                    <div className="flex items-center gap-1">
                      <button
                        id="desktop-tab-text-layout"
                        onClick={() => setDesktopLeftTab('text_layout')}
                        className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1 ${
                          desktopLeftTab === 'text_layout'
                            ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-sm'
                            : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        <Type className="w-3.5 h-3.5" /> Chữ & Dòng kẻ
                      </button>

                      <button
                        id="desktop-tab-font-selector"
                        onClick={() => setDesktopLeftTab('font_selector')}
                        className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1 ${
                          desktopLeftTab === 'font_selector'
                            ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-sm'
                            : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        <Type className="w-3.5 h-3.5" /> Thư viện Font
                      </button>
                    </div>

                    <button
                      id="desktop-close-left-sidebar"
                      onClick={() => setDesktopLeftOpen(false)}
                      className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white rounded-xl text-xs font-bold transition flex items-center gap-1 border border-neutral-700 shadow-sm"
                      title="Thu gọn bảng bên trái"
                    >
                      <ChevronLeft className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Thu gọn</span>
                    </button>
                  </div>

                  {/* Scrollable Tab Content */}
                  <div className="flex-1 overflow-y-auto pr-1">
                    <ARControlTabs 
                      activeTab={desktopLeftTab}
                      onSwitchTab={(tab) => setDesktopLeftTab(tab)}
                      {...arControlTabsProps}
                    />
                  </div>

                  {/* Bottom Quick Collapse Button */}
                  <button
                    id="desktop-footer-close-left"
                    onClick={() => setDesktopLeftOpen(false)}
                    className="mt-2.5 w-full py-2 bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 hover:text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border border-neutral-700/80 transition shrink-0"
                  >
                    <ChevronLeft className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Thu gọn bảng chữ</span>
                  </button>
                </aside>
              ) : (
                <button
                  id="desktop-open-left-sidebar-btn"
                  onClick={() => setDesktopLeftOpen(true)}
                  className="absolute left-4 top-20 z-30 px-3.5 py-2 bg-neutral-900/95 hover:bg-neutral-800 border border-neutral-700 text-cyan-400 rounded-2xl text-xs font-bold flex items-center gap-1.5 shadow-xl pointer-events-auto transition hover:scale-105"
                  title="Mở bảng Chữ & Font"
                >
                  <PanelLeft className="w-4 h-4" />
                  <span>Bảng Chữ mẫu ►</span>
                </button>
              )}

              {/* Right Sidebar: Hiệu ứng, Zoom, Lưới, Nét vẽ */}
              {desktopRightOpen ? (
                <aside 
                  id="desktop-right-sidebar"
                  className="absolute right-4 top-20 bottom-8 z-30 w-84 max-w-[350px] bg-neutral-900/95 border border-neutral-700/80 rounded-3xl p-4 text-white shadow-2xl pointer-events-auto flex flex-col animate-in slide-in-from-right duration-200"
                >
                  {/* Header & Tabs */}
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-2.5 mb-3">
                    <div className="flex items-center gap-1 overflow-x-auto">
                      <button
                        id="desktop-tab-opacity-size"
                        onClick={() => setDesktopRightTab('opacity_size')}
                        className={`px-2 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1 shrink-0 ${
                          desktopRightTab === 'opacity_size'
                            ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-sm'
                            : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        <Sun className="w-3.5 h-3.5" /> Hiệu ứng & Zoom
                      </button>

                      <button
                        id="desktop-tab-grid-style"
                        onClick={() => setDesktopRightTab('grid_style')}
                        className={`px-2 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1 shrink-0 ${
                          desktopRightTab === 'grid_style'
                            ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-sm'
                            : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        <Grid className="w-3.5 h-3.5" /> Lưới
                      </button>

                      {charStrokes.length > 0 && (
                        <button
                          id="desktop-tab-step-stroke"
                          onClick={() => setDesktopRightTab('step_stroke')}
                          className={`px-2 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1 shrink-0 ${
                            desktopRightTab === 'step_stroke'
                              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-sm'
                              : 'text-neutral-400 hover:text-white'
                          }`}
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Từng nét
                        </button>
                      )}
                    </div>

                    <button
                      id="desktop-close-right-sidebar"
                      onClick={() => setDesktopRightOpen(false)}
                      className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white rounded-xl text-xs font-bold transition flex items-center gap-1 border border-neutral-700 shadow-sm shrink-0 ml-1"
                      title="Thu gọn bảng bên phải"
                    >
                      <span>Thu gọn</span>
                      <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />
                    </button>
                  </div>

                  {/* Scrollable Tab Content */}
                  <div className="flex-1 overflow-y-auto pr-1">
                    <ARControlTabs 
                      activeTab={desktopRightTab}
                      onSwitchTab={(tab) => setDesktopRightTab(tab)}
                      {...arControlTabsProps}
                    />
                  </div>

                  {/* Bottom Quick Collapse Button */}
                  <button
                    id="desktop-footer-close-right"
                    onClick={() => setDesktopRightOpen(false)}
                    className="mt-2.5 w-full py-2 bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 hover:text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border border-neutral-700/80 transition shrink-0"
                  >
                    <span>Thu gọn bảng hiệu ứng</span>
                    <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />
                  </button>
                </aside>
              ) : (
                <button
                  id="desktop-open-right-sidebar-btn"
                  onClick={() => setDesktopRightOpen(true)}
                  className="absolute right-4 top-20 z-30 px-3.5 py-2 bg-neutral-900/95 hover:bg-neutral-800 border border-neutral-700 text-emerald-400 rounded-2xl text-xs font-bold flex items-center gap-1.5 shadow-xl pointer-events-auto transition hover:scale-105"
                  title="Mở bảng Hiệu ứng & Zoom"
                >
                  <span>◄ Bảng Hiệu ứng & Zoom</span>
                  <PanelRight className="w-4 h-4" />
                </button>
              )}

              {/* Desktop Bottom Status Bar (Clean, Minimal, Non-obtrusive) */}
              <div className="absolute bottom-3 inset-x-0 z-20 flex justify-center pointer-events-none">
                <div className="bg-neutral-900/95 border border-neutral-800 rounded-full px-4 py-1.5 text-[11px] text-neutral-300 flex items-center gap-3 shadow-lg pointer-events-auto">
                  <span className="flex items-center gap-1 font-mono text-cyan-400">
                    <ZoomIn className="w-3 h-3" /> {zoomLevel.toFixed(1)}x
                  </span>
                  <span className="text-neutral-600">•</span>
                  <span className="flex items-center gap-1 font-mono text-amber-300">
                    <Sun className="w-3 h-3" /> {Math.round(opacity * 100)}%
                  </span>
                  <span className="text-neutral-600">•</span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full border border-white/60" style={{ backgroundColor: textColor }} />
                    <span className="font-mono text-[10px]">{textColor}</span>
                  </span>
                  <span className="text-neutral-600">•</span>
                  <button
                    onClick={() => setIsScreenLocked(true)}
                    className="text-red-400 hover:text-red-300 font-semibold flex items-center gap-1 hover:underline"
                  >
                    <Lock className="w-3 h-3" /> Khóa nét
                  </button>
                  <span className="text-neutral-600">•</span>
                  <button
                    id="desktop-toggle-sidebars-bar"
                    onClick={() => {
                      const willOpen = !(desktopLeftOpen || desktopRightOpen);
                      setDesktopLeftOpen(willOpen);
                      setDesktopRightOpen(willOpen);
                    }}
                    className="text-cyan-300 hover:text-white font-bold flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    {desktopLeftOpen || desktopRightOpen ? (
                      <>
                        <Minimize2 className="w-3 h-3 text-cyan-400" />
                        <span>Thu gọn 2 bảng</span>
                      </>
                    ) : (
                      <>
                        <Sliders className="w-3 h-3 text-cyan-400" />
                        <span>Mở lại 2 bảng</span>
                      </>
                    )}
                  </button>
                  {isSimulatedPaper && (
                    <>
                      <span className="text-neutral-600">•</span>
                      <button
                        onClick={() => setIsSimulatedPaper(false)}
                        className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 hover:underline"
                      >
                        <Camera className="w-3 h-3" /> Bật Camera thật
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Desktop Floating Open Button when both sidebars are collapsed */}
              {!desktopLeftOpen && !desktopRightOpen && (
                <div className="absolute bottom-12 inset-x-0 z-30 flex justify-center pointer-events-none">
                  <button
                    id="desktop-floating-open-all-btn"
                    onClick={() => {
                      setDesktopLeftOpen(true);
                      setDesktopRightOpen(true);
                    }}
                    className="px-5 py-2.5 rounded-full text-xs font-bold bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white border border-cyan-400/50 shadow-2xl transition-all active:scale-95 flex items-center gap-2 pointer-events-auto ring-2 ring-cyan-500/40"
                  >
                    <Sliders className="w-4 h-4 text-white" />
                    <span>Mở bảng điều khiển AR</span>
                    <ChevronUp className="w-4 h-4 text-cyan-200 animate-bounce" />
                  </button>
                </div>
              )}
            </>
          )}

          {/* 5B. MOBILE MODE (Touch-friendly Quick Dock + Expandable Bottom Drawer) */}
          {deviceMode === 'mobile' && (
            <div 
              className="absolute bottom-0 inset-x-0 z-[9999] pb-3 pt-1 px-2.5 sm:px-4 bg-gradient-to-t from-black/95 via-black/80 to-transparent flex flex-col items-center pointer-events-none"
              style={{ zIndex: 9999 }}
            >
              {!showControls ? (
                /* Sleek, Touch-Friendly Bottom Dock on Mobile */
                <div className="w-full max-w-md flex flex-col items-center gap-1.5 animate-in fade-in slide-in-from-bottom duration-200 pointer-events-auto">
                  {/* Floating Micro-Nudge D-Pad for phones (Effortless alignment without phone shaking) */}
                  {showNudgePad && (
                    <div className="w-full bg-neutral-900/95 border border-cyan-500/50 rounded-2xl p-2.5 shadow-2xl flex flex-col items-center gap-1.5 animate-in zoom-in-95 duration-150 backdrop-blur-md">
                      <div className="flex items-center justify-between w-full px-1 text-[11px] text-cyan-300 font-bold border-b border-neutral-800 pb-1">
                        <span className="flex items-center gap-1">
                          <Move className="w-3 h-3" /> Căn chỉnh vi mô (Chống rung lắc điện thoại)
                        </span>
                        <button 
                          onClick={() => setShowNudgePad(false)} 
                          className="text-neutral-400 hover:text-white px-1.5 py-0.5 rounded-md hover:bg-neutral-800 text-xs"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="flex flex-col items-center gap-1 py-1">
                        <button 
                          onClick={() => handleNudge(0, -6)} 
                          className="w-12 h-9 rounded-xl bg-neutral-800 hover:bg-neutral-700 active:scale-90 text-cyan-300 flex items-center justify-center border border-neutral-700 shadow-sm"
                          title="Dịch lên trên 6px"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleNudge(-6, 0)} 
                            className="w-12 h-9 rounded-xl bg-neutral-800 hover:bg-neutral-700 active:scale-90 text-cyan-300 flex items-center justify-center border border-neutral-700 shadow-sm"
                            title="Dịch sang trái 6px"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={handleResetPosition} 
                            className="px-3 h-9 rounded-xl bg-neutral-950 hover:bg-neutral-850 active:scale-90 text-amber-300 font-mono text-[11px] font-bold border border-neutral-700 shadow-sm"
                            title="Đặt lại chữ vào chính giữa màn hình"
                          >
                            Căn giữa
                          </button>
                          <button 
                            onClick={() => handleNudge(6, 0)} 
                            className="w-12 h-9 rounded-xl bg-neutral-800 hover:bg-neutral-700 active:scale-90 text-cyan-300 flex items-center justify-center border border-neutral-700 shadow-sm"
                            title="Dịch sang phải 6px"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                        <button 
                          onClick={() => handleNudge(0, 6)} 
                          className="w-12 h-9 rounded-xl bg-neutral-800 hover:bg-neutral-700 active:scale-90 text-cyan-300 flex items-center justify-center border border-neutral-700 shadow-sm"
                          title="Dịch xuống dưới 6px"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Visual Drag Hint & 60fps Indicator */}
                  <div className="w-full flex items-center justify-between px-1">
                    <div className="px-3 py-1 bg-neutral-900/90 border border-neutral-700/80 rounded-full text-[11px] font-medium text-neutral-300 flex items-center gap-1.5 shadow-md">
                      <Move className="w-3.5 h-3.5 text-cyan-400 animate-pulse shrink-0" />
                      <span>Kéo chữ hoặc bấm Căn chỉnh để khớp ô ly</span>
                    </div>

                    <button
                      id="mobile-quick-smooth-btn"
                      onClick={() => setIsSmooth60fps(prev => !prev)}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold flex items-center gap-1 border transition shadow-sm ${
                        isSmooth60fps
                          ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50'
                          : 'bg-neutral-900/80 text-neutral-400 border-neutral-700'
                      }`}
                      title={isSmooth60fps ? 'Đang bật 60fps mượt mà chống trễ' : 'Bật 60fps chống lag'}
                    >
                      <Zap className="w-3 h-3 text-emerald-400" />
                      <span>{isSmooth60fps ? '60fps Mượt' : 'Đồ họa HQ'}</span>
                    </button>
                  </div>

                  {/* Quick Control Bar with 48px Touch Targets */}
                  <div className="w-full bg-neutral-900/95 border border-neutral-700/90 rounded-2xl p-1.5 sm:p-2 shadow-2xl flex items-center justify-between gap-1">
                    {/* Micro-Nudge D-Pad Toggle */}
                    <button
                      id="mobile-quick-nudge-btn"
                      onClick={() => setShowNudgePad(prev => !prev)}
                      className={`h-11 px-2.5 rounded-xl active:scale-95 text-xs font-bold flex items-center gap-1 border transition shrink-0 cursor-pointer ${
                        showNudgePad 
                          ? 'bg-cyan-500 text-neutral-950 border-cyan-300 shadow-md shadow-cyan-950' 
                          : 'bg-neutral-800 hover:bg-neutral-750 text-cyan-300 border-neutral-700'
                      }`}
                      title="Bật các nút điều hướng vi mô Lên/Xuống/Trái/Phải"
                    >
                      <Move className="w-4 h-4" />
                      <span className="hidden xs:inline">Dịch nét</span>
                    </button>

                    {/* Scale Down (-) */}
                    <button
                      id="mobile-quick-scale-down"
                      onClick={() => setScale((s) => Math.max(0.5, parseFloat((s - 0.1).toFixed(1))))}
                      className="w-11 h-11 rounded-xl bg-neutral-800 hover:bg-neutral-750 active:scale-95 text-white flex items-center justify-center border border-neutral-700 shrink-0 cursor-pointer"
                      title="Thu nhỏ nét chữ"
                    >
                      <Minus className="w-5 h-5 text-neutral-200" />
                    </button>

                    {/* Scale Reset & Badge */}
                    <button
                      id="mobile-quick-reset-pos"
                      onClick={handleResetPosition}
                      className="px-2 h-11 rounded-xl bg-neutral-800 hover:bg-neutral-750 active:scale-95 text-cyan-300 font-mono font-bold text-xs flex flex-col items-center justify-center border border-neutral-700 shrink-0 min-w-[48px] cursor-pointer"
                      title="Bấm để đặt chữ về giữa"
                    >
                      <span className="text-[9px] text-neutral-400 font-normal leading-none mb-0.5">Cỡ</span>
                      <span className="leading-none">{Math.round(scale * 100)}%</span>
                    </button>

                    {/* Scale Up (+) */}
                    <button
                      id="mobile-quick-scale-up"
                      onClick={() => setScale((s) => Math.min(2.5, parseFloat((s + 0.1).toFixed(1))))}
                      className="w-11 h-11 rounded-xl bg-neutral-800 hover:bg-neutral-750 active:scale-95 text-white flex items-center justify-center border border-neutral-700 shrink-0 cursor-pointer"
                      title="Phóng to nét chữ"
                    >
                      <Plus className="w-5 h-5 text-cyan-400" />
                    </button>

                    <div className="w-px h-7 bg-neutral-750 shrink-0 mx-0.5" />

                    {/* Opacity Cycle (30% -> 55% -> 85% -> 100%) */}
                    <button
                      id="mobile-quick-opacity-cycle"
                      onClick={() => {
                        const next = opacity <= 0.35 ? 0.55 : opacity <= 0.65 ? 0.85 : opacity <= 0.9 ? 1.0 : 0.30;
                        setOpacity(next);
                      }}
                      className="h-11 px-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-750 active:scale-95 text-amber-300 font-bold text-xs flex items-center gap-1 border border-neutral-700 shrink-0 cursor-pointer"
                      title="Đổi độ mờ nét chữ (30% -> 55% -> 85% -> 100%)"
                    >
                      <Sun className="w-4 h-4 text-amber-400" />
                      <span>{Math.round(opacity * 100)}%</span>
                    </button>

                    {/* Color Presets Cycle */}
                    <button
                      id="mobile-quick-color-cycle"
                      onClick={() => {
                        const colors = ['#FF0055', '#00FF66', '#0099FF', '#FFCC00', '#000000'];
                        const currentIndex = colors.indexOf(textColor);
                        const nextColor = colors[(currentIndex + 1) % colors.length];
                        setTextColor(nextColor);
                        playStrokeSound(1.2);
                      }}
                      className="w-11 h-11 rounded-xl bg-neutral-800 hover:bg-neutral-750 active:scale-95 flex items-center justify-center border border-neutral-700 shrink-0 cursor-pointer"
                      title="Bấm để đổi màu mực phản quang"
                    >
                      <span 
                        className="w-5 h-5 rounded-full border-2 border-white shadow-sm"
                        style={{ backgroundColor: textColor }}
                      />
                    </button>

                    <div className="w-px h-7 bg-neutral-750 shrink-0 mx-0.5" />

                    {/* Lock Screen Button (Crucial for writing without screen moving) */}
                    <button
                      id="mobile-quick-lock-btn"
                      onClick={toggleScreenLock}
                      className="h-11 px-3 rounded-xl bg-red-600 hover:bg-red-500 active:scale-95 text-white font-bold text-xs flex items-center gap-1 shadow-lg shadow-red-950/60 shrink-0 cursor-pointer"
                      title="Khóa màn hình để tì tay viết bút thật mà không lo lệch chữ"
                    >
                      <Lock className="w-4 h-4" />
                      <span>Khóa</span>
                    </button>

                    {/* Expand Full Drawer Button */}
                    <button
                      id="mobile-quick-open-more"
                      onClick={() => setShowControls(true)}
                      className="h-11 px-2.5 rounded-xl bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-200 active:scale-95 font-bold text-xs flex items-center gap-1 border border-cyan-500/40 shrink-0 cursor-pointer"
                      title="Mở thêm tùy chọn nâng cao (Font, Lưới, Từng nét)"
                    >
                      <Sliders className="w-4 h-4 text-cyan-400" />
                      <span className="hidden xs:inline">Thêm</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Mobile Bottom Sheet Drawer (Expanded with reduced height so it doesn't block screen) */
                <div 
                  id="mobile-ar-drawer"
                  className="w-full max-w-lg bg-neutral-900/95 border border-neutral-700/80 rounded-3xl p-3 sm:p-4 text-white shadow-2xl animate-in slide-in-from-bottom duration-200 max-h-[60vh] flex flex-col pointer-events-auto"
                >
                  {/* Top drag bar indicator & Close Button */}
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-800">
                    <div className="flex items-center gap-1.5">
                      <div className="w-8 h-1 bg-neutral-600 rounded-full mr-1" />
                      <span className="text-[11px] font-bold text-neutral-300">Cài đặt chi tiết AR</span>
                    </div>

                    <button
                      id="close-mobile-drawer-btn"
                      onClick={() => setShowControls(false)}
                      className="px-3 py-1.5 rounded-xl bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-200 hover:text-white transition flex items-center gap-1.5 text-xs font-bold border border-cyan-500/40 shadow-sm cursor-pointer"
                      title="Thu gọn bảng điều khiển"
                    >
                      <ChevronDown className="w-4 h-4 text-cyan-400" />
                      <span>Thu gọn</span>
                    </button>
                  </div>

                  {/* Tab Navigation for Mobile (Scrollable horizontally) */}
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-2 mb-3 shrink-0">
                    <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
                      <button
                        id="tab-text-layout"
                        onClick={() => setActiveTab('text_layout')}
                        className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1 shrink-0 ${
                          activeTab === 'text_layout' 
                            ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-sm' 
                            : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        <Type className="w-3.5 h-3.5" /> Chữ & Dòng
                      </button>

                      <button
                        id="tab-font-selector"
                        onClick={() => setActiveTab('font_selector')}
                        className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1 shrink-0 ${
                          activeTab === 'font_selector' 
                            ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-sm' 
                            : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        <Type className="w-3.5 h-3.5" /> Font chữ (15)
                      </button>

                      {charStrokes.length > 0 && (
                        <button
                          id="tab-step-stroke"
                          onClick={() => setActiveTab('step_stroke')}
                          className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1 shrink-0 ${
                            activeTab === 'step_stroke' 
                              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-sm' 
                              : 'text-neutral-400 hover:text-white'
                          }`}
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Từng nét
                        </button>
                      )}

                      <button
                        id="tab-opacity-size"
                        onClick={() => setActiveTab('opacity_size')}
                        className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1 shrink-0 ${
                          activeTab === 'opacity_size' 
                            ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-sm' 
                            : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        <Sun className="w-3.5 h-3.5" /> Hiệu ứng & Zoom
                      </button>

                      <button
                        id="tab-grid-style"
                        onClick={() => setActiveTab('grid_style')}
                        className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1 shrink-0 ${
                          activeTab === 'grid_style' 
                            ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-sm' 
                            : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        <Grid className="w-3.5 h-3.5" /> Lưới ô ly
                      </button>
                    </div>

                    <button
                      id="reset-ar-calibration"
                      onClick={handleResetPosition}
                      className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition shrink-0 ml-1"
                      title="Đặt lại vị trí căn giữa"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Scrollable Drawer Body with ARControlTabs */}
                  <div className="overflow-y-auto flex-1 pr-1">
                    <ARControlTabs 
                      activeTab={activeTab}
                      onSwitchTab={setActiveTab}
                      {...arControlTabsProps}
                    />
                  </div>

                  {/* Sticky bottom collapse button inside mobile drawer */}
                  <div className="pt-2.5 mt-2 border-t border-neutral-800 flex justify-center shrink-0">
                    <button
                      id="mobile-drawer-bottom-collapse"
                      onClick={() => setShowControls(false)}
                      className="w-full py-2.5 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-cyan-300 hover:text-white text-xs font-bold flex items-center justify-center gap-2 border border-neutral-700 shadow transition active:scale-95 cursor-pointer"
                    >
                      <ChevronDown className="w-4 h-4 text-cyan-400" />
                      <span>Thu gọn bảng điều khiển</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* 6. IN-AR MULTI-LINE TEXT EDITOR & TEMPLATE PICKER MODAL */}
      {isEditingText && (
        <div 
          id="ar-text-editor-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 animate-in fade-in duration-200 pointer-events-auto"
        >
          <div className="w-full max-w-lg bg-neutral-900 border border-neutral-700 rounded-3xl p-5 shadow-2xl text-white space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">Soạn thảo văn bản lớp đè AR</h3>
                  <p className="text-[11px] text-neutral-400">Nhập bài thơ hoặc đoạn văn nhiều dòng để tập viết trên giấy thật</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditingText(false)}
                className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition"
              >
                ✕
              </button>
            </div>

            {/* Quick Templates Selector */}
            <div>
              <label className="text-[11px] font-semibold text-neutral-300 block mb-1.5">
                Chọn mẫu văn bản nhanh:
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {QUICK_TEMPLATES.map((tmpl) => (
                  <button
                    key={tmpl.label}
                    onClick={() => setTempEditText(tmpl.text)}
                    className="p-2 rounded-xl bg-neutral-800/80 hover:bg-neutral-800 border border-neutral-700/70 hover:border-cyan-500/50 text-left transition group"
                  >
                    <div className="text-xs font-semibold text-neutral-200 group-hover:text-cyan-300 truncate">
                      {tmpl.label}
                    </div>
                    <div className="text-[10px] text-neutral-400 truncate mt-0.5 font-mono">
                      {tmpl.text.split('\n')[0]}...
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Textarea */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-neutral-200">
                  Nội dung bài viết (Hỗ trợ xuống dòng Enter):
                </label>
                <span className="text-[11px] font-mono text-cyan-400">
                  {tempEditText.split('\n').filter(Boolean).length} dòng • {tempEditText.length} ký tự
                </span>
              </div>
              <textarea
                id="ar-textarea-edit"
                value={tempEditText}
                onChange={(e) => setTempEditText(e.target.value)}
                placeholder="Nhập từng dòng chữ cần luyện viết vào đây...&#10;Dòng 1: Công cha như núi Thái Sơn&#10;Dòng 2: Nghĩa mẹ như nước trong nguồn chảy ra"
                rows={5}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-2xl p-3 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-cyan-400 font-sans resize-none"
              />
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between gap-2 pt-2 border-t border-neutral-800">
              <button
                onClick={() => {
                  setTempEditText('');
                }}
                className="px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white text-xs transition"
              >
                Xóa trắng
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsEditingText(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium transition"
                >
                  Hủy
                </button>
                <button
                  id="ar-apply-text-modal-btn"
                  onClick={handleApplyText}
                  disabled={!tempEditText.trim()}
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-neutral-950 font-bold text-xs shadow-lg shadow-cyan-500/30 transition flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" /> Áp dụng vào AR
                </button>
              </div>
            </div>
          </div>
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
      <div 
        id="post-writing-action-bar"
        className="fixed bottom-20 sm:bottom-16 inset-x-0 z-[999999] flex items-center justify-center gap-2.5 px-3 pointer-events-none"
        style={{ zIndex: 999999 }}
      >
        {/* Nút phụ: "🔄 Viết lại nét này" */}
        <button
          id="btn-retry-stroke"
          type="button"
          onClick={handleRetryCurrentLetter}
          className="h-12 px-4 rounded-full bg-neutral-900/95 hover:bg-neutral-800 text-neutral-200 hover:text-white font-bold text-xs sm:text-sm border border-neutral-700 shadow-2xl backdrop-blur-md active:scale-95 flex items-center gap-1.5 transition cursor-pointer pointer-events-auto"
          title="Làm mới để viết lại chữ này từ đầu"
        >
          <RotateCcw className="w-4 h-4 text-amber-400" />
          <span className="hidden xs:inline">Viết lại nét này</span>
          <span className="xs:hidden">Viết lại</span>
        </button>

        {/* Nút chính: "📸 Đã viết xong - Chấm điểm" */}
        <button
          id="btn-capture-grade"
          data-finish-id="btn-finish-check"
          type="button"
          onClick={handleFinishAndCheck}
          disabled={isEvaluating}
          className="min-h-[50px] px-6 py-3 rounded-full bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-black text-sm sm:text-base shadow-2xl shadow-emerald-950/90 border-2 border-emerald-300/60 active:scale-95 flex items-center gap-2 transition cursor-pointer pointer-events-auto ring-4 ring-emerald-500/30"
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

      {/* Validation Matrix Modal for Judging Panel (BGK) */}
      <ValidationMatrixModal
        isOpen={isValidationModalOpen}
        onClose={() => setIsValidationModalOpen(false)}
      />
    </div>
  );
};
