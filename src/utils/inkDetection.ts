/**
 * Real Ink Density, Multi-Surface Stroke / Contour Detection & Computer Vision Module
 * Hỗ trợ nhận diện chữ viết trên BẤT KỲ MẶT PHẲNG NÀO: Giấy kẻ ô ly, bảng đen con, mặt bàn phẳng, bìa tập...
 * 
 * TIỀN KIỂM TRA PHÁT HIỆN NÉT CHỮ (PRE-VALIDATION STROKE & CONTOUR DETECTION):
 * 1. extractHandwritingStrokes(roiImage):
 *    - Sử dụng thuật toán Sobel Gradient kết hợp Adaptive Thresholding đa bề mặt.
 *    - Nhận diện phân cực: Nét tối trên nền sáng (giấy, bàn gỗ) HOẶC Nét sáng trên nền tối (bảng đen, bảng con).
 *    - Trích xuất các Contours và phân tích hình học nét: Chiều dài, độ cong, tính liên tục, loại bỏ nhiễu hạt và viền kẻ.
 *    - Nếu camera chỉ quay lên trần nhà, bóng đèn sáng lóa, hoặc mặt phẳng còn trống chưa viết chữ:
 *      => hasStrokes = false, totalLength < MIN_STROKE_LENGTH.
 *      => Lập tức dừng lượt chấm điểm, KHÔNG mở popup điểm ảo, phát tiếng bíp cảnh báo Web Audio API.
 * 
 * 2. evaluateAgainstTemplate / evaluateHandwriting:
 *    - Căn chỉnh trọng tâm Bounding Box & Scale bù trừ camera.
 *    - Chamfer Distance Transform (bán kính r = 25px - 35px).
 *    - Rút trích Centerline Skeleton (không phụ thuộc ngòi bút 0.38mm hay ngòi to).
 *    - Xóa bỏ triệt để mọi logic gán điểm mặc định ảo (65/100, 97%).
 *    - Nếu viết sai hoàn toàn mẫu chữ: Điểm < 40 điểm, thông báo rõ nét viết chưa đúng mẫu.
 */

import { StrokePath } from '../types';
import { getStrokesForCharacter } from '../data/strokeData';

// Chiều dài nét chữ tối thiểu bắt buộc trên khung chuẩn 360x360 (pixels)
export const MIN_STROKE_LENGTH = 55;

export const NO_STROKES_DETECTED_MESSAGE = 
  "⚠️ Chưa phát hiện nét chữ trên mặt phẳng! Vui lòng viết chữ theo mẫu rồi bấm Chấm điểm lại nhé.";

export const NO_INK_WARNING_MESSAGE = NO_STROKES_DETECTED_MESSAGE;

export interface DetectedContourStroke {
  id: number;
  points: Array<{ x: number; y: number }>;
  length: number;
  area: number;
  width: number;
  height: number;
  aspectRatio: number;
  isStraightGridLine: boolean;
}

export interface HandwritingStrokeDetectionResult {
  hasStrokes: boolean;
  strokes: DetectedContourStroke[];
  totalLength: number;
  totalArea: number;
  surfaceType: 'paper_white' | 'chalkboard_dark' | 'wood_desk' | 'generic_flat';
  polarity: 'dark_on_light' | 'light_on_dark';
  meanLuminance: number;
  stdDev: number;
  message?: string;
  canvasElement?: HTMLCanvasElement;
  canvasDataUrl?: string;
}

export interface InkDetectionResult {
  hasInk: boolean;
  hasStrokes?: boolean;
  message?: string;
  inkRatio: number;
  meanLuminance: number;
  stdDev: number;
  edgeCount: number;
  contrastRatio: number;
  canvasDataUrl?: string;
  canvasElement?: HTMLCanvasElement;
}

export interface StrokeEvaluationResult {
  hasInk: boolean;
  hasStrokes: boolean;
  message?: string;
  finalScore: number; // 0 - 100 (alias: finalCalculatedScore)
  finalCalculatedScore: number; // 0 - 100
  trajectoryScore: number; // 0 - 50 (Trajectory Accuracy)
  completenessScore: number; // 0 - 30 (Centerline Completeness)
  proportionScore: number; // 0 - 20 (Height & Aspect Ratio)
  penalty: number;
  precision: number;
  recall: number;
  totalInkPoints: number;
  pointsInSafeZone: number;
  centerlineCoverage: number;
  userInkPixels: number;
  inTemplatePixels: number;
  outOfBoundsPixels: number;
  status: 'PASS' | 'NEEDS_IMPROVEMENT' | 'FAIL';
  warningText?: string;
  debugOverlayUrl?: string;
}

export interface ROIBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Trích xuất ảnh vùng viết (ROI) từ thẻ <video> hoặc ảnh, căn chỉnh chính xác theo khung ô ly AR trên màn hình
 */
export function captureWritingArea(
  video: HTMLVideoElement,
  roiElement?: HTMLElement | null
): HTMLCanvasElement {
  const targetSize = 360;
  const canvas = document.createElement('canvas');
  canvas.width = targetSize;
  canvas.height = targetSize;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });

  if (!ctx || !video || video.videoWidth === 0 || video.videoHeight === 0) {
    return canvas;
  }

  const vWidth = video.videoWidth;
  const vHeight = video.videoHeight;
  let cropX = 0, cropY = 0, cropW = vWidth, cropH = vHeight;

  if (roiElement && typeof HTMLElement !== 'undefined' && roiElement instanceof HTMLElement) {
    const videoRect = video.getBoundingClientRect();
    const frameRect = roiElement.getBoundingClientRect();

    if (videoRect.width > 0 && videoRect.height > 0) {
      const videoAspect = vWidth / vHeight;
      const containerAspect = videoRect.width / videoRect.height;
      let scale = 1, offsetX = 0, offsetY = 0;

      if (videoAspect > containerAspect) {
        const renderedWidth = videoRect.height * videoAspect;
        offsetX = (renderedWidth - videoRect.width) / 2;
        scale = vHeight / videoRect.height;
      } else {
        const renderedHeight = videoRect.width / videoAspect;
        offsetY = (renderedHeight - videoRect.height) / 2;
        scale = vWidth / videoRect.width;
      }

      const relX = frameRect.left - videoRect.left;
      const relY = frameRect.top - videoRect.top;

      cropX = Math.max(0, Math.floor((relX + offsetX) * scale));
      cropY = Math.max(0, Math.floor((relY + offsetY) * scale));
      cropW = Math.min(vWidth - cropX, Math.floor(frameRect.width * scale));
      cropH = Math.min(vHeight - cropY, Math.floor(frameRect.height * scale));
    }
  }

  // Fallback khung vuông trung tâm 60%
  if (cropW <= 20 || cropH <= 20) {
    const size = Math.min(vWidth, vHeight) * 0.60;
    cropX = Math.floor((vWidth - size) / 2);
    cropY = Math.floor((vHeight - size) / 2);
    cropW = Math.floor(size);
    cropH = Math.floor(size);
  }

  ctx.drawImage(video, cropX, cropY, cropW, cropH, 0, 0, targetSize, targetSize);
  return canvas;
}

/**
 * THUẬT TOÁN TIỀN KIỂM TRA PHÁT HIỆN NÉT CHỮ TRÊN MẶT PHẲNG (extractHandwritingStrokes)
 * 
 * Kiểm tra xem có nét chữ thật được viết trên mặt phẳng (giấy, bảng, bàn...) hay không.
 * Tách biệt hoàn toàn với trần nhà, bóng đèn, hoặc mặt phẳng trống trơn.
 */
export function extractHandwritingStrokes(
  roiInput: HTMLCanvasElement | HTMLVideoElement | ImageData,
  options?: {
    minStrokeLength?: number;
    toleranceThreshold?: number;
  }
): HandwritingStrokeDetectionResult {
  const minLength = options?.minStrokeLength || MIN_STROKE_LENGTH;

  // Chuẩn hóa lấy đối tượng ImageData từ Canvas hoặc Video
  let imageData: ImageData;
  let canvasElem: HTMLCanvasElement | undefined = undefined;

  if (typeof HTMLCanvasElement !== 'undefined' && roiInput instanceof HTMLCanvasElement) {
    canvasElem = roiInput;
    const ctx = roiInput.getContext('2d', { willReadFrequently: true });
    if (!ctx) {
      return {
        hasStrokes: false,
        strokes: [],
        totalLength: 0,
        totalArea: 0,
        surfaceType: 'paper_white',
        polarity: 'dark_on_light',
        meanLuminance: 0,
        stdDev: 0,
        message: NO_STROKES_DETECTED_MESSAGE,
      };
    }
    imageData = ctx.getImageData(0, 0, roiInput.width, roiInput.height);
  } else if (typeof HTMLVideoElement !== 'undefined' && roiInput instanceof HTMLVideoElement) {
    canvasElem = captureWritingArea(roiInput);
    const ctx = canvasElem.getContext('2d', { willReadFrequently: true });
    imageData = ctx!.getImageData(0, 0, canvasElem.width, canvasElem.height);
  } else if (roiInput && 'data' in roiInput) {
    imageData = roiInput as ImageData;
  } else {
    return {
      hasStrokes: false,
      strokes: [],
      totalLength: 0,
      totalArea: 0,
      surfaceType: 'paper_white',
      polarity: 'dark_on_light',
      meanLuminance: 0,
      stdDev: 0,
      message: NO_STROKES_DETECTED_MESSAGE,
    };
  }

  const { width, height, data } = imageData;
  const totalPixels = width * height;

  if (totalPixels === 0) {
    return {
      hasStrokes: false,
      strokes: [],
      totalLength: 0,
      totalArea: 0,
      surfaceType: 'paper_white',
      polarity: 'dark_on_light',
      meanLuminance: 0,
      stdDev: 0,
      message: NO_STROKES_DETECTED_MESSAGE,
    };
  }

  // 1. Chuyển ảnh sang mức xám và tính độ sáng trung bình (Mean Luminance)
  const grays = new Float32Array(totalPixels);
  let sumLum = 0;

  for (let i = 0; i < totalPixels; i++) {
    const idx = i * 4;
    const lum = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
    grays[i] = lum;
    sumLum += lum;
  }
  const meanLuminance = sumLum / totalPixels;

  // 2. Tính độ lệch chuẩn màu (Standard Deviation)
  let sumSq = 0;
  for (let i = 0; i < totalPixels; i++) {
    const d = grays[i] - meanLuminance;
    sumSq += d * d;
  }
  const stdDev = Math.sqrt(sumSq / totalPixels);

  // CHẶN NGAY CÁC TRƯỜNG HỢP CAMERA KHÔNG QUAY VÀO MẶT PHẲNG VIẾT BÀI:
  // a) Quay vào trần nhà hoặc bóng đèn sáng lóa (Mean cực cao, StdDev thấp/vừa)
  if (meanLuminance > 240 && stdDev < 20) {
    return {
      hasStrokes: false,
      strokes: [],
      totalLength: 0,
      totalArea: 0,
      surfaceType: 'generic_flat',
      polarity: 'dark_on_light',
      meanLuminance,
      stdDev,
      message: NO_STROKES_DETECTED_MESSAGE,
    };
  }

  // b) Bề mặt đồng nhất không có nét tương phản (Tường trắng trống trơn, mặt giấy chưa viết)
  if (stdDev < 9.0) {
    return {
      hasStrokes: false,
      strokes: [],
      totalLength: 0,
      totalArea: 0,
      surfaceType: 'generic_flat',
      polarity: 'dark_on_light',
      meanLuminance,
      stdDev,
      message: NO_STROKES_DETECTED_MESSAGE,
    };
  }

  // c) Camera bị che kín hoặc quá tối (< 22)
  if (meanLuminance < 22 && stdDev < 10) {
    return {
      hasStrokes: false,
      strokes: [],
      totalLength: 0,
      totalArea: 0,
      surfaceType: 'generic_flat',
      polarity: 'light_on_dark',
      meanLuminance,
      stdDev,
      message: NO_STROKES_DETECTED_MESSAGE,
    };
  }

  // 3. Nhận diện loại mặt phẳng & Phân cực nét vẽ (Dark-on-Light vs Light-on-Dark)
  // Xây dựng histogram độ sáng
  const hist = new Int32Array(256);
  for (let i = 0; i < totalPixels; i++) {
    hist[Math.min(255, Math.max(0, Math.floor(grays[i])))]++;
  }

  let surfaceType: 'paper_white' | 'chalkboard_dark' | 'wood_desk' | 'generic_flat' = 'paper_white';
  let polarity: 'dark_on_light' | 'light_on_dark' = 'dark_on_light';
  let surfaceBg = 200;

  if (meanLuminance < 95) {
    // Bảng đen, bảng con màu xanh/đen, mặt bàn tối: Phấn trắng / nét sáng trên nền tối
    surfaceType = 'chalkboard_dark';
    polarity = 'light_on_dark';

    let acc = 0;
    const targetDarkBg = Math.floor(totalPixels * 0.20);
    for (let b = 0; b < 256; b++) {
      acc += hist[b];
      if (acc >= targetDarkBg) {
        surfaceBg = b;
        break;
      }
    }
  } else {
    // Giấy trắng, tập ô ly, bảng trắng, bàn gỗ: Mực tối trên nền sáng
    surfaceType = meanLuminance > 185 ? 'paper_white' : 'wood_desk';
    polarity = 'dark_on_light';

    let acc = 0;
    const targetLightBg = Math.floor(totalPixels * 0.85);
    for (let b = 0; b < 256; b++) {
      acc += hist[b];
      if (acc >= targetLightBg) {
        surfaceBg = b;
        break;
      }
    }
  }

  // 4. Thuật toán phân tách biên Sobel kết hợp Adaptive Thresholding
  const binaryMask = new Uint8Array(totalPixels);
  const strokeContrastThreshold = 26;

  for (let y = 1; y < height - 1; y++) {
    const row = y * width;
    for (let x = 1; x < width - 1; x++) {
      const idx = row + x;
      const val = grays[idx];

      // Kiểm tra độ tương phản tương đối so với nền mặt phẳng
      let isContrastMatch = false;
      if (polarity === 'dark_on_light') {
        isContrastMatch = val <= (surfaceBg - strokeContrastThreshold);
      } else {
        isContrastMatch = val >= (surfaceBg + strokeContrastThreshold);
      }

      if (!isContrastMatch) continue;

      // Tính Sobel Gradient Magnitude 3x3
      // [-1 0 1]
      // [-2 0 2]
      // [-1 0 1]
      const gx = (
        grays[idx - width + 1] + 2 * grays[idx + 1] + grays[idx + width + 1]
      ) - (
        grays[idx - width - 1] + 2 * grays[idx - 1] + grays[idx + width - 1]
      );

      // [-1 -2 -1]
      // [ 0  0  0]
      // [ 1  2  1]
      const gy = (
        grays[idx + width - 1] + 2 * grays[idx + width] + grays[idx + width + 1]
      ) - (
        grays[idx - width - 1] + 2 * grays[idx - width] + grays[idx - width + 1]
      );

      const grad = Math.abs(gx) + Math.abs(gy);

      // Nét bút/phấn thật có biên cạnh sắc nét (grad >= 28)
      if (grad >= 28) {
        binaryMask[idx] = 1;
      }
    }
  }

  // 5. Trích xuất đường bao (Contours) qua thuật toán Connected Component Labeling (8-hướng)
  const visited = new Uint8Array(totalPixels);
  const detectedContours: DetectedContourStroke[] = [];
  let contourIdCounter = 1;

  for (let y = 1; y < height - 1; y++) {
    const row = y * width;
    for (let x = 1; x < width - 1; x++) {
      const startIdx = row + x;
      if (binaryMask[startIdx] === 0 || visited[startIdx] === 1) continue;

      // Bắt đầu duyệt BFS thành phần liên thông
      const queue: number[] = [startIdx];
      visited[startIdx] = 1;

      let minX = x, maxX = x, minY = y, maxY = y;
      const strokePoints: Array<{ x: number; y: number }> = [];

      let head = 0;
      while (head < queue.length) {
        const currIdx = queue[head++];
        const cy = Math.floor(currIdx / width);
        const cx = currIdx % width;

        if (cx < minX) minX = cx;
        if (cx > maxX) maxX = cx;
        if (cy < minY) minY = cy;
        if (cy > maxY) maxY = cy;

        strokePoints.push({ x: cx, y: cy });

        // 8 hướng lân cận
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) continue;
            const ny = cy + dy;
            const nx = cx + dx;
            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
              const nIdx = ny * width + nx;
              if (binaryMask[nIdx] === 1 && visited[nIdx] === 0) {
                visited[nIdx] = 1;
                queue.push(nIdx);
              }
            }
          }
        }
      }

      const compWidth = maxX - minX + 1;
      const compHeight = maxY - minY + 1;
      const compArea = strokePoints.length;

      // Ước lượng chiều dài nét đường cong:
      // Kết hợp đường chéo bounding box và độ dài nét bút
      const diagonal = Math.sqrt(compWidth * compWidth + compHeight * compHeight);
      const estimatedLength = Math.max(diagonal, Math.round(compArea / 2.2));

      // LOẠI BỎ NHIỄU:
      // a) Hạt bụi, chấm mực li ti (diện tích < 15 hoặc dài < 12px)
      if (compArea < 15 || estimatedLength < 12) continue;

      // b) Đường viền kẻ in sẵn của trang vở kéo dài gần hết màn hình (đường thẳng tắp)
      const isStraightGridLine = (
        (compWidth > width * 0.90 && compHeight <= 3) ||
        (compHeight > height * 0.90 && compWidth <= 3)
      );
      if (isStraightGridLine) continue;

      const aspectRatio = compHeight / Math.max(1, compWidth);

      detectedContours.push({
        id: contourIdCounter++,
        points: strokePoints,
        length: estimatedLength,
        area: compArea,
        width: compWidth,
        height: compHeight,
        aspectRatio,
        isStraightGridLine: false,
      });
    }
  }

  // 6. Tính tổng độ dài nét vẽ và diện tích phát hiện
  const totalLength = detectedContours.reduce((sum, s) => sum + s.length, 0);
  const totalArea = detectedContours.reduce((sum, s) => sum + s.area, 0);

  // TIÊU CHÍ XÁC NHẬN CÓ NÉT CHỮ THỰC TẾ TRÊN MẶT PHẲNG:
  // - Có ít nhất 1 nét viết nổi bật dài >= 28px
  // - Tổng chiều dài các nét >= MIN_STROKE_LENGTH (55px)
  // - Tổng diện tích nét viết >= 45 pixels
  const hasProminentStroke = detectedContours.some(s => s.length >= 28);
  const hasStrokes = (
    detectedContours.length > 0 &&
    totalLength >= minLength &&
    totalArea >= 45 &&
    hasProminentStroke
  );

  return {
    hasStrokes,
    strokes: hasStrokes ? detectedContours : [],
    totalLength,
    totalArea,
    surfaceType,
    polarity,
    meanLuminance,
    stdDev,
    message: hasStrokes ? undefined : NO_STROKES_DETECTED_MESSAGE,
    canvasElement: canvasElem,
    canvasDataUrl: canvasElem ? canvasElem.toDataURL('image/jpeg', 0.88) : undefined,
  };
}

/**
 * Hàm phân tích tương thích ngược phát hiện mực từ video
 */
export function detectInkFromVideo(
  video: HTMLVideoElement,
  roi?: ROIBox | HTMLElement | null
): InkDetectionResult {
  const roiCanvas = captureWritingArea(video, roi as HTMLElement);
  const strokeCheck = extractHandwritingStrokes(roiCanvas);

  return {
    hasInk: strokeCheck.hasStrokes,
    hasStrokes: strokeCheck.hasStrokes,
    message: strokeCheck.hasStrokes ? undefined : NO_STROKES_DETECTED_MESSAGE,
    inkRatio: strokeCheck.totalArea / (roiCanvas.width * roiCanvas.height),
    meanLuminance: strokeCheck.meanLuminance,
    stdDev: strokeCheck.stdDev,
    edgeCount: strokeCheck.totalLength,
    contrastRatio: strokeCheck.stdDev / 100,
    canvasElement: roiCanvas,
    canvasDataUrl: roiCanvas.toDataURL('image/jpeg', 0.88),
  };
}

/**
 * Trích xuất nét chữ từ nguồn ảnh chuỗi base64 hoặc URL
 */
export async function detectInkFromImage(
  imageSrc: string
): Promise<InkDetectionResult> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const targetSize = 360;
      canvas.width = targetSize;
      canvas.height = targetSize;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) {
        resolve({
          hasInk: false,
          hasStrokes: false,
          message: NO_STROKES_DETECTED_MESSAGE,
          inkRatio: 0,
          meanLuminance: 0,
          stdDev: 0,
          edgeCount: 0,
          contrastRatio: 0,
        });
        return;
      }

      ctx.drawImage(img, 0, 0, targetSize, targetSize);
      const strokeCheck = extractHandwritingStrokes(canvas);

      resolve({
        hasInk: strokeCheck.hasStrokes,
        hasStrokes: strokeCheck.hasStrokes,
        message: strokeCheck.hasStrokes ? undefined : NO_STROKES_DETECTED_MESSAGE,
        inkRatio: strokeCheck.totalArea / (targetSize * targetSize),
        meanLuminance: strokeCheck.meanLuminance,
        stdDev: strokeCheck.stdDev,
        edgeCount: strokeCheck.totalLength,
        contrastRatio: strokeCheck.stdDev / 100,
        canvasElement: canvas,
        canvasDataUrl: canvas.toDataURL('image/jpeg', 0.88),
      });
    };
    img.onerror = () => {
      resolve({
        hasInk: false,
        hasStrokes: false,
        message: NO_STROKES_DETECTED_MESSAGE,
        inkRatio: 0,
        meanLuminance: 0,
        stdDev: 0,
        edgeCount: 0,
        contrastRatio: 0,
      });
    };
    img.src = imageSrc;
  });
}

/**
 * Trích xuất danh sách các điểm trục xương sống (Centerline Points) của chữ mẫu
 */
function extractTemplateCenterlinePoints(
  characterTemplate: string | StrokePath[],
  width: number,
  height: number
): Array<{ x: number; y: number; strokeId?: number }> {
  let strokes: StrokePath[] = [];
  let textLabel = '';

  if (Array.isArray(characterTemplate)) {
    strokes = characterTemplate;
  } else if (typeof characterTemplate === 'string') {
    textLabel = characterTemplate;
    strokes = getStrokesForCharacter(characterTemplate);
  }

  const points: Array<{ x: number; y: number; strokeId?: number }> = [];

  // Lấy mẫu đều dọc theo vector SVG bằng getPointAtLength
  if (strokes && strokes.length > 0 && typeof document !== 'undefined') {
    try {
      const scaleX = width / 100;
      const scaleY = height / 100;

      for (const stroke of strokes) {
        if (!stroke.d) continue;
        const svgPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        svgPath.setAttribute('d', stroke.d);
        const totalLen = svgPath.getTotalLength ? svgPath.getTotalLength() : 100;
        
        const sampleStep = 2.0;
        const steps = Math.max(15, Math.ceil(totalLen / sampleStep));

        for (let i = 0; i <= steps; i++) {
          const l = (i / steps) * totalLen;
          const pt = svgPath.getPointAtLength(l);
          points.push({
            x: pt.x * scaleX,
            y: pt.y * scaleY,
            strokeId: stroke.id,
          });
        }
      }
    } catch {
      // ignore
    }
  }

  // Fallback: Vẽ text font lên canvas nếu không có SVG path
  if (points.length === 0) {
    const skelCanvas = document.createElement('canvas');
    skelCanvas.width = width;
    skelCanvas.height = height;
    const sCtx = skelCanvas.getContext('2d', { willReadFrequently: true });

    if (sCtx) {
      sCtx.clearRect(0, 0, width, height);
      sCtx.strokeStyle = '#FFFFFF';
      sCtx.lineWidth = 4;
      sCtx.lineCap = 'round';
      sCtx.lineJoin = 'round';

      const fontSize = Math.round(height * 0.65);
      sCtx.font = `bold ${fontSize}px 'Be Vietnam Pro', cursive, sans-serif`;
      sCtx.textAlign = 'center';
      sCtx.textBaseline = 'middle';
      sCtx.strokeText(textLabel || 'a', width / 2, height / 2);

      const sImg = sCtx.getImageData(0, 0, width, height);
      const sData = sImg.data;

      for (let y = 0; y < height; y += 3) {
        for (let x = 0; x < width; x += 3) {
          const idx = (y * width + x) * 4;
          if (sData[idx + 3] > 60) {
            points.push({ x, y });
          }
        }
      }
    }
  }

  return points;
}

/**
 * HÀM ĐỐI CHIẾU CHẤM ĐIỂM VỚI MẪU (evaluateAgainstTemplate / evaluateHandwriting)
 * 
 * CHỈ ĐƯỢC GỌI SAU KHI ĐÃ XÁC NHẬN CÓ CHỮ THẬT BẰNG extractHandwritingStrokes.
 * Xóa bỏ hoàn toàn giá trị tự gán ảo. Nếu viết sai hoàn toàn mẫu chữ, điểm < 40 điểm!
 */
export function evaluateHandwriting(
  canvasVideoSnapshot: HTMLCanvasElement,
  characterTemplate: string | StrokePath[],
  options?: {
    tolerancePx?: number;
    logDebug?: boolean;
    preValidatedStrokes?: DetectedContourStroke[];
  }
): StrokeEvaluationResult {
  if (!canvasVideoSnapshot || canvasVideoSnapshot.width === 0 || canvasVideoSnapshot.height === 0) {
    return {
      hasInk: false,
      hasStrokes: false,
      message: NO_STROKES_DETECTED_MESSAGE,
      finalScore: 0,
      finalCalculatedScore: 0,
      trajectoryScore: 0,
      completenessScore: 0,
      proportionScore: 0,
      penalty: 0,
      precision: 0,
      recall: 0,
      totalInkPoints: 0,
      pointsInSafeZone: 0,
      centerlineCoverage: 0,
      userInkPixels: 0,
      inTemplatePixels: 0,
      outOfBoundsPixels: 0,
      status: 'FAIL',
      warningText: NO_STROKES_DETECTED_MESSAGE,
    };
  }

  // 1. TIỀN KIỂM TRA PHÁT HIỆN NÉT CHỮ THỰC TẾ
  const strokeCheck = extractHandwritingStrokes(canvasVideoSnapshot);
  if (!strokeCheck.hasStrokes || strokeCheck.totalLength < MIN_STROKE_LENGTH) {
    return {
      hasInk: false,
      hasStrokes: false,
      message: NO_STROKES_DETECTED_MESSAGE,
      finalScore: 0,
      finalCalculatedScore: 0,
      trajectoryScore: 0,
      completenessScore: 0,
      proportionScore: 0,
      penalty: 0,
      precision: 0,
      recall: 0,
      totalInkPoints: 0,
      pointsInSafeZone: 0,
      centerlineCoverage: 0,
      userInkPixels: 0,
      inTemplatePixels: 0,
      outOfBoundsPixels: 0,
      status: 'FAIL',
      warningText: NO_STROKES_DETECTED_MESSAGE,
    };
  }

  const width = canvasVideoSnapshot.width;
  const height = canvasVideoSnapshot.height;

  // 2. Trích xuất đường xương sống chữ mẫu
  const templatePoints = extractTemplateCenterlinePoints(characterTemplate, width, height);
  if (templatePoints.length === 0) {
    throw new Error('Không thể khởi tạo đường nét mẫu chuẩn');
  }

  let tMinX = Infinity, tMaxX = -Infinity, tMinY = Infinity, tMaxY = -Infinity;
  let tSumX = 0, tSumY = 0;

  for (const pt of templatePoints) {
    if (pt.x < tMinX) tMinX = pt.x;
    if (pt.x > tMaxX) tMaxX = pt.x;
    if (pt.y < tMinY) tMinY = pt.y;
    if (pt.y > tMaxY) tMaxY = pt.y;
    tSumX += pt.x;
    tSumY += pt.y;
  }

  const tWidth = Math.max(1, tMaxX - tMinX);
  const tHeight = Math.max(1, tMaxY - tMinY);
  const tCentroidX = tSumX / templatePoints.length;
  const tCentroidY = tSumY / templatePoints.length;
  const templateAspectRatio = tHeight / tWidth;

  // 3. Gom tất cả các điểm mực người dùng từ các contour hợp lệ
  const rawUserInkPoints: Array<{ x: number; y: number }> = [];
  for (const stroke of strokeCheck.strokes) {
    for (const pt of stroke.points) {
      rawUserInkPoints.push(pt);
    }
  }

  const userInkPixels = rawUserInkPoints.length;

  // 4. Tự động căn chỉnh Trọng tâm & Scale
  let uMinX = Infinity, uMaxX = -Infinity, uMinY = Infinity, uMaxY = -Infinity;
  let uSumX = 0, uSumY = 0;

  for (const pt of rawUserInkPoints) {
    if (pt.x < uMinX) uMinX = pt.x;
    if (pt.x > uMaxX) uMaxX = pt.x;
    if (pt.y < uMinY) uMinY = pt.y;
    if (pt.y > uMaxY) uMaxY = pt.y;
    uSumX += pt.x;
    uSumY += pt.y;
  }

  const uWidth = Math.max(1, uMaxX - uMinX);
  const uHeight = Math.max(1, uMaxY - uMinY);
  const uCentroidX = uSumX / userInkPixels;
  const uCentroidY = uSumY / userInkPixels;
  const userAspectRatio = uHeight / uWidth;

  const maxShiftX = width * 0.28;
  const maxShiftY = height * 0.28;
  const shiftX = Math.max(-maxShiftX, Math.min(maxShiftX, tCentroidX - uCentroidX));
  const shiftY = Math.max(-maxShiftY, Math.min(maxShiftY, tCentroidY - uCentroidY));

  const scaleRatioH = tHeight / uHeight;
  const scaleRatioW = tWidth / uWidth;
  const naturalScale = Math.sqrt(scaleRatioH * scaleRatioW);
  const normScale = Math.max(0.80, Math.min(1.25, naturalScale));

  const alignedUserPoints: Array<{ x: number; y: number }> = [];
  for (const pt of rawUserInkPoints) {
    alignedUserPoints.push({
      x: (uCentroidX + shiftX) + (pt.x - uCentroidX) * normScale,
      y: (uCentroidY + shiftY) + (pt.y - uCentroidY) * normScale,
    });
  }

  // 5. Chamfer Distance Transform với Spatial Grid
  const toleranceR = options?.tolerancePx || Math.max(25, Math.min(35, Math.round(width * 0.08)));
  const doubleR = toleranceR * 2.0;

  const cellSize = toleranceR;
  const gridCols = Math.ceil(width / cellSize) + 2;
  const spatialGrid: Map<number, Array<{ x: number; y: number; index: number }>> = new Map();

  for (let i = 0; i < templatePoints.length; i++) {
    const tp = templatePoints[i];
    const key = Math.floor(tp.y / cellSize) * gridCols + Math.floor(tp.x / cellSize);
    if (!spatialGrid.has(key)) spatialGrid.set(key, []);
    spatialGrid.get(key)!.push({ x: tp.x, y: tp.y, index: i });
  }

  function getMinDistance(px: number, py: number): { dist: number; nearestIdx: number } {
    let minDist = Infinity;
    let nearestIdx = 0;
    const cX = Math.floor(px / cellSize);
    const cY = Math.floor(py / cellSize);

    for (let dy = -2; dy <= 2; dy++) {
      for (let dx = -2; dx <= 2; dx++) {
        const cell = spatialGrid.get((cY + dy) * gridCols + (cX + dx));
        if (cell) {
          for (let k = 0; k < cell.length; k++) {
            const tp = cell[k];
            const distSq = (px - tp.x) * (px - tp.x) + (py - tp.y) * (py - tp.y);
            if (distSq < minDist) {
              minDist = distSq;
              nearestIdx = tp.index;
            }
          }
        }
      }
    }
    return { dist: Math.sqrt(minDist), nearestIdx };
  }

  const totalInkPoints = alignedUserPoints.length;
  let pointsInSafeZone = 0;
  let sumTrajectoryScore = 0;
  let outOfBoundsCount = 0;
  const templateCoveredFlags = new Uint8Array(templatePoints.length);

  for (let i = 0; i < totalInkPoints; i++) {
    const pt = alignedUserPoints[i];
    const { dist, nearestIdx } = getMinDistance(pt.x, pt.y);

    if (dist <= toleranceR) {
      pointsInSafeZone++;
      sumTrajectoryScore += 1.0;
      templateCoveredFlags[nearestIdx] = 1;
    } else if (dist <= doubleR) {
      const decayScore = 1.0 - (dist - toleranceR) / toleranceR;
      sumTrajectoryScore += Math.max(0, decayScore);
      templateCoveredFlags[nearestIdx] = 1;
    } else {
      outOfBoundsCount++;
    }
  }

  // 6. Centerline Coverage
  let coveredCheckpointCount = 0;
  for (let i = 0; i < templatePoints.length; i++) {
    if (templateCoveredFlags[i] === 1) coveredCheckpointCount++;
  }
  const rawCoverage = templatePoints.length > 0 ? (coveredCheckpointCount / templatePoints.length) : 0;
  const centerlineCoverage = Math.min(1.0, rawCoverage * 1.15);

  // 7. Điểm cân đối ô ly (Proportion & Height - 20%)
  const aspectDiff = Math.abs(userAspectRatio - templateAspectRatio) / Math.max(0.1, templateAspectRatio);
  const heightDiff = Math.abs(uHeight - tHeight) / Math.max(1, tHeight);
  let proportionScore = 20;

  if (aspectDiff <= 0.25 && heightDiff <= 0.30) {
    proportionScore = 20;
  } else {
    const overDiff = Math.max(aspectDiff - 0.25, heightDiff - 0.30);
    proportionScore = Math.max(4, Math.round(20 * (1 - Math.min(0.8, overDiff * 1.2))));
  }

  // 8. Điểm Trajectory & Completeness
  const trajectoryScore = (totalInkPoints > 0 ? (sumTrajectoryScore / totalInkPoints) : 0) * 50;
  const completenessScore = centerlineCoverage * 30;

  let rawFinal = trajectoryScore + completenessScore + proportionScore;

  // Phạt mực lệch ô ly
  const outRatio = totalInkPoints > 0 ? (outOfBoundsCount / totalInkPoints) : 0;
  let penalty = 0;
  if (outRatio > 0.15) {
    penalty = Math.min(35, Math.round((outRatio - 0.15) * 45));
    rawFinal -= penalty;
  }

  // YÊU CẦU BẮT BUỘC: Nếu phát hiện nét chữ nhưng sai hoàn toàn so với chữ mẫu:
  // Tổng điểm phải < 40 điểm, thông báo rõ nét viết chưa đúng mẫu chữ yêu cầu.
  const safeRatio = totalInkPoints > 0 ? (pointsInSafeZone / totalInkPoints) : 0;
  const isWrongLetter = safeRatio < 0.40 || centerlineCoverage < 0.35;

  if (isWrongLetter) {
    // Ép điểm xuống dưới 40 điểm theo đúng quy định
    rawFinal = Math.min(35, Math.round(safeRatio * 70));
    if (safeRatio < 0.22) {
      rawFinal = Math.min(22, rawFinal);
    }
  }

  const finalCalculatedScore = Math.max(12, Math.min(98, Math.round(rawFinal)));

  let status: 'PASS' | 'NEEDS_IMPROVEMENT' | 'FAIL' = 'PASS';
  let warningText: string | undefined = undefined;

  if (finalCalculatedScore < 40 || isWrongLetter) {
    status = 'FAIL';
    warningText = '⚠️ Nét viết chưa đúng mẫu chữ yêu cầu! Bé hãy quan sát nét mẫu màu hồng và viết lại cẩn thận nhé.';
  } else if (finalCalculatedScore < 65 || centerlineCoverage < 0.50) {
    status = 'NEEDS_IMPROVEMENT';
    warningText = 'Nét chữ còn thiếu nét hoặc hơi chệch ô ly. Bé nhớ viết liền mạch từ điểm đặt bút đến điểm dừng bút nhé.';
  } else if (finalCalculatedScore >= 80) {
    status = 'PASS';
  } else {
    status = 'NEEDS_IMPROVEMENT';
  }

  console.log({
    totalInkPoints,
    pointsInSafeZone,
    centerlineCoverage: parseFloat(centerlineCoverage.toFixed(3)),
    finalCalculatedScore,
    trajectoryScore: Math.round(trajectoryScore),
    completenessScore: Math.round(completenessScore),
    proportionScore,
    safeRatio: parseFloat(safeRatio.toFixed(3)),
    isWrongLetter,
    status
  });

  // Tạo debug overlay canvas
  const debugCanvas = document.createElement('canvas');
  debugCanvas.width = width;
  debugCanvas.height = height;
  const dbgCtx = debugCanvas.getContext('2d');

  if (dbgCtx) {
    dbgCtx.fillStyle = 'rgba(15, 23, 42, 0.40)';
    dbgCtx.fillRect(0, 0, width, height);

    // Vẽ nét mẫu màu hồng
    dbgCtx.strokeStyle = 'rgba(244, 63, 94, 0.65)';
    dbgCtx.lineWidth = 6;
    dbgCtx.lineCap = 'round';
    dbgCtx.lineJoin = 'round';
    for (let i = 1; i < templatePoints.length; i++) {
      const p1 = templatePoints[i - 1];
      const p2 = templatePoints[i];
      if (p1.strokeId === p2.strokeId || !p1.strokeId) {
        dbgCtx.beginPath();
        dbgCtx.moveTo(p1.x, p1.y);
        dbgCtx.lineTo(p2.x, p2.y);
        dbgCtx.stroke();
      }
    }

    // Vẽ nét người dùng phân màu
    for (let i = 0; i < totalInkPoints; i += 2) {
      const pt = alignedUserPoints[i];
      const { dist } = getMinDistance(pt.x, pt.y);

      if (dist <= toleranceR) {
        dbgCtx.fillStyle = 'rgba(16, 185, 129, 0.85)';
      } else if (dist <= doubleR) {
        dbgCtx.fillStyle = 'rgba(245, 158, 11, 0.85)';
      } else {
        dbgCtx.fillStyle = 'rgba(239, 68, 68, 0.90)';
      }
      dbgCtx.fillRect(Math.round(pt.x), Math.round(pt.y), 2, 2);
    }
  }

  return {
    hasInk: true,
    hasStrokes: true,
    finalScore: finalCalculatedScore,
    finalCalculatedScore,
    trajectoryScore: Math.round(trajectoryScore),
    completenessScore: Math.round(completenessScore),
    proportionScore,
    penalty,
    precision: safeRatio,
    recall: centerlineCoverage,
    totalInkPoints,
    pointsInSafeZone,
    centerlineCoverage,
    userInkPixels,
    inTemplatePixels: pointsInSafeZone,
    outOfBoundsPixels: outOfBoundsCount,
    status,
    warningText,
    debugOverlayUrl: debugCanvas.toDataURL('image/png'),
  };
}

/**
 * Các alias đồng bộ theo luồng chuẩn của đề bài
 */
export const evaluateAgainstTemplate = evaluateHandwriting;
export const evaluateDrawingOnPaper = evaluateHandwriting;
export const computeStrokeScore = evaluateHandwriting;

/**
 * Hàm bao tương thích ngược (Không gán điểm ảo)
 */
export function calculateRealisticCVScore(metrics: {
  inkRatio: number;
  stdDev: number;
  edgeCount: number;
  contrastRatio: number;
  targetChar?: string;
  canvasElement?: HTMLCanvasElement;
}) {
  if (metrics.canvasElement) {
    const result = evaluateHandwriting(metrics.canvasElement, metrics.targetChar || 'a');
    return {
      overallScore: result.finalCalculatedScore,
      trajectoryScore: result.trajectoryScore,
      proportionScore: result.proportionScore,
      smoothnessScore: Math.round(result.precision * 100),
      startEndAccuracy: result.finalCalculatedScore < 40 ? 25 : Math.round(result.recall * 100),
      debugOverlayUrl: result.debugOverlayUrl,
      warningText: result.warningText,
      evaluation: result,
    };
  }

  return {
    overallScore: 0,
    trajectoryScore: 0,
    proportionScore: 0,
    smoothnessScore: 0,
    startEndAccuracy: 0,
  };
}
