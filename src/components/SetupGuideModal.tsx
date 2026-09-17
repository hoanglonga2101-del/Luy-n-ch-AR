import React, { useState } from 'react';
import { 
  X, 
  Smartphone, 
  Laptop, 
  PenTool, 
  Sparkles, 
  ArrowRight, 
  Printer, 
  Type, 
  Award, 
  Camera, 
  BookOpen, 
  Menu, 
  CheckCircle2,
  Layers,
  FileText,
  Palette,
  Eye,
  Sliders,
  Sun,
  Lock,
  Zap,
  HelpCircle,
  Pencil,
  RotateCw,
  Trophy,
  Clock,
  Volume2
} from 'lucide-react';
import { RankInsignia } from './RankInsignia';

interface SetupGuideModalProps {
  isOpen: boolean;
  onClose: (dontShowAgain?: boolean) => void;
  onNavigateToView?: (view: 'worksheet' | 'lightbox' | 'ai_feedback' | 'alphabet' | 'sentences' | 'canvas' | 'ar' | 'leaderboard') => void;
}

export const SetupGuideModal: React.FC<SetupGuideModalProps> = ({ 
  isOpen, 
  onClose,
  onNavigateToView 
}) => {
  const [guideTab, setGuideTab] = useState<'methods' | 'devices' | 'tips' | 'all_features'>('methods');
  const [dontShowAgain, setDontShowAgain] = useState<boolean>(true);

  if (!isOpen) return null;

  const handleFinish = () => {
    onClose(dontShowAgain);
  };

  const handleStartMethod = (method: 'worksheet' | 'lightbox' | 'ai_feedback' | 'alphabet' | 'sentences' | 'canvas' | 'ar') => {
    if (onNavigateToView) {
      onNavigateToView(method);
    }
    onClose(dontShowAgain);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={handleFinish}
    >
      <div 
        id="setup-guide-card" 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl sm:max-w-4xl bg-neutral-900 border border-neutral-700/90 rounded-3xl p-4 sm:p-7 text-neutral-100 shadow-2xl overflow-y-auto max-h-[94vh] flex flex-col"
      >
        <button
          id="close-setup-guide"
          onClick={handleFinish}
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white rounded-xl hover:bg-neutral-800 transition-colors"
          title="Đóng hướng dẫn"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-gradient-to-tr from-emerald-500 to-cyan-500 text-neutral-950 font-bold rounded-2xl shadow-lg shadow-emerald-950/40 shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                Cẩm nang Hướng dẫn & Tiện ích Luyện chữ AR
              </h2>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Toàn diện 4 phần
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              Rèn chữ viết tay tự nhiên, chuẩn nét Bộ GD&ĐT kết hợp công nghệ AR & Trí tuệ nhân tạo
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 bg-neutral-950 p-1.5 rounded-2xl border border-neutral-800 mb-4 shrink-0">
          <button
            onClick={() => setGuideTab('methods')}
            className={`py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              guideTab === 'methods'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <PenTool className="w-3.5 h-3.5 shrink-0" /> 
            <span className="truncate">1. Cách luyện chữ</span>
          </button>
          <button
            onClick={() => setGuideTab('devices')}
            className={`py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              guideTab === 'devices'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 shrink-0" /> 
            <span className="truncate">2. Mẹo kê máy</span>
          </button>
          <button
            onClick={() => setGuideTab('tips')}
            className={`py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              guideTab === 'tips'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> 
            <span className="truncate">3. Cầm bút đẹp</span>
          </button>
          <button
            onClick={() => setGuideTab('all_features')}
            className={`py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              guideTab === 'all_features'
                ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 text-white shadow-md ring-1 ring-purple-400/50'
                : 'text-purple-300 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-purple-300 shrink-0" /> 
            <span className="truncate font-extrabold">4. Tất cả công dụng (Siêu chi tiết)</span>
          </button>
        </div>

        {/* Tab 1: 4 Methods */}
        {guideTab === 'methods' && (
          <div className="space-y-3 flex-1 overflow-y-auto pr-1">
            <div className="p-3.5 bg-emerald-950/30 border border-emerald-500/40 rounded-2xl flex items-start gap-3 relative">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                <Printer className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    1. In phiếu A4 ô ly <span className="text-[10px] bg-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded-full font-semibold">Khuyên dùng nhất</span>
                  </h4>
                  <button
                    onClick={() => handleStartMethod('worksheet')}
                    className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer"
                  >
                    Dùng ngay →
                  </button>
                </div>
                <p className="text-xs text-neutral-300 mt-1">
                  Nhập câu văn hoặc chọn bài thơ mẫu, chọn cỡ ô ly chuẩn học sinh (4 ô / 5 ô ly) rồi bấm <strong>In trang này</strong> để in ra giấy A4 cầm bút mực thật viết.
                </p>
              </div>
            </div>

            <div className="p-3.5 bg-amber-950/30 border border-amber-500/40 rounded-2xl flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                <Type className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white">2. Coi kiểu chữ & Kê giấy đồ nét</h4>
                  <button
                    onClick={() => handleStartMethod('lightbox')}
                    className="text-xs text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
                  >
                    Dùng ngay →
                  </button>
                </div>
                <p className="text-xs text-neutral-300 mt-1">
                  Phóng to chữ mẫu trên màn hình điện thoại/máy tính bảng, tăng 100% độ sáng, bấm nút <strong>"Khóa chạm để kê giấy đồ nét"</strong> rồi đặt tờ giấy mỏng lên màn hình đồ theo nét.
                </p>
              </div>
            </div>

            <div className="p-3.5 bg-indigo-950/30 border border-indigo-500/40 rounded-2xl flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                <Award className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white">3. Chụp ảnh bài viết AI chấm điểm</h4>
                  <button
                    onClick={() => handleStartMethod('ai_feedback')}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
                  >
                    Dùng ngay →
                  </button>
                </div>
                <p className="text-xs text-neutral-300 mt-1">
                  Sau khi viết xong ra giấy thật, mở chức năng <strong>Chấm điểm AI</strong> chụp lại ảnh trang viết. Trí tuệ nhân tạo sẽ chấm điểm nét chữ, độ nghiêng và đưa ra lời khuyên sửa nét cụ thể.
                </p>
              </div>
            </div>

            <div className="p-3.5 bg-rose-950/30 border border-rose-500/40 rounded-2xl flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
                <Camera className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white">4. Camera AR hắt hình nét chữ</h4>
                  <button
                    onClick={() => handleStartMethod('ar')}
                    className="text-xs text-rose-400 hover:text-rose-300 font-semibold cursor-pointer"
                  >
                    Dùng ngay →
                  </button>
                </div>
                <p className="text-xs text-neutral-300 mt-1">
                  Đặt điện thoại lên giá đỡ (hoặc cốc nước), chiếu camera xuống trang giấy. Màn hình sẽ chiếu nét chữ ảo đè lên giấy thật để bạn cầm bút rê theo.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Devices & Menu */}
        {guideTab === 'devices' && (
          <div className="space-y-4 flex-1 overflow-y-auto pr-1">
            <div className="p-4 bg-neutral-950 rounded-2xl border border-neutral-800 flex flex-col sm:flex-row items-center gap-4">
              <div className="relative w-44 h-32 border border-dashed border-cyan-500/40 rounded-xl flex items-center justify-center bg-neutral-900/60 p-2 shrink-0">
                <div className="absolute top-2 w-32 h-8 bg-amber-500/20 border border-amber-500/60 rounded-lg flex items-center justify-center text-[10px] text-amber-300 font-bold">
                  📱 Điện thoại (Camera sau)
                </div>
                <div className="absolute top-10 w-20 h-12 bg-neutral-800 border border-neutral-700 rounded-b-xl flex items-center justify-center text-[9px] text-neutral-400">
                  ☕ Miệng cốc / chồng sách
                </div>
                <div className="absolute top-10 w-28 h-12 bg-gradient-to-b from-cyan-500/20 to-transparent pointer-events-none" />
                <div className="absolute bottom-1 w-36 h-5 bg-neutral-200 text-neutral-950 rounded text-[9px] font-bold flex items-center justify-center">
                  📄 Giấy trắng + Bút thật
                </div>
              </div>

              <div className="text-xs text-neutral-300 space-y-2">
                <div className="font-bold text-cyan-300 flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4" /> Mẹo dùng điện thoại tiện lợi:
                </div>
                <p>• Dùng <strong>1 chiếc cốc nước</strong> hoặc <strong>chồng 2 cuốn sách</strong> làm chân đỡ điện thoại.</p>
                <p>• Để camera nhô ra mép cốc hướng xuống mặt bàn khoảng cách 15 – 25cm.</p>
                <p>• Bật đèn <strong>Flash</strong> nếu góc bàn học thiếu sáng.</p>
              </div>
            </div>

            <div className="p-4 bg-neutral-950 rounded-2xl border border-neutral-800 flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                <Menu className="w-5 h-5" />
              </div>
              <div className="text-xs text-neutral-300 space-y-1">
                <h4 className="font-bold text-white text-sm">Toàn bộ tính năng nằm trong nút Menu</h4>
                <p>Bấm nút <strong>Menu (☰)</strong> ở góc trên bên phải màn hình để:</p>
                <ul className="list-disc pl-4 space-y-0.5 text-neutral-400">
                  <li>Chuyển đổi giữa các chế độ: In phiếu A4, Coi kiểu chữ, Chấm điểm AI, Bảng chữ cái, Camera AR.</li>
                  <li>Đổi chế độ giao diện <strong>Điện thoại</strong> hoặc <strong>Máy tính</strong>.</li>
                  <li>Chuyển đổi 4 ngôn ngữ: <strong>Tiếng Việt, English, Tiếng Nhật, Tiếng Trung</strong>.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Handwriting Tips */}
        {guideTab === 'tips' && (
          <div className="space-y-3 flex-1 overflow-y-auto pr-1 text-xs text-neutral-300">
            <div className="p-3.5 bg-neutral-950 border border-neutral-800 rounded-2xl">
              <h4 className="font-bold text-white text-sm mb-1.5 text-amber-300">1. Tư thế cầm bút chuẩn</h4>
              <p>Cầm bút bằng 3 ngón tay (ngón cái, ngón trỏ và ngón giữa). Đầu ngón tay cách ngòi bút khoảng 2.5cm. Thân bút nghiêng về phía người viết khoảng 45 - 60 độ.</p>
            </div>

            <div className="p-3.5 bg-neutral-950 border border-neutral-800 rounded-2xl">
              <h4 className="font-bold text-white text-sm mb-1.5 text-emerald-300">2. Tư thế ngồi học</h4>
              <p>Ngồi thẳng lưng, hai vai ngang bằng, ngực không tì vào mép bàn. Khoảng cách từ mắt đến trang giấy từ 25 – 30cm.</p>
            </div>

            <div className="p-3.5 bg-neutral-950 border border-neutral-800 rounded-2xl">
              <h4 className="font-bold text-white text-sm mb-1.5 text-cyan-300">3. Thứ tự nét & độ cao con chữ</h4>
              <p>Viết nét từ trái sang phải, từ trên xuống dưới. Các con chữ có chiều cao chuẩn 1 ô ly (a, o, e, u, n, m), 2 ô ly (d, đ, p, q) và 2.5 ô ly (b, g, h, k, l, y).</p>
            </div>
          </div>
        )}

        {/* Tab 4: All Features & Detailed Utilities (SUPER DETAILED) */}
        {guideTab === 'all_features' && (
          <div className="space-y-4 flex-1 overflow-y-auto pr-1 text-xs text-neutral-300">
            {/* Overview Banner */}
            <div className="p-4 bg-gradient-to-r from-purple-950/60 via-indigo-950/60 to-cyan-950/60 border border-purple-500/40 rounded-2xl">
              <div className="flex items-center gap-2 text-purple-300 font-bold text-sm mb-1">
                <Layers className="w-4 h-4 text-purple-400" />
                <span>HỆ SINH THÁI LUYỆN CHỮ TOÀN DIỆN - 8 CÔNG DỤNG CHÍNH</span>
              </div>
              <p className="text-neutral-300 text-xs leading-relaxed">
                Ứng dụng được thiết kế nhằm mang lại trải nghiệm rèn chữ viết tay tự nhiên nhất trên giấy thật, kết hợp sức mạnh của công nghệ <strong>Camera AR hắt nét ảo</strong>, <strong>Trí tuệ nhân tạo (AI) nhận diện nét chữ</strong> và <strong>Quy chuẩn mẫu giáo khoa Bộ Giáo dục & Đào tạo</strong>. Dưới đây là phân tích chi tiết toàn bộ các công dụng và cách khai thác tối đa từng tính năng:
              </p>
            </div>

            {/* Feature 1: Worksheet Generator */}
            <div className="p-4 bg-neutral-950 border border-emerald-500/40 rounded-2xl space-y-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                    <Printer className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      1. In phiếu bài tập A4 ô ly (Worksheet Generator)
                    </h3>
                    <span className="text-[11px] text-emerald-400 font-medium">Khuyên dùng số 1 cho học sinh tiểu học & người bắt đầu</span>
                  </div>
                </div>
                <button
                  onClick={() => handleStartMethod('worksheet')}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 hover:text-white font-bold text-xs border border-emerald-500/40 transition cursor-pointer"
                >
                  Mở In phiếu A4 →
                </button>
              </div>

              <div className="pl-1 space-y-1.5 text-neutral-300 pt-1 border-t border-neutral-800">
                <p>
                  <strong>• Mục đích chính:</strong> Tạo và xuất ra các trang bài tập viết tay chuẩn khổ giấy A4 để học sinh cầm bút mực thật rèn luyện trên giấy, hạn chế tiếp xúc quá nhiều với màn hình điện thoại.
                </p>
                <p>
                  <strong>• Các chức năng chi tiết:</strong>
                </p>
                <ul className="list-disc pl-5 space-y-1 text-neutral-300">
                  <li>
                    <strong>Tùy biến ô ly chuẩn Bộ GD&ĐT:</strong> Chọn giữa <em>Lưới 4 ô ly vuông</em> (lớp 1 - lớp 3), <em>Lưới 5 ô ly vuông</em> (tiền tiểu học), <em>Lưới nghiêng 15 độ</em> (chữ nghiêng chuẩn nét), <em>Lưới 4 dòng kẻ tiếng Anh</em> (Four-line) và <em>Lưới ô Mễ / Điền chữ Hán</em>.
                  </li>
                  <li>
                    <strong>4 chế độ đồ chữ linh hoạt:</strong>
                    <ul className="list-circle pl-5 mt-0.5 space-y-0.5 text-neutral-400">
                      <li><em>Nét chấm đứt (Dotted):</em> In các nét chấm li ti mờ để bé cầm bút mực tô theo, giúp làm quen các nét cong, nét khuyết.</li>
                      <li><em>Nét mờ (Faded 30%):</em> Nét chữ in nhạt để bé đồ đè lên, rèn độ đều của con chữ.</li>
                      <li><em>Chữ mẫu đầu dòng (First Char):</em> Chỉ in mẫu chữ cái đầu câu, các ô phía sau để trống cho học sinh tự nhớ và viết tiếp.</li>
                      <li><em>Ô ly trống hoàn toàn (Blank Grid):</em> Trang giấy ô ly kẻ sẵn kèm tiêu đề, dùng cho các bài kiểm tra chính tả hoặc chép thơ.</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Tùy chọn Font chữ phong phú:</strong> Font Tiểu học đứng, Font Nghiêng thanh lịch, Font Nét thanh nét đậm, Font Chữ hoa sáng tạo, Font Bút lông thư pháp.
                  </li>
                  <li>
                    <strong>Khung thông tin học sinh:</strong> Tự động tích hợp dòng <em>Họ và tên</em>, <em>Lớp</em>, <em>Trường</em>, <em>Ngày tháng</em> và <em>Lời phê của thầy cô</em> ở đầu trang.
                  </li>
                  <li>
                    <strong>In ấn Vector 100%:</strong> Tỷ lệ milimet chính xác tuyệt đối, in trực tiếp bằng lệnh Ctrl+P hoặc lưu thành file PDF chất lượng cao.
                  </li>
                </ul>
              </div>
            </div>

            {/* Feature 2: AR Viewfinder */}
            <div className="p-4 bg-neutral-950 border border-cyan-500/40 rounded-2xl space-y-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
                    <Camera className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      2. Camera AR hắt hình nét chữ ảo lên giấy (AR Viewfinder)
                    </h3>
                    <span className="text-[11px] text-cyan-400 font-medium">Công nghệ độc quyền - Rèn chữ trực tiếp trên tập vở thật</span>
                  </div>
                </div>
                <button
                  onClick={() => handleStartMethod('ar')}
                  className="px-3 py-1.5 rounded-xl bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-300 hover:text-white font-bold text-xs border border-cyan-500/40 transition cursor-pointer"
                >
                  Mở Camera AR →
                </button>
              </div>

              <div className="pl-1 space-y-1.5 text-neutral-300 pt-1 border-t border-neutral-800">
                <p>
                  <strong>• Mục đích chính:</strong> Đặt điện thoại lên cốc hoặc giá đỡ hướng camera xuống trang giấy. Màn hình sẽ chiếu nét chữ ảo đè chính xác lên mặt giấy thật để học sinh nhìn vào màn hình và rê ngòi bút thật theo từng nét.
                </p>
                <p>
                  <strong>• Các chức năng chi tiết:</strong>
                </p>
                <ul className="list-disc pl-5 space-y-1 text-neutral-300">
                  <li>
                    <strong>Hướng dẫn rèn nét từng bước (Step-by-step Guidance):</strong> Không chỉ hiện cả chữ, ứng dụng có thể bẻ nhỏ chữ thành từng nét đơn lẻ (nét sổ thẳng, nét móc ngược, nét khuyết trên, nét thắt...), có âm thanh bút vẽ sống động để học sinh nắm rõ thứ tự viết từ nét đầu tiên đến nét kết thúc.
                  </li>
                  <li>
                    <strong>Khóa màn hình chống trượt (Screen Lock):</strong> Nút màu đỏ ở thanh dưới cho phép khóa toàn bộ cảm ứng di chuyển của nét chữ. Khi khóa, học sinh có thể tì cẳng tay lên mép điện thoại hoặc viết thoải mái mà không lo nét chữ bị lệch.
                  </li>
                  <li>
                    <strong>Thanh Dock điều khiển nhanh cho điện thoại:</strong> Tối ưu các nút bấm to 48px ở đáy màn hình: Nút <strong>➖ / ➕</strong> phóng to thu nhỏ chữ, Nút <strong>Đổi độ mờ (30% - 100%)</strong>, Nút <strong>Đổi màu mực phản quang</strong> (xanh neon, đỏ hồng, vàng dạ quang) giúp mắt nhìn rõ nét mực thật và nét ảo.
                  </li>
                  <li>
                    <strong>Đèn Flash (Torch) trợ sáng:</strong> Tích hợp nút bật đèn flash của camera sau giúp chiếu sáng rực rỡ mặt bàn học ngay cả trong phòng tối.
                  </li>
                  <li>
                    <strong>Tối ưu hiệu năng 720p 30fps:</strong> Luồng camera được cân chỉnh riêng cho điện thoại, loại bỏ độ trễ (latency), giúp ngòi bút thật di chuyển đến đâu màn hình hiển thị tức thì đến đó không giật lag.
                  </li>
                </ul>
              </div>
            </div>

            {/* Feature 3: Screen Lightbox */}
            <div className="p-4 bg-neutral-950 border border-amber-500/40 rounded-2xl space-y-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                    <Sun className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      3. Coi kiểu chữ & Kê giấy đồ nét (Screen Lightbox)
                    </h3>
                    <span className="text-[11px] text-amber-400 font-medium">Biến điện thoại/iPad thành bàn hắt sáng đồ chữ chuyên nghiệp</span>
                  </div>
                </div>
                <button
                  onClick={() => handleStartMethod('lightbox')}
                  className="px-3 py-1.5 rounded-xl bg-amber-600/30 hover:bg-amber-600/50 text-amber-300 hover:text-white font-bold text-xs border border-amber-500/40 transition cursor-pointer"
                >
                  Mở Bàn hắt sáng →
                </button>
              </div>

              <div className="pl-1 space-y-1.5 text-neutral-300 pt-1 border-t border-neutral-800">
                <p>
                  <strong>• Mục đích chính:</strong> Phóng to con chữ mẫu với độ sáng tối đa, cho phép đặt trực tiếp tờ giấy can mỏng hoặc trang giấy trắng lên màn hình điện thoại/máy tính bảng và cầm bút đồ theo nét chữ phía dưới.
                </p>
                <p>
                  <strong>• Các chức năng chi tiết:</strong>
                </p>
                <ul className="list-disc pl-5 space-y-1 text-neutral-300">
                  <li>
                    <strong>Chế độ Khóa cảm ứng toàn phần (Touch Lock):</strong> Vô hiệu hóa cảm ứng tạm thời để học sinh tì toàn bộ bàn tay và ngòi bút chì/bút bi lên màn hình kính mà không làm nhảy trang hoặc lệch cỡ chữ. Mở khóa bằng nút bấm giữ an toàn.
                  </li>
                  <li>
                    <strong>Tương phản ánh sáng cao (High Contrast):</strong> Hỗ trợ chế độ nền trắng chữ đen hoặc nền đen chữ dạ quang siêu sáng, giúp ánh sáng xuyên qua lớp giấy trắng rõ nét từng milimet.
                  </li>
                  <li>
                    <strong>Điều chỉnh kích thước theo ô ly thực tế:</strong> Thang trượt căn chỉnh kích thước chữ từ cỡ nhỏ trong vở học sinh (1 - 2cm) đến cỡ chữ to cho bảng hiệu hoặc chữ hoa nghệ thuật (5 - 10cm).
                  </li>
                </ul>
              </div>
            </div>

            {/* Feature 4: Handwriting AI Review */}
            <div className="p-4 bg-neutral-950 border border-indigo-500/40 rounded-2xl space-y-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      4. Trí tuệ nhân tạo (AI) chấm điểm & Nhận xét chữ viết tay
                    </h3>
                    <span className="text-[11px] text-indigo-400 font-medium">Gia sư sư phạm ảo - Đánh giá khách quan, chi tiết từng nét</span>
                  </div>
                </div>
                <button
                  onClick={() => handleStartMethod('ai_feedback')}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 hover:text-white font-bold text-xs border border-indigo-500/40 transition cursor-pointer"
                >
                  Mở Chấm điểm AI →
                </button>
              </div>

              <div className="pl-1 space-y-1.5 text-neutral-300 pt-1 border-t border-neutral-800">
                <p>
                  <strong>• Mục đích chính:</strong> Sau khi học sinh hoàn thành bài viết trên giấy thật, phụ huynh hoặc giáo viên chụp ảnh lại trang viết. AI sẽ phân tích và đưa ra phản hồi sư phạm ngay lập tức.
                </p>
                <p>
                  <strong>• Các chức năng chi tiết:</strong>
                </p>
                <ul className="list-disc pl-5 space-y-1 text-neutral-300">
                  <li>
                    <strong>Chấm điểm theo 4 tiêu chí chuẩn mực:</strong>
                    <ul className="list-circle pl-5 mt-0.5 space-y-0.5 text-neutral-400">
                      <li><em>Độ nghiêng con chữ (Slant Analysis):</em> Kiểm tra góc nghiêng đồng đều của các nét sổ thẳng và nét khuyết (chuẩn nghiêng 15° – 25°).</li>
                      <li><em>Độ đồng đều & Kích cỡ (Size Consistency):</em> Đo đạc tỷ lệ chuẩn giữa các con chữ 1 ô ly (a, o, e, u, n, m) và chữ cao 2.5 ô ly (b, g, h, l, y).</li>
                      <li><em>Khoảng cách & Căn dòng (Spacing & Alignment):</em> Đánh giá khoảng cách giữa chữ với chữ (chuẩn bằng con chữ o) và độ bám dòng kẻ đáy.</li>
                      <li><em>Chất lượng nét bút (Stroke Quality):</em> Kiểm tra độ mềm mại của nét cong, nét nối giữa các phụ âm và nguyên âm.</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Điểm số thang 100 & Xếp loại:</strong> Đưa ra điểm số trực quan (Xuất sắc, Khá, Cần rèn thêm) giúp tạo động lực thi đua cho các em.
                  </li>
                  <li>
                    <strong>Lời khuyên cá nhân hóa:</strong> Liệt kê cụ thể con chữ nào viết đẹp cần phát huy, con chữ nào bị gãy nét kèm mẹo đặt bút sửa lại.
                  </li>
                </ul>
              </div>
            </div>

            {/* Feature 5: Alphabet Browser */}
            <div className="p-4 bg-neutral-950 border border-rose-500/40 rounded-2xl space-y-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      5. Bảng chữ cái tương tác & Thứ tự nét chuẩn (Alphabet Browser)
                    </h3>
                    <span className="text-[11px] text-rose-400 font-medium">Bách khoa toàn thư chữ cái 4 bộ ngôn ngữ</span>
                  </div>
                </div>
                <button
                  onClick={() => handleStartMethod('alphabet')}
                  className="px-3 py-1.5 rounded-xl bg-rose-600/30 hover:bg-rose-600/50 text-rose-300 hover:text-white font-bold text-xs border border-rose-500/40 transition cursor-pointer"
                >
                  Mở Bảng chữ cái →
                </button>
              </div>

              <div className="pl-1 space-y-1.5 text-neutral-300 pt-1 border-t border-neutral-800">
                <p>
                  <strong>• Mục đích chính:</strong> Tra cứu nhanh cách viết chuẩn của từng con chữ, xem hoạt họa thứ tự từng nét viết (Stroke Order) và mẹo sư phạm trước khi bắt đầu bài tập viết.
                </p>
                <p>
                  <strong>• Các chức năng chi tiết:</strong>
                </p>
                <ul className="list-disc pl-5 space-y-1 text-neutral-300">
                  <li>
                    <strong>4 hệ chữ cái quốc tế:</strong> Đầy đủ 29 chữ cái Tiếng Việt (chữ thường, chữ in hoa, các dấu thanh huyền, sắc, hỏi, ngã, nặng), Tiếng Anh (Cursive / Print), Tiếng Nhật (Hiragana, Katakana) và Tiếng Trung (Pinyin / Hán tự cơ bản).
                  </li>
                  <li>
                    <strong>Hoạt họa nét vẽ từng bước:</strong> Mô phỏng sinh động đầu bút vẽ từng nét, hiển thị rõ điểm bắt đầu đặt bút và hướng lướt nét.
                  </li>
                  <li>
                    <strong>Phát âm mẫu & Từ vựng minh họa:</strong> Bấm nghe giọng đọc chuẩn của con chữ và các từ ghép thường gặp giúp bé vừa rèn chữ vừa phát triển ngôn ngữ.
                  </li>
                  <li>
                    <strong>Chuyển nhanh sang AR hoặc Bảng vẽ:</strong> Chỉ cần bấm 1 chạm để mở ngay chữ đang xem vào Camera AR hoặc Bảng vẽ số để luyện tập tức thì.
                  </li>
                </ul>
              </div>
            </div>

            {/* Feature 6: Sentence Creator */}
            <div className="p-4 bg-neutral-950 border border-teal-500/40 rounded-2xl space-y-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      6. Kho ngữ liệu câu mẫu & Soạn bài tập viết (Sentence Creator)
                    </h3>
                    <span className="text-[11px] text-teal-400 font-medium">Soạn thảo bài chính tả, ca dao tục ngữ theo yêu cầu bài học</span>
                  </div>
                </div>
                <button
                  onClick={() => handleStartMethod('sentences')}
                  className="px-3 py-1.5 rounded-xl bg-teal-600/30 hover:bg-teal-600/50 text-teal-300 hover:text-white font-bold text-xs border border-teal-500/40 transition cursor-pointer"
                >
                  Mở Soạn câu mẫu →
                </button>
              </div>

              <div className="pl-1 space-y-1.5 text-neutral-300 pt-1 border-t border-neutral-800">
                <p>
                  <strong>• Mục đích chính:</strong> Cung cấp kho câu ca dao tục ngữ ý nghĩa và công cụ soạn bài viết tự do cho phụ huynh và giáo viên để tạo bài tập theo đúng giáo án tuần học.
                </p>
                <p>
                  <strong>• Các chức năng chi tiết:</strong>
                </p>
                <ul className="list-disc pl-5 space-y-1 text-neutral-300">
                  <li>
                    <strong>Thư viện câu mẫu phong phú:</strong> Hàng trăm câu danh ngôn, ca dao tục ngữ Việt Nam, lời chúc ý nghĩa được tuyển chọn kỹ lưỡng.
                  </li>
                  <li>
                    <strong>Tùy ý nhập văn bản nhiều dòng:</strong> Soạn bài thơ ngắn, bài chính tả của bé hoặc họ tên của từng học sinh để in hoặc chiếu AR.
                  </li>
                  <li>
                    <strong>Đồng bộ đa chế độ:</strong> Sau khi soạn câu văn xong, bấm chuyển ngay sang tạo Phiếu in A4 hoặc mở trong Camera AR để viết trên giấy.
                  </li>
                </ul>
              </div>
            </div>

            {/* Feature 7: Digital Canvas */}
            <div className="p-4 bg-neutral-950 border border-blue-500/40 rounded-2xl space-y-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
                    <Pencil className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      7. Bảng vẽ số rèn nét cảm ứng (Digital Canvas)
                    </h3>
                    <span className="text-[11px] text-blue-400 font-medium">Tập viết tự do bằng ngón tay hoặc bút cảm ứng Stylus / Apple Pencil</span>
                  </div>
                </div>
                <button
                  onClick={() => handleStartMethod('canvas')}
                  className="px-3 py-1.5 rounded-xl bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 hover:text-white font-bold text-xs border border-blue-500/40 transition cursor-pointer"
                >
                  Mở Bảng vẽ số →
                </button>
              </div>

              <div className="pl-1 space-y-1.5 text-neutral-300 pt-1 border-t border-neutral-800">
                <p>
                  <strong>• Mục đích chính:</strong> Cho phép học sinh khởi động các ngón tay và thử sức vẽ các con chữ khó ngay trên màn hình trước khi đặt bút viết vào vở thật.
                </p>
                <p>
                  <strong>• Các chức năng chi tiết:</strong>
                </p>
                <ul className="list-disc pl-5 space-y-1 text-neutral-300">
                  <li>
                    <strong>Mô phỏng lực tì ngòi bút (Pen Pressure Physics):</strong> Viết nhanh nét sẽ thanh mảnh, dừng và tì mạnh nét sẽ đậm đà y như nét bút mực học sinh.
                  </li>
                  <li>
                    <strong>Tích hợp nền ô ly dẫn hướng:</strong> Tự động hiển thị các dòng kẻ ô ly xanh nhạt để bé căn ke chiều cao con chữ ngay trên màn hình.
                  </li>
                  <li>
                    <strong>Công cụ hoàn chỉnh:</strong> Đổi màu mực, đổi độ dày nét bút, công cụ tẩy nét, nút Hoàn tác (Undo/Redo) và Tải ảnh bài viết về máy.
                  </li>
                </ul>
              </div>
            </div>

            {/* Feature 8: Device Modes & Multi-Language */}
            <div className="p-4 bg-neutral-950 border border-purple-500/40 rounded-2xl space-y-2">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                  <Laptop className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    8. Tương thích Chế độ kép Điện thoại / Máy tính & Đa ngôn ngữ
                  </h3>
                  <span className="text-[11px] text-purple-400 font-medium">Trải nghiệm liền mạch trên mọi loại thiết bị từ điện thoại đến máy tính trường học</span>
                </div>
              </div>

              <div className="pl-1 space-y-1.5 text-neutral-300 pt-1 border-t border-neutral-800">
                <p>
                  <strong>• Mục đích chính:</strong> Đảm bảo trải nghiệm tốt nhất dù người dùng đang cầm điện thoại thông minh, máy tính bảng hay ngồi trước máy vi tính để bàn.
                </p>
                <ul className="list-disc pl-5 space-y-1 text-neutral-300">
                  <li>
                    <strong>Chế độ Điện thoại (Mobile Mode):</strong> Kích hoạt camera sau, giao diện đáy dạng Dock với các nút bấm to 48px chuẩn cảm ứng, giảm độ phân giải xuống 720p 30fps và hỗ trợ phím điều hướng vi mô D-Pad để triệt tiêu hoàn toàn hiện tượng nóng máy hay giật lag.
                  </li>
                  <li>
                    <strong>Chế độ Máy tính (Desktop Mode):</strong> Mở rộng không gian hiển thị, tận dụng Webcam phía trước, mở hai bảng điều khiển chuyên nghiệp bên trái và bên phải với đầy đủ tùy chọn kỹ thuật.
                  </li>
                  <li>
                    <strong>Hỗ trợ 4 ngôn ngữ quốc tế:</strong> Chuyển đổi linh hoạt giữa Tiếng Việt, Tiếng Anh (English), Tiếng Nhật (日本語), Tiếng Trung (中文) phục vụ nhu cầu học ngoại ngữ và luyện chữ đẹp đa quốc gia.
                  </li>
                </ul>
              </div>
            </div>

            {/* Feature 9: Gamification Rank & Badge System */}
            <div className="p-4 bg-neutral-950 border border-amber-500/50 rounded-2xl space-y-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      9. Hệ thống Cấp bậc Rank & Huy hiệu danh dự (Rank & Badges)
                    </h3>
                    <span className="text-[11px] text-amber-400 font-medium">Hệ thống gamification tích điểm EXP, thăng hạng cấp bậc và vinh danh sự kiên trì</span>
                  </div>
                </div>
                <button
                  onClick={() => handleStartMethod('leaderboard' as any)}
                  className="px-3 py-1.5 rounded-xl bg-amber-600/30 hover:bg-amber-600/50 text-amber-300 hover:text-white font-bold text-xs border border-amber-500/40 transition cursor-pointer"
                >
                  Mở Cấp bậc Rank →
                </button>
              </div>

              <div className="pl-1 space-y-1.5 text-neutral-300 pt-1 border-t border-neutral-800">
                <p>
                  <strong>• Mục đích chính:</strong> Biến quá trình rèn luyện nét chữ kiên trì mỗi ngày thành một hành trình phiêu lưu đầy hứng khởi với cơ chế tích lũy điểm kinh nghiệm (EXP), thăng cấp bậc Rank và mở khóa bộ sưu tập huy hiệu.
                </p>
                <p>
                  <strong>• Các chức năng chi tiết:</strong>
                </p>
                <ul className="list-disc pl-5 space-y-1 text-neutral-300">
                  <li>
                    <strong>6 Bậc Rank danh giá chuẩn thể thao điện tử:</strong> Đồng (Bronze: 0 - 299 EXP) ➔ Bạc (Silver: 300 - 699 EXP) ➔ Vàng (Gold: 700 - 1.299 EXP) ➔ Bạch Kim (Platinum: 1.300 - 2.199 EXP) ➔ Kim Cương (Diamond: 2.200 - 3.499 EXP) ➔ Bậc Thầy Luyện Chữ (Master: từ 3.500 EXP trở lên).
                  </li>
                  <li>
                    <strong>Cơ chế cộng EXP tự động theo từng hành vi học tập:</strong> Mỗi khi học sinh hoàn thành một nét vẽ trên Bảng vẽ số được cộng ngay +5 EXP; in bài tập A4 nhận +20 EXP; kê máy đồ nét AR nhận +30 EXP; hoàn thành phiên nghỉ ngơi thư giãn mắt 20-20-20 được cộng +30 EXP; gửi bài viết cho AI chấm điểm nhận từ +50 đến +100 EXP.
                  </li>
                  <li>
                    <strong>Bộ sưu tập 12 Huy hiệu danh dự (Badges):</strong> Trao thưởng khi đạt các cột mốc đặc biệt như "Nét Đầu Tiên", "Bút Mực Vàng", "Thần Đồng Chữ Đẹp", "Đôi Mắt Khỏe", "Chăm Chỉ 7 Ngày Liền"... kèm hiệu ứng pháo hoa chúc mừng.
                  </li>
                  <li>
                    <strong>Nhật ký tiến bộ cá nhân:</strong> Tự động lưu trữ lịch sử toàn bộ các bài viết tay bé đã nhờ cô giáo AI chấm điểm, ghi nhận điểm số và các nhận xét uốn nắn nét bút qua từng ngày.
                  </li>
                </ul>
              </div>
            </div>

            {/* Feature 10: 20-20-20 Eye Protection Timer */}
            <div className="p-4 bg-neutral-950 border border-emerald-500/50 rounded-2xl space-y-2">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    10. Chu kỳ Bảo vệ Mắt 20-20-20 (Eye Protection Timer)
                  </h3>
                  <span className="text-[11px] text-emerald-400 font-medium">Bảo vệ thị lực học sinh, chống mỏi mắt và phòng ngừa cận thị học đường</span>
                </div>
              </div>

              <div className="pl-1 space-y-1.5 text-neutral-300 pt-1 border-t border-neutral-800">
                <p>
                  <strong>• Mục đích chính:</strong> Giữ gìn đôi mắt sáng khỏe cho các em nhỏ khi học tập với thiết bị số hoặc khi tập trung nhìn vào trang vở ở cự ly gần trong thời gian dài.
                </p>
                <p>
                  <strong>• Các chức năng chi tiết:</strong>
                </p>
                <ul className="list-disc pl-5 space-y-1 text-neutral-300">
                  <li>
                    <strong>Chu kỳ nhãn khoa quốc tế 20-20-20:</strong> Cứ sau đúng 20 phút học tập, đồng hồ sẽ nhắc nhở các em tạm dừng, chớp mắt nhẹ và phóng tầm mắt nhìn xa 20 feet (tương đương 6 mét) trong 20 giây.
                  </li>
                  <li>
                    <strong>Bài tập thư giãn cơ mắt trực quan:</strong> Khi đến giờ giải lao, ứng dụng tự động hiển thị hướng dẫn bé đảo mắt vòng tròn, nhìn lên trên rồi nhìn xuống dưới, giúp các cơ điều tiết của mắt được thư giãn hoàn toàn.
                  </li>
                  <li>
                    <strong>Khích lệ phần thưởng:</strong> Hoàn thành bài tập mắt đúng giờ được thưởng ngay +30 EXP và mở khóa huy hiệu "Đôi Mắt Tinh Anh".
                  </li>
                </ul>
              </div>
            </div>

            {/* Feature 11: Realistic ASMR Pen Scratch Audio */}
            <div className="p-4 bg-neutral-950 border border-teal-500/50 rounded-2xl space-y-2">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400">
                  <Volume2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    11. Âm thanh ASMR Ngòi Bút Chạm Giấy Chân Thực
                  </h3>
                  <span className="text-[11px] text-teal-400 font-medium">Tạo không gian tĩnh lặng, kích thích thính giác và tăng cường độ tập trung sâu</span>
                </div>
              </div>

              <div className="pl-1 space-y-1.5 text-neutral-300 pt-1 border-t border-neutral-800">
                <p>
                  <strong>• Mục đích chính:</strong> Tái hiện lại âm thanh sột soạt quen thuộc của ngòi bút máy và ngòi bút chì khi lướt trên sớ giấy mộc, mang lại cảm giác bình yên và thư thái cho buổi học.
                </p>
                <p>
                  <strong>• Các chức năng chi tiết:</strong>
                </p>
                <ul className="list-disc pl-5 space-y-1 text-neutral-300">
                  <li>
                    <strong>Âm thanh tương tác thời gian thực (Real-time Audio Feedback):</strong> Khi vẽ trên Bảng vẽ số hoặc khi rê nét trong Camera AR, mỗi lần đầu bút chạm và lướt trên mặt phẳng đều phát ra âm thanh vi mô sống động tương ứng với vận tốc di chuyển nét bút.
                  </li>
                  <li>
                    <strong>Nút bật/tắt ASMR liên tục trên thanh công cụ:</strong> Cho phép phụ huynh hoặc bé bật âm nền tiếng bút viết êm dịu khi ngồi vào bàn học tập trung viết bài chính tả dài.
                  </li>
                  <li>
                    <strong>Âm thanh động viên tinh tế:</strong> Nhạc chuông ngân vang vui tai mỗi khi hoàn thành xuất sắc một chữ cái hay vượt qua một bài kiểm tra.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="mt-5 pt-3 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-400 hover:text-neutral-300 select-none">
            <input 
              type="checkbox" 
              checked={dontShowAgain} 
              onChange={(e) => setDontShowAgain(e.target.checked)} 
              className="rounded border-neutral-700 bg-neutral-950 text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
            />
            <span>Đã hiểu, không tự động hiện lại khi mở ứng dụng</span>
          </label>

          <button
            id="start-ar-now-btn"
            onClick={handleFinish}
            className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold rounded-xl text-xs transition-all shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <span>Bắt đầu luyện chữ ngay</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
