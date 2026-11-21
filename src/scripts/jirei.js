// 2027年 辞令（お遊び診断）。生年月日とサインはこの画面の中だけで使い、保存も送信もしない。
import { saju, tengod } from './saju-calc.js';
import { initBirthInputs } from './birth-input.js';
import { STEM_FULL, STEM_SLUG, BRANCHES } from '../data/saju-data.js';

const $ = id => document.getElementById(id);
const YEAR_STEM = 3; // 2027年＝丁未

// 2027年の天干「丁」が、あなたの日主から見てどの星か → 配属先
const DEPT = {
  '傷官': { dept: '傷官本部 本音発信課', post: '主任', base: [74, 62],
    why: '本音が言葉になりやすい「傷官」の星', body: '言いたかったことが、やっと言葉になる年です。黙って我慢するより、気持ちを形にするほど評価が上がります。',
    love: '恋愛：「好き」を先に伝えた人が、流れをつかみます。' },
  '食神': { dept: '食神本部 ごほうび企画課', post: '企画主任', base: [80, 34],
    why: '楽しみと豊かさを呼ぶ「食神」の星', body: '楽しいことを企画するほど、人とお金が集まってくる年です。がんばりすぎより「おいしい・うれしい」を優先してください。',
    love: '恋愛：ごはんや趣味のお誘いから、ご縁が育ちます。' },
  '劫財': { dept: '劫財本部 ライバル対策課', post: '係長', base: [66, 78],
    why: '負けず嫌いに火がつく「劫財」の星', body: '張り合う相手がいるほど力が出る年です。ただし、お金と体力の使いすぎには注意です。',
    love: '恋愛：ライバル出現でスイッチが入りやすい年です。焦りすぎないこと。' },
  '比肩': { dept: '比肩本部 独立準備室', post: '室長', base: [72, 55],
    why: '自分の足で立つ「比肩」の星', body: '人に合わせるより、自分のやり方を通したほうがうまくいく年です。ひとり立ちの準備にぴったりです。',
    love: '恋愛：対等でいられる相手が、いちばん長続きします。' },
  '正印': { dept: '正印本部 学び直し課', post: '研修主任', base: [78, 40],
    why: '学びと後ろ盾に恵まれる「正印」の星', body: '学んだことがそのまま味方になる年です。資格や勉強を始めると、まわりから自然に頼られるようになります。',
    love: '恋愛：年上や、尊敬できる人とのご縁に注目です。' },
  '偏印': { dept: '偏印研究所 ひらめき課', post: '主任研究員', base: [64, 48],
    why: 'ひらめきと個性が冴える「偏印」の星', body: 'ひとりで考える時間から、思わぬアイデアが生まれる年です。予定を詰めすぎず、余白を確保してください。',
    love: '恋愛：にぎやかな場より、少人数や趣味の場で出会いやすい年です。' },
  '正官': { dept: '正官本部 管理職候補課', post: '課長代理', base: [88, 66],
    why: '信頼と責任が集まる「正官」の星', body: 'まじめさがきちんと評価される年です。任される仕事が増えますが、それは期待されている証拠です。',
    love: '恋愛：誠実な人との「ちゃんとした」ご縁が近づきます。' },
  '偏官': { dept: '偏官本部 特命プロジェクト課', post: '特命担当', base: [70, 86],
    why: '試練と突破の「偏官」の星', body: '急な依頼や大きな挑戦がめぐってくる年です。忙しいぶん、乗り越えたあとの成長がいちばん大きい配属です。',
    love: '恋愛：刺激的な相手にひかれやすい年。勢いだけで決めないこと。' },
  '正財': { dept: '正財本部 ご縁成約課', post: '課長', base: [86, 38],
    why: '積み上げが実を結ぶ「正財」の星（しかも日主と引き合う干合）', body: 'コツコツ積み上げたものが、目に見える成果になる年です。2027年の「丁」とあなたの日主は、引き合う組み合わせ（干合）です。',
    love: '恋愛：まじめなお付き合いや、関係を一歩進める話が出やすい年です。' },
  '偏財': { dept: '偏財本部 新規開拓課', post: '開拓主任', base: [76, 52],
    why: '人とお金の輪が広がる「偏財」の星', body: '人の輪が一気に広がる年です。誘われたら一度は顔を出すと、仕事も恋もチャンスが増えます。',
    love: '恋愛：飲み会・紹介・イベントなど、新しい場所に出会いがあります。' },
};

// 日主ごとの任命理由（性格のあるあるを、辞令らしい言い回しで）
const REASON = [
  { t: '大樹', sh: '友人との旅行で、頼まれてもいないのに点呼を取っていたため' },
  { t: '草花', sh: '「行けたら行く」と言って、最後まで残っていたため' },
  { t: '太陽', sh: 'サプライズの計画が、顔に全部出ていたため' },
  { t: '灯火', sh: '推しのために、有給の使い道がもう決まっているため' },
  { t: '山', sh: '休日に一歩も家を出ず、それを「充電」と呼んでいるため' },
  { t: '田畑', sh: '一泊旅行に、全員分の胃薬を持ってきたため' },
  { t: '鋼', sh: '友人の恋愛相談に、3分で結論を出したため' },
  { t: '宝石', sh: '料理が冷めるまで、写真を撮っていたため' },
  { t: '大海', sh: 'コンビニに行くと言って、隣の県にいたため' },
  { t: '雨露', sh: '「了解」に句点がないだけで、30分悩んだため' },
];

// 生まれた日の地支と、2027年の「未」との関係 → 特記事項
function note(b) {
  const B = BRANCHES[b];
  if (B === '午') return ['ご縁手当を支給する', '日支「午」と年支「未」の支合による', '生まれた日の地支「午」が2027年の「未」と結びつく（支合）ため、人とのご縁が深まりやすい年です。', 8, -6];
  if (B === '卯' || B === '亥') return ['チーム手当を支給する', `日支「${B}」と年支「未」の三合による`, `生まれた日の地支「${B}」が「未」と同じ仲間（三合）のため、協力者に恵まれやすい年です。`, 6, -4];
  if (B === '丑') return ['転勤の可能性あり', '日支「丑」と年支「未」の冲による', '生まれた日の地支「丑」が「未」とぶつかる（冲）ため、環境や住まいが動きやすい年です。変化はチャンスとして受け取ってください。', -4, 12];
  if (B === '未') return ['現部署にて引き続き勤務', '日支と年支がともに「未」のため', '生まれた日の地支が年と同じ「未」のため、同じ場所で深めるほど力が出る年です。', 2, 4];
  if (B === '子') return ['報告・連絡・相談を徹底すること', '日支「子」と年支「未」の害による', '生まれた日の地支「子」と「未」は、すれ違いやすい組み合わせ（害）です。言葉を省かないのがコツです。', -2, 8];
  return ['なし', '', '大きな波は少なく、配属先の仕事に集中しやすい年です。', 0, 0];
}

function compute(y, m, d) {
  const p = saju(y, m, d, null);
  const s = p.day.s, b = p.day.b;
  const star = tengod(s, YEAR_STEM);
  const D = DEPT[star];
  const [nt, nr, nd, up, ot] = note(b);
  const clamp = v => Math.max(12, Math.min(98, v));
  // 同じ日主でも生まれ日で少しずつ変わるように（決まった計算なので何度やっても同じ結果）
  const wob = ((y * 7 + m * 13 + d * 31) % 7) - 3;
  return { s, b, star, ...D, ...REASON[s], nt, nr, nd, rise: clamp(D.base[0] + up + wob), over: clamp(D.base[1] + ot - wob) };
}

/* ---------- サイン ---------- */
const pad = $('sign-pad'); const ctx = pad.getContext('2d');
let drawing = false, signed = false, last = null;
function fitPad() {
  const r = pad.getBoundingClientRect(), dpr = window.devicePixelRatio || 1;
  pad.width = r.width * dpr; pad.height = r.height * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = '#2B2118'; ctx.lineWidth = 3.2;
  signed = false; $('sign-hint').hidden = false;
}
const pt = e => { const r = pad.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
pad.addEventListener('pointerdown', e => { drawing = true; last = pt(e); pad.setPointerCapture(e.pointerId); $('sign-hint').hidden = true; });
pad.addEventListener('pointermove', e => {
  if (!drawing) return; const p = pt(e);
  ctx.beginPath(); ctx.moveTo(...last); ctx.lineTo(...p); ctx.stroke(); last = p; signed = true;
});
['pointerup', 'pointercancel', 'pointerleave'].forEach(t => pad.addEventListener(t, () => { drawing = false; }));
$('sign-clear').addEventListener('click', fitPad);

/* ---------- 辞令の表示 ---------- */
let R = null, signURL = '';
function esc(t) { return String(t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }

function show() {
  const v = $('j-date').value;
  if (!v) { $('j-err').textContent = '生年月日を選んでください。'; $('j-date-btn').focus(); return; }
  const [y, m, d] = v.split('-').map(Number);
  R = compute(y, m, d);
  signURL = signed ? pad.toDataURL('image/png') : '';
  const sl = STEM_SLUG[R.s];
  $('j-out').innerHTML = `
    <div class="jr-stage">
      <article class="jr-doc" id="jr-doc" aria-label="2027年の辞令">
        <p class="jr-title">辞　令</p>
        <div class="jr-name">${signURL ? `<img src="${signURL}" alt="あなたのサイン">` : '<span>あなた</span>'}<span class="jr-dono">殿</span></div>
        <p class="jr-order"><b>${R.dept}</b>勤務を命ずる</p>
        <p class="jr-order2">${R.post}に任ずる</p>
        <div class="jr-reason"><p class="jr-rh">任命理由</p><p class="jr-r">${R.sh}。</p><p>あわせて令和9年の「${R.star}」の星に鑑み、上記のとおり命ずる。</p></div>
        <dl class="jr-rows">
          <dt>特記事項</dt><dd>${R.nt}${R.nr ? `<small>（${R.nr}）</small>` : ''}</dd>
          <dt>査定見込</dt><dd>昇進率 <b>${R.rise}％</b>　残業（試練）度 <b>${R.over}％</b></dd>
        </dl>
        <p class="jr-date">令和9年2月4日</p>
        <p class="jr-from">ソウルのサジュ株式会社<br>人事部長　天乙貴人</p>
        <span class="jr-seal" aria-hidden="true">合</span>
      </article>
    </div>
    <div class="jr-detail frame">
      <p class="jr-why">あなたの日主は<b>${STEM_FULL[R.s]}（${R.t}）</b>。2027年（丁未）の「丁」は、あなたから見て<b>「${R.star}」</b>の星にあたります。配属先はこの星から、任命理由は日主の性格から出しています。<small>※「天乙貴人」は、サジュで困ったときに助けてくれるとされる吉星の名前です。</small></p>
      <p>${R.body}</p>
      <p>${R.love}</p>
      <p class="jr-note">${R.nd}</p>
      <p class="jr-small">※ 生年月日から出したお遊びの辞令です。昇進率などの数字は、星の組み合わせを目安にしたものです。</p>
    </div>
    <div class="share-box">
      <p class="share-h">辞令をシェアする</p>
      <div class="share-row">
        <a class="share-btn sb-threads" id="jr-th" target="_blank" rel="noopener">Threads</a>
        <a class="share-btn sb-x" id="jr-x" target="_blank" rel="noopener">X</a>
        <a class="share-btn sb-line" id="jr-line" target="_blank" rel="noopener">LINE</a>
      </div>
      <div class="copy-row"><button class="btn-ghost" type="button" id="jr-save">辞令を画像で保存</button><button class="btn-ghost" type="button" id="jr-again">もう一回</button><span class="note" id="jr-msg" aria-live="polite"></span></div>
      <p class="jr-small">シェアの文章と画像に、生年月日は入りません。</p>
    </div>
    <nav class="jr-next" aria-label="つぎに見る">
      <a class="jr-next-a frame" href="/articles/2027-unsei-${sl}/"><small>辞令のくわしい中身</small><b>${STEM_FULL[R.s]}の2027年の運勢を読む →</b></a>
      <a class="jr-next-a frame" href="/kojin/"><small>あなたの人事ファイル</small><b>自分のサジュをぜんぶ見る（相談メモつき）→</b></a>
      <a class="jr-next-a frame" href="/guide/"><small>異動前の個別面談 <span class="pr">PR</span></small><b>2027年の流れをプロに聞く：はじめての電話占い →</b></a>
    </nav>`;
  const text = `【辞令】令和9年2月4日付で「${R.dept}」勤務を命じられました。\n理由：${R.sh}。\n\n占いで、あなたの来年の配属先も出ます▼\nhttps://saju-aisho.com/jirei/\n#サジュ #2027年の運勢`;
  const e = encodeURIComponent(text);
  $('jr-th').href = `https://www.threads.net/intent/post?text=${e}`;
  $('jr-x').href = `https://twitter.com/intent/tweet?text=${e}`;
  $('jr-line').href = `https://line.me/R/share?text=${e}`;
  $('jr-save').addEventListener('click', saveImage);
  $('jr-again').addEventListener('click', () => { $('j-out').innerHTML = ''; fitPad(); $('jirei-form').scrollIntoView({ behavior: 'smooth' }); });
  $('j-out').hidden = false;
  $('j-out').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ---------- 画像で保存（1080×1350） ---------- */
async function saveImage() {
  const W = 1080, H = 1350, c = document.createElement('canvas'); c.width = W; c.height = H;
  const g = c.getContext('2d');
  await document.fonts.ready;
  const serif = '"Yu Mincho","YuMincho","游明朝","MS PMincho","MS Mincho","ＭＳ 明朝","Hiragino Mincho ProN","Hiragino Mincho Pro",serif';
  const INK = '#2B2118', SUB = '#7A5E2E', L = 150, Rr = W - 150;
  g.fillStyle = '#16121C'; g.fillRect(0, 0, W, H);
  g.fillStyle = '#F5EEDC'; g.fillRect(60, 50, W - 120, H - 130);
  g.strokeStyle = '#B38C45'; g.lineWidth = 3; g.strokeRect(84, 74, W - 168, H - 178);
  g.lineWidth = 1; g.strokeRect(96, 86, W - 192, H - 202);
  const fit = (t, w, size, weight) => { let f = size; g.font = `${weight} ${f}px ${serif}`; while (g.measureText(t).width > w && f > 20) { f -= 2; g.font = `${weight} ${f}px ${serif}`; } };
  const wrap = (t, x, y, w, lh) => { let line = ''; for (const ch of t) { if (g.measureText(line + ch).width > w && !'、。」）'.includes(ch)) { g.fillText(line, x, y); y += lh; line = ch; } else line += ch; } if (line) { g.fillText(line, x, y); y += lh; } return y; };
  g.fillStyle = INK; g.textAlign = 'center';
  g.font = `700 72px ${serif}`; g.fillText('辞　令', W / 2, 205);
  if (signURL) { const im = new Image(); im.src = signURL; await im.decode(); const h = 120, w = Math.min(520, im.width * h / im.height); g.drawImage(im, W / 2 - w / 2 - 40, 245, w, h); }
  else { g.font = `500 56px ${serif}`; g.fillText('あなた', W / 2 - 40, 345); }
  g.font = `500 42px ${serif}`; g.fillText('殿', W / 2 + 290, 355);
  g.strokeStyle = INK; g.lineWidth = 2; g.beginPath(); g.moveTo(230, 380); g.lineTo(850, 380); g.stroke();
  g.textAlign = 'left';
  fit(R.dept + '勤務を命ずる', Rr - L, 46, 700); g.fillText(R.dept + '勤務を命ずる', L, 490);
  g.font = `500 36px ${serif}`; g.fillText(R.post + 'に任ずる', L, 555);
  g.fillStyle = SUB; g.font = `500 26px ${serif}`; g.fillText('任命理由', L, 655);
  g.fillStyle = INK; g.font = `500 29px ${serif}`;
  fit(R.sh + '。', Rr - L, 40, 700);
  let y = wrap(R.sh + '。', L, 720, Rr - L, 56);
  g.font = `500 28px ${serif}`;
  y = wrap(`あわせて令和9年の「${R.star}」の星に鑑み、上記のとおり命ずる。`, L, y + 10, Rr - L, 44);
  y += 40;
  g.fillStyle = SUB; g.font = `500 26px ${serif}`; g.fillText('特記事項', L, y);
  g.fillStyle = INK; fit(R.nt + (R.nr ? `（${R.nr}）` : ''), Rr - L - 140, 29, 500); g.fillText(R.nt + (R.nr ? `（${R.nr}）` : ''), L + 140, y);
  y += 50;
  g.fillStyle = SUB; g.font = `500 26px ${serif}`; g.fillText('査定見込', L, y);
  g.fillStyle = INK; g.font = `700 32px ${serif}`; g.fillText(`昇進率 ${R.rise}％　残業（試練）度 ${R.over}％`, L + 140, y);
  g.textAlign = 'right'; g.font = `500 30px ${serif}`;
  g.fillText('令和9年2月4日', Rr - 120, 1080);
  g.fillText('ソウルのサジュ株式会社', Rr - 120, 1130);
  g.fillText('人事部長　天乙貴人', Rr - 120, 1178);
  g.save(); g.translate(Rr - 45, 1140); g.rotate(-0.1);
  g.strokeStyle = '#B83A32'; g.lineWidth = 5; g.strokeRect(-46, -46, 92, 92);
  g.fillStyle = '#B83A32'; g.textAlign = 'center'; g.font = `700 64px ${serif}`; g.fillText('合', 0, 23); g.restore();
  g.textAlign = 'center'; g.fillStyle = '#C9A55C'; g.font = `500 26px ${serif}`; g.fillText('占いで、あなたの来年の配属先も → saju-aisho.com/jirei', W / 2, 1318);
  c.toBlob(b => {
    const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'jirei-2027.png';
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    $('jr-msg').textContent = '画像を保存しました。';
  }, 'image/png');
}

/* ---------- 流れ：受け取る → 判子 → 辞令 ---------- */
$('jirei-form').addEventListener('submit', e => {
  e.preventDefault();
  if (!$('j-date').value) { $('j-err').textContent = '生年月日を選んでください。'; return; }
  $('j-err').textContent = '';
  const st = $('stamp');
  st.hidden = false; st.classList.remove('go'); void st.offsetWidth; st.classList.add('go');
  setTimeout(() => { st.hidden = true; show(); }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 50 : 1100);
});
initBirthInputs(['j'], () => { $('j-err').textContent = ''; });
fitPad();
window.addEventListener('resize', () => { if (!signed) fitPad(); });
