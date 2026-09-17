import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Award, 
  Flame, 
  Sparkles, 
  TrendingUp, 
  User, 
  Calendar, 
  Star, 
  ChevronRight, 
  CheckCircle2, 
  Zap, 
  Edit3, 
  Check, 
  Share2,
  RefreshCw,
  BookOpen,
  Camera,
  Printer
} from 'lucide-react';
import { 
  getStoredProfile, 
  saveProfile, 
  getRankTier, 
  getNextRankTier, 
  RANK_TIERS, 
  ALL_BADGES, 
  DEFAULT_AVATARS,
  AGE_GROUPS
} from '../utils/gamification';
import { 
  UserLearnerProfile, 
  RankTierKey 
} from '../types';
import { playFanfareSound } from '../utils/audio';
import { RankInsignia } from './RankInsignia';

interface LeaderboardAndRankProps {
  onNavigateToView?: (view: 'worksheet' | 'lightbox' | 'ai_feedback' | 'ar') => void;
  onOpenProfileModal?: () => void;
}

export const LeaderboardAndRank: React.FC<LeaderboardAndRankProps> = ({
  onNavigateToView,
  onOpenProfileModal,
}) => {
  const [profile, setProfile] = useState<UserLearnerProfile>(getStoredProfile);
  const [activeTab, setActiveTab] = useState<'rank_tiers' | 'badges' | 'history'>('rank_tiers');
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(profile.studentName);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  // Sync profile when custom event fires
  useEffect(() => {
    const handleProfileUpdate = (e: any) => {
      if (e.detail) {
        setProfile(e.detail);
      }
    };
    window.addEventListener('learner_profile_updated', handleProfileUpdate);
    return () => window.removeEventListener('learner_profile_updated', handleProfileUpdate);
  }, []);

  const currentTier = getRankTier(profile.totalExp);
  const nextTier = getNextRankTier(currentTier.id);

  // Calculate progress percent to next rank
  let progressPercent = 100;
  let expNeededForNext = 0;
  if (nextTier) {
    const tierRange = nextTier.minExp - currentTier.minExp;
    const userProgressInTier = profile.totalExp - currentTier.minExp;
    progressPercent = Math.min(Math.max(Math.round((userProgressInTier / tierRange) * 100), 5), 100);
    expNeededForNext = Math.max(nextTier.minExp - profile.totalExp, 0);
  }

  const handleSaveName = () => {
    if (tempName.trim()) {
      const updated = { ...profile, studentName: tempName.trim() };
      saveProfile(updated);
      setProfile(updated);
    }
    setIsEditingName(false);
  };

  const handleSelectAvatar = (avatarEmoji: string) => {
    const updated = { ...profile, avatar: avatarEmoji };
    saveProfile(updated);
    setProfile(updated);
    setShowAvatarPicker(false);
    playFanfareSound();
  };

  return (
    <div className="space-y-6">
      {/* Profile & Rank Highlight Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-850 p-5 sm:p-7 border border-neutral-800 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-60 h-60 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Avatar, Rank Crest & Info */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Avatar & Rank Insignia Group */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="relative">
                <button
                  onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-neutral-950 border-2 border-amber-500/50 flex items-center justify-center text-3xl sm:text-4xl shadow-xl hover:scale-105 transition cursor-pointer relative group"
                  title="Bấm để đổi linh thú đại diện"
                >
                  <span>{profile.avatar}</span>
                  <span className="absolute -bottom-1 -right-1 p-1 bg-amber-500 text-neutral-950 rounded-full text-[10px] font-bold">
                    <Edit3 className="w-3 h-3" />
                  </span>
                </button>

                {/* Avatar Selector Dropdown */}
                {showAvatarPicker && (
                  <div className="absolute top-24 left-0 z-30 bg-neutral-900 border border-neutral-700 p-3 rounded-2xl shadow-2xl grid grid-cols-4 gap-2 w-64 animate-in fade-in zoom-in-95">
                    {DEFAULT_AVATARS.map((av) => (
                      <button
                        key={av.id}
                        onClick={() => handleSelectAvatar(av.emoji)}
                        className="p-2 text-2xl hover:bg-neutral-800 rounded-xl transition cursor-pointer flex flex-col items-center"
                        title={av.name}
                      >
                        <span>{av.emoji}</span>
                        <span className="text-[9px] text-neutral-400 mt-1 truncate w-full text-center">
                          {av.name.split(' ')[0]}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 3D Military/Game Rank Crest Feature */}
              <div 
                className="flex flex-col items-center justify-center bg-gradient-to-b from-neutral-900 to-neutral-950 px-3 py-2 rounded-2xl border border-amber-500/30 shadow-lg shadow-black/60 relative group"
                title={`Cấp Bậc Rank: ${currentTier.titleVi}`}
              >
                <RankInsignia tier={currentTier.id} size="md" showGlow animate />
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 mt-1">
                  {currentTier.name}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                {isEditingName ? (
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      className="bg-neutral-950 border border-amber-400 rounded-xl px-2.5 py-1 text-sm font-bold text-white outline-none"
                      autoFocus
                    />
                    <button
                      onClick={handleSaveName}
                      className="p-1.5 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-white cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-black text-white">
                      {profile.studentName}
                    </h2>
                    <button
                      onClick={() => setIsEditingName(true)}
                      className="text-neutral-400 hover:text-amber-300 transition cursor-pointer"
                      title="Chỉnh sửa tên bé"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <span className={`text-xs font-bold px-3 py-1 rounded-full border flex items-center gap-1.5 ${currentTier.badgeBg}`}>
                  <RankInsignia tier={currentTier.id} size="xs" />
                  <span>{currentTier.titleVi}</span>
                </span>

                {/* Age Group Badge */}
                {profile.ageGroup && AGE_GROUPS[profile.ageGroup] && (
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${AGE_GROUPS[profile.ageGroup].badgeColor}`}>
                    <span>{AGE_GROUPS[profile.ageGroup].icon}</span>
                    <span>{AGE_GROUPS[profile.ageGroup].title} ({AGE_GROUPS[profile.ageGroup].ageRange})</span>
                  </span>
                )}

                {onOpenProfileModal && (
                  <button
                    onClick={onOpenProfileModal}
                    className="text-xs font-semibold px-2.5 py-1 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white border border-neutral-700 transition cursor-pointer"
                  >
                    Đổi lứa tuổi & Tên
                  </button>
                )}
              </div>

              <p className="text-xs text-neutral-400">
                {currentTier.perkDescription}
              </p>

              {/* Progress bar to next rank */}
              <div className="pt-2 w-full max-w-sm space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-amber-400 font-bold flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5" />
                    {profile.totalExp} EXP
                  </span>
                  {nextTier ? (
                    <span className="text-neutral-400">
                      Cần thêm <strong className="text-white">{expNeededForNext} EXP</strong> lên {nextTier.titleVi}
                    </span>
                  ) : (
                    <span className="text-emerald-400 font-bold">Đã đạt Đỉnh Cao Bậc Thầy Luyện Chữ!</span>
                  )}
                </div>
                <div className="w-full bg-neutral-950 h-2.5 rounded-full overflow-hidden border border-neutral-800">
                  <div 
                    className="bg-gradient-to-r from-amber-500 to-yellow-300 h-full rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stat Badges */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 w-full md:w-auto">
            <div className="flex-1 md:flex-initial p-3 rounded-2xl bg-neutral-950 border border-neutral-800 text-center min-w-[90px]">
              <div className="text-amber-400 text-lg sm:text-xl font-black flex items-center justify-center gap-1">
                <Flame className="w-5 h-5 text-orange-400" />
                <span>{profile.streakDays}</span>
              </div>
              <div className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">
                Chuỗi ngày rèn
              </div>
            </div>

            <div className="flex-1 md:flex-initial p-3 rounded-2xl bg-neutral-950 border border-neutral-800 text-center min-w-[90px] flex flex-col items-center justify-center">
              <RankInsignia tier={currentTier.id} size="xs" />
              <div className="text-[10px] text-amber-400 uppercase tracking-wider font-semibold mt-1">
                {currentTier.name}
              </div>
            </div>

            <div className="flex-1 md:flex-initial p-3 rounded-2xl bg-neutral-950 border border-neutral-800 text-center min-w-[90px]">
              <div className="text-purple-400 text-lg sm:text-xl font-black flex items-center justify-center gap-1">
                <Award className="w-5 h-5 text-purple-400" />
                <span>{profile.unlockedBadgeIds.length}</span>
              </div>
              <div className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">
                Huy hiệu
              </div>
            </div>

            <div className="flex-1 md:flex-initial p-3 rounded-2xl bg-neutral-950 border border-neutral-800 text-center min-w-[90px]">
              <div className="text-emerald-400 text-lg sm:text-xl font-black flex items-center justify-center gap-1">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                <span>{profile.savedReviews.length}</span>
              </div>
              <div className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">
                Bài đã chấm
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-800 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('rank_tiers')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'rank_tiers'
              ? 'bg-amber-600 text-white shadow-md'
              : 'bg-neutral-900 text-neutral-400 hover:text-white'
          }`}
        >
          <ShieldCheck className="w-4 h-4" /> 6 Cấp Bậc Rank & Tiến Trình
        </button>

        <button
          onClick={() => setActiveTab('badges')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'badges'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-neutral-900 text-neutral-400 hover:text-white'
          }`}
        >
          <Award className="w-4 h-4" /> Bộ sưu tập Huy hiệu ({profile.unlockedBadgeIds.length}/{ALL_BADGES.length})
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'history'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-neutral-900 text-neutral-400 hover:text-white'
          }`}
        >
          <TrendingUp className="w-4 h-4" /> Nhật ký tiến bộ ({profile.savedReviews.length} bài chấm)
        </button>
      </div>

      {/* Tab Content 1: 6 Rank Tiers */}
      {activeTab === 'rank_tiers' && (
        <div className="space-y-4">
          <div className="text-xs text-neutral-300 leading-relaxed bg-neutral-900 p-4 rounded-2xl border border-neutral-800">
            Hệ thống gồm <strong>6 Cấp Bậc Luyện Chữ</strong> từ thấp đến cao. Bé tích lũy điểm kinh nghiệm (EXP) bằng cách: 
            In bài viết A4 (+20 EXP), Kê máy đồ AR (+30 EXP), Chấm bài qua AI (+50 EXP), Giữ chuỗi rèn chữ mỗi ngày (+40 EXP) và Tập thể dục bảo vệ mắt 20-20-20 (+30 EXP).
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {Object.values(RANK_TIERS).map((tier) => {
              const isCurrent = currentTier.id === tier.id;
              const isUnlocked = profile.totalExp >= tier.minExp;

              return (
                <div
                  key={tier.id}
                  className={`p-5 rounded-3xl border transition flex flex-col justify-between items-center text-center relative overflow-hidden ${
                    isCurrent
                      ? 'bg-gradient-to-b from-amber-500/20 via-neutral-900 to-neutral-950 border-amber-400 shadow-2xl shadow-amber-950/60 ring-2 ring-amber-400/80 scale-[1.02]'
                      : isUnlocked
                      ? 'bg-gradient-to-b from-neutral-850 to-neutral-950 border-neutral-750 hover:border-neutral-600 shadow-lg'
                      : 'bg-neutral-950/70 border-neutral-850/80 opacity-60'
                  }`}
                >
                  {/* Status Badge Top Right */}
                  <div className="w-full flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-bold">
                      {tier.name}
                    </span>
                    {isCurrent ? (
                      <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-amber-500 text-neutral-950 shadow-md">
                        HẠNG HIỆN TẠI
                      </span>
                    ) : isUnlocked ? (
                      <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Đã đạt
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-neutral-500 bg-neutral-900 px-2 py-0.5 rounded-full border border-neutral-800">
                        Cần {tier.minExp} EXP
                      </span>
                    )}
                  </div>

                  {/* 3D Game Insignia Crest */}
                  <div className="my-2 py-2 flex items-center justify-center">
                    <RankInsignia 
                      tier={tier.id} 
                      size="lg" 
                      showGlow={isCurrent} 
                      animate={isCurrent} 
                    />
                  </div>

                  {/* Title & EXP */}
                  <div className="w-full space-y-1 mt-2 pt-2 border-t border-neutral-800/80">
                    <h4 className="text-base font-black text-white">{tier.titleVi}</h4>
                    <p className="text-xs text-amber-400 font-bold font-mono">
                      {tier.minExp} - {tier.maxExp === 99999 ? '∞' : tier.maxExp} EXP
                    </p>
                    <p className="text-xs text-neutral-300 leading-relaxed pt-1">
                      {tier.perkDescription}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab Content 3: Badges Collection */}
      {activeTab === 'badges' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {ALL_BADGES.map((b) => {
              const isUnlocked = profile.unlockedBadgeIds.includes(b.id);

              return (
                <div
                  key={b.id}
                  className={`p-4 rounded-3xl border transition flex flex-col justify-between ${
                    isUnlocked
                      ? 'bg-neutral-900 border-purple-500/40 shadow-lg shadow-purple-950/30'
                      : 'bg-neutral-950 border-neutral-800/80 opacity-50 grayscale'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-3xl">{b.icon}</div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        isUnlocked 
                          ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                          : 'bg-neutral-800 text-neutral-400 border-neutral-700'
                      }`}>
                        {isUnlocked ? 'Đã nhận ⭐' : `+${b.targetExp} EXP`}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white">{b.title}</h4>
                      <p className="text-[11px] text-neutral-400 mt-1 leading-relaxed">
                        {b.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab Content 4: Progress Journal & History */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-xs text-neutral-400">
              Lưu trữ toàn bộ các bài viết tay bé đã chụp ảnh nhờ cô giáo AI thẩm định:
            </div>
            {onNavigateToView && (
              <button
                onClick={() => onNavigateToView('ai_feedback')}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition cursor-pointer"
              >
                + Chấm bài mới ngay
              </button>
            )}
          </div>

          {profile.savedReviews.length === 0 ? (
            <div className="text-center py-12 bg-neutral-900 border border-neutral-800 rounded-3xl space-y-3">
              <div className="text-4xl">📝</div>
              <h4 className="text-sm font-bold text-white">Chưa có bài viết nào được chấm</h4>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                Bé hãy viết một bài trên vở ô ly rồi vào mục <strong>Chấm điểm AI</strong> để chụp ảnh bài nhé!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {profile.savedReviews.map((rev) => (
                <div 
                  key={rev.id}
                  className="p-4 bg-neutral-900 border border-neutral-800 rounded-3xl space-y-2 hover:border-neutral-700 transition"
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-xl bg-neutral-800 text-neutral-300">
                        {rev.date}
                      </span>
                      <span className="text-xs font-black text-emerald-400 bg-emerald-500/20 px-2.5 py-1 rounded-xl border border-emerald-500/30">
                        {rev.score} / 100 Điểm ⭐
                      </span>
                    </div>
                    <span className="text-xs font-bold text-amber-400">
                      +{rev.expGained} EXP
                    </span>
                  </div>

                  <div className="text-xs font-serif italic text-neutral-300 bg-neutral-950 p-2.5 rounded-2xl border border-neutral-850">
                    "{rev.sampleText}"
                  </div>

                  <div className="text-xs text-neutral-300 font-medium">
                    {rev.grade}
                  </div>

                  {rev.strengths && rev.strengths.length > 0 && (
                    <div className="text-[11px] text-emerald-400/90 space-y-0.5">
                      <strong>Điểm sáng:</strong> {rev.strengths.join(' • ')}
                    </div>
                  )}

                  {rev.improvements && rev.improvements.length > 0 && (
                    <div className="text-[11px] text-amber-400/90 space-y-0.5">
                      <strong>Lưu ý thêm:</strong> {rev.improvements.join(' • ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
