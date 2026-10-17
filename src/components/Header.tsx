import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  Sparkles, 
  BookOpen, 
  PenTool, 
  Camera, 
  HelpCircle, 
  Printer, 
  Award, 
  Smartphone, 
  Laptop, 
  Type, 
  Menu, 
  X, 
  ChevronDown,
  Check,
  Trophy,
  ShieldCheck,
  Eye,
  Volume2,
  VolumeX,
  Flame
} from 'lucide-react';
import { LanguageCode, DeviceMode, UserLearnerProfile } from '../types';
import { getStoredProfile, getCurrentTier, AGE_GROUPS } from '../utils/gamification';
import { toggleContinuousASMRPen, isContinuousASMRPlaying } from '../utils/audio';
import { RankInsignia } from './RankInsignia';

export type AppViewMode = 'alphabet' | 'sentences' | 'worksheet' | 'lightbox' | 'ai_feedback' | 'canvas' | 'ar' | 'leaderboard';

interface HeaderProps {
  currentLanguage: LanguageCode;
  onSelectLanguage: (lang: LanguageCode) => void;
  activeView: AppViewMode;
  onSelectView: (view: AppViewMode) => void;
  onOpenGuide: () => void;
  deviceMode?: DeviceMode;
  onSelectDeviceMode?: (mode: DeviceMode) => void;
  onOpenEyeTimer?: () => void;
  onOpenProfileModal?: () => void;
  onOpenValidationModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLanguage,
  onSelectLanguage,
  activeView,
  onSelectView,
  onOpenGuide,
  deviceMode = 'mobile',
  onSelectDeviceMode,
  onOpenEyeTimer,
  onOpenProfileModal,
  onOpenValidationModal,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [profile, setProfile] = useState<UserLearnerProfile>(getStoredProfile);
  const [isAsmrPlaying, setIsAsmrPlaying] = useState<boolean>(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    setIsAsmrPlaying(isContinuousASMRPlaying());

    const handleProfileUpdate = () => {
      setProfile(getStoredProfile());
    };

    window.addEventListener('learner_profile_updated', handleProfileUpdate);
    window.addEventListener('storage', handleProfileUpdate);

    return () => {
      window.removeEventListener('learner_profile_updated', handleProfileUpdate);
      window.removeEventListener('storage', handleProfileUpdate);
    };
  }, []);

  const handleToggleAsmr = () => {
    const newState = toggleContinuousASMRPen();
    setIsAsmrPlaying(newState);
  };

  // Close lang dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target as Node)) {
        setIsLangDropdownOpen(false);
      }
    };
    if (isLangDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isLangDropdownOpen]);

  // Close menu on ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen]);

  const languages: { code: LanguageCode; label: string; flag: string }[] = [
    { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'ja', label: 'Tiếng Nhật', flag: '🇯🇵' },
    { code: 'zh', label: 'Tiếng Trung', flag: '🇨🇳' },
  ];

  const handleNavigate = (view: AppViewMode) => {
    onSelectView(view);
    setIsMenuOpen(false);
  };

  // Kid-friendly titles, large badges & clear descriptions
  const navItems: { 
    id: AppViewMode; 
    label: string; 
    shortLabel: string;
    icon: React.ReactNode; 
    colorClass: string; 
    desc: string; 
    badge?: string;
    emoji: string;
  }[] = [
    {
      id: 'worksheet',
      label: 'In bài tập viết ô ly A4',
      shortLabel: 'In bài viết A4',
      icon: <Printer className="w-6 h-6 text-emerald-400" />,
      colorClass: 'text-emerald-300 bg-emerald-500/20 border-emerald-500/40',
      desc: 'Bé in giấy ô ly ra để cầm bút mực thật viết theo nét mờ hoặc nét đứt.',
      badge: 'Khuyên dùng nhất ⭐',
      emoji: '🖨️',
    },
    {
      id: 'lightbox',
      label: 'Coi kiểu chữ & Kê giấy đồ nét',
      shortLabel: 'Coi kiểu chữ',
      icon: <Type className="w-6 h-6 text-amber-400" />,
      colorClass: 'text-amber-300 bg-amber-500/20 border-amber-500/40',
      desc: 'Phóng to chữ mẫu trên màn hình rồi đặt tờ giấy mỏng lên đồ theo.',
      badge: 'Rất dễ tập 💡',
      emoji: '🔍',
    },
    {
      id: 'ai_feedback',
      label: 'Cô AI chấm điểm bài viết',
      shortLabel: 'Chấm điểm AI',
      icon: <Award className="w-6 h-6 text-indigo-400" />,
      colorClass: 'text-indigo-300 bg-indigo-500/20 border-indigo-500/40',
      desc: 'Bé viết xong chụp ảnh lại, cô giáo AI sẽ chấm điểm và khen thưởng ngay!',
      badge: 'Chấm điểm vui 🎉',
      emoji: '⭐',
    },
    {
      id: 'leaderboard',
      label: 'Hệ thống Cấp bậc Rank & Huy hiệu',
      shortLabel: 'Cấp bậc Rank',
      icon: <ShieldCheck className="w-6 h-6 text-amber-400" />,
      colorClass: 'text-amber-300 bg-amber-500/20 border-amber-500/40',
      desc: 'Tích lũy EXP rèn chữ, mở khóa huy hiệu danh dự và thăng hạng từ Đồng lên Bậc Thầy Luyện Chữ!',
      badge: 'Cấp bậc Rank ⭐',
      emoji: '🛡️',
    },
    ...(currentLanguage !== 'zh' ? [{
      id: 'alphabet' as AppViewMode,
      label: 'Bảng chữ cái & Tập từng nét',
      shortLabel: 'Bảng chữ cái',
      icon: <BookOpen className="w-6 h-6 text-cyan-400" />,
      colorClass: 'text-cyan-300 bg-cyan-500/20 border-cyan-500/40',
      desc: 'Xem thứ tự đưa bút từ nét đầu đến nét cuối của từng chữ cái.',
      emoji: '📚',
    }] : []),
    {
      id: 'sentences',
      label: 'Tập viết câu thơ & Châm ngôn',
      shortLabel: 'Tập viết câu',
      icon: <PenTool className="w-6 h-6 text-teal-400" />,
      colorClass: 'text-teal-300 bg-teal-500/20 border-teal-500/40',
      desc: 'Tự chọn bài ca dao, thơ bé thích hoặc tự gõ câu chữ mẫu.',
      emoji: '✍️',
    },
    {
      id: 'ar',
      label: 'Camera AR soi chữ lên giấy',
      shortLabel: 'Camera AR',
      icon: <Camera className="w-6 h-6 text-rose-400" />,
      colorClass: 'text-rose-300 bg-rose-500/20 border-rose-500/40',
      desc: 'Kê điện thoại lên cốc nước để camera chiếu chữ ảo xuống trang giấy.',
      emoji: '📷',
    },
  ];

  const currentTier = getCurrentTier(profile.totalExp);
  const currentLangObj = languages.find(l => l.code === currentLanguage) || languages[0];
  const activeItem = navItems.find(item => item.id === activeView) || navItems[0];

  const drawerContent = isMenuOpen && mounted ? (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={() => setIsMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Slide-over Drawer Panel */}
      <div 
        id="app-menu-drawer-panel"
        className="relative w-full max-w-md sm:max-w-lg h-[100dvh] bg-neutral-900 border-l border-neutral-800 text-white shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200"
      >
        {/* Drawer Header: large and friendly */}
        <div className="p-4 sm:p-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-950 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 via-emerald-400 to-cyan-400 p-0.5 flex items-center justify-center shadow-lg shadow-emerald-950/40">
              <div className="w-full h-full bg-neutral-950 rounded-2xl flex items-center justify-center text-xl">
                ✏️
              </div>
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center gap-2">
                Menu Luyện Chữ
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400">Chọn bài học và công cụ luyện viết</p>
            </div>
          </div>

          <button
            id="btn-close-menu-drawer"
            onClick={() => setIsMenuOpen(false)}
            className="w-11 h-11 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition flex items-center justify-center cursor-pointer active:scale-95"
            title="Đóng menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Drawer Body Scrollable Container with larger padding and buttons */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* User Quick Rank Profile Card inside Drawer */}
          <div className="bg-gradient-to-r from-amber-950/40 via-neutral-900 to-emerald-950/40 border-2 border-amber-600/30 rounded-3xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-3 min-w-0">
              <div className="shrink-0 relative">
                <RankInsignia tier={currentTier.id} size="sm" showGlow animate />
                <span className="absolute -bottom-1 -right-1 text-sm bg-neutral-950 border border-neutral-700 rounded-full w-5 h-5 flex items-center justify-center shadow">
                  {profile.avatar || '🐱'}
                </span>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-sm font-black text-white truncate">{profile.studentName || 'Bé Tập Viết'}</span>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-500/25 text-amber-300 border border-amber-500/40 whitespace-nowrap">
                    Rank {currentTier.titleVi}
                  </span>
                </div>
                <div className="text-xs text-neutral-300 flex items-center gap-2 mt-1">
                  <span className="text-emerald-400 font-semibold text-[11px] truncate">
                    {AGE_GROUPS[profile.ageGroup || 'grade1']?.title} ({AGE_GROUPS[profile.ageGroup || 'grade1']?.ageRange})
                  </span>
                  <span>•</span>
                  <span className="font-mono text-amber-400 font-bold">{profile.totalExp} EXP</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
              {onOpenProfileModal && (
                <button
                  id="menu-btn-open-profile-modal"
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenProfileModal();
                  }}
                  className="px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-600 text-neutral-200 text-xs font-bold transition cursor-pointer active:scale-95"
                >
                  Đổi Lứa Tuổi & Tên
                </button>
              )}
              <button
                id="menu-btn-open-leaderboard"
                onClick={() => handleNavigate('leaderboard')}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:brightness-110 text-neutral-950 text-xs font-black transition cursor-pointer active:scale-95 shadow-md flex items-center gap-1"
              >
                <ShieldCheck className="w-3.5 h-3.5" /> Bảng Rank
              </button>
            </div>
          </div>

          {/* Section 1: All Modes with big cards */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5">
                <span>🎯</span> Bé muốn luyện tập kiểu nào?
              </h3>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/15 px-2.5 py-1 rounded-full border border-emerald-500/30">
                {navItems.length} chức năng
              </span>
            </div>

            <div className="space-y-3">
              {navItems.map((item) => {
                const isActive = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    id={`menu-mode-${item.id}`}
                    onClick={() => handleNavigate(item.id)}
                    className={`w-full p-4 rounded-2xl border-2 transition-all flex items-start gap-3.5 text-left cursor-pointer active:scale-[0.98] ${
                      isActive
                        ? 'bg-neutral-800/95 border-emerald-400 ring-2 ring-emerald-400/30 shadow-xl'
                        : 'bg-neutral-850 hover:bg-neutral-800 border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 text-2xl bg-neutral-900 border border-neutral-700">
                      {item.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 flex-wrap">
                        <span className="text-base sm:text-lg font-bold text-white flex items-center gap-1.5">
                          {item.label}
                        </span>
                        {item.badge && (
                          <span className="text-xs font-bold text-emerald-300 bg-emerald-500/25 px-2 py-0.5 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-neutral-300 mt-1 leading-relaxed">
                        {item.desc}
                      </p>
                      {isActive && (
                        <div className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/15 px-2.5 py-1 rounded-lg">
                          <Check className="w-3.5 h-3.5" /> Đang mở bài này
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Device Mode Switcher - Big friendly buttons */}
          {onSelectDeviceMode && (
            <div className="pt-2">
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <span>📱</span> Chế độ màn hình
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  id="menu-device-mobile"
                  onClick={() => onSelectDeviceMode('mobile')}
                  className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition text-center cursor-pointer active:scale-95 ${
                    deviceMode === 'mobile'
                      ? 'bg-cyan-500/25 border-cyan-400 text-white font-bold shadow-md'
                      : 'bg-neutral-850 hover:bg-neutral-800 border-neutral-800 text-neutral-300'
                  }`}
                >
                  <Smartphone className="w-7 h-7 text-cyan-400" />
                  <span className="text-sm font-bold">Điện thoại</span>
                  <span className="text-xs text-neutral-400">Nút to dễ bấm</span>
                </button>

                <button
                  id="menu-device-desktop"
                  onClick={() => onSelectDeviceMode('desktop')}
                  className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition text-center cursor-pointer active:scale-95 ${
                    deviceMode === 'desktop'
                      ? 'bg-indigo-500/25 border-indigo-400 text-white font-bold shadow-md'
                      : 'bg-neutral-850 hover:bg-neutral-800 border-neutral-800 text-neutral-300'
                  }`}
                >
                  <Laptop className="w-7 h-7 text-indigo-400" />
                  <span className="text-sm font-bold">Máy tính / iPad</span>
                  <span className="text-xs text-neutral-400">Xem màn rộng</span>
                </button>
              </div>
            </div>
          )}

          {/* Section 3: Languages - Big buttons */}
          <div className="pt-2">
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <span>🌏</span> Ngôn ngữ học chữ
            </h3>
            <div className="grid grid-cols-2 gap-2.5">
              {languages.map((l) => (
                <button
                  key={l.code}
                  id={`menu-lang-${l.code}`}
                  onClick={() => onSelectLanguage(l.code)}
                  className={`p-3.5 rounded-2xl border-2 flex items-center gap-2.5 transition text-sm cursor-pointer active:scale-95 ${
                    currentLanguage === l.code
                      ? 'bg-neutral-800 border-cyan-400 text-white font-bold shadow-md'
                      : 'bg-neutral-850 hover:bg-neutral-800 border-neutral-800 text-neutral-300'
                  }`}
                >
                  <span className="text-2xl">{l.flag}</span>
                  <span className="font-semibold">{l.label}</span>
                  {currentLanguage === l.code && <Check className="w-4 h-4 text-cyan-400 ml-auto shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          {/* Section 4: Big Guide Button */}
          <div className="pt-3">
            <button
              id="menu-open-guide-button"
              onClick={() => {
                setIsMenuOpen(false);
                onOpenGuide();
              }}
              className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 hover:from-amber-500/30 hover:to-orange-500/30 text-amber-300 hover:text-white border-2 border-amber-500/40 font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 transition cursor-pointer active:scale-98 shadow-lg"
            >
              <HelpCircle className="w-5 h-5 text-amber-400" />
              <span>📖 Xem hướng dẫn cho bé & phụ huynh</span>
            </button>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-950 text-center shrink-0">
          <p className="text-xs sm:text-sm text-neutral-400">
            Luyện chữ AR • Viết bút thật trên giấy thật ✍️
          </p>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <header className="w-full bg-neutral-900/95 backdrop-blur-md border-b border-neutral-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-3">
        {/* Brand Logo & Current View Badge (Enlarged on mobile) */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-amber-400 via-emerald-400 to-cyan-400 p-0.5 shadow-lg shadow-emerald-950/40 flex items-center justify-center text-neutral-950 font-black shrink-0">
            <div className="w-full h-full bg-neutral-950 rounded-2xl flex items-center justify-center text-xl sm:text-2xl">
              ✏️
            </div>
          </div>

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className="text-base sm:text-xl font-black text-white tracking-tight truncate">
                Luyện chữ AR
              </h1>
              <span className="hidden sm:inline-block text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Cho bé
              </span>
            </div>

            {/* Active view indicator button - tapping opens Menu */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className={`flex items-center gap-1 px-2.5 py-0.5 sm:py-1 rounded-full border text-xs sm:text-sm font-bold transition hover:brightness-110 cursor-pointer max-w-[170px] sm:max-w-none truncate ${activeItem.colorClass}`}
              title="Nhấn để mở Menu đổi bài luyện viết"
            >
              <span className="text-xs sm:text-sm">{activeItem.emoji}</span>
              <span className="truncate">{activeItem.shortLabel}</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-80 shrink-0" />
            </button>
          </div>
        </div>


        {/* Right Actions: Large, Easy-to-tap Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Learner Name & Age Group Button */}
          {onOpenProfileModal && (
            <button
              id="header-profile-btn"
              onClick={onOpenProfileModal}
              className="h-10 sm:h-12 px-2 sm:px-3 rounded-2xl bg-neutral-850 hover:bg-neutral-800 border-2 border-neutral-700/80 hover:border-amber-400/80 text-white flex items-center gap-1.5 sm:gap-2 transition cursor-pointer active:scale-95 shadow-sm"
              title="Đổi tên người học hoặc lứa tuổi rèn chữ"
            >
              <span className="text-lg sm:text-xl shrink-0">{profile.avatar || '🐱'}</span>
              <div className="flex flex-col items-start text-left leading-tight hidden md:flex">
                <span className="text-xs font-black text-white max-w-[100px] truncate">
                  {profile.studentName || 'Bé Tập Viết'}
                </span>
                <span className="text-[10px] font-semibold text-emerald-400 truncate max-w-[100px]">
                  {AGE_GROUPS[profile.ageGroup || 'grade1']?.ageRange || 'Lớp 1'}
                </span>
              </div>
            </button>
          )}

          {/* Quick Rank Button */}
          <button
            id="header-rank-btn"
            onClick={() => onSelectView('leaderboard')}
            className="h-10 sm:h-12 px-2 sm:px-3 rounded-2xl bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-amber-500/15 border-2 border-amber-500/40 hover:border-amber-400 text-amber-300 flex items-center gap-1.5 sm:gap-2 transition cursor-pointer active:scale-95 shadow-sm"
            title="Xem Cấp bậc Rank & Huy hiệu của bé"
          >
            <div className="shrink-0 flex items-center justify-center">
              <RankInsignia tier={currentTier.id} size="xs" showGlow />
            </div>
            <div className="flex flex-col items-start text-left leading-tight hidden xs:flex">
              <span className="text-[10px] uppercase font-mono font-bold text-amber-400 tracking-wider">
                {currentTier.titleVi}
              </span>
              <span className="text-xs font-black text-white">
                {profile.totalExp} EXP
              </span>
            </div>
          </button>

          {/* ASMR Pen Scratch Toggle */}
          <button
            id="header-asmr-toggle-btn"
            onClick={handleToggleAsmr}
            className={`h-10 sm:h-12 px-2.5 sm:px-3 rounded-2xl border-2 flex items-center gap-1.5 transition cursor-pointer active:scale-95 shadow-sm text-xs font-bold ${
              isAsmrPlaying
                ? 'bg-purple-500/25 border-purple-400 text-purple-200 animate-pulse'
                : 'bg-neutral-850 hover:bg-neutral-800 border-neutral-700 text-neutral-300'
            }`}
            title={isAsmrPlaying ? 'Tắt âm thanh ngòi bút sột soạt ASMR' : 'Bật âm thanh ngòi bút mực ASMR thư giãn khi viết'}
          >
            {isAsmrPlaying ? (
              <Volume2 className="w-4 h-4 text-purple-400 shrink-0" />
            ) : (
              <VolumeX className="w-4 h-4 text-neutral-400 shrink-0" />
            )}
            <span className="hidden lg:inline">Bút ASMR</span>
          </button>

          {/* Eye Care Timer Button */}
          {onOpenEyeTimer && (
            <button
              id="header-eye-care-btn"
              onClick={onOpenEyeTimer}
              className="h-10 sm:h-12 px-2.5 sm:px-3 rounded-2xl bg-cyan-950/60 hover:bg-cyan-900/60 border-2 border-cyan-700/50 hover:border-cyan-500 text-cyan-300 flex items-center gap-1.5 transition cursor-pointer active:scale-95 shadow-sm text-xs font-bold"
              title="Đồng hồ bảo vệ mắt 20-20-20 cho bé"
            >
              <Eye className="w-4 h-4 text-cyan-400 shrink-0" />
              <span className="hidden xl:inline">Bảo vệ mắt</span>
            </button>
          )}

          {/* Validation Matrix for Judging Panel (BGK) */}
          {onOpenValidationModal && (
            <button
              id="header-validation-matrix-btn"
              onClick={onOpenValidationModal}
              className="h-10 sm:h-12 px-2.5 sm:px-3 rounded-2xl bg-gradient-to-r from-indigo-950/70 via-purple-950/70 to-indigo-950/70 hover:brightness-110 border-2 border-indigo-600/50 text-indigo-300 flex items-center gap-1.5 transition cursor-pointer active:scale-95 shadow-sm text-xs font-bold"
              title="Báo cáo thực nghiệm & Ma trận đánh giá (Ban Giám Khảo)"
            >
              <span>📊</span>
              <span className="hidden lg:inline">Báo cáo BGK</span>
            </button>
          )}

          {/* Language Selector Dropdown on Header (VN VI, EN, JA, ZH) */}
          <div className="relative" ref={langDropdownRef}>
            <button
              id="header-lang-selector-btn"
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className="h-10 sm:h-12 px-3 sm:px-3.5 rounded-2xl bg-neutral-850 hover:bg-neutral-800 border-2 border-neutral-700 hover:border-neutral-600 text-neutral-200 flex items-center gap-1.5 text-xs sm:text-sm font-bold transition cursor-pointer active:scale-95 shadow-sm"
              title="Chọn ngôn ngữ luyện chữ"
            >
              <span className="text-base sm:text-lg">{currentLangObj.flag}</span>
              <span className="font-black text-white tracking-wide">{currentLangObj.code.toUpperCase()}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-neutral-400 transition-transform ${isLangDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isLangDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-neutral-900 border-2 border-neutral-700 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1 text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                  Chọn ngôn ngữ
                </div>
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      onSelectLanguage(l.code);
                      setIsLangDropdownOpen(false);
                    }}
                    className={`w-full px-3.5 py-2.5 flex items-center gap-2.5 text-xs sm:text-sm text-left hover:bg-neutral-800 transition cursor-pointer ${
                      currentLanguage === l.code ? 'text-emerald-400 font-bold bg-neutral-800/60' : 'text-neutral-200'
                    }`}
                  >
                    <span className="text-lg">{l.flag}</span>
                    <span className="flex-1">{l.label}</span>
                    {currentLanguage === l.code && <Check className="w-4 h-4 text-emerald-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Guide Button */}
          <button
            id="header-setup-guide-btn"
            onClick={onOpenGuide}
            className="h-10 sm:h-12 px-3 sm:px-4 rounded-2xl bg-neutral-800/90 hover:bg-neutral-750 text-neutral-200 hover:text-white border border-neutral-700 transition flex items-center gap-1.5 text-xs sm:text-sm font-bold cursor-pointer active:scale-95"
            title="Xem hướng dẫn luyện chữ cho bé"
          >
            <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
            <span className="hidden sm:inline">Hướng dẫn</span>
          </button>

          {/* Main Primary MENU Button - Large and highly visible */}
          <button
            id="header-open-menu-btn"
            onClick={() => setIsMenuOpen(true)}
            className="h-10 sm:h-12 px-4 sm:px-5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-neutral-950 font-black text-xs sm:text-sm transition flex items-center gap-2 shadow-lg shadow-emerald-950/40 active:scale-95 cursor-pointer"
            title="Mở toàn bộ Menu chức năng & cài đặt"
          >
            <Menu className="w-5 h-5 text-neutral-950" />
            <span className="font-extrabold tracking-wide uppercase">Menu</span>
          </button>
        </div>
      </div>

      {/* Render Slide-over Drawer into document.body using Portal */}
      {drawerContent && createPortal(drawerContent, document.body)}
    </header>
  );
};
