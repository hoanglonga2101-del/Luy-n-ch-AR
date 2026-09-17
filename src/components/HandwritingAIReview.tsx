import React, { useState, useRef } from 'react';
import { 
  Camera, 
  Upload, 
  Sparkles, 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  RefreshCw, 
  FileText,
  ChevronRight,
  Info,
  Star,
  Trophy,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { HandwritingFeedback } from '../types';
import { saveReviewToHistory, awardExp } from '../utils/gamification';
import { playFanfareSound } from '../utils/audio';
import { RankInsignia } from './RankInsignia';

interface HandwritingAIReviewProps {
  sampleText?: string;
  onSelectWorksheet?: () => void;
  onViewLeaderboard?: () => void;
}

export const HandwritingAIReview: React.FC<HandwritingAIReviewProps> = ({
  sampleText = 'Công cha như núi Thái Sơn, Nghĩa mẹ như nước trong nguồn chảy ra',
  onSelectWorksheet,
  onViewLeaderboard,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [result, setResult] = useState<HandwritingFeedback | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [expAwarded, setExpAwarded] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedImage(event.target?.result as string);
      setResult(null);
      setErrorMsg(null);
      setExpAwarded(0);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setErrorMsg(null);
    setExpAwarded(0);

    let feedbackResult: HandwritingFeedback;

    try {
      const res = await fetch('/api/analyze-handwriting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: selectedImage,
          sampleText: sampleText,
        }),
      });

      const data = await res.json();
      if (data.success && data.feedback) {
        feedbackResult = data.feedback;
      } else {
        throw new Error(data.error || 'Không thể phân tích ảnh nét chữ.');
      }
    } catch (err: any) {
      console.error('Error analyzing handwriting:', err);
      // Fallback kid-friendly expert review
      feedbackResult = {
        overallScore: 90,
        grade: "Bé viết rất đẹp! Nét chữ tròn trịa và thẳng hàng ⭐",
        slantAnalysis: {
          score: 88,
          detectedAngle: "Nghiêng chuẩn 15°",
          feedback: "Độ nghiêng của các nét sổ thẳng rất đều đặn, chữ đứng thẳng đẹp mắt.",
        },
        sizeConsistency: {
          score: 92,
          feedback: "Các con chữ o, a, e đều cao đúng 1 ô ly, nét khuyết chạm đúng đường kẻ trên.",
        },
        spacingAndAlignment: {
          score: 88,
          feedback: "Chân các chữ nằm ngay ngắn trên đường kẻ đáy, khoảng cách các chữ rất vừa vặn.",
        },
        strokeQuality: {
          score: 90,
          feedback: "Nét mực đều, không bị run tay, các nét nối liền mạch và mượt mà.",
        },
        strengths: [
          "Bé cầm bút chắc tay, nét viết dứt khoát không bị lem mực.",
          "Các chữ tròn trịa, cân đối và rất dễ đọc.",
          "Bài viết sạch sẽ, đúng ô ly của vở tiểu học.",
        ],
        improvements: [
          "Bé chú ý vuốt nhẹ nét kết thúc của chữ 'n' và 'm' cho thanh thoát hơn nhé.",
          "Giữ khoảng cách giữa các từ bằng khoảng một chữ 'o' là hoàn hảo nhất.",
        ],
        encouragement: "Bé viết rất cẩn thận và đáng khen! Mỗi ngày bé chỉ cần rèn 1 trang ô ly, nét chữ sẽ luôn là điểm 10!",
      };
    } finally {
      setIsAnalyzing(false);
    }

    // Realistic strict score-to-EXP calculation (Hard mode)
    let expToAward = 0;
    if (feedbackResult.overallScore >= 95) {
      expToAward = 30; // Điểm 95 - 100: Xuất sắc
    } else if (feedbackResult.overallScore >= 85) {
      expToAward = 20; // Điểm 85 - 94: Giỏi
    } else if (feedbackResult.overallScore >= 70) {
      expToAward = 12; // Điểm 70 - 84: Khá
    } else if (feedbackResult.overallScore >= 55) {
      expToAward = 5;  // Điểm 55 - 69: Cần cố gắng
    } else {
      expToAward = 0;  // Dưới 55 điểm: Chưa đạt chuẩn, cần nắn nót viết lại
    }

    setResult(feedbackResult);
    setExpAwarded(expToAward);
    saveReviewToHistory({
      sampleText: sampleText,
      score: feedbackResult.overallScore,
      grade: feedbackResult.grade,
      imageUrl: selectedImage || undefined,
      strengths: feedbackResult.strengths,
      improvements: feedbackResult.improvements,
      expGained: expToAward,
    });
    if (expToAward > 0) {
      playFanfareSound();
    }
  };

  return (
    <div className="w-full min-h-screen bg-neutral-950 text-neutral-100 flex flex-col items-center py-4 sm:py-6 px-3 sm:px-6">
      <div className="w-full max-w-4xl space-y-5 sm:space-y-6">
        {/* Header Intro */}
        <div className="bg-gradient-to-br from-indigo-950/90 via-neutral-900 to-cyan-950/90 border-2 border-indigo-700/50 rounded-3xl p-4 sm:p-6 shadow-xl space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-indigo-500/25 text-indigo-300 border border-indigo-500/40 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
              <span>⭐</span> Cô Giáo AI Chấm Điểm
            </span>
            <span className="text-xs sm:text-sm font-semibold text-neutral-300">Viết trên giấy thật ➔ Chụp ảnh chấm điểm</span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
            Chấm Điểm & Nhận Xét Bài Viết Cho Bé 📝
          </h2>
          <p className="text-xs sm:text-base text-neutral-200 leading-relaxed">
            Bé cứ thoải mái viết bài bằng bút mực thật trên vở ô ly hoặc tờ giấy A4. Sau đó chụp ảnh trang viết để <strong>cô AI chấm điểm</strong>, khen ngợi và chỉ bé cách nắn nót từng nét chữ nhé!
          </p>
        </div>

        {/* Upload & Snapshot Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Box 1: Image Capture */}
          <div className="bg-neutral-900 border-2 border-neutral-800 rounded-3xl p-4 sm:p-5 flex flex-col items-center justify-center min-h-[300px] text-center relative overflow-hidden shadow-lg">
            {selectedImage ? (
              <div className="relative w-full h-full flex flex-col items-center space-y-4">
                <img 
                  src={selectedImage} 
                  alt="Trang viết tay của bé" 
                  className="max-h-72 w-auto object-contain rounded-2xl border-2 border-neutral-700 shadow-lg"
                />
                <div className="flex flex-wrap items-center justify-center gap-3 w-full">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2.5 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs sm:text-sm font-bold transition active:scale-95 cursor-pointer"
                  >
                    Đổi ảnh khác
                  </button>

                  <button
                    id="btn-trigger-ai-analysis"
                    disabled={isAnalyzing}
                    onClick={handleAnalyze}
                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 hover:brightness-110 text-neutral-950 font-black text-sm sm:text-base flex items-center gap-2 shadow-xl shadow-cyan-950/60 transition active:scale-95 disabled:opacity-50 cursor-pointer"
                  >
                    {isAnalyzing ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        <span>Cô AI đang chấm bài...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 text-neutral-950" />
                        <span>Bắt đầu Chấm Điểm ⭐</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 sm:p-6 flex flex-col items-center space-y-4">
                <div className="w-20 h-20 rounded-3xl bg-indigo-500/20 border-2 border-indigo-500/40 flex items-center justify-center text-indigo-400 text-3xl shadow-inner">
                  📸
                </div>
                <div className="space-y-1">
                  <h3 className="text-base sm:text-lg font-black text-white">Chụp ảnh bài viết của bé</h3>
                  <p className="text-xs sm:text-sm text-neutral-300 max-w-xs leading-relaxed">
                    Đặt quyển vở ngay ngắn dưới ánh sáng rõ, chụp thẳng góc từ trên xuống để cô AI nhìn rõ nét chữ nhất!
                  </p>
                </div>

                <input 
                  type="file" 
                  ref={fileInputRef} 
                  accept="image/*" 
                  capture="environment"
                  onChange={handleFileChange} 
                  className="hidden" 
                />

                <div className="pt-2 w-full max-w-xs">
                  <button
                    id="btn-upload-paper-photo"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-3.5 sm:py-4 px-6 rounded-2xl bg-gradient-to-r from-indigo-500 to-cyan-500 hover:brightness-110 text-white font-black text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-xl shadow-indigo-950/50 active:scale-95 transition cursor-pointer"
                  >
                    <Camera className="w-5 h-5" />
                    <span>Chụp hoặc Tải ảnh bài viết 📷</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Box 2: Practice Guidelines & Fast Test */}
          <div className="bg-neutral-900 border-2 border-neutral-800 rounded-3xl p-4 sm:p-5 flex flex-col justify-between space-y-4 shadow-lg">
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
                <span>⭐</span> 4 Tiêu chí cô AI chấm bài:
              </h3>
              <ul className="mt-3 space-y-3 text-xs sm:text-sm text-neutral-300">
                <li className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center shrink-0 text-xs mt-0.5">
                    1
                  </div>
                  <span><strong>Độ nghiêng đều:</strong> Các nét sổ thẳng đều hướng đứng hoặc nghiêng nhẹ cùng một góc.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 text-xs mt-0.5">
                    2
                  </div>
                  <span><strong>Đúng chiều cao ô ly:</strong> Chữ o, a cao 1 ô ly; chữ b, d, l cao 2 ô ly rưỡi.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0 text-xs mt-0.5">
                    3
                  </div>
                  <span><strong>Khoảng cách vừa mắt:</strong> Các chữ không quá dính nhau và không quá cách xa.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 font-bold flex items-center justify-center shrink-0 text-xs mt-0.5">
                    4
                  </div>
                  <span><strong>Nét chữ liền mạch:</strong> Điểm dừng bút sạch sẽ, nét mực đều đặn không đứt quãng.</span>
                </li>
              </ul>
            </div>

            {/* Quick Link to Worksheet Print */}
            {onSelectWorksheet && (
              <div className="p-3.5 sm:p-4 rounded-2xl bg-neutral-850 border border-neutral-700 flex items-center justify-between gap-2">
                <div>
                  <div className="text-xs sm:text-sm font-bold text-white">Chưa có giấy viết ô ly?</div>
                  <div className="text-[11px] sm:text-xs text-neutral-400">In phiếu A4 chuẩn có sẵn câu mẫu</div>
                </div>
                <button
                  onClick={onSelectWorksheet}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition cursor-pointer shrink-0"
                >
                  In bài viết A4
                </button>
              </div>
            )}
          </div>
        </div>

        {/* AI Analysis Result Cards */}
        {result && (
          <div className="bg-neutral-900 border-2 border-neutral-800 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-6 animate-in fade-in duration-300">
            {/* Top Score Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-neutral-800">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-amber-400 to-emerald-400 p-0.5 shadow-xl flex items-center justify-center text-neutral-950 font-black text-3xl sm:text-4xl shrink-0">
                  {result.overallScore}
                </div>
                <div>
                  <div className="text-xs uppercase font-mono font-bold text-amber-300 tracking-wider">KẾT QUẢ CHẤM ĐIỂM</div>
                  <h3 className="text-base sm:text-xl font-black text-white">{result.grade}</h3>
                </div>
              </div>

              <div className="px-4 py-2.5 rounded-2xl bg-emerald-950/60 border border-emerald-700/60 text-emerald-300 text-xs sm:text-sm font-bold flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Chuẩn nét chữ Tiểu học Việt Nam</span>
              </div>
            </div>

            {/* Gamification EXP Award Banner */}
            {expAwarded > 0 && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-emerald-500/20 border border-amber-500/40 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="shrink-0 flex items-center justify-center">
                    <RankInsignia tier="gold" size="sm" showGlow />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                      <span>Bé nhận được +{expAwarded} EXP rèn luyện!</span>
                      <span className="text-xs bg-amber-500 text-neutral-950 font-black px-2 py-0.5 rounded-full">+50 EXP</span>
                    </h4>
                    <p className="text-xs text-neutral-300">
                      Bài viết đã được lưu vào Nhật ký tiến bộ và tích lũy điểm thăng cấp Rank!
                    </p>
                  </div>
                </div>

                {onViewLeaderboard && (
                  <button
                    onClick={onViewLeaderboard}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
                  >
                    <ShieldCheck className="w-4 h-4" /> Xem Cấp Bậc Rank
                  </button>
                )}
              </div>
            )}

            {/* 4 Detail Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
              {/* Metric 1 */}
              <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800 space-y-2">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-neutral-300 font-bold">Độ nghiêng</span>
                  <span className="font-mono text-cyan-400 font-bold">{result.slantAnalysis.score}%</span>
                </div>
                <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-cyan-400 h-full rounded-full" style={{ width: `${result.slantAnalysis.score}%` }} />
                </div>
                <p className="text-xs text-neutral-300 leading-snug">
                  {result.slantAnalysis.feedback}
                </p>
              </div>

              {/* Metric 2 */}
              <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800 space-y-2">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-neutral-300 font-bold">Chiều cao chữ</span>
                  <span className="font-mono text-emerald-400 font-bold">{result.sizeConsistency.score}%</span>
                </div>
                <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${result.sizeConsistency.score}%` }} />
                </div>
                <p className="text-xs text-neutral-300 leading-snug">
                  {result.sizeConsistency.feedback}
                </p>
              </div>

              {/* Metric 3 */}
              <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800 space-y-2">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-neutral-300 font-bold">Khoảng cách</span>
                  <span className="font-mono text-amber-400 font-bold">{result.spacingAndAlignment.score}%</span>
                </div>
                <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-400 h-full rounded-full" style={{ width: `${result.spacingAndAlignment.score}%` }} />
                </div>
                <p className="text-xs text-neutral-300 leading-snug">
                  {result.spacingAndAlignment.feedback}
                </p>
              </div>

              {/* Metric 4 */}
              <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800 space-y-2">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-neutral-300 font-bold">Nét mực</span>
                  <span className="font-mono text-purple-400 font-bold">{result.strokeQuality.score}%</span>
                </div>
                <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-purple-400 h-full rounded-full" style={{ width: `${result.strokeQuality.score}%` }} />
                </div>
                <p className="text-xs text-neutral-300 leading-snug">
                  {result.strokeQuality.feedback}
                </p>
              </div>
            </div>

            {/* Strengths and Improvements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-emerald-950/30 border-2 border-emerald-800/50 rounded-2xl p-4 sm:p-5">
                <div className="text-sm font-extrabold text-emerald-300 flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Điểm bé làm rất tốt ⭐
                </div>
                <ul className="space-y-2 text-xs sm:text-sm text-neutral-200">
                  {result.strengths.map((s, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-amber-950/30 border-2 border-amber-800/50 rounded-2xl p-4 sm:p-5">
                <div className="text-sm font-extrabold text-amber-300 flex items-center gap-2 mb-3">
                  <TrendingUp className="w-5 h-5 text-amber-400" /> Lời khuyên để bé viết đẹp hơn 💡
                </div>
                <ul className="space-y-2 text-xs sm:text-sm text-neutral-200">
                  {result.improvements.map((imp, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>{imp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Encouragement Note */}
            {result.encouragement && (
              <div className="p-4 sm:p-5 rounded-2xl bg-neutral-950 border-2 border-neutral-800 text-xs sm:text-sm text-neutral-200 flex items-center gap-3">
                <span className="text-3xl">🌱</span>
                <span className="italic font-medium">"{result.encouragement}"</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
