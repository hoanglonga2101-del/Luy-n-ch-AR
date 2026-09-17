import { CharacterItem, LanguageCode } from '../types';
import { CHARACTER_STROKE_DATA } from './strokeData';

// ==========================================
// 1. TIẾNG VIỆT:
// Bảng 29 chữ cái chuẩn duy nhất (A Ă Â B C D Đ E Ê G H I K L M N O Ô Ơ P Q R S T U Ư V X Y)
// Mỗi chữ cái là 1 thẻ duy nhất (không trùng lặp), hỗ trợ cả Chữ thường và Chữ hoa
// & 8 Dấu thanh / Dấu mũ tiếng Việt
// ==========================================

export const VIETNAMESE_LETTERS: CharacterItem[] = [
  {
    id: 'vi_A',
    char: 'Aa',
    upperChar: 'A',
    lowerChar: 'a',
    name: 'Chữ A (Aa)',
    language: 'vi',
    category: 'letters',
    strokesCount: 2,
    upperStrokesCount: 3,
    lowerStrokesCount: 2,
    strokes: CHARACTER_STROKE_DATA['A'],
    upperStrokes: CHARACTER_STROKE_DATA['A'],
    lowerStrokes: CHARACTER_STROKE_DATA['a'],
    tips: 'Chữ A hoa cao 2.5 ô ly nét uốn lượn; chữ a thường cao 2 ô ly gồm nét cong kín và móc ngược.',
    gridType: 'oly_vi',
    examples: ['an', 'ba', 'cá', 'Ánh sáng']
  },
  {
    id: 'vi_AW',
    char: 'Ăă',
    upperChar: 'Ă',
    lowerChar: 'ă',
    name: 'Chữ Ă (Ăă)',
    language: 'vi',
    category: 'letters',
    strokesCount: 3,
    upperStrokesCount: 4,
    lowerStrokesCount: 3,
    tips: 'Thân chữ a/A kết hợp dấu trăng khuyết (˘) cong lõm lên trên cân đối.',
    gridType: 'oly_vi',
    examples: ['ăn', 'măng', 'tắm', 'Ăn học']
  },
  {
    id: 'vi_AA',
    char: 'Ââ',
    upperChar: 'Â',
    lowerChar: 'â',
    name: 'Chữ Â (Ââ)',
    language: 'vi',
    category: 'letters',
    strokesCount: 4,
    upperStrokesCount: 5,
    lowerStrokesCount: 4,
    tips: 'Thân chữ a/A kết hợp dấu mũ nón (^) đỉnh nhọn cân xứng ngay giữa đầu chữ.',
    gridType: 'oly_vi',
    examples: ['ấm', 'sân', 'cây', 'Âm nhạc']
  },
  {
    id: 'vi_B',
    char: 'Bb',
    upperChar: 'B',
    lowerChar: 'b',
    name: 'Chữ B (Bb)',
    language: 'vi',
    category: 'letters',
    strokesCount: 2,
    upperStrokesCount: 2,
    lowerStrokesCount: 2,
    strokes: CHARACTER_STROKE_DATA['B'],
    upperStrokes: CHARACTER_STROKE_DATA['B'],
    lowerStrokes: CHARACTER_STROKE_DATA['b'],
    tips: 'Chữ B hoa bụng dưới nở tròn; chữ b thường nét khuyết trên cao 2.5 ô ly uốn nét thắt.',
    gridType: 'oly_vi',
    examples: ['bà', 'bố', 'bạn', 'Bình minh']
  },
  {
    id: 'vi_C',
    char: 'Cc',
    upperChar: 'C',
    lowerChar: 'c',
    name: 'Chữ C (Cc)',
    language: 'vi',
    category: 'letters',
    strokesCount: 1,
    upperStrokesCount: 1,
    lowerStrokesCount: 1,
    strokes: CHARACTER_STROKE_DATA['c'],
    tips: 'Nét cong hở phải, lưng tựa nhẹ vào đường dọc, uốn đầu tròn trịa.',
    gridType: 'oly_vi',
    examples: ['cá', 'cờ', 'con', 'Cần cù']
  },
  {
    id: 'vi_D',
    char: 'Dd',
    upperChar: 'D',
    lowerChar: 'd',
    name: 'Chữ D (Dd)',
    language: 'vi',
    category: 'letters',
    strokesCount: 2,
    upperStrokesCount: 1,
    lowerStrokesCount: 2,
    strokes: CHARACTER_STROKE_DATA['d'],
    tips: 'Nét cong kín 2 ô ly kết hợp nét móc ngược dài vươn cao 4 ô ly (2 tầng).',
    gridType: 'oly_vi',
    examples: ['da', 'dê', 'dòng', 'Dịu dàng']
  },
  {
    id: 'vi_DD',
    char: 'Đđ',
    upperChar: 'Đ',
    lowerChar: 'đ',
    name: 'Chữ Đ (Đđ)',
    language: 'vi',
    category: 'letters',
    strokesCount: 3,
    upperStrokesCount: 2,
    lowerStrokesCount: 3,
    strokes: CHARACTER_STROKE_DATA['đ'],
    tips: 'Viết thân D/d rồi thêm nét gạch ngang ngắn cân xứng ở dòng kẻ 3.',
    gridType: 'oly_vi',
    examples: ['đi', 'đò', 'đồng', 'Đất nước']
  },
  {
    id: 'vi_E',
    char: 'Ee',
    upperChar: 'E',
    lowerChar: 'e',
    name: 'Chữ E (Ee)',
    language: 'vi',
    category: 'letters',
    strokesCount: 1,
    upperStrokesCount: 1,
    lowerStrokesCount: 1,
    tips: 'Khởi bút trên dòng kẻ đậm, lượn xiên chéo lên rồi vòng cung lưng cong chạm dòng 3.',
    gridType: 'oly_vi',
    examples: ['em', 'mẹ', 'bé', 'Êm đềm']
  },
  {
    id: 'vi_EE',
    char: 'Êê',
    upperChar: 'Ê',
    lowerChar: 'ê',
    name: 'Chữ Ê (Êê)',
    language: 'vi',
    category: 'letters',
    strokesCount: 3,
    upperStrokesCount: 3,
    lowerStrokesCount: 3,
    tips: 'Viết chữ E/e rồi thêm dấu nón úp nhọn cân đối phía trên.',
    gridType: 'oly_vi',
    examples: ['êm', 'bếp', 'dế', 'Êm ái']
  },
  {
    id: 'vi_G',
    char: 'Gg',
    upperChar: 'G',
    lowerChar: 'g',
    name: 'Chữ G (Gg)',
    language: 'vi',
    category: 'letters',
    strokesCount: 2,
    upperStrokesCount: 2,
    lowerStrokesCount: 2,
    tips: 'Nét cong kín 2 ô ly kết hợp nét khuyết dưới vươn xuống sâu 1.5 ô ly.',
    gridType: 'oly_vi',
    examples: ['gà', 'gỗ', 'gần', 'Gắn bó']
  },
  {
    id: 'vi_H',
    char: 'Hh',
    upperChar: 'H',
    lowerChar: 'h',
    name: 'Chữ H (Hh)',
    language: 'vi',
    category: 'letters',
    strokesCount: 2,
    upperStrokesCount: 3,
    lowerStrokesCount: 2,
    tips: 'Nét khuyết trên cao 2.5 ô ly nối liền nét móc hai đầu mềm mại.',
    gridType: 'oly_vi',
    examples: ['hoa', 'học', 'hát', 'Hạnh phúc']
  },
  {
    id: 'vi_I',
    char: 'Ii',
    upperChar: 'I',
    lowerChar: 'i',
    name: 'Chữ I (Ii)',
    language: 'vi',
    category: 'letters',
    strokesCount: 2,
    upperStrokesCount: 2,
    lowerStrokesCount: 3,
    tips: 'Nét hất và nét móc ngược rộng 1 ô ly, dấu chấm tròn nhỏ phía trên.',
    gridType: 'oly_vi',
    examples: ['in', 'chim', 'kim', 'Im lặng']
  },
  {
    id: 'vi_K',
    char: 'Kk',
    upperChar: 'K',
    lowerChar: 'k',
    name: 'Chữ K (Kk)',
    language: 'vi',
    category: 'letters',
    strokesCount: 2,
    upperStrokesCount: 3,
    lowerStrokesCount: 2,
    tips: 'Nét khuyết trên cao 2.5 ô ly nối nét thắt giữa ở lưng chừng ô thứ hai.',
    gridType: 'oly_vi',
    examples: ['kem', 'kéo', 'kính', 'Kiên trì']
  },
  {
    id: 'vi_L',
    char: 'Ll',
    upperChar: 'L',
    lowerChar: 'l',
    name: 'Chữ L (Ll)',
    language: 'vi',
    category: 'letters',
    strokesCount: 1,
    upperStrokesCount: 1,
    lowerStrokesCount: 1,
    tips: 'Nét khuyết trên uốn liền nét móc ngược, cao 2.5 ô ly thanh thoát.',
    gridType: 'oly_vi',
    examples: ['lá', 'lớp', 'lửa', 'Lạc quan']
  },
  {
    id: 'vi_M',
    char: 'Mm',
    upperChar: 'M',
    lowerChar: 'm',
    name: 'Chữ M (Mm)',
    language: 'vi',
    category: 'letters',
    strokesCount: 3,
    upperStrokesCount: 4,
    lowerStrokesCount: 3,
    tips: 'Gồm 2 nét móc xuôi và 1 nét móc hai đầu đều đặn, nhịp nhàng.',
    gridType: 'oly_vi',
    examples: ['mẹ', 'mai', 'mưa', 'Mùa xuân']
  },
  {
    id: 'vi_N',
    char: 'Nn',
    upperChar: 'N',
    lowerChar: 'n',
    name: 'Chữ N (Nn)',
    language: 'vi',
    category: 'letters',
    strokesCount: 2,
    upperStrokesCount: 3,
    lowerStrokesCount: 2,
    tips: '1 nét móc xuôi và 1 nét móc hai đầu rộng 1.5 ô ly.',
    gridType: 'oly_vi',
    examples: ['nụ', 'non', 'nắng', 'Nghị lực']
  },
  {
    id: 'vi_O',
    char: 'Oo',
    upperChar: 'O',
    lowerChar: 'o',
    name: 'Chữ O (Oo)',
    language: 'vi',
    category: 'letters',
    strokesCount: 1,
    upperStrokesCount: 1,
    lowerStrokesCount: 1,
    tips: 'Nét cong kín tròn đều hình quả trứng gà, rộng 1.5 ô ly, cao 2 ô ly.',
    gridType: 'oly_vi',
    examples: ['ong', 'bò', 'cỏ', 'Ôn hòa']
  },
  {
    id: 'vi_OO',
    char: 'Ôô',
    upperChar: 'Ô',
    lowerChar: 'ô',
    name: 'Chữ Ô (Ôô)',
    language: 'vi',
    category: 'letters',
    strokesCount: 3,
    upperStrokesCount: 3,
    lowerStrokesCount: 3,
    tips: 'Chữ O/o thêm dấu mũ nón cân đối không quá to trên đỉnh.',
    gridType: 'oly_vi',
    examples: ['ô', 'cô', 'bột', 'Ôm ấp']
  },
  {
    id: 'vi_OW',
    char: 'Ơơ',
    upperChar: 'Ơ',
    lowerChar: 'ơ',
    name: 'Chữ Ơ (Ơơ)',
    language: 'vi',
    category: 'letters',
    strokesCount: 2,
    upperStrokesCount: 2,
    lowerStrokesCount: 2,
    tips: 'Chữ O/o thêm râu nhỏ ở góc 1 giờ trên lưng chữ.',
    gridType: 'oly_vi',
    examples: ['ơi', 'mơ', 'bơ', 'Ơn nghĩa']
  },
  {
    id: 'vi_P',
    char: 'Pp',
    upperChar: 'P',
    lowerChar: 'p',
    name: 'Chữ P (Pp)',
    language: 'vi',
    category: 'letters',
    strokesCount: 2,
    upperStrokesCount: 2,
    lowerStrokesCount: 3,
    tips: 'Nét hất, nét sổ dài vượt xuống dòng dưới 2 ô ly và nét móc 2 đầu.',
    gridType: 'oly_vi',
    examples: ['pin', 'phố', 'phù', 'Phong trào']
  },
  {
    id: 'vi_Q',
    char: 'Qq',
    upperChar: 'Q',
    lowerChar: 'q',
    name: 'Chữ Q (Qq)',
    language: 'vi',
    category: 'letters',
    strokesCount: 2,
    upperStrokesCount: 2,
    lowerStrokesCount: 2,
    tips: 'Nét cong kín và nét sổ thẳng dài vươn xuống 2 ô ly.',
    gridType: 'oly_vi',
    examples: ['quê', 'quạt', 'quả', 'Quê hương']
  },
  {
    id: 'vi_R',
    char: 'Rr',
    upperChar: 'R',
    lowerChar: 'r',
    name: 'Chữ R (Rr)',
    language: 'vi',
    category: 'letters',
    strokesCount: 1,
    upperStrokesCount: 2,
    lowerStrokesCount: 1,
    tips: 'Nét thắt nhỏ ở đỉnh trên dòng 3, rồi lượn cong móc ngược sang phải.',
    gridType: 'oly_vi',
    examples: ['ra', 'rừng', 'rùa', 'Rạng rỡ']
  },
  {
    id: 'vi_S',
    char: 'Ss',
    upperChar: 'S',
    lowerChar: 's',
    name: 'Chữ S (Ss)',
    language: 'vi',
    category: 'letters',
    strokesCount: 1,
    upperStrokesCount: 1,
    lowerStrokesCount: 1,
    tips: 'Nét xiên lên dòng 3 tạo thắt nhỏ rồi cong lưng tựa đường dọc.',
    gridType: 'oly_vi',
    examples: ['sen', 'sao', 'suối', 'Sáng tạo']
  },
  {
    id: 'vi_T',
    char: 'Tt',
    upperChar: 'T',
    lowerChar: 't',
    name: 'Chữ T (Tt)',
    language: 'vi',
    category: 'letters',
    strokesCount: 2,
    upperStrokesCount: 1,
    lowerStrokesCount: 3,
    tips: 'Nét hất, nét móc ngược cao 3 ô ly và nét gạch ngang ngắn.',
    gridType: 'oly_vi',
    examples: ['tay', 'to', 'tre', 'Tương lai']
  },
  {
    id: 'vi_U',
    char: 'Uu',
    upperChar: 'U',
    lowerChar: 'u',
    name: 'Chữ U (Uu)',
    language: 'vi',
    category: 'letters',
    strokesCount: 2,
    upperStrokesCount: 2,
    lowerStrokesCount: 3,
    tips: 'Nét hất và 2 nét móc ngược nối liền liên tục, nhịp nhàng.',
    gridType: 'oly_vi',
    examples: ['uống', 'vui', 'bụi', 'Uốn nắn']
  },
  {
    id: 'vi_UW',
    char: 'Ưư',
    upperChar: 'Ư',
    lowerChar: 'ư',
    name: 'Chữ Ư (Ưư)',
    language: 'vi',
    category: 'letters',
    strokesCount: 3,
    upperStrokesCount: 3,
    lowerStrokesCount: 4,
    tips: 'Chữ U/u thêm nét râu nhỏ ở góc trên bên phải con chữ.',
    gridType: 'oly_vi',
    examples: ['ưa', 'mực', 'thư', 'Ước mơ']
  },
  {
    id: 'vi_V',
    char: 'Vv',
    upperChar: 'V',
    lowerChar: 'v',
    name: 'Chữ V (Vv)',
    language: 'vi',
    category: 'letters',
    strokesCount: 1,
    upperStrokesCount: 3,
    lowerStrokesCount: 1,
    tips: 'Nét móc xuôi nối nét móc ngược uốn lượn thắt nhỏ.',
    gridType: 'oly_vi',
    examples: ['vui', 'vườn', 've', 'Việt Nam']
  },
  {
    id: 'vi_X',
    char: 'Xx',
    upperChar: 'X',
    lowerChar: 'x',
    name: 'Chữ X (Xx)',
    language: 'vi',
    category: 'letters',
    strokesCount: 2,
    upperStrokesCount: 1,
    lowerStrokesCount: 2,
    tips: 'Hai nét cong tựa lưng vào nhau đối xứng cân bằng.',
    gridType: 'oly_vi',
    examples: ['xe', 'xuân', 'xanh', 'Xinh xắn']
  },
  {
    id: 'vi_Y',
    char: 'Yy',
    upperChar: 'Y',
    lowerChar: 'y',
    name: 'Chữ Y (Yy)',
    language: 'vi',
    category: 'letters',
    strokesCount: 3,
    upperStrokesCount: 3,
    lowerStrokesCount: 3,
    tips: 'Nét hất, móc ngược và nét khuyết dưới sâu 1.5 ô ly.',
    gridType: 'oly_vi',
    examples: ['yêu', 'ngày', 'mây', 'Ý chí']
  }
];

export const VIETNAMESE_ACCENTS: CharacterItem[] = [
  { 
    id: 'vi_d_sac', 
    char: '´', 
    name: 'Dấu Sắc (Thanh Sắc)', 
    language: 'vi', 
    category: 'accents', 
    strokesCount: 1, 
    tips: 'Đặt bút từ phía trên bên phải, kéo xiên xuống bên trái, nét vuốt thanh mảnh.', 
    gridType: 'oly_vi', 
    examples: ['cá', 'lá', 'má', 'bóng'] 
  },
  { 
    id: 'vi_d_huyen', 
    char: '`', 
    name: 'Dấu Huyền (Thanh Huyền)', 
    language: 'vi', 
    category: 'accents', 
    strokesCount: 1, 
    tips: 'Đặt bút từ phía trên bên trái, kéo xiên xuống bên phải, êm dịu thanh thoát.', 
    gridType: 'oly_vi', 
    examples: ['bà', 'cà', 'nhà', 'đồng'] 
  },
  { 
    id: 'vi_d_hoi', 
    char: 'ˀ', 
    name: 'Dấu Hỏi (Thanh Hỏi)', 
    language: 'vi', 
    category: 'accents', 
    strokesCount: 1, 
    tips: 'Uốn cong như nét móc nhỏ hướng sang phải, đặt cân đối trên đỉnh âm chính.', 
    gridType: 'oly_vi', 
    examples: ['cỏ', 'hỏi', 'mở', 'bảng'] 
  },
  { 
    id: 'vi_d_nga', 
    char: '~', 
    name: 'Dấu Ngã (Thanh Ngã)', 
    language: 'vi', 
    category: 'accents', 
    strokesCount: 1, 
    tips: 'Lượn sóng nhẹ từ trái sang phải, điểm bắt đầu và kết thúc mềm mại.', 
    gridType: 'oly_vi', 
    examples: ['ngã', 'sữa', 'vẽ', 'mỗi'] 
  },
  { 
    id: 'vi_d_nang', 
    char: '·', 
    name: 'Dấu Nặng (Thanh Nặng)', 
    language: 'vi', 
    category: 'accents', 
    strokesCount: 1, 
    tips: 'Chấm tròn nhỏ dứt khoát, nằm ngay ngắn ngay dưới đáy con chữ âm chính.', 
    gridType: 'oly_vi', 
    examples: ['mẹ', 'học', 'bạn', 'đẹp'] 
  },
  { 
    id: 'vi_d_non', 
    char: '^', 
    name: 'Dấu Mũ (Nón) Â, Ê, Ô', 
    language: 'vi', 
    category: 'accents', 
    strokesCount: 2, 
    tips: 'Gồm nét xiên trái và xiên phải nhọn đỉnh ở giữa, cân xứng trên đầu chữ.', 
    gridType: 'oly_vi', 
    examples: ['bấm', 'đêm', 'cô'] 
  },
  { 
    id: 'vi_d_rau', 
    char: '᾿', 
    name: 'Dấu Móc (Râu) Ơ, Ư', 
    language: 'vi', 
    category: 'accents', 
    strokesCount: 1, 
    tips: 'Nét móc nhỏ đặt ở vị trí góc 1 giờ trên đỉnh bên phải con chữ.', 
    gridType: 'oly_vi', 
    examples: ['mơ', 'thư', 'nước'] 
  },
  { 
    id: 'vi_d_trang', 
    char: '˘', 
    name: 'Dấu Mũ Cong (Trăng) Ă', 
    language: 'vi', 
    category: 'accents', 
    strokesCount: 1, 
    tips: 'Nét cong lõm hướng lên như vầng trăng khuyết, cân đối giữa thân chữ.', 
    gridType: 'oly_vi', 
    examples: ['ăn', 'tắm', 'trăng'] 
  }
];

// ==========================================
// 2. TIẾNG ANH:
// Bảng 26 chữ cái chuẩn duy nhất (A đến Z)
// Mỗi chữ cái là 1 thẻ duy nhất, hỗ trợ cả Uppercase và Lowercase
// ==========================================

export const ENGLISH_LETTERS: CharacterItem[] = [
  { id: 'en_A', char: 'Aa', upperChar: 'A', lowerChar: 'a', name: 'Letter A (Aa)', language: 'en', category: 'letters', strokesCount: 2, upperStrokesCount: 3, lowerStrokesCount: 2, strokes: CHARACTER_STROKE_DATA['A'], lowerStrokes: CHARACTER_STROKE_DATA['a'], tips: 'Two tall diagonals meeting at headline for A, circle with downstroke for a.', gridType: 'four_line_en', examples: ['Apple', 'America'] },
  { id: 'en_B', char: 'Bb', upperChar: 'B', lowerChar: 'b', name: 'Letter B (Bb)', language: 'en', category: 'letters', strokesCount: 2, upperStrokesCount: 3, lowerStrokesCount: 2, strokes: CHARACTER_STROKE_DATA['B'], lowerStrokes: CHARACTER_STROKE_DATA['b'], tips: 'Vertical back with double bump for B, tall ascender with loop for b.', gridType: 'four_line_en', examples: ['Book', 'Bright'] },
  { id: 'en_C', char: 'Cc', upperChar: 'C', lowerChar: 'c', name: 'Letter C (Cc)', language: 'en', category: 'letters', strokesCount: 1, upperStrokesCount: 1, lowerStrokesCount: 1, strokes: CHARACTER_STROKE_DATA['c'], tips: 'Sweeping wide circular curve open to the right from headline (or midline) to baseline.', gridType: 'four_line_en', examples: ['Cat', 'City'] },
  { id: 'en_D', char: 'Dd', upperChar: 'D', lowerChar: 'd', name: 'Letter D (Dd)', language: 'en', category: 'letters', strokesCount: 2, upperStrokesCount: 2, lowerStrokesCount: 2, strokes: CHARACTER_STROKE_DATA['d'], tips: 'Vertical line with wide lobe for D; circle with tall ascender for d.', gridType: 'four_line_en', examples: ['Dog', 'Dream'] },
  { id: 'en_E', char: 'Ee', upperChar: 'E', lowerChar: 'e', name: 'Letter E (Ee)', language: 'en', category: 'letters', strokesCount: 1, upperStrokesCount: 4, lowerStrokesCount: 1, tips: 'Vertical with 3 horizontal bars for E; bar across middle curving around for e.', gridType: 'four_line_en', examples: ['Eagle', 'Earth'] },
  { id: 'en_F', char: 'Ff', upperChar: 'F', lowerChar: 'f', name: 'Letter F (Ff)', language: 'en', category: 'letters', strokesCount: 2, upperStrokesCount: 3, lowerStrokesCount: 2, tips: 'Vertical post with two arms for F; top hook drop with midline crossbar for f.', gridType: 'four_line_en', examples: ['Flower', 'Friend'] },
  { id: 'en_G', char: 'Gg', upperChar: 'G', lowerChar: 'g', name: 'Letter G (Gg)', language: 'en', category: 'letters', strokesCount: 2, upperStrokesCount: 2, lowerStrokesCount: 2, tips: 'Curve around like C with inward bar for G; circle with descender hook for g.', gridType: 'four_line_en', examples: ['Great', 'Green'] },
  { id: 'en_H', char: 'Hh', upperChar: 'H', lowerChar: 'h', name: 'Letter H (Hh)', language: 'en', category: 'letters', strokesCount: 2, upperStrokesCount: 3, lowerStrokesCount: 2, tips: 'Parallel verticals with midline bridge for H; tall ascender with arch for h.', gridType: 'four_line_en', examples: ['Heart', 'Hope'] },
  { id: 'en_I', char: 'Ii', upperChar: 'I', lowerChar: 'i', name: 'Letter I (Ii)', language: 'en', category: 'letters', strokesCount: 2, upperStrokesCount: 3, lowerStrokesCount: 2, tips: 'Vertical post with top/bottom caps for I; short vertical with dot for i.', gridType: 'four_line_en', examples: ['Island', 'Idea'] },
  { id: 'en_J', char: 'Jj', upperChar: 'J', lowerChar: 'j', name: 'Letter J (Jj)', language: 'en', category: 'letters', strokesCount: 2, upperStrokesCount: 2, lowerStrokesCount: 2, tips: 'Top cap with hook drop for J; descender hook below baseline with dot for j.', gridType: 'four_line_en', examples: ['Joy', 'Journey'] },
  { id: 'en_K', char: 'Kk', upperChar: 'K', lowerChar: 'k', name: 'Letter K (Kk)', language: 'en', category: 'letters', strokesCount: 2, upperStrokesCount: 3, lowerStrokesCount: 3, tips: 'Vertical post with upper and lower diagonal arms.', gridType: 'four_line_en', examples: ['Kind', 'King'] },
  { id: 'en_L', char: 'Ll', upperChar: 'L', lowerChar: 'l', name: 'Letter L (Ll)', language: 'en', category: 'letters', strokesCount: 1, upperStrokesCount: 2, lowerStrokesCount: 1, tips: 'Vertical with sharp right-angle base for L; single clean vertical down for l.', gridType: 'four_line_en', examples: ['Light', 'Love'] },
  { id: 'en_M', char: 'Mm', upperChar: 'M', lowerChar: 'm', name: 'Letter M (Mm)', language: 'en', category: 'letters', strokesCount: 3, upperStrokesCount: 4, lowerStrokesCount: 3, tips: 'Two vertical sides with sharp central V for M; two arches below midline for m.', gridType: 'four_line_en', examples: ['Music', 'Moon'] },
  { id: 'en_N', char: 'Nn', upperChar: 'N', lowerChar: 'n', name: 'Letter N (Nn)', language: 'en', category: 'letters', strokesCount: 2, upperStrokesCount: 3, lowerStrokesCount: 2, tips: 'Left vertical, diagonal slice, right vertical for N; one arch for n.', gridType: 'four_line_en', examples: ['Nature', 'Night'] },
  { id: 'en_O', char: 'Oo', upperChar: 'O', lowerChar: 'o', name: 'Letter O (Oo)', language: 'en', category: 'letters', strokesCount: 1, upperStrokesCount: 1, lowerStrokesCount: 1, tips: 'Smooth symmetric oval between headline (or midline) and baseline.', gridType: 'four_line_en', examples: ['Ocean', 'Open'] },
  { id: 'en_P', char: 'Pp', upperChar: 'P', lowerChar: 'p', name: 'Letter P (Pp)', language: 'en', category: 'letters', strokesCount: 2, upperStrokesCount: 2, lowerStrokesCount: 2, tips: 'Vertical stroke with rounded lobe on baseline; p descender drops below baseline.', gridType: 'four_line_en', examples: ['Peace', 'Planet'] },
  { id: 'en_Q', char: 'Qq', upperChar: 'Q', lowerChar: 'q', name: 'Letter Q (Qq)', language: 'en', category: 'letters', strokesCount: 2, upperStrokesCount: 2, lowerStrokesCount: 2, tips: 'Letter O with lower-right tail flick for Q; circle with descender flick for q.', gridType: 'four_line_en', examples: ['Quiet', 'Queen'] },
  { id: 'en_R', char: 'Rr', upperChar: 'R', lowerChar: 'r', name: 'Letter R (Rr)', language: 'en', category: 'letters', strokesCount: 2, upperStrokesCount: 3, lowerStrokesCount: 2, tips: 'Letter P structure with diagonal leg for R; short downstroke with branch for r.', gridType: 'four_line_en', examples: ['River', 'Rainbow'] },
  { id: 'en_S', char: 'Ss', upperChar: 'S', lowerChar: 's', name: 'Letter S (Ss)', language: 'en', category: 'letters', strokesCount: 1, upperStrokesCount: 1, lowerStrokesCount: 1, tips: 'Balanced double curve S-shape, smooth and continuous.', gridType: 'four_line_en', examples: ['Sun', 'Star'] },
  { id: 'en_T', char: 'Tt', upperChar: 'T', lowerChar: 't', name: 'Letter T (Tt)', language: 'en', category: 'letters', strokesCount: 2, upperStrokesCount: 2, lowerStrokesCount: 2, tips: 'Wide horizontal roof with vertical post for T; curved base with midline cross for t.', gridType: 'four_line_en', examples: ['Time', 'Tree'] },
  { id: 'en_U', char: 'Uu', upperChar: 'U', lowerChar: 'u', name: 'Letter U (Uu)', language: 'en', category: 'letters', strokesCount: 2, upperStrokesCount: 1, lowerStrokesCount: 2, tips: 'Smooth rounded valley on baseline, rising up with right downstroke.', gridType: 'four_line_en', examples: ['Universe', 'Unity'] },
  { id: 'en_V', char: 'Vv', upperChar: 'V', lowerChar: 'v', name: 'Letter V (Vv)', language: 'en', category: 'letters', strokesCount: 2, upperStrokesCount: 2, lowerStrokesCount: 2, tips: 'Two clean diagonals meeting at a crisp apex point on baseline.', gridType: 'four_line_en', examples: ['Voice', 'Victory'] },
  { id: 'en_W', char: 'Ww', upperChar: 'W', lowerChar: 'w', name: 'Letter W (Ww)', language: 'en', category: 'letters', strokesCount: 4, upperStrokesCount: 4, lowerStrokesCount: 4, tips: 'Double V shape with two sharp baseline points and middle peak.', gridType: 'four_line_en', examples: ['Water', 'World'] },
  { id: 'en_X', char: 'Xx', upperChar: 'X', lowerChar: 'x', name: 'Letter X (Xx)', language: 'en', category: 'letters', strokesCount: 2, upperStrokesCount: 2, lowerStrokesCount: 2, tips: 'Two diagonals crossing precisely at the middle.', gridType: 'four_line_en', examples: ['X-ray', 'Xylophone'] },
  { id: 'en_Y', char: 'Yy', upperChar: 'Y', lowerChar: 'y', name: 'Letter Y (Yy)', language: 'en', category: 'letters', strokesCount: 2, upperStrokesCount: 3, lowerStrokesCount: 2, tips: 'V-fork meeting with vertical tail for Y; diagonal V with descender tail for y.', gridType: 'four_line_en', examples: ['Youth', 'Yellow'] },
  { id: 'en_Z', char: 'Zz', upperChar: 'Z', lowerChar: 'z', name: 'Letter Z (Zz)', language: 'en', category: 'letters', strokesCount: 3, upperStrokesCount: 3, lowerStrokesCount: 3, tips: 'Top horizontal, diagonal slice down left, bottom horizontal right.', gridType: 'four_line_en', examples: ['Zenith', 'Zebra'] }
];

// ==========================================
// 3. TIẾNG NHẬT: Chia rõ ràng 2 phần:
// Phần 1: HIRAGANA (50 âm Gojūon chuẩn)
// あ い う え お
// か き く け こ
// さ し す せ そ
// た ち つ て と
// な に ぬ ね の
// は ひ ふ へ ほ
// ま み む め も
// や    ゆ    よ
// ら り る れ ろ
// わ          を
// ん
// ==========================================

export interface JapaneseGridRow {
  rowLabel: string;
  items: (CharacterItem | null)[];
}

export const JAPANESE_HIRAGANA_ROWS: JapaneseGridRow[] = [
  {
    rowLabel: 'Hàng A (あ)',
    items: [
      { id: 'ja_h_a', char: 'あ', name: 'Hiragana A', language: 'ja', category: 'hiragana', reading: 'a', vietnameseMeaning: 'Âm a', strokesCount: 3, tips: 'Nét ngang trên, nét sổ lượn giữa, nét xoắn tròn bụng dưới.', gridType: 'mizi_zh' },
      { id: 'ja_h_i', char: 'い', name: 'Hiragana I', language: 'ja', category: 'hiragana', reading: 'i', vietnameseMeaning: 'Âm i', strokesCount: 2, tips: 'Nét cong trái có móc hất, nét cong phải ngắn song song.', gridType: 'mizi_zh' },
      { id: 'ja_h_u', char: 'う', name: 'Hiragana U', language: 'ja', category: 'hiragana', reading: 'u', vietnameseMeaning: 'Âm u', strokesCount: 2, tips: 'Nét phẩy nhỏ trên, nét cong uốn lượn như vành tai.', gridType: 'mizi_zh' },
      { id: 'ja_h_e', char: 'え', name: 'Hiragana E', language: 'ja', category: 'hiragana', reading: 'e', vietnameseMeaning: 'Âm e', strokesCount: 2, tips: 'Nét chấm trên đỉnh, nét zic-zac lượn sóng ngang phía dưới.', gridType: 'mizi_zh' },
      { id: 'ja_h_o', char: 'お', name: 'Hiragana O', language: 'ja', category: 'hiragana', reading: 'o', vietnameseMeaning: 'Âm o', strokesCount: 3, tips: 'Ngang, sổ lượn xoắn bụng tròn, chấm nhỏ bên phải.', gridType: 'mizi_zh' },
    ]
  },
  {
    rowLabel: 'Hàng Ka (か)',
    items: [
      { id: 'ja_h_ka', char: 'か', name: 'Hiragana Ka', language: 'ja', category: 'hiragana', reading: 'ka', vietnameseMeaning: 'Âm ka', strokesCount: 3, tips: 'Ngang gập có móc, nét phẩy cắt qua, nét chấm bên phải.', gridType: 'mizi_zh' },
      { id: 'ja_h_ki', char: 'き', name: 'Hiragana Ki', language: 'ja', category: 'hiragana', reading: 'ki', vietnameseMeaning: 'Âm ki', strokesCount: 4, tips: 'Hai nét ngang nghiêng nhẹ, nét xiên cắt qua và nét cong đáy.', gridType: 'mizi_zh' },
      { id: 'ja_h_ku', char: 'く', name: 'Hiragana Ku', language: 'ja', category: 'hiragana', reading: 'ku', vietnameseMeaning: 'Âm ku', strokesCount: 1, tips: 'Một nét gấp khúc như hình mỏ chim quay sang trái.', gridType: 'mizi_zh' },
      { id: 'ja_h_ke', char: 'け', name: 'Hiragana Ke', language: 'ja', category: 'hiragana', reading: 'ke', vietnameseMeaning: 'Âm ke', strokesCount: 3, tips: 'Nét sổ cong có móc bên trái, nét ngang ngắn và sổ cong phải.', gridType: 'mizi_zh' },
      { id: 'ja_h_ko', char: 'こ', name: 'Hiragana Ko', language: 'ja', category: 'hiragana', reading: 'ko', vietnameseMeaning: 'Âm ko', strokesCount: 2, tips: 'Nét ngang trên lượn móc, nét ngang dưới song song.', gridType: 'mizi_zh' },
    ]
  },
  {
    rowLabel: 'Hàng Sa (さ)',
    items: [
      { id: 'ja_h_sa', char: 'さ', name: 'Hiragana Sa', language: 'ja', category: 'hiragana', reading: 'sa', vietnameseMeaning: 'Âm sa', strokesCount: 3, tips: 'Nét ngang chếch lên, nét xiên có móc nhỏ, nét cong đáy.', gridType: 'mizi_zh' },
      { id: 'ja_h_shi', char: 'し', name: 'Hiragana Shi', language: 'ja', category: 'hiragana', reading: 'shi', vietnameseMeaning: 'Âm shi', strokesCount: 1, tips: 'Một nét sổ thẳng xuống rồi uốn cong móc ngược lên.', gridType: 'mizi_zh' },
      { id: 'ja_h_su', char: 'す', name: 'Hiragana Su', language: 'ja', category: 'hiragana', reading: 'su', vietnameseMeaning: 'Âm su', strokesCount: 2, tips: 'Nét ngang dài, nét sổ đâm thẳng xoắn vòng tròn rồi vút đuôi.', gridType: 'mizi_zh' },
      { id: 'ja_h_se', char: 'せ', name: 'Hiragana Se', language: 'ja', category: 'hiragana', reading: 'se', vietnameseMeaning: 'Âm se', strokesCount: 3, tips: 'Nét ngang, nét đứng có móc gập đáy, nét đứng trái khép góc.', gridType: 'mizi_zh' },
      { id: 'ja_h_so', char: 'そ', name: 'Hiragana So', language: 'ja', category: 'hiragana', reading: 'so', vietnameseMeaning: 'Âm so', strokesCount: 1, tips: 'Nét zic-zac uốn chữ Z ở trên rồi nối nét cong C ở dưới.', gridType: 'mizi_zh' },
    ]
  },
  {
    rowLabel: 'Hàng Ta (た)',
    items: [
      { id: 'ja_h_ta', char: 'た', name: 'Hiragana Ta', language: 'ja', category: 'hiragana', reading: 'ta', vietnameseMeaning: 'Âm ta', strokesCount: 4, tips: 'Nét ngang, nét xiên, hai nét nhỏ bên phải xếp như chữ こ.', gridType: 'mizi_zh' },
      { id: 'ja_h_chi', char: 'ち', name: 'Hiragana Chi', language: 'ja', category: 'hiragana', reading: 'chi', vietnameseMeaning: 'Âm chi', strokesCount: 2, tips: 'Nét ngang trên, nét sổ xiên lượn cong bụng lớn như số 5.', gridType: 'mizi_zh' },
      { id: 'ja_h_tsu', char: 'つ', name: 'Hiragana Tsu', language: 'ja', category: 'hiragana', reading: 'tsu', vietnameseMeaning: 'Âm tsu', strokesCount: 1, tips: 'Một nét cong lớn mở rộng như cơn sóng trào.', gridType: 'mizi_zh' },
      { id: 'ja_h_te', char: 'て', name: 'Hiragana Te', language: 'ja', category: 'hiragana', reading: 'te', vietnameseMeaning: 'Âm te', strokesCount: 1, tips: 'Nét ngang chếch lên rồi uốn vòng cung nửa hình tròn.', gridType: 'mizi_zh' },
      { id: 'ja_h_to', char: 'と', name: 'Hiragana To', language: 'ja', category: 'hiragana', reading: 'to', vietnameseMeaning: 'Âm to', strokesCount: 2, tips: 'Nét xiên ngắn từ trên xuống, nét cong lớn tựa vào nét xiên.', gridType: 'mizi_zh' },
    ]
  },
  {
    rowLabel: 'Hàng Na (な)',
    items: [
      { id: 'ja_h_na', char: 'な', name: 'Hiragana Na', language: 'ja', category: 'hiragana', reading: 'na', vietnameseMeaning: 'Âm na', strokesCount: 4, tips: 'Ngang, xiên, nét chấm nhỏ và nét xoắn dưới bên phải.', gridType: 'mizi_zh' },
      { id: 'ja_h_ni', char: 'に', name: 'Hiragana Ni', language: 'ja', category: 'hiragana', reading: 'ni', vietnameseMeaning: 'Âm ni', strokesCount: 3, tips: 'Nét sổ móc bên trái, hai nét ngang song song bên phải.', gridType: 'mizi_zh' },
      { id: 'ja_h_nu', char: 'ぬ', name: 'Hiragana Nu', language: 'ja', category: 'hiragana', reading: 'nu', vietnameseMeaning: 'Âm nu', strokesCount: 2, tips: 'Nét xiên trái, nét lượn uốn tròn và kết thúc bằng vòng xoắn nhỏ.', gridType: 'mizi_zh' },
      { id: 'ja_h_ne', char: 'ね', name: 'Hiragana Ne', language: 'ja', category: 'hiragana', reading: 'ne', vietnameseMeaning: 'Âm ne', strokesCount: 2, tips: 'Nét đứng thẳng, nét zic-zac lượn vòng thắt đuôi cá.', gridType: 'mizi_zh' },
      { id: 'ja_h_no', char: 'の', name: 'Hiragana No', language: 'ja', category: 'hiragana', reading: 'no', vietnameseMeaning: 'Âm no', strokesCount: 1, tips: 'Một nét xoay tròn uốn lượn như mắt bão từ trong ra ngoài.', gridType: 'mizi_zh' },
    ]
  },
  {
    rowLabel: 'Hàng Ha (は)',
    items: [
      { id: 'ja_h_ha', char: 'は', name: 'Hiragana Ha', language: 'ja', category: 'hiragana', reading: 'ha', vietnameseMeaning: 'Âm ha', strokesCount: 3, tips: 'Nét đứng móc trái, nét ngang ngắn và nét sổ xoắn bụng phải.', gridType: 'mizi_zh' },
      { id: 'ja_h_hi', char: 'ひ', name: 'Hiragana Hi', language: 'ja', category: 'hiragana', reading: 'hi', vietnameseMeaning: 'Âm hi', strokesCount: 1, tips: 'Nét lượn vòng cong lên như nụ cười mỉm.', gridType: 'mizi_zh' },
      { id: 'ja_h_fu', char: 'ふ', name: 'Hiragana Fu', language: 'ja', category: 'hiragana', reading: 'fu', vietnameseMeaning: 'Âm fu', strokesCount: 4, tips: 'Nét chấm trên, nét thân uốn cong ở giữa, hai chấm hai bên.', gridType: 'mizi_zh' },
      { id: 'ja_h_he', char: 'へ', name: 'Hiragana He', language: 'ja', category: 'hiragana', reading: 'he', vietnameseMeaning: 'Âm he', strokesCount: 1, tips: 'Nét gấp khúc như mái nhà, vế phải dài hơn vế trái.', gridType: 'mizi_zh' },
      { id: 'ja_h_ho', char: 'ほ', name: 'Hiragana Ho', language: 'ja', category: 'hiragana', reading: 'ho', vietnameseMeaning: 'Âm ho', strokesCount: 4, tips: 'Nét đứng móc trái, hai nét ngang song song và nét sổ xoắn bụng.', gridType: 'mizi_zh' },
    ]
  },
  {
    rowLabel: 'Hàng Ma (ま)',
    items: [
      { id: 'ja_h_ma', char: 'ま', name: 'Hiragana Ma', language: 'ja', category: 'hiragana', reading: 'ma', vietnameseMeaning: 'Âm ma', strokesCount: 3, tips: 'Hai nét ngang song song, nét sổ xuyên qua và xoắn bụng đáy.', gridType: 'mizi_zh' },
      { id: 'ja_h_mi', char: 'み', name: 'Hiragana Mi', language: 'ja', category: 'hiragana', reading: 'mi', vietnameseMeaning: 'Âm mi', strokesCount: 2, tips: 'Nét thân lượn vòng xoắn sang phải, nét phẩy chéo cắt qua.', gridType: 'mizi_zh' },
      { id: 'ja_h_mu', char: 'む', name: 'Hiragana Mu', language: 'ja', category: 'hiragana', reading: 'mu', vietnameseMeaning: 'Âm mu', strokesCount: 3, tips: 'Ngang, nét sổ xoắn vòng lượn hất lên, chấm trên bên phải.', gridType: 'mizi_zh' },
      { id: 'ja_h_me', char: 'め', name: 'Hiragana Me', language: 'ja', category: 'hiragana', reading: 'me', vietnameseMeaning: 'Âm me', strokesCount: 2, tips: 'Nét xiên trái, nét cong lượn tròn vòng cung mở rộng.', gridType: 'mizi_zh' },
      { id: 'ja_h_mo', char: 'も', name: 'Hiragana Mo', language: 'ja', category: 'hiragana', reading: 'mo', vietnameseMeaning: 'Âm mo', strokesCount: 3, tips: 'Nét thân như chiếc móc câu, hai nét ngang cắt ngang thân.', gridType: 'mizi_zh' },
    ]
  },
  {
    rowLabel: 'Hàng Ya (や)',
    items: [
      { id: 'ja_h_ya', char: 'や', name: 'Hiragana Ya', language: 'ja', category: 'hiragana', reading: 'ya', vietnameseMeaning: 'Âm ya', strokesCount: 3, tips: 'Nét cong lượn hất, nét chấm nhỏ trên và nét xiên cắt qua.', gridType: 'mizi_zh' },
      null, // Trống theo quy chuẩn bảng 50 âm
      { id: 'ja_h_yu', char: 'ゆ', name: 'Hiragana Yu', language: 'ja', category: 'hiragana', reading: 'yu', vietnameseMeaning: 'Âm yu', strokesCount: 2, tips: 'Nét thân lượn vòng cung khép góc, nét sổ dài cắt qua.', gridType: 'mizi_zh' },
      null, // Trống
      { id: 'ja_h_yo', char: 'よ', name: 'Hiragana Yo', language: 'ja', category: 'hiragana', reading: 'yo', vietnameseMeaning: 'Âm yo', strokesCount: 2, tips: 'Nét ngang ngắn, nét sổ đứng xoắn vòng sang trái.', gridType: 'mizi_zh' },
    ]
  },
  {
    rowLabel: 'Hàng Ra (ら)',
    items: [
      { id: 'ja_h_ra', char: 'ら', name: 'Hiragana Ra', language: 'ja', category: 'hiragana', reading: 'ra', vietnameseMeaning: 'Âm ra', strokesCount: 2, tips: 'Nét phẩy nhỏ trên, nét cong lớn ở dưới như vành tai.', gridType: 'mizi_zh' },
      { id: 'ja_h_ri', char: 'り', name: 'Hiragana Ri', language: 'ja', category: 'hiragana', reading: 'ri', vietnameseMeaning: 'Âm ri', strokesCount: 2, tips: 'Nét trái ngắn có móc hất, nét phải dài cong mềm mại.', gridType: 'mizi_zh' },
      { id: 'ja_h_ru', char: 'る', name: 'Hiragana Ru', language: 'ja', category: 'hiragana', reading: 'ru', vietnameseMeaning: 'Âm ru', strokesCount: 1, tips: 'Nét zic-zac uốn cong chữ số 3 và kết thúc bằng vòng tròn nhỏ ở đáy.', gridType: 'mizi_zh' },
      { id: 'ja_h_re', char: 'れ', name: 'Hiragana Re', language: 'ja', category: 'hiragana', reading: 're', vietnameseMeaning: 'Âm re', strokesCount: 2, tips: 'Nét đứng trái, nét zic-zac uốn lượn hất móc ra ngoài bên phải.', gridType: 'mizi_zh' },
      { id: 'ja_h_ro', char: 'ろ', name: 'Hiragana Ro', language: 'ja', category: 'hiragana', reading: 'ro', vietnameseMeaning: 'Âm ro', strokesCount: 1, tips: 'Nét giống chữ る nhưng không có vòng xoắn ở đuôi.', gridType: 'mizi_zh' },
    ]
  },
  {
    rowLabel: 'Hàng Wa / N (わ)',
    items: [
      { id: 'ja_h_wa', char: 'わ', name: 'Hiragana Wa', language: 'ja', category: 'hiragana', reading: 'wa', vietnameseMeaning: 'Âm wa', strokesCount: 2, tips: 'Nét đứng trái, nét zic-zac lượn vòng cung tròn mở rộng.', gridType: 'mizi_zh' },
      null,
      null,
      null,
      { id: 'ja_h_wo', char: 'を', name: 'Hiragana Wo', language: 'ja', category: 'hiragana', reading: 'wo (o)', vietnameseMeaning: 'Trợ từ wo/o', strokesCount: 3, tips: 'Ngang, xiên gập lượn cung C và nét cong lượn cắt dưới.', gridType: 'mizi_zh' },
    ]
  },
  {
    rowLabel: 'Âm mũi N (ん)',
    items: [
      { id: 'ja_h_n', char: 'ん', name: 'Hiragana N', language: 'ja', category: 'hiragana', reading: 'n', vietnameseMeaning: 'Âm mũi n', strokesCount: 1, tips: 'Một nét liền uốn lượn mềm mại tương tự chữ n viết hoa cách điệu.', gridType: 'mizi_zh' },
      null,
      null,
      null,
      null
    ]
  }
];

// ==========================================
// Phần 2: KATAKANA (50 âm Gojūon chuẩn)
// ア イ ウ エ オ
// カ キ ク ケ コ
// サ シ ス セ ソ
// タ チ ツ テ ト
// ナ ニ ヌ ネ ノ
// ハ ヒ フ ヘ ホ
// マ ミ ム メ モ
// ヤ    ユ    ヨ
// ラ リ ル レ ロ
// ワ          ヲ
// ン
// ==========================================

export const JAPANESE_KATAKANA_ROWS: JapaneseGridRow[] = [
  {
    rowLabel: 'Hàng A (ア)',
    items: [
      { id: 'ja_k_a', char: 'ア', name: 'Katakana A', language: 'ja', category: 'katakana', reading: 'a', vietnameseMeaning: 'Âm a', strokesCount: 2, tips: 'Nét ngang gập ngắn nghiêng sang trái, nét phẩy dài dứt khoát.', gridType: 'mizi_zh' },
      { id: 'ja_k_i', char: 'イ', name: 'Katakana I', language: 'ja', category: 'katakana', reading: 'i', vietnameseMeaning: 'Âm i', strokesCount: 2, tips: 'Nét phẩy trái, nét sổ thẳng từ giữa nét phẩy xuống dưới.', gridType: 'mizi_zh' },
      { id: 'ja_k_u', char: 'ウ', name: 'Katakana U', language: 'ja', category: 'katakana', reading: 'u', vietnameseMeaning: 'Âm u', strokesCount: 3, tips: 'Nét chấm đỉnh, nét đứng ngắn bên trái, nét ngang gập phải.', gridType: 'mizi_zh' },
      { id: 'ja_k_e', char: 'エ', name: 'Katakana E', language: 'ja', category: 'katakana', reading: 'e', vietnameseMeaning: 'Âm e', strokesCount: 3, tips: 'Ngang trên, sổ giữa, ngang đáy dài hơn (hình chữ I in hoa).', gridType: 'mizi_zh' },
      { id: 'ja_k_o', char: 'オ', name: 'Katakana O', language: 'ja', category: 'katakana', reading: 'o', vietnameseMeaning: 'Âm o', strokesCount: 3, tips: 'Nét ngang, nét sổ đứng có móc nhẹ, nét xiên trái kéo qua.', gridType: 'mizi_zh' },
    ]
  },
  {
    rowLabel: 'Hàng Ka (カ)',
    items: [
      { id: 'ja_k_ka', char: 'カ', name: 'Katakana Ka', language: 'ja', category: 'katakana', reading: 'ka', vietnameseMeaning: 'Âm ka', strokesCount: 2, tips: 'Nét ngang gập có móc hất nhọn, nét phẩy dài cắt qua.', gridType: 'mizi_zh' },
      { id: 'ja_k_ki', char: 'キ', name: 'Katakana Ki', language: 'ja', category: 'katakana', reading: 'ki', vietnameseMeaning: 'Âm ki', strokesCount: 3, tips: 'Hai nét ngang song song, nét sổ xiên chếch xuống dứt khoát.', gridType: 'mizi_zh' },
      { id: 'ja_k_ku', char: 'ク', name: 'Katakana Ku', language: 'ja', category: 'katakana', reading: 'ku', vietnameseMeaning: 'Âm ku', strokesCount: 2, tips: 'Nét phẩy ngắn trên trái, nét ngang gập phẩy dài xuống trái.', gridType: 'mizi_zh' },
      { id: 'ja_k_ke', char: 'ケ', name: 'Katakana Ke', language: 'ja', category: 'katakana', reading: 'ke', vietnameseMeaning: 'Âm ke', strokesCount: 3, tips: 'Nét phẩy trên, nét ngang và nét phẩy dài cong xuống trái.', gridType: 'mizi_zh' },
      { id: 'ja_k_ko', char: 'コ', name: 'Katakana Ko', language: 'ja', category: 'katakana', reading: 'ko', vietnameseMeaning: 'Âm ko', strokesCount: 2, tips: 'Nét ngang gập đứng, nét ngang đáy vuông góc (như dấu ngoặc vuông).', gridType: 'mizi_zh' },
    ]
  },
  {
    rowLabel: 'Hàng Sa (サ)',
    items: [
      { id: 'ja_k_sa', char: 'サ', name: 'Katakana Sa', language: 'ja', category: 'katakana', reading: 'sa', vietnameseMeaning: 'Âm sa', strokesCount: 3, tips: 'Nét ngang dài, nét đứng ngắn bên trái, nét sổ hơi cong bên phải.', gridType: 'mizi_zh' },
      { id: 'ja_k_shi', char: 'シ', name: 'Katakana Shi', language: 'ja', category: 'katakana', reading: 'shi', vietnameseMeaning: 'Âm shi', strokesCount: 3, tips: 'Hai nét chấm từ trên xuống, nét hất từ dưới trái vút lên trên phải.', gridType: 'mizi_zh' },
      { id: 'ja_k_su', char: 'ス', name: 'Katakana Su', language: 'ja', category: 'katakana', reading: 'su', vietnameseMeaning: 'Âm su', strokesCount: 2, tips: 'Nét ngang gập xiên sang trái, nét phẩy ngắn tựa vào thân.', gridType: 'mizi_zh' },
      { id: 'ja_k_se', char: 'セ', name: 'Katakana Se', language: 'ja', category: 'katakana', reading: 'se', vietnameseMeaning: 'Âm se', strokesCount: 2, tips: 'Nét ngang gập móc, nét đứng lượn vuông góc sang phải.', gridType: 'mizi_zh' },
      { id: 'ja_k_so', char: 'ソ', name: 'Katakana So', language: 'ja', category: 'katakana', reading: 'so', vietnameseMeaning: 'Âm so', strokesCount: 2, tips: 'Nét chấm góc trên trái, nét phẩy từ trên phải vuốt xuống dưới trái.', gridType: 'mizi_zh' },
    ]
  },
  {
    rowLabel: 'Hàng Ta (タ)',
    items: [
      { id: 'ja_k_ta', char: 'タ', name: 'Katakana Ta', language: 'ja', category: 'katakana', reading: 'ta', vietnameseMeaning: 'Âm ta', strokesCount: 3, tips: 'Nét phẩy, nét ngang gập phẩy dài, nét chấm bên trong.', gridType: 'mizi_zh' },
      { id: 'ja_k_chi', char: 'チ', name: 'Katakana Chi', language: 'ja', category: 'katakana', reading: 'chi', vietnameseMeaning: 'Âm chi', strokesCount: 3, tips: 'Nét phẩy ngang trên đỉnh, nét ngang giữa và nét sổ cong lượn.', gridType: 'mizi_zh' },
      { id: 'ja_k_tsu', char: 'ツ', name: 'Katakana Tsu', language: 'ja', category: 'katakana', reading: 'tsu', vietnameseMeaning: 'Âm tsu', strokesCount: 3, tips: 'Hai nét chấm xếp ngang, nét phẩy từ trên phải vuốt mạnh xuống dưới trái.', gridType: 'mizi_zh' },
      { id: 'ja_k_te', char: 'テ', name: 'Katakana Te', language: 'ja', category: 'katakana', reading: 'te', vietnameseMeaning: 'Âm te', strokesCount: 3, tips: 'Hai nét ngang ngắn, nét phẩy dài cong từ giữa vuốt sang trái.', gridType: 'mizi_zh' },
      { id: 'ja_k_to', char: 'ト', name: 'Katakana To', language: 'ja', category: 'katakana', reading: 'to', vietnameseMeaning: 'Âm to', strokesCount: 2, tips: 'Nét sổ thẳng đứng, nét chấm chéo choãi sang phải ở lưng chừng.', gridType: 'mizi_zh' },
    ]
  },
  {
    rowLabel: 'Hàng Na (ナ)',
    items: [
      { id: 'ja_k_na', char: 'ナ', name: 'Katakana Na', language: 'ja', category: 'katakana', reading: 'na', vietnameseMeaning: 'Âm na', strokesCount: 2, tips: 'Nét ngang dài, nét phẩy cong mềm mại từ giữa kéo sang trái.', gridType: 'mizi_zh' },
      { id: 'ja_k_ni', char: 'ニ', name: 'Katakana Ni', language: 'ja', category: 'katakana', reading: 'ni', vietnameseMeaning: 'Âm ni', strokesCount: 2, tips: 'Hai nét ngang song song (nét dưới dài hơn nét trên).', gridType: 'mizi_zh' },
      { id: 'ja_k_nu', char: 'ヌ', name: 'Katakana Nu', language: 'ja', category: 'katakana', reading: 'nu', vietnameseMeaning: 'Âm nu', strokesCount: 2, tips: 'Nét ngang gập phẩy sang trái, nét chấm/mác cắt qua chân phải.', gridType: 'mizi_zh' },
      { id: 'ja_k_ne', char: 'ネ', name: 'Katakana Ne', language: 'ja', category: 'katakana', reading: 'ne', vietnameseMeaning: 'Âm ne', strokesCount: 4, tips: 'Chấm trên, nét ngang gập xiên, nét sổ thẳng và nét chấm phải.', gridType: 'mizi_zh' },
      { id: 'ja_k_no', char: 'ノ', name: 'Katakana No', language: 'ja', category: 'katakana', reading: 'no', vietnameseMeaning: 'Âm no', strokesCount: 1, tips: 'Một nét phẩy đơn thanh thoát từ góc trên phải vuốt xuống dưới trái.', gridType: 'mizi_zh' },
    ]
  },
  {
    rowLabel: 'Hàng Ha (ハ)',
    items: [
      { id: 'ja_k_ha', char: 'ハ', name: 'Katakana Ha', language: 'ja', category: 'katakana', reading: 'ha', vietnameseMeaning: 'Âm ha', strokesCount: 2, tips: 'Nét phẩy xiên trái, nét mác xiên phải mở góc chữ V ngược.', gridType: 'mizi_zh' },
      { id: 'ja_k_hi', char: 'ヒ', name: 'Katakana Hi', language: 'ja', category: 'katakana', reading: 'hi', vietnameseMeaning: 'Âm hi', strokesCount: 2, tips: 'Nét ngang ngắn, nét sổ gập đáy uốn cong và nét sổ cắt qua.', gridType: 'mizi_zh' },
      { id: 'ja_k_fu', char: 'フ', name: 'Katakana Fu', language: 'ja', category: 'katakana', reading: 'fu', vietnameseMeaning: 'Âm fu', strokesCount: 1, tips: 'Một nét ngang gập phẩy cong nhẹ sang trái dứt khoát.', gridType: 'mizi_zh' },
      { id: 'ja_k_he', char: 'ヘ', name: 'Katakana He', language: 'ja', category: 'katakana', reading: 'he', vietnameseMeaning: 'Âm he', strokesCount: 1, tips: 'Nét hình chóp mái nhà (giống hệt chữ Hiragana へ).', gridType: 'mizi_zh' },
      { id: 'ja_k_ho', char: 'ホ', name: 'Katakana Ho', language: 'ja', category: 'katakana', reading: 'ho', vietnameseMeaning: 'Âm ho', strokesCount: 4, tips: 'Ngang, sổ đứng có móc, nét phẩy trái và nét chấm phải đối xứng.', gridType: 'mizi_zh' },
    ]
  },
  {
    rowLabel: 'Hàng Ma (マ)',
    items: [
      { id: 'ja_k_ma', char: 'マ', name: 'Katakana Ma', language: 'ja', category: 'katakana', reading: 'ma', vietnameseMeaning: 'Âm ma', strokesCount: 2, tips: 'Nét ngang gập xiên sang trái, nét chấm/phẩy tựa ở góc gập.', gridType: 'mizi_zh' },
      { id: 'ja_k_mi', char: 'ミ', name: 'Katakana Mi', language: 'ja', category: 'katakana', reading: 'mi', vietnameseMeaning: 'Âm mi', strokesCount: 3, tips: 'Ba nét xiên song song từ trên xuống dưới đều đặn.', gridType: 'mizi_zh' },
      { id: 'ja_k_mu', char: 'ム', name: 'Katakana Mu', language: 'ja', category: 'katakana', reading: 'mu', vietnameseMeaning: 'Âm mu', strokesCount: 2, tips: 'Nét phẩy gập xiên lên phải, nét chấm/mác nhỏ khép góc tam giác.', gridType: 'mizi_zh' },
      { id: 'ja_k_me', char: 'メ', name: 'Katakana Me', language: 'ja', category: 'katakana', reading: 'me', vietnameseMeaning: 'Âm me', strokesCount: 2, tips: 'Nét phẩy dài, nét xiên ngắn cắt ngang qua tạo hình dấu nhân.', gridType: 'mizi_zh' },
      { id: 'ja_k_mo', char: 'モ', name: 'Katakana Mo', language: 'ja', category: 'katakana', reading: 'mo', vietnameseMeaning: 'Âm mo', strokesCount: 3, tips: 'Hai nét ngang song song, nét sổ gập ngang đáy sang phải.', gridType: 'mizi_zh' },
    ]
  },
  {
    rowLabel: 'Hàng Ya (ヤ)',
    items: [
      { id: 'ja_k_ya', char: 'ヤ', name: 'Katakana Ya', language: 'ja', category: 'katakana', reading: 'ya', vietnameseMeaning: 'Âm ya', strokesCount: 2, tips: 'Nét ngang gập xiên trái, nét sổ thẳng từ trên cắt xuống.', gridType: 'mizi_zh' },
      null, // Trống theo bảng chuẩn
      { id: 'ja_k_yu', char: 'ユ', name: 'Katakana Yu', language: 'ja', category: 'katakana', reading: 'yu', vietnameseMeaning: 'Âm yu', strokesCount: 2, tips: 'Nét gập góc vuông đứng ngang, nét ngang đáy kéo dài sang phải.', gridType: 'mizi_zh' },
      null, // Trống
      { id: 'ja_k_yo', char: 'ヨ', name: 'Katakana Yo', language: 'ja', category: 'katakana', reading: 'yo', vietnameseMeaning: 'Âm yo', strokesCount: 3, tips: 'Nét gập vuông góc, nét ngang giữa và nét ngang đáy (hình chữ E ngược).', gridType: 'mizi_zh' },
    ]
  },
  {
    rowLabel: 'Hàng Ra (ラ)',
    items: [
      { id: 'ja_k_ra', char: 'ラ', name: 'Katakana Ra', language: 'ja', category: 'katakana', reading: 'ra', vietnameseMeaning: 'Âm ra', strokesCount: 2, tips: 'Nét ngang ngắn trên, nét ngang gập phẩy cong dài bên dưới.', gridType: 'mizi_zh' },
      { id: 'ja_k_ri', char: 'リ', name: 'Katakana Ri', language: 'ja', category: 'katakana', reading: 'ri', vietnameseMeaning: 'Âm ri', strokesCount: 2, tips: 'Nét đứng ngắn trái, nét sổ cong dài bên phải dứt khoát.', gridType: 'mizi_zh' },
      { id: 'ja_k_ru', char: 'ル', name: 'Katakana Ru', language: 'ja', category: 'katakana', reading: 'ru', vietnameseMeaning: 'Âm ru', strokesCount: 2, tips: 'Nét phẩy trái, nét sổ uốn móc cong hất lên ở bên phải.', gridType: 'mizi_zh' },
      { id: 'ja_k_re', char: 'レ', name: 'Katakana Re', language: 'ja', category: 'katakana', reading: 're', vietnameseMeaning: 'Âm re', strokesCount: 1, tips: 'Một nét sổ thẳng xuống rồi gập hất vút lên chếch sang phải.', gridType: 'mizi_zh' },
      { id: 'ja_k_ro', char: 'ロ', name: 'Katakana Ro', language: 'ja', category: 'katakana', reading: 'ro', vietnameseMeaning: 'Âm ro', strokesCount: 3, tips: 'Khung vuông vức gồm 3 nét: sổ, ngang gập, đóng đáy.', gridType: 'mizi_zh' },
    ]
  },
  {
    rowLabel: 'Hàng Wa / N (ワ)',
    items: [
      { id: 'ja_k_wa', char: 'ワ', name: 'Katakana Wa', language: 'ja', category: 'katakana', reading: 'wa', vietnameseMeaning: 'Âm wa', strokesCount: 2, tips: 'Nét đứng ngắn bên trái, nét ngang gập phẩy cong sang trái.', gridType: 'mizi_zh' },
      null,
      null,
      null,
      { id: 'ja_k_wo', char: 'ヲ', name: 'Katakana Wo', language: 'ja', category: 'katakana', reading: 'wo (o)', vietnameseMeaning: 'Trợ từ wo/o', strokesCount: 3, tips: 'Ngang, ngang gập xiên trái và nét phẩy cắt qua.', gridType: 'mizi_zh' },
    ]
  },
  {
    rowLabel: 'Âm mũi N (ン)',
    items: [
      { id: 'ja_k_n', char: 'ン', name: 'Katakana N', language: 'ja', category: 'katakana', reading: 'n', vietnameseMeaning: 'Âm mũi n', strokesCount: 2, tips: 'Nét chấm góc trên trái, nét hất từ dưới trái vút mạnh lên trên phải.', gridType: 'mizi_zh' },
      null,
      null,
      null,
      null
    ]
  }
];

// Helper to flatten rows into CharacterItem array
export const JAPANESE_HIRAGANA_FLAT: CharacterItem[] = JAPANESE_HIRAGANA_ROWS.flatMap(r => 
  r.items.filter((item): item is CharacterItem => item !== null)
);

export const JAPANESE_KATAKANA_FLAT: CharacterItem[] = JAPANESE_KATAKANA_ROWS.flatMap(r => 
  r.items.filter((item): item is CharacterItem => item !== null)
);

// Backward-compatibility aliases if needed:
export const VIETNAMESE_UPPERCASE: CharacterItem[] = VIETNAMESE_LETTERS.map(item => ({
  ...item,
  id: `${item.id}_u`,
  char: item.upperChar || item.char[0],
  name: `Chữ ${item.upperChar || item.char[0]} hoa`,
  category: 'uppercase',
  strokesCount: item.upperStrokesCount || item.strokesCount,
  strokes: item.upperStrokes || item.strokes,
}));

export const VIETNAMESE_LOWERCASE: CharacterItem[] = VIETNAMESE_LETTERS.map(item => ({
  ...item,
  id: `${item.id}_l`,
  char: item.lowerChar || (item.char.length > 1 ? item.char[1] : item.char),
  name: `Chữ ${item.lowerChar || (item.char.length > 1 ? item.char[1] : item.char)} thường`,
  category: 'lowercase',
  strokesCount: item.lowerStrokesCount || item.strokesCount,
  strokes: item.lowerStrokes || item.strokes,
}));

export const ENGLISH_UPPERCASE: CharacterItem[] = ENGLISH_LETTERS.map(item => ({
  ...item,
  id: `${item.id}_u`,
  char: item.upperChar || item.char[0],
  name: `Letter ${item.upperChar || item.char[0]} (Uppercase)`,
  category: 'uppercase',
  strokesCount: item.upperStrokesCount || item.strokesCount,
  strokes: item.upperStrokes || item.strokes,
}));

export const ENGLISH_LOWERCASE: CharacterItem[] = ENGLISH_LETTERS.map(item => ({
  ...item,
  id: `${item.id}_l`,
  char: item.lowerChar || (item.char.length > 1 ? item.char[1] : item.char),
  name: `Letter ${item.lowerChar || (item.char.length > 1 ? item.char[1] : item.char)} (Lowercase)`,
  category: 'lowercase',
  strokesCount: item.lowerStrokesCount || item.strokesCount,
  strokes: item.lowerStrokes || item.strokes,
}));

// Unified function to get data for any language without any duplicates
export function getAlphabetData(lang: LanguageCode): {
  categories: { id: string; name: string }[];
  items: CharacterItem[];
} {
  switch (lang) {
    case 'vi':
      return {
        categories: [
          { id: 'all', name: '29 Chữ cái (A - Y)' },
          { id: 'accents', name: '8 Dấu tiếng Việt' },
          { id: 'all_accents', name: 'Tất cả (29 chữ & 8 dấu)' }
        ],
        items: [...VIETNAMESE_LETTERS, ...VIETNAMESE_ACCENTS]
      };
    case 'en':
      return {
        categories: [
          { id: 'all', name: '26 Letters (A - Z)' }
        ],
        items: ENGLISH_LETTERS
      };
    case 'ja':
      return {
        categories: [
          { id: 'hiragana', name: 'Hiragana (あ い う え お...)' },
          { id: 'katakana', name: 'Katakana (ア イ ウ エ オ...)' }
        ],
        items: [...JAPANESE_HIRAGANA_FLAT, ...JAPANESE_KATAKANA_FLAT]
      };
    case 'zh':
      // Tiếng Trung tự viết câu rồi luyện, không cần bảng chữ cái
      return {
        categories: [],
        items: []
      };
    default:
      return { categories: [], items: [] };
  }
}
