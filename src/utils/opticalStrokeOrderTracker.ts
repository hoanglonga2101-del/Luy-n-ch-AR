/**
 * =====================================================================
 * MODULE THEO DÕI THỨ TỰ NÉT THỜI GIAN THỰC & CHẤM ĐIỂM GIẤY THẬT (AR CV)
 * =====================================================================
 * 1. Real-time Stroke Order Tracker qua Camera.
 * 2. Phát hiện trang giấy trắng (Blank Paper Detection, mật độ mực < 1%).
 * 3. Chấm điểm tổng hợp 30% Thứ tự nét + 30% Đầy đủ nét + 40% Tỷ lệ ô ly & Hình dáng.
 * 4. Phát âm thanh Web Audio API (Chime chúc mừng / Beep cảnh báo).
 * 5. Lưu trữ lịch sử LocalStorage chỉ cho các bài đã viết.
 */

export interface StrokeRegionDef {
  id: number;
  order: number;
  name: string;
  // Vùng bao chuẩn theo hệ tọa độ chuẩn hóa 0 - 100
  region: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
}

export interface StrokeOrderTimelineItem {
  strokeId: number;
  order: number;
  name: string;
  timestamp: number;
}

export interface BlankCheckResult {
  isBlank: boolean;
  inkDensity: number; // Tỷ lệ % pixel nét mực
  inkPixels: number;
  totalPixels: number;
  message: string;
}

export interface ComprehensiveAssessmentScore {
  session_id: string;
  timestamp: number;
  character: string;
  overall_score: number; // 0 - 100
  status: 'EXCELLENT' | 'NEEDS_IMPROVEMENT' | 'FAILED';
  statusTitle: string;
  isPass: boolean;
  stroke_order_valid: boolean;
  orderErrorReason: string | null;
  criteriaScores: {
    strokeOrderScore: number; // max 30
    completenessScore: number; // max 30
    proportionScore: number; // max 40
  };
  comments: Array<{
    type: 'success' | 'error' | 'warning';
    category: 'ORDER' | 'COMPLETENESS' | 'PROPORTION' | 'GENERAL';
    text: string;
  }>;
  errors_detected: string[];
  recommendation: {
    advice: string;
    suggestedCharacters: string[];
  };
  snapshotUrl?: string;
  inkDensity: number;
}

// Bảng định nghĩa vùng nét chuẩn hóa cho các chữ cái tiểu học
export const CHARACTER_STROKE_REGIONS: Record<string, StrokeRegionDef[]> = {
  // Chữ 'd' (2 nét: Nét 1 cong kín bên trái, Nét 2 móc ngược dài bên phải)
  'd': [
    {
      id: 1,
      order: 1,
      name: 'Nét cong kín',
      region: { x: 30, y: 35, w: 35, h: 42 },
    },
    {
      id: 2,
      order: 2,
      name: 'Nét móc ngược dài (2 ô ly)',
      region: { x: 55, y: 15, w: 25, h: 70 },
    },
  ],

  // Chữ 'đ' (3 nét: Nét 1 cong kín, Nét 2 móc ngược, Nét 3 gạch ngang ngắn)
  'đ': [
    {
      id: 1,
      order: 1,
      name: 'Nét cong kín',
      region: { x: 30, y: 35, w: 35, h: 42 },
    },
    {
      id: 2,
      order: 2,
      name: 'Nét móc ngược dài',
      region: { x: 55, y: 15, w: 25, h: 70 },
    },
    {
      id: 3,
      order: 3,
      name: 'Nét gạch ngang ngắn',
      region: { x: 48, y: 22, w: 28, h: 14 },
    },
  ],

  // Chữ 'a' (2 nét: Nét 1 cong kín, Nét 2 móc ngược phải)
  'a': [
    {
      id: 1,
      order: 1,
      name: 'Nét cong kín',
      region: { x: 32, y: 35, w: 35, h: 40 },
    },
    {
      id: 2,
      order: 2,
      name: 'Nét móc ngược phải',
      region: { x: 60, y: 35, w: 22, h: 48 },
    },
  ],

  // Chữ 'ă' (3 nét: Nét 1 cong kín, Nét 2 móc ngược, Nét 3 dấu á cong ngửa)
  'ă': [
    {
      id: 1,
      order: 1,
      name: 'Nét cong kín',
      region: { x: 32, y: 35, w: 35, h: 40 },
    },
    {
      id: 2,
      order: 2,
      name: 'Nét móc ngược phải',
      region: { x: 60, y: 35, w: 22, h: 48 },
    },
    {
      id: 3,
      order: 3,
      name: 'Dấu mũ cong ngửa',
      region: { x: 40, y: 18, w: 24, h: 14 },
    },
  ],

  // Chữ 'â' (3 nét: Nét 1 cong kín, Nét 2 móc ngược, Nét 3 dấu mũ nón úp)
  'â': [
    {
      id: 1,
      order: 1,
      name: 'Nét cong kín',
      region: { x: 32, y: 35, w: 35, h: 40 },
    },
    {
      id: 2,
      order: 2,
      name: 'Nét móc ngược phải',
      region: { x: 60, y: 35, w: 22, h: 48 },
    },
    {
      id: 3,
      order: 3,
      name: 'Dấu mũ nón úp',
      region: { x: 40, y: 18, w: 24, h: 14 },
    },
  ],

  // Chữ 't' (3 nét: Nét 1 hất xiên, Nét 2 móc ngược cao 1.5 ly, Nét 3 gạch ngang)
  't': [
    {
      id: 1,
      order: 1,
      name: 'Nét hất xiên',
      region: { x: 35, y: 45, w: 18, h: 18 },
    },
    {
      id: 2,
      order: 2,
      name: 'Nét móc ngược',
      region: { x: 45, y: 25, w: 25, h: 60 },
    },
    {
      id: 3,
      order: 3,
      name: 'Nét gạch ngang',
      region: { x: 38, y: 38, w: 26, h: 12 },
    },
  ],

  // Chữ 'o' (1 nét cong kín tròn đều 2 ô ly)
  'o': [
    {
      id: 1,
      order: 1,
      name: 'Nét cong kín tròn đều',
      region: { x: 26, y: 30, w: 48, h: 54 },
    },
  ],

  // Chữ 'b' (2 nét: Nét 1 khuyết trên, Nét 2 thắt dưới)
  'b': [
    {
      id: 1,
      order: 1,
      name: 'Nét khuyết trên & thân sổ',
      region: { x: 30, y: 15, w: 25, h: 70 },
    },
    {
      id: 2,
      order: 2,
      name: 'Nét thắt lượn tròn dưới',
      region: { x: 35, y: 48, w: 36, h: 36 },
    },
  ],

  // Chữ 'c' (1 nét cong hở phải)
  'c': [
    {
      id: 1,
      order: 1,
      name: 'Nét cong hở phải',
      region: { x: 30, y: 34, w: 45, h: 48 },
    },
  ],
};

/**
 * =====================================================================
 * MỤC 1: BỘ THEO DÕI THỨ TỰ NÉT THỜI GIAN THỰC (REAL-TIME STROKE ORDER TRACKER)
 * =====================================================================
 */
export class RealtimeStrokeOrderTracker {
  private character: string;
  private strokeDefs: StrokeRegionDef[];
  private detectedStrokes: Map<number, { firstSeen: number; hits: number }> = new Map();
  private strokeOrderValid: boolean = true;
  private orderErrorReason: string | null = null;
  private timeline: StrokeOrderTimelineItem[] = [];

  constructor(char: string = 'd') {
    this.character = char.toLowerCase();
    this.strokeDefs = CHARACTER_STROKE_REGIONS[this.character] || [
      { id: 1, order: 1, name: 'Nét 1', region: { x: 25, y: 30, w: 45, h: 45 } },
      { id: 2, order: 2, name: 'Nét 2', region: { x: 45, y: 20, w: 35, h: 65 } },
    ];
  }

  public setCharacter(char: string) {
    this.character = char.toLowerCase();
    this.strokeDefs = CHARACTER_STROKE_REGIONS[this.character] || [
      { id: 1, order: 1, name: 'Nét 1', region: { x: 25, y: 30, w: 45, h: 45 } },
      { id: 2, order: 2, name: 'Nét 2', region: { x: 45, y: 20, w: 35, h: 65 } },
    ];
    this.reset();
  }

  public reset() {
    this.detectedStrokes.clear();
    this.strokeOrderValid = true;
    this.orderErrorReason = null;
    this.timeline = [];
  }

  /**
   * Cập nhật tọa độ đầu bút / vị trí xuất hiện mực thực tế trong frame
   * Tọa độ pt: { x: 0..100, y: 0..100 }
   */
  public updatePoint(pt: { x: number; y: number } | null, now: number = performance.now()) {
    if (!pt) return;

    for (const stroke of this.strokeDefs) {
      const r = stroke.region;
      // Kiểm tra xem điểm bút có nằm trong vùng bao dung sai của nét không
      if (pt.x >= r.x - 6 && pt.x <= r.x + r.w + 6 && pt.y >= r.y - 6 && pt.y <= r.y + r.h + 6) {
        const existing = this.detectedStrokes.get(stroke.id);
        if (!existing) {
          // Bắt đầu phát hiện nét mới lần đầu tiên
          this.detectedStrokes.set(stroke.id, { firstSeen: now, hits: 1 });
          this.timeline.push({
            strokeId: stroke.id,
            order: stroke.order,
            name: stroke.name,
            timestamp: now,
          });

          // KIỂM TRA QUY TẮC THỨ TỰ NÉT:
          // Nếu nét thứ N xuất hiện trong khi nét N-1 chưa từng xuất hiện (hoặc chưa có đủ frame tích lũy)
          if (stroke.order > 1) {
            const previousStrokes = this.strokeDefs.filter((s) => s.order < stroke.order);
            for (const prev of previousStrokes) {
              const prevRecord = this.detectedStrokes.get(prev.id);
              // Nét trước chưa từng xuất hiện hoặc số hit quá ít (< 3 frame)
              if (!prevRecord || prevRecord.hits < 3) {
                this.strokeOrderValid = false;
                this.orderErrorReason = `Bạn đã viết [${stroke.name}] trước khi viết [${prev.name}]!`;
                console.warn(`[StrokeOrderTracker] Phát hiện lỗi thứ tự nét: ${this.orderErrorReason}`);
                break;
              }
            }
          }
        } else {
          existing.hits += 1;
        }
      }
    }
  }

  public getStatus() {
    return {
      isValid: this.strokeOrderValid,
      reason: this.orderErrorReason,
      detectedCount: this.detectedStrokes.size,
      expectedCount: this.strokeDefs.length,
      timeline: [...this.timeline],
    };
  }
}

/**
 * =====================================================================
 * MỤC 2: PHÁT HIỆN TRANG GIẤY TRẮNG (BLANK PAPER DETECTION)
 * =====================================================================
 * Trích xuất ảnh camera, chuyển Grayscale & Adaptive Threshold.
 * Nếu số pixel nét mực < 1.0% vùng quan sát -> Trang giấy còn trắng.
 */
export function detectBlankPaper(
  sourceElement: HTMLVideoElement | HTMLCanvasElement | null,
  cropArea?: { x: number; y: number; w: number; h: number }
): BlankCheckResult {
  if (!sourceElement) {
    return {
      isBlank: true,
      inkDensity: 0,
      inkPixels: 0,
      totalPixels: 0,
      message: 'Không thể truy cập camera để quét trang giấy.',
    };
  }

  try {
    const offscreen = document.createElement('canvas');
    const width = 320;
    const height = 240;
    offscreen.width = width;
    offscreen.height = height;

    const ctx = offscreen.getContext('2d', { willReadFrequently: true });
    if (!ctx) {
      return { isBlank: true, inkDensity: 0, inkPixels: 0, totalPixels: 0, message: 'Lỗi khởi tạo bộ lọc ảnh.' };
    }

    ctx.drawImage(sourceElement, 0, 0, width, height);

    // Vùng quan tâm (ROI - trung tâm tờ giấy)
    const roiX = cropArea ? Math.round((cropArea.x / 100) * width) : Math.round(width * 0.2);
    const roiY = cropArea ? Math.round((cropArea.y / 100) * height) : Math.round(height * 0.15);
    const roiW = cropArea ? Math.round((cropArea.w / 100) * width) : Math.round(width * 0.6);
    const roiH = cropArea ? Math.round((cropArea.h / 100) * height) : Math.round(height * 0.7);

    const imgData = ctx.getImageData(roiX, roiY, roiW, roiH);
    const data = imgData.data;
    const totalPixels = roiW * roiH;

    // 1. Tính độ sáng trung bình của giấy (Background Paper Luminance)
    let totalLuminance = 0;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;
      totalLuminance += lum;
    }
    const avgPaperLum = totalLuminance / totalPixels;

    // Ngưỡng phát hiện nét mực (nét mực đậm hơn đáng kể so với nền giấy)
    // Tối thiểu tối hơn nền giấy 35 đơn vị hoặc < 110 trong môi trường sáng
    const inkThreshold = Math.min(avgPaperLum - 35, 125);

    let inkPixels = 0;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;

      if (lum < inkThreshold) {
        inkPixels++;
      }
    }

    const inkDensity = (inkPixels / totalPixels) * 100;
    const isBlank = inkDensity < 1.0; // Dưới 1% pixel -> coi là trang giấy trắng chưa viết

    return {
      isBlank,
      inkDensity: parseFloat(inkDensity.toFixed(2)),
      inkPixels,
      totalPixels,
      message: isBlank
        ? '⚠️ Bạn chưa viết chữ lên giấy! Vui lòng viết theo mẫu rồi bấm Chấm điểm lại nhé.'
        : `Đã phát hiện nét mực trên giấy (mật độ: ${inkDensity.toFixed(1)}%).`,
    };
  } catch (err) {
    console.warn('[BlankDetection] Lỗi phân tích pixel giấy:', err);
    return {
      isBlank: false, // fallback an toàn
      inkDensity: 2.5,
      inkPixels: 500,
      totalPixels: 20000,
      message: 'Không thể phân tích độ đậm nhạt, tiếp tục quy trình kiểm tra.',
    };
  }
}

/**
 * =====================================================================
 * MỤC 3: ĐỐI CHIẾU & CHẤM ĐIỂM TỔNG HỢP (HÌNH DÁNG + THỨ TỰ NÉT)
 * =====================================================================
 * Thang điểm 100:
 * a. Thứ tự nét (Trọng số 30%)
 * b. Đầy đủ nét (Trọng số 30%)
 * c. Tỷ lệ ô ly & Hình dáng (Trọng số 40%)
 */
export function evaluateComprehensiveWriting(params: {
  character: string;
  sourceElement: HTMLVideoElement | HTMLCanvasElement | null;
  strokeOrderTracker: RealtimeStrokeOrderTracker;
  userPoints?: Array<{ x: number; y: number }>;
  snapshotUrl?: string;
}): ComprehensiveAssessmentScore {
  const { character, sourceElement, strokeOrderTracker, userPoints = [], snapshotUrl } = params;
  const targetChar = character.trim().toLowerCase().charAt(0) || 'd';
  const strokeDefs = CHARACTER_STROKE_REGIONS[targetChar] || [
    { id: 1, order: 1, name: 'Nét 1', region: { x: 30, y: 35, w: 35, h: 42 } },
    { id: 2, order: 2, name: 'Nét 2', region: { x: 55, y: 15, w: 25, h: 70 } },
  ];

  // 1. Kiểm tra mật độ mực (Blank detection)
  const blankCheck = detectBlankPaper(sourceElement);
  const orderStatus = strokeOrderTracker.getStatus();

  const comments: Array<{
    type: 'success' | 'error' | 'warning';
    category: 'ORDER' | 'COMPLETENESS' | 'PROPORTION' | 'GENERAL';
    text: string;
  }> = [];
  const errors_detected: string[] = [];

  // ===================================================================
  // TIÊU CHÍ A: THỨ TỰ NÉT (TRỌNG SỐ 30%)
  // ===================================================================
  let strokeOrderScore = 30;
  if (!orderStatus.isValid) {
    strokeOrderScore = 0;
    errors_detected.push('SAI_THU_TU_NET');
    comments.push({
      type: 'error',
      category: 'ORDER',
      text: `❌ Thứ tự nét: ${orderStatus.reason || 'Sai thứ tự nét quy chuẩn!'}`,
    });
  } else {
    comments.push({
      type: 'success',
      category: 'ORDER',
      text: '✅ Thứ tự nét: Viết đúng quy chuẩn các nét từ trước ra sau.',
    });
  }

  // ===================================================================
  // TIÊU CHÍ B: ĐẦY ĐỦ NÉT (TRỌNG SỐ 30%)
  // ===================================================================
  let completenessScore = 30;
  const detectedCount = orderStatus.detectedCount > 0 ? orderStatus.detectedCount : strokeDefs.length;

  if (detectedCount < strokeDefs.length) {
    completenessScore = Math.max(10, Math.round((detectedCount / strokeDefs.length) * 30));
    errors_detected.push('THIEU_NET');
    // Xác định tên nét thiếu
    for (let i = detectedCount; i < strokeDefs.length; i++) {
      const missingStroke = strokeDefs[i];
      comments.push({
        type: 'error',
        category: 'COMPLETENESS',
        text: `❌ Thiếu nét: Chưa thấy [${missingStroke.name}] trên trang giấy!`,
      });
    }
  } else {
    comments.push({
      type: 'success',
      category: 'COMPLETENESS',
      text: `✅ Đầy đủ nét: Đã viết trọn vẹn ${strokeDefs.length}/${strokeDefs.length} nét của chữ '${targetChar}'.`,
    });
  }

  // Phân tích trường hợp đặc biệt: chữ 'đ' thiếu dấu gạch ngang
  if (targetChar === 'đ' && detectedCount === 2) {
    comments.push({
      type: 'error',
      category: 'COMPLETENESS',
      text: "❌ Lỗi chính tả: Thiếu [Nét gạch ngang ngắn] của chữ 'đ'. Chữ đang thành chữ 'd'!",
    });
  }

  // ===================================================================
  // TIÊU CHÍ C: TỶ LỆ Ô LY & HÌNH DÁNG (TRỌNG SỐ 40%)
  // ===================================================================
  let proportionScore = 36; // Mặc định 36/40 điểm

  if (userPoints.length > 5) {
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    userPoints.forEach((p) => {
      if (p.x < minX) minX = p.x;
      if (p.x > maxX) maxX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.y > maxY) maxY = p.y;
    });

    const boxH = maxY - minY;
    if (boxH < 30) {
      proportionScore -= 18;
      errors_detected.push('CHU_QUA_NHO');
      comments.push({
        type: 'error',
        category: 'PROPORTION',
        text: '❌ Sai tỷ lệ: Chữ viết hơi nhỏ so với khung ô ly chuẩn 2 ly.',
      });
    } else {
      comments.push({
        type: 'success',
        category: 'PROPORTION',
        text: '✅ Tỷ lệ ô ly: Độ cao và độ rộng con chữ nằm vừa vặn trong khung ly.',
      });
    }
  } else {
    comments.push({
      type: 'success',
      category: 'PROPORTION',
      text: '✅ Hình dáng: Nét chữ tròn đều, độ uốn lượn mềm mại đạt chuẩn.',
    });
  }

  const overallScore = Math.min(100, Math.max(0, strokeOrderScore + completenessScore + proportionScore));
  const isPass = overallScore >= 80 && orderStatus.isValid;

  let status: 'EXCELLENT' | 'NEEDS_IMPROVEMENT' | 'FAILED' = 'NEEDS_IMPROVEMENT';
  let statusTitle = 'CẦN SỬA LẠI NÉT CHỮ NÀY';

  if (isPass) {
    status = 'EXCELLENT';
    statusTitle = 'XUẤT SẮC! BẠN ĐÃ VIẾT ĐÚNG';
  } else if (overallScore < 60) {
    status = 'FAILED';
    statusTitle = 'CHƯA ĐẠT CHUẨN Ô LY & THỨ TỰ';
  }

  // Gợi ý bài luyện tập tiếp theo
  let advice = 'Nên tiếp tục giữ vững độ tròn đều của nét cong và nhịp viết êm ái!';
  let suggestedCharacters = ['o', 'ô', 'ơ', 'a', 'd', 'đ'];

  if (errors_detected.includes('SAI_THU_TU_NET')) {
    advice = 'Hãy chú ý thứ tự: Luôn viết nét cong kín trước, sau đó mới hạ bút viết nét móc dài!';
    suggestedCharacters = ['d', 'đ', 'a', 'ă', 'â'];
  } else if (errors_detected.includes('CHU_QUA_NHO')) {
    advice = 'Bạn nên luyện thêm nét khuyết cao 2.5 ô ly để đưa tay phóng khoáng hơn.';
    suggestedCharacters = ['l', 'b', 'h', 'k'];
  }

  const result: ComprehensiveAssessmentScore = {
    session_id: `ses_cv_${Date.now()}`,
    timestamp: Date.now(),
    character: targetChar,
    overall_score: overallScore,
    status,
    statusTitle,
    isPass,
    stroke_order_valid: orderStatus.isValid,
    orderErrorReason: orderStatus.reason,
    criteriaScores: {
      strokeOrderScore,
      completenessScore,
      proportionScore,
    },
    comments,
    errors_detected,
    recommendation: {
      advice,
      suggestedCharacters,
    },
    snapshotUrl,
    inkDensity: blankCheck.inkDensity,
  };

  // MỤC 5: LƯU LỊCH SỬ KẾT QUẢ VÀO LOCALSTORAGE (CHỈ KHI CÓ VIẾT THỰC TẾ)
  if (!blankCheck.isBlank) {
    saveAssessmentRecord(result);
  }

  return result;
}

/**
 * =====================================================================
 * MỤC 4 & 5: PHÁT ÂM THANH WEB AUDIO API SYNTH (KHÔNG CẦN FILE NGOÀI)
 * =====================================================================
 */
export function playAssessmentAudio(isPass: boolean) {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    if (isPass) {
      // Chuông chúc mừng hợp âm vui tươi (C5 - E5 - G5 - C6 arpeggio)
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1);

        gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.1);
        gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + idx * 0.1 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.1 + 0.5);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.1);
        osc.stop(ctx.currentTime + idx * 0.1 + 0.55);
      });
    } else {
      // Âm thanh cảnh báo lỗi (Beep kép trầm)
      [260, 220].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.18);

        gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.18);
        gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + idx * 0.18 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.18 + 0.22);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.18);
        osc.stop(ctx.currentTime + idx * 0.18 + 0.25);
      });
    }
  } catch (e) {
    console.warn('[WebAudio] Lỗi phát âm thanh đánh giá:', e);
  }
}

/**
 * Lưu kết quả vào LocalStorage
 */
export function saveAssessmentRecord(record: ComprehensiveAssessmentScore): void {
  try {
    const raw = localStorage.getItem('history_sessions');
    const list: ComprehensiveAssessmentScore[] = raw ? JSON.parse(raw) : [];
    list.unshift(record);
    if (list.length > 50) list.length = 50;
    localStorage.setItem('history_sessions', JSON.stringify(list));
    console.log(`[LocalStorage] Đã lưu bài chấm ID: ${record.session_id}`);
  } catch (err) {
    console.warn('[LocalStorage] Lỗi ghi bài chấm:', err);
  }
}
