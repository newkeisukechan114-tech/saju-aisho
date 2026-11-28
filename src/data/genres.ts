// 記事の「趣味嗜好ジャンル」：関連記事のおすすめに使う（記事を足したらここにも追加）
export const GENRE_NAME: Record<string, string> = {
  hikaku: 'ほかの占いとくらべる', kankoku: '韓国カルチャー', koi: '恋愛', trend: '話題のことば', kisetsu: '季節のイベント',
  unsei: '運勢・開運', aisho: '相性', ningen: '人間関係', nisshu: '日主を知る', okane: 'お金', denwa: '電話占い',
};
const G: Record<string, string[]> = {
  hikaku: ['gosei-saju', 'rokusei-saju', 'saju-cafe-ryokou', 'nisshi-towa', 'nicchu-60', 'saju-ketsuekigata', 'saju-shichusuimei-chigai', 'saju-mbti', 'saju-doubutsu-chigai', 'saju-astromap', 'saju-tarot-chigai', 'saju-suhijutsu-chigai', 'saju-kyusei-chigai', 'saju-sanmeigaku-chigai', 'saju-seiza-chigai', 'kankoku-ai-uranai', 'saju-towa', 'gunghap-towa', 'hagaren-gogyo'],
  kankoku: ['saju-cafe-ryokou', 'kankoku-14nichi', 'shinnyeon-unse', 'pepero-day', 'suneung-gokaku', 'kankoku-ai-uranai', 'saju-mbti', 'gunghap-towa', 'saju-towa', 'touji-patjuk', 'hug-day', 'saju-shichusuimei-chigai'],
  koi: ['meroi-saju', '2026-12-goen', 'kankoku-14nichi', 'nisshi-towa', 'saju-ketsuekigata', 'kataomoi', 'gengoka-koi', 'sukisugite-metsu', 'pepero-day', 'xmas-deai', 'ritto-fuyu-koi', 'aisare-jikkan', 'xmas-cospa', 'fukuen', 'shitsuren-tachinaori', 'guilty-saju', '2027-koiun', 'hug-day'],
  trend: ['bondoro-saju', 'dopa-sero-saju', 'meroi-saju', 'gengoka-koi', 'frenemy-saju', 'sukisugite-metsu', 'guilty-saju', 'un-ga-ii-hito', 'xmas-cospa', 'aisare-jikkan', 'hagaren-gogyo', 'saju-mbti'],
  kisetsu: ['dopa-sero-saju', '2026-12-goen', 'kankoku-14nichi', 'shinnyeon-unse', 'pepero-day', 'xmas-deai', 'xmas-cospa', 'ritto-fuyu-koi', 'black-friday-saju', 'bonenkai-saju', 'shichigosan-oyako', 'fufu-arigato', 'suneung-gokaku', '2026-12-unsei', 'touji-patjuk', 'hug-day'],
  unsei: ['gosei-saju', 'rokusei-saju', '2026-12-goen', 'shinnyeon-unse', '2026-12-unsei', '2027-koiun', 'un-ga-ii-hito', 'black-friday-saju', 'saju-kyusei-chigai', 'touji-patjuk'],
  aisho: ['meroi-saju', 'nisshi-towa', 'saju-ketsuekigata', 'gunghap-towa', 'gogyo-aisho', 'aisho-warui', 'moku-aisho', 'fufu-arigato', 'frenemy-saju', 'kataomoi', 'hug-day'],
  ningen: ['frenemy-saju', 'bonenkai-saju', 'shichigosan-oyako', 'fufu-arigato', 'aisare-jikkan'],
  okane: ['black-friday-saju', '2026-12-unsei'],
  denwa: ['denwa-hajimete', 'denwa-kowai'],
};
const STEMS = ['koboku', 'otsuboku', 'heika', 'teika', 'bodo', 'kido', 'koukin', 'shinkin', 'jinsui', 'kisui'];
export function genresOf(slug: string): string[] {
  const g = Object.keys(G).filter((k) => G[k].includes(slug));
  if (STEMS.includes(slug)) g.push('nisshu');
  if (slug.startsWith('2027-unsei-')) g.push('unsei', 'nisshu');
  return g;
}
const EXTRA: Record<string, string[]> = { 'hagaren-gogyo': ['koukin'], 'moku-aisho': ['koboku', 'otsuboku'] };
const stemsOf = (slug: string) => [...STEMS.filter((s) => slug === s || slug === `2027-unsei-${s}`), ...(EXTRA[slug] || [])];
// 共通するジャンルが多い順 → 同じ日主 → 同じカテゴリ → 新しい順
export function relatedOf<T extends { slug: string; data: { category: string; publishedAt: Date } }>(entry: T, all: T[], n = 4): T[] {
  const mine = new Set(genresOf(entry.slug)); const st = stemsOf(entry.slug);
  const score = (a: T) => {
    let s = genresOf(a.slug).filter((g) => mine.has(g)).length * 3;
    if (st.some((x) => stemsOf(a.slug).includes(x))) s += 6;
    if (a.data.category === entry.data.category) s += 1;
    // 日主どうし・2027年どうしが並びすぎないように
    if (STEMS.includes(entry.slug) && STEMS.includes(a.slug)) s -= 2;
    if (entry.slug.startsWith('2027-unsei-') && a.slug.startsWith('2027-unsei-')) s -= 4;
    if (STEMS.includes(entry.slug) && a.slug.startsWith('2027-unsei-') && !st.some((x) => a.slug.endsWith(x))) s -= 4;
    if (a.slug === 'gogyo-aisho' && STEMS.includes(entry.slug)) s += 3;
    return s;
  };
  return all.filter((a) => a.slug !== entry.slug)
    .map((a) => ({ a, s: score(a) }))
    .sort((x, y) => y.s - x.s || y.a.data.publishedAt.valueOf() - x.a.data.publishedAt.valueOf())
    .slice(0, n).map((x) => x.a);
}
