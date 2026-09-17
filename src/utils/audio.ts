// Subtle audio synthesis for pen stroke feedback, ASMR pen scratching, and gamification fanfare

let audioCtx: AudioContext | null = null;
let asmrInterval: any = null;
let isAsmrPlaying = false;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

// Gentle brush/chalk stroke sound
export function playStrokeSound(pitchMultiplier = 1) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const baseFreq = 440 * pitchMultiplier;
    osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.3, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.09);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  } catch {
    // Ignore audio error if context not allowed yet
  }
}

// High-fidelity ASMR Fountain Pen scratch on paper
export function playASMRPenScratch(intensity = 1) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const bufferSize = ctx.sampleRate * 0.12; // 120ms scratch
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);

    // Generate textured paper friction noise
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      // Filter towards papery grain
      output[i] = white * (0.3 + 0.7 * Math.sin((i / bufferSize) * Math.PI));
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = buffer;

    // Bandpass filter centered around 1800Hz - 3200Hz (nib scratching paper frequency)
    const bandpass = ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(2200 + (Math.random() * 600 - 300), ctx.currentTime);
    bandpass.Q.setValueAtTime(3.5, ctx.currentTime);

    // Highpass to remove muddy low frequencies
    const highpass = ctx.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.setValueAtTime(900, ctx.currentTime);

    const gainNode = ctx.createGain();
    const vol = Math.min(0.09 * intensity, 0.15);
    gainNode.gain.setValueAtTime(vol, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

    whiteNoise.connect(bandpass);
    bandpass.connect(highpass);
    highpass.connect(gainNode);
    gainNode.connect(ctx.destination);

    whiteNoise.start();
    whiteNoise.stop(ctx.currentTime + 0.13);
  } catch {
    // ignore
  }
}

// Start continuous calming ASMR writing ambience
export function startContinuousASMRPen() {
  if (isAsmrPlaying) return;
  isAsmrPlaying = true;

  const loop = () => {
    if (!isAsmrPlaying) return;
    playASMRPenScratch(0.8 + Math.random() * 0.5);
    // Random gap like realistic human handwriting strokes
    const nextInterval = 140 + Math.random() * 260;
    asmrInterval = setTimeout(loop, nextInterval);
  };
  loop();
}

export function stopContinuousASMRPen() {
  isAsmrPlaying = false;
  if (asmrInterval) {
    clearTimeout(asmrInterval);
    asmrInterval = null;
  }
}

export function isASMRActive(): boolean {
  return isAsmrPlaying;
}

export function isContinuousASMRPlaying(): boolean {
  return isAsmrPlaying;
}

export function toggleContinuousASMRPen(): boolean {
  if (isAsmrPlaying) {
    stopContinuousASMRPen();
    return false;
  } else {
    startContinuousASMRPen();
    return true;
  }
}

// Celebration Level Up / Chime sound
export function playFanfareSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.09);

      const startTime = ctx.currentTime + idx * 0.09;
      gain.gain.setValueAtTime(0.06, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.4);
    });
  } catch {
    // ignore
  }
}

// Speak character or sentence using Native Web Speech API
export function speakText(text: string, lang: 'vi' | 'en' | 'ja' | 'zh') {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  try {
    window.speechSynthesis.cancel(); // stop previous speech

    const utterance = new SpeechSynthesisUtterance(text);
    const langMap: Record<string, string> = {
      vi: 'vi-VN',
      en: 'en-US',
      ja: 'ja-JP',
      zh: 'zh-CN',
    };
    utterance.lang = langMap[lang] || 'vi-VN';
    utterance.rate = 0.85; // slightly slower for educational clear listening
    utterance.pitch = 1.0;

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Speech synthesis error:', err);
  }
}
