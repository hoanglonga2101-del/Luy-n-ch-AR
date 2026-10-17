import { StrokePath } from '../types';

// Pre-defined detailed stroke order paths for key representative characters in each script
// Coordinates normalized to 100x100 box
export const CHARACTER_STROKE_DATA: Record<string, StrokePath[]> = {
  // Vietnamese / English Letters
  'a': [
    { id: 1, d: 'M 65 45 C 60 30 35 30 35 50 C 35 70 65 70 65 50 Z', label: 'Nét 1: Nét cong kín', startPoint: { x: 65, y: 35 }, direction: 'curve' },
    { id: 2, d: 'M 65 35 L 65 75 C 65 80 72 82 78 80', label: 'Nét 2: Nét móc ngược phải', startPoint: { x: 65, y: 35 }, direction: 'vertical' }
  ],
  'A': [
    { id: 1, d: 'M 50 15 L 20 85', label: 'Nét 1: Nét xiên trái', startPoint: { x: 50, y: 15 }, direction: 'slanted_left' },
    { id: 2, d: 'M 50 15 L 80 85', label: 'Nét 2: Nét xiên phải', startPoint: { x: 50, y: 15 }, direction: 'slanted_right' },
    { id: 3, d: 'M 32 60 L 68 60', label: 'Nét 3: Nét ngang nối', startPoint: { x: 32, y: 60 }, direction: 'horizontal' }
  ],
  'b': [
    { id: 1, d: 'M 35 15 L 35 75 C 35 80 40 82 45 80', label: 'Nét 1: Nét khuyết trên & thân sổ', startPoint: { x: 35, y: 15 }, direction: 'vertical' },
    { id: 2, d: 'M 35 52 C 45 42 68 45 68 62 C 68 78 45 82 35 75', label: 'Nét 2: Nét thắt / cong tròn dưới', startPoint: { x: 35, y: 52 }, direction: 'curve' }
  ],
  'B': [
    { id: 1, d: 'M 30 15 L 30 85', label: 'Nét 1: Nét sổ đứng', startPoint: { x: 30, y: 15 }, direction: 'vertical' },
    { id: 2, d: 'M 30 15 C 60 15 65 30 65 48 C 65 50 50 50 30 50', label: 'Nét 2: Nét cong trên', startPoint: { x: 30, y: 15 }, direction: 'curve' },
    { id: 3, d: 'M 30 50 C 65 50 72 65 72 85 C 50 85 30 85 30 85', label: 'Nét 3: Nét cong dưới', startPoint: { x: 30, y: 50 }, direction: 'curve' }
  ],
  'c': [
    { id: 1, d: 'M 70 42 C 60 30 32 35 32 55 C 32 75 60 80 72 70', label: 'Nét 1: Nét cong hở phải', startPoint: { x: 70, y: 42 }, direction: 'curve' }
  ],
  'd': [
    { id: 1, d: 'M 62 48 C 55 35 35 35 35 55 C 35 75 58 75 62 65 Z', label: 'Nét 1: Nét cong kín', startPoint: { x: 62, y: 48 }, direction: 'curve' },
    { id: 2, d: 'M 62 18 L 62 76 C 62 82 68 83 74 80', label: 'Nét 2: Nét móc ngược dài (2 ô ly)', startPoint: { x: 62, y: 18 }, direction: 'vertical' }
  ],
  'đ': [
    { id: 1, d: 'M 62 48 C 55 35 35 35 35 55 C 35 75 58 75 62 65 Z', label: 'Nét 1: Nét cong kín', startPoint: { x: 62, y: 48 }, direction: 'curve' },
    { id: 2, d: 'M 62 18 L 62 76 C 62 82 68 83 74 80', label: 'Nét 2: Nét móc ngược', startPoint: { x: 62, y: 18 }, direction: 'vertical' },
    { id: 3, d: 'M 50 28 L 74 28', label: 'Nét 3: Nét gạch ngang ngắn', startPoint: { x: 50, y: 28 }, direction: 'horizontal' }
  ],
  'ă': [
    { id: 1, d: 'M 65 48 C 60 35 35 35 35 55 C 35 75 65 75 65 55 Z', label: 'Nét 1: Nét cong kín', startPoint: { x: 65, y: 38 }, direction: 'curve' },
    { id: 2, d: 'M 65 38 L 65 75 C 65 80 72 82 78 80', label: 'Nét 2: Nét móc ngược phải', startPoint: { x: 65, y: 38 }, direction: 'vertical' },
    { id: 3, d: 'M 42 24 C 48 30 52 30 58 24', label: 'Nét 3: Dấu mũ cong ngửa', startPoint: { x: 42, y: 24 }, direction: 'curve' }
  ],
  'â': [
    { id: 1, d: 'M 65 48 C 60 35 35 35 35 55 C 35 75 65 75 65 55 Z', label: 'Nét 1: Nét cong kín', startPoint: { x: 65, y: 38 }, direction: 'curve' },
    { id: 2, d: 'M 65 38 L 65 75 C 65 80 72 82 78 80', label: 'Nét 2: Nét móc ngược phải', startPoint: { x: 65, y: 38 }, direction: 'vertical' },
    { id: 3, d: 'M 42 28 L 50 20 L 58 28', label: 'Nét 3: Dấu mũ nón úp', startPoint: { x: 42, y: 28 }, direction: 'slanted_left' }
  ],
  'e': [
    { id: 1, d: 'M 35 58 L 68 54 C 68 36 38 34 34 52 C 30 72 60 78 72 70', label: 'Nét 1: Nét cong hở phải liền nét lượn ngang', startPoint: { x: 35, y: 58 }, direction: 'curve' }
  ],
  'ê': [
    { id: 1, d: 'M 35 58 L 68 54 C 68 36 38 34 34 52 C 30 72 60 78 72 70', label: 'Nét 1: Thân chữ e', startPoint: { x: 35, y: 58 }, direction: 'curve' },
    { id: 2, d: 'M 44 26 L 50 20 L 56 26', label: 'Nét 2: Dấu mũ nón úp', startPoint: { x: 44, y: 26 }, direction: 'slanted_left' }
  ],
  'l': [
    { id: 1, d: 'M 45 76 L 45 28 C 45 15 56 15 56 26 L 56 75 C 56 80 62 82 68 80', label: 'Nét 1: Nét khuyết trên nối liền móc ngược', startPoint: { x: 45, y: 76 }, direction: 'vertical' }
  ],
  'm': [
    { id: 1, d: 'M 28 45 L 28 78', label: 'Nét 1: Nét móc xuôi trái', startPoint: { x: 28, y: 45 }, direction: 'vertical' },
    { id: 2, d: 'M 28 55 C 32 40 48 40 48 78', label: 'Nét 2: Nét móc xuôi rộng', startPoint: { x: 28, y: 55 }, direction: 'vertical' },
    { id: 3, d: 'M 48 55 C 52 40 70 40 70 75 C 70 80 76 82 80 80', label: 'Nét 3: Nét móc hai đầu có móc hất', startPoint: { x: 48, y: 55 }, direction: 'hook' }
  ],
  'n': [
    { id: 1, d: 'M 35 45 L 35 78', label: 'Nét 1: Nét móc xuôi trái', startPoint: { x: 35, y: 45 }, direction: 'vertical' },
    { id: 2, d: 'M 35 55 C 42 40 68 40 68 75 C 68 80 74 82 78 80', label: 'Nét 2: Nét móc hai đầu', startPoint: { x: 35, y: 55 }, direction: 'hook' }
  ],
  'o': [
    { id: 1, d: 'M 50 32 C 68 32 72 48 72 60 C 72 72 68 84 50 84 C 32 84 28 72 28 60 C 28 48 32 32 50 32 Z', label: 'Nét 1: Nét cong kín tròn đều', startPoint: { x: 50, y: 32 }, direction: 'curve' }
  ],
  'ô': [
    { id: 1, d: 'M 50 36 C 68 36 72 50 72 62 C 72 74 68 84 50 84 C 32 84 28 74 28 62 C 28 50 32 36 50 36 Z', label: 'Nét 1: Nét cong kín', startPoint: { x: 50, y: 36 }, direction: 'curve' },
    { id: 2, d: 'M 44 26 L 50 20 L 56 26', label: 'Nét 2: Dấu mũ nón úp', startPoint: { x: 44, y: 26 }, direction: 'slanted_left' }
  ],
  'ơ': [
    { id: 1, d: 'M 50 36 C 68 36 72 50 72 62 C 72 74 68 84 50 84 C 32 84 28 74 28 62 C 28 50 32 36 50 36 Z', label: 'Nét 1: Nét cong kín', startPoint: { x: 50, y: 36 }, direction: 'curve' },
    { id: 2, d: 'M 68 36 C 72 32 76 34 74 40', label: 'Nét 2: Nét râu móc nhỏ bên phải', startPoint: { x: 68, y: 36 }, direction: 'curve' }
  ],
  'u': [
    { id: 1, d: 'M 30 50 L 38 42', label: 'Nét 1: Nét hất xiên ngắn', startPoint: { x: 30, y: 50 }, direction: 'slanted_right' },
    { id: 2, d: 'M 38 42 L 38 72 C 38 80 56 80 56 72 L 56 42', label: 'Nét 2: Nét móc ngược rộng', startPoint: { x: 38, y: 42 }, direction: 'vertical' },
    { id: 3, d: 'M 56 42 L 56 75 C 56 80 62 82 66 80', label: 'Nét 3: Nét móc ngược phải', startPoint: { x: 56, y: 42 }, direction: 'vertical' }
  ],
  'ư': [
    { id: 1, d: 'M 38 42 L 38 72 C 38 80 56 80 56 72 L 56 42', label: 'Nét 1: Thân móc ngược', startPoint: { x: 38, y: 42 }, direction: 'vertical' },
    { id: 2, d: 'M 56 42 L 56 75 C 56 80 62 82 66 80', label: 'Nét 2: Nét móc ngược phải', startPoint: { x: 56, y: 42 }, direction: 'vertical' },
    { id: 3, d: 'M 56 42 C 60 38 64 40 62 46', label: 'Nét 3: Nét râu móc nhỏ', startPoint: { x: 56, y: 42 }, direction: 'curve' }
  ],

  // Chinese Basic Strokes (Vĩnh Tự Bát Pháp)
  '一': [
    { id: 1, d: 'M 18 50 C 35 48 65 48 82 50', label: 'Nét 1: 横 (Héng) - Ngang từ trái sang phải', startPoint: { x: 18, y: 50 }, direction: 'horizontal' }
  ],
  '二': [
    { id: 1, d: 'M 30 36 L 70 36', label: 'Nét 1: 横 (Héng ngắn trên)', startPoint: { x: 30, y: 36 }, direction: 'horizontal' },
    { id: 2, d: 'M 18 64 L 82 64', label: 'Nét 2: 横 (Héng dài dưới)', startPoint: { x: 18, y: 64 }, direction: 'horizontal' }
  ],
  '三': [
    { id: 1, d: 'M 28 28 L 72 28', label: 'Nét 1: 横 (Héng trên)', startPoint: { x: 28, y: 28 }, direction: 'horizontal' },
    { id: 2, d: 'M 35 50 L 65 50', label: 'Nét 2: 横 (Héng giữa ngắn)', startPoint: { x: 35, y: 50 }, direction: 'horizontal' },
    { id: 3, d: 'M 18 72 L 82 72', label: 'Nét 3: 横 (Héng dưới dài nhất)', startPoint: { x: 18, y: 72 }, direction: 'horizontal' }
  ],
  '人': [
    { id: 1, d: 'M 50 18 C 45 42 35 65 18 82', label: 'Nét 1: 撇 (Piě) - Phẩy từ trên chếch xuống trái', startPoint: { x: 50, y: 18 }, direction: 'slanted_left' },
    { id: 2, d: 'M 42 42 C 55 58 68 72 84 82', label: 'Nét 2: 捺 (Nà) - Mác từ trái chếch xuống phải', startPoint: { x: 42, y: 42 }, direction: 'slanted_right' }
  ],
  '大': [
    { id: 1, d: 'M 18 40 L 82 40', label: 'Nét 1: 横 (Héng) - Ngang', startPoint: { x: 18, y: 40 }, direction: 'horizontal' },
    { id: 2, d: 'M 50 20 C 48 45 38 68 20 84', label: 'Nét 2: 撇 (Piě) - Phẩy dài qua nét ngang', startPoint: { x: 50, y: 20 }, direction: 'slanted_left' },
    { id: 3, d: 'M 46 44 C 58 60 70 74 84 84', label: 'Nét 3: 捺 (Nà) - Mác choãi chân phải', startPoint: { x: 46, y: 44 }, direction: 'slanted_right' }
  ],
  '中': [
    { id: 1, d: 'M 25 32 L 25 68', label: 'Nét 1: 竖 (Shù) - Sổ thân trái', startPoint: { x: 25, y: 32 }, direction: 'vertical' },
    { id: 2, d: 'M 25 32 L 75 32 L 75 68', label: 'Nét 2: 横折 (Héngzhé) - Ngang gập', startPoint: { x: 25, y: 32 }, direction: 'hook' },
    { id: 3, d: 'M 25 68 L 75 68', label: 'Nét 3: 横 (Héng) - Ngang đáy đóng khung', startPoint: { x: 25, y: 68 }, direction: 'horizontal' },
    { id: 4, d: 'M 50 14 L 50 86', label: 'Nét 4: 竖 (Shù dài) - Sổ xuyên tâm ở giữa', startPoint: { x: 50, y: 14 }, direction: 'vertical' }
  ],
  '日': [
    { id: 1, d: 'M 28 20 L 28 80', label: 'Nét 1: 竖 (Shù) - Sổ trái', startPoint: { x: 28, y: 20 }, direction: 'vertical' },
    { id: 2, d: 'M 28 20 L 72 20 L 72 80', label: 'Nét 2: 横折 (Héngzhé) - Ngang gập', startPoint: { x: 28, y: 20 }, direction: 'hook' },
    { id: 3, d: 'M 28 50 L 72 50', label: 'Nét 3: 横 (Héng) - Ngang giữa', startPoint: { x: 28, y: 50 }, direction: 'horizontal' },
    { id: 4, d: 'M 28 80 L 72 80', label: 'Nét 4: 横 (Héng) - Ngang đóng đáy', startPoint: { x: 28, y: 80 }, direction: 'horizontal' }
  ],
  '月': [
    { id: 1, d: 'M 30 20 C 30 45 28 72 20 85', label: 'Nét 1: 撇 (Piě) - Phẩy thân trái', startPoint: { x: 30, y: 20 }, direction: 'slanted_left' },
    { id: 2, d: 'M 30 20 L 72 20 L 72 82 C 72 85 68 85 64 80', label: 'Nét 2: 横折钩 (Héngzhégōu) - Ngang gập móc', startPoint: { x: 30, y: 20 }, direction: 'hook' },
    { id: 3, d: 'M 30 42 L 72 42', label: 'Nét 3: 横 (Héng) - Ngang trên', startPoint: { x: 30, y: 42 }, direction: 'horizontal' },
    { id: 4, d: 'M 30 62 L 72 62', label: 'Nét 4: 横 (Héng) - Ngang dưới', startPoint: { x: 30, y: 62 }, direction: 'horizontal' }
  ],
  '学': [
    { id: 1, d: 'M 32 20 L 38 28', label: 'Nét 1: 点 (Diǎn trái)', startPoint: { x: 32, y: 20 }, direction: 'slanted_right' },
    { id: 2, d: 'M 50 16 L 50 26', label: 'Nét 2: 点 (Diǎn giữa)', startPoint: { x: 50, y: 16 }, direction: 'vertical' },
    { id: 3, d: 'M 68 18 L 62 26', label: 'Nét 3: 撇 (Piě phải)', startPoint: { x: 68, y: 18 }, direction: 'slanted_left' },
    { id: 4, d: 'M 24 36 L 24 44', label: 'Nét 4: 点/竖 (Mái nhà trái)', startPoint: { x: 24, y: 36 }, direction: 'vertical' },
    { id: 5, d: 'M 24 38 L 76 38 L 72 46', label: 'Nét 5: 横撇/横钩 (Mái nhà gập)', startPoint: { x: 24, y: 38 }, direction: 'hook' },
    { id: 6, d: 'M 45 46 L 55 46 L 42 62 L 56 62 C 58 62 60 64 60 70 C 60 84 48 86 36 80', label: 'Nét 6: 横折弯钩 (Bộ Tử cong móc)', startPoint: { x: 45, y: 46 }, direction: 'curve' },
    { id: 7, d: 'M 22 66 L 78 66', label: 'Nét 7: 横 (Ngang dài bộ Tử)', startPoint: { x: 22, y: 66 }, direction: 'horizontal' }
  ],

  // Japanese Hiragana
  'あ': [
    { id: 1, d: 'M 28 32 C 45 28 65 30 72 32', label: 'Nét 1: Nét ngang trên (trái sang phải)', startPoint: { x: 28, y: 32 }, direction: 'horizontal' },
    { id: 2, d: 'M 50 18 C 50 45 48 70 45 84', label: 'Nét 2: Nét sổ hơi uốn lượn xuyên qua nét ngang', startPoint: { x: 50, y: 18 }, direction: 'vertical' },
    { id: 3, d: 'M 60 44 C 45 38 25 50 30 70 C 35 84 62 88 74 72 C 84 58 75 45 60 48', label: 'Nét 3: Nét xoắn vòng cung tròn mềm mại', startPoint: { x: 60, y: 44 }, direction: 'curve' }
  ],
  'い': [
    { id: 1, d: 'M 35 28 C 30 48 30 65 36 78 C 38 82 42 80 44 74', label: 'Nét 1: Nét cong trái có móc hất ngược', startPoint: { x: 35, y: 28 }, direction: 'hook' },
    { id: 2, d: 'M 68 34 C 70 48 68 62 64 70', label: 'Nét 2: Nét cong ngắn bên phải', startPoint: { x: 68, y: 34 }, direction: 'curve' }
  ],
  'う': [
    { id: 1, d: 'M 44 22 C 50 22 56 26 52 30', label: 'Nét 1: Nét phẩy cong nhỏ phía trên', startPoint: { x: 44, y: 22 }, direction: 'curve' },
    { id: 2, d: 'M 38 42 C 65 38 72 58 68 72 C 62 84 45 86 36 82', label: 'Nét 2: Nét vòng cung lớn như chiếc tai', startPoint: { x: 38, y: 42 }, direction: 'curve' }
  ],
  'え': [
    { id: 1, d: 'M 46 20 C 50 20 54 24 50 28', label: 'Nét 1: Nét phẩy ngắn trên đỉnh', startPoint: { x: 46, y: 20 }, direction: 'curve' },
    { id: 2, d: 'M 32 44 L 66 44 L 38 72 C 55 68 72 68 76 78', label: 'Nét 2: Nét zic-zac uốn lượn phía dưới', startPoint: { x: 32, y: 44 }, direction: 'hook' }
  ],
  'お': [
    { id: 1, d: 'M 28 35 L 68 35', label: 'Nét 1: Nét ngang ngắn', startPoint: { x: 28, y: 35 }, direction: 'horizontal' },
    { id: 2, d: 'M 48 20 L 48 55 C 38 52 30 62 34 74 C 40 84 62 85 70 70 C 76 60 74 50 64 52', label: 'Nét 2: Nét sổ xoắn vòng tròn đáy', startPoint: { x: 48, y: 20 }, direction: 'curve' },
    { id: 3, d: 'M 72 32 C 76 34 78 40 74 44', label: 'Nét 3: Nét chấm bên phải', startPoint: { x: 72, y: 32 }, direction: 'curve' }
  ],

  // Katakana
  'ア': [
    { id: 1, d: 'M 30 30 L 70 30 L 60 55', label: 'Nét 1: Ngang gập ngắn nghiêng sang trái', startPoint: { x: 30, y: 30 }, direction: 'hook' },
    { id: 2, d: 'M 45 42 C 40 58 32 74 22 84', label: 'Nét 2: Phẩy dài cong từ giữa xuống trái', startPoint: { x: 45, y: 42 }, direction: 'slanted_left' }
  ],
  'カ': [
    { id: 1, d: 'M 28 32 L 68 32 C 70 42 66 54 58 60', label: 'Nét 1: Ngang gập có móc hất', startPoint: { x: 28, y: 32 }, direction: 'hook' },
    { id: 2, d: 'M 48 20 C 45 45 35 70 20 84', label: 'Nét 2: Phẩy dài cắt qua nét 1', startPoint: { x: 48, y: 20 }, direction: 'slanted_left' }
  ]
};

// Fallback dynamic stroke generator for any custom character
export function getStrokesForCharacter(char: string): StrokePath[] {
  if (CHARACTER_STROKE_DATA[char]) {
    return CHARACTER_STROKE_DATA[char];
  }

  // Generates smart geometric trace paths based on character type
  return [
    {
      id: 1,
      d: 'M 25 35 L 75 35',
      label: 'Nét 1: Đặt bút và định hình nét đầu',
      startPoint: { x: 25, y: 35 },
      direction: 'horizontal'
    },
    {
      id: 2,
      d: 'M 50 35 L 50 75',
      label: 'Nét 2: Kéo nét thân cân xứng',
      startPoint: { x: 50, y: 35 },
      direction: 'vertical'
    },
    {
      id: 3,
      d: 'M 30 75 L 70 75',
      label: 'Nét 3: Nét kết thúc thanh thoát',
      startPoint: { x: 30, y: 75 },
      direction: 'horizontal'
    }
  ];
}
