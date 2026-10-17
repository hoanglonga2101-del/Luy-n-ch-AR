import React from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  RotateCcw, 
  ArrowRight, 
  Sparkles, 
  Award, 
  BookOpen, 
  Camera,
  X
} from 'lucide-react';
import { PostWritingAssessmentResult } from '../utils/handwritingEvaluator';
import { ComprehensiveAssessmentScore } from '../utils/opticalStrokeOrderTracker';

interface HandwritingAssessmentModalProps {
  isOpen: boolean;
  result: (PostWritingAssessmentResult | ComprehensiveAssessmentScore) | null;
  onClose: () => void;
  onRetry: () => void;
  onNextLetter: () => void;
}

export const HandwritingAssessmentModal: React.FC<HandwritingAssessmentModalProps> = ({
  isOpen,
  result,
  onClose,
  onRetry,
  onNextLetter,
}) => {
  if (!isOpen || !result) return null;

  const isComprehensive = 'stroke_order_valid' in result;
  const strokeOrderValid = isComprehensive ? (result as ComprehensiveAssessmentScore).stroke_order_valid : true;
  const isPass = result.overall_score >= 80 && strokeOrderValid;
  const isNeedsImprovement = !isPass && result.overall_score >= 60;

  // Circular Score Gauge parameters
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (result.overall_score / 100) * circumference;

  const getScoreColor = () => {
    if (result.overall_score >= 80 && strokeOrderValid) return 'text-emerald-400 stroke-emerald-500';
    if (result.overall_score >= 60) return 'text-amber-400 stroke-amber-500';
    return 'text-rose-400 stroke-rose-500';
  };

  return (
    <div 
      id="assessment-result-modal-overlay"
      className="fixed inset-0 z-[1000000] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 pointer-events-auto"
      style={{ zIndex: 1000000 }}
    >
      <div 
        id="assessment-result-modal"
        className="w-full max-w-md bg-neutral-900 border border-neutral-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200 pointer-events-auto"
      >
        {/* Top Header with Status & Close Button */}
        <div className={`p-4 sm:p-5 flex items-center justify-between border-b ${
          isPass 
            ? 'bg-gradient-to-r from-emerald-950/80 via-emerald-900/40 to-neutral-900 border-emerald-500/40' 
            : isNeedsImprovement
              ? 'bg-gradient-to-r from-amber-950/80 via-amber-900/40 to-neutral-900 border-amber-500/40'
              : 'bg-gradient-to-r from-rose-950/80 via-rose-900/40 to-neutral-900 border-rose-500/40'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg ${
              isPass 
                ? 'bg-emerald-500/20 border-2 border-emerald-400 text-emerald-300' 
                : isNeedsImprovement
                  ? 'bg-amber-500/20 border-2 border-amber-400 text-amber-300'
                  : 'bg-rose-500/20 border-2 border-rose-400 text-rose-300'
            }`}>
              {isPass ? (
                <span className="text-2xl animate-bounce">🎉</span>
              ) : (
                <AlertTriangle className="w-6 h-6 animate-pulse" />
              )}
            </div>

            <div>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                (result as any).statusBadge || (isPass ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50' : isNeedsImprovement ? 'bg-amber-500/20 text-amber-300 border-amber-500/50' : 'bg-rose-500/20 text-rose-300 border-rose-500/50')
              }`}>
                {isPass ? 'ĐẠT CHUẨN TIỂU HỌC' : isNeedsImprovement ? 'CẦN CẢI THIỆN' : 'CHƯA ĐẠT CHUẨN'}
              </span>
              <h2 className="text-base sm:text-lg font-black text-white mt-0.5">
                {result.statusTitle}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white flex items-center justify-center transition cursor-pointer"
            title="Đóng bảng"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs sm:text-sm">
          {/* Main Metrics Card: Circular Score & Sub-scores */}
          <div className="bg-neutral-950/80 border border-neutral-800 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-inner">
            {/* Circular Gauge */}
            <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
              <svg className="w-24 h-24 transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r={radius}
                  className="stroke-neutral-800"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="48"
                  cy="48"
                  r={radius}
                  className={`${getScoreColor()} transition-all duration-1000 ease-out`}
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className={`text-2xl font-black ${getScoreColor().split(' ')[0]}`}>
                  {result.overall_score}
                </span>
                <span className="text-[10px] font-semibold text-neutral-400 uppercase -mt-0.5">
                  /100 Điểm
                </span>
              </div>
            </div>

            {/* Sub Metrics Breakdown */}
            <div className="flex-1 space-y-2 border-l border-neutral-800 pl-3.5">
              {isComprehensive && (result as ComprehensiveAssessmentScore).criteriaScores ? (
                <>
                  <div>
                    <div className="flex items-center justify-between text-neutral-300 text-xs mb-1">
                      <span>Thứ tự nét (30%):</span>
                      <span className={`font-mono font-bold ${(result as ComprehensiveAssessmentScore).criteriaScores.strokeOrderScore === 30 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {(result as ComprehensiveAssessmentScore).criteriaScores.strokeOrderScore} / 30
                      </span>
                    </div>
                    <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${(result as ComprehensiveAssessmentScore).criteriaScores.strokeOrderScore === 30 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                        style={{ width: `${((result as ComprehensiveAssessmentScore).criteriaScores.strokeOrderScore / 30) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-neutral-300 text-xs mb-1">
                      <span>Đầy đủ nét (30%):</span>
                      <span className="font-mono font-bold text-cyan-400">
                        {(result as ComprehensiveAssessmentScore).criteriaScores.completenessScore} / 30
                      </span>
                    </div>
                    <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-cyan-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${((result as ComprehensiveAssessmentScore).criteriaScores.completenessScore / 30) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-neutral-300 text-xs mb-1">
                      <span>Tỷ lệ & Hình dáng (40%):</span>
                      <span className="font-mono font-bold text-amber-400">
                        {(result as ComprehensiveAssessmentScore).criteriaScores.proportionScore} / 40
                      </span>
                    </div>
                    <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-amber-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${((result as ComprehensiveAssessmentScore).criteriaScores.proportionScore / 40) * 100}%` }}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <div className="flex items-center justify-between text-neutral-300 text-xs mb-1">
                      <span>Số nét chuẩn:</span>
                      <span className="font-mono font-bold text-white">
                        {(result as any).strokeCompleteness?.actualCount || 2} / {(result as any).strokeCompleteness?.expectedCount || 2} nét
                      </span>
                    </div>
                    <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-cyan-500 h-full rounded-full transition-all duration-500"
                        style={{ width: '100%' }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-neutral-300 text-xs mb-1">
                      <span>Khớp quỹ đạo:</span>
                      <span className="font-mono font-bold text-white">
                        {(result as any).trajectoryAccuracy || 90}%
                      </span>
                    </div>
                    <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${(result as any).trajectoryAccuracy || 90}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-neutral-300 text-xs mb-1">
                      <span>Tỷ lệ ô ly:</span>
                      <span className="font-mono font-bold text-white">
                        {(result as any).proportionAccuracy || 88}%
                      </span>
                    </div>
                    <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-amber-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${(result as any).proportionAccuracy || 88}%` }}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Captured Real-time Frame Snapshot (if available) */}
          {result.snapshotUrl && (
            <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-2 overflow-hidden">
              <div className="flex items-center justify-between px-1 pb-1.5 text-[11px] text-neutral-400">
                <span className="flex items-center gap-1 font-semibold text-neutral-300">
                  <Camera className="w-3.5 h-3.5 text-cyan-400" /> Nét chữ thực tế ghi nhận
                </span>
                <span className="font-mono text-cyan-400">Chữ: '{result.character}'</span>
              </div>
              <div className="w-full h-32 rounded-xl bg-black overflow-hidden relative border border-neutral-800">
                <img 
                  src={result.snapshotUrl} 
                  alt="Nét chữ thực tế" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-1 right-2 bg-black/70 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] text-neutral-300 font-mono">
                  {new Date(result.timestamp).toLocaleTimeString('vi-VN')}
                </div>
              </div>
            </div>
          )}

          {/* Detailed Bullet Comments (Chỉ rõ đúng ở đâu, sai ở đâu) */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Nhận xét chi tiết từng nét & quy chuẩn:</span>
            </h3>

            <div className="space-y-1.5">
              {result.comments.map((item, idx) => (
                <div 
                  key={idx}
                  className={`p-2.5 rounded-xl border flex items-start gap-2.5 leading-relaxed text-xs ${
                    item.type === 'success'
                      ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-200'
                      : item.type === 'error'
                        ? 'bg-rose-950/40 border-rose-500/40 text-rose-200'
                        : 'bg-amber-950/30 border-amber-500/30 text-amber-200'
                  }`}
                >
                  <div className="shrink-0 mt-0.5">
                    {item.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    {item.type === 'error' && <XCircle className="w-4 h-4 text-rose-400" />}
                    {item.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400" />}
                  </div>
                  <div className="flex-1">
                    {item.text}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Adaptive Learning Recommendation Box (Đề xuất sửa lỗi theo Ban Giám Khảo) */}
          <div className="bg-gradient-to-r from-blue-950/40 via-indigo-950/40 to-neutral-900 border border-blue-500/30 rounded-2xl p-3.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-300 mb-1">
              <BookOpen className="w-4 h-4 text-blue-400" />
              <span>Gợi ý bài luyện tiếp theo:</span>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed">
              {result.recommendation.advice}
            </p>
            {result.recommendation.suggestedCharacters.length > 0 && (
              <div className="flex items-center gap-1.5 mt-2">
                <span className="text-[11px] text-neutral-400">Nhóm chữ nên tập:</span>
                <div className="flex items-center gap-1">
                  {result.recommendation.suggestedCharacters.map((c, i) => (
                    <span 
                      key={i}
                      className="w-6 h-6 rounded-lg bg-neutral-800 border border-neutral-700 text-cyan-300 font-mono font-bold flex items-center justify-center text-xs"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Action Buttons (Fixed Bottom) */}
        <div className="p-4 sm:p-5 bg-neutral-950 border-t border-neutral-800 flex items-center gap-2.5">
          <button
            id="btn-modal-retry"
            type="button"
            onClick={onRetry}
            className="flex-1 py-3 px-4 rounded-2xl bg-neutral-800 hover:bg-neutral-750 active:scale-95 text-white font-bold text-xs sm:text-sm border border-neutral-700 flex items-center justify-center gap-2 transition cursor-pointer shadow-md"
          >
            <RotateCcw className="w-4 h-4 text-amber-400" />
            <span>Viết lại chữ này</span>
          </button>

          <button
            id="btn-modal-next"
            type="button"
            onClick={onNextLetter}
            className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-xl shadow-cyan-950/80 border border-cyan-400/40 flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <span>Sang bài tiếp theo</span>
            <ArrowRight className="w-4 h-4 text-cyan-200" />
          </button>
        </div>
      </div>
    </div>
  );
};
