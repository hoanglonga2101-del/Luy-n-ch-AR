import { PracticeSentence, LanguageCode } from '../types';

export const SAMPLE_SENTENCES: Record<LanguageCode, PracticeSentence[]> = {
  vi: [
    {
      id: 'vi_s1',
      text: 'Nét chữ nết người\nRèn đức luyện tài',
      language: 'vi',
      reading: 'Thành ngữ học đường',
      translation: 'Chữ viết thể hiện tính cách cẩn trọng, kiên nhẫn và lòng kiên trì.',
      tips: 'Độ nghiêng chuẩn 15-25 độ, khoảng cách giữa các chữ bằng thân một con chữ o.',
      gridType: 'oly_vi',
      authorOrSource: 'Châm ngôn giáo dục Việt Nam'
    },
    {
      id: 'vi_s2',
      text: 'Công cha như núi Thái Sơn\nNghĩa mẹ như nước trong nguồn chảy ra',
      language: 'vi',
      reading: 'Ca dao cổ truyền',
      translation: 'Lòng biết ơn sâu sắc công lao trời biển của cha mẹ.',
      tips: 'Các nét khuyết trên của chữ C, l, b cao đúng 2.5 ô ly, các nét nối liền mạch.',
      gridType: 'oly_vi',
      authorOrSource: 'Ca dao dân ca'
    },
    {
      id: 'vi_s3',
      text: 'Trâu ơi ta bảo trâu này\nTrâu ra ngoài ruộng trâu cày với ta\nCấy cày vốn nghiệp nông gia\nTa đây trâu đấy ai mà quản công',
      language: 'vi',
      reading: 'Thơ lục bát 4 câu',
      translation: 'Bài ca dao bất hủ gắn liền với đồng quê và nông nghiệp Việt Nam.',
      tips: 'Căn đều khoảng cách dòng theo ô ly, nét chữ mềm mại thanh thoát.',
      gridType: 'oly_vi',
      authorOrSource: 'Ca dao Việt Nam'
    },
    {
      id: 'vi_s4',
      text: 'Có công mài sắt\nCó ngày nên kim',
      language: 'vi',
      reading: 'Tục ngữ Việt Nam',
      translation: 'Sự kiên trì, bền bỉ sẽ vượt qua mọi gian khó để gặt hái thành công.',
      tips: 'Giữ đều nét thanh nét đậm khi chuyển từ ấn bút sang thả lỏng ngòi.',
      gridType: 'oly_vi',
      authorOrSource: 'Tục ngữ'
    }
  ],
  en: [
    {
      id: 'en_s1',
      text: 'The quick brown fox\njumps over the lazy dog',
      language: 'en',
      reading: 'Pangram (26 English letters)',
      translation: 'Chú cáo nâu nhanh nhẹn nhảy qua con chó lười biếng (chứa trọn bảng chữ cái).',
      tips: 'Maintain consistent 75-degree slant. Ensure looped letters do not close up.',
      gridType: 'four_line_en',
      authorOrSource: 'Classic Typography Pangram'
    },
    {
      id: 'en_s2',
      text: 'Practice makes perfect\nEvery single day\nNever stop learning',
      language: 'en',
      reading: 'Daily Inspiration (3 lines)',
      translation: 'Luyện tập mỗi ngày tạo nên sự hoàn hảo, không ngừng trau dồi.',
      tips: 'Keep lowercase letters strictly within midline and baseline.',
      gridType: 'four_line_en',
      authorOrSource: 'Wisdom Proverb'
    },
    {
      id: 'en_s3',
      text: 'Stay curious, keep learning\nAnd shine bright wherever you go',
      language: 'en',
      reading: 'Growth Mindset Couplet',
      translation: 'Luôn hiếu kỳ, không ngừng học hỏi và tỏa sáng rực rỡ.',
      tips: 'Watch descenders on y, p, g dropping evenly below the baseline.',
      gridType: 'four_line_en',
      authorOrSource: 'Inspiring Motto'
    }
  ],
  ja: [
    {
      id: 'ja_s1',
      text: '古池や\n蛙飛び込む\n水の音',
      language: 'ja',
      reading: 'ふるいけや / かわずとびこむ / みずのおと (Haiku Matsuo Bashō)',
      translation: 'Ao cũ tĩnh lặng / Chú ếch nhảy vào / Vang tiếng nước xao.',
      tips: 'Thơ Haiku 3 câu (5-7-5), căn chỉnh khoảng cách giữa các dòng đều đặn.',
      gridType: 'mizi_zh',
      authorOrSource: 'Matsuo Bashō (Thuỷ tổ thơ Haiku)'
    },
    {
      id: 'ja_s2',
      text: '七転び\n八起き',
      language: 'ja',
      reading: 'ななころび / やおき (Nanakorobi Yaoki)',
      translation: 'Ngã bảy lần, đứng dậy tám lần (Ý chí kiên định bất khuất).',
      tips: 'Kanji 七 và 八 viết dứt khoát; Hiragana び và き uốn nét mềm mại, rộng mở.',
      gridType: 'mizi_zh',
      authorOrSource: 'Tục ngữ Nhật Bản'
    },
    {
      id: 'ja_s3',
      text: '桜の花が\n美しく咲いています',
      language: 'ja',
      reading: 'さくらのはなが / うつくしくさいています',
      translation: 'Những cánh hoa anh đào đang nở rộ tuyệt đẹp.',
      tips: 'Tỷ lệ chữ: Kanji chiếm 80% thể tích ô Mễ tự cách, Hiragana chiếm 70% để nhịp điệu hài hòa.',
      gridType: 'mizi_zh',
      authorOrSource: 'Câu cảm hứng thiên nhiên'
    }
  ],
  zh: [
    {
      id: 'zh_s1',
      text: '白日依山尽\n黄河入海流\n欲穷千里目\n更上一层楼',
      language: 'zh',
      reading: 'Bái rì yī shān jìn / Huáng hé rù hǎi liú / Yù qióng qiān lǐ mù / Gèng shàng yī céng lóu',
      translation: 'Mặt trời lặn sau núi / Sông Hoàng Hà ra biển / Muốn nhìn xa nghìn dặm / Hãy lên một tầng lầu.',
      tips: 'Thơ Đường 4 câu (Đăng Quán Tước Lâu - Vương Chi Hoán), căn chuẩn trục dọc và trục ngang.',
      gridType: 'mizi_zh',
      authorOrSource: 'Vương Chi Hoán - Đăng Quán Tước Lâu'
    },
    {
      id: 'zh_s2',
      text: '千里之行\n始于足下',
      language: 'zh',
      reading: 'Qiān lǐ zhī xíng / Shǐ yú zú xià',
      translation: 'Hành trình ngàn dặm bắt đầu từ một bước chân.',
      tips: 'Quy tắc trên trước dưới sau, nét mác của chữ 之 vươn dài tạo chân đế nâng đỡ.',
      gridType: 'mizi_zh',
      authorOrSource: 'Lão Tử - Đạo Đức Kinh'
    },
    {
      id: 'zh_s3',
      text: '静以修身\n俭以养德',
      language: 'zh',
      reading: 'Jìng yǐ xiū shēn / Jiǎn yǐ yǎng dé',
      translation: 'Lấy tĩnh tâm để tu thân, lấy cần kiệm để dưỡng đức.',
      tips: 'Trọng tâm chữ nằm chính giữa ô Mễ tự cách, các nét phẩy và mác đăng đối.',
      gridType: 'mizi_zh',
      authorOrSource: 'Gia Cát Lượng - Giới Tử Thư'
    }
  ]
};
