import React from 'react';
import { X, Volume2, Sparkles, PenTool, BookOpen, Lightbulb } from 'lucide-react';
import { CharacterItem } from '../types';
import { StrokeAnimator } from './StrokeAnimator';
import { speakText } from '../utils/audio';

interface CharacterDetailModalProps {
  character: CharacterItem | null;
  onClose: () => void;
  onLaunchAR: (char: CharacterItem) => void;
  onLaunchCanvas: (char: CharacterItem) => void;
}

export const CharacterDetailModal: React.FC<CharacterDetailModalProps> = ({
  character,
  onClose,
  onLaunchAR,
  onLaunchCanvas,
}) => {
  if (!character) return null;

  const hasVariants = Boolean(character.upperChar && character.lowerChar);
  const [variant, setVariant] = React.useState<'upper' | 'lower'>('lower');

  // Active letter data depending on selected variant
  const activeChar = hasVariants
    ? (variant === 'upper' ? character.upperChar! : character.lowerChar!)
    : character.char;

  const activeStrokes = hasVariants
    ? (variant === 'upper' ? character.upperStrokes || character.strokes : character.lowerStrokes || character.strokes)
    : character.strokes;

  const activeStrokesCount = hasVariants
    ? (variant === 'upper' ? (character.upperStrokesCount || character.strokesCount) : (character.lowerStrokesCount || character.strokesCount))
    : character.strokesCount;

  const activeItemToLaunch: CharacterItem = {
    ...character,
    char: activeChar,
    strokes: activeStrokes,
    strokesCount: activeStrokesCount,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        id="character-detail-card" 
        className="relative w-full max-w-xl bg-neutral-900 border-2 border-neutral-700/90 rounded-3xl p-5 sm:p-7 text-neutral-100 shadow-2xl overflow-y-auto max-h-[92vh]"
      >
        {/* Large Close button for kids & mobile */}
        <button
          id="close-char-modal"
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white flex items-center justify-center transition active:scale-95 cursor-pointer z-10 shadow"
          title="Đóng bảng xem nét"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Title and Pronounce */}
        <div className="flex items-center gap-3.5 mb-4 pr-10">
          <div className="w-16 h-16 rounded-3xl bg-cyan-500/20 border-2 border-cyan-500/40 flex items-center justify-center text-cyan-300 font-black text-3xl shadow-inner shrink-0">
            {activeChar}
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl sm:text-2xl font-black text-white">{character.name}</h2>
              <button
                onClick={() => speakText(activeChar, character.language)}
                className="p-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 transition active:scale-95 cursor-pointer"
                title="Nghe cô đọc mẫu"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-neutral-300 mt-1">
              {character.reading && (
                <span className="font-mono text-cyan-400 bg-neutral-950 px-2 py-0.5 rounded-lg border border-neutral-800">
                  {character.reading}
                </span>
              )}
              {character.vietnameseMeaning && (
                <span className="text-neutral-300">Nghĩa: {character.vietnameseMeaning}</span>
              )}
              <span className="bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-lg font-bold border border-amber-500/30">
                Gồm {activeStrokesCount} nét bút
              </span>
            </div>
          </div>
        </div>

        {/* Case Selector: Lowercase vs Uppercase for Latin/Vietnamese letters */}
        {hasVariants && (
          <div className="mb-4 p-1.5 bg-neutral-950 rounded-2xl border-2 border-neutral-800 flex items-center gap-2">
            <button
              onClick={() => setVariant('lower')}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                variant === 'lower'
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <span>Chữ thường ({character.lowerChar})</span>
            </button>
            <button
              onClick={() => setVariant('upper')}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                variant === 'upper'
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <span>Chữ in hoa ({character.upperChar})</span>
            </button>
          </div>
        )}

        {/* Animated Stroke Order Section */}
        <div className="my-4 p-4 sm:p-5 bg-neutral-950 rounded-3xl border-2 border-neutral-800 flex flex-col items-center">
          <div className="text-xs sm:text-sm font-bold text-amber-300 mb-2 flex items-center gap-2 self-start">
            <span>✨</span> Hoạt hình thứ tự nét viết chuẩn:
          </div>

          <StrokeAnimator
            strokes={activeStrokes || []}
            gridType={character.gridType}
            size={240}
            color="#2563eb"
          />
        </div>

        {/* Tips / Stroke Order Principles */}
        <div className="space-y-3 mb-6">
          <div className="p-3.5 sm:p-4 bg-amber-500/15 border-2 border-amber-500/35 rounded-2xl text-xs sm:text-sm text-amber-100 flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-300 font-bold block mb-1">Mẹo đặt bút & lia nét cho bé:</strong>
              <p className="leading-relaxed">{character.tips}</p>
            </div>
          </div>

          {character.examples && character.examples.length > 0 && (
            <div className="p-3.5 bg-neutral-850 border border-neutral-700/80 rounded-2xl text-xs sm:text-sm">
              <div className="text-neutral-300 mb-2 font-bold flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-cyan-400" /> Từ ngữ ví dụ:
              </div>
              <div className="flex flex-wrap gap-2">
                {character.examples.map((ex, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-neutral-900 rounded-xl text-neutral-200 border border-neutral-700 font-semibold"
                  >
                    {ex}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-col gap-2.5">
          <button
            id="modal-launch-ar-btn"
            onClick={() => onLaunchAR(activeItemToLaunch)}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:brightness-110 text-neutral-950 font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl shadow-emerald-950/50 transition active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-5 h-5 text-neutral-950" />
            <span>Chiếu AR chữ "{activeChar}" lên giấy để đồ nét 📷</span>
          </button>

          <button
            id="modal-launch-canvas-btn"
            onClick={() => onLaunchCanvas(activeItemToLaunch)}
            className="w-full py-3 px-4 rounded-2xl bg-neutral-800 hover:bg-neutral-750 text-neutral-200 hover:text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition border border-neutral-700 active:scale-95 cursor-pointer"
          >
            <PenTool className="w-4 h-4 text-cyan-400" />
            <span>Tập vẽ ngón tay trực tiếp trên màn hình</span>
          </button>
        </div>
      </div>
    </div>
  );
};
