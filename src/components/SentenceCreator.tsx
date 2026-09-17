import React, { useState, useEffect } from 'react';
import { 
  PenTool, 
  Sparkles, 
  Wand2, 
  Volume2, 
  BookOpen, 
  Copy, 
  Check, 
  ChevronRight, 
  RefreshCw,
  Lightbulb,
  Grid,
  Type
} from 'lucide-react';
import { LanguageCode, GridType, PracticeSentence } from '../types';
import { SAMPLE_SENTENCES } from '../data/sampleSentences';
import { speakText } from '../utils/audio';
import { FontSelector } from './FontSelector';
import { 
  getFontOptionById, 
  getDefaultFontForLanguage,
  ENGLISH_PRIORITY_FONTS 
} from '../data/fontOptions';

interface SentenceCreatorProps {
  language: LanguageCode;
  onLaunchAR: (sentence: PracticeSentence) => void;
  onLaunchCanvas: (sentence: PracticeSentence) => void;
}

export const SentenceCreator: React.FC<SentenceCreatorProps> = ({
  language,
  onLaunchAR,
  onLaunchCanvas,
}) => {
  const [customText, setCustomText] = useState<string>('');
  const [customReading, setCustomReading] = useState<string>('');
  const [customTranslation, setCustomTranslation] = useState<string>('');
  const [customTips, setCustomTips] = useState<string>('');
  const [selectedGrid, setSelectedGrid] = useState<GridType>(
    language === 'vi' ? 'oly_vi' : language === 'en' ? 'four_line_en' : 'mizi_zh'
  );

  // Typography state
  const [selectedFontId, setSelectedFontId] = useState<string>(getDefaultFontForLanguage(language));
  const [crispOutline, setCrispOutline] = useState<boolean>(true);
  const [letterSpacingEm, setLetterSpacingEm] = useState<number>(language === 'en' ? 0.05 : 0.03);
  const [showFontSelector, setShowFontSelector] = useState<boolean>(language === 'en');

  const currentFont = getFontOptionById(selectedFontId);

  useEffect(() => {
    const defaultFid = getDefaultFontForLanguage(language);
    setSelectedFontId(defaultFid);
    if (language === 'en') {
      setShowFontSelector(true);
      setLetterSpacingEm(0.05);
    }
  }, [language]);

  // AI Generator state
  const [aiTopic, setAiTopic] = useState<string>('Châm ngôn & Động lực sống');
  const [aiLevel, setAiLevel] = useState<string>('Cơ bản đến Trung cấp');
  const [isLoadingAI, setIsLoadingAI] = useState<boolean>(false);
  const [generatedSentences, setGeneratedSentences] = useState<PracticeSentence[]>([]);

  // Current active sentence ready for AR or Canvas
  const defaultCurrent = SAMPLE_SENTENCES[language]?.[0] || {
    id: 'default_s',
    text: 'Học tập là hạt giống của hạnh phúc',
    language: 'vi',
    gridType: 'oly_vi',
    tips: 'Giữ độ nghiêng đều đặn, nét thanh đậm nhịp nhàng.',
    fontId: selectedFontId,
  };

  const [activeSentence, setActiveSentence] = useState<PracticeSentence>({
    ...defaultCurrent,
    fontId: selectedFontId,
  });

  const handleSelectFont = (fId: string) => {
    setSelectedFontId(fId);
    const fo = getFontOptionById(fId);
    setActiveSentence((prev) => ({
      ...prev,
      fontId: fId,
      fontFamily: fo.fontFamily,
    }));
  };

  const handleGenerateAI = async () => {
    setIsLoadingAI(true);
    try {
      const res = await fetch('/api/generate-sentences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language,
          topic: aiTopic,
          level: aiLevel,
        }),
      });

      const data = await res.json();
      if (data.success && Array.isArray(data.sentences) && data.sentences.length > 0) {
        const mapped: PracticeSentence[] = data.sentences.map((s: any, i: number) => ({
          id: `ai_${Date.now()}_${i}`,
          text: s.text || s.sentence,
          language,
          reading: s.reading || '',
          translation: s.translation || '',
          tips: s.tips || 'Chú ý khoảng cách và độ nghiêng của nét chữ.',
          gridType: selectedGrid,
          fontId: selectedFontId,
          fontFamily: currentFont.fontFamily,
          authorOrSource: 'AI gợi ý',
        }));
        setGeneratedSentences(mapped);
        setActiveSentence(mapped[0]);
      }
    } catch (err) {
      console.error('Error generating sentences:', err);
    } finally {
      setIsLoadingAI(false);
    }
  };

  const handleApplyCustom = () => {
    if (!customText.trim()) return;

    const newSentence: PracticeSentence = {
      id: `custom_${Date.now()}`,
      text: customText.trim(),
      language,
      reading: customReading.trim() || undefined,
      translation: customTranslation.trim() || undefined,
      tips: customTips.trim() || 'Nắn nót từng nét theo ô ly và dòng kẻ.',
      gridType: selectedGrid,
      fontId: selectedFontId,
      fontFamily: currentFont.fontFamily,
      authorOrSource: 'Câu tự tạo',
    };

    setActiveSentence(newSentence);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* 1. Active Sentence Preview & Direct Action Bar */}
      <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 bg-cyan-950/60 px-2.5 py-0.5 rounded-full border border-cyan-800/40">
                Câu đang chọn để luyện tập
              </span>
              <span className="text-[11px] font-mono text-neutral-400 bg-neutral-800 px-2 py-0.5 rounded-full">
                Font: <strong className="text-cyan-300">{currentFont.name}</strong>
              </span>
            </div>
            <h3 className="text-sm text-neutral-400 mt-1">
              {activeSentence.authorOrSource ? `Nguồn: ${activeSentence.authorOrSource}` : 'Sẵn sàng hắt hình AR'}
            </h3>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              id="toggle-font-selector-btn"
              onClick={() => setShowFontSelector(!showFontSelector)}
              className={`px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition border cursor-pointer ${
                showFontSelector
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500'
                  : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border-neutral-700'
              }`}
              title="Đổi kiểu chữ (15 Google Fonts tiếng Anh)"
            >
              <Type className="w-4 h-4 text-cyan-400" />
              <span>{showFontSelector ? 'Đóng bộ font' : 'Đổi kiểu chữ'}</span>
            </button>

            <button
              id="speak-active-sentence"
              onClick={() => speakText(activeSentence.text, activeSentence.language)}
              className="p-2.5 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition cursor-pointer"
              title="Phát âm câu này"
            >
              <Volume2 className="w-5 h-5 text-emerald-400" />
            </button>

            <button
              id="launch-canvas-sentence"
              onClick={() => onLaunchCanvas(activeSentence)}
              className="px-4 py-2.5 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 transition border border-neutral-700 cursor-pointer"
            >
              <PenTool className="w-4 h-4 text-cyan-400" /> Viết trên màn hình
            </button>

            <button
              id="launch-ar-sentence"
              onClick={() => onLaunchAR(activeSentence)}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-neutral-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-950/50 transition active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-neutral-950" /> Chiếu AR lên giấy 📷
            </button>
          </div>
        </div>

        {/* Large Practice Plate Visualizer */}
        <div className="relative p-6 sm:p-10 bg-[#fbf9f5] text-neutral-900 rounded-xl border border-neutral-300 shadow-inner flex flex-col items-center justify-center overflow-hidden">
          {/* Subtle Grid Lines according to selected grid */}
          {activeSentence.gridType === 'oly_vi' && (
            <div className="absolute inset-0 pointer-events-none opacity-30">
              <svg className="w-full h-full">
                <defs>
                  <pattern id="creator_oly" width="30" height="30" patternUnits="userSpaceOnUse">
                    <rect width="30" height="30" fill="none" stroke="#0284c7" strokeWidth="0.6" strokeOpacity="0.4" />
                    <line x1="0" y1="7.5" x2="30" y2="7.5" stroke="#0284c7" strokeWidth="0.3" strokeDasharray="1,2" strokeOpacity="0.3" />
                    <line x1="0" y1="15" x2="30" y2="15" stroke="#0284c7" strokeWidth="0.3" strokeDasharray="1,2" strokeOpacity="0.3" />
                    <line x1="0" y1="22.5" x2="30" y2="22.5" stroke="#0284c7" strokeWidth="0.3" strokeDasharray="1,2" strokeOpacity="0.3" />
                    <line x1="0" y1="30" x2="30" y2="30" stroke="#0369a1" strokeWidth="1.2" strokeOpacity="0.6" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#creator_oly)" />
              </svg>
            </div>
          )}

          {activeSentence.reading && (
            <div className="text-xs sm:text-sm font-mono text-cyan-800 font-medium tracking-wide mb-2 relative z-10">
              {activeSentence.reading}
            </div>
          )}

          <div 
            className={`text-2xl sm:text-4xl md:text-5xl text-neutral-900 tracking-wide leading-relaxed text-center relative z-10 px-4 py-2 whitespace-pre-line ar-tracing-text ${currentFont.className} ${
              crispOutline ? 'ar-crisp-outline' : ''
            }`}
            style={{
              fontFamily: currentFont.fontFamily,
              letterSpacing: `${letterSpacingEm}em`,
              fontStyle: 'normal',
            }}
          >
            {activeSentence.text}
          </div>

          {activeSentence.translation && (
            <div className="text-xs sm:text-sm text-neutral-600 mt-2 text-center max-w-xl font-sans relative z-10">
              {activeSentence.translation}
            </div>
          )}

          {activeSentence.tips && (
            <div className="mt-4 px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-900 rounded-lg text-xs flex items-center gap-1.5 relative z-10">
              <Lightbulb className="w-3.5 h-3.5 text-amber-600 shrink-0" /> {activeSentence.tips}
            </div>
          )}
        </div>

        {/* Expandable Font Selector Drawer */}
        {showFontSelector && (
          <div className="mt-5 pt-5 border-t border-neutral-800 animate-in fade-in slide-in-from-top-2 duration-200">
            <FontSelector
              selectedFontId={selectedFontId}
              onSelectFont={handleSelectFont}
              language={language}
              crispOutline={crispOutline}
              onToggleCrispOutline={setCrispOutline}
              letterSpacingEm={letterSpacingEm}
              onChangeLetterSpacing={setLetterSpacingEm}
            />
          </div>
        )}
      </div>

      {/* 2. Two Methods to Create/Choose Sentences: Custom Input & AI Generator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Method A: Type Your Own Custom Sentence */}
        <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                <PenTool className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Tự gõ câu của riêng bạn</h3>
                <p className="text-xs text-neutral-400">Nhập bất kỳ câu danh ngôn, bài thơ hoặc từ ngữ bạn muốn luyện</p>
              </div>
            </div>

            <div className="space-y-3 mt-4">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Nội dung câu viết mẫu *
                </label>
                <textarea
                  id="custom-sentence-input"
                  rows={3}
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder={
                    language === 'vi'
                      ? 'Ví dụ: Đoàn kết là sức mạnh ngàn đời của dân tộc'
                      : language === 'en'
                      ? 'e.g. Always believe that something wonderful is about to happen'
                      : language === 'ja'
                      ? '例: 継続は力なり (Kiên trì là sức mạnh)'
                      : '例如: 世上无难事只怕有心人'
                  }
                  className="w-full bg-neutral-950 border border-neutral-700/80 rounded-xl p-3 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-cyan-500 transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-neutral-400 mb-1">
                    Phiên âm / Romaji / Pinyin (tuỳ chọn)
                  </label>
                  <input
                    type="text"
                    value={customReading}
                    onChange={(e) => setCustomReading(e.target.value)}
                    placeholder="e.g. Shì shàng wú nán shì..."
                    className="w-full bg-neutral-950 border border-neutral-700/80 rounded-lg px-2.5 py-1.5 text-xs text-neutral-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-neutral-400 mb-1">
                    Nghĩa tiếng Việt (tuỳ chọn)
                  </label>
                  <input
                    type="text"
                    value={customTranslation}
                    onChange={(e) => setCustomTranslation(e.target.value)}
                    placeholder="Nghĩa giải thích câu..."
                    className="w-full bg-neutral-950 border border-neutral-700/80 rounded-lg px-2.5 py-1.5 text-xs text-neutral-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Grid Selector */}
              <div>
                <label className="block text-xs text-neutral-400 mb-1">
                  Kiểu khung lưới luyện tập:
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'oly_vi', label: 'Ô ly Tiểu học' },
                    { id: 'four_line_en', label: '4 Dòng kẻ Anh' },
                    { id: 'mizi_zh', label: 'Mễ tự cách (米)' },
                  ].map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setSelectedGrid(g.id as GridType)}
                      className={`px-2 py-1.5 rounded-lg border text-xs text-center truncate transition ${
                        selectedGrid === g.id
                          ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-semibold'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <button
            id="apply-custom-sentence-btn"
            onClick={handleApplyCustom}
            disabled={!customText.trim()}
            className="w-full mt-4 py-2.5 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition shadow"
          >
            <Check className="w-4 h-4" /> Áp dụng câu này để luyện tập
          </button>
        </div>

        {/* Method B: Smart AI Sentence Generator */}
        <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <Wand2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Tạo câu thông minh bằng AI</h3>
                <p className="text-xs text-neutral-400">Gemini tạo câu mẫu phù hợp với chủ đề & trình độ bạn chọn</p>
              </div>
            </div>

            <div className="space-y-3 mt-4">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Chủ đề mong muốn:
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    'Châm ngôn & Đạo đức',
                    'Ca dao, Thơ ca quê hương',
                    'Luyện chữ hoa & nét nối',
                    'Giao tiếp chuẩn bản xứ',
                  ].map((topic) => (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => setAiTopic(topic)}
                      className={`px-2.5 py-1.5 rounded-lg border text-xs text-left truncate transition ${
                        aiTopic === topic
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-semibold'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Trình độ luyện tập:
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {['Lớp 1-2 (Cơ bản)', 'Lớp 3-5 (Nâng cao)', 'Thư pháp nghệ thuật'].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setAiLevel(lvl)}
                      className={`px-2 py-1.5 rounded-lg border text-xs text-center truncate transition ${
                        aiLevel === lvl
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-semibold'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <button
                id="generate-ai-sentences-btn"
                onClick={handleGenerateAI}
                disabled={isLoadingAI}
                className="w-full mt-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-950/40 transition disabled:opacity-50"
              >
                {isLoadingAI ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Đang tạo câu mẫu...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" /> AI Gợi ý 3 câu luyện chữ
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Render Generated AI Sentences list */}
          {generatedSentences.length > 0 && (
            <div className="mt-4 space-y-2 border-t border-neutral-800 pt-3">
              <span className="text-[11px] font-semibold text-neutral-400">Kết quả từ Gemini:</span>
              {generatedSentences.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setActiveSentence(item)}
                  className={`p-2.5 rounded-xl border cursor-pointer transition flex items-center justify-between gap-2 ${
                    activeSentence.id === item.id
                      ? 'bg-amber-500/20 border-amber-500/50 text-white'
                      : 'bg-neutral-950/60 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                  }`}
                >
                  <div className="truncate text-xs">
                    <p className="font-medium text-white truncate">{item.text}</p>
                    {item.translation && <p className="text-[11px] text-neutral-400 truncate">{item.translation}</p>}
                  </div>
                  <ChevronRight className="w-4 h-4 text-neutral-500 shrink-0" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 3. Curated Sample Sentences Library for Current Language */}
      <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">
              Thư viện câu mẫu rèn chữ tuyển chọn ({SAMPLE_SENTENCES[language]?.length || 0} câu)
            </h3>
          </div>
          <span className="text-xs text-neutral-400">Nhấp vào câu để tải lên bảng mẫu</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SAMPLE_SENTENCES[language]?.map((item) => {
            const isCurrent = activeSentence.text === item.text;
            return (
              <div
                key={item.id}
                onClick={() => setActiveSentence(item)}
                className={`p-4 rounded-xl border cursor-pointer transition text-left relative group ${
                  isCurrent
                    ? 'bg-cyan-500/15 border-cyan-500 text-white shadow-md'
                    : 'bg-neutral-950/70 border-neutral-800 text-neutral-300 hover:bg-neutral-800/80 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <span className="text-[11px] font-mono text-cyan-400">{item.reading || item.authorOrSource}</span>
                  {isCurrent && (
                    <span className="text-[10px] bg-cyan-500 text-neutral-950 font-bold px-2 py-0.5 rounded-full">
                      Đang chọn
                    </span>
                  )}
                </div>

                <p 
                  className={`text-base text-white font-medium mb-1.5 leading-snug ar-tracing-text ${currentFont.className}`}
                  style={{ fontFamily: currentFont.fontFamily }}
                >
                  {item.text}
                </p>

                {item.translation && (
                  <p className="text-xs text-neutral-400 font-sans line-clamp-2">
                    {item.translation}
                  </p>
                )}

                <div className="mt-2 text-[11px] text-amber-300/80 font-sans flex items-center gap-1">
                  💡 {item.tips}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
