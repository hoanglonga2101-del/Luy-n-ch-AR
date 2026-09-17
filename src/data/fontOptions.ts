export interface FontOption {
  id: string;
  order: number;
  name: string;
  vietnameseTitle: string;
  englishName: string;
  shortName?: string;
  fontFamily: string;
  className: string;
  tag: string;
  description: string;
  sampleText: string;
  isEnglishPrioritized?: boolean;
}

/**
 * 15 Google Fonts Tiếng Anh đa dạng theo yêu cầu người dùng:
 * 1. Great Vibes (Calligraphy Cổ Điển)
 * 2. Pinyon Script (Chữ Nghiêng Hoàng Gia)
 * 3. Alex Brush (Chữ Nối Mềm Mại)
 * 4. Indie Flower (Chữ Viết Tay Tự Nhiên)
 * 5. Shadows Into Light (Chữ Ghi Chép Ngăn Nắp)
 * 6. Covered By Your Grace (Chữ Viết Nhanh)
 * 7. Sacramento (Chữ Nối Nét Mảnh)
 * 8. Satisfy (Chữ Bút Dạ Retro)
 * 9. Permanent Marker (Chữ Bút Dạ Tiêu Đề)
 * 10. Yellowtail (Chữ Bút Cọ Phấn)
 * 11. Amatic SC (Chữ In Hoa Cao Mảnh)
 * 12. Fredoka (Chữ In Tròn Dễ Đọc)
 * 13. Architects Daughter (Chữ In Kiến Trúc)
 * 14. UnifrakturMaguntia (Chữ Gothic Cổ)
 * 15. Montez (Chữ Nối Phóng Khoáng)
 */
export const GOOGLE_15_ENGLISH_FONTS: FontOption[] = [
  {
    id: 'great_vibes',
    order: 1,
    name: 'Great Vibes',
    vietnameseTitle: 'Great Vibes (Calligraphy Cổ Điển)',
    englishName: 'Great Vibes',
    shortName: 'Great Vibes',
    fontFamily: "'Great Vibes', cursive",
    className: 'font-great-vibes',
    tag: 'Calligraphy Cổ Điển',
    description: 'Phong cách thư pháp quý phái, các nét lượn cong thanh lịch chuẩn phong cách thiệp cưới.',
    sampleText: 'Practice handwriting with elegance & grace',
    isEnglishPrioritized: true,
  },
  {
    id: 'pinyon_script',
    order: 2,
    name: 'Pinyon Script',
    vietnameseTitle: 'Pinyon Script (Chữ Nghiêng Hoàng Gia)',
    englishName: 'Pinyon Script',
    shortName: 'Pinyon Script',
    fontFamily: "'Pinyon Script', cursive",
    className: 'font-pinyon-script',
    tag: 'Chữ Nghiêng Hoàng Gia',
    description: 'Nét chữ nghiêng cổ điển châu Âu, độ nghiêng tao nhã, nét bút sắc cạnh rất bắt mắt.',
    sampleText: 'Royal cursive lettering & timeless beauty',
    isEnglishPrioritized: true,
  },
  {
    id: 'alex_brush',
    order: 3,
    name: 'Alex Brush',
    vietnameseTitle: 'Alex Brush (Chữ Nối Mềm Mại)',
    englishName: 'Alex Brush',
    shortName: 'Alex Brush',
    fontFamily: "'Alex Brush', cursive",
    className: 'font-alex-brush',
    tag: 'Chữ Nối Mềm Mại',
    description: 'Kiểu chữ nối bút lông mềm mại, khoảng cách các chữ mở rộng giúp ngòi bút dễ lướt.',
    sampleText: 'Smooth brush script for daily penmanship',
    isEnglishPrioritized: true,
  },
  {
    id: 'indie_flower',
    order: 4,
    name: 'Indie Flower',
    vietnameseTitle: 'Indie Flower (Chữ Viết Tay Tự Nhiên)',
    englishName: 'Indie Flower',
    shortName: 'Indie Flower',
    fontFamily: "'Indie Flower', cursive",
    className: 'font-indie-flower',
    tag: 'Chữ Viết Tay Tự Nhiên',
    description: 'Phong cách viết tay phóng khoáng, nét chữ trẻ trung, tươi sáng và rất thân thiện.',
    sampleText: 'Friendly natural handwriting notes',
    isEnglishPrioritized: true,
  },
  {
    id: 'shadows_into_light',
    order: 5,
    name: 'Shadows Into Light',
    vietnameseTitle: 'Shadows Into Light (Chữ Ghi Chép Ngăn Nắp)',
    englishName: 'Shadows Into Light',
    shortName: 'Shadows Into Light',
    fontFamily: "'Shadows Into Light', cursive",
    className: 'font-shadows-into-light',
    tag: 'Chữ Ghi Chép Ngăn Nắp',
    description: 'Nét chữ ghi chú sổ tay gọn gàng, cạnh tròn sạch sẽ, độ rõ nét cao khi chiếu AR.',
    sampleText: 'Clean journal notes and neat lettering',
    isEnglishPrioritized: true,
  },
  {
    id: 'covered_by_your_grace',
    order: 6,
    name: 'Covered By Your Grace',
    vietnameseTitle: 'Covered By Your Grace (Chữ Viết Nhanh)',
    englishName: 'Covered By Your Grace',
    shortName: 'Covered Grace',
    fontFamily: "'Covered By Your Grace', cursive",
    className: 'font-covered-by-your-grace',
    tag: 'Chữ Viết Nhanh',
    description: 'Dáng chữ thanh mảnh như người viết tốc ký nhanh, các ký tự đứng thẳng thon gọn.',
    sampleText: 'Quick cursive shorthand pen strokes',
    isEnglishPrioritized: true,
  },
  {
    id: 'sacramento',
    order: 7,
    name: 'Sacramento',
    vietnameseTitle: 'Sacramento (Chữ Nối Nét Mảnh)',
    englishName: 'Sacramento',
    shortName: 'Sacramento',
    fontFamily: "'Sacramento', cursive",
    className: 'font-sacramento',
    tag: 'Chữ Nối Nét Mảnh',
    description: 'Nét chữ monoline thanh mảnh tinh tế, liên kết nhịp nhàng giữa nét in và nét nối.',
    sampleText: 'Delicate mono-line connected script',
    isEnglishPrioritized: true,
  },
  {
    id: 'satisfy',
    order: 8,
    name: 'Satisfy',
    vietnameseTitle: 'Satisfy (Chữ Bút Dạ Retro)',
    englishName: 'Satisfy',
    shortName: 'Satisfy',
    fontFamily: "'Satisfy', cursive",
    className: 'font-satisfy',
    tag: 'Chữ Bút Dạ Retro',
    description: 'Nét bút lông dạ dày dặn phong cách retro thập niên 50, cực kỳ sắc nét trên giấy kẻ.',
    sampleText: 'Satisfying retro flair with thick strokes',
    isEnglishPrioritized: true,
  },
  {
    id: 'permanent_marker',
    order: 9,
    name: 'Permanent Marker',
    vietnameseTitle: 'Permanent Marker (Chữ Bút Dạ Tiêu Đề)',
    englishName: 'Permanent Marker',
    shortName: 'Marker',
    fontFamily: "'Permanent Marker', cursive",
    className: 'font-permanent-marker',
    tag: 'Chữ Bút Dạ Tiêu Đề',
    description: 'Nét bút lông bảng to bản, tương phản cực đại, chống lóa sáng camera tốt nhất.',
    sampleText: 'BOLD HEADLINE PEN STROKES',
    isEnglishPrioritized: true,
  },
  {
    id: 'yellowtail',
    order: 10,
    name: 'Yellowtail',
    vietnameseTitle: 'Yellowtail (Chữ Bút Cọ Phấn)',
    englishName: 'Yellowtail',
    shortName: 'Yellowtail',
    fontFamily: "'Yellowtail', cursive",
    className: 'font-yellowtail',
    tag: 'Chữ Bút Cọ Phấn',
    description: 'Chữ ký bảng phấn kiểu cổ điển, nét đậm nhạt rõ ràng theo hướng di chuyển của bút.',
    sampleText: 'Classic sign painter brush script',
    isEnglishPrioritized: true,
  },
  {
    id: 'amatic_sc',
    order: 11,
    name: 'Amatic SC',
    vietnameseTitle: 'Amatic SC (Chữ In Hoa Cao Mảnh)',
    englishName: 'Amatic SC',
    shortName: 'Amatic SC',
    fontFamily: "'Amatic SC', cursive",
    className: 'font-amatic-sc',
    tag: 'Chữ In Hoa Cao Mảnh',
    description: 'Chữ in hoa thân cao, thanh thoát, dáng mộc mạc thích hợp luyện chữ tiêu đề poster.',
    sampleText: 'TALL SLENDER HAND-DRAWN CAPS',
    isEnglishPrioritized: true,
  },
  {
    id: 'fredoka',
    order: 12,
    name: 'Fredoka',
    vietnameseTitle: 'Fredoka (Chữ In Tròn Dễ Đọc)',
    englishName: 'Fredoka',
    shortName: 'Fredoka',
    fontFamily: "'Fredoka', sans-serif",
    className: 'font-soft-rounded',
    tag: 'Chữ In Tròn Dễ Đọc',
    description: 'Thân chữ bo tròn hình học, nét dày dặn tương phản cao, cực kỳ dễ nhận diện.',
    sampleText: 'Clean modern rounded geometric shapes',
    isEnglishPrioritized: true,
  },
  {
    id: 'architects_daughter',
    order: 13,
    name: 'Architects Daughter',
    vietnameseTitle: 'Architects Daughter (Chữ In Kiến Trúc)',
    englishName: 'Architects Daughter',
    shortName: 'Arch Daughter',
    fontFamily: "'Architects Daughter', cursive",
    className: 'font-architectural-caps',
    tag: 'Chữ In Kiến Trúc',
    description: 'Dáng chữ kỹ thuật bản vẽ xây dựng, nét bút đanh thép, góc cạnh rõ ràng dễ đồ.',
    sampleText: 'ARCHITECTURAL BLUEPRINT LETTERING',
    isEnglishPrioritized: true,
  },
  {
    id: 'unifraktur_maguntia',
    order: 14,
    name: 'UnifrakturMaguntia',
    vietnameseTitle: 'UnifrakturMaguntia (Chữ Gothic Cổ)',
    englishName: 'UnifrakturMaguntia',
    shortName: 'Unifraktur',
    fontFamily: "'UnifrakturMaguntia', cursive",
    className: 'font-unifraktur',
    tag: 'Chữ Gothic Cổ',
    description: 'Phong cách thư pháp Blackletter Gothic cổ kính thời Trung cổ, nét vát độc đáo.',
    sampleText: 'Old English Blackletter Gothic Calligraphy',
    isEnglishPrioritized: true,
  },
  {
    id: 'montez',
    order: 15,
    name: 'Montez',
    vietnameseTitle: 'Montez (Chữ Nối Phóng Khoáng)',
    englishName: 'Montez',
    shortName: 'Montez',
    fontFamily: "'Montez', cursive",
    className: 'font-montez',
    tag: 'Chữ Nối Phóng Khoáng',
    description: 'Nét chữ nối tự do lấy cảm hứng từ các bảng hiệu thập niên 1930, góc nghiêng linh hoạt.',
    sampleText: 'Expressive vintage connected pen strokes',
    isEnglishPrioritized: true,
  },
];

// Alias for backwards compatibility
export const ENGLISH_PRIORITY_FONTS: FontOption[] = GOOGLE_15_ENGLISH_FONTS;

export const OTHER_LANGUAGE_FONTS: FontOption[] = [
  {
    id: 'vietnamese_itim',
    order: 16,
    name: 'Itim (Tiểu học VN)',
    vietnameseTitle: 'Itim (Chữ Tiểu Học Việt Nam)',
    englishName: 'Vietnamese Primary',
    shortName: 'Tiểu học',
    fontFamily: "'Itim', cursive",
    className: 'font-itim',
    tag: 'Chuẩn ô ly',
    description: 'Nét chữ tiểu học bo tròn thân thiện, chuẩn dấu tiếng Việt.',
    sampleText: 'Nét chữ nết người - Công cha như núi',
  },
  {
    id: 'japanese_klee',
    order: 17,
    name: 'Klee One (Nhật Bản)',
    vietnameseTitle: 'Klee One (Chữ Mẫu Nhật Bản)',
    englishName: 'Japanese Textbook',
    shortName: 'Klee One',
    fontFamily: "'Klee One', sans-serif",
    className: 'font-klee',
    tag: 'Giáo khoa',
    description: 'Kiểu chữ mẫu chuẩn sách giáo khoa Nhật Bản cho Hiragana & Kanji.',
    sampleText: 'あいうえお 日本語の練習',
  },
  {
    id: 'chinese_mashan',
    order: 18,
    name: 'Ma Shan Zheng (Hán tự)',
    vietnameseTitle: 'Ma Shan Zheng (Khải Thư Trung Hoa)',
    englishName: 'Chinese Kai',
    shortName: 'Khải Thư',
    fontFamily: "'Ma Shan Zheng', serif",
    className: 'font-mashan',
    tag: 'Thư pháp',
    description: 'Nét chữ khải thư mực tàu truyền thống cho Hán tự.',
    sampleText: '永字八法 汉字书法',
  },
];

export const ALL_FONTS: FontOption[] = [
  ...GOOGLE_15_ENGLISH_FONTS,
  ...OTHER_LANGUAGE_FONTS,
];

// Map legacy IDs to new 15 fonts
const LEGACY_FONT_MAPPING: Record<string, string> = {
  neat_print: 'architects_daughter',
  clean_casual: 'indie_flower',
  simple_cursive: 'alex_brush',
  architectural_caps: 'architects_daughter',
  soft_rounded: 'fredoka',
};

export function getFontOptionById(id?: string): FontOption {
  if (!id) return GOOGLE_15_ENGLISH_FONTS[0];
  
  // Check exact ID match
  const directMatch = ALL_FONTS.find((f) => f.id === id);
  if (directMatch) return directMatch;

  // Check legacy ID alias
  const mappedId = LEGACY_FONT_MAPPING[id];
  if (mappedId) {
    const aliasMatch = ALL_FONTS.find((f) => f.id === mappedId);
    if (aliasMatch) return aliasMatch;
  }

  // Fallback to Great Vibes or first font
  return GOOGLE_15_ENGLISH_FONTS[0];
}

export function getDefaultFontForLanguage(lang: string): string {
  if (lang === 'vi') return 'vietnamese_itim';
  if (lang === 'ja') return 'japanese_klee';
  if (lang === 'zh') return 'chinese_mashan';
  return 'great_vibes'; // Default 1st option in 15 fonts
}
