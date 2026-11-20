// お悩みの種類別の入り口（/nayami/ とトップで使う）
export type Nayami = { id: string; mark: string; title: string; short: string; lead: string; tool?: { href: string; label: string }; slugs: string[] };
export const NAYAMI: Nayami[] = [
  { id: 'kataomoi', mark: '想', title: '片思い中で、相手の気持ちが知りたい', short: '片思い', lead: '好きな人との相性や、気持ちの伝え方のヒントを、生まれた日のタイプから探します。',
    tool: { href: '/shindan/', label: 'ふたりの相性を占う' }, slugs: ['kataomoi', 'gengoka-koi', 'sukisugite-metsu', 'pepero-day'] },
  { id: 'deai', mark: '縁', title: '出会いがほしい', short: '出会い', lead: '出会いが動きやすい時期や、自分らしいご縁のつかみ方を紹介します。',
    tool: { href: '/kojin/', label: '今月の運の流れを見る' }, slugs: ['xmas-deai', 'ritto-fuyu-koi', 'un-ga-ii-hito', 'bonenkai-saju'] },
  { id: 'aisho', mark: '合', title: '気になる人との相性を知りたい', short: '相性', lead: '韓国式の相性占い「クンハプ」と五行で、ふたりの関係の読み方をやさしく解説します。',
    tool: { href: '/shindan/', label: 'ふたりの相性を占う' }, slugs: ['gunghap-towa', 'gogyo-aisho', 'aisho-warui', 'moku-aisho'] },
  { id: 'kankei', mark: '絆', title: '恋人・夫婦とのモヤモヤ', short: '恋人・夫婦', lead: '「愛されている実感がない」「すれ違いが続く」。ふたりの関係を見つめ直すヒントです。',
    tool: { href: '/shindan/', label: 'ふたりの相性を占う' }, slugs: ['aisare-jikkan', 'fufu-arigato', 'guilty-saju', 'xmas-cospa'] },
  { id: 'shitsuren', mark: '涙', title: '失恋・復縁で悩んでいる', short: '失恋・復縁', lead: '気持ちの整え方と、やり直したいときに確かめたいこと。自分のペースで読んでください。',
    tool: { href: '/kojin/', label: '自分の日主を調べる' }, slugs: ['shitsuren-tachinaori', 'fukuen'] },
  { id: 'ningen', mark: '友', title: '友だち・職場・家族の人間関係', short: '人間関係', lead: 'モヤモヤする友だち、職場の飲み会、親子の関係。人づきあいのヒントを日主別にまとめました。',
    tool: { href: '/shindan/', label: '相手との相性を占う' }, slugs: ['frenemy-saju', 'bonenkai-saju', 'shichigosan-oyako'] },
  { id: 'unsei', mark: '運', title: 'お金・仕事・これからの運勢', short: '運勢・お金', lead: '今月・来年の運の流れや、お金の使い方のくせを、四柱推命で読み解きます。',
    tool: { href: '/kojin/', label: '今月の運の流れを見る' }, slugs: ['2026-12-unsei', '2027-koiun', '2027-unsei-koboku', 'black-friday-saju'] },
  { id: 'jibun', mark: '己', title: '自分のことをもっと知りたい', short: '自分を知る', lead: 'サジュのしくみや、ほかの占いとの違いから、自分の気質を多面的に知ることができます。「界隈」から気軽に探すこともできます。',
    tool: { href: '/kojin/', label: '無料で自分のサジュを占う' }, slugs: ['saju-towa', 'saju-mbti', 'saju-shichusuimei-chigai', 'saju-suhijutsu-chigai'] },
];
