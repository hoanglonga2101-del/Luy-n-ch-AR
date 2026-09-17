import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Volume2, 
  Sparkles, 
  Eye, 
  Layers, 
  PenTool, 
  ArrowRight,
  Info
} from 'lucide-react';
import { CharacterItem, LanguageCode } from '../types';
import { 
  getAlphabetData, 
  JAPANESE_HIRAGANA_ROWS, 
  JAPANESE_KATAKANA_ROWS 
} from '../data/alphabets';
import { speakText } from '../utils/audio';

interface AlphabetBrowserProps {
  language: LanguageCode;
  onSelectCharacter: (char: CharacterItem) => void;
  onLaunchAR: (char: CharacterItem) => void;
  onLaunchCanvas: (char: CharacterItem) => void;
  onSwitchToSentenceView?: () => void;
}

export const AlphabetBrowser: React.FC<AlphabetBrowserProps> = ({
  language,
  onSelectCharacter,
  onLaunchAR,
  onLaunchCanvas,
  onSwitchToSentenceView,
}) => {
  // Category filter for VI & EN
  const [activeCategory, setActiveCategory] = useState<string>('all');
  // Japanese tab: hiragana vs katakana
  const [japaneseTab, setJapaneseTab] = useState<'hiragana' | 'katakana'>('hiragana');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const { categories, items } = useMemo(() => getAlphabetData(language), [language]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // In Japanese, filter according to current tab
      if (language === 'ja') {
        if (item.category !== japaneseTab) return false;
      } else if (language === 'vi') {
        if (activeCategory === 'all') {
          if (item.category !== 'letters') return false;
        } else if (activeCategory === 'accents') {
          if (item.category !== 'accents') return false;
        }
        // 'all_accents' shows all items without filtering
      } else {
        const matchCat = activeCategory === 'all' || item.category === activeCategory;
        if (!matchCat) return false;
      }

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        item.char.toLowerCase().includes(q) ||
        item.name.toLowerCase().includes(q) ||
        (item.upperChar && item.upperChar.toLowerCase().includes(q)) ||
        (item.lowerChar && item.lowerChar.toLowerCase().includes(q)) ||
        (item.reading && item.reading.toLowerCase().includes(q)) ||
        (item.vietnameseMeaning && item.vietnameseMeaning.toLowerCase().includes(q))
      );
    });
  }, [items, activeCategory, japaneseTab, language, searchQuery]);

  const getFontClass = () => {
    if (language === 'vi') return 'font-["Itim",cursive]';
    if (language === 'en') return 'font-["Patrick_Hand",cursive]';
    if (language === 'ja') return 'font-["Klee_One",sans-serif]';
    if (language === 'zh') return 'font-["Ma_Shan_Zheng",serif]';
    return 'font-sans';
  };

  const getLanguageHeader = () => {
    switch (language) {
      case 'vi':
        return {
          title: 'Bảng Chữ Cái Tiếng Việt Cho Bé 📚',
          subtitle: 'Đầy đủ 29 chữ cái in hoa - in thường và 8 dấu thanh chuẩn ô ly Tiểu học. Bé chạm vào chữ để xem hoạt hình từng nét nhé!'
        };
      case 'en':
        return {
          title: 'Bảng Chữ Cái Tiếng Anh (English Alphabet) 🇬🇧',
          subtitle: 'Tất cả 26 chữ cái viết hoa và viết thường trên đường kẻ ô chuẩn. Bé chạm vào để xem nét và nghe đọc.'
        };
      case 'ja':
        return {
          title: 'Bảng Chữ Cái Tiếng Nhật (Hiragana & Katakana) 🇯🇵',
          subtitle: 'Bảng 50 âm tiêu chuẩn Gojūon với phát âm chuẩn bản xứ từng chữ cái.'
        };
      default:
        return {
          title: 'Bảng chữ cái luyện viết cho bé 📚',
          subtitle: 'Chạm vào chữ cái bất kỳ để xem thứ tự nét viết chuẩn'
        };
    }
  };

  // Case: Tiếng Trung thì tự viết câu rồi luyện không cần bảng chữ
  if (language === 'zh') {
    return (
      <div className="w-full max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 sm:p-12 shadow-2xl text-center flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-4 shadow-lg shadow-amber-950/40">
            <PenTool className="w-8 h-8" />
          </div>

          <span className="text-xs font-mono uppercase tracking-wider text-amber-400 bg-amber-950/60 px-3 py-1 rounded-full border border-amber-800/40 mb-3">
            Tiếng Trung (Hán tự)
          </span>

          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Luyện viết tự do theo câu & từ vựng
          </h2>

          <p className="text-sm text-neutral-400 max-w-xl mt-3 leading-relaxed">
            Tiếng Trung có hàng vạn chữ Hán và không dùng bảng chữ cái cố định. Bạn hãy nhập câu danh ngôn, từ vựng hoặc thơ ca yêu thích để hắt hình AR trực tiếp lên giấy hoặc dùng AI gợi ý câu mẫu!
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
            <button
              id="zh-go-to-sentence-creator"
              onClick={onSwitchToSentenceView}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-semibold text-sm shadow-xl shadow-amber-950/40 flex items-center gap-2 transition transform hover:-translate-y-0.5"
            >
              <Sparkles className="w-4 h-4" /> Bắt đầu tự viết câu tiếng Trung <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  const headerInfo = getLanguageHeader();

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Top Header & Search Filter */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-400" />
              {headerInfo.title}
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              {headerInfo.subtitle}
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-5 h-5 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm chữ cái, phiên âm, dấu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-950 border-2 border-neutral-700/80 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-cyan-400 transition"
            />
          </div>
        </div>

        {/* Categories or Japanese Tabs */}
        {language === 'ja' ? (
          /* Japanese Part Selector: Hiragana vs Katakana */
          <div className="flex items-center gap-2 mt-5 p-1 bg-neutral-950 rounded-2xl border border-neutral-800 max-w-md">
            <button
              id="ja-tab-hiragana"
              onClick={() => setJapaneseTab('hiragana')}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                japaneseTab === 'hiragana'
                  ? 'bg-cyan-600 text-white shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <span>Hiragana (あ い う...)</span>
            </button>

            <button
              id="ja-tab-katakana"
              onClick={() => setJapaneseTab('katakana')}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                japaneseTab === 'katakana'
                  ? 'bg-cyan-600 text-white shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <span>Katakana (ア イ ウ...)</span>
            </button>
          </div>
        ) : (
          /* Category Pills for Vietnamese & English */
          <div className="flex items-center gap-2 mt-5 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                id={`cat-${cat.id}`}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold shrink-0 transition border-2 cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-cyan-500/25 text-white border-cyan-400 shadow-md'
                    : 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* JAPANESE 50-SOUND (GOJŪON) MATRIX VIEW */}
      {/* ======================================================== */}
      {language === 'ja' && !searchQuery.trim() && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase text-cyan-400 bg-cyan-950/60 px-2.5 py-0.5 rounded border border-cyan-800/40">
                {japaneseTab === 'hiragana' ? 'BẢNG CHỮ MỀM HIRAGANA' : 'BẢNG CHỮ CỨNG KATAKANA'}
              </span>
              <span className="text-xs text-neutral-400 hidden sm:inline">
                (Nhấp vào ký tự để nghe phát âm, xem nét hoặc hắt hình AR)
              </span>
            </div>
            <span className="text-xs text-neutral-500 font-mono">10 Hàng • 5 Cột Âm</span>
          </div>

          {/* 5 Columns Header */}
          <div className="grid grid-cols-6 gap-2 text-center text-xs font-bold text-neutral-400 pb-1 border-b border-neutral-800/60">
            <span className="text-neutral-500 text-left pl-2">Hàng âm</span>
            <span>Cột A</span>
            <span>Cột I</span>
            <span>Cột U</span>
            <span>Cột E</span>
            <span>Cột O</span>
          </div>

          {/* 10 Rows Matrix */}
          <div className="space-y-2">
            {(japaneseTab === 'hiragana' ? JAPANESE_HIRAGANA_ROWS : JAPANESE_KATAKANA_ROWS).map((row, rIdx) => (
              <div 
                key={rIdx} 
                className="grid grid-cols-6 gap-1.5 sm:gap-2 items-center bg-neutral-950/50 p-1.5 sm:p-2 rounded-xl border border-neutral-800/60"
              >
                {/* Row label */}
                <span className="text-[11px] sm:text-xs font-medium text-neutral-400 truncate pl-1 sm:pl-2">
                  {row.rowLabel}
                </span>

                {/* 5 Column items */}
                {row.items.map((item, cIdx) => {
                  if (!item) {
                    return (
                      <div 
                        key={cIdx} 
                        className="h-16 sm:h-20 rounded-xl bg-neutral-950/30 border border-neutral-900 flex items-center justify-center text-neutral-700 text-xs select-none"
                      >
                        -
                      </div>
                    );
                  }

                  return (
                    <div
                      key={item.id}
                      className="group relative h-16 sm:h-20 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 hover:border-cyan-500/60 rounded-xl p-1 flex flex-col justify-between items-center transition cursor-pointer hover:shadow-lg hover:shadow-cyan-950/30"
                    >
                      {/* Romaji Reading & Audio button */}
                      <div className="w-full flex items-center justify-between px-1 text-[10px] text-neutral-400">
                        <span className="font-mono text-cyan-400 font-semibold">{item.reading}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            speakText(item.char, 'ja');
                          }}
                          className="p-0.5 rounded hover:text-emerald-400 text-neutral-500 transition"
                          title="Phát âm"
                        >
                          <Volume2 className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Character Display */}
                      <span 
                        onClick={() => onSelectCharacter(item)}
                        className={`text-2xl sm:text-3xl text-white group-hover:text-cyan-300 transition ${getFontClass()}`}
                      >
                        {item.char}
                      </span>

                      {/* Quick AR & Detail Trigger */}
                      <div className="w-full grid grid-cols-2 gap-1 pt-0.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectCharacter(item);
                          }}
                          className="py-0.5 px-1 rounded bg-neutral-950 hover:bg-neutral-800 text-neutral-300 text-[9px] font-medium transition text-center truncate border border-neutral-800"
                          title="Xem thứ tự nét chuẩn"
                        >
                          Nét
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onLaunchAR(item);
                          }}
                          className="py-0.5 px-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[9px] font-bold transition text-center truncate shadow-sm"
                          title="Hắt hình AR lên giấy"
                        >
                          AR
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* STANDARD GRID VIEW (Vietnamese, English, or Japanese search results) */}
      {/* ======================================================== */}
      {(language !== 'ja' || searchQuery.trim()) && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group relative bg-neutral-900 border border-neutral-800 hover:border-cyan-500/60 rounded-2xl p-4 flex flex-col justify-between items-center transition-all duration-200 hover:shadow-xl hover:shadow-cyan-950/20"
            >
              {/* Top row with stroke count and pronunciation */}
              <div className="w-full flex items-center justify-between text-[11px] text-neutral-400">
                <span className="font-mono bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800">
                  {item.strokesCount} nét
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    speakText(item.char, item.language);
                  }}
                  className="p-1 rounded hover:bg-neutral-800 text-neutral-400 hover:text-emerald-400 transition"
                  title="Phát âm"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Central Big Character Display */}
              <div 
                onClick={() => onSelectCharacter(item)}
                className="my-3 cursor-pointer flex flex-col items-center justify-center p-2 rounded-xl transition transform group-hover:scale-105"
              >
                {item.upperChar && item.lowerChar ? (
                  <div className="flex items-baseline gap-2">
                    <span 
                      className={`text-4xl sm:text-5xl font-normal text-white group-hover:text-cyan-300 transition ${getFontClass()}`}
                      style={{
                        fontStyle: language === 'vi' || language === 'en' ? 'italic' : 'normal',
                      }}
                    >
                      {item.upperChar}
                    </span>
                    <span 
                      className={`text-3xl sm:text-4xl font-normal text-neutral-400 group-hover:text-cyan-400 transition ${getFontClass()}`}
                      style={{
                        fontStyle: language === 'vi' || language === 'en' ? 'italic' : 'normal',
                      }}
                    >
                      {item.lowerChar}
                    </span>
                  </div>
                ) : (
                  <span 
                    className={`text-4xl sm:text-5xl font-normal text-white group-hover:text-cyan-300 transition ${getFontClass()}`}
                    style={{
                      fontStyle: language === 'vi' || language === 'en' ? 'italic' : 'normal',
                    }}
                  >
                    {item.char}
                  </span>
                )}
                <span className="text-[11px] text-neutral-400 font-medium mt-1 truncate max-w-[120px] text-center">
                  {item.name}
                </span>
                {item.reading && (
                  <span className="text-[10px] font-mono text-cyan-400/90">
                    {item.reading}
                  </span>
                )}
              </div>

              {/* Bottom Quick Action Buttons */}
              <div className="w-full grid grid-cols-2 gap-1.5 pt-2 border-t border-neutral-800/80">
                <button
                  onClick={() => onSelectCharacter(item)}
                  className="py-2 px-2 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-cyan-300 hover:text-white text-xs font-bold transition flex items-center justify-center gap-1 border border-neutral-750 active:scale-95 cursor-pointer"
                  title="Xem thứ tự nét chuẩn"
                >
                  <Eye className="w-3.5 h-3.5 text-cyan-400" /> Xem nét
                </button>

                <button
                  onClick={() => onLaunchAR(item)}
                  className="py-2 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black transition flex items-center justify-center gap-1 shadow-sm active:scale-95 cursor-pointer"
                  title="Hắt hình AR lên giấy"
                >
                  <Sparkles className="w-3.5 h-3.5" /> AR
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredItems.length === 0 && (
        <div className="p-12 text-center text-neutral-500 bg-neutral-900/50 rounded-2xl border border-neutral-800">
          Không tìm thấy ký tự phù hợp với từ khóa "{searchQuery}".
        </div>
      )}
    </div>
  );
};
