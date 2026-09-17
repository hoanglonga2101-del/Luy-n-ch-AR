import React, { useState } from 'react';
import { 
  Printer, 
  X, 
  BookOpen, 
  Calendar, 
  Check, 
  Sparkles, 
  Download, 
  Sliders, 
  Layers,
  ChevronRight,
  GraduationCap
} from 'lucide-react';
import { GridType } from '../types';
import { awardExp, unlockBadge } from '../utils/gamification';

interface FullWorkbookModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface WorkbookDayPlan {
  day: number;
  title: string;
  category: string;
  sampleLines: string[];
}

const WORKBOOK_30_DAYS: WorkbookDayPlan[] = [
  // Tuần 1: Nét cơ bản (Ngày 1 - 7)
  { day: 1, title: 'Nét sổ thẳng & Nét ngang', category: 'Tuần 1: Các nét cơ bản', sampleLines: ['| | | | | | | | | |', '— — — — — — — — — —', '| — | — | — | — | —'] },
  { day: 2, title: 'Nét xiên trái & Nét xiên phải', category: 'Tuần 1: Các nét cơ bản', sampleLines: ['/ / / / / / / / / /', '\\ \\ \\ \\ \\ \\ \\ \\ \\ \\', '/ \\ / \\ / \\ / \\ / \\'] },
  { day: 3, title: 'Nét móc xuôi & Nét móc ngược', category: 'Tuần 1: Các nét cơ bản', sampleLines: ['r r r r r r r r r r', 'i i i i i i i i i i', 'u u u u u u u u u u'] },
  { day: 4, title: 'Nét móc hai đầu', category: 'Tuần 1: Các nét cơ bản', sampleLines: ['n n n n n n n n n n', 'm m m m m m m m m m', 'n m n m n m n m n m'] },
  { day: 5, title: 'Nét cong hở phải & cong hở trái', category: 'Tuần 1: Các nét cơ bản', sampleLines: ['c c c c c c c c c c', 'x x x x x x x x x x', 'c x c x c x c x c x'] },
  { day: 6, title: 'Nét cong kín (Chữ o tròn như quả trứng)', category: 'Tuần 1: Các nét cơ bản', sampleLines: ['o o o o o o o o o o', 'ô ô ô ô ô ô ô ô ô ô', 'ơ ơ ơ ơ ơ ơ ơ ơ ơ ơ'] },
  { day: 7, title: 'Tổng ôn các nét cơ bản tuần 1', category: 'Tuần 1: Các nét cơ bản', sampleLines: ['| — / \\ r i c o n m', 'Bé chăm chỉ rèn nét chữ', 'Nét chữ nết người ngoan'] },

  // Tuần 2: Chữ cái nét móc và nét cong (Ngày 8 - 14)
  { day: 8, title: 'Nhóm chữ i, u, ư, t', category: 'Tuần 2: Chữ thường nét móc', sampleLines: ['i u ư t i u ư t i u', 'ti vi, củ từ, tơ lụa', 'bé tí hon, quả mít'] },
  { day: 9, title: 'Nhóm chữ n, m, p', category: 'Tuần 2: Chữ thường nét móc', sampleLines: ['n m p n m p n m p', 'núi nón, mẹ yêu, phố', 'mùa xuân hoa nở thắm'] },
  { day: 10, title: 'Nhóm chữ o, ô, ơ, a, ă, â', category: 'Tuần 2: Chữ thường nét cong kín', sampleLines: ['o ô ơ a ă â o ô ơ', 'cá quả, cô giáo, mơ', 'bàn tay mẹ ấm áp lạ'] },
  { day: 11, title: 'Nhóm chữ d, đ, q', category: 'Tuần 2: Chữ thường nét cong', sampleLines: ['d đ q d đ q d đ q', 'dòng sông, đồi chè, qua', 'đất nước việt nam đẹp'] },
  { day: 12, title: 'Nhóm chữ c, e, ê, x', category: 'Tuần 2: Chữ thường nét cong', sampleLines: ['c e ê x c e ê x c e', 'con sẻ, xe cộ, cây tre', 'tiếng ve kêu râm ran'] },
  { day: 13, title: 'Nhóm chữ nét thắt s, r, v', category: 'Tuần 2: Chữ thường nét thắt', sampleLines: ['s r v s r v s r v s', 'sao sáng, rổ tre, vở', 'vui vẻ tới trường cùng'] },
  { day: 14, title: 'Luyện câu ghép từ tuần 2', category: 'Tuần 2: Chữ thường nét móc', sampleLines: ['cây me râm mát đầu làng', 'mẹ dắt bé tới trường', 'hoa phượng vĩ đỏ rực rỡ'] },

  // Tuần 3: Chữ cái nét khuyết & Chữ ghép (Ngày 15 - 21)
  { day: 15, title: 'Chữ l, b (Nét khuyết trên cao 2.5 ly)', category: 'Tuần 3: Chữ nét khuyết', sampleLines: ['l b l b l b l b l b', 'lá biếc, bạn hiền, lau', 'bông hoa sen ngát hương'] },
  { day: 16, title: 'Chữ h, k (Nét khuyết trên kết hợp nét móc)', category: 'Tuần 3: Chữ nét khuyết', sampleLines: ['h k h k h k h k h k', 'hoa hồng, kéo cưa, học', 'học tập chăm ngoan giỏi'] },
  { day: 17, title: 'Chữ g, y (Nét khuyết dưới kéo dài 1.5 ly)', category: 'Tuần 3: Chữ nét khuyết', sampleLines: ['g y g y g y g y g y', 'gà gáy, ý nghĩ, con cá', 'ngày ngày chăm chỉ viết'] },
  { day: 18, title: 'Chữ ghép th, ch, kh, ph', category: 'Tuần 3: Chữ nét khuyết', sampleLines: ['th ch kh ph th ch kh', 'thầy cô, chùm nho, phố', 'khéo léo từng nét bút'] },
  { day: 19, title: 'Chữ ghép nh, ng, ngh, gh', category: 'Tuần 3: Chữ nét khuyết', sampleLines: ['nh ng ngh gh nh ng', 'nhà ngói, ngày nghỉ, ghé', 'ngôi sao lấp lánh đêm'] },
  { day: 20, title: 'Chữ ghép tr, qu, gi', category: 'Tuần 3: Chữ nét khuyết', sampleLines: ['tr qu gi tr qu gi tr', 'trường học, quê hương, gió', 'giữ gìn sách vở sạch đẹp'] },
  { day: 21, title: 'Đoạn thơ ngắn tuần 3', category: 'Tuần 3: Chữ nét khuyết', sampleLines: ['Học ăn học nói học gói', 'Học mở cho lòng sáng trong', 'Công cha như núi thái sơn'] },

  // Tuần 4: Chữ hoa & Đoạn văn hoàn chỉnh (Ngày 22 - 30)
  { day: 22, title: 'Chữ hoa nhóm 1: A, Ă, Â, M, N', category: 'Tuần 4: Chữ hoa & Thơ hay', sampleLines: ['A Ă Â M N A Ă Â M', 'An Giang, Nam Định, Mẹ', 'Mùa xuân trên thành phố'] },
  { day: 23, title: 'Chữ hoa nhóm 2: B, C, D, Đ', category: 'Tuần 4: Chữ hoa & Thơ hay', sampleLines: ['B C D Đ B C D Đ B', 'Bác Hồ, Cần Thơ, Đà Nẵng', 'Đất nước gấm vóc mến yêu'] },
  { day: 24, title: 'Chữ hoa nhóm 3: E, Ê, G, H, I, K', category: 'Tuần 4: Chữ hoa & Thơ hay', sampleLines: ['E Ê G H I K E Ê G', 'Hà Nội, Khánh Hòa, Gia Lai', 'Học hành tiến bộ từng ngày'] },
  { day: 25, title: 'Chữ hoa nhóm 4: L, P, Q, R, S, T', category: 'Tuần 4: Chữ hoa & Thơ hay', sampleLines: ['L P Q R S T L P Q', 'Quảng Nam, Thái Bình, Sơn La', 'Thầy cô chắp cánh ước mơ'] },
  { day: 26, title: 'Chữ hoa nhóm 5: U, Ư, V, X, Y', category: 'Tuần 4: Chữ hoa & Thơ hay', sampleLines: ['U Ư V X Y U Ư V X', 'Việt Nam, Yên Bái, Vũng Tàu', 'Việt Nam quê hương tươi đẹp'] },
  { day: 27, title: 'Ca dao tục ngữ: Công cha nghĩa mẹ', category: 'Tuần 4: Chữ hoa & Thơ hay', sampleLines: ['Công cha như núi Thái Sơn', 'Nghĩa mẹ như nước trong nguồn chảy ra', 'Một lòng thờ mẹ kính cha', 'Cho tròn chữ hiếu mới là đạo con'] },
  { day: 28, title: 'Bài thơ: Luyện nét chữ rèn nết người', category: 'Tuần 4: Chữ hoa & Thơ hay', sampleLines: ['Mỗi ngày một trang vở sạch', 'Từng dòng chữ đẹp ngay hàng', 'Nụ cười cô giáo dịu dàng', 'Khen bé tay hoa viết khéo'] },
  { day: 29, title: 'Bài thơ: Cùng bé đến trường', category: 'Tuần 4: Chữ hoa & Thơ hay', sampleLines: ['Mặt trời vừa thức dậy', 'Đưa bé bước tới trường', 'Trang vở trắng thơm tho', 'Rộn ràng bao tiếng hát'] },
  { day: 30, title: 'Lễ tốt nghiệp khóa 30 ngày Luyện Chữ', category: 'Tuần 4: Chữ hoa & Thơ hay', sampleLines: ['Chúc mừng bé hoàn thành 30 ngày!', 'Nét chữ của bé đã tròn trịa, thẳng tắp', 'Đạt danh hiệu Vở Sạch Chữ Đẹp năm học!'] },
];

export const FullWorkbookModal: React.FC<FullWorkbookModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedWeek, setSelectedWeek] = useState<'all' | 'w1' | 'w2' | 'w3' | 'w4'>('all');
  const [gridType, setGridType] = useState<GridType>('oly_vi');
  const [tracingMode, setTracingMode] = useState<'dotted' | 'faded'>('dotted');
  const [studentName, setStudentName] = useState('Bé Yêu');
  const [className, setClassName] = useState('Lớp 1A');
  const [schoolName, setSchoolName] = useState('Trường Tiểu Học');

  if (!isOpen) return null;

  const filteredDays = WORKBOOK_30_DAYS.filter((item) => {
    if (selectedWeek === 'w1') return item.day <= 7;
    if (selectedWeek === 'w2') return item.day >= 8 && item.day <= 14;
    if (selectedWeek === 'w3') return item.day >= 15 && item.day <= 21;
    if (selectedWeek === 'w4') return item.day >= 22 && item.day <= 30;
    return true;
  });

  const handlePrint = () => {
    awardExp(50, 'Xuất trọn bộ tập vở 30 ngày');
    unlockBadge('print_master');
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-sm">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl bg-neutral-900 border border-neutral-700/90 rounded-3xl p-5 sm:p-7 text-neutral-100 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 text-white shadow-lg shadow-rose-950/40">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  Trọn bộ Vở Luyện Chữ 30 Ngày (Khổ A4)
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Chuẩn Bộ GD&ĐT
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                In trọn cuốn vở cho bé luyện từ Nét cơ bản ➜ Chữ thường ➜ Chữ khuyết ➜ Chữ hoa & Đoạn thơ
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white rounded-full bg-neutral-800 hover:bg-neutral-750 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Configuration Bar */}
        <div className="py-3.5 px-4 bg-neutral-950 rounded-2xl border border-neutral-800 mt-3 grid grid-cols-1 sm:grid-cols-4 gap-3 shrink-0 text-xs">
          <div>
            <label className="block text-[11px] text-neutral-400 font-semibold mb-1">
              Phạm vi in:
            </label>
            <select
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(e.target.value as any)}
              className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-2.5 py-1.5 text-white font-medium focus:ring-1 focus:ring-emerald-500 outline-none"
            >
              <option value="all">Trọn bộ 30 Ngày (30 trang)</option>
              <option value="w1">Tuần 1: Nét cơ bản (7 trang)</option>
              <option value="w2">Tuần 2: Chữ thường nét móc (7 trang)</option>
              <option value="w3">Tuần 3: Chữ nét khuyết & ghép (7 trang)</option>
              <option value="w4">Tuần 4: Chữ hoa & Ca dao (9 trang)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] text-neutral-400 font-semibold mb-1">
              Kiểu đồ chữ:
            </label>
            <div className="flex gap-1.5">
              <button
                onClick={() => setTracingMode('dotted')}
                className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold border transition ${
                  tracingMode === 'dotted'
                    ? 'bg-emerald-600 text-white border-emerald-400'
                    : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
                }`}
              >
                Nét chấm đứt
              </button>
              <button
                onClick={() => setTracingMode('faded')}
                className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold border transition ${
                  tracingMode === 'faded'
                    ? 'bg-emerald-600 text-white border-emerald-400'
                    : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
                }`}
              >
                Nét mờ 30%
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[11px] text-neutral-400 font-semibold mb-1">
              Họ và tên bé:
            </label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-2.5 py-1.5 text-white outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="Nhập tên bé..."
            />
          </div>

          <div>
            <label className="block text-[11px] text-neutral-400 font-semibold mb-1">
              Lớp & Trường:
            </label>
            <input
              type="text"
              value={`${className} - ${schoolName}`}
              onChange={(e) => {
                const parts = e.target.value.split('-');
                setClassName(parts[0]?.trim() || '');
                setSchoolName(parts[1]?.trim() || '');
              }}
              className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-2.5 py-1.5 text-white outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="Lớp - Trường..."
            />
          </div>
        </div>

        {/* Preview of Workbook Pages */}
        <div className="flex-1 overflow-y-auto mt-4 pr-1 space-y-3">
          <div className="flex items-center justify-between text-xs text-neutral-400 px-1">
            <span>Danh sách các bài luyện ({filteredDays.length} ngày):</span>
            <span className="text-emerald-400 font-medium">Bấm "In ngay" sẽ xuất file in đẹp từng trang</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {filteredDays.map((item) => (
              <div 
                key={item.day}
                className="p-3 bg-neutral-950/80 border border-neutral-800/90 rounded-2xl flex items-start justify-between gap-2 hover:border-neutral-700 transition"
              >
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-lg bg-neutral-800 text-amber-300">
                      Ngày {item.day}
                    </span>
                    <span className="text-[11px] text-neutral-400 truncate">{item.category}</span>
                  </div>
                  <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
                  <div className="text-[11px] text-neutral-400 font-serif italic truncate bg-neutral-900/80 px-2 py-1 rounded-lg border border-neutral-800/80">
                    "{item.sampleLines[0]}"
                  </div>
                </div>
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 text-xs">
                  ✓
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-neutral-800 mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-neutral-400 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Mỗi trang in sẽ có bìa ô ly, tên bé, ô cho cô giáo chấm điểm và lời khen!</span>
          </div>

          <button
            id="print-full-workbook-action"
            onClick={handlePrint}
            className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold rounded-xl text-xs transition-all shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>In {filteredDays.length} Trang Ngay (Ctrl + P)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
