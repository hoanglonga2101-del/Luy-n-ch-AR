export type LanguageCode = 'vi' | 'en' | 'ja' | 'zh';

export type DeviceMode = 'mobile' | 'desktop';

export type GridType = 'oly_vi' | 'four_line_en' | 'calligraphy_55' | 'mizi_zh' | 'tian_zh' | 'plain';

export type ProjectionStyle = 'solid_ink' | 'neon_ar' | 'red_guide' | 'dotted_trace' | 'blueprint';

export interface WorksheetConfig {
  title: string;
  subtitle: string;
  studentName: string;
  className: string;
  date: string;
  gridType: GridType;
  fontId: string;
  fontSizeMm: number;
  lineSpacingMm: number;
  tracingMode: 'dotted' | 'faded' | 'first_char' | 'blank_grid';
  showStrokeNumbers: boolean;
  showGuidelines: boolean;
  slantAngle: number; // e.g. 55 or 75
}

export interface DetectedStrokeError {
  error_type: string; // e.g., 'SAI_HUONG_NET' | 'NHO_SO_VOI_O_LI' | 'LECH_DIEM_DUNG'
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  instruction: string;
}

export interface LearningPathRecommendation {
  focus_area: string; // e.g., 'Nét cong kín', 'Nét khuyết trên'
  suggested_next_exercise: string;
}

export interface StrictEvaluationMetrics {
  overall_score: number;
  trajectory_score: number;
  start_end_accuracy: number;
  proportion_score: number;
  smoothness_score?: number;
}

export interface StrictHandwritingEvaluation {
  target_character: string;
  stroke_index: number;
  status: 'PASS' | 'NEEDS_IMPROVEMENT' | 'FAIL';
  metrics: StrictEvaluationMetrics;
  detected_errors: DetectedStrokeError[];
  learning_path_recommendation: LearningPathRecommendation;
}

export interface AIFeedbackResult {
  overallScore: number; // 0 - 100
  grade: string; // e.g. "Rất tốt (Xuất sắc)", "Khá", "Cần rèn thêm"
  slantAnalysis: {
    score: number;
    feedback: string;
    detectedAngle: string;
  };
  sizeConsistency: {
    score: number;
    feedback: string;
  };
  spacingAndAlignment: {
    score: number;
    feedback: string;
  };
  strokeQuality: {
    score: number;
    feedback: string;
  };
  strengths: string[];
  improvements: string[];
  encouragement: string;
  strictEvaluation?: StrictHandwritingEvaluation;
}

export interface StrokePath {
  id: number;
  d: string; // SVG path
  label: string; // e.g. "Nét 1: Nét sổ thẳng" or "1: 横 (Héng)"
  startPoint: { x: number; y: number };
  direction?: 'horizontal' | 'vertical' | 'slanted_left' | 'slanted_right' | 'curve' | 'hook';
}

export interface CharacterItem {
  id: string;
  char: string;
  upperChar?: string;
  lowerChar?: string;
  name: string;
  language: LanguageCode;
  category: string; // 'letters' | 'accents' | 'hiragana' | 'katakana' | 'uppercase' | 'lowercase'
  reading?: string; // Pinyin / Romaji / Âm đọc
  vietnameseMeaning?: string;
  strokesCount: number;
  upperStrokesCount?: number;
  lowerStrokesCount?: number;
  strokes?: StrokePath[];
  upperStrokes?: StrokePath[];
  lowerStrokes?: StrokePath[];
  tips: string;
  upperTips?: string;
  lowerTips?: string;
  gridType: GridType;
  examples?: string[];
}

export interface PracticeSentence {
  id: string;
  text: string;
  language: LanguageCode;
  reading?: string;
  translation?: string;
  tips?: string;
  gridType: GridType;
  fontFamily?: string;
  fontId?: string;
  authorOrSource?: string;
}

export interface ARProjectionSettings {
  opacity: number; // 0.1 to 1.0
  scale: number; // 0.5 to 3.0
  offsetX: number; // in pixels
  offsetY: number; // in pixels
  rotation: number; // -45 to 45 degrees
  gridType: GridType;
  showGrid: boolean;
  style: ProjectionStyle;
  isLocked: boolean;
  isMirrored: boolean;
  showStrokeNumbers: boolean;
  currentStrokeStep: number; // 0 = all strokes
  animationSpeed: number; // 0.5, 1, 1.5, 2
}

export interface HandwritingFeedback {
  overallScore: number;
  grade: string;
  slantAnalysis: {
    score: number;
    detectedAngle?: string;
    feedback: string;
  };
  sizeConsistency: {
    score: number;
    feedback: string;
  };
  spacingAndAlignment: {
    score: number;
    feedback: string;
  };
  strokeQuality: {
    score: number;
    feedback: string;
  };
  strengths: string[];
  improvements: string[];
  encouragement?: string;
  strictEvaluation?: StrictHandwritingEvaluation;
}

// Gamification & Ranking Types
export type RankTierKey = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'master';

export interface RankTier {
  id: RankTierKey;
  name: string;
  titleVi: string;
  icon: string; // emoji or icon name
  colorClass: string;
  badgeBg: string;
  minExp: number;
  maxExp: number;
  perkDescription: string;
}

export interface LearnerBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  category: 'practice' | 'streak' | 'quality' | 'explorer';
  targetExp: number;
}

export interface SavedReviewItem {
  id: string;
  date: string;
  sampleText: string;
  score: number;
  grade: string;
  imageUrl?: string;
  strengths: string[];
  improvements: string[];
  expGained: number;
}

export type AgeGroupKey = 'preschool' | 'grade1' | 'grade2_5' | 'teen_adult';

export interface AgeGroupConfig {
  id: AgeGroupKey;
  title: string;
  ageRange: string;
  icon: string;
  badgeColor: string;
  description: string;
  focusText: string;
  recommendedView: 'alphabet' | 'sentences' | 'worksheet' | 'canvas';
  defaultGrid: GridType;
}

export interface UserLearnerProfile {
  studentName: string;
  avatar: string; // emoji or avatar identifier
  ageGroup: AgeGroupKey;
  hasCompletedOnboarding: boolean;
  totalExp: number;
  streakDays: number;
  lastPracticeDate: string;
  dailyCanvasExpGained?: number;
  dailyCanvasDate?: string;
  lastPrintDate?: string;
  totalPracticeSessions: number;
  worksheetsPrintedCount: number;
  arMinutesCount: number;
  unlockedBadgeIds: string[];
  savedReviews: SavedReviewItem[];
}

export interface LeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  avatar: string;
  schoolOrCity: string;
  tier: RankTierKey;
  totalExp: number;
  streakDays: number;
  recentScore: number;
  isCurrentUser?: boolean;
}
