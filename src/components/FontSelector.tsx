import React from 'react';
import { Type, Check, Sparkles, Sliders, ShieldCheck } from 'lucide-react';
import { 
  GOOGLE_15_ENGLISH_FONTS, 
  OTHER_LANGUAGE_FONTS, 
  getFontOptionById, 
  FontOption 
} from '../data/fontOptions';
import { LanguageCode } from '../types';

interface FontSelectorProps {
  selectedFontId: string;
  onSelectFont: (fontId: string) => void;
  language?: LanguageCode;
  crispOutline?: boolean;
  onToggleCrispOutline?: (enabled: boolean) => void;
  letterSpacingEm?: number;
  onChangeLetterSpacing?: (val: number) => void;
  compact?: boolean;
}

export const FontSelector: React.FC<FontSelectorProps> = ({
  selectedFontId,
  onSelectFont,
  language = 'en',
  crispOutline = true,
  onToggleCrispOutline,
  letterSpacingEm = 0.04,
  onChangeLetterSpacing,
  compact = false,
}) => {
  const currentFont: FontOption = getFontOptionById(selectedFontId);

  return (
    <div className="space-y-4">
      {/* 1. Header & Optical Clarity Assurance */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800 pb-2.5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-cyan-500/20 text-cyan-400">
              <Type className="w-4 h-4" />
            </span>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              Bộ chuyển đổi kiểu chữ (Font Selector)
            </h4>
          </div>
          <p className="text-[11px] text-neutral-400 mt-0.5">
            15 Google Fonts Tiếng Anh đa dạng: Calligraphy, Cursive, In hoa kỹ thuật, Gothic, Marker
          </p>
        </div>

        {/* Optical Clarity Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-950/60 border border-emerald-800/50 rounded-xl text-[11px] text-emerald-300 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Cập nhật CSS font-family tức thì</span>
        </div>
      </div>

      {/* 2. PRIMARY DROPDOWN SELECTOR (Requested) */}
      <div className="p-3.5 rounded-2xl bg-neutral-950/95 border-2 border-cyan-500/50 shadow-xl space-y-2.5">
        <label 
          htmlFor="ar-font-dropdown-select" 
          className="text-xs font-bold text-cyan-300 flex items-center justify-between"
        >
          <span className="flex items-center gap-1.5">
            <Type className="w-3.5 h-3.5 text-cyan-400" />
            Danh sách chọn kiểu chữ (Dropdown 15 Fonts):
          </span>
          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded-md border border-cyan-800/50">
            CSS: {currentFont.fontFamily.split(',')[0]}
          </span>
        </label>

        <div className="relative">
          <select
            id="ar-font-dropdown-select"
            value={selectedFontId}
            onChange={(e) => onSelectFont(e.target.value)}
            className="w-full py-2.5 px-3.5 pr-8 bg-neutral-900 border border-neutral-700 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30 rounded-xl text-white font-medium text-xs sm:text-sm appearance-none cursor-pointer transition shadow-inner"
          >
            <optgroup label="🌟 15 Google Fonts Tiếng Anh đa dạng">
              {GOOGLE_15_ENGLISH_FONTS.map((font) => (
                <option key={font.id} value={font.id}>
                  {font.order}. {font.vietnameseTitle}
                </option>
              ))}
            </optgroup>
            <optgroup label="🌏 Kiểu chữ chuyên dụng khác">
              {OTHER_LANGUAGE_FONTS.map((font) => (
                <option key={font.id} value={font.id}>
                  {font.vietnameseTitle}
                </option>
              ))}
            </optgroup>
          </select>

          {/* Custom Dropdown Chevron indicator */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-neutral-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Live Active Font Preview Strip */}
        <div 
          className={`p-3 rounded-xl border bg-black/60 transition-all ${
            crispOutline ? 'ar-crisp-outline' : ''
          }`}
          style={{
            borderColor: 'rgba(6, 182, 212, 0.4)',
          }}
        >
          <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-1">
            <span className="font-semibold text-cyan-300 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              Đang áp dụng: <span className="text-white font-bold">{currentFont.vietnameseTitle}</span>
            </span>
            <span className="font-mono text-[10px] text-neutral-500">{currentFont.tag}</span>
          </div>

          <div 
            className="text-lg sm:text-xl py-1 text-cyan-200 select-none truncate transition-all ar-tracing-text"
            style={{ 
              fontFamily: currentFont.fontFamily,
              letterSpacing: `${letterSpacingEm}em`,
            }}
          >
            {currentFont.sampleText}
          </div>

          <p className="text-[11px] text-neutral-400 mt-1">
            {currentFont.description}
          </p>
        </div>
      </div>

      {/* 3. Clarity & Tracing Controls (Outline stroke, Letter Spacing) */}
      {(onToggleCrispOutline || onChangeLetterSpacing) && (
        <div className="p-3 rounded-2xl bg-neutral-950/80 border border-neutral-800/90 flex flex-wrap items-center justify-between gap-3 text-xs">
          {onToggleCrispOutline && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                id="toggle-crisp-outline-btn"
                onClick={() => onToggleCrispOutline(!crispOutline)}
                className={`px-3 py-1.5 rounded-xl border text-[11px] font-semibold transition flex items-center gap-1.5 ${
                  crispOutline
                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-sm'
                    : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                {crispOutline ? 'Nét viền chống mờ: BẬT' : 'Nét viền chống mờ: TẮT'}
              </button>
              <span className="text-[10px] text-neutral-400 hidden sm:inline">
                Tăng độ sắc của nét chữ khi chiếu qua camera
              </span>
            </div>
          )}

          {onChangeLetterSpacing && (
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-neutral-300 flex items-center gap-1">
                <Sliders className="w-3 h-3 text-cyan-400" /> Giãn cách nét:
              </span>
              <div className="flex items-center gap-1 bg-neutral-900 px-1 py-0.5 rounded-lg border border-neutral-800">
                {[
                  { label: 'Chuẩn', val: 0.02 },
                  { label: 'Rộng', val: 0.05 },
                  { label: 'Rất rộng', val: 0.08 },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => onChangeLetterSpacing(preset.val)}
                    className={`px-2 py-0.5 rounded text-[10px] font-medium transition ${
                      Math.abs(letterSpacingEm - preset.val) < 0.01
                        ? 'bg-cyan-500 text-neutral-950 font-bold'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. Full 15 Google Fonts Visual Grid */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            15 Kiểu chữ Tiếng Anh đa dạng (Xem mẫu trực quan)
          </span>
          <span className="text-[10px] text-neutral-500 font-mono">15 options</span>
        </div>

        <div className={`grid ${compact ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'} gap-2.5`}>
          {GOOGLE_15_ENGLISH_FONTS.map((font) => {
            const isSelected = selectedFontId === font.id;

            return (
              <div
                key={font.id}
                id={`font-card-${font.id}`}
                onClick={() => onSelectFont(font.id)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group relative ${
                  isSelected
                    ? 'bg-cyan-950/40 border-cyan-400 ring-2 ring-cyan-500/30 shadow-lg shadow-cyan-950/50'
                    : 'bg-neutral-900/90 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-850'
                }`}
              >
                {/* Top: Order & Tag */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold shrink-0 ${
                        isSelected ? 'bg-cyan-500 text-neutral-950' : 'bg-neutral-800 text-neutral-400'
                      }`}>
                        {font.order}
                      </span>
                      <span className="font-bold text-xs text-white group-hover:text-cyan-300 transition truncate">
                        {font.vietnameseTitle}
                      </span>
                    </div>

                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-semibold border shrink-0 ${
                      isSelected
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                        : 'bg-neutral-800 text-neutral-400 border-neutral-700/60'
                    }`}>
                      {font.tag}
                    </span>
                  </div>

                  <div className="text-[10px] text-neutral-400 font-mono mb-2">
                    <code>{font.fontFamily.split(',')[0]}</code>
                  </div>

                  {/* Font Live Preview Box */}
                  <div 
                    className={`p-2.5 rounded-xl border bg-neutral-950/90 mb-2 select-none transition-all ar-tracing-text ${
                      isSelected ? 'border-cyan-500/40 text-cyan-200' : 'border-neutral-800/80 text-white'
                    } ${crispOutline ? 'ar-crisp-outline' : ''}`}
                    style={{
                      fontFamily: font.fontFamily,
                      letterSpacing: `${letterSpacingEm}em`,
                    }}
                  >
                    <div className="text-base sm:text-lg leading-tight truncate">
                      {font.sampleText}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-[10px] text-neutral-400 leading-snug line-clamp-2">
                    {font.description}
                  </p>
                </div>

                {/* Bottom Status Button */}
                <div className="mt-2.5 pt-2 border-t border-neutral-800/60 flex items-center justify-between">
                  <span className="text-[10px] text-neutral-500">
                    Option #{font.order}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectFont(font.id);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition flex items-center gap-1 ${
                      isSelected
                        ? 'bg-cyan-500 text-neutral-950 font-bold shadow'
                        : 'bg-neutral-800 text-neutral-300 hover:text-white'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Đang dùng
                      </>
                    ) : (
                      'Chọn font này'
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Language-specific Fonts (Vietnamese / Japanese / Chinese) */}
      {language !== 'en' && (
        <div className="pt-2 border-t border-neutral-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
              Font chuyên dụng theo ngôn ngữ khác
            </span>
            <span className="text-[10px] text-neutral-500">Tiếng Việt • Tiếng Nhật • Tiếng Trung</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {OTHER_LANGUAGE_FONTS.map((font) => {
              const isSelected = selectedFontId === font.id;

              return (
                <div
                  key={font.id}
                  onClick={() => onSelectFont(font.id)}
                  className={`p-2.5 rounded-xl border transition cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-amber-950/40 border-amber-400 ring-1 ring-amber-500/40'
                      : 'bg-neutral-900/80 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-white truncate">{font.name}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400 font-mono">
                        {font.tag}
                      </span>
                    </div>
                    <div 
                      className="text-sm p-1.5 bg-neutral-950 rounded-lg border border-neutral-800 text-white truncate select-none my-1"
                      style={{ fontFamily: font.fontFamily }}
                    >
                      {font.sampleText}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-1 text-[10px]">
                    <span className="text-neutral-500 truncate">{font.englishName}</span>
                    {isSelected && (
                      <span className="text-amber-400 font-bold flex items-center gap-0.5">
                        <Check className="w-3 h-3" /> Đang dùng
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
