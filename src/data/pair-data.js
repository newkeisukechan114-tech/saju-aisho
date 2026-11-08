// 日主×日主の相性ページ（/aisho/<a>-<b>/）を作るためのデータと文章のルール。
// 五行の関係（相生・相剋・比和・干合）と、日主ごとの特徴を組み合わせて文章をつくる。
import { STEMS, STEM_SLUG, STEM_FULL, STEM_INFO, EL, stemEl } from './saju-data.js';

export const P = [
  { offer: 'まっすぐさと頼りがい', weak: '正しさを押しつけてしまう', tip: '意見を言う前に「どう思う？」と聞く', contact: '用件はまっすぐ、返事は早め' },
  { offer: 'しなやかなやさしさと気配り', weak: '本音をのみこんでしまう', tip: '小さな希望から言葉にする', contact: '相手のペースに合わせる' },
  { offer: '明るさと行動力', weak: '勢いで話を進めてしまう', tip: '相手が話し終わるまで待ってから答える', contact: '思いついたらすぐ送る' },
  { offer: 'こまやかな気づかいと温かさ', weak: '相手の言葉を深読みしてしまう', tip: '気になったら、想像する前に聞いてみる', contact: '文面に気持ちをこめる' },
  { offer: 'どっしりした安心感', weak: '気持ちを言葉にしない', tip: '「ありがとう」「好き」を言葉にする', contact: '必要なときだけ、短く' },
  { offer: '暮らしを支える面倒見のよさ', weak: '尽くしすぎて疲れてしまう', tip: 'してもらうことも素直に受け取る', contact: '気づかいのひとことを添える' },
  { offer: '決断力と守る強さ', weak: '言葉がストレートすぎる', tip: '「わたしはこう感じた」と自分を主語にして伝える', contact: '要点だけ、はっきり' },
  { offer: 'センスと品のよさ', weak: '小さなひとことを引きずる', tip: '相手のいいところを毎日ひとつ言葉にする', contact: '言葉選びにこだわる' },
  { offer: 'おおらかさと知的な刺激', weak: '連絡がまばらになる', tip: '予定や気持ちの変化を早めに共有する', contact: '気まぐれで、まとめて返す' },
  { offer: '気持ちをくみとる感受性', weak: '察してほしくて待ってしまう', tip: '伝えたいことを短く言葉にする', contact: '相手の反応を気にしながら' },
];
export const DATE = ['公園や植物園の散歩', 'ライブやイベント', '家でゆっくり料理', '美術館や雑貨屋さんめぐり', '水族館や海辺へのおでかけ'];
// 五行の関係のたとえ
const GEN_M = ['薪が炎を大きく育てる', '炎のあとの灰が大地をゆたかにする', '大地の中で鉱石が育まれる', '冷えた金属に水滴が宿る', '水が木の根をうるおす'];
const KOKU2 = { '0-2': '木の根が土をしっかりつかむ', '2-4': '土手が水の流れを導く', '4-1': '水が火の勢いを静める', '1-3': '炎が金属をきたえる', '3-0': '刃が木の枝を整える' };
const HI_M = ['森の木々がならび立つ', 'ふたつの火が寄りそって明るさを増す', '山と大地が連なる', '金属どうしが澄んだ音で響き合う', '川が合わさって大きな流れになる'];
export function metaphor(r, a, b) {
  if (r.type === 'same' || r.type === 'hi') return HI_M[stemEl(a)];
  if (r.type === 'gen') return GEN_M[stemEl(r.giver)];
  return KOKU2[`${stemEl(r.ctrl)}-${stemEl(r.target)}`];
}
export const KW2027 = ['自分らしさを表現する', '楽しさとゆとり', '仲間とのつながり', '自分のペースを大切に', '支え、支えられる', '直感とひとりの時間', '誠実さと、けじめ', '強く惹かれる縁', '縁が結ばれやすい', '出会いの広がり'];

export const pairSlug = (a, b) => (a <= b ? `${STEM_SLUG[a]}-${STEM_SLUG[b]}` : `${STEM_SLUG[b]}-${STEM_SLUG[a]}`);
export const nm = (s) => `${STEM_FULL[s]}（${STEM_INFO[s][0]}）`;

// a から見た b との関係
export function relation(a, b) {
  const ea = stemEl(a), eb = stemEl(b);
  const gou = Math.abs(a - b) === 5;
  if (a === b) return { type: 'same', gou };
  if (ea === eb) return { type: 'hi', gou };
  if ((ea + 1) % 5 === eb) return { type: 'gen', giver: a, taker: b, gou };
  if ((eb + 1) % 5 === ea) return { type: 'gen', giver: b, taker: a, gou };
  if ((ea + 2) % 5 === eb) return { type: 'koku', ctrl: a, target: b, gou };
  return { type: 'koku', ctrl: b, target: a, gou };
}

export function label(r) {
  if (r.gou) return '引き合う関係（干合）';
  return { same: '同じ日主どうし', hi: '似た者どうし（比和）', gen: '育て合う関係（相生）', koku: '刺激し合う関係（相剋）' }[r.type];
}

export function pairContent(a, b) {
  const r = relation(a, b), A = STEM_FULL[a], B = STEM_FULL[b];
  const e = (s) => EL[stemEl(s)];
  let rel, gap, coreTip;
  if (r.type === 'same') {
    rel = `${A}どうしは、同じ日主の組み合わせです。考え方や感じ方がよく似ていて、言わなくてもわかり合える心地よさがあります。その一方で、苦手なところも同じなので、ふたりそろって同じところでつまずきやすい面もあります。`;
    gap = `似ているからこそ、ぶつかったときにどちらもゆずれなくなりがちです。とくに${A}は${P[a].weak}ところがあるので、ふたりとも同じ行動をとると、すれ違いが大きくなりやすくなります。`;
    coreTip = 'ぶつかったときに、どちらが先にゆずるか、ふたりのルールを決めておく';
  } else if (r.type === 'hi') {
    rel = `${A}と${B}は、同じ「${e(a)}」の五行を持つ、陰と陽の組み合わせです。価値観が近く話が早い一方で、気持ちの表し方が違うので、お互いに新鮮さも感じられます。`;
    gap = `似ているぶん、ゆずれないところも重なりやすい組み合わせです。${A}は${P[a].weak}ところ、${B}は${P[b].weak}ところがあるので、話し合いが平行線になったときは、いったん時間をおくのがおすすめです。`;
    coreTip = 'ぶつかったときに、どちらが先にゆずるか、ふたりのルールを決めておく';
  } else if (r.type === 'gen') {
    const G = STEM_FULL[r.giver], T = STEM_FULL[r.taker];
    rel = `${G}の「${e(r.giver)}」が、${T}の「${e(r.taker)}」を育てる関係（${e(r.giver)}生${e(r.taker)}）です。${G}は自然と${T}を支え、${T}は${G}のそばで力を発揮しやすくなります。安心感があり、長く続きやすい組み合わせです。`;
    gap = `${G}が与える側、${T}が受け取る側に固定されると、${G}が疲れたり、${T}が甘えすぎたりしやすくなります。さらに、${A}は${P[a].weak}ところ、${B}は${P[b].weak}ところがあるので、気持ちの行き違いには早めに気づきたいところです。`;
    coreTip = `ときどき役割を入れ替えて、${T}から${G}へ「ありがとう」やお返しを伝える`;
  } else {
    const C = STEM_FULL[r.ctrl], T = STEM_FULL[r.target];
    rel = `${C}の「${e(r.ctrl)}」が、${T}の「${e(r.target)}」をおさえる関係（${e(r.ctrl)}剋${e(r.target)}）です。お互いにない部分を持っているため、強く惹かれ合ったり、刺激を受けたりしやすい組み合わせです。`;
    gap = `${C}の言葉や行動が、${T}には思った以上に強く響きやすい組み合わせです。${A}は${P[a].weak}ところ、${B}は${P[b].weak}ところがあるので、小さな違和感をためこまないことが大切です。`;
    coreTip = `${C}は伝え方をやわらかく、${T}は自分の気持ちを言葉にすることを意識する`;
  }
  if (r.gou) {
    rel += `さらに、${A}と${B}は陰陽が結びつく「干合（かんごう）」の関係。五行ではおさえる関係ですが、陰と陽が補い合うことで、自然と引き合う特別な組み合わせとされています。`;
    coreTip = '引き合う力が強いぶん、勢いで決めずに、ふたりのペースを少しずつすり合わせる';
  }
  const attract = a === b
    ? `${A}の人は、相手の${P[a].offer}に、自分と同じ大切なものを感じて惹かれ合います。`
    : `${A}の人は${B}の${P[b].offer}に、${B}の人は${A}の${P[a].offer}に惹かれやすい組み合わせです。`;
  const tips = a === b ? [coreTip, `ふたりとも、${P[a].tip}`] : [coreTip, `${A}の人は、${P[a].tip}`, `${B}の人は、${P[b].tip}`];
  const dates = stemEl(a) === stemEl(b) ? [DATE[stemEl(a)]] : [DATE[stemEl(a)], DATE[stemEl(b)]];
  return { r, rel, gap, attract, tips, dates, meta: metaphor(r, a, b) };
}

export const ALL_PAIRS = [];
for (let a = 0; a < 10; a++) for (let b = a; b < 10; b++) ALL_PAIRS.push([a, b]);
export { STEMS, STEM_SLUG, STEM_FULL, STEM_INFO, EL, stemEl };
