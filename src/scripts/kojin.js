// 個人のサジュ鑑定（生年月日はこの画面の中だけで計算し、保存も送信もしない）
import { saju, tengod, CORNERS, pillarHTML, barsHTML } from './saju-calc.js';
import { initBirthInputs } from './birth-input.js';
import { STEMS, STEM_KO, EL, stemEl, STEM_INFO, STEM_SLUG, STEM_FULL } from '../data/saju-data.js';
import { pairSlug } from '../data/pair-data.js';

const $ = id => document.getElementById(id);
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const AFF = $('result')?.dataset.aff || '', PX = $('result')?.dataset.px || '';
const ELC = ['#5E9C80', '#C9665B', '#D3A64A', '#DCD8CC', '#6178AE'];

const EL_TRAIT = ['向上心とやさしさ', '情熱と表現力', '安定感と包容力', '決断力と誠実さ', '知性と柔軟さ'];
const EL_LUCK = [
  ['グリーン', '植物を育てる、朝に散歩する'],
  ['レッド・オレンジ', '人に会う、日の光を浴びる'],
  ['ベージュ・イエロー', '料理をする、部屋をととのえる'],
  ['ホワイト・ゴールド', '片づける、お気に入りのアクセサリーを身につける'],
  ['ネイビー・ブラック', 'ゆっくりお風呂に入る、水辺を歩く、本を読む'],
];
const TG = {
  比肩: ['ひけん', '自分の軸を持つ星', '対等で、お互いを尊重できる関係を好みます。'],
  劫財: ['ごうざい', '仲間を大切にする星', '友だちから恋に発展しやすく、にぎやかな関係を好みます。'],
  食神: ['しょくじん', '楽しむ才能の星', '一緒にいて心地よい空気をつくれる人。自然体の魅力があります。'],
  傷官: ['しょうかん', '表現と感性の星', '言葉やセンスに魅力がある人。こだわりが強い面もあります。'],
  偏財: ['へんざい', '縁を広げる星', '社交的で出会いが多い人。気配り上手で人気を集めます。'],
  正財: ['せいざい', '誠実さと堅実さの星', 'こつこつと信頼を積み上げ、長く続く恋を育てます。'],
  偏官: ['へんかん', '行動力と刺激の星', '刺激的な恋に惹かれやすく、好きになると一気に動きます。'],
  正官: ['せいかん', '責任感と品格の星', '誠実な関係を大切にし、将来を意識した恋を選びます。'],
  偏印: ['へんいん', '直感と個性の星', '独自の世界を持つ人。ひとりの時間も大切にします。'],
  正印: ['せいいん', '学びと受けとる力の星', '支えられ、守られる恋に安心する人。素直さが魅力です。'],
};
const TG_MONTH = {
  比肩: '自分のペースを大切に。無理に人に合わせなくて大丈夫です。',
  劫財: '友人とのつながりから、縁が広がりやすい時期です。',
  食神: '楽しいことを優先すると、あなたの魅力が自然と伝わります。',
  傷官: '思っていることを言葉にすると届く時期。言い方だけはやわらかく。',
  偏財: '出会いが増える時期。誘われたら、まずは乗ってみて。',
  正財: '地道な積み重ねが実を結ぶ時期。小さな約束を大切に。',
  偏官: '刺激的な出会いの予感。勢いだけで決めず、ひと呼吸おいて。',
  正官: '誠実さが評価される時期。けじめのある行動が信頼につながります。',
  偏印: 'ひとりの時間で直感が冴える時期。気になることを学んでみて。',
  正印: 'まわりの支えを素直に受けとると、運が開ける時期です。',
};
const KW2027 = ['自分らしさを表現する', '楽しさとゆとり', '仲間とのつながり', '自分のペースを大切に', '支え、支えられる', '直感とひとりの時間', '誠実さと、けじめ', '強く惹かれる縁', '縁が結ばれやすい', '出会いの広がり'];
const slink = s => `<a href="/articles/${STEM_SLUG[s]}/">${STEM_FULL[s]}（${STEM_INFO[s][0]}）</a>`;

let last = null, lastText = '';
function render() {
  const [y, m, d] = $('k-date').value.split('-').map(Number);
  const hr = $('k-hour').value === '' ? null : Number($('k-hour').value);
  const P = saju(y, m, d, hr), s = P.day.s, e = stemEl(s);
  const max = Math.max(...P.count), min = Math.min(...P.count);
  const strong = P.count.map((n, i) => n === max ? i : -1).filter(i => i >= 0);
  const weak = P.count.map((n, i) => n === min ? i : -1).filter(i => i >= 0);
  // 年・月・時の天干の十神（月の星をいちばん大きく扱う）
  const stars = [['月', P.month], ['年', P.year], ['時', P.hour]].filter(([, c]) => c).map(([l, c]) => [l, tengod(s, c.s)]);
  const main = stars[0][1];
  const gou = (s + 5) % 10;
  const sup = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter(x => (stemEl(x) + 1) % 5 === e);
  const now = new Date(), T = saju(now.getFullYear(), now.getMonth() + 1, now.getDate(), null);
  const mtg = tengod(s, T.month.s), ytg = tengod(s, 3);
  last = { P, s, strong, weak, main };
  lastText = `【無料サジュ占い】わたしの日主は「${STEMS[s]}（${STEM_INFO[s][0]}）」でした。いちばん強い五行は「${strong.map(i => EL[i]).join('・')}」\n\n生年月日を入れるだけで、自分のサジュを無料で占えます👇\nhttps://saju-aisho.com/kojin/\n\n#サジュ #韓国占い #ソウルのサジュ恋愛相性占い`;
  $('result').innerHTML = `
    <div class="score-card frame">${CORNERS}
      <span class="tag">あなたの日主（イルガン）</span>
      <div class="score gold-text">${STEMS[s]}<small>${STEM_KO[s]}</small></div>
      <h2>${STEM_FULL[s]}｜${STEM_INFO[s][0]}タイプ</h2><p>${STEM_INFO[s][1]}</p>
    </div>
    <div class="charts one"><div class="panel frame">${CORNERS}<h3>あなたの四柱</h3>${pillarHTML(P)}<div class="dm">五行は「${EL[e]}」・陰陽は「${s % 2 ? '陰' : '陽'}」</div>${barsHTML(P.count)}<a class="dm-link" href="/articles/${STEM_SLUG[s]}/">${STEM_FULL[s]}の性格と恋愛傾向をくわしく読む →</a></div></div>
    <div class="reading frame">${CORNERS}
      <div class="sec-head"><span class="en">Reading</span><h3>あなたのサジュを読み解く</h3></div>
      <section><h4>五行のバランス</h4><div class="rd">
        <p class="lead">いちばん多いのは「${strong.map(i => EL[i]).join('・')}」。${strong.map(i => EL_TRAIT[i]).join('、')}が、あなたの持ち味です。</p>
        <p>${min === 0 ? `「${weak.map(i => EL[i]).join('・')}」の五行が、あなたのサジュにはありません。` : `少なめなのは「${weak.map(i => EL[i]).join('・')}」です。`}足りない五行は、色や行動で補うとバランスがととのうとされています。</p>
        <dl>${weak.map(i => `<dt>「${EL[i]}」を補うなら</dt><dd>色は${EL_LUCK[i][0]}。${EL_LUCK[i][1]}のがおすすめです。</dd>`).join('')}</dl>
      </div></section>
      <section><h4>あなたのサジュにある星</h4><div class="rd">
        <span class="pill good">${main}（${TG[main][0]}）</span>
        <p class="lead">生まれた月の星は「${main}」。${TG[main][1]}です。</p>
        <p>${TG[main][2]}</p>
        ${stars.length > 1 ? `<p class="mean">ほかにある星：${stars.slice(1).map(([l, t]) => `${l}柱に「${t}」`).join('、')}${P.hour ? '' : '（生まれた時間を入れると、時柱の星もわかります）'}</p>` : ''}
      </div></section>
      <section><h4>相性のいい日主</h4><div class="rd">
        <p class="lead">${slink(gou)}とは「干合（かんごう）」の関係で、自然と引き合う組み合わせです（<a href="/aisho/${pairSlug(s, gou)}/">ふたりの相性をくわしく</a>）。</p>
        <p>あなたを支えてくれるのは、${sup.map(slink).join('と')}。一緒にいると安心できる相手です。ほかの日主との相性は<a href="/aisho/">日主どうしの相性一覧</a>で見られます。</p>
        <p class="mean">相性は日主だけでは決まりません。気になる人がいるなら、<a href="/shindan/">ふたりの相性診断</a>で4つの観点から見てみてください。</p>
      </div></section>
      <section><h4>今月と2027年のキーワード</h4><div class="rd">
        <p class="lead">今月（${now.getMonth() + 1}月）は「${mtg}」の星がめぐる時期。${TG_MONTH[mtg]}</p>
        <p>2027年（丁未年）は、あなたにとって「${ytg}」の年。恋愛のキーワードは「<b>${KW2027[s]}</b>」です。<a href="/articles/2027-koiun/">2027年の恋愛運</a>もあわせてどうぞ。</p>
      </div></section>
    </div>
    <div class="next-box frame">${CORNERS}
      <h3>気になる人との相性も占ってみませんか</h3>
      <p>あなたの生年月日と、お相手の生年月日を入れるだけ。ふたりの相性を点数と4つの観点で読み解きます。</p>
      <a class="btn" href="/shindan/">相性診断へ進む</a>
    </div>
    <div class="cta frame">${CORNERS}
      <span class="pr">PR</span>
      <h3>この先の流れは、<br>占い師に直接聞けます</h3>
      <p>この占いでわかるのは、生まれ持った気質です。いま悩んでいることや、これからどう動けばいいかは、状況を聞いたうえで占い師が具体的に答えてくれます。</p>
      ${AFF ? `<a class="btn-cta" href="${AFF}" rel="sponsored nofollow noopener" target="_blank">ココナラ電話占いで相談する</a>${PX ? `<img class="a8px" src="${PX}" width="1" height="1" alt="">` : ''}` : '<span class="btn-cta is-disabled">ご案内の準備中です</span>'}
      <span class="note">ココナラ電話占いは、初回は最大30分無料で試せます（条件は公式サイトでご確認ください）。</span>
    </div>
    <div class="copy-row"><button class="btn-ghost" type="button" id="save-img">結果を画像で保存</button><button class="btn-ghost" type="button" id="copy">結果をコピーしてシェア</button><button class="btn-ghost" type="button" id="again">もう一度占う</button><span class="note" id="copied" aria-live="polite"></span></div>`;
  $('copy').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(lastText); $('copied').textContent = 'コピーしました。SNSに貼り付けてシェアできます。'; }
    catch (err) { $('copied').textContent = 'この画面ではコピーできませんでした。'; }
  });
  $('save-img').addEventListener('click', saveImage);
  $('again').addEventListener('click', () => $('form').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }));
}

/* ---------- 結果を画像で保存（生年月日は入れない） ---------- */
async function makeCard() {
  const { P, s, strong } = last;
  const W = 1080, H = 1350, cv = document.createElement('canvas'); cv.width = W; cv.height = H;
  const x = cv.getContext('2d');
  const SERIF = '"Shippori Mincho", "Hiragino Mincho ProN", serif', SANS = '"Zen Kaku Gothic New", "Hiragino Sans", sans-serif';
  try { await Promise.all(['700 64px "Shippori Mincho"', '500 32px "Zen Kaku Gothic New"'].map(f => document.fonts.load(f, '日主')));} catch (e) {}
  const g = x.createLinearGradient(0, 0, W, H); g.addColorStop(0, '#1b1622'); g.addColorStop(1, '#0c0b10'); x.fillStyle = g; x.fillRect(0, 0, W, H);
  const c = ELC[stemEl(s)];
  const rg = x.createRadialGradient(W / 2, 470, 0, W / 2, 470, 380); rg.addColorStop(0, c + '55'); rg.addColorStop(1, c + '00'); x.fillStyle = rg; x.fillRect(0, 0, W, H);
  x.strokeStyle = 'rgba(201,165,92,.55)'; x.lineWidth = 2; x.strokeRect(40, 40, W - 80, H - 80);
  x.strokeStyle = 'rgba(201,165,92,.25)'; x.strokeRect(56, 56, W - 112, H - 112);
  x.textAlign = 'center';
  x.fillStyle = '#C9A55C'; x.font = `500 30px ${SANS}`; x.fillText('韓国の四柱推命「サジュ」', W / 2, 150);
  x.fillStyle = '#EEE7D7'; x.font = `500 36px ${SERIF}`; x.fillText('わたしの日主（イルガン）は', W / 2, 250);
  x.fillStyle = c; x.font = `700 280px ${SERIF}`; x.fillText(STEMS[s], W / 2, 560);
  x.fillStyle = '#EEE7D7'; x.font = `700 60px ${SERIF}`; x.fillText(`${STEM_FULL[s]}｜${STEM_INFO[s][0]}タイプ`, W / 2, 680);
  // 五行バー
  const mx = Math.max(...P.count, 1);
  P.count.forEach((n, i) => {
    const yy = 780 + i * 62;
    x.textAlign = 'left'; x.fillStyle = '#EEE7D7'; x.font = `500 32px ${SERIF}`; x.fillText(EL[i], 260, yy + 12);
    x.fillStyle = 'rgba(238,231,215,.12)'; x.fillRect(320, yy - 10, 460, 24);
    x.fillStyle = ELC[i]; x.fillRect(320, yy - 10, 460 * n / mx, 24);
    x.fillStyle = '#EEE7D7'; x.font = `500 28px ${SANS}`; x.fillText(String(n), 800, yy + 10);
  });
  x.textAlign = 'center';
  x.fillStyle = '#D4B26C'; x.font = `500 32px ${SERIF}`; x.fillText(`いちばん強い五行は「${strong.map(i => EL[i]).join('・')}」`, W / 2, 1140);
  x.fillStyle = 'rgba(238,231,215,.85)'; x.font = `500 28px ${SANS}`; x.fillText('生年月日を入れるだけで、無料でサジュ占い', W / 2, 1222);
  x.fillStyle = '#C9A55C'; x.font = `500 30px ${SERIF}`; x.fillText('ソウルのサジュ恋愛相性占い　saju-aisho.com', W / 2, 1275);
  return new Promise(r => cv.toBlob(r, 'image/png'));
}
async function saveImage() {
  const msg = $('copied'); msg.textContent = '画像を作っています…';
  try {
    const blob = await makeCard(), file = new File([blob], 'saju-kojin.png', { type: 'image/png' });
    if (navigator.canShare && navigator.canShare({ files: [file] }) && matchMedia('(pointer: coarse)').matches) {
      try { await navigator.share({ files: [file], text: '生年月日を入れるだけで、自分のサジュを無料で占えます👇\nhttps://saju-aisho.com/kojin/' }); msg.textContent = ''; return; }
      catch (e) { if (e.name === 'AbortError') { msg.textContent = ''; return; } }
    }
    const url = URL.createObjectURL(blob), a = document.createElement('a');
    a.href = url; a.download = 'saju-kojin.png'; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
    msg.textContent = '画像を保存しました。SNSに投稿してシェアできます。';
  } catch (e) { msg.textContent = 'この画面では画像を作れませんでした。スクリーンショットをご利用ください。'; }
}

initBirthInputs(['k'], () => { $('err').textContent = ''; });
let busy = false;
$('form').addEventListener('submit', e => {
  e.preventDefault();
  if (busy) return;
  if (!$('k-date').value) { $('err').textContent = '生年月日を選んでください。'; return; }
  busy = true;
  $('result').innerHTML = '<div class="loader frame" role="status"><span class="ring"><i></i></span><p>あなたの四柱を読み解いています</p></div>';
  $('result').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  setTimeout(() => { render(); busy = false; $('result').scrollIntoView({ behavior: 'auto', block: 'start' }); }, reduce ? 0 : 1400);
});
