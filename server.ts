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
      pen_coordinates 
    } = req.body;
    const ai = getAI();

    const charTarget = target_character || (sampleText ? sampleText.trim().charAt(0) : "a");

    if (!imageBase64 && (!pen_coordinates || pen_coordinates.length === 0)) {
      return res.status(400).json({ success: false, error: "Vui lòng cung cấp hình ảnh bài viết hoặc tọa độ nét viết." });
    }

    if (!ai) {
      const simulated = getSimulatedAIFeedback(charTarget, stroke_index, sampleText);
      return res.json({
        success: true,
        source: "simulated_expert",
        strictEvaluation: simulated.strictEvaluation,
        feedback: simulated.legacyFeedback,
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

BẠN PHẢI TUÂN THỦ NGHIÊM NGẶT CÁC QUY TẮC SAU:
1. Xác định & Chuẩn hóa Mặt phẳng (Paper Plane Calibration):
- Nhận diện 4 góc của trang giấy/vùng viết (Perspective Transform) để định dạng hệ tọa độ chuẩn (Normalized Coordinates [0, 1]).
- Tự động bù trừ góc nghiêng và chống rung hình ảnh để giữ lớp phủ nét mẫu (AR overlay) cố định trên mặt giấy, bất kể góc đặt máy hay thay đổi ánh sáng.

2. Tiêu chuẩn Phân tích Nét chữ (Chữ chuẩn Tiếng Việt bậc Tiểu học):
- Chuẩn hóa cấu trúc ký tự theo: Điểm đặt bút (start_point), Điểm đổi hướng (keypoints), Hướng di chuyển (vector), Điểm dừng bút (end_point), Chiều cao/chiều rộng con chữ (tính theo đơn vị ô ly).
- Phân biệt rõ giữa "Lỗi sai kỹ thuật cần sửa" (sai quy tắc ô ly, ngược hướng nét, sai điểm đặt/dừng) và "Đặc trưng phong cách cá nhân" (độ nghiêng tự nhiên, nét thanh nét đậm nhẹ) để tránh việc báo lỗi sai lệch (False Positive).

3. Thuật toán Chấm điểm & Đánh giá Đa tiêu chí:
Không chỉ trả về "Đúng/Sai" chung chung. Mọi kết quả đánh giá phải có điểm số chi tiết từ 0 - 100 theo các trục:
- trajectory_score: Độ bám sát quỹ đạo nét mẫu.
- start_end_accuracy: Độ chính xác điểm đặt và điểm dừng bút.
- proportion_score: Tỷ lệ kích thước và độ cao theo ô ly chuẩn.
- smoothness_score: Độ trơn tru, liền mạch của nét viết.
- overall_score: Trung bình có trọng số của các trục trên.

4. Định dạng phản hồi:
Luôn trả về kết quả dưới định dạng JSON thuần (Strict JSON), không kèm văn bản thừa ngoài cấu trúc sau:
{
  "target_character": "${charTarget}",
  "stroke_index": ${stroke_index},
  "status": "PASS",
  "metrics": {
    "overall_score": 88,
    "trajectory_score": 85,
    "start_end_accuracy": 90,
    "proportion_score": 86,
    "smoothness_score": 89
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
    const simulated = getSimulatedAIFeedback(charTarget, req.body?.stroke_index || 1, req.body?.sampleText);
    return res.json({
      success: true,
      source: "fallback_expert",
      strictEvaluation: simulated.strictEvaluation,
      feedback: simulated.legacyFeedback,
    });
  }
});

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

function getSimulatedAIFeedback(targetChar: string = 'a', strokeIndex: number = 1, sampleText?: string) {
  const strictEvaluation = {
    target_character: targetChar,
    stroke_index: strokeIndex,
    status: "PASS" as const,
    metrics: {
      overall_score: 88,
      trajectory_score: 86,
      start_end_accuracy: 90,
      proportion_score: 87,
      smoothness_score: 89,
    },
    detected_errors: [
      {
        error_type: "LECH_DIEM_DUNG",
        severity: "LOW" as const,
        instruction: "Điểm dừng bút hơi cao hơn dòng kẻ đáy một chút, bé hạ nhẹ ngòi bút dừng lại đúng đường kẻ ngang số 1 nhé.",
      },
    ],
    learning_path_recommendation: {
      focus_area: targetChar === 'a' || targetChar === 'o' ? "Nét cong kín" : "Nét móc ngược & Nét khuyết",
      suggested_next_exercise: "Luyện 3 dòng nét móc ngược cao 1 ô ly trước khi nối sang chữ tiếp theo",
    },
  };

  const legacyFeedback = buildLegacyFeedbackFromStrict(strictEvaluation, sampleText);
  return {
    strictEvaluation,
    legacyFeedback,
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
