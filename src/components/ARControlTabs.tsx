import React from 'react';
import { 
  Type, 
  Minus, 
  Plus, 
  AlignLeft, 
  AlignCenter, 
  Layers, 
  Move, 
  ArrowUp, 
  ArrowDown, 
  Eye, 
  Edit3, 
  Sparkles, 
  RefreshCw, 
  ChevronLeft, 
  ChevronRight, 
  Pause, 
  Play, 
  Sun, 
  Palette, 
  ZoomIn, 
  Maximize2, 
  RotateCw, 
  Grid 
} from 'lucide-react';
import { FontSelector } from './FontSelector';
import { 
  GOOGLE_15_ENGLISH_FONTS, 
  OTHER_LANGUAGE_FONTS 
} from '../data/fontOptions';
import { NEON_COLOR_PRESETS } from './ARViewfinder';
import { 
  type StrokePath, 
  type GridType, 
  type ProjectionStyle 
} from '../types';

export interface ARControlTabsProps {
  activeTab: string;
  onSwitchTab?: (tab: any) => void;

  // Font & Typography Props
  selectedFontId: string;
  setSelectedFontId: (id: string) => void;
  playStrokeSound: (pitch?: number) => void;
  language: string;
  crispOutline: boolean;
  setCrispOutline: (val: boolean) => void;
  letterSpacingEm: number;
  setLetterSpacingEm: (val: number) => void;
  boldTracing: boolean;
  setBoldTracing: (val: boolean) => void;
  fontSizePx: number;
  setFontSizePx: React.Dispatch<React.SetStateAction<number>>;
  lineSpacingPx: number;
  setLineSpacingPx: React.Dispatch<React.SetStateAction<number>>;
  setLineHeightRatio: React.Dispatch<React.SetStateAction<number>>;
  scrollOffsetY: number;
  setScrollOffsetY: React.Dispatch<React.SetStateAction<number>>;
  textLines: string[];
  focusedLineIndex: number;
  handlePrevLine: () => void;
  handleNextLine: () => void;
  textAlign: 'center' | 'left';
  setTextAlign: (align: 'center' | 'left') => void;
  focusLineMode: boolean;
  setFocusLineMode: (mode: boolean) => void;
  currentText: string;
  setTempEditText: (txt: string) => void;
  setIsEditingText: (val: boolean) => void;

  // Step Stroke Props
  strokeMode: 'step' | 'full';
  setStrokeMode: (mode: 'step' | 'full') => void;
  charStrokes: StrokePath[];
  currentStep: number;
  setCurrentStep: (step: number) => void;
  handleRestartSteps: () => void;
  handlePrevStep: () => void;
  handleNextStep: () => void;
  isAutoPlaying: boolean;
  setIsAutoPlaying: (val: boolean) => void;
  tips?: string;

  // Visual, Opacity & Zoom Props
  opacity: number;
  setOpacity: (val: number) => void;
  textColor: string;
  setTextColor: (val: string) => void;
  zoomLevel: number;
  handleZoomChange: (val: number) => void;
  isHardwareZoomActive: boolean;
  scale: number;
  setScale: (val: number) => void;
  rotation: number;
  setRotation: (val: number) => void;
  position: { x: number; y: number };
  handleResetPosition: () => void;

  // Grid & Ink Props
  showGrid: boolean;
  setShowGrid: (val: boolean) => void;
  gridType: GridType;
  setGridType: (val: GridType) => void;
  gridOpacity: number;
  setGridOpacity: (val: number) => void;
  projectionStyle: ProjectionStyle;
  setProjectionStyle: (val: ProjectionStyle) => void;
}

export const ARControlTabs: React.FC<ARControlTabsProps> = ({
  activeTab,
  onSwitchTab,
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
  setProjectionStyle
}) => {
  const activeStrokeInfo = charStrokes[currentStep - 1] || charStrokes[0];

  return (
    <>
      {/* TAB: TEXT LAYOUT & LINE SPACING */}
      {activeTab === 'text_layout' && (
        <div className="space-y-3.5 text-xs animate-in fade-in duration-150">
          {/* Quick Font Dropdown Selector in text_layout */}
          <div className="p-2.5 rounded-xl bg-neutral-950/80 border border-neutral-800 space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="ar-text-layout-font-select" className="text-neutral-300 font-medium text-[11px] flex items-center gap-1">
                <Type className="w-3 h-3 text-cyan-400" /> Chọn kiểu chữ (Dropdown 15 Fonts):
              </label>
              <button
                id="ar-open-all-fonts-link"
                onClick={() => onSwitchTab ? onSwitchTab('font_selector') : null}
                className="text-[10px] text-cyan-400 hover:text-cyan-300 font-semibold"
              >
                Mở thư viện font →
              </button>
            </div>

            <select
              id="ar-text-layout-font-select"
              value={selectedFontId}
              onChange={(e) => {
                setSelectedFontId(e.target.value);
                playStrokeSound(1.1);
              }}
              className="w-full py-1.5 px-2.5 bg-neutral-900 border border-neutral-700 rounded-lg text-white font-medium text-xs focus:outline-none focus:border-cyan-400 cursor-pointer"
            >
              <optgroup label="🌟 15 Google Fonts Tiếng Anh đa dạng">
                {GOOGLE_15_ENGLISH_FONTS.map((font) => (
                  <option key={font.id} value={font.id}>
                    {font.order}. {font.vietnameseTitle}
                  </option>
                ))}
              </optgroup>
              <optgroup label="🌏 Font chuyên dụng khác">
                {OTHER_LANGUAGE_FONTS.map((font) => (
                  <option key={font.id} value={font.id}>
                    {font.vietnameseTitle}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* 1. KÍCH THƯỚC CHỮ (FONT SIZE CONTROL) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-neutral-200 flex items-center gap-1.5 font-semibold">
                <Type className="w-3.5 h-3.5 text-cyan-400" /> Kích thước chữ mẫu (Font Size)
              </span>
              <div className="flex items-center gap-1 bg-neutral-950 px-1.5 py-0.5 rounded-lg border border-neutral-800">
                <button
                  onClick={() => setFontSizePx((prev) => Math.max(16, prev - 2))}
                  className="p-1 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white"
                  title="Giảm 2px"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="font-mono text-cyan-400 font-bold text-xs px-1">{fontSizePx}px</span>
                <button
                  onClick={() => setFontSizePx((prev) => Math.min(110, prev + 2))}
                  className="p-1 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white"
                  title="Tăng 2px"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            <input
              id="ar-slider-font-size"
              type="range"
              min="16"
              max="110"
              step="2"
              value={fontSizePx}
              onChange={(e) => setFontSizePx(parseInt(e.target.value, 10))}
              className="w-full accent-cyan-400 h-2 bg-neutral-700 rounded-lg cursor-pointer"
            />

            {/* Presets */}
            <div className="grid grid-cols-5 gap-1.5 mt-2">
              {[
                { label: '24px (Nhỏ)', size: 24 },
                { label: '36px (Ô ly)', size: 36 },
                { label: '48px (Vừa)', size: 48 },
                { label: '64px (To)', size: 64 },
                { label: '84px (Lớn)', size: 84 },
              ].map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => setFontSizePx(preset.size)}
                  className={`py-1 rounded-lg text-[10px] font-medium border transition truncate ${
                    fontSizePx === preset.size
                      ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold'
                      : 'bg-neutral-800 border-neutral-700/60 text-neutral-400 hover:text-white'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* 2. KHOẢNG CÁCH DÒNG (LINE SPACING SLIDER) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-neutral-200 flex items-center gap-1.5 font-semibold">
                <Layers className="w-3.5 h-3.5 text-emerald-400" /> Khoảng cách dòng (Line Spacing)
              </span>
              <span className="font-mono text-emerald-400 font-bold text-xs">{lineSpacingPx}px</span>
            </div>

            <input
              id="ar-slider-line-spacing"
              type="range"
              min="12"
              max="100"
              step="2"
              value={lineSpacingPx}
              onChange={(e) => setLineSpacingPx(parseInt(e.target.value, 10))}
              className="w-full accent-emerald-400 h-2 bg-neutral-700 rounded-lg cursor-pointer"
            />

            {/* Line spacing presets */}
            <div className="grid grid-cols-4 gap-1.5 mt-2">
              {[
                { label: '1 Ô ly (28px)', px: 28, ratio: 1.4 },
                { label: '1.5 Ô ly (42px)', px: 42, ratio: 1.7 },
                { label: '2 Ô ly (56px)', px: 56, ratio: 2.0 },
                { label: 'Rộng (72px)', px: 72, ratio: 2.4 },
              ].map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => {
                    setLineSpacingPx(preset.px);
                    setLineHeightRatio(preset.ratio);
                  }}
                  className={`py-1 rounded-lg text-[10px] font-medium border transition truncate ${
                    lineSpacingPx === preset.px
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                      : 'bg-neutral-800 border-neutral-700/60 text-neutral-400 hover:text-white'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3. TÍNH NĂNG CUỘN VÀ ĐIỀU HƯỚNG DÒNG (TEXT SCROLL) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-neutral-200 flex items-center gap-1.5 font-semibold">
                <Move className="w-3.5 h-3.5 text-indigo-400" /> Cuộn danh sách dòng (Text Scroll)
              </span>
              <span className="font-mono text-indigo-400 font-bold text-xs">
                {scrollOffsetY}px
              </span>
            </div>

            <input
              id="ar-slider-scroll"
              type="range"
              min="-80"
              max="400"
              step="5"
              value={scrollOffsetY}
              onChange={(e) => setScrollOffsetY(parseInt(e.target.value, 10))}
              className="w-full accent-indigo-400 h-2 bg-neutral-700 rounded-lg cursor-pointer"
            />

            <div className="flex items-center justify-between gap-2 mt-2 flex-wrap">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handlePrevLine}
                  disabled={focusedLineIndex <= 0}
                  className="px-2.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40 text-neutral-200 flex items-center gap-1 text-[11px] font-medium transition"
                >
                  <ArrowUp className="w-3 h-3" /> Dòng trước
                </button>
                <button
                  onClick={handleNextLine}
                  disabled={focusedLineIndex >= textLines.length - 1}
                  className="px-2.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white flex items-center gap-1 text-[11px] font-semibold transition shadow"
                >
                  Dòng sau <ArrowDown className="w-3 h-3" />
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setTextAlign(textAlign === 'center' ? 'left' : 'center')}
                  className={`p-1.5 rounded-lg border text-[11px] transition flex items-center gap-1 ${
                    textAlign === 'left' ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300' : 'bg-neutral-800 border-neutral-700 text-neutral-400'
                  }`}
                  title={textAlign === 'center' ? 'Căn trái' : 'Căn giữa'}
                >
                  {textAlign === 'left' ? <AlignLeft className="w-3.5 h-3.5" /> : <AlignCenter className="w-3.5 h-3.5" />}
                </button>

                <button
                  onClick={() => setFocusLineMode(!focusLineMode)}
                  className={`px-2 py-1 rounded-lg border text-[11px] transition flex items-center gap-1 ${
                    focusLineMode 
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-semibold' 
                      : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:text-white'
                  }`}
                >
                  <Eye className="w-3 h-3" /> {focusLineMode ? 'Sáng dòng: Bật' : 'Sáng dòng: Tắt'}
                </button>
              </div>
            </div>
          </div>

          {/* Direct Edit Button */}
          <div className="pt-2 border-t border-neutral-800 flex items-center justify-between">
            <span className="text-neutral-400 text-[11px]">
              Tổng: {textLines.length} dòng | {currentText.length} ký tự
            </span>
            <button
              id="ar-open-text-modal-btn"
              onClick={() => {
                setTempEditText(currentText);
                setIsEditingText(true);
              }}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow transition"
            >
              <Edit3 className="w-3.5 h-3.5" /> Soạn / Đổi bài thơ
            </button>
          </div>
        </div>
      )}

      {/* TAB: FONT SELECTOR */}
      {activeTab === 'font_selector' && (
        <div className="space-y-3.5 text-xs animate-in fade-in duration-200">
          <FontSelector
            selectedFontId={selectedFontId}
            onSelectFont={(id) => {
              setSelectedFontId(id);
              playStrokeSound(1.1);
            }}
            language={language}
            crispOutline={crispOutline}
            onToggleCrispOutline={setCrispOutline}
            letterSpacingEm={letterSpacingEm}
            onChangeLetterSpacing={setLetterSpacingEm}
            compact={true}
          />

          {/* Contrast Boost & Bold Tracing for Camera on White Paper */}
          <div className="p-3 rounded-2xl bg-neutral-950/90 border border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <span className="text-xs font-bold text-white block">Nét đậm đồ chữ (Bold Tracing)</span>
                <span className="text-[10px] text-neutral-400">Tăng độ tương phản chống lóa sáng trên mặt giấy trắng</span>
              </div>
            </div>
            <button
              id="ar-toggle-bold-tracing-btn"
              onClick={() => setBoldTracing(!boldTracing)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                boldTracing
                  ? 'bg-amber-500 text-neutral-950 border-amber-400 shadow-md'
                  : 'bg-neutral-800 text-neutral-400 border-neutral-700'
              }`}
            >
              {boldTracing ? 'BẬT (Đậm nét)' : 'TẮT (Nét vừa)'}
            </button>
          </div>
        </div>
      )}

      {/* TAB: STEP-BY-STEP STROKE GUIDANCE */}
      {activeTab === 'step_stroke' && (
        <div className="space-y-3 text-xs animate-in fade-in duration-150">
          {/* Mode switcher: Step-by-Step vs Full Character */}
          <div className="flex items-center justify-between gap-2 p-1 bg-neutral-950 rounded-xl border border-neutral-800">
            <button
              onClick={() => setStrokeMode('step')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1.5 ${
                strokeMode === 'step' ? 'bg-cyan-600 text-white shadow' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" /> Tô từng nét (Step-by-step)
            </button>
            <button
              onClick={() => setStrokeMode('full')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1.5 ${
                strokeMode === 'full' ? 'bg-cyan-600 text-white shadow' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" /> Hiện đủ toàn bộ nét
            </button>
          </div>

          {strokeMode === 'step' && charStrokes.length > 0 && (
            <>
              {/* Step Navigation Controls */}
              <div className="flex items-center justify-between gap-2">
                <button
                  onClick={handleRestartSteps}
                  className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition"
                  title="Về nét 1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={handlePrevStep}
                  disabled={currentStep <= 1}
                  className="px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40 text-white font-medium flex items-center gap-1 transition"
                >
                  <ChevronLeft className="w-4 h-4" /> Nét trước
                </button>

                <div className="px-3 py-1.5 bg-neutral-950 rounded-xl border border-neutral-800 font-mono text-center">
                  <span className="text-cyan-400 font-bold text-sm">{currentStep}</span>
                  <span className="text-neutral-500"> / {charStrokes.length}</span>
                </div>

                <button
                  onClick={handleNextStep}
                  disabled={currentStep >= charStrokes.length}
                  className="px-3 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white font-semibold flex items-center gap-1 shadow transition"
                >
                  Nét sau <ChevronRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                  className={`p-2 rounded-xl transition ${
                    isAutoPlaying 
                      ? 'bg-amber-500 text-neutral-950 font-bold' 
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  }`}
                  title={isAutoPlaying ? 'Tạm dừng tự động chạy' : 'Tự động chạy nét theo nhịp'}
                >
                  {isAutoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                </button>
              </div>

              {/* Stroke Step Pills */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1">
                {charStrokes.map((s, idx) => (
                  <button
                    key={`step-btn-${s.id}`}
                    onClick={() => {
                      setCurrentStep(idx + 1);
                      playStrokeSound((idx + 1) * 0.2 + 0.9);
                    }}
                    className={`flex-1 min-w-[54px] py-1.5 rounded-lg text-[11px] font-mono border transition text-center ${
                      idx + 1 === currentStep
                        ? 'bg-red-500 text-white border-red-400 font-bold shadow'
                        : idx + 1 < currentStep
                        ? 'bg-cyan-950/60 text-cyan-300 border-cyan-800'
                        : 'bg-neutral-800/80 text-neutral-500 border-neutral-800'
                    }`}
                  >
                    Nét {s.id}
                  </button>
                ))}
              </div>

              {/* Active Stroke Hint */}
              {activeStrokeInfo && (
                <div className="p-2.5 rounded-xl bg-neutral-950/90 border border-neutral-800 text-neutral-300 flex items-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 mt-1 shrink-0 animate-ping" />
                  <div>
                    <span className="font-semibold text-white">{activeStrokeInfo.label}</span>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      Đặt ngòi bút thật vào điểm tròn màu đỏ và đồ theo hướng nét hiển thị trên màn hình.
                    </p>
                  </div>
                </div>
              )}
            </>
          )}

          {tips && (
            <div className="text-[11px] text-amber-300/90 bg-amber-950/30 p-2 rounded-xl border border-amber-800/30">
              💡 Mẹo viết: {tips}
            </div>
          )}
        </div>
      )}

      {/* TAB: OPACITY, SIZE, COLOR, ZOOM */}
      {activeTab === 'opacity_size' && (
        <div className="space-y-4 text-xs animate-in fade-in duration-150">
          {/* 1. TEXT OPACITY SLIDER (10% - 100%, MẶC ĐỊNH 40%) */}
          <div className="bg-neutral-900/60 p-3 rounded-2xl border border-neutral-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-neutral-200 flex items-center gap-1.5 font-semibold">
                <Sun className="w-4 h-4 text-amber-400" /> 1. Độ mờ chữ đè (Opacity)
              </span>
              <span className="font-mono text-cyan-400 font-bold bg-cyan-950/70 border border-cyan-800/50 px-2 py-0.5 rounded-lg text-[11px]">
                {Math.round(opacity * 100)}%
              </span>
            </div>

            <p className="text-[11px] text-neutral-400 leading-relaxed">
              Giúp chữ không bị quá rõ làm đè mất nét bút thật trên giấy, tạo cảm giác dễ nhìn và dễ đồ nét hơn (khuyên dùng 40%).
            </p>

            <input
              id="ar-slider-opacity"
              type="range"
              min="0.10"
              max="1.00"
              step="0.05"
              value={opacity}
              onChange={(e) => setOpacity(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 h-2 bg-neutral-700 rounded-lg cursor-pointer"
            />

            {/* Quick Preset Buttons for Opacity */}
            <div className="grid grid-cols-5 gap-1 pt-1">
              {[
                { label: '20%', val: 0.20, note: 'Rất mờ' },
                { label: '40% ★', val: 0.40, note: 'Chuẩn' },
                { label: '60%', val: 0.60, note: 'Vừa' },
                { label: '80%', val: 0.80, note: 'Rõ' },
                { label: '100%', val: 1.00, note: 'Đậm' },
              ].map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => setOpacity(preset.val)}
                  className={`py-1 px-0.5 rounded-lg text-[10px] font-medium border text-center transition ${
                    Math.abs(opacity - preset.val) < 0.05
                      ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold shadow-sm'
                      : 'bg-neutral-800/90 border-neutral-700/60 text-neutral-400 hover:text-white'
                  }`}
                  title={preset.note}
                >
                  <div>{preset.label}</div>
                  <div className="text-[9px] text-neutral-500">{preset.note}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 2. TEXT COLOR PICKER & QUICK PALETTE */}
          <div className="bg-neutral-900/60 p-3 rounded-2xl border border-neutral-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-neutral-200 flex items-center gap-1.5 font-semibold">
                <Palette className="w-4 h-4 text-rose-400" /> 2. Màu sắc văn bản phản quang
              </span>
              <div className="flex items-center gap-1.5 bg-neutral-800 border border-neutral-700 px-2 py-0.5 rounded-lg">
                <span 
                  className="w-3 h-3 rounded-full border border-white/60 shadow-sm shrink-0" 
                  style={{ backgroundColor: textColor }} 
                />
                <span className="font-mono text-[11px] text-neutral-300">{textColor.toUpperCase()}</span>
              </div>
            </div>

            <p className="text-[11px] text-neutral-400 leading-relaxed">
              Các gam màu phản quang nổi bật giúp nét chữ luôn tương phản tốt với mọi màu mực bút bi thật (đen, xanh, đỏ).
            </p>

            {/* Quick Palette: 5 Presets */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
              {NEON_COLOR_PRESETS.map((preset) => {
                const isSelected = textColor.toLowerCase() === preset.hex.toLowerCase();
                return (
                  <button
                    key={preset.id}
                    id={`color-preset-${preset.id}`}
                    onClick={() => {
                      setTextColor(preset.hex);
                      playStrokeSound(1.2);
                    }}
                    className={`p-2 rounded-xl border text-left transition flex items-center gap-2 ${
                      isSelected
                        ? 'bg-neutral-800 border-white/80 shadow-md ring-1 ring-white/50'
                        : 'bg-neutral-800/70 border-neutral-700/60 hover:bg-neutral-800'
                    }`}
                    title={preset.desc}
                  >
                    <span
                      className="w-4 h-4 rounded-full shrink-0 border border-white/40 shadow-sm"
                      style={{ 
                        backgroundColor: preset.hex,
                        boxShadow: preset.hex === '#000000' ? 'none' : `0 0 8px ${preset.hex}88`
                      }}
                    />
                    <div className="min-w-0">
                      <div className="font-bold text-[11px] text-neutral-200 truncate">{preset.label}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Custom Color Input */}
            <div className="flex items-center justify-between pt-1 border-t border-neutral-800">
              <span className="text-neutral-400 text-[11px]">Tùy chọn màu riêng:</span>
              <label className="flex items-center gap-2 cursor-pointer bg-neutral-800 hover:bg-neutral-750 px-2.5 py-1 rounded-lg border border-neutral-700 text-[11px] text-neutral-300 transition">
                <span>Bảng màu mở rộng</span>
                <input
                  id="ar-custom-color-picker"
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent"
                />
              </label>
            </div>
          </div>

          {/* 3. CAMERA ZOOM */}
          <div className="bg-neutral-900/60 p-3 rounded-2xl border border-neutral-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-neutral-200 flex items-center gap-1.5 font-semibold">
                <ZoomIn className="w-4 h-4 text-cyan-400" /> 3. Thu phóng Camera (Zoom 1x - 5x)
              </span>
              <div className="flex items-center gap-1">
                <span className="font-mono text-cyan-400 font-bold bg-cyan-950/70 border border-cyan-800/50 px-2 py-0.5 rounded-lg text-[11px]">
                  {zoomLevel.toFixed(1)}x
                </span>
                <span className="text-[10px] text-neutral-400 bg-neutral-800 border border-neutral-700 px-1.5 py-0.5 rounded font-mono">
                  {isHardwareZoomActive ? '✨ Cảm biến' : 'Kỹ thuật số CSS'}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-neutral-400 leading-relaxed">
              Phóng to mặt giấy để nhìn rõ từng thớ giấy và độ sắc của ngòi bút thật khi đồ chữ.
            </p>

            <input
              id="ar-slider-zoom"
              type="range"
              min="1.0"
              max="5.0"
              step="0.1"
              value={zoomLevel}
              onChange={(e) => handleZoomChange(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 h-2 bg-neutral-700 rounded-lg cursor-pointer"
            />

            {/* Quick Zoom Buttons */}
            <div className="grid grid-cols-5 gap-1 pt-1">
              {[
                { label: '1.0x', val: 1.0, note: 'Gốc' },
                { label: '1.5x', val: 1.5, note: 'Gần' },
                { label: '2.0x', val: 2.0, note: 'Rõ nét' },
                { label: '3.0x', val: 3.0, note: 'Chi tiết' },
                { label: '5.0x', val: 5.0, note: 'Cực đại' },
              ].map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => handleZoomChange(preset.val)}
                  className={`py-1 px-0.5 rounded-lg text-[10px] font-medium border text-center transition ${
                    Math.abs(zoomLevel - preset.val) < 0.08
                      ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold shadow-sm'
                      : 'bg-neutral-800/90 border-neutral-700/60 text-neutral-400 hover:text-white'
                  }`}
                >
                  <div>{preset.label}</div>
                  <div className="text-[9px] text-neutral-500">{preset.note}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 4. SCALE & ROTATION */}
          <div className="bg-neutral-900/60 p-3 rounded-2xl border border-neutral-800 space-y-3">
            <div className="text-neutral-300 font-semibold flex items-center gap-1.5">
              <Maximize2 className="w-4 h-4 text-emerald-400" /> 4. Cỡ chữ & Góc xoay dòng kẻ
            </div>

            {/* Scale Slider */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-neutral-400 text-[11px]">Cỡ chữ (Khớp ô vở thật):</span>
                <span className="font-mono text-emerald-400 font-bold">{scale.toFixed(2)}x</span>
              </div>
              <input
                id="ar-slider-scale"
                type="range"
                min="0.4"
                max="2.5"
                step="0.05"
                value={scale}
                onChange={(e) => setScale(parseFloat(e.target.value))}
                className="w-full accent-emerald-400 h-2 bg-neutral-700 rounded-lg cursor-pointer"
              />
            </div>

            {/* Rotation Slider */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-neutral-400 text-[11px] flex items-center gap-1">
                  <RotateCw className="w-3 h-3 text-indigo-400" /> Góc nghiêng (Theo góc vở):
                </span>
                <span className="font-mono text-indigo-400 font-bold">{rotation}°</span>
              </div>
              <input
                id="ar-slider-rotation"
                type="range"
                min="-45"
                max="45"
                step="1"
                value={rotation}
                onChange={(e) => setRotation(parseInt(e.target.value, 10))}
                className="w-full accent-indigo-400 h-2 bg-neutral-700 rounded-lg cursor-pointer"
              />
            </div>

            {/* Pan Position & Reset Controls */}
            <div className="pt-2 border-t border-neutral-800 flex items-center justify-between">
              <span className="text-neutral-400 text-[11px] font-mono">
                Tọa độ: X:{Math.round(position.x)}px | Y:{Math.round(position.y)}px
              </span>
              <button
                onClick={handleResetPosition}
                className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white text-[11px] flex items-center gap-1 transition"
              >
                <RefreshCw className="w-3 h-3" /> Căn giữa lại
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB: GRID & INK COLOR */}
      {activeTab === 'grid_style' && (
        <div className="space-y-3.5 text-xs animate-in fade-in duration-150">
          {/* Grid Selector */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-neutral-300 flex items-center gap-1.5 font-medium">
                <Grid className="w-3.5 h-3.5 text-cyan-400" /> Kiểu lưới dòng kẻ:
              </span>
              <button
                onClick={() => setShowGrid(!showGrid)}
                className={`text-[10px] px-2 py-0.5 rounded-full border transition ${
                  showGrid ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-semibold' : 'bg-neutral-800 border-neutral-700 text-neutral-400'
                }`}
              >
                {showGrid ? 'Lưới: Đang bật' : 'Lưới: Đang tắt'}
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {[
                { id: 'oly_vi', label: 'Ô ly Vở VN' },
                { id: 'tian_zh', label: 'Lưới Chữ Điền (田)' },
                { id: 'mizi_zh', label: 'Lưới Chữ Mễ (米)' },
                { id: 'four_line_en', label: '4 Dòng Kẻ (EN)' },
              ].map((g) => (
                <button
                  key={g.id}
                  id={`grid-btn-${g.id}`}
                  onClick={() => {
                    setGridType(g.id as GridType);
                    setShowGrid(true);
                  }}
                  className={`px-2 py-2 rounded-xl border text-center truncate transition ${
                    gridType === g.id && showGrid
                      ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold'
                      : 'bg-neutral-800/80 border-neutral-700/60 text-neutral-400 hover:text-white'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>

            {/* Grid Opacity */}
            {showGrid && (
              <div className="mt-2 flex items-center gap-2">
                <span className="text-neutral-400 text-[11px] shrink-0">Độ mờ lưới:</span>
                <input
                  type="range"
                  min="0.1"
                  max="0.9"
                  step="0.05"
                  value={gridOpacity}
                  onChange={(e) => setGridOpacity(parseFloat(e.target.value))}
                  className="flex-1 accent-cyan-400 h-1.5 bg-neutral-700 rounded-lg cursor-pointer"
                />
                <span className="font-mono text-neutral-400 text-[11px] w-8 text-right">{Math.round(gridOpacity * 100)}%</span>
              </div>
            )}
          </div>

          {/* Ink Style */}
          <div>
            <div className="text-neutral-300 mb-1.5 font-medium flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-rose-400" /> Màu mực hắt hình:
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {[
                { id: 'neon_ar', label: 'Dạ quang AR' },
                { id: 'red_guide', label: 'Mực đỏ chấm' },
                { id: 'solid_ink', label: 'Mực đen đậm' },
                { id: 'dotted_trace', label: 'Nét đứt tập tô' },
              ].map((s) => (
                <button
                  key={s.id}
                  id={`style-btn-${s.id}`}
                  onClick={() => setProjectionStyle(s.id as ProjectionStyle)}
                  className={`px-2 py-2 rounded-xl border text-center truncate transition ${
                    projectionStyle === s.id
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                      : 'bg-neutral-800/80 border-neutral-700/60 text-neutral-400 hover:text-white'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
