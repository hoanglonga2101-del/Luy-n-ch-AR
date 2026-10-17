import React, { useState, useEffect } from 'react';
import { 
  Header,
  AppViewMode 
} from './components/Header';
import { 
  AlphabetBrowser 
} from './components/AlphabetBrowser';
import { 
  SentenceCreator 
} from './components/SentenceCreator';
import { 
  DigitalCanvas 
} from './components/DigitalCanvas';
import { 
  ARViewfinder 
} from './components/ARViewfinder';
import { 
  WorksheetGenerator 
} from './components/WorksheetGenerator';
import { 
  ScreenLightbox 
} from './components/ScreenLightbox';
import { 
  HandwritingAIReview 
} from './components/HandwritingAIReview';
import { 
  SetupGuideModal 
} from './components/SetupGuideModal';
import { 
  CharacterDetailModal 
} from './components/CharacterDetailModal';
import {
  LeaderboardAndRank
} from './components/LeaderboardAndRank';
import {
  EyeProtectionTimer
} from './components/EyeProtectionTimer';
import {
  RankInsignia
} from './components/RankInsignia';
import {
  AgeAndProfileModal
} from './components/AgeAndProfileModal';
import {
  ValidationMatrixModal
} from './components/ValidationMatrixModal';
import { 
  LanguageCode, 
  DeviceMode,
  CharacterItem, 
  PracticeSentence, 
  GridType,
  UserLearnerProfile
} from './types';
import { SAMPLE_SENTENCES } from './data/sampleSentences';
import { getStoredProfile, AGE_GROUPS } from './utils/gamification';
import { Sparkles, Camera, BookOpen, PenTool, CheckCircle, ArrowRight, Printer, Sun, Award, Type, Trophy, User } from 'lucide-react';

export default function App() {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('vi');
  const [activeView, setActiveView] = useState<AppViewMode>('worksheet');
  const [isEyeTimerOpen, setIsEyeTimerOpen] = useState<boolean>(false);
  const [isValidationModalOpen, setIsValidationModalOpen] = useState<boolean>(false);
  const [profile, setProfile] = useState<UserLearnerProfile>(getStoredProfile);
  
  // First-time Age & Profile onboarding check
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        const p = getStoredProfile();
        return !p.hasCompletedOnboarding;
      } catch {
        return false;
      }
    }
    return false;
  });

  // Automatically show user guide when entering the app for the first time
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        const hasSeen = localStorage.getItem('ar_handwriting_guide_seen');
        const p = getStoredProfile();
        // If profile onboarding is showing, don't overlap with guide immediately
        return !hasSeen && p.hasCompletedOnboarding;
      } catch {
        return false;
      }
    }
    return false;
  });

  useEffect(() => {
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

  const handleCloseGuide = (dontShowAgain?: boolean) => {
    setIsGuideOpen(false);
    if (dontShowAgain && typeof window !== 'undefined') {
      try {
        localStorage.setItem('ar_handwriting_guide_seen', 'true');
      } catch {
        // ignore
      }
    }
  };
  const [inspectCharacter, setInspectCharacter] = useState<CharacterItem | null>(null);

  // Device mode preference: 'mobile' (phone) vs 'desktop' (computer/laptop)
  const [deviceMode, setDeviceMode] = useState<DeviceMode>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768 || 'ontouchstart' in window ? 'mobile' : 'desktop';
    }
    return 'mobile';
  });

  // Active item for AR or Canvas practice
  const defaultSentence = SAMPLE_SENTENCES.vi[0];
  const [activePracticeItem, setActivePracticeItem] = useState<{
    text: string;
    language: LanguageCode;
    reading?: string;
    translation?: string;
    tips?: string;
    gridType?: GridType;
    fontId?: string;
  }>({
    text: defaultSentence.text,
    language: 'vi',
    reading: defaultSentence.reading,
    translation: defaultSentence.translation,
    tips: defaultSentence.tips,
    gridType: defaultSentence.gridType,
    fontId: undefined,
  });

  // Action handlers
  const handleLaunchARForCharacter = (char: CharacterItem) => {
    setActivePracticeItem({
      text: char.char,
      language: char.language,
      reading: char.reading || char.name,
      translation: char.vietnameseMeaning,
      tips: char.tips,
      gridType: char.gridType,
      fontId: undefined,
    });
    setInspectCharacter(null);
    setActiveView('ar');
  };

  const handleLaunchCanvasForCharacter = (char: CharacterItem) => {
    setActivePracticeItem({
      text: char.char,
      language: char.language,
      reading: char.reading || char.name,
      translation: char.vietnameseMeaning,
      tips: char.tips,
      gridType: char.gridType,
      fontId: undefined,
    });
    setInspectCharacter(null);
    setActiveView('canvas');
  };

  const handleLaunchARForSentence = (sentence: PracticeSentence) => {
    setActivePracticeItem({
      text: sentence.text,
      language: sentence.language,
      reading: sentence.reading,
      translation: sentence.translation,
      tips: sentence.tips,
      gridType: sentence.gridType,
      fontId: sentence.fontId,
    });
    setActiveView('ar');
  };

  const handleLaunchCanvasForSentence = (sentence: PracticeSentence) => {
    setActivePracticeItem({
      text: sentence.text,
      language: sentence.language,
      reading: sentence.reading,
      translation: sentence.translation,
      tips: sentence.tips,
      gridType: sentence.gridType,
      fontId: sentence.fontId,
    });
    setActiveView('canvas');
  };

  const handleSelectLanguage = (lang: LanguageCode) => {
    setCurrentLanguage(lang);
    if (lang === 'zh' && activeView === 'alphabet') {
      setActiveView('sentences');
    }
  };

  // Full-screen Screen Lightbox Tracing Pad Mode
  if (activeView === 'lightbox') {
    return (
      <ScreenLightbox
        initialText={activePracticeItem.text}
        initialLanguage={activePracticeItem.language}
        initialFontId={activePracticeItem.fontId || 'great_vibes'}
        initialGridType={activePracticeItem.gridType || 'oly_vi'}
        onBackToMenu={() => setActiveView('worksheet')}
      />
    );
  }

  // Full-screen AR Mode View
  if (activeView === 'ar') {
    return (
      <div 
        className="w-full h-[100dvh] overflow-hidden bg-black text-white"
        style={{ height: '100dvh', maxHeight: '100dvh' }}
      >
        <ARViewfinder
          text={activePracticeItem.text}
          language={activePracticeItem.language}
          reading={activePracticeItem.reading}
          translation={activePracticeItem.translation}
          tips={activePracticeItem.tips}
          fontId={activePracticeItem.fontId}
          deviceMode={deviceMode}
          onSelectDeviceMode={setDeviceMode}
          onOpenGuide={() => setIsGuideOpen(true)}
          onBackToMenu={() => setActiveView('worksheet')}
        />

        {/* Stand setup guide modal */}
        <SetupGuideModal
          isOpen={isGuideOpen}
          onClose={() => setIsGuideOpen(false)}
          onNavigateToView={(view) => setActiveView(view)}
        />
      </div>
    );
  }

  return (
    <div 
      className="min-h-[100dvh] bg-neutral-950 text-neutral-100 flex flex-col font-sans"
      style={{ minHeight: '100dvh' }}
    >
      {/* Navigation Header */}
      <Header
        currentLanguage={currentLanguage}
        onSelectLanguage={handleSelectLanguage}
        activeView={activeView}
        onSelectView={setActiveView}
        onOpenGuide={() => setIsGuideOpen(true)}
        deviceMode={deviceMode}
        onSelectDeviceMode={setDeviceMode}
        onOpenEyeTimer={() => setIsEyeTimerOpen(true)}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        onOpenValidationModal={() => setIsValidationModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6 border-0 outline-none">
        {/* Value Proposition Hero Banner - Kid-friendly & Large on mobile */}
        <div className="no-print relative overflow-hidden rounded-3xl bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-850 p-4 sm:p-7 shadow-2xl border border-neutral-800">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-10 w-60 h-60 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs sm:text-sm font-bold">
                    <span>✨</span> Bé Vui Luyện Chữ Đẹp & Đúng Chuẩn
                  </div>

                  {/* Validation Matrix for Judges */}
                  <button
                    id="hero-validation-matrix-btn"
                    onClick={() => setIsValidationModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-indigo-500/20 hover:from-indigo-500/30 hover:to-purple-500/30 border border-indigo-500/40 text-indigo-300 text-xs sm:text-sm font-bold transition cursor-pointer active:scale-95 shadow-sm"
                    title="Xem Ma trận Đánh giá Thực nghiệm & Báo cáo Ban Giám khảo"
                  >
                    <span>📊</span>
                    <span>Báo Cáo Thực Nghiệm (Ban Giám Khảo)</span>
                  </button>

                  {/* Personalized Learner Profile Tag */}
                  <button
                    onClick={() => setIsProfileModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-800/90 hover:bg-neutral-700/90 border border-neutral-600 text-neutral-200 text-xs font-semibold transition cursor-pointer active:scale-95"
                    title="Đổi lứa tuổi & Tên người học"
                  >
                    <span>{profile.avatar || '🐱'}</span>
                    <strong className="text-white">{profile.studentName || 'Bé Tập Viết'}</strong>
                    <span className="text-neutral-400">•</span>
                    <span className="text-emerald-400">
                      {AGE_GROUPS[profile.ageGroup || 'grade1']?.title} ({AGE_GROUPS[profile.ageGroup || 'grade1']?.ageRange})
                    </span>
                    <span className="text-[10px] text-amber-400 ml-1 underline">Đổi</span>
                  </button>
                </div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white">
                  Rèn nét chữ nét người cùng Bút Thật - Giấy Thật 📝
                </h2>
                <p className="text-xs sm:text-base text-neutral-300 max-w-3xl leading-relaxed">
                  Bé và phụ huynh có thể chọn cách học phù hợp nhất: <strong>In bài tập viết A4</strong> ra giấy để cầm bút mực viết, hoặc <strong>Coi kiểu chữ to</strong> để kê giấy lên màn hình đồ theo nét mờ, và <strong>nhờ cô AI chấm điểm</strong> bài viết!
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
                <button
                  onClick={() => setIsProfileModalOpen(true)}
                  className="px-3.5 py-2 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition cursor-pointer shrink-0"
                >
                  <span>{profile.avatar || '🐱'}</span> Đổi Lứa Tuổi / Tên
                </button>
                <button
                  onClick={() => setIsGuideOpen(true)}
                  className="px-4 py-2 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer shrink-0"
                >
                  <span>💡</span> Hướng dẫn chi tiết
                </button>
              </div>
            </div>

            {/* Big, thumb-friendly cards on mobile */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2.5 sm:gap-3 pt-1">
              <button
                id="hero-print-worksheet-btn"
                onClick={() => setActiveView('worksheet')}
                className={`p-3.5 sm:p-4 rounded-2xl font-bold text-left transition flex flex-col justify-between border-2 active:scale-95 cursor-pointer min-h-[90px] ${
                  activeView === 'worksheet'
                    ? 'bg-emerald-600 text-white border-emerald-400 shadow-lg shadow-emerald-950/50'
                    : 'bg-neutral-850 hover:bg-neutral-800 text-neutral-200 border-neutral-700'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-2xl">🖨️</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-400/30 text-emerald-200">Hay nhất</span>
                </div>
                <div>
                  <div className="text-sm sm:text-base font-black leading-tight">In bài viết A4</div>
                  <div className="text-[11px] opacity-80 mt-0.5">Viết bút thật trên giấy</div>
                </div>
              </button>

              <button
                id="hero-lightbox-btn"
                onClick={() => setActiveView('lightbox')}
                className={`p-3.5 sm:p-4 rounded-2xl font-bold text-left transition flex flex-col justify-between border-2 active:scale-95 cursor-pointer min-h-[90px] ${
                  activeView === 'lightbox'
                    ? 'bg-amber-500 text-neutral-950 border-amber-300 shadow-lg shadow-amber-950/50'
                    : 'bg-neutral-850 hover:bg-neutral-800 text-neutral-200 border-neutral-700'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-2xl">🔍</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-400/30 text-amber-900">Dễ tập</span>
                </div>
                <div>
                  <div className="text-sm sm:text-base font-black leading-tight">Coi kiểu chữ</div>
                  <div className="text-[11px] opacity-80 mt-0.5">Kê giấy mỏng đồ nét</div>
                </div>
              </button>

              <button
                id="hero-ai-btn"
                onClick={() => setActiveView('ai_feedback')}
                className={`p-3.5 sm:p-4 rounded-2xl font-bold text-left transition flex flex-col justify-between border-2 active:scale-95 cursor-pointer min-h-[90px] ${
                  activeView === 'ai_feedback'
                    ? 'bg-indigo-600 text-white border-indigo-400 shadow-lg shadow-indigo-950/50'
                    : 'bg-neutral-850 hover:bg-neutral-800 text-neutral-200 border-neutral-700'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-2xl">⭐</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-400/30 text-indigo-200">Cô AI</span>
                </div>
                <div>
                  <div className="text-sm sm:text-base font-black leading-tight">Chấm điểm AI</div>
                  <div className="text-[11px] opacity-80 mt-0.5">Chụp ảnh bài viết</div>
                </div>
              </button>

              <button
                id="hero-leaderboard-btn"
                onClick={() => setActiveView('leaderboard')}
                className={`p-3.5 sm:p-4 rounded-2xl font-bold text-left transition flex flex-col justify-between border-2 active:scale-95 cursor-pointer min-h-[90px] ${
                  activeView === 'leaderboard'
                    ? 'bg-gradient-to-br from-amber-500 to-yellow-600 text-neutral-950 border-amber-300 shadow-lg shadow-amber-950/50 font-black'
                    : 'bg-neutral-850 hover:bg-neutral-800 text-neutral-200 border-neutral-700'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="w-8 h-9 flex items-center justify-center">
                    <RankInsignia tier="master" size="xs" showGlow />
                  </div>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-400/30 text-amber-300">Level</span>
                </div>
                <div>
                  <div className="text-sm sm:text-base font-black leading-tight">Cấp Bậc Rank</div>
                  <div className="text-[11px] opacity-80 mt-0.5">Tiến trình & Huy hiệu</div>
                </div>
              </button>

              {currentLanguage !== 'zh' && (
                <button
                  id="hero-alphabet-btn"
                  onClick={() => setActiveView('alphabet')}
                  className={`p-3.5 sm:p-4 rounded-2xl font-bold text-left transition flex flex-col justify-between border-2 active:scale-95 cursor-pointer min-h-[90px] ${
                    activeView === 'alphabet'
                      ? 'bg-cyan-600 text-white border-cyan-400 shadow-lg shadow-cyan-950/50'
                      : 'bg-neutral-850 hover:bg-neutral-800 text-neutral-200 border-neutral-700'
                  }`}
                >
                  <span className="text-2xl">📚</span>
                  <div>
                    <div className="text-sm sm:text-base font-black leading-tight">Bảng chữ cái</div>
                    <div className="text-[11px] opacity-80 mt-0.5">Xem thứ tự nét chuẩn</div>
                  </div>
                </button>
              )}

              <button
                id="hero-sentences-btn"
                onClick={() => setActiveView('sentences')}
                className={`p-3.5 sm:p-4 rounded-2xl font-bold text-left transition flex flex-col justify-between border-2 active:scale-95 cursor-pointer min-h-[90px] ${
                  activeView === 'sentences'
                    ? 'bg-teal-600 text-white border-teal-400 shadow-lg shadow-teal-950/50'
                    : 'bg-neutral-850 hover:bg-neutral-800 text-neutral-200 border-neutral-700'
                }`}
              >
                <span className="text-2xl">✍️</span>
                <div>
                  <div className="text-sm sm:text-base font-black leading-tight">Tập viết câu</div>
                  <div className="text-[11px] opacity-80 mt-0.5">Thơ & Ca dao hay</div>
                </div>
              </button>

              <button
                id="hero-start-ar-btn"
                onClick={() => {
                  setActivePracticeItem({
                    text: SAMPLE_SENTENCES[currentLanguage]?.[0]?.text || 'Luyện chữ AR',
                    language: currentLanguage,
                    reading: SAMPLE_SENTENCES[currentLanguage]?.[0]?.reading,
                    translation: SAMPLE_SENTENCES[currentLanguage]?.[0]?.translation,
                    tips: SAMPLE_SENTENCES[currentLanguage]?.[0]?.tips,
                    gridType: currentLanguage === 'vi' ? 'oly_vi' : currentLanguage === 'en' ? 'four_line_en' : 'mizi_zh',
                  });
                  setActiveView('ar');
                }}
                className="p-3.5 sm:p-4 rounded-2xl font-bold text-left transition flex flex-col justify-between border-2 border-neutral-700 bg-neutral-850 hover:bg-neutral-800 text-neutral-200 active:scale-95 cursor-pointer min-h-[90px]"
              >
                <span className="text-2xl">📷</span>
                <div>
                  <div className="text-sm sm:text-base font-black leading-tight">Camera AR</div>
                  <div className="text-[11px] opacity-80 mt-0.5">Chiếu chữ lên giấy</div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* View: Printable A4 Worksheet Generator */}
        {activeView === 'worksheet' && (
          <WorksheetGenerator
            initialText={activePracticeItem.text}
            initialLanguage={currentLanguage}
            onLaunchLightbox={(text, fontId, gridType) => {
              setActivePracticeItem(prev => ({ ...prev, text, fontId, gridType }));
              setActiveView('lightbox');
            }}
            onLaunchAR={(text, fontId, gridType) => {
              setActivePracticeItem(prev => ({ ...prev, text, fontId, gridType }));
              setActiveView('ar');
            }}
          />
        )}

        {/* View: AI Handwriting Assessment */}
        {activeView === 'ai_feedback' && (
          <HandwritingAIReview
            sampleText={activePracticeItem.text}
            onSelectWorksheet={() => setActiveView('worksheet')}
            onViewLeaderboard={() => setActiveView('leaderboard')}
          />
        )}

        {/* View: Leaderboard & Rank System */}
        {activeView === 'leaderboard' && (
          <LeaderboardAndRank
            onStartPractice={() => setActiveView('worksheet')}
            onReviewWithAI={() => setActiveView('ai_feedback')}
            onOpenProfileModal={() => setIsProfileModalOpen(true)}
          />
        )}

        {/* View: Alphabet & Stroke Library */}
        {activeView === 'alphabet' && (
          <AlphabetBrowser
            language={currentLanguage}
            onSelectCharacter={(char) => setInspectCharacter(char)}
            onLaunchAR={handleLaunchARForCharacter}
            onLaunchCanvas={handleLaunchCanvasForCharacter}
            onSwitchToSentenceView={() => setActiveView('sentences')}
          />
        )}

        {/* View: Custom Sentence Creator */}
        {activeView === 'sentences' && (
          <SentenceCreator
            language={currentLanguage}
            onLaunchAR={handleLaunchARForSentence}
            onLaunchCanvas={handleLaunchCanvasForSentence}
          />
        )}

        {/* View: Digital Screen Canvas */}
        {activeView === 'canvas' && (
          <DigitalCanvas
            charOrText={activePracticeItem.text}
            language={activePracticeItem.language}
            reading={activePracticeItem.reading}
            translation={activePracticeItem.translation}
            tips={activePracticeItem.tips}
            gridType={activePracticeItem.gridType}
            onBack={() => setActiveView('worksheet')}
            onLaunchAR={() => setActiveView('ar')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-neutral-800/80 bg-neutral-900/60 py-6 text-center text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-medium text-neutral-400">
            <span>Luyện chữ AR</span>
            <span>•</span>
            <span>Giải pháp giáo dục tương tác thông minh</span>
          </div>
          <div className="text-neutral-500">
            Hỗ trợ 4 ngôn ngữ: Tiếng Việt, Tiếng Anh, Tiếng Nhật, Tiếng Trung
          </div>
        </div>
      </footer>

      {/* Character Breakdown Modal */}
      <CharacterDetailModal
        character={inspectCharacter}
        onClose={() => setInspectCharacter(null)}
        onLaunchAR={handleLaunchARForCharacter}
        onLaunchCanvas={handleLaunchCanvasForCharacter}
      />

      {/* Setup Guide Modal */}
      <SetupGuideModal
        isOpen={isGuideOpen}
        onClose={handleCloseGuide}
        onNavigateToView={(view) => setActiveView(view)}
      />

      {/* 20-20-20 Eye Protection Timer Modal & Persistent Overlay */}
      <EyeProtectionTimer
        isOpen={isEyeTimerOpen}
        onClose={() => setIsEyeTimerOpen(false)}
        onOpen={() => setIsEyeTimerOpen(true)}
      />

      {/* Age Group & Learner Profile Modal */}
      <AgeAndProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onProfileUpdated={(updated) => setProfile(updated)}
        onNavigateToView={(view) => setActiveView(view)}
        isFirstTime={!profile.hasCompletedOnboarding}
      />

      {/* Experimental Validation Matrix & Benchmark Modal for Judging Panel (BGK) */}
      <ValidationMatrixModal
        isOpen={isValidationModalOpen}
        onClose={() => setIsValidationModalOpen(false)}
      />
    </div>
  );
}
