import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  Lock, 
  Unlock, 
  Type, 
  Grid, 
  Sun, 
  Moon, 
  ZoomIn, 
  ZoomOut, 
  Sliders, 
  Maximize2, 
  Minimize2,
  ChevronLeft,
  ChevronRight,
  Eye,
  Info
} from 'lucide-react';
import { GridType } from '../types';
import { 
  GOOGLE_15_ENGLISH_FONTS, 
  OTHER_LANGUAGE_FONTS, 
  getFontOptionById, 
  FontOption 
} from '../data/fontOptions';

interface ScreenLightboxProps {
  initialText?: string;
  initialFontId?: string;
  initialGridType?: GridType;
  onBackToMenu: () => void;
}

export const ScreenLightbox: React.FC<ScreenLightboxProps> = ({
  initialText = 'Nét chữ nết người\nRèn đức luyện tài\nCó công mài sắt có ngày nên kim',
  initialFontId = 'itim',
  initialGridType = 'oly_vi',
  onBackToMenu,
}) => {
  const [text, setText] = useState(initialText);
  const [fontId, setFontId] = useState(initialFontId);
  const [gridType, setGridType] = useState<GridType>(initialGridType);
  const [fontSize, setFontSize] = useState<number>(44); // px
  const [textColor, setTextColor] = useState<string>('#1e293b');
  const [textOpacity, setTextOpacity] = useState<number>(0.85);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [themeMode, setThemeMode] = useState<'light' | 'invert'>('light');
  const [viewMode, setViewMode] = useState<'single_line' | 'multi_line'>('single_line');
  const [currentLineIndex, setCurrentLineIndex] = useState<number>(0);
  const [unlockProgress, setUnlockProgress] = useState<number>(0);

  const textLines = text.split('\n').filter(l => l.trim().length > 0);
  const currentFont = getFontOptionById(fontId);

  // Auto handle wake lock to prevent screen sleep while tracing
  useEffect(() => {
    let wakeLockSentinel: any = null;
    if ('wakeLock' in navigator) {
      (navigator as any).wakeLock?.request('screen')
        .then((lock: any) => {
          wakeLockSentinel = lock;
        })
        .catch(() => {
          // Wake lock permission might be denied
        });
    }

    return () => {
      if (wakeLockSentinel) {
        wakeLockSentinel.release().catch(() => {});
      }
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div 
      className={`w-full h-[100dvh] overflow-hidden flex flex-col select-none transition-colors duration-300 ${
        themeMode === 'light' ? 'bg-white text-neutral-900' : 'bg-neutral-950 text-white'
      }`}
      style={{ height: '100dvh', maxHeight: '100dvh' }}
    >
      {/* Top Floating Control Bar (Hidden when locked) */}
      {!isLocked && (
        <header className="z-30 px-3 sm:px-5 py-2.5 bg-neutral-900/95 text-white backdrop-blur-md border-b border-neutral-800 flex flex-col gap-2 shrink-0 shadow-lg">
          {/* Row 1: Navigation, title, and Lock button */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button
                id="lightbox-back-btn"
                onClick={onBackToMenu}
                className="px-3 py-2 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
                title="Quay lại danh mục"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Quay lại</span>
              </button>

              <div className="flex items-center gap-1.5">
                <span className="text-base sm:text-lg">🔍</span>
                <span className="text-xs sm:text-sm font-black text-white">Coi Kiểu Chữ & Kê Giấy</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setThemeMode(t => t === 'light' ? 'invert' : 'light')}
                className="px-2.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold text-xs"
                title="Đổi màu nền"
              >
                {themeMode === 'light' ? '🌙 Tối' : '☀️ Trắng'}
              </button>

              {/* Palm rejection Lock button: Prominent & Large */}
              <button
                id="lightbox-lock-btn"
                onClick={() => setIsLocked(true)}
                className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-lg shadow-amber-950/50 transition active:scale-95 cursor-pointer shrink-0"
              >
                <Lock className="w-4 h-4" />
                <span>Khóa chạm để kê giấy 🔒</span>
              </button>
            </div>
          </div>

          {/* Row 2: Font selection, Grid selection, Size controls */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-neutral-800/80">
            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
              {/* Font selector */}
              <select
                value={fontId}
                onChange={(e) => setFontId(e.target.value)}
                className="py-1.5 px-3 bg-neutral-800 border border-neutral-700 rounded-xl text-xs sm:text-sm font-bold text-white flex-1 max-w-[200px] truncate cursor-pointer"
              >
                <optgroup label="Font Tiếng Việt cho bé">
                  {OTHER_LANGUAGE_FONTS.map(f => (
                    <option key={f.id} value={f.id}>{f.vietnameseTitle}</option>
                  ))}
                </optgroup>
                <optgroup label="15 Font Google Tiếng Anh">
                  {GOOGLE_15_ENGLISH_FONTS.map(f => (
                    <option key={f.id} value={f.id}>{f.order}. {f.vietnameseTitle}</option>
                  ))}
                </optgroup>
              </select>

              {/* Grid selector */}
              <select
                value={gridType}
                onChange={(e) => setGridType(e.target.value as GridType)}
                className="py-1.5 px-2.5 bg-neutral-800 border border-neutral-700 rounded-xl text-xs sm:text-sm font-bold text-white cursor-pointer"
              >
                <option value="oly_vi">4 Ô ly Tiểu học VN</option>
                <option value="four_line_en">4 Dòng kẻ Anh</option>
                <option value="calligraphy_55">Nghiêng 55°</option>
                <option value="mizi_zh">Ô Mễ chữ Hán</option>
                <option value="plain">Không lưới</option>
              </select>
            </div>

            {/* Font size +/- big touch targets */}
            <div className="flex items-center gap-1 bg-neutral-800 rounded-xl border border-neutral-700 p-1">
              <button
                onClick={() => setFontSize(s => Math.max(s - 4, 20))}
                className="w-8 h-8 rounded-lg bg-neutral-750 hover:bg-neutral-700 flex items-center justify-center font-bold text-base text-neutral-200 active:scale-95 cursor-pointer"
                title="Thu nhỏ chữ"
              >
                -
              </button>
              <span className="text-xs font-mono font-bold px-2 text-amber-300">{fontSize}px</span>
              <button
                onClick={() => setFontSize(s => Math.min(s + 4, 110))}
                className="w-8 h-8 rounded-lg bg-neutral-750 hover:bg-neutral-700 flex items-center justify-center font-bold text-base text-neutral-200 active:scale-95 cursor-pointer"
                title="Phóng to chữ"
              >
                +
              </button>
            </div>

            {/* Single line vs multi line toggle */}
            <button
              onClick={() => setViewMode(v => v === 'single_line' ? 'multi_line' : 'single_line')}
              className="px-2.5 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold text-xs transition"
            >
              {viewMode === 'single_line' ? 'Từng dòng' : 'Cả đoạn'}
            </button>
          </div>
        </header>
      )}

      {/* Main Lightbox Workspace Canvas */}
      <div 
        className="relative flex-1 w-full h-full overflow-hidden flex flex-col items-center justify-center p-4 sm:p-8"
        style={{
          backgroundColor: themeMode === 'light' ? '#ffffff' : '#0a0a0a',
        }}
      >
        {/* SVG Background Ruling Grids */}
        {gridType !== 'plain' && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              {/* Ô ly tiểu học */}
              {gridType === 'oly_vi' && (
                <pattern id="lightbox-oly" width="32" height="32" patternUnits="userSpaceOnUse">
                  <path d="M 0 8 L 32 8 M 0 16 L 32 16 M 0 24 L 32 24" fill="none" stroke={themeMode === 'light' ? '#cbd5e1' : '#262626'} strokeWidth="0.6" strokeDasharray="2 2" />
                  <path d="M 8 0 L 8 32 M 16 0 L 16 32 M 24 0 L 24 32" fill="none" stroke={themeMode === 'light' ? '#cbd5e1' : '#262626'} strokeWidth="0.6" strokeDasharray="2 2" />
                  <path d="M 32 0 L 0 0 0 32" fill="none" stroke={themeMode === 'light' ? '#94a3b8' : '#404040'} strokeWidth="1" />
                </pattern>
              )}

              {/* Calligraphy 55° */}
              {gridType === 'calligraphy_55' && (
                <pattern id="lightbox-calligraphy-55" width="40" height="40" patternUnits="userSpaceOnUse">
                  <line x1="0" y1="40" x2="28" y2="0" stroke={themeMode === 'light' ? '#94a3b8' : '#383838'} strokeWidth="0.8" strokeDasharray="4 4" />
                </pattern>
              )}

              {/* Ô Mễ */}
              {gridType === 'mizi_zh' && (
                <pattern id="lightbox-mizi" width="64" height="64" patternUnits="userSpaceOnUse">
                  <rect width="64" height="64" fill="none" stroke={themeMode === 'light' ? '#94a3b8' : '#404040'} strokeWidth="1" />
                  <line x1="0" y1="32" x2="64" y2="32" stroke={themeMode === 'light' ? '#cbd5e1' : '#262626'} strokeWidth="0.7" strokeDasharray="3 3" />
                  <line x1="32" y1="0" x2="32" y2="64" stroke={themeMode === 'light' ? '#cbd5e1' : '#262626'} strokeWidth="0.7" strokeDasharray="3 3" />
                  <line x1="0" y1="0" x2="64" y2="64" stroke={themeMode === 'light' ? '#e2e8f0' : '#1f1f1f'} strokeWidth="0.7" strokeDasharray="2 2" />
                  <line x1="0" y1="64" x2="64" y2="0" stroke={themeMode === 'light' ? '#e2e8f0' : '#1f1f1f'} strokeWidth="0.7" strokeDasharray="2 2" />
                </pattern>
              )}
            </defs>

            {gridType === 'oly_vi' && <rect width="100%" height="100%" fill="url(#lightbox-oly)" />}
            {gridType === 'calligraphy_55' && <rect width="100%" height="100%" fill="url(#lightbox-calligraphy-55)" />}
            {gridType === 'mizi_zh' && <rect width="100%" height="100%" fill="url(#lightbox-mizi)" />}

            {(gridType === 'four_line_en' || gridType === 'calligraphy_55') && (
              <g opacity="0.6">
                <line x1="0" y1="30%" x2="100%" y2="30%" stroke="#94a3b8" strokeWidth="1" />
                <line x1="0" y1="48%" x2="100%" y2="48%" stroke="#64748b" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="0" y1="66%" x2="100%" y2="66%" stroke="#e11d48" strokeWidth="1.6" />
                <line x1="0" y1="84%" x2="100%" y2="84%" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />
              </g>
            )}
          </svg>
        )}

        {/* Big Navigation Arrows for easy switching between lines */}
        {viewMode === 'single_line' && textLines.length > 1 && !isLocked && (
          <>
            <button
              disabled={currentLineIndex === 0}
              onClick={() => setCurrentLineIndex(i => Math.max(i - 1, 0))}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-neutral-900/80 hover:bg-neutral-900 text-white flex items-center justify-center shadow-xl disabled:opacity-20 active:scale-95 transition cursor-pointer"
              title="Dòng trước"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              disabled={currentLineIndex >= textLines.length - 1}
              onClick={() => setCurrentLineIndex(i => Math.min(i + 1, textLines.length - 1))}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-neutral-900/80 hover:bg-neutral-900 text-white flex items-center justify-center shadow-xl disabled:opacity-20 active:scale-95 transition cursor-pointer"
              title="Dòng kế tiếp"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Tracing Text Content Block */}
        <div 
          className="relative z-10 max-w-4xl w-full flex flex-col items-center justify-center space-y-6 text-center px-4"
          style={{
            fontFamily: currentFont.fontFamily,
            fontSize: `${fontSize}px`,
            color: themeMode === 'light' ? textColor : '#38bdf8',
            opacity: textOpacity,
            lineHeight: 1.6,
          }}
        >
          {viewMode === 'single_line' ? (
            <div className="py-8 tracking-wide font-normal drop-shadow-sm select-none">
              {textLines[currentLineIndex] || text}
            </div>
          ) : (
            <div className="space-y-4 py-4 tracking-wide font-normal drop-shadow-sm select-none">
              {textLines.map((line, idx) => (
                <div key={idx}>{line}</div>
              ))}
            </div>
          )}
        </div>

        {/* Palm rejection shield overlay when locked */}
        {isLocked && (
          <div 
            className="absolute inset-0 z-40 bg-transparent cursor-none touch-none"
            title="Đã khóa cảm ứng để kê giấy đồ nét"
          />
        )}
      </div>

      {/* Floating Unlock Pill or Bottom Bar */}
      {isLocked ? (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 w-11/12 max-w-md">
          <div className="w-full p-3.5 sm:p-4 rounded-3xl bg-neutral-900/95 text-white backdrop-blur-md border-2 border-amber-500/50 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div className="space-y-0.5">
              <div className="text-xs sm:text-sm font-black text-amber-300 flex items-center justify-center sm:justify-start gap-1.5">
                <span>✏️</span> Đã Khóa Màn Hình
              </div>
              <p className="text-[11px] sm:text-xs text-neutral-300">
                Bé đặt giấy mỏng lên màn hình rồi lấy bút chì đồ theo nét nhé!
              </p>
            </div>

            <button
              onClick={() => setIsLocked(false)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-950/50 active:scale-95 cursor-pointer shrink-0"
            >
              <Unlock className="w-4 h-4" />
              <span>Mở khóa</span>
            </button>
          </div>
        </div>
      ) : (
        /* Bottom Info & Navigation Bar */
        <footer className="z-30 px-4 py-2 bg-neutral-900 text-white border-t border-neutral-800 flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-2 text-neutral-300 text-[11px] sm:text-xs">
            <span>💡</span>
            <span className="hidden sm:inline">Mẹo: Tăng 100% độ sáng điện thoại rồi đặt tờ giấy mỏng lên màn hình để bé đồ theo nét chữ.</span>
            <span className="sm:hidden">Tăng độ sáng màn hình rồi kê giấy lên đồ nét.</span>
          </div>

          {textLines.length > 1 && (
            <div className="flex items-center gap-1 font-bold text-amber-300 text-xs">
              Dòng {currentLineIndex + 1}/{textLines.length}
            </div>
          )}
        </footer>
      )}
    </div>
  );
};
