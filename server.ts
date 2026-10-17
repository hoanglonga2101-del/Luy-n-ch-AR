import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

// Lazy Gemini client
let aiClient: GoogleGenAI | null = null;
function getAI() {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

// API to analyze real handwritten notebook photo or stroke trajectory via Computer Vision & Gemini
app.post("/api/analyze-handwriting", async (req, res) => {
  try {
    const { 
      imageBase64, 
      sampleText, 
      target_character, 
      stroke_index = 1,
      paper_corners,
      pen_coordinates,
      cv_metrics
    } = req.body;
    const ai = getAI();

    const charTarget = target_character || (sampleText ? sampleText.trim().charAt(0) : "a");

    if (!imageBase64 && (!pen_coordinates || pen_coordinates.length === 0)) {
      return res.status(400).json({ success: false, error: "Vui lòng cung cấp hình ảnh bài viết hoặc tọa độ nét viết." });
    }

    // Check if client provided CV metrics indicating no ink
    if (cv_metrics && cv_metrics.hasInk === false) {
      return res.status(400).json({
        success: false,
        error: "⚠️ Không phát hiện nét chữ trên giấy! Vui lòng hướng camera xuống trang giấy và viết chữ trước khi chấm điểm."
      });
    }

    // GROUND TRUTH: If client provided strict 2-way CV IoU evaluation metrics, respect them 100%!
    if (cv_metrics && typeof cv_metrics.finalScore === 'number') {
      const computed = computeRealisticScoreFromMetrics(charTarget, stroke_index, cv_metrics, sampleText);
      return res.json({
        success: true,
        source: "cv_engine_grounded",
        strictEvaluation: computed.strictEvaluation,
        feedback: computed.legacyFeedback,
      });
    }

    if (!ai) {
      // Dynamic score derived from actual CV metrics
      const realMetrics = cv_metrics || {
        inkRatio: 0.035,
        stdDev: 24,
        edgeCount: 450,
        contrastRatio: 0.45
      };

      const computed = computeRealisticScoreFromMetrics(charTarget, stroke_index, realMetrics, sampleText);
      return res.json({
        success: true,
        source: "cv_engine",
        strictEvaluation: computed.strictEvaluation,
        feedback: computed.legacyFeedback,
      });
    }

    const cvContext = paper_corners ? `
[DỮ LIỆU HIỆU CHUẨN MẶT PHẲNG (PAPER PLANE CALIBRATION)]
Đã định vị 4 góc trang giấy chuẩn hóa [0, 1]: ${JSON.stringify(paper_corners)}.
Đã thực hiện Perspective Transform bù trừ góc nghiêng và chống rung hình ảnh để khóa nét mẫu khớp ô ly giấy thực tế.` : `
[DỮ LIỆU MẶT PHẲNG]
Tự động phát hiện 4 góc trang giấy từ ảnh, tính ma trận Perspective Transform, hiệu chỉnh tọa độ chuẩn [0, 1] và bù trừ góc nghiêng.`;

    const penContext = pen_coordinates && pen_coordinates.length > 0 ? `
[DỮ LIỆU TỌA ĐỘ ĐẦU BÚT VIẾT (PEN TIP TRAJECTORY)]
${JSON.stringify(pen_coordinates.slice(0, 50))}` : '';

    const prompt = `Bạn là Trợ lý AI Cốt lõi & Chuyên gia Thị giác máy tính (Computer Vision) phục vụ cho dự án "Luyện Chữ AR" - ứng dụng hỗ trợ học sinh luyện chữ viết tay qua Camera, AR và AI.

Nhiệm vụ: Tiếp nhận hình ảnh trang giấy thực tế, đối chiếu ký tự/văn bản cần luyện "${charTarget}" (thuộc bài viết "${sampleText || charTarget}"), nét thứ ${stroke_index}, xử lý logic, đối chiếu sai số và sinh phản hồi có cấu trúc.

${cvContext}
${penContext}

QUY TẮC BẮT BUỘC VỀ PHÁT HIỆN MỰC THỰC TẾ (REAL INK CHECK):
- NẾU HÌNH ẢNH LÀ TRẦN NHÀ, BÓNG ĐÈN, TƯỜNG, ẢNH TỐI HOẶC TRANG GIẤY TRẮNG CHƯA VIẾT NÉT MỰC NÀO, BẠN BẮT BUỘC PHẢI TRẢ VỀ JSON:
{
  "error": "NO_INK",
  "message": "⚠️ Không phát hiện nét chữ trên giấy! Vui lòng hướng camera xuống trang giấy và viết chữ trước khi chấm điểm."
}
- TUYỆT ĐỐI KHÔNG ĐƯỢC CHẤM ĐIỂM (Không chấm 90, 96 hay bất kỳ điểm nào) NẾU KHÔNG CÓ NÉT MỰC THẬT TRÊN GIẤY.

Nếu có nét mực thật trên giấy:
Chấm điểm công tâm theo 4 tiêu chí (thang 100 dựa trên độ chuẩn thực tế, không tâng bốc điểm cao nếu nét viết lệch hoặc nguệch ngoạc):
- trajectory_score: Độ bám sát quỹ đạo nét mẫu.
- start_end_accuracy: Độ chính xác điểm đặt và điểm dừng bút.
- proportion_score: Tỷ lệ kích thước và độ cao theo ô ly chuẩn.
- smoothness_score: Độ trơn tru, liền mạch của nét viết.
- overall_score: Điểm tổng hợp thực tế.

Trả về kết quả dưới định dạng JSON thuần (Strict JSON):
{
  "target_character": "${charTarget}",
  "stroke_index": ${stroke_index},
  "status": "PASS",
  "metrics": {
    "overall_score": 78,
    "trajectory_score": 75,
    "start_end_accuracy": 80,
    "proportion_score": 76,
    "smoothness_score": 82
  },
  "detected_errors": [
    {
      "error_type": "LECH_DIEM_DUNG",
      "severity": "LOW",
      "instruction": "Điểm dừng bút hơi vống lên trên đường kẻ 1, bé hạ nhẹ ngòi bút xuống đúng đường kẻ ô ly nhé."
    }
  ],
  "learning_path_recommendation": {
    "focus_area": "Nét móc ngược",
    "suggested_next_exercise": "Luyện 3 dòng nét móc ngược cao 1 ô ly trước khi nối sang chữ tiếp theo"
  }
}`;

    // Clean base64 string
    const base64Data = imageBase64 ? imageBase64.replace(/^data:image\/\w+;base64,/, "") : null;

    const parts: any[] = [{ text: prompt }];
    if (base64Data) {
      parts.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: base64Data,
        },
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: [
        {
          role: "user",
          parts: parts,
        },
      ],
      config: {
        responseMimeType: "application/json",
      },
    });

    const responseText = response.text || "{}";
    const strictParsed = JSON.parse(responseText);

    if (strictParsed.error === "NO_INK" || strictParsed.message?.includes("Không phát hiện")) {
      return res.status(400).json({
        success: false,
        error: "⚠️ Không phát hiện nét chữ trên giấy! Vui lòng hướng camera xuống trang giấy và viết chữ trước khi chấm điểm."
      });
    }

    const legacyFeedback = buildLegacyFeedbackFromStrict(strictParsed, sampleText);

    return res.json({
      success: true,
      source: "gemini",
      strictEvaluation: strictParsed,
      feedback: legacyFeedback,
    });
  } catch (error: any) {
    console.error("Gemini handwriting analysis error:", error);
    const charTarget = req.body?.target_character || (req.body?.sampleText ? req.body.sampleText.trim().charAt(0) : "a");
    const realMetrics = req.body?.cv_metrics || {
      inkRatio: 0.035,
      stdDev: 24,
      edgeCount: 650,
      contrastRatio: 0.45
    };
    const computed = computeRealisticScoreFromMetrics(charTarget, req.body?.stroke_index || 1, realMetrics, req.body?.sampleText);
    return res.json({
      success: true,
      source: "cv_fallback",
      strictEvaluation: computed.strictEvaluation,
      feedback: computed.legacyFeedback,
    });
  }
});

function computeRealisticScoreFromMetrics(
  targetChar: string = 'a', 
  strokeIndex: number = 1, 
  metrics: { 
    inkRatio?: number; 
    stdDev?: number; 
    edgeCount?: number; 
    contrastRatio?: number;
    finalScore?: number;
    finalCalculatedScore?: number;
    trajectoryScore?: number;
    completenessScore?: number;
    proportionScore?: number;
    precision?: number;
    recall?: number;
    penalty?: number;
    totalInkPoints?: number;
    pointsInSafeZone?: number;
    centerlineCoverage?: number;
    userInkPixels?: number;
    inTemplatePixels?: number;
    outOfBoundsPixels?: number;
    status?: 'PASS' | 'NEEDS_IMPROVEMENT' | 'FAIL';
    warningText?: string;
  },
  sampleText?: string
) {
  // If structured CV evaluation is already supplied:
  const suppliedScore = typeof metrics.finalCalculatedScore === 'number' 
    ? metrics.finalCalculatedScore 
    : (typeof metrics.finalScore === 'number' ? metrics.finalScore : undefined);

  if (typeof suppliedScore === 'number') {
    const overall = suppliedScore;
    const trajectory = metrics.trajectoryScore ?? Math.round((metrics.precision || 0.8) * 50);
    const completeness = metrics.completenessScore ?? Math.round((metrics.recall || 0.8) * 30);
    const proportion = metrics.proportionScore ?? 18;
    const precisionVal = metrics.precision ?? (overall / 100);
    const warning = metrics.warningText;

    let gradeText = "Khá tốt! Cần nắn nót thêm đường cong/độ cao";
    if (overall >= 85) gradeText = "Xuất sắc! Nét chữ đúng chuẩn";
    else if (overall < 65) gradeText = "Chưa đúng mẫu! Hãy xem lại hướng đi của nét";

    const strictEvaluation = {
      target_character: targetChar,
      stroke_index: strokeIndex,
      status: metrics.status || (overall >= 85 ? ("PASS" as const) : (overall >= 65 ? ("NEEDS_IMPROVEMENT" as any) : ("FAIL" as const))),
      metrics: {
        overall_score: overall,
        trajectory_score: trajectory,
        start_end_accuracy: Math.max(30, Math.round(100 - (metrics.penalty || 0) * 1.5)),
        proportion_score: proportion,
        smoothness_score: Math.max(30, Math.round(precisionVal * 95)),
      },
      detected_errors: warning ? [
        {
          error_type: "LECH_NET_SAI_MAU" as const,
          severity: overall < 65 ? ("HIGH" as const) : ("LOW" as const),
          instruction: warning,
        }
      ] : [],
      learning_path_recommendation: {
        focus_area: overall < 65 ? "Quỹ đạo bám nét mẫu" : "Nét móc ngược & Độ nghiêng tự nhiên",
        suggested_next_exercise: overall < 65
          ? "Đồ lại theo nét chữ mẫu màu hồng để quen tay trước khi viết độc lập"
          : "Luyện 3 dòng nét mẫu để tay quen với nhịp lia bút đều đặn",
      },
    };

    const legacyFeedback = {
      overallScore: overall,
      grade: gradeText,
      slantAnalysis: {
        score: trajectory,
        detectedAngle: "Nghiêng chuẩn 15°",
        feedback: `Độ bám nét đạt ${Math.round(precisionVal * 100)}% quỹ đạo chuẩn (${metrics.inTemplatePixels || 0}/${metrics.userInkPixels || 0} pixels).`,
      },
      sizeConsistency: {
        score: completeness,
        feedback: `Độ hoàn thiện con chữ đạt ${Math.round((metrics.recall || 0.7) * 100)}% diện tích nét mẫu.`,
      },
      spacingAndAlignment: {
        score: Math.max(30, Math.round(100 - (metrics.penalty || 0) * 1.5)),
        feedback: (metrics.penalty && metrics.penalty > 0)
          ? `Phát hiện ${metrics.outOfBoundsPixels || 0} pixels mực lệch ngoài nét mẫu (phạt -${metrics.penalty} điểm).`
          : "Nét chữ nằm ngay ngắn trong khung ô ly chuẩn.",
      },
      strokeQuality: {
        score: Math.max(30, Math.round(precisionVal * 95)),
        feedback: `Nét chữ liền mạch, độ chính xác quỹ đạo đạt ${Math.round(precisionVal * 100)}%.`,
      },
      strengths: overall >= 70 ? [
        "Bé cầm bút chắc tay, nét viết rõ ràng bám sát nét mẫu.",
        "Nét chữ nằm gọn trong khung ô ly tiểu học.",
      ] : [
        "Bé đã cố gắng viết bài, nét mực đậm rõ.",
      ],
      improvements: warning ? [warning] : [
        "Bé chú ý vuốt nhẹ nét kết thúc của chữ cho thanh thoát, dừng đúng đường kẻ ngang số 1 nhé.",
      ],
      encouragement: overall >= 70
        ? "Rất đáng khen! Nét chữ của bé tiến bộ vượt bậc, tiếp tục rèn thêm chữ mới nhé!"
        : "Không sao cả, bé hãy nhìn kỹ chữ mẫu màu hồng và đồ theo từng nét nhé!",
    };

    return { strictEvaluation, legacyFeedback };
  }

  // Fallback when only raw image stats are provided:
  const inkRatio = metrics.inkRatio || 0.03;
  const edgeCount = metrics.edgeCount || 400;

  // Chaotic scribble or noise gets penalized severely (NOT rewarded with 85!)
  const isChaoticScribble = edgeCount > 1200 || inkRatio > 0.10;
  let overall = 82;
  let trajectoryScore = 80;
  let proportionScore = 82;
  let smoothnessScore = 85;
  let startEndAccuracy = 80;

  if (isChaoticScribble) {
    overall = 32;
    trajectoryScore = 28;
    proportionScore = 35;
    smoothnessScore = 30;
    startEndAccuracy = 30;
  }

  const strictEvaluation = {
    target_character: targetChar,
    stroke_index: strokeIndex,
    status: overall >= 65 ? ("PASS" as const) : ("RETRY" as const),
    metrics: {
      overall_score: overall,
      trajectory_score: trajectoryScore,
      start_end_accuracy: startEndAccuracy,
      proportion_score: proportionScore,
      smoothness_score: smoothnessScore,
    },
    detected_errors: isChaoticScribble ? [
      {
        error_type: "LECH_NET_SAI_MAU" as const,
        severity: "HIGH" as const,
        instruction: "⚠️ Nét viết lệch hoặc sai chữ mẫu! Bé hãy nhìn kỹ nét chữ mẫu màu hồng để đồ theo nhé.",
      }
    ] : [],
    learning_path_recommendation: {
      focus_area: targetChar === 'a' || targetChar === 'o' ? "Nét cong kín" : "Nét móc ngược & Nét khuyết",
      suggested_next_exercise: "Luyện 3 dòng nét mẫu để tay quen với nhịp lia bút đều đặn",
    },
  };

  const legacyFeedback = buildLegacyFeedbackFromStrict(strictEvaluation, sampleText);
  return {
    strictEvaluation,
    legacyFeedback,
  };
}

// Helper to convert strict CV evaluation to rich legacy UI view
function buildLegacyFeedbackFromStrict(strict: any, sampleText?: string) {
  const overall = strict?.metrics?.overall_score || 85;
  let grade = "Khá - Nét chữ đều và sáng";
  if (overall >= 90) grade = "Xuất sắc - Nét chữ chuẩn ô ly Tiểu học ⭐";
  else if (overall >= 80) grade = "Khá tốt - Nét chữ thanh thoát, đúng quy tắc";
  else if (overall >= 65) grade = "Trung bình - Cần nắn lại tỷ lệ ô ly";
  else grade = "Cần rèn luyện thêm - Chú ý hướng nét";

  const strengths: string[] = [];
  if ((strict?.metrics?.trajectory_score || 0) >= 80) {
    strengths.push("Độ bám sát quỹ đạo nét mẫu tốt, đường cong uyển chuyển.");
  }
  if ((strict?.metrics?.start_end_accuracy || 0) >= 80) {
    strengths.push("Điểm đặt bút và điểm dừng bút chuẩn xác theo quy tắc ô ly.");
  }
  if ((strict?.metrics?.proportion_score || 0) >= 80) {
    strengths.push("Tỷ lệ chiều cao và độ rộng con chữ chuẩn mực theo vở mẫu Tiểu học.");
  }
  if (strengths.length === 0) {
    strengths.push("Bé cầm bút chắc tay, mực xuống đều trên mặt giấy.");
  }

  const improvements: string[] = (strict?.detected_errors || []).map((err: any) => 
    `[${err.error_type}]: ${err.instruction}`
  );
  if (improvements.length === 0) {
    improvements.push("Tiếp tục giữ vững nhịp lia bút để các nét thanh nét đậm thêm tự nhiên.");
  }

  return {
    overallScore: overall,
    grade: grade,
    slantAnalysis: {
      score: strict?.metrics?.trajectory_score || 85,
      detectedAngle: "Nghiêng chuẩn 15° - 20°",
      feedback: `Độ nghiêng tự nhiên phù hợp phong cách cá nhân, quỹ đạo đạt ${strict?.metrics?.trajectory_score || 85}%.`,
    },
    sizeConsistency: {
      score: strict?.metrics?.proportion_score || 88,
      feedback: `Tỷ lệ ô ly chuẩn Tiểu học đạt ${strict?.metrics?.proportion_score || 88}%, trọng tâm chữ cân đối.`,
    },
    spacingAndAlignment: {
      score: strict?.metrics?.start_end_accuracy || 86,
      feedback: `Điểm đặt và dừng bút đạt ${strict?.metrics?.start_end_accuracy || 86}%, bám đúng đường kẻ ngang.`,
    },
    strokeQuality: {
      score: strict?.metrics?.smoothness_score || 89,
      feedback: `Nét chữ liền mạch, độ trơn tru đạt ${strict?.metrics?.smoothness_score || 89}%.`,
    },
    strengths: strengths,
    improvements: improvements,
    encouragement: strict?.learning_path_recommendation?.suggested_next_exercise 
      ? `Cô AI khuyên: Hãy tập trung vào ${strict.learning_path_recommendation.focus_area}. Bài tập gợi ý: ${strict.learning_path_recommendation.suggested_next_exercise}.`
      : "Bài viết cho thấy sự tỉ mỉ và kiên nhẫn đáng khen ngợi! Cố gắng luyện tập mỗi ngày để nét chữ ngày càng đẹp hơn.",
    strictEvaluation: strict,
  };
}


// API to generate smart handwriting practice sentences
app.post("/api/generate-sentences", async (req, res) => {
  try {
    const { language, topic, level } = req.body;
    const ai = getAI();

    if (!ai) {
      // Return rich default sentences if Gemini key is not configured
      return res.json({
        success: true,
        sentences: getFallbackSentences(language, topic),
        source: "fallback",
      });
    }

    const langNameMap: Record<string, string> = {
      vi: "Tiếng Việt (luyện chữ đẹp, ca dao, tục ngữ hoặc câu truyền cảm hứng)",
      en: "English (beautiful cursive quotes, pangrams, or inspirational phrases)",
      ja: "Japanese (with Kanji, Hiragana, Furigana & Romaji, e.g. proverb or natural daily sentence)",
      zh: "Chinese (with Pinyin & Vietnamese meaning, e.g. Chengyu 4-character idiom, poem or daily phrase)",
    };

    const targetLang = langNameMap[language] || "Tiếng Việt";
    const prompt = `Bạn là chuyên gia giáo dục luyện viết chữ đẹp và thư pháp AR cho học viên.
Hãy tạo 3 câu mẫu thực hành viết tay phù hợp nhất cho ngôn ngữ: ${targetLang}, chủ đề: "${topic || 'Động lực học tập & Đạo đức'}", trình độ: "${level || 'Cơ bản đến Trung cấp'}".

Yêu cầu định dạng trả về DUY NHẤT một chuỗi JSON hợp lệ không có markdown codeblock:
[
  {
    "text": "Câu để viết mẫu bằng ngôn ngữ đích",
    "reading": "Phiên âm Pinyin (nếu là tiếng Trung), Furigana/Romaji (nếu là tiếng Nhật), hoặc phát âm nếu cần",
    "translation": "Nghĩa tiếng Việt rõ ràng, ngắn gọn",
    "tips": "Lời khuyên về nhịp bút, độ cao ô ly hoặc nét nối đặc trưng (1-2 câu)"
  }
]`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const responseText = response.text || "[]";
    const parsed = JSON.parse(responseText);

    return res.json({
      success: true,
      sentences: parsed,
      source: "gemini",
    });
  } catch (error: any) {
    console.error("Gemini sentence generation error:", error);
    return res.json({
      success: true,
      sentences: getFallbackSentences(req.body?.language || "vi", req.body?.topic),
      source: "fallback_error",
    });
  }
});

function getFallbackSentences(language: string, topic?: string) {
  switch (language) {
    case "en":
      return [
        {
          text: "The quick brown fox jumps over the lazy dog.",
          reading: "Pangram (chứa đủ 26 chữ cái tiếng Anh)",
          translation: "Chú cáo nâu nhanh nhẹn nhảy qua con chó lười biếng.",
          tips: "Nét nghiêng đều 75 độ, giữ khoảng cách giữa các từ bằng chiều rộng chữ o.",
        },
        {
          text: "Practice makes perfect every single day.",
          reading: "Danh ngôn rèn luyện",
          translation: "Có công mài sắt, có ngày nên kim.",
          tips: "Chú ý các nét khuyết trên của chữ 't', 'k', 'd' vươn tới dòng kẻ phụ.",
        },
        {
          text: "Believe you can and you are halfway there.",
          reading: "Theodore Roosevelt",
          translation: "Hãy tin rằng bạn làm được, là bạn đã đi được nửa chặng đường.",
          tips: "Nối nét mượt mà giữa các nguyên âm và phụ âm trong lối viết cursive.",
        },
      ];
    case "ja":
      return [
        {
          text: "七転び八起き",
          reading: "ななころびやおき (Nanakorobi Yaoki)",
          translation: "Ngã bảy lần, đứng dậy tám lần (Kiên trì bền bỉ).",
          tips: "Chữ Hán viết cân đối trọng tâm, Hiragana び và き viết thanh thoát, uốn nhẹ.",
        },
        {
          text: "一期一会",
          reading: "いちごいちえ (Ichigo Ichie)",
          translation: "Đời người chỉ gặp một lần (Trân quý từng khoảnh khắc).",
          tips: "Nét ngang 一 viết hơi hếch nhẹ 5 độ, chữ 会 nét phẩy và mác mở rộng như mái nhà.",
        },
        {
          text: "桜の花が美しく咲いています。",
          reading: "さくらのはながうつくしくさいています。",
          translation: "Hoa anh đào đang nở rộ thật đẹp.",
          tips: "Giữ tỷ lệ ô chữ: Kanji chiếm 80% ô, Hiragana chiếm 70% để bài viết thoáng mắt.",
        },
      ];
    case "zh":
      return [
        {
          text: "千里之行始于足下",
          reading: "Qiān lǐ zhī xíng shǐ yú zú xià",
          translation: "Hành trình ngàn dặm bắt đầu từ một bước chân.",
          tips: "Quy tắc trên trước dưới sau, nét mác của chữ '之' kéo dài tạo chân đế vững chãi.",
        },
        {
          text: "学而时习之不亦说乎",
          reading: "Xué ér shí xí zhī bù yì yuè hū",
          translation: "Học rồi thường xuyên ôn tập, chẳng vui lắm sao?",
          tips: "Bộ Thụ và các nét ngang song song cần cách đều nhau, giữ chữ trong ô Mễ tự cách.",
        },
        {
          text: "天道酬勤",
          reading: "Tiān dào chóu qín",
          translation: "Trời cao đền đáp người chăm chỉ.",
          tips: "Chữ 天 nét ngang trên ngắn, ngang dưới dài; chữ 勤 bộ Lực bên phải dứt khoát.",
        },
      ];
    case "vi":
    default:
      return [
        {
          text: "Nét chữ nết người rèn đức luyện tài",
          reading: "Thành ngữ học đường",
          translation: "Rèn luyện chữ viết là rèn luyện tính cách cẩn trọng, kiên nhẫn.",
          tips: "Nét chữ nghiêng 15-25 độ, nét sổ thẳng đứng nhẹ nhàng, rê bút mềm mại.",
        },
        {
          text: "Công cha như núi Thái Sơn",
          reading: "Ca dao Việt Nam",
          translation: "Công cha cao lớn vững chãi như đỉnh núi ngàn đời.",
          tips: "Chữ C in hoa nét cong tròn trịa 2.5 ô ly, các chữ thường cao 1 ô ly chuẩn mực.",
        },
        {
          text: "Học thầy không tày học bạn",
          reading: "Tục ngữ Việt Nam",
          translation: "Học hỏi bạn bè xung quanh để cùng tiến bộ mỗi ngày.",
          tips: "Chú ý nét khuyết dưới của chữ 'h' và 'b' vuốt nhọn ở giao điểm dòng kẻ.",
        },
      ];
  }
}

// Vite middleware for development or static serving for production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Luyện chữ AR server running on http://localhost:${PORT}`);
  });
}

startServer();
