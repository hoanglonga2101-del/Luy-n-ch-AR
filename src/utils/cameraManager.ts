/**
 * =====================================================================
 * MODULE QUẢN LÝ VÀ KHỞI TẠO CAMERA AR (CAMERA MANAGER ENGINE)
 * =====================================================================
 * Tương thích 100% trên iOS Safari, Android Chrome & Webview/iFrame Preview.
 * Đáp ứng đầy đủ 5 tiêu chí kỹ thuật:
 * 1. Cấu hình thuộc tính video bắt buộc cho iOS Safari & bắt lỗi Autoplay
 * 2. Cấu hình Camera Constraints mềm chống lỗi OverconstrainedError kèm Fallback 3 cấp
 * 3. Giải phóng luồng cũ sạch sẽ (Clean-up MediaStream)
 * 4. Bắt lỗi định danh chi tiết (NotAllowedError, NotFoundError, NotReadableError, SecurityError...)
 * 5. Cơ chế phục hồi sự kiện chạm (Touch/Click) và mở tab mới khi kẹt trong iFrame
 */

export interface CameraConfig {
  facingMode?: 'environment' | 'user';
  idealWidth?: number;
  idealHeight?: number;
  minWidth?: number;
  minHeight?: number;
}

export interface CameraErrorDetail {
  name: string;
  message: string;
  userGuide: string;
  isIframeBlocked: boolean;
  canRetry: boolean;
}

export interface CameraInitResult {
  success: boolean;
  stream: MediaStream | null;
  isAutoplayBlocked: boolean;
  error?: CameraErrorDetail;
}

/**
 * Biến lưu trữ luồng stream toàn cục của module để đảm bảo
 * không bao giờ bị rò rỉ luồng hoặc xung đột camera chạy ngầm.
 */
let activeStream: MediaStream | null = null;

/**
 * Kiểm tra xem ứng dụng có đang chạy trong môi trường iFrame bị giới hạn hay không
 */
export function isRunningInIframe(): boolean {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true; // Bị chặn Cross-origin nghĩa là chắc chắn đang nằm trong iframe
  }
}

/**
 * =====================================================================
 * BƯỚC 3: GIẢI PHÓNG LUỒNG CŨ TRƯỚC KHI MỞ LẠI (CLEAN-UP MEDIASTREAM)
 * =====================================================================
 * Duyệt qua tất cả track (video, audio) của stream hiện tại và dừng (stop).
 * Giúp tránh tình trạng xung đột tài nguyên phần cứng khiến Camera bị khóa ngầm.
 */
export function stopCurrentStream(customStream?: MediaStream | null): void {
  const targetStream = customStream || activeStream;
  if (targetStream && targetStream.getTracks) {
    try {
      const tracks = targetStream.getTracks();
      tracks.forEach((track) => {
        try {
          track.stop();
          console.log(`[CameraManager] Đã dừng track: ${track.kind} (${track.label})`);
        } catch (stopErr) {
          console.warn('[CameraManager] Lỗi khi dừng track:', stopErr);
        }
      });
    } catch (e) {
      console.warn('[CameraManager] Lỗi khi duyệt tracks:', e);
    }
  }

  if (!customStream || customStream === activeStream) {
    activeStream = null;
  }
}

/**
 * =====================================================================
 * BƯỚC 4: BẮT MÃ LỖI CHI TIẾT & CHUYỂN THÀNH HƯỚNG DẪN NGƯỜI DÙNG
 * =====================================================================
 * Bắt chính xác tên lỗi từ WebRTC getUserMedia API:
 * - NotAllowedError / PermissionDeniedError
 * - NotFoundError / DevicesNotFoundError
 * - NotReadableError / TrackStartError
 * - SecurityError
 * - OverconstrainedError
 */
export function parseCameraError(error: any): CameraErrorDetail {
  const errorName = error?.name || '';
  const errorMsg = error?.message || String(error);
  const inIframe = isRunningInIframe();

  console.error('[CameraManager] Chi tiết lỗi WebRTC:', { name: errorName, message: errorMsg, inIframe });

  // 1. Người dùng bấm Chặn (Block) hoặc bị hạn chế quyền
  if (errorName === 'NotAllowedError' || errorName === 'PermissionDeniedError') {
    return {
      name: errorName,
      message: errorMsg,
      userGuide: inIframe
        ? 'Bạn đã chặn quyền Camera hoặc iFrame chưa được cấp quyền. Vui lòng cho phép quyền Camera hoặc mở ứng dụng bằng tab trình duyệt mới.'
        : 'Bạn đã chặn quyền Camera. Vui lòng vào Cài đặt trình duyệt để Cho phép (Allow) truy cập Camera.',
      isIframeBlocked: inIframe,
      canRetry: true,
    };
  }

  // 2. Không tìm thấy camera (thiết bị không có webcam hoặc camera bị hỏng)
  if (errorName === 'NotFoundError' || errorName === 'DevicesNotFoundError') {
    return {
      name: errorName,
      message: errorMsg,
      userGuide: 'Không tìm thấy thiết bị Camera trên thiết bị của bạn.',
      isIframeBlocked: false,
      canRetry: false,
    };
  }

  // 3. Camera đang bị ứng dụng khác (Zalo, Zoom, Google Meet...) chiếm dụng
  if (errorName === 'NotReadableError' || errorName === 'TrackStartError') {
    return {
      name: errorName,
      message: errorMsg,
      userGuide: 'Camera đang bị ứng dụng khác chiếm dụng. Vui lòng đóng các ứng dụng khác hoặc khởi động lại trình duyệt.',
      isIframeBlocked: false,
      canRetry: true,
    };
  }

  // 4. Lỗi bảo mật do chính sách sandbox trong iframe (thiếu allow="camera")
  if (errorName === 'SecurityError') {
    return {
      name: errorName,
      message: errorMsg,
      userGuide: 'Trình duyệt đang chặn truy cập Camera trong iframe. Hãy mở bằng tab trình duyệt mới để sử dụng đầy đủ AR.',
      isIframeBlocked: true,
      canRetry: true,
    };
  }

  // 5. Lỗi cấu hình vượt quá năng lực phần cứng camera
  if (errorName === 'OverconstrainedError') {
    return {
      name: errorName,
      message: errorMsg,
      userGuide: 'Độ phân giải yêu cầu không được hỗ trợ trên thiết bị. Hệ thống sẽ tự động hạ chuẩn phân giải cơ bản.',
      isIframeBlocked: false,
      canRetry: true,
    };
  }

  // Các lỗi khác (TypeError, AbortError, v.v.)
  return {
    name: errorName || 'UnknownError',
    message: errorMsg,
    userGuide: inIframe
      ? 'Không thể mở Camera trong khung xem trước. Hãy mở ứng dụng bằng tab riêng để kích hoạt Camera.'
      : 'Không thể kết nối với Camera. Vui lòng kiểm tra quyền truy cập và thử lại.',
    isIframeBlocked: inIframe,
    canRetry: true,
  };
}

/**
 * =====================================================================
 * BƯỚC 2: CẤU HÌNH CAMERA CONSTRAINTS LINH HOẠT VỚI FALLBACK 3 CẤP
 * =====================================================================
 * Không dùng kích thước cố định cứng (exact). Sử dụng ideal + min để chống
 * OverconstrainedError trên camera góc rộng / telephoto của iPhone.
 */
export async function getCameraStreamWithFallback(config: CameraConfig = {}): Promise<MediaStream> {
  const {
    facingMode = 'environment',
    idealWidth = 1280,
    idealHeight = 720,
    minWidth = 640,
    minHeight = 480,
  } = config;

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error('Trình duyệt không hỗ trợ WebRTC getUserMedia. Vui lòng dùng Safari hoặc Chrome phiên bản mới.');
  }

  // Cấp 1: Thử nghiệm cấu hình lý tưởng (ideal HD với camera sau 'environment')
  const tier1Constraints: MediaStreamConstraints = {
    audio: false,
    video: {
      facingMode: { ideal: facingMode },
      width: { ideal: idealWidth, min: minWidth },
      height: { ideal: idealHeight, min: minHeight },
    },
  };

  try {
    const stream = await navigator.mediaDevices.getUserMedia(tier1Constraints);
    console.log('[CameraManager] Cấp 1 thành công: Cấu hình chuẩn HD', tier1Constraints);
    return stream;
  } catch (err1: any) {
    console.warn('[CameraManager] Cấp 1 thất bại, chuyển sang Cấp 2 (Ràng buộc facingMode cơ bản):', err1);

    // Cấp 2: Bỏ ràng buộc độ phân giải, chỉ giữ hướng camera (facingMode ideal)
    const tier2Constraints: MediaStreamConstraints = {
      audio: false,
      video: {
        facingMode: { ideal: facingMode },
      },
    };

    try {
      const stream = await navigator.mediaDevices.getUserMedia(tier2Constraints);
      console.log('[CameraManager] Cấp 2 thành công: facingMode cơ bản');
      return stream;
    } catch (err2: any) {
      console.warn('[CameraManager] Cấp 2 thất bại, chuyển sang Cấp 3 (Fallback bất kỳ camera nào):', err2);

      // Cấp 3: Fallback khẩn cấp - Chấp nhận bất kỳ camera nào đang có trên thiết bị (`video: true`)
      const tier3Constraints: MediaStreamConstraints = {
        audio: false,
        video: true,
      };

      try {
        const stream = await navigator.mediaDevices.getUserMedia(tier3Constraints);
        console.log('[CameraManager] Cấp 3 thành công: Fallback video: true');
        return stream;
      } catch (err3: any) {
        // Ném lỗi của lần thử cuối hoặc lỗi đầu tiên
        throw err3 || err1;
      }
    }
  }
}

/**
 * =====================================================================
 * BƯỚC 1: CẤU HÌNH THUỘC TÍNH THẺ VIDEO BẮT BUỘC CHO IOS SAFARI
 * =====================================================================
 * Gán trực tiếp qua thuộc tính HTML DOM và thuộc tính đối tượng JS:
 * - autoplay: tự phát khi có stream
 * - muted: bắt buộc để iOS cho phép autoplay không cần tương tác âm thanh
 * - playsinline & webkit-playsinline: BẮT BUỘC để iOS Safari không tự bật chế độ toàn màn hình Native Video Player
 */
export function applyIosSafariVideoAttributes(videoElement: HTMLVideoElement): void {
  // Gán bằng setAttribute trực tiếp lên DOM
  videoElement.setAttribute('autoplay', '');
  videoElement.setAttribute('muted', '');
  videoElement.setAttribute('playsinline', '');
  videoElement.setAttribute('webkit-playsinline', 'true');
  videoElement.setAttribute('x5-playsinline', 'true');

  // Gán đồng thời qua thuộc tính đối tượng JavaScript
  videoElement.autoplay = true;
  videoElement.muted = true;
  videoElement.playsInline = true;
  // @ts-ignore iOS webkit prefix
  videoElement.webkitPlaysInline = true;

  // Tắt điều khiển mặc định để không che giao diện AR
  videoElement.controls = false;
}

/**
 * =====================================================================
 * HÀM KHỞI CHẠY CAMERA ĐẦY ĐỦ (START CAMERA)
 * =====================================================================
 * 1. Giải phóng luồng cũ
 * 2. Lấy stream mới với fallback
 * 3. Gán thuộc tính iOS cho thẻ Video
 * 4. Gán srcObject và gọi video.play() trong try-catch bắt lỗi Autoplay
 */
export async function startCamera(
  videoElement: HTMLVideoElement,
  config: CameraConfig = {}
): Promise<CameraInitResult> {
  // 1. Dọn dẹp luồng cũ
  stopCurrentStream();

  try {
    // 2. Yêu cầu luồng camera với cơ chế thích ứng đa tầng
    const stream = await getCameraStreamWithFallback(config);
    activeStream = stream;

    // 3. Cấu hình thẻ video cho iOS Safari
    applyIosSafariVideoAttributes(videoElement);

    // 4. Gán luồng dữ liệu vào thẻ video
    videoElement.srcObject = stream;

    // 5. Bọc video.play() trong try-catch để bắt chính sách Autoplay của Safari
    let isAutoplayBlocked = false;
    try {
      const playPromise = videoElement.play();
      if (playPromise !== undefined) {
        await playPromise;
        console.log('[CameraManager] Video đang phát thành công');
      }
    } catch (playErr: any) {
      console.warn('[CameraManager] iOS Safari chặn Autoplay (Cần tương tác User Gesture):', playErr);
      isAutoplayBlocked = true;
    }

    return {
      success: true,
      stream,
      isAutoplayBlocked,
    };
  } catch (error: any) {
    const errorDetail = parseCameraError(error);
    return {
      success: false,
      stream: null,
      isAutoplayBlocked: false,
      error: errorDetail,
    };
  }
}

/**
 * =====================================================================
 * HÀM KHỞI TẠO TỔNG QUÁT (INIT CAMERA)
 * =====================================================================
 * Cung cấp giao diện tiện ích với các callback tương tác UI
 */
export async function initCamera(
  videoElement: HTMLVideoElement,
  callbacks?: {
    onSuccess?: (stream: MediaStream) => void;
    onAutoplayBlocked?: () => void;
    onError?: (errorDetail: CameraErrorDetail) => void;
  },
  config: CameraConfig = {}
): Promise<CameraInitResult> {
  const result = await startCamera(videoElement, config);

  if (result.success && result.stream) {
    if (result.isAutoplayBlocked) {
      callbacks?.onAutoplayBlocked?.();
    } else {
      callbacks?.onSuccess?.(result.stream);
    }
  } else if (result.error) {
    callbacks?.onError?.(result.error);
  }

  return result;
}

/**
 * =====================================================================
 * HÀM MỞ TAB MỚI (CHO TRƯỜNG HỢP BỊ CHẶN BỞI IFRAME SANDBOX)
 * =====================================================================
 */
export function openAppInNewTab(): void {
  try {
    const currentUrl = window.location.href;
    window.open(currentUrl, '_blank', 'noopener,noreferrer');
  } catch (e) {
    console.warn('Không thể mở tab mới:', e);
  }
}
