// トップ：日主別「今日のひとこと」（その日の天干の十神＋地支のちょっとした行動）
// 日主だけを、本人が選んだときに限りこの端末に覚える。生年月日は保存しない。
import { saju, tengod } from './saju-calc.js';
import { STEMS, BRANCHES, STEM_FULL, STEM_INFO, STEM_SLUG } from '../data/saju-data.js';
const MSG = {
  比肩: '自分のペースを守るほど、うまくいく日です。人に合わせすぎず、やりたいことをひとつ進めましょう。',
  劫財: '仲間の力を借りるとはかどる日です。ひとりで抱えず、気軽に声をかけてみてください。出費は少し控えめに。',
  食神: '楽しむことが運を呼ぶ日です。おいしいものを食べたり、好きなことに時間を使ったりしてください。',
  傷官: '言葉の力が強まる日です。気持ちを伝えるのに向いていますが、言い方はいつもより少しやわらかく。',
  偏財: '人との出会いや交流が広がる日です。誘われたら気軽にのってみると、思わぬご縁につながるかもしれません。',
  正財: 'コツコツが報われる日です。家計の見直しや、たまっていた用事を片づけるのに向いています。',
  偏官: '少し背伸びが必要な場面がありそうな日です。無理はせず、ひとつずつ落ち着いて向き合いましょう。',
  正官: 'きちんとした対応が信頼につながる日です。約束や時間を守ることを意識すると、評価が上がります。',
  偏印: 'ひらめきが冴える日です。気になったことを調べたり、思いついたことをメモしたりしてみてください。',
  正印: '学びと休息の日です。本を読んだり早めに寝たりして、心と体をいたわりましょう。',
};
const ACT = ['夜はお風呂でゆっくり温まる', '部屋の片づけを10分だけする', '朝に少しだけ外を歩く', '花やグリーンを部屋に飾る', '新しい予定を手帳に書きこむ', '気になっていた本を開く', '明るい色の服や小物を身につける', '甘いものでひと休みする', '友人にひと言メッセージを送る', '身だしなみをいつもより丁寧に', '家族や大切な人との時間をつくる', 'いつもより早めに布団に入る'];
const KEY = 'saju-nisshu';
const $ = id => document.getElementById(id);
function show(me) {
  const now = new Date(), T = saju(now.getFullYear(), now.getMonth() + 1, now.getDate(), null).day;
  const gou = T.s === (me + 5) % 10, g = tengod(me, T.s);
  $('today-out').innerHTML = `
    <span class="td-date">${now.getMonth() + 1}月${now.getDate()}日は「${STEMS[T.s]}${BRANCHES[T.b]}」の日</span>
    <b class="td-who">${STEM_FULL[me]}（${STEM_INFO[me][0]}タイプ）のあなたへ</b>
    ${gou ? '<p class="td-gou">★ 今日は「ご縁の日」。連絡や告白、大事な約束に向いています。</p>' : ''}
    <p class="td-msg"><span class="td-star">今日の星：${g}</span>${MSG[g]}</p>
    <p class="td-act">おすすめの小さな行動：<b>${ACT[T.b]}</b></p>
    <a class="td-more" href="/articles/${STEM_SLUG[me]}/">${STEM_FULL[me]}の性格・恋愛を読む →</a>`;
  document.querySelectorAll('.td-pick button').forEach(b => b.classList.toggle('on', +b.dataset.s === me));
}
function remember(me) { try { if ($('today-keep').checked) localStorage.setItem(KEY, String(me)); else localStorage.removeItem(KEY); } catch (e) {} }
export function initToday() {
  if (!$('today')) return;
  let cur = null;
  try { const v = localStorage.getItem(KEY); if (v !== null && /^\d$/.test(v)) { cur = +v; $('today-keep').checked = true; } } catch (e) {}
  document.querySelectorAll('.td-pick button').forEach(b => b.addEventListener('click', () => { cur = +b.dataset.s; show(cur); remember(cur); }));
  $('today-keep').addEventListener('change', () => { if (cur !== null) remember(cur); else if (!$('today-keep').checked) remember(-1); });
  if (cur !== null) show(cur);
  return s => { cur = s; show(s); remember(s); };
}
