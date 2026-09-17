import React, { useState, useEffect } from 'react';
import { 
  Eye, 
  Clock, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  X, 
  Sparkles, 
  ShieldAlert,
  Award
} from 'lucide-react';
import { awardExp, unlockBadge } from '../utils/gamification';
import { playFanfareSound } from '../utils/audio';

interface EyeProtectionTimerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen?: () => void;
  onStartRest?: () => void;
}

export const EyeProtectionTimer: React.FC<EyeProtectionTimerProps> = ({
  isOpen,
  onClose,
  onOpen,
}) => {
  const [timerDuration, setTimerDuration] = useState<number>(20 * 60); // 20 minutes in seconds
  const [timeLeft, setTimeLeft] = useState<number>(20 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [isResting, setIsResting] = useState<boolean>(false);
  const [restCountdown, setRestCountdown] = useState<number>(20); // 20-second break

  // Main 20-minute countdown
  useEffect(() => {
    let interval: any = null;
    if (isRunning && !isResting && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, isResting, timeLeft]);

  // Handle completion of 20-minute work session
  useEffect(() => {
    if (isRunning && !isResting && timeLeft === 0) {
      setIsRunning(false);
      setIsResting(true);
      setRestCountdown(20);
      playFanfareSound();
      onOpen?.();
    }
  }, [isRunning, isResting, timeLeft, onOpen]);

  // 20-second eye exercise countdown
  useEffect(() => {
    let restInterval: any = null;
    if (isResting && restCountdown > 0) {
      restInterval = setInterval(() => {
        setRestCountdown((prev) => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(restInterval);
  }, [isResting, restCountdown]);

  // Handle completion of 20-second eye rest
  useEffect(() => {
    if (isResting && restCountdown === 0) {
      setIsResting(false);
      setTimeLeft(timerDuration);
      setIsRunning(true);
      awardExp(30, 'Hoàn thành bài tập mắt 20-20-20');
      unlockBadge('eye_protector');
      playFanfareSound();
    }
  }, [isResting, restCountdown, timerDuration]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const progressPercent = ((timerDuration - timeLeft) / timerDuration) * 100;

  if (!isOpen) {
    return (
      <aside
        aria-label="Đồng hồ bảo vệ mắt"
        className="fixed bottom-4 right-4 z-40 animate-in fade-in slide-in-from-bottom duration-300 pointer-events-auto"
      >
        <button
          id="floating-eye-timer-pill"
          onClick={onOpen || onClose}
          className={`px-3 py-1.5 rounded-full border shadow-xl flex items-center gap-2 backdrop-blur-md transition-all active:scale-95 cursor-pointer ${
            isResting
              ? 'bg-emerald-500 text-neutral-950 font-bold animate-pulse border-emerald-300 ring-4 ring-emerald-400/50'
              : 'bg-neutral-900/90 text-neutral-200 border-neutral-700/80 hover:border-emerald-500/60 hover:text-emerald-300'
          }`}
          title="Đồng hồ bảo vệ mắt 20-20-20 (Bấm để xem chi tiết bài tập mắt)"
        >
          <Eye className={`w-3.5 h-3.5 ${isResting ? 'text-neutral-950' : 'text-emerald-400'}`} />
          <span className="text-[11px] font-mono font-bold">
            {isResting ? `Nghỉ mắt ${restCountdown}s` : formattedTime}
          </span>
          {isRunning && !isResting && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          )}
        </button>
      </aside>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-neutral-900 border border-neutral-700/90 rounded-3xl p-6 text-neutral-100 shadow-2xl flex flex-col"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white rounded-full bg-neutral-800/80 hover:bg-neutral-800 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Resting Eye Modal View */}
        {isResting ? (
          <div className="text-center py-4 space-y-4">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-4xl shadow-lg shadow-emerald-950/60 animate-bounce">
              👀
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/30">
                Đến giờ giải lao mắt rồi bé ơi!
              </span>
              <h3 className="text-2xl font-black text-white pt-1">
                Quy tắc 20-20-20
              </h3>
              <p className="text-xs text-neutral-300 max-w-xs mx-auto">
                Bé hãy ngước nhìn một vật cách xa khoảng <strong>6 mét (cửa sổ, cây xanh)</strong> trong 20 giây để mắt thư giãn nhé!
              </p>
            </div>

            {/* Countdown Ring */}
            <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="52"
                  className="stroke-neutral-800"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="52"
                  className="stroke-emerald-400 transition-all duration-1000 ease-linear"
                  strokeWidth="8"
                  strokeDasharray={2 * Math.PI * 52}
                  strokeDashoffset={2 * Math.PI * 52 * (1 - restCountdown / 20)}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-white">{restCountdown}</span>
                <span className="text-[10px] text-emerald-300 font-semibold">giây</span>
              </div>
            </div>

            {/* Eye exercise tips */}
            <div className="p-3 bg-neutral-950 rounded-2xl border border-neutral-800 text-xs text-neutral-300 space-y-1 text-left">
              <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Mẹo cho mắt sáng:
              </div>
              <p>• Chớp mắt nhẹ nhàng 5 lần để giữ ẩm mắt.</p>
              <p>• Xoay vai và hít thở thật sâu một hơi dài.</p>
            </div>

            <button
              onClick={() => {
                setIsResting(false);
                setTimeLeft(timerDuration);
                setIsRunning(true);
              }}
              className="w-full py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold transition cursor-pointer"
            >
              Bỏ qua và viết tiếp
            </button>
          </div>
        ) : (
          /* Normal Timer Control View */
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                <Eye className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  Đồng hồ bảo vệ mắt
                  <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-500/30 font-semibold">
                    Quy tắc 20-20-20
                  </span>
                </h3>
                <p className="text-xs text-neutral-400">
                  Tập trung viết 20 phút - Nghỉ ngơi 20 giây nhìn xa 6 mét
                </p>
              </div>
            </div>

            {/* Main Clock Face */}
            <div className="p-5 bg-neutral-950 rounded-3xl border border-neutral-800 text-center space-y-3">
              <div className="text-5xl font-black font-mono tracking-tight text-white flex items-center justify-center gap-1">
                <span>{formattedTime}</span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-neutral-800 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-neutral-400 px-1">
                <span>Trạng thái: {isRunning ? '🟢 Đang đếm giờ học' : '⏸️ Tạm dừng'}</span>
                <span>Mỗi hiệp: {Math.round(timerDuration / 60)} phút</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer ${
                  isRunning 
                    ? 'bg-amber-600 hover:bg-amber-500 text-white' 
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                {isRunning ? (
                  <>
                    <Pause className="w-4 h-4" /> Tạm dừng
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" /> Tiếp tục luyện chữ
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  setTimeLeft(timerDuration);
                  setIsRunning(false);
                }}
                className="p-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white rounded-xl transition cursor-pointer"
                title="Đặt lại đồng hồ"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setIsResting(true);
                  setRestCountdown(20);
                  setIsRunning(false);
                }}
                className="py-3 px-3 bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-300 border border-cyan-500/40 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap"
              >
                👀 Nghỉ mắt ngay
              </button>
            </div>

            {/* Duration Selector */}
            <div className="space-y-1.5">
              <div className="text-xs font-bold text-neutral-400">Chọn thời gian mỗi hiệp học:</div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { mins: 15, label: '15 phút' },
                  { mins: 20, label: '20 phút (chuẩn)' },
                  { mins: 30, label: '30 phút' },
                ].map((item) => (
                  <button
                    key={item.mins}
                    onClick={() => {
                      setTimerDuration(item.mins * 60);
                      setTimeLeft(item.mins * 60);
                    }}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                      timerDuration === item.mins * 60
                        ? 'bg-cyan-600 text-white border-cyan-400'
                        : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Benefit info */}
            <div className="p-3 bg-neutral-950/80 rounded-2xl border border-neutral-800 text-[11px] text-neutral-400 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                Nghiên cứu Nhãn khoa khuyên trẻ sau 20 phút nhìn gần nên thư giãn nhìn xa để giảm nguy cơ cận thị học đường và giữ mắt luôn sáng khỏe!
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
