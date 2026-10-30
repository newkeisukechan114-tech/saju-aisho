// サイト全体の設定。ここだけ直せば全ページに反映されます。
export const CATEGORIES = ['サジュの基本', '日主', '相性', '恋愛の悩み', '電話占い', '年運'] as const;

export const SITE = {
  name: 'ソウルのサジュ恋愛相性占い',
  nameSmall: 'ソウルのサジュ',
  nameMain: '恋愛相性占い',
  // 検索結果に出るトップページのタイトルと説明文
  topTitle: 'ソウルのサジュ恋愛相性占い｜韓国の四柱推命で相性診断',
  description:
    'ふたりの生年月日から、韓国の四柱推命「サジュ」で恋愛の相性を無料診断。日主・日支・干支・五行の4つの観点で相性を読み解き、ふたりが気をつけたいポイントもわかります。',
  // ドメイン取得後に astro.config.mjs の site と合わせて変更
  url: 'https://saju-aisho.com',
  // 運営者のニックネーム（本名でなくて大丈夫です）
  author: 'ソウルのサジュ恋愛相性占い 運営者',
  // お問い合わせ用のGoogleフォームのURL（未設定のあいだは「準備中」と表示）
  contactFormUrl: '',
  sns: {
    x: '', // 例: https://x.com/seoul_saju
    instagram: '', // 例: https://www.instagram.com/seoul_saju/
  },
  // A8.net で提携が承認されたら、ココナラ電話占いの広告リンクを入れる
  affiliate: {
    coconalaUrl: '',
  },
  categories: CATEGORIES,
};
