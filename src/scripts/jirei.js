// 2027年 辞令（お遊び診断）。生年月日とサインはこの画面の中だけで使い、保存も送信もしない。
import { saju, tengod } from './saju-calc.js';
import { initBirthInputs } from './birth-input.js';
import { STEM_FULL, STEM_SLUG, BRANCHES } from '../data/saju-data.js';

const $ = id => document.getElementById(id);
const YEAR_STEM = 3; // 2027年＝丁未

// 2027年の天干「丁」が、あなたの日主から見てどの星か → 配属先
const DEPT = {
  '傷官': { dept: '表現開発部 本音発信課', post: 'チーフ・クリエイター', base: [74, 62],
    body: '言いたかったことが、やっと言葉になる年です。黙って我慢するより、気持ちを形にするほど評価が上がります。',
    love: '恋愛業務：「好き」を先に伝えた人が、流れをつかみます。' },
  '食神': { dept: 'ごほうび推進部 たのしみ企画課', post: '企画リーダー', base: [80, 34],
    body: '楽しいことを企画するほど、人とお金が集まってくる年です。がんばりすぎより「おいしい・うれしい」を優先してください。',
    love: '恋愛業務：ごはんや趣味のお誘いから、ご縁が育ちます。' },
  '劫財': { dept: 'ライバル調整部 競争課', post: '現場責任者', base: [66, 78],
    body: '負けず嫌いに火がつく年です。張り合う相手がいるほど力が出ますが、お金と体力の使いすぎには注意です。',
    love: '恋愛業務：ライバル出現でスイッチが入りやすい年です。焦りすぎないこと。' },
  '比肩': { dept: '自分らしさ本部 独立準備室', post: '室長', base: [72, 55],
    body: '人に合わせるより、自分のやり方を通したほうがうまくいく年です。ひとり立ちの準備にぴったりです。',
    love: '恋愛業務：対等でいられる相手が、いちばん長続きします。' },
  '正印': { dept: '学び直し部 資格取得課', post: '研修主任', base: [78, 40],
    body: '学んだことがそのまま味方になる年です。資格や勉強を始めると、まわりから自然に頼られるようになります。',
    love: '恋愛業務：年上や、尊敬できる人とのご縁に注目です。' },
  '偏印': { dept: 'ひらめき研究所 ひとり時間課', post: '主任研究員', base: [64, 48],
    body: 'ひとりで考える時間から、思わぬアイデアが生まれる年です。予定を詰めすぎず、余白を確保してください。',
    love: '恋愛業務：にぎやかな場より、少人数や趣味の場で出会いやすい年です。' },
  '正官': { dept: '信頼構築部 管理職候補課', post: '管理職候補', base: [88, 66],
    body: 'まじめさがきちんと評価される年です。任される仕事が増えますが、それは期待されている証拠です。',
    love: '恋愛業務：誠実な人との「ちゃんとした」ご縁が近づきます。' },
  '偏官': { dept: '挑戦突破部 特命プロジェクト課', post: '特命担当', base: [70, 86],
    body: '急な依頼や大きな挑戦がめぐってくる年です。忙しいぶん、乗り越えたあとの成長がいちばん大きい配属です。',
    love: '恋愛業務：刺激的な相手にひかれやすい年。勢いだけで決めないこと。' },
  '正財': { dept: 'ご縁営業部 恋愛成約課', post: '成約担当マネージャー', base: [86, 38],
    body: 'コツコツ積み上げたものが、目に見える成果になる年です。2027年の「丁」とあなたの日主は、引き合う組み合わせ（干合）です。',
    love: '恋愛業務：まじめなお付き合いや、関係を一歩進める話が出やすい年です。' },
  '偏財': { dept: '出会い拡大部 新規開拓課', post: '新規開拓リーダー', base: [76, 52],
    body: '人の輪が一気に広がる年です。誘われたら一度は顔を出すと、仕事も恋もチャンスが増えます。',
    love: '恋愛業務：飲み会・紹介・イベントなど、新しい場所に出会いがあります。' },
};

// 生まれた日の地支と、2027年の「未」との関係 → 特記事項
function note(b) {
  const B = BRANCHES[b];
  if (B === '午') return ['★ ご縁手当を支給する', '日の地支「午」が2027年の「未」と結びつく（支合）ため、人とのご縁が深まりやすい年です。', 8, -6];
  if (B === '卯' || B === '亥') return ['チーム手当を支給する', `日の地支「${B}」が「未」と同じ仲間（三合）のため、協力者に恵まれやすい年です。`, 6, -4];
  if (B === '丑') return ['転勤の可能性あり', '日の地支「丑」が「未」とぶつかる（冲）ため、環境や住まいが動きやすい年です。変化はチャンスとして受け取ってください。', -4, 12];
  if (B === '未') return ['現部署に残留', '日の地支が年と同じ「未」のため、同じ場所で深めるほど力が出る年です。', 2, 4];
  if (B === '子') return ['人間関係の見直しあり', '日の地支「子」と「未」は、すれ違いやすい組み合わせ（害）です。言葉を省かないのがコツです。', -2, 8];
  return ['通常勤務', '大きな波は少なく、配属先の仕事に集中しやすい年です。', 0, 0];
}

function compute(y, m, d) {
  const p = saju(y, m, d, null);
  const s = p.day.s, b = p.day.b;
  const star = tengod(s, YEAR_STEM);
  const D = DEPT[star];
  const [nt, nd, up, ot] = note(b);
  const clamp = v => Math.max(12, Math.min(98, v));
  // 同じ日主でも生まれ日で少しずつ変わるように（決まった計算なので何度やっても同じ結果）
  const wob = ((y * 7 + m * 13 + d * 31) % 7) - 3;
  return { s, b, star, ...D, nt, nd, rise: clamp(D.base[0] + up + wob), over: clamp(D.base[1] + ot - wob) };
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
        <p class="jr-lead">2027年2月4日（立春）付をもって<br>下記のとおり配属を命ずる。</p>
        <dl class="jr-rows">
          <dt>配属</dt><dd><b>${R.dept}</b></dd>
          <dt>役職</dt><dd>${R.post}</dd>
          <dt>特記事項</dt><dd>${R.nt}</dd>
        </dl>
        <div class="jr-stats">
          <div><small>昇進率</small><b>${R.rise}<i>%</i></b></div>
          <div><small>残業（試練）度</small><b>${R.over}<i>%</i></b></div>
        </div>
        <p class="jr-from">ソウルのサジュ 人事部</p>
        <span class="jr-seal" aria-hidden="true">合</span>
      </article>
    </div>
    <div class="jr-detail frame">
      <p class="jr-why">あなたの日主は<b>${STEM_FULL[R.s]}</b>。2027年の「丁」は、あなたから見て<b>「${R.star}」</b>の星にあたります。</p>
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
  const text = `【辞令】2027年、わたしは「${R.dept}」に配属されました。\n昇進率${R.rise}%・残業（試練）度${R.over}%。\n\nあなたの来年の配属先は？▼\nhttps://saju-aisho.com/jirei/\n#サジュ #2027年の運勢`;
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
  const serif = '"Shippori Mincho","Hiragino Mincho ProN","Yu Mincho",serif';
  g.fillStyle = '#16121C'; g.fillRect(0, 0, W, H);
  g.fillStyle = '#F3EAD6'; g.fillRect(70, 70, W - 140, H - 140);
  g.strokeStyle = '#B38C45'; g.lineWidth = 3; g.strokeRect(96, 96, W - 192, H - 192);
  g.lineWidth = 1; g.strokeRect(108, 108, W - 216, H - 216);
  g.fillStyle = '#2B2118'; g.textAlign = 'center';
  g.font = `700 76px ${serif}`; g.fillText('辞　令', W / 2, 230);
  if (signURL) {
    const im = new Image(); im.src = signURL; await im.decode();
    const h = 150, w = Math.min(560, im.width * h / im.height);
    g.drawImage(im, W / 2 - w / 2 - 40, 280, w, h);
  } else { g.font = `600 64px ${serif}`; g.fillText('あなた', W / 2 - 40, 390); }
  g.font = `600 44px ${serif}`; g.fillText('殿', W / 2 + 290, 400);
  g.strokeStyle = '#2B2118'; g.lineWidth = 2; g.beginPath(); g.moveTo(230, 430); g.lineTo(850, 430); g.stroke();
  g.font = `400 34px ${serif}`;
  g.fillText('2027年2月4日（立春）付をもって', W / 2, 510); g.fillText('下記のとおり配属を命ずる。', W / 2, 560);
  g.textAlign = 'left';
  const row = (k, v, y, big) => { g.font = `400 30px ${serif}`; g.fillStyle = '#8A6B33'; g.fillText(k, 190, y); g.fillStyle = '#2B2118'; let fs = big ? 44 : 36; g.font = `${big ? 700 : 500} ${fs}px ${serif}`; while (g.measureText(v).width > 540 && fs > 24) { fs -= 2; g.font = `${big ? 700 : 500} ${fs}px ${serif}`; } g.fillText(v, 360, y); };
  row('配　属', R.dept, 680, true); row('役　職', R.post, 770); row('特記事項', R.nt, 860);
  g.textAlign = 'center';
  [['昇進率', R.rise, 360], ['残業（試練）度', R.over, 720]].forEach(([k, v, x]) => {
    g.fillStyle = '#8A6B33'; g.font = `400 30px ${serif}`; g.fillText(k, x, 945);
    g.fillStyle = '#2B2118'; g.font = `700 96px ${serif}`; g.fillText(`${v}%`, x, 1045);
  });
  g.fillStyle = '#2B2118'; g.font = `500 36px ${serif}`; g.fillText('ソウルのサジュ 人事部', W / 2 - 50, 1160);
  g.save(); g.translate(W / 2 + 220, 1145); g.rotate(-0.12);
  g.strokeStyle = '#B83A32'; g.lineWidth = 6; g.strokeRect(-52, -52, 104, 104);
  g.fillStyle = '#B83A32'; g.font = `700 72px ${serif}`; g.fillText('合', 0, 26); g.restore();
  g.fillStyle = '#8A6B33'; g.font = `400 26px ${serif}`; g.fillText('saju-aisho.com/jirei', W / 2, 1222);
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
