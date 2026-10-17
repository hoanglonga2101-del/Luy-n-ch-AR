import React, { useState } from 'react';
import { 
  Printer, 
  Download, 
  FileText, 
  Type, 
  Grid, 
  Sparkles, 
  Sliders, 
  RefreshCw, 
  Check, 
  Eye, 
  Copy,
  ChevronRight,
  BookOpen,
  ArrowRight,
  ZoomIn,
  ZoomOut,
  User,
  GraduationCap
} from 'lucide-react';
import { GridType, LanguageCode } from '../types';
import { 
  GOOGLE_15_ENGLISH_FONTS, 
  OTHER_LANGUAGE_FONTS, 
  getFontOptionById, 
  FontOption 
} from '../data/fontOptions';
import { FullWorkbookModal } from './FullWorkbookModal';
import { awardExp, unlockBadge } from '../utils/gamification';

interface WorksheetGeneratorProps {
  initialText?: string;
  initialLanguage?: LanguageCode;
  onLaunchLightbox?: (text: string, fontId?: string, gridType?: GridType) => void;
  onLaunchAR?: (text: string, fontId?: string, gridType?: GridType) => void;
}

const SAMPLE_TEXT_TEMPLATES = [
  {
    category: '🌸 Ca dao & Luyện chữ cho bé',
    items: [
      {
        title: 'Ca dao: Công cha nghĩa mẹ',
        text: 'Công cha như núi Thái Sơn\nNghĩa mẹ như nước trong nguồn chảy ra\nMột lòng thờ mẹ kính cha\nCho tròn chữ hiếu mới là đạo con',
        grid: 'oly_vi' as GridType,
        fontId: 'itim',
      },
      {
        title: 'Nét chữ nết người rèn đức',
        text: 'Nét chữ nết người rèn đức luyện tài\nCó công mài sắt có ngày nên kim\nHọc thầy không tày học bạn',
        grid: 'oly_vi' as GridType,
        fontId: 'be_vietnam',
      },
      {
        title: 'Bé tập viết 29 chữ cái hoa',
        text: 'A Ă Â B C D Đ E Ê G H I K L M N O Ô Ơ P Q R S T U Ư V X Y',
        grid: 'oly_vi' as GridType,
        fontId: 'itim',
      },
      {
        title: 'Bài thơ: Em yêu trường em',
        text: 'Em yêu trường em\nVới bao bạn thân\nVà cô giáo hiền\nNhư yêu quê hương\nCắp sách đến trường',
        grid: 'oly_vi' as GridType,
        fontId: 'itim',
      },
    ],
  },
  {
    category: '🇬🇧 Tiếng Anh - Cursive & Alphabet',
    items: [
      {
        title: 'Alphabet Practice (The quick fox)',
        text: 'The quick brown fox jumps over the lazy dog.\nPack my box with five dozen liquor jugs.',
        grid: 'four_line_en' as GridType,
        fontId: 'pinyon_script',
      },
      {
        title: 'Cursive Quote: Practice makes progress',
        text: 'Practice makes progress, not perfection.\nBelieve in yourself and you will be unstoppable.\nEvery artist was first an amateur.',
        grid: 'calligraphy_55' as GridType,
        fontId: 'great_vibes',
      },
    ],
  },
  {
    category: '🇨🇳 🇯🇵 Chữ Hán & Tiếng Nhật',
    items: [
      {
        title: 'Thành ngữ 4 chữ Hán (Ô Mễ)',
        text: '千里之行 始于足下\n天道酬勤 厚德载物\n学而时习 不亦说乎',
        grid: 'mizi_zh' as GridType,
        fontId: 'mashan',
      },
    ],
  },
];

export const WorksheetGenerator: React.FC<WorksheetGeneratorProps> = ({
  initialText = 'Công cha như núi Thái Sơn\nNghĩa mẹ như nước trong nguồn chảy ra\nMột lòng thờ mẹ kính cha\nCho tròn chữ hiếu mới là đạo con',
  initialLanguage = 'vi',
  onLaunchLightbox,
  onLaunchAR,
}) => {
  const [worksheetTitle, setWorksheetTitle] = useState('PHIẾU BÀI TẬP RÈN CHỮ ĐẸP');
  const [studentName, setStudentName] = useState('');
  const [className, setClassName] = useState('');
  const [dateText, setDateText] = useState(() => {
    const today = new Date();
    return `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;
  });

  const [text, setText] = useState(initialText);
  const [selectedFontId, setSelectedFontId] = useState<string>('itim');
  const [gridType, setGridType] = useState<GridType>('oly_vi');
  const [tracingMode, setTracingMode] = useState<'faded' | 'dotted' | 'first_char' | 'blank_grid'>('faded');
  const [fontSize, setFontSize] = useState<number>(38); // px on screen
  const [lineCount, setLineCount] = useState<number>(8);
  const [showTeacherFeedback, setShowTeacherFeedback] = useState<boolean>(true);
  const [fadedOpacity, setFadedOpacity] = useState<number>(0.3);
  const [previewZoom, setPreviewZoom] = useState<boolean>(false); // for mobile preview zoom
  const [isWorkbookOpen, setIsWorkbookOpen] = useState<boolean>(false);

  const currentFont = getFontOptionById(selectedFontId);
  const textLines = text.split('\n').filter(l => l.trim().length > 0);

  const handlePrint = () => {
    awardExp(5, 'In phiếu bài tập A4', { isPrint: true });
    unlockBadge('print_master');
    window.print();
  };

  return (
    <div className="w-full min-h-[100dvh] bg-neutral-950 text-neutral-100 flex flex-col items-center py-4 sm:py-6 px-2.5 sm:px-6" style={{ minHeight: '100dvh' }}>
      {/* Control Panel (Hidden during print) */}
      <div className="no-print w-full max-w-5xl mb-6 space-y-4 sm:space-y-5">
        {/* Kid-friendly Cheerful Banner */}
        <div className="bg-gradient-to-br from-emerald-950/90 via-neutral-900 to-teal-950/90 border-2 border-emerald-700/50 rounded-3xl p-4 sm:p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                <span>🖨️</span> Dành cho bé tập viết
              </span>
              <span className="text-xs sm:text-sm font-semibold text-neutral-300">Khổ giấy chuẩn in A4</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
              In Phiếu Luyện Viết Ô Ly A4 Cho Bé 📝
            </h2>
            <p className="text-xs sm:text-base text-neutral-200 max-w-2xl leading-relaxed">
              Bé chọn bài thơ, chỉnh kiểu ô ly rồi bấm nút <strong>"In ra giấy A4"</strong> để cầm bút mực viết thật lên giấy theo nét mờ hoặc nét chấm đứt!
            </p>
          </div>

          {/* Big, thumb-friendly Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 shrink-0">
            <button
              id="btn-print-worksheet"
              onClick={handlePrint}
              className="w-full sm:w-auto px-6 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-400 hover:brightness-110 text-neutral-950 font-black text-base sm:text-lg shadow-xl shadow-emerald-950/60 flex items-center justify-center gap-2.5 transition active:scale-95 cursor-pointer"
            >
              <Printer className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-950" />
              <span>In ngay ra giấy A4 🖨️</span>
            </button>

            <button
              id="btn-open-full-workbook"
              onClick={() => setIsWorkbookOpen(true)}
              className="w-full sm:w-auto px-4 py-3 sm:py-3.5 rounded-2xl bg-gradient-to-r from-amber-500/25 to-rose-500/25 hover:from-amber-500/35 hover:to-rose-500/35 text-amber-300 border-2 border-amber-500/40 font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition cursor-pointer active:scale-95"
              title="Xuất trọn bộ vở 30 ngày thành 1 file in"
            >
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
              <span>Trọn bộ Vở 30 Ngày ⭐</span>
            </button>

            {onLaunchLightbox && (
              <button
                id="btn-quick-launch-lightbox"
                onClick={() => onLaunchLightbox(text, selectedFontId, gridType)}
                className="w-full sm:w-auto px-4 py-3 sm:py-3.5 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border-2 border-amber-500/40 font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition cursor-pointer active:scale-95"
                title="Phóng to để kê giấy mỏng lên đồ nét"
              >
                <Type className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Coi kiểu chữ đồ nét</span>
              </button>
            )}
          </div>
        </div>

        {/* Configuration Options Grid: Large, touchable controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
          {/* Col 1: Text Content & Quick Kid-friendly Templates */}
          <div className="bg-neutral-900 border-2 border-neutral-800 rounded-3xl p-4 sm:p-5 space-y-3.5 shadow-lg">
            <div className="flex items-center justify-between">
              <label className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
                <span>📝</span> Bài thơ hoặc câu luyện viết
              </label>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full">
                {textLines.length} dòng
              </span>
            </div>

            <textarea
              id="worksheet-text-input"
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Bé hoặc phụ huynh nhập câu muốn in..."
              className="w-full px-3.5 py-3 bg-neutral-950 border-2 border-neutral-700/90 rounded-2xl text-sm sm:text-base text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-400 transition"
            />

            {/* Quick Templates Selector */}
            <div className="space-y-2">
              <span className="text-xs sm:text-sm font-extrabold text-amber-300 flex items-center gap-1">
                <span>⭐</span> Chọn bài mẫu có sẵn cho bé:
              </span>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {SAMPLE_TEXT_TEMPLATES.map((group) => (
                  <div key={group.category} className="space-y-1">
                    <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider pt-1">
                      {group.category}
                    </div>
                    {group.items.map((item) => (
                      <button
                        key={item.title}
                        onClick={() => {
                          setText(item.text);
                          setGridType(item.grid);
                          setSelectedFontId(item.fontId);
                        }}
                        className="w-full text-left p-2.5 sm:p-2 rounded-xl bg-neutral-800 hover:bg-neutral-750 border border-neutral-700 text-xs sm:text-sm text-neutral-200 hover:text-white transition flex items-center justify-between active:scale-98 cursor-pointer"
                      >
                        <span className="truncate font-semibold">{item.title}</span>
                        <ChevronRight className="w-4 h-4 text-emerald-400 shrink-0 ml-1" />
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Col 2: Grid Type & Font Selector */}
          <div className="bg-neutral-900 border-2 border-neutral-800 rounded-3xl p-4 sm:p-5 space-y-3.5 shadow-lg">
            <div className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
              <span>📐</span> Chọn loại ô ly & Kiểu chữ
            </div>

            {/* Grid Type Picker */}
            <div>
              <label className="text-xs sm:text-sm font-bold text-neutral-300 mb-1.5 block">
                Loại dòng kẻ tập viết:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'oly_vi', label: '4 Ô ly Tiểu học', note: 'Chuẩn lớp 1-5 VN ⭐' },
                  { id: 'four_line_en', label: 'Kẻ 4 dòng Anh', note: 'Tập viết chữ Tây' },
                  { id: 'calligraphy_55', label: 'Nghiêng 55°', note: 'Nét thanh nét đậm' },
                  { id: 'mizi_zh', label: 'Ô Mễ chữ Hán', note: 'Tiếng Trung & Nhật' },
                ].map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setGridType(g.id as GridType)}
                    className={`p-2.5 sm:p-3 rounded-2xl text-left border-2 transition active:scale-95 cursor-pointer ${
                      gridType === g.id
                        ? 'bg-emerald-500/20 border-emerald-400 text-white font-black shadow-md'
                        : 'bg-neutral-850 border-neutral-700/80 text-neutral-300 hover:bg-neutral-800'
                    }`}
                  >
                    <div className="text-xs sm:text-sm font-bold leading-tight">{g.label}</div>
                    <div className="text-[10px] sm:text-xs text-neutral-400 mt-0.5">{g.note}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Font Selection Dropdown */}
            <div>
              <label className="text-xs sm:text-sm font-bold text-neutral-300 mb-1.5 block">
                Kiểu chữ mẫu (Font):
              </label>
              <select
                id="worksheet-font-select"
                value={selectedFontId}
                onChange={(e) => setSelectedFontId(e.target.value)}
                className="w-full py-3 px-3.5 bg-neutral-950 border-2 border-neutral-700/90 rounded-2xl text-white font-bold text-sm focus:outline-none focus:border-emerald-400 cursor-pointer"
              >
                <optgroup label="🌟 Font Tiếng Việt Dành Cho Bé">
                  {OTHER_LANGUAGE_FONTS.map((font) => (
                    <option key={font.id} value={font.id} className="bg-neutral-900 text-white py-1">
                      {font.vietnameseTitle} ({font.name})
                    </option>
                  ))}
                </optgroup>
                <optgroup label="🇬🇧 15 Font Calligraphy & Tiếng Anh">
                  {GOOGLE_15_ENGLISH_FONTS.map((font) => (
                    <option key={font.id} value={font.id} className="bg-neutral-900 text-white py-1">
                      {font.order}. {font.vietnameseTitle} ({font.name})
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            {/* Tracing Mode */}
            <div>
              <label className="text-xs sm:text-sm font-bold text-neutral-300 mb-1.5 block">
                Cách in chữ trên dòng:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'faded', label: 'Nét xám mờ', desc: 'Bé tô theo rất dễ' },
                  { id: 'dotted', label: 'Nét chấm đứt', desc: 'Bé nối từng chấm' },
                  { id: 'first_char', label: 'Mẫu đầu dòng', desc: 'Bé tự viết tiếp' },
                  { id: 'blank_grid', label: 'Trang giấy trắng', desc: 'Bé tự do viết' },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setTracingMode(m.id as any)}
                    className={`p-2.5 rounded-2xl text-left border-2 transition active:scale-95 cursor-pointer ${
                      tracingMode === m.id
                        ? 'bg-cyan-500/25 border-cyan-400 text-white font-black shadow-md'
                        : 'bg-neutral-850 border-neutral-700/80 text-neutral-300 hover:bg-neutral-800'
                    }`}
                  >
                    <div className="text-xs sm:text-sm font-bold leading-tight">{m.label}</div>
                    <div className="text-[10px] sm:text-xs text-neutral-400 mt-0.5">{m.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Col 3: Student Info & Sizing */}
          <div className="bg-neutral-900 border-2 border-neutral-800 rounded-3xl p-4 sm:p-5 space-y-3.5 shadow-lg">
            <div className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
              <span>🏷️</span> Tên bé & Số dòng in
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-xs sm:text-sm font-bold text-neutral-300 mb-1 block">Tên của bé:</label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Gia Hân"
                  className="w-full px-3 py-2.5 bg-neutral-950 border-2 border-neutral-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-xs sm:text-sm font-bold text-neutral-300 mb-1 block">Lớp:</label>
                <input
                  type="text"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  placeholder="Ví dụ: 1A, 2B..."
                  className="w-full px-3 py-2.5 bg-neutral-950 border-2 border-neutral-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="text-xs sm:text-sm font-bold text-neutral-300 mb-1 block">Tiêu đề bài in:</label>
              <input
                type="text"
                value={worksheetTitle}
                onChange={(e) => setWorksheetTitle(e.target.value)}
                placeholder="PHIẾU BÀI TẬP RÈN CHỮ ĐẸP"
                className="w-full px-3 py-2.5 bg-neutral-950 border-2 border-neutral-700 rounded-xl text-xs sm:text-sm text-white font-bold focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Sliders: Cỡ chữ và Số dòng */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-neutral-300 mb-1">
                  <span>Cỡ chữ:</span>
                  <span className="font-mono text-amber-300">{fontSize}px</span>
                </div>
                <input
                  type="range"
                  min="26"
                  max="64"
                  step="2"
                  value={fontSize}
                  onChange={(e) => setFontSize(parseInt(e.target.value, 10))}
                  className="w-full accent-amber-400 h-3 bg-neutral-700 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-neutral-300 mb-1">
                  <span>Số dòng:</span>
                  <span className="font-mono text-amber-300">{lineCount} dòng</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="14"
                  step="1"
                  value={lineCount}
                  onChange={(e) => setLineCount(parseInt(e.target.value, 10))}
                  className="w-full accent-amber-400 h-3 bg-neutral-700 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-1.5">
              <input
                id="check-show-feedback"
                type="checkbox"
                checked={showTeacherFeedback}
                onChange={(e) => setShowTeacherFeedback(e.target.checked)}
                className="w-5 h-5 rounded text-emerald-500 bg-neutral-800 border-neutral-700 cursor-pointer"
              />
              <label htmlFor="check-show-feedback" className="text-xs sm:text-sm font-bold text-neutral-200 cursor-pointer">
                In khung "Điểm số & Lời khen của cô giáo"
              </label>
            </div>
          </div>
        </div>

        {/* Mobile preview helper bar */}
        <div className="flex items-center justify-between bg-neutral-900 border border-neutral-800 px-4 py-2.5 rounded-2xl text-xs sm:text-sm">
          <span className="font-bold text-neutral-300 flex items-center gap-2">
            <span>📄</span> Bản xem trước trang giấy in A4 (Dưới đây)
          </span>

          <button
            onClick={() => setPreviewZoom(!previewZoom)}
            className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-cyan-300 font-bold flex items-center gap-1.5 transition active:scale-95"
          >
            {previewZoom ? (
              <>
                <ZoomOut className="w-4 h-4" /> Thu nhỏ cả trang
              </>
            ) : (
              <>
                <ZoomIn className="w-4 h-4" /> Phóng to xem rõ
              </>
            )}
          </button>
        </div>
      </div>

      {/* A4 PRINTABLE WORKSHEET PREVIEW & PRINT CANVAS */}
      <div className={`w-full flex justify-center ${previewZoom ? 'overflow-x-auto pb-6' : ''}`}>
        <div 
          id="a4-printable-page"
          className={`print-page-container bg-white text-neutral-900 rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-10 transition border border-neutral-200 select-text ${
            previewZoom ? 'min-w-[800px] max-w-4xl' : 'w-full max-w-4xl'
          }`}
          style={{
            minHeight: '297mm',
          }}
        >
          {/* Header of Printable Sheet */}
          <div className="border-b-2 border-neutral-900 pb-3 mb-5">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-lg sm:text-2xl font-black tracking-tight text-neutral-900 uppercase">
                  {worksheetTitle}
                </h1>
                <div className="text-xs sm:text-sm text-neutral-600 mt-0.5">
                  Kiểu chữ: <span className="font-bold">{currentFont.vietnameseTitle}</span> ({currentFont.name})
                </div>
              </div>

              {showTeacherFeedback && (
                <div className="border-2 border-neutral-900 rounded-xl p-2 text-center min-w-[150px]">
                  <div className="text-[11px] sm:text-xs font-black text-neutral-800 uppercase tracking-wider border-b border-neutral-300 pb-1">
                    ĐIỂM SỐ & LỜI KHEN
                  </div>
                  <div className="h-9 flex items-center justify-center text-neutral-400 text-xs italic">
                    (Cô giáo chấm)
                  </div>
                </div>
              )}
            </div>

            {/* Student Info Row */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-3 text-xs sm:text-sm text-neutral-800 font-bold">
              <div>Họ và tên: <span className="border-b-2 border-dotted border-neutral-600 inline-block w-28 sm:w-48 text-center text-emerald-800">{studentName || '................................'}</span></div>
              <div>Lớp: <span className="border-b-2 border-dotted border-neutral-600 inline-block w-14 sm:w-24 text-center text-emerald-800">{className || '................'}</span></div>
              <div className="text-right">Ngày: <span className="border-b-2 border-dotted border-neutral-600 inline-block w-24 text-center">{dateText}</span></div>
            </div>
          </div>

          {/* Printable Practice Lines Container */}
          <div className="space-y-4">
            {Array.from({ length: lineCount }).map((_, lineIdx) => {
              const lineText = textLines[lineIdx % Math.max(textLines.length, 1)] || '';
              const shouldRenderText = tracingMode !== 'blank_grid' && (tracingMode !== 'first_char' || lineIdx % 2 === 0);

              return (
                <div 
                  key={lineIdx}
                  className="relative w-full overflow-hidden border border-neutral-300/80 rounded-xl bg-neutral-50/40"
                  style={{
                    height: `${Math.max(fontSize * 1.8, 64)}px`,
                  }}
                >
                  {/* SVG Background Ruling Grids */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      {/* 1. Lưới 4 ô ly tiểu học Việt Nam */}
                      {gridType === 'oly_vi' && (
                        <pattern id={`print-oly-${lineIdx}`} width="28" height="28" patternUnits="userSpaceOnUse">
                          <path d="M 0 7 L 28 7 M 0 14 L 28 14 M 0 21 L 28 21" fill="none" stroke="#cbd5e1" strokeWidth="0.5" strokeDasharray="2 2" />
                          <path d="M 7 0 L 7 28 M 14 0 L 14 28 M 21 0 L 21 28" fill="none" stroke="#cbd5e1" strokeWidth="0.5" strokeDasharray="2 2" />
                          <path d="M 28 0 L 0 0 0 28" fill="none" stroke="#94a3b8" strokeWidth="0.8" />
                        </pattern>
                      )}

                      {/* 2. Dòng kẻ nghiêng Calligraphy 55° */}
                      {gridType === 'calligraphy_55' && (
                        <pattern id={`print-slant-${lineIdx}`} width="36" height="36" patternUnits="userSpaceOnUse">
                          <line x1="0" y1="36" x2="25" y2="0" stroke="#cbd5e1" strokeWidth="0.6" strokeDasharray="3 3" />
                        </pattern>
                      )}

                      {/* 3. Ô Mễ chữ Hán */}
                      {gridType === 'mizi_zh' && (
                        <pattern id={`print-mizi-${lineIdx}`} width="56" height="56" patternUnits="userSpaceOnUse">
                          <rect width="56" height="56" fill="none" stroke="#94a3b8" strokeWidth="0.8" />
                          <line x1="0" y1="28" x2="56" y2="28" stroke="#cbd5e1" strokeWidth="0.5" strokeDasharray="3 3" />
                          <line x1="28" y1="0" x2="28" y2="56" stroke="#cbd5e1" strokeWidth="0.5" strokeDasharray="3 3" />
                          <line x1="0" y1="0" x2="56" y2="56" stroke="#e2e8f0" strokeWidth="0.5" strokeDasharray="2 2" />
                          <line x1="0" y1="56" x2="56" y2="0" stroke="#e2e8f0" strokeWidth="0.5" strokeDasharray="2 2" />
                        </pattern>
                      )}
                    </defs>

                    {/* Fill Pattern */}
                    {gridType === 'oly_vi' && (
                      <rect width="100%" height="100%" fill={`url(#print-oly-${lineIdx})`} />
                    )}
                    {gridType === 'calligraphy_55' && (
                      <rect width="100%" height="100%" fill={`url(#print-slant-${lineIdx})`} />
                    )}
                    {gridType === 'mizi_zh' && (
                      <rect width="100%" height="100%" fill={`url(#print-mizi-${lineIdx})`} />
                    )}

                    {/* Dòng kẻ cơ sở đậm (Baseline) cho tiếng Anh */}
                    {(gridType === 'four_line_en' || gridType === 'calligraphy_55') && (
                      <>
                        <line x1="0" y1="18%" x2="100%" y2="18%" stroke="#94a3b8" strokeWidth="0.8" />
                        <line x1="0" y1="45%" x2="100%" y2="45%" stroke="#64748b" strokeWidth="0.7" strokeDasharray="3 3" />
                        <line x1="0" y1="72%" x2="100%" y2="72%" stroke="#e11d48" strokeWidth="1.2" />
                        <line x1="0" y1="95%" x2="100%" y2="95%" stroke="#94a3b8" strokeWidth="0.6" strokeDasharray="2 2" />
                      </>
                    )}
                  </svg>

                  {/* Tracing Text Content Overlay */}
                  {shouldRenderText && lineText && (
                    <div 
                      className="relative z-10 w-full h-full flex items-center px-4"
                      style={{
                        fontFamily: currentFont.fontFamily,
                        fontSize: `${fontSize}px`,
                        lineHeight: 1,
                      }}
                    >
                      {tracingMode === 'first_char' ? (
                        <div>
                          <span className="font-bold text-neutral-900 border-r-2 border-neutral-300 pr-3 mr-3 inline-block">
                            {lineText.split(' ')[0]}
                          </span>
                          <span className="opacity-20 italic text-neutral-400 text-xs">
                            (Bé tự viết tiếp theo mẫu)
                          </span>
                        </div>
                      ) : tracingMode === 'dotted' ? (
                        <span 
                          className="font-normal select-none tracking-wide"
                          style={{
                            color: 'transparent',
                            WebkitTextStroke: '1px #64748b',
                            strokeDasharray: '3 2',
                            opacity: 0.75,
                          }}
                        >
                          {lineText}
                        </span>
                      ) : (
                        <span 
                          className="font-normal select-none tracking-wide"
                          style={{
                            color: '#1e293b',
                            opacity: fadedOpacity,
                          }}
                        >
                          {lineText}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer of Printable Sheet */}
          <div className="mt-8 pt-4 border-t border-neutral-300 flex items-center justify-between text-xs text-neutral-500">
            <div>Luyện chữ AR • Nét chữ nết người ✍️</div>
            <div>Trang 1 / 1 • Khổ in tiêu chuẩn A4</div>
          </div>
        </div>
      </div>

      {/* Full 30-day Workbook Modal */}
      <FullWorkbookModal
        isOpen={isWorkbookOpen}
        onClose={() => setIsWorkbookOpen(false)}
      />
    </div>
  );
};
