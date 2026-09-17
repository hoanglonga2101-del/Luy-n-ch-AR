import { 
  RankTier, 
  RankTierKey, 
  LearnerBadge, 
  UserLearnerProfile, 
  LeaderboardEntry,
  SavedReviewItem,
  AgeGroupKey,
  AgeGroupConfig
} from '../types';
import { playFanfareSound } from './audio';

export const AGE_GROUPS: Record<AgeGroupKey, AgeGroupConfig> = {
  preschool: {
    id: 'preschool',
    title: 'Mầm non & Tiền tiểu học',
    ageRange: '4 - 5 tuổi',
    icon: '🐣',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    description: 'Làm quen cầm bút, tô các nét cơ bản, nhận diện chữ cái to rõ ràng.',
    focusText: 'Nét sổ, nét ngang, nét xiên, nét móc & chữ cái mẫu to',
    recommendedView: 'alphabet',
    defaultGrid: 'oly_vi',
  },
  grade1: {
    id: 'grade1',
    title: 'Tiểu học Lớp 1',
    ageRange: '6 - 7 tuổi',
    icon: '🎒',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    description: 'Tập viết bảng chữ cái Tiếng Việt, chữ ghép, thanh dấu chuẩn Bộ Giáo Dục.',
    focusText: 'Bảng chữ cái mẫu, chữ ghép (ch, kh, ng, nh, th, tr) & số 0-9',
    recommendedView: 'alphabet',
    defaultGrid: 'oly_vi',
  },
  grade2_5: {
    id: 'grade2_5',
    title: 'Tiểu học Lớp 2 - 5',
    ageRange: '7 - 10 tuổi',
    icon: '📘',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    description: 'Luyện viết câu ca dao, đoạn thơ, rèn chữ hoa chuẩn và giữ đều khoảng cách.',
    focusText: 'Ca dao tục ngữ, thơ 4 chữ/5 chữ, chữ hoa mẫu giáo dục',
    recommendedView: 'sentences',
    defaultGrid: 'oly_vi',
  },
  teen_adult: {
    id: 'teen_adult',
    title: 'Thiếu niên & Người lớn',
    ageRange: '11+ tuổi & Người đi làm',
    icon: '🖋️',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    description: 'Rèn chữ nghệ thuật, nét thanh nét đậm, chữ nghiêng Calligraphy và danh ngôn.',
    focusText: 'Chữ nghiêng thanh đậm, chữ hoa sáng tạo & danh ngôn truyền cảm hứng',
    recommendedView: 'worksheet',
    defaultGrid: 'calligraphy_55',
  },
};

export const RANK_TIERS: Record<RankTierKey, RankTier> = {
  bronze: {
    id: 'bronze',
    name: 'Đồng',
    titleVi: 'Đồng Nét Chữ',
    icon: '🥉',
    colorClass: 'text-amber-600',
    badgeBg: 'bg-amber-600/20 border-amber-600/50 text-amber-300',
    minExp: 0,
    maxExp: 499,
    perkDescription: 'Bước đầu làm quen với cách cầm bút, giữ vở sạch và nắn nót từng nét',
  },
  silver: {
    id: 'silver',
    name: 'Bạc',
    titleVi: 'Bạc Kiên Trì',
    icon: '🥈',
    colorClass: 'text-slate-300',
    badgeBg: 'bg-slate-300/20 border-slate-300/50 text-slate-200',
    minExp: 500,
    maxExp: 1499,
    perkDescription: 'Cần ít nhất 2 tuần rèn luyện liên tục để đạt nét chữ đều đặn trên dòng kẻ',
  },
  gold: {
    id: 'gold',
    name: 'Vàng',
    titleVi: 'Vàng Khéo Léo',
    icon: '🥇',
    colorClass: 'text-yellow-400',
    badgeBg: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300',
    minExp: 1500,
    maxExp: 3499,
    perkDescription: 'Thuần thục kỹ thuật nét thanh nét đậm, khoảng cách chữ đạt chuẩn Bộ GD&ĐT',
  },
  platinum: {
    id: 'platinum',
    name: 'Bạch Kim',
    titleVi: 'Bạch Kim Bút Mài',
    icon: '💎',
    colorClass: 'text-cyan-400',
    badgeBg: 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300',
    minExp: 3500,
    maxExp: 6999,
    perkDescription: 'Tay viết vững vàng, nét chữ chuẩn mực tham gia kỳ thi Vở Sạch Chữ Đẹp cấp trường',
  },
  diamond: {
    id: 'diamond',
    name: 'Kim Cương',
    titleVi: 'Kim Cương Nét Ngọc',
    icon: '👑',
    colorClass: 'text-purple-400',
    badgeBg: 'bg-purple-500/20 border-purple-500/50 text-purple-300',
    minExp: 7000,
    maxExp: 12999,
    perkDescription: 'Đẳng cấp chữ viết xuất sắc cấp thành phố, rất khó đạt được và cần sự nhẫn nại cao',
  },
  master: {
    id: 'master',
    name: 'Trạng Nguyên',
    titleVi: 'Trạng Nguyên Vở Sạch Chữ Đẹp',
    icon: '🏆',
    colorClass: 'text-rose-400',
    badgeBg: 'bg-gradient-to-r from-rose-500/20 via-amber-500/20 to-yellow-500/20 border-amber-400 text-amber-300',
    minExp: 13000,
    maxExp: 99999,
    perkDescription: 'Danh hiệu cao quý nhất, biểu tượng của sự kiên trì vượt bậc và chữ viết nghệ thuật hoàn mỹ',
  },
};

export const ALL_BADGES: LearnerBadge[] = [
  {
    id: 'first_stroke',
    title: 'Nét Bút Đầu Tiên',
    description: 'Bé hoàn thành bài tập viết đầu tiên trên ứng dụng',
    icon: '🌱',
    unlocked: true,
    category: 'practice',
    targetExp: 20,
  },
  {
    id: 'streak_3',
    title: 'Chăm Chỉ 3 Ngày',
    description: 'Luyện chữ 3 ngày liên tiếp không ngắt quãng',
    icon: '🔥',
    unlocked: false,
    category: 'streak',
    targetExp: 50,
  },
  {
    id: 'streak_7',
    title: 'Chiến Thần Kiên Trì',
    description: 'Rèn chữ liên tục 7 ngày - thói quen tuyệt vời!',
    icon: '⚡',
    unlocked: false,
    category: 'streak',
    targetExp: 150,
  },
  {
    id: 'ai_90',
    title: 'Điểm 10 Cô Giáo AI',
    description: 'Chụp ảnh bài viết và đạt điểm từ 90 trở lên',
    icon: '⭐',
    unlocked: false,
    category: 'quality',
    targetExp: 100,
  },
  {
    id: 'print_master',
    title: 'Vở Sạch Đầy Trang',
    description: 'In bài tập viết A4 hoặc xuất tập vở 30 ngày',
    icon: '🖨️',
    unlocked: false,
    category: 'practice',
    targetExp: 40,
  },
  {
    id: 'ar_hero',
    title: 'Hiệp Sĩ AR',
    description: 'Kê máy soi nét chữ AR ảo lên trang giấy thật',
    icon: '📷',
    unlocked: false,
    category: 'explorer',
    targetExp: 50,
  },
  {
    id: 'eye_protector',
    title: 'Đôi Mắt Sáng Khỏe',
    description: 'Hoàn thành bài học cùng bộ đếm giờ bảo vệ mắt 20-20-20',
    icon: '👁️',
    unlocked: false,
    category: 'quality',
    targetExp: 30,
  },
  {
    id: 'asmr_fan',
    title: 'Nghệ Sĩ Lắng Nghe',
    description: 'Bật âm thanh ASMR sột soạt bút mực khi luyện tập',
    icon: '🎧',
    unlocked: false,
    category: 'explorer',
    targetExp: 20,
  },
];

const LOCAL_STORAGE_KEY = 'ar_handwriting_user_profile_v2';

export const DEFAULT_AVATARS = [
  { id: 'cat', emoji: '🐱', name: 'Mèo Chăm Chỉ' },
  { id: 'dog', emoji: '🐶', name: 'Cún Khéo Léo' },
  { id: 'panda', emoji: '🐼', name: 'Gấu Trúc Tỉ Mỉ' },
  { id: 'rabbit', emoji: '🐰', name: 'Thỏ Nhanh Nhẹn' },
  { id: 'dragon', emoji: '🐲', name: 'Rồng Con Thông Thái' },
  { id: 'tiger', emoji: '🐯', name: 'Hổ Dũng Cảm' },
  { id: 'fox', emoji: '🦊', name: 'Cáo Tinh Nghịch' },
  { id: 'bear', emoji: '🐻', name: 'Gấu Điềm Đạm' },
];

export function getRankTier(exp: number): RankTier {
  if (exp >= RANK_TIERS.master.minExp) return RANK_TIERS.master;
  if (exp >= RANK_TIERS.diamond.minExp) return RANK_TIERS.diamond;
  if (exp >= RANK_TIERS.platinum.minExp) return RANK_TIERS.platinum;
  if (exp >= RANK_TIERS.gold.minExp) return RANK_TIERS.gold;
  if (exp >= RANK_TIERS.silver.minExp) return RANK_TIERS.silver;
  return RANK_TIERS.bronze;
}

export function getCurrentTier(exp?: number): RankTier {
  if (typeof exp === 'number') return getRankTier(exp);
  const profile = getStoredProfile();
  return getRankTier(profile.totalExp);
}

export function getNextRankTier(currentTier: RankTierKey): RankTier | null {
  const order: RankTierKey[] = ['bronze', 'silver', 'gold', 'platinum', 'diamond', 'master'];
  const currentIndex = order.indexOf(currentTier);
  if (currentIndex < order.length - 1) {
    return RANK_TIERS[order[currentIndex + 1]];
  }
  return null;
}

export function getStoredProfile(): UserLearnerProfile {
  if (typeof window === 'undefined') {
    return createInitialProfile();
  }

  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...createInitialProfile(),
        ...parsed,
      };
    }
  } catch (err) {
    console.error('Error loading stored profile:', err);
  }

  const initial = createInitialProfile();
  saveProfile(initial);
  return initial;
}

function createInitialProfile(): UserLearnerProfile {
  return {
    studentName: 'Bé Tập Viết',
    avatar: '🐱',
    ageGroup: 'grade1',
    hasCompletedOnboarding: false,
    totalExp: 20, // Khởi đầu thực tế (chỉ đạt 20 EXP tương ứng Nét Bút Đầu Tiên)
    streakDays: 1,
    lastPracticeDate: new Date().toISOString().split('T')[0],
    dailyCanvasExpGained: 0,
    dailyCanvasDate: new Date().toISOString().split('T')[0],
    totalPracticeSessions: 1,
    worksheetsPrintedCount: 0,
    arMinutesCount: 0,
    unlockedBadgeIds: ['first_stroke'],
    savedReviews: [],
  };
}

export function updateUserProfile(updates: Partial<UserLearnerProfile>): UserLearnerProfile {
  const current = getStoredProfile();
  const updated: UserLearnerProfile = {
    ...current,
    ...updates,
  };
  saveProfile(updated);
  return updated;
}

export function saveProfile(profile: UserLearnerProfile) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(profile));
    // Dispatch window event so all UI components update in real-time
    window.dispatchEvent(new CustomEvent('learner_profile_updated', { detail: profile }));
  } catch (err) {
    console.error('Error saving profile:', err);
  }
}

// Add EXP with Hard-mode restrictions, Level-up and Badge checks
export function awardExp(
  amount: number, 
  reasonVi: string,
  options?: { isCanvas?: boolean; isPrint?: boolean }
): { 
  newProfile: UserLearnerProfile; 
  leveledUp: boolean; 
  newTier?: RankTier;
  newBadges: LearnerBadge[];
  actualExpAwarded: number;
} {
  const profile = getStoredProfile();
  const todayStr = new Date().toISOString().split('T')[0];

  let actualAward = amount;

  // 1. Strict Canvas Limit (Max 20 EXP/day for digital canvas to prevent spamming dots/clicks)
  if (options?.isCanvas) {
    const isNewDay = profile.dailyCanvasDate !== todayStr;
    const currentCanvasExp = isNewDay ? 0 : (profile.dailyCanvasExpGained || 0);
    const remainingAllowed = Math.max(0, 20 - currentCanvasExp);
    actualAward = Math.min(amount, remainingAllowed);
    
    if (actualAward <= 0) {
      return {
        newProfile: profile,
        leveledUp: false,
        newBadges: [],
        actualExpAwarded: 0,
      };
    }
  }

  // 2. Strict Print Limit (Only 5 EXP once per day for printing)
  if (options?.isPrint) {
    if (profile.lastPrintDate === todayStr) {
      actualAward = 0; // Already claimed print reward today
      return {
        newProfile: profile,
        leveledUp: false,
        newBadges: [],
        actualExpAwarded: 0,
      };
    }
    actualAward = 5;
  }

  const oldTier = getRankTier(profile.totalExp);
  const newExp = profile.totalExp + actualAward;
  const newTier = getRankTier(newExp);
  const leveledUp = newTier.id !== oldTier.id;

  // Check badges to unlock
  const newUnlockedIds = [...profile.unlockedBadgeIds];
  const newlyEarnedBadges: LearnerBadge[] = [];

  // Streak check
  let newStreak = profile.streakDays;
  if (profile.lastPracticeDate !== todayStr) {
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    if (profile.lastPracticeDate === yesterday) {
      newStreak += 1;
    } else {
      newStreak = 1;
    }
  }

  if (newStreak >= 3 && !newUnlockedIds.includes('streak_3')) {
    newUnlockedIds.push('streak_3');
    const b = ALL_BADGES.find(x => x.id === 'streak_3');
    if (b) newlyEarnedBadges.push(b);
  }
  if (newStreak >= 7 && !newUnlockedIds.includes('streak_7')) {
    newUnlockedIds.push('streak_7');
    const b = ALL_BADGES.find(x => x.id === 'streak_7');
    if (b) newlyEarnedBadges.push(b);
  }

  const updatedProfile: UserLearnerProfile = {
    ...profile,
    totalExp: newExp,
    streakDays: newStreak,
    lastPracticeDate: todayStr,
    totalPracticeSessions: profile.totalPracticeSessions + 1,
    unlockedBadgeIds: newUnlockedIds,
    dailyCanvasExpGained: options?.isCanvas 
      ? ((profile.dailyCanvasDate === todayStr ? (profile.dailyCanvasExpGained || 0) : 0) + actualAward)
      : profile.dailyCanvasExpGained,
    dailyCanvasDate: todayStr,
    lastPrintDate: options?.isPrint ? todayStr : profile.lastPrintDate,
  };

  saveProfile(updatedProfile);

  if (leveledUp) {
    playFanfareSound();
  }

  return {
    newProfile: updatedProfile,
    leveledUp,
    newTier: leveledUp ? newTier : undefined,
    newBadges: newlyEarnedBadges,
    actualExpAwarded: actualAward,
  };
}

// Unlock a specific badge
export function unlockBadge(badgeId: string): boolean {
  const profile = getStoredProfile();
  if (profile.unlockedBadgeIds.includes(badgeId)) return false;

  const badge = ALL_BADGES.find(b => b.id === badgeId);
  const updated = {
    ...profile,
    unlockedBadgeIds: [...profile.unlockedBadgeIds, badgeId],
    totalExp: profile.totalExp + (badge?.targetExp || 30),
  };
  saveProfile(updated);
  playFanfareSound();
  return true;
}

// Save an AI review session
export function saveReviewToHistory(review: Omit<SavedReviewItem, 'id' | 'date'>): SavedReviewItem {
  const profile = getStoredProfile();
  const newItem: SavedReviewItem = {
    ...review,
    id: 'rev_' + Date.now(),
    date: new Date().toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
  };

  // Check 90+ score badge
  const newBadgeIds = [...profile.unlockedBadgeIds];
  if (review.score >= 90 && !newBadgeIds.includes('ai_90')) {
    newBadgeIds.push('ai_90');
    playFanfareSound();
  }

  const updated: UserLearnerProfile = {
    ...profile,
    totalExp: profile.totalExp + review.expGained,
    savedReviews: [newItem, ...profile.savedReviews.slice(0, 19)], // keep last 20
    unlockedBadgeIds: newBadgeIds,
  };

  saveProfile(updated);
  return newItem;
}

// Mock National & Weekly Leaderboard with realistic classmates
export function getLeaderboard(
  scope: 'weekly' | 'monthly' | 'national' = 'weekly'
): LeaderboardEntry[] {
  const userProfile = getStoredProfile();
  const userTier = getRankTier(userProfile.totalExp);

  const basePeers: Omit<LeaderboardEntry, 'rank'>[] = [
    {
      id: 'peer-1',
      name: 'Bé Bảo An',
      avatar: '🐰',
      schoolOrCity: 'Trường TH Kim Đồng (Hà Nội)',
      tier: 'master',
      totalExp: scope === 'weekly' ? 980 : 4250,
      streakDays: 14,
      recentScore: 98,
    },
    {
      id: 'peer-2',
      name: 'Bé Minh Khôi',
      avatar: '🐼',
      schoolOrCity: 'Trường TH Nguyễn Huệ (TP.HCM)',
      tier: 'diamond',
      totalExp: scope === 'weekly' ? 840 : 3620,
      streakDays: 11,
      recentScore: 95,
    },
    {
      id: 'peer-3',
      name: 'Bé Tuệ Mẫn',
      avatar: '🦊',
      schoolOrCity: 'Trường TH Lê Quý Đôn (Đà Nẵng)',
      tier: 'diamond',
      totalExp: scope === 'weekly' ? 760 : 3150,
      streakDays: 9,
      recentScore: 94,
    },
    {
      id: 'peer-4',
      name: 'Bé Gia Hưng',
      avatar: '🐶',
      schoolOrCity: 'Trường TH Võ Thị Sáu (Hải Phòng)',
      tier: 'platinum',
      totalExp: scope === 'weekly' ? 620 : 2180,
      streakDays: 7,
      recentScore: 91,
    },
    {
      id: 'peer-5',
      name: 'Bé Linh Đan',
      avatar: '🐱',
      schoolOrCity: 'Trường TH Trần Quốc Toản (Cần Thơ)',
      tier: 'platinum',
      totalExp: scope === 'weekly' ? 510 : 1940,
      streakDays: 6,
      recentScore: 89,
    },
    {
      id: 'peer-6',
      name: 'Bé Hoàng Nam',
      avatar: '🐯',
      schoolOrCity: 'Trường TH Lý Tự Trọng (Huế)',
      tier: 'gold',
      totalExp: scope === 'weekly' ? 440 : 1150,
      streakDays: 5,
      recentScore: 88,
    },
    {
      id: 'peer-7',
      name: 'Bé Mai Chi',
      avatar: '🐻',
      schoolOrCity: 'Trường TH Vinschool (Bình Dương)',
      tier: 'gold',
      totalExp: scope === 'weekly' ? 380 : 920,
      streakDays: 4,
      recentScore: 86,
    },
    {
      id: 'peer-8',
      name: 'Bé Nhật Quang',
      avatar: '🐲',
      schoolOrCity: 'Trường TH Thăng Long (Quảng Ninh)',
      tier: 'silver',
      totalExp: scope === 'weekly' ? 290 : 580,
      streakDays: 3,
      recentScore: 84,
    },
    {
      id: 'peer-9',
      name: 'Bé Khánh Ngân',
      avatar: '🐰',
      schoolOrCity: 'Trường TH Chu Văn An (Nha Trang)',
      tier: 'silver',
      totalExp: scope === 'weekly' ? 210 : 490,
      streakDays: 3,
      recentScore: 82,
    },
  ];

  // User's own entry
  const userScoreWeekly = Math.min(userProfile.totalExp, Math.floor(userProfile.totalExp * 0.4) + 150);
  const userExpForScope = scope === 'weekly' ? userScoreWeekly : userProfile.totalExp;

  const userEntry: Omit<LeaderboardEntry, 'rank'> = {
    id: 'current-user-entry',
    name: userProfile.studentName + ' (Bạn)',
    avatar: userProfile.avatar,
    schoolOrCity: 'Lớp Vở Sạch Chữ Đẹp',
    tier: userTier.id,
    totalExp: userExpForScope,
    streakDays: userProfile.streakDays,
    recentScore: userProfile.savedReviews[0]?.score || 88,
    isCurrentUser: true,
  };

  const combined = [...basePeers, userEntry];

  // Sort by EXP descending
  combined.sort((a, b) => b.totalExp - a.totalExp);

  // Assign ranks
  return combined.map((item, index) => ({
    ...item,
    rank: index + 1,
  }));
}
