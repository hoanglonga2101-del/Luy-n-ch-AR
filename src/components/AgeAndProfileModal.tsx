import React, { useState, useEffect } from 'react';
import { 
  User, 
  Sparkles, 
  Check, 
  X, 
  ArrowRight,
  BookOpen,
  Award,
  ChevronRight,
  Heart
} from 'lucide-react';
import { AgeGroupKey, UserLearnerProfile } from '../types';
import { AGE_GROUPS, getStoredProfile, updateUserProfile } from '../utils/gamification';
import { playFanfareSound } from '../utils/audio';
import { RankInsignia } from './RankInsignia';

interface AgeAndProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileUpdated?: (updated: UserLearnerProfile) => void;
  onNavigateToView?: (view: 'alphabet' | 'sentences' | 'worksheet' | 'lightbox' | 'ai_feedback' | 'canvas' | 'ar') => void;
  isFirstTime?: boolean;
}

const AVATAR_OPTIONS = [
  { emoji: '🐱', label: 'Mèo Con' },
  { emoji: '🐶', label: 'Cún Con' },
  { emoji: '🐰', label: 'Thỏ Trắng' },
  { emoji: '🐼', label: 'Gấu Trúc' },
  { emoji: '🦊', label: 'Cáo Vàng' },
  { emoji: '🦁', label: 'Sư Tử' },
  { emoji: '🐯', label: 'Hổ Con' },
  { emoji: '🦄', label: 'Kỳ Lân' },
  { emoji: '🐥', label: 'Gà Con' },
  { emoji: '🦉', label: 'Cú Thông Thái' },
  { emoji: '🖋️', label: 'Bút Máy' },
  { emoji: '⭐', label: 'Ngôi Sao' },
];

const SUGGESTED_NAMES = [
  'Bé Bảo An',
  'Minh Khang',
  'Phương Linh',
  'Gia Hưng',
  'Tuệ Mẫn',
  'Hoàng Nam',
  'Ngọc Ánh',
  'Bảo Châu',
];

export const AgeAndProfileModal: React.FC<AgeAndProfileModalProps> = ({
  isOpen,
  onClose,
  onProfileUpdated,
  onNavigateToView,
  isFirstTime = false,
}) => {
  const [profile, setProfile] = useState<UserLearnerProfile>(getStoredProfile());
  const [studentName, setStudentName] = useState<string>(profile.studentName || '');
  const [selectedAge, setSelectedAge] = useState<AgeGroupKey>(profile.ageGroup || 'grade1');
  const [selectedAvatar, setSelectedAvatar] = useState<string>(profile.avatar || '🐱');
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      const p = getStoredProfile();
      setProfile(p);
      setStudentName(p.studentName || '');
      setSelectedAge(p.ageGroup || 'grade1');
      setSelectedAvatar(p.avatar || '🐱');
      setErrorMsg('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentAgeConfig = AGE_GROUPS[selectedAge];

  const handleSave = () => {
    const trimmed = studentName.trim();
    if (!trimmed) {
      setErrorMsg('Vui lòng nhập tên người học hoặc tên của bé nhé!');
      return;
    }

    const updated = updateUserProfile({
      studentName: trimmed,
      ageGroup: selectedAge,
      avatar: selectedAvatar,
      hasCompletedOnboarding: true,
    });

    playFanfareSound();
    if (onProfileUpdated) onProfileUpdated(updated);

    // If first time or user switched age, auto-navigate to the optimal practice view
    if (onNavigateToView && currentAgeConfig) {
      onNavigateToView(currentAgeConfig.recommendedView);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-700/80 rounded-3xl shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative Top Accent Gradient */}
        <div className="h-2.5 w-full bg-gradient-to-r from-amber-500 via-yellow-400 to-emerald-500" />

        {/* Modal Header */}
        <div className="px-5 sm:px-6 pt-5 pb-3 flex items-start justify-between border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-yellow-500/20 border border-amber-500/40 flex items-center justify-center text-2xl shadow-inner shrink-0">
              {currentAgeConfig.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                  {isFirstTime ? 'Chào mừng bạn đến với Luyện Chữ Đẹp AI!' : 'Thiết lập Hồ sơ & Lứa tuổi'}
                </h2>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  <Sparkles className="w-3 h-3 text-amber-400" /> Đa lứa tuổi
                </span>
              </div>
              <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">
                {isFirstTime 
                  ? 'Hãy đặt tên và chọn độ tuổi để ứng dụng thiết kế bài tập phù hợp nhất cho bạn nhé' 
                  : 'Thay đổi tên người học, lứa tuổi rèn chữ và linh thú đồng hành'}
              </p>
            </div>
          </div>

          {!isFirstTime && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="px-5 sm:px-6 py-5 space-y-5 max-h-[75vh] overflow-y-auto custom-scrollbar">
          {/* Step 1: Đặt tên người học */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-amber-400" />
                1. Tên người học / Tên của bé:
              </span>
              <span className="text-[11px] text-neutral-500 font-normal">
                (Hiển thị trên bảng kết quả và lời khen của AI)
              </span>
            </label>

            <div className="relative">
              <input
                type="text"
                value={studentName}
                onChange={(e) => {
                  setStudentName(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="Ví dụ: Bé Bảo An, Minh Khang, Bạn Thảo..."
                maxLength={30}
                className="w-full px-4 py-3 rounded-2xl bg-neutral-950 border border-neutral-700 text-white font-semibold text-base focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition placeholder:text-neutral-600 shadow-inner"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-2xl">
                {selectedAvatar}
              </div>
            </div>

            {errorMsg && (
              <p className="text-xs text-rose-400 font-medium animate-in fade-in">
                {errorMsg}
              </p>
            )}

            {/* Quick Name Suggestions */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              <span className="text-[11px] text-neutral-500">Gợi ý nhanh:</span>
              {SUGGESTED_NAMES.map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => {
                    setStudentName(name);
                    if (errorMsg) setErrorMsg('');
                  }}
                  className="text-[11px] px-2.5 py-0.5 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white border border-neutral-700 transition cursor-pointer"
                >
                  {name}
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Chọn lứa tuổi rèn chữ (Core Request) */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-neutral-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                2. Chọn độ tuổi & mục tiêu rèn chữ:
              </span>
              <span className="text-[11px] text-amber-400 font-semibold">
                * Tối ưu hóa lộ trình bài tập
              </span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {(Object.keys(AGE_GROUPS) as AgeGroupKey[]).map((key) => {
                const group = AGE_GROUPS[key];
                const isSelected = selectedAge === key;

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedAge(key)}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                      isSelected
                        ? 'bg-neutral-800/90 border-amber-500 ring-2 ring-amber-500/40 shadow-lg shadow-amber-950/30'
                        : 'bg-neutral-950/70 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900/60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl p-1.5 bg-neutral-900 rounded-xl border border-neutral-700 shadow-inner">
                          {group.icon}
                        </span>
                        <div>
                          <h4 className="text-sm font-bold text-white leading-snug">
                            {group.title}
                          </h4>
                          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border inline-block mt-0.5 ${group.badgeColor}`}>
                            {group.ageRange}
                          </span>
                        </div>
                      </div>

                      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border transition ${
                        isSelected 
                          ? 'bg-amber-500 border-amber-400 text-neutral-950' 
                          : 'border-neutral-700 text-transparent'
                      }`}>
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    </div>

                    <p className="text-xs text-neutral-400 mt-2.5 leading-relaxed line-clamp-2">
                      {group.description}
                    </p>

                    <div className="mt-2 pt-2 border-t border-neutral-800/80 text-[11px] text-amber-300/90 font-medium flex items-center gap-1">
                      <span>Trọng tâm:</span>
                      <span className="text-neutral-300 font-normal truncate">{group.focusText}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Chọn Linh thú đại diện (Avatar) */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-rose-400" />
                3. Chọn linh thú đồng hành yêu thích:
              </span>
              <span className="text-[11px] text-neutral-500">
                Đang chọn: {AVATAR_OPTIONS.find(a => a.emoji === selectedAvatar)?.label}
              </span>
            </label>

            <div className="grid grid-cols-6 sm:grid-cols-6 gap-2 bg-neutral-950/80 p-3 rounded-2xl border border-neutral-800">
              {AVATAR_OPTIONS.map((item) => {
                const isSelected = selectedAvatar === item.emoji;
                return (
                  <button
                    key={item.emoji}
                    type="button"
                    onClick={() => setSelectedAvatar(item.emoji)}
                    className={`p-2 rounded-xl flex flex-col items-center justify-center transition cursor-pointer relative group ${
                      isSelected
                        ? 'bg-amber-500/20 border-2 border-amber-500 scale-105 shadow-md'
                        : 'hover:bg-neutral-800/80 border border-transparent'
                    }`}
                    title={item.label}
                  >
                    <span className="text-2xl group-hover:scale-110 transition-transform">
                      {item.emoji}
                    </span>
                    <span className="text-[9px] text-neutral-400 mt-0.5 truncate w-full text-center">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Current Rank & Benefits Preview */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-neutral-900 to-emerald-500/10 border border-amber-500/30 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <RankInsignia tier="bronze" size="sm" showGlow />
              <div>
                <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                  Khởi đầu: Bậc Rank Đồng Nét Chữ
                  <span className="text-[10px] text-amber-400 font-mono font-bold">+180 EXP thưởng</span>
                </h5>
                <p className="text-[11px] text-neutral-400">
                  Hoàn thành nét chữ, in bài tập hoặc nhờ AI chấm điểm để thăng cấp lên Bạc, Vàng, Kim Cương và Bậc Thầy!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 sm:px-6 py-4 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between gap-3">
          <p className="text-[11px] text-neutral-500 hidden sm:block">
            * Bạn có thể thay đổi độ tuổi và tên bất kỳ lúc nào tại thanh tiêu đề.
          </p>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {!isFirstTime && (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-medium text-xs transition cursor-pointer"
              >
                Hủy
              </button>
            )}
            <button
              type="button"
              onClick={handleSave}
              className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-neutral-950 font-black text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-amber-500/25 active:scale-95"
            >
              <span>{isFirstTime ? 'Bắt đầu luyện chữ ngay' : 'Lưu hồ sơ'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
