import React from 'react';
import { 
  Sun, 
  Palette, 
  ZoomIn, 
  ZoomOut, 
  Sparkles, 
  ShieldCheck, 
  RefreshCw, 
  Check, 
  Info,
  Maximize2
} from 'lucide-react';

export interface VisualZoomControlsProps {
  // 1. Text Opacity Slider
  opacity: number; // 0.10 to 1.00 (default 0.40)
  onChangeOpacity: (val: number) => void;

  // 2. Text Color Picker & Presets
  textColor: string;
  onChangeTextColor: (color: string) => void;

  // 3. Camera Zoom
  cameraZoom: number; // 1.0 to 5.0
  onChangeCameraZoom: (zoom: number) => void;
  isHardwareZoomSupported: boolean;
  isHardwareZoomActive: boolean;
  zoomMin?: number;
  zoomMax?: number;
  zoomStep?: number;

  // Optional compact mode
  compact?: boolean;
}

// 5 High-contrast fluorescent & standard colors for paper writing
export const TEXT_COLOR_PRESETS = [
  { 
    id: 'neon_pink', 
    label: 'Đỏ Neon', 
    color: '#FF0055', 
    description: 'Nổi bật nhất khi viết bút bi xanh hoặc đen',
    contrastTip: 'Tương phản cực mạnh trên giấy trắng'
  },
  { 
    id: 'neon_green', 
    label: 'Xanh Lá Neon', 
    color: '#00FF66', 
    description: 'Phản quang sắc nét, ngắm lâu không mỏi mắt',
    contrastTip: 'Rất rõ khi dùng bút bi đen hoặc đỏ'
  },
  { 
    id: 'neon_blue', 
    label: 'Xanh Dương', 
    color: '#0099FF', 
    description: 'Tone màu xanh dịu mắt, dễ phân biệt với nét mực thật',
    contrastTip: 'Hoàn hảo khi viết bút gel đỏ hoặc đen'
  },
  { 
    id: 'deep_black', 
    label: 'Đen chuẩn', 
    color: '#000000', 
    description: 'Màu mực in truyền thống, tương phản tuyệt đối',
    contrastTip: 'Thích hợp khi viết bút chì hoặc bút màu'
  },
  { 
    id: 'bright_yellow', 
    label: 'Vàng Bright', 
    color: '#FFCC00', 
    description: 'Dạ quang sáng rực, như bút nhớ dòng',
    contrastTip: 'Nổi rõ trên cả giấy trắng kẻ ô ly hoặc giấy ngả vàng'
  },
];

export const OPACITY_PRESETS = [
  { label: '10%', sub: 'Siêu mờ', val: 0.10 },
  { label: '25%', sub: 'Nhạt', val: 0.25 },
  { label: '40% ★', sub: 'Chuẩn', val: 0.40 },
  { label: '65%', sub: 'Rõ', val: 0.65 },
  { label: '100%', sub: 'Đậm', val: 1.00 },
];

export const ZOOM_PRESETS = [
  { label: '1.0x', sub: 'Toàn cảnh', val: 1.0 },
  { label: '1.5x', sub: 'Vừa', val: 1.5 },
  { label: '2.0x', sub: 'Chi tiết', val: 2.0 },
  { label: '3.0x', sub: 'Cận cảnh', val: 3.0 },
  { label: '5.0x', sub: 'Cực đại', val: 5.0 },
];

export const VisualZoomControls: React.FC<VisualZoomControlsProps> = ({
  opacity,
  onChangeOpacity,
  textColor,
  onChangeTextColor,
  cameraZoom,
  onChangeCameraZoom,
  isHardwareZoomSupported,
  isHardwareZoomActive,
  zoomMin = 1.0,
  zoomMax = 5.0,
  zoomStep = 0.1,
  compact = false,
}) => {
  const currentPreset = TEXT_COLOR_PRESETS.find(
    (p) => p.color.toLowerCase() === textColor.toLowerCase()
  );

  return (
    <div className="space-y-4">
      {/* Header with quick summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800 pb-2.5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-cyan-500/20 text-cyan-400">
              <Sparkles className="w-4 h-4" />
            </span>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              Bộ công cụ điều chỉnh thị giác & Camera
            </h4>
          </div>
          <p className="text-[11px] text-neutral-400 mt-0.5">
            Tối ưu độ mờ chữ mờ, màu phản quang chống lóa và thu phóng camera 1x - 5x
          </p>
        </div>

        {/* Live Status Badges */}
        <div className="flex items-center gap-2">
          {isHardwareZoomSupported && isHardwareZoomActive ? (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950/70 border border-emerald-700/60 text-emerald-300 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Zoom Phần cứng
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sky-950/70 border border-sky-700/60 text-sky-300 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
              Zoom Kỹ thuật số CSS
            </span>
          )}
        </div>
      </div>

      {/* SECTION 1: CHỈNH ĐỘ MỜ VĂN BẢN (TEXT OPACITY SLIDER) */}
      <div className="p-3.5 rounded-2xl bg-neutral-950/90 border border-neutral-800 space-y-2.5">
        <div className="flex items-center justify-between">
          <label 
            htmlFor="ar-text-opacity-slider" 
            className="text-xs font-bold text-neutral-200 flex items-center gap-2"
          >
            <Sun className="w-4 h-4 text-amber-400" />
            <span>Độ mờ văn bản (Text Opacity):</span>
          </label>

          <div className="flex items-center gap-2">
            {Math.round(opacity * 100) === 40 && (
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold">
                Mức chuẩn 40%
              </span>
            )}
            <span className="font-mono text-cyan-400 font-bold text-xs bg-cyan-950/70 px-2.5 py-0.5 rounded-lg border border-cyan-800/60">
              {Math.round(opacity * 100)}%
            </span>
          </div>
        </div>

        {/* Range Slider 10% -> 100% */}
        <div className="space-y-1">
          <input
            id="ar-text-opacity-slider"
            type="range"
            min="0.10"
            max="1.00"
            step="0.05"
            value={opacity}
            onChange={(e) => onChangeOpacity(parseFloat(e.target.value))}
            className="w-full accent-cyan-400 h-2 bg-neutral-800 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-neutral-400 font-mono">
            <span>10% (Rất mờ)</span>
            <span className="text-amber-400 font-semibold">40% (Chuẩn viết đồ nét)</span>
            <span>100% (Đậm đặc)</span>
          </div>
        </div>

        {/* Quick Opacity Presets */}
        <div className="grid grid-cols-5 gap-1.5 pt-1">
          {OPACITY_PRESETS.map((preset) => {
            const isSelected = Math.abs(opacity - preset.val) < 0.04;
            return (
              <button
                key={preset.label}
                type="button"
                id={`opacity-preset-${Math.round(preset.val * 100)}`}
                onClick={() => onChangeOpacity(preset.val)}
                className={`py-1.5 px-1 rounded-xl text-center border transition flex flex-col items-center justify-center ${
                  isSelected
                    ? 'bg-cyan-500 text-neutral-950 border-cyan-400 font-bold shadow-md shadow-cyan-950/50'
                    : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-850'
                }`}
              >
                <span className="text-xs font-bold leading-tight">{preset.label}</span>
                <span className={`text-[9px] ${isSelected ? 'text-neutral-900' : 'text-neutral-400'}`}>
                  {preset.sub}
                </span>
              </button>
            );
          })}
        </div>

        {/* Helpful Tip */}
        <div className="flex items-start gap-1.5 p-2 rounded-xl bg-neutral-900/80 border border-neutral-800/80 text-[11px] text-neutral-400">
          <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
          <span>
            <strong>Mẹo kê giấy:</strong> Mức <span className="text-amber-300 font-semibold">40%</span> giúp chữ mẫu không bị quá đậm che mất nét mực thật trên giấy, vừa nhìn rõ ngòi bút vừa dễ bám theo đường nét.
          </span>
        </div>
      </div>

      {/* SECTION 2: CHỈNH MÀU SẮC VĂN BẢN (TEXT COLOR PICKER & PRESETS) */}
      <div className="p-3.5 rounded-2xl bg-neutral-950/90 border border-neutral-800 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-neutral-200 flex items-center gap-2">
            <Palette className="w-4 h-4 text-rose-400" />
            <span>Màu sắc văn bản (Text Color):</span>
          </label>

          <div className="flex items-center gap-2">
            <span 
              className="w-4 h-4 rounded-full border border-white/40 shadow-sm"
              style={{ backgroundColor: textColor }}
            />
            <span className="font-mono text-white text-xs uppercase bg-neutral-900 px-2 py-0.5 rounded border border-neutral-700">
              {textColor}
            </span>
          </div>
        </div>

        {/* 5 Quick Palette Buttons */}
        <div>
          <div className="text-[11px] font-semibold text-neutral-400 mb-1.5">
            Bảng màu phản quang nổi bật (Quick Palette):
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {TEXT_COLOR_PRESETS.map((preset) => {
              const isSelected = textColor.toLowerCase() === preset.color.toLowerCase();
              return (
                <button
                  key={preset.id}
                  type="button"
                  id={`color-preset-${preset.id}`}
                  onClick={() => onChangeTextColor(preset.color)}
                  className={`p-2 rounded-xl border text-left transition flex flex-col justify-between relative group ${
                    isSelected
                      ? 'bg-neutral-800 border-white ring-2 ring-white/50 shadow-lg'
                      : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-850'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span 
                      className="w-6 h-6 rounded-full border border-white/30 shadow-inner flex items-center justify-center shrink-0"
                      style={{ backgroundColor: preset.color }}
                    >
                      {isSelected && (
                        <Check className={`w-3.5 h-3.5 ${preset.color === '#000000' || preset.color === '#FF0055' ? 'text-white' : 'text-black'}`} />
                      )}
                    </span>
                    <span className="text-[10px] font-mono text-neutral-400">
                      {preset.color}
                    </span>
                  </div>

                  <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition truncate">
                    {preset.label}
                  </span>

                  <span className="text-[9px] text-neutral-400 mt-0.5 line-clamp-1">
                    {preset.contrastTip}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Color Picker Input */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-900/90 border border-neutral-800 gap-3">
          <div className="flex items-center gap-2">
            <div className="relative overflow-hidden w-9 h-9 rounded-xl border-2 border-neutral-600 shadow cursor-pointer shrink-0">
              <input
                id="ar-custom-color-picker"
                type="color"
                value={textColor}
                onChange={(e) => onChangeTextColor(e.target.value)}
                className="absolute -inset-2 w-16 h-16 cursor-pointer opacity-0"
              />
              <div 
                className="w-full h-full"
                style={{ backgroundColor: textColor }}
              />
            </div>
            <div>
              <label 
                htmlFor="ar-custom-color-picker" 
                className="text-xs font-semibold text-white block cursor-pointer hover:text-cyan-300 transition"
              >
                Chọn màu tùy chỉnh (Color Picker)
              </label>
              <span className="text-[10px] text-neutral-400">
                Nhấn vào ô màu để mở bảng chọn màu HEX / RGB
              </span>
            </div>
          </div>

          <span className="text-[11px] font-mono text-cyan-300 px-2 py-1 rounded-lg bg-neutral-950 border border-neutral-800">
            {textColor.toUpperCase()}
          </span>
        </div>

        {/* Contrast advice for physical pens */}
        {currentPreset && (
          <div className="p-2 rounded-xl bg-cyan-950/40 border border-cyan-800/40 text-[11px] text-cyan-200">
            💡 <strong>Tương thích mực viết:</strong> {currentPreset.description}
          </div>
        )}
      </div>

      {/* SECTION 3: THU PHÓNG CAMERA (DIGITAL & HARDWARE CAMERA ZOOM 1X - 5X) */}
      <div className="p-3.5 rounded-2xl bg-neutral-950/90 border border-neutral-800 space-y-2.5">
        <div className="flex items-center justify-between">
          <label 
            htmlFor="ar-camera-zoom-slider" 
            className="text-xs font-bold text-neutral-200 flex items-center gap-2"
          >
            <ZoomIn className="w-4 h-4 text-emerald-400" />
            <span>Thu phóng Camera (Camera Zoom 1x - 5x):</span>
          </label>

          <div className="flex items-center gap-2">
            <span className="font-mono text-emerald-400 font-bold text-xs bg-emerald-950/70 px-2.5 py-0.5 rounded-lg border border-emerald-800/60">
              {cameraZoom.toFixed(1)}x
            </span>
            {cameraZoom > 1.05 && (
              <button
                type="button"
                id="reset-camera-zoom-btn"
                onClick={() => onChangeCameraZoom(1.0)}
                className="px-2 py-0.5 rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white text-[10px] flex items-center gap-1 transition"
                title="Khôi phục zoom 1x gốc"
              >
                <RefreshCw className="w-2.5 h-2.5" /> 1x
              </button>
            )}
          </div>
        </div>

        {/* Zoom Range Slider 1x -> 5x */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onChangeCameraZoom(Math.max(1.0, cameraZoom - 0.2))}
              className="p-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800"
              title="Thu nhỏ (-0.2x)"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>

            <input
              id="ar-camera-zoom-slider"
              type="range"
              min="1.0"
              max="5.0"
              step="0.1"
              value={cameraZoom}
              onChange={(e) => onChangeCameraZoom(parseFloat(e.target.value))}
              className="flex-1 accent-emerald-400 h-2 bg-neutral-800 rounded-lg cursor-pointer"
            />

            <button
              type="button"
              onClick={() => onChangeCameraZoom(Math.min(5.0, cameraZoom + 0.2))}
              className="p-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800"
              title="Phóng to (+0.2x)"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex justify-between text-[10px] text-neutral-400 font-mono">
            <span>1.0x (Gốc)</span>
            <span>2.5x (Chi tiết)</span>
            <span>5.0x (Cực đại)</span>
          </div>
        </div>

        {/* Quick Zoom Presets */}
        <div className="grid grid-cols-5 gap-1.5 pt-1">
          {ZOOM_PRESETS.map((preset) => {
            const isSelected = Math.abs(cameraZoom - preset.val) < 0.15;
            return (
              <button
                key={preset.label}
                type="button"
                id={`zoom-preset-${preset.val.toFixed(1)}`}
                onClick={() => onChangeCameraZoom(preset.val)}
                className={`py-1.5 px-1 rounded-xl text-center border transition flex flex-col items-center justify-center ${
                  isSelected
                    ? 'bg-emerald-500 text-neutral-950 border-emerald-400 font-bold shadow-md shadow-emerald-950/50'
                    : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-850'
                }`}
              >
                <span className="text-xs font-bold leading-tight">{preset.label}</span>
                <span className={`text-[9px] ${isSelected ? 'text-neutral-900' : 'text-neutral-400'}`}>
                  {preset.sub}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tech Mechanism Indicator */}
        <div className="p-2 rounded-xl bg-neutral-900/80 border border-neutral-800/80 text-[11px] text-neutral-400 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${isHardwareZoomSupported && isHardwareZoomActive ? 'bg-emerald-400' : 'bg-sky-400'}`} />
            <span>
              Cơ chế: {isHardwareZoomSupported && isHardwareZoomActive 
                ? 'Camera Hardware Optical/Digital Zoom (applyConstraints)' 
                : 'Digital CSS Zoom (transform scale luồng video)'}
            </span>
          </div>
          <span className="font-mono text-[10px] text-neutral-500">
            {isHardwareZoomSupported ? 'Hỗ trợ HW' : 'CSS Fallback'}
          </span>
        </div>
      </div>
    </div>
  );
};
