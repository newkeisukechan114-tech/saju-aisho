// 相性診断（クンハプ）のページ用スクリプト
import { STEMS, STEM_KO, BRANCHES, BRANCH_KO, ANIMALS, EL, EL_VAR, stemEl, BRANCH_EL, STEM_INFO } from '../data/saju-data.js';

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const AFF = document.getElementById('result')?.dataset.aff || '';
const PX = document.getElementById('result')?.dataset.px || '';
const mod = (a, n) => ((a % n) + n) % n;
function jdn(y, m, d) {
  const a = Math.floor((14 - m) / 12), yy = y + 4800 - a, mm = m + 12 * a - 3;
  return d + Math.floor((153 * mm + 2) / 5) + 365 * yy + Math.floor(yy / 4) - Math.floor(yy / 100) + Math.floor(yy / 400) - 32045;
}
// 節入りの概算日（月, 日, 寅月を0とした順番）
const TERMS = [[1,6,11],[2,4,0],[3,6,1],[4,5,2],[5,6,3],[6,6,4],[7,7,5],[8,8,6],[9,8,7],[10,8,8],[11,7,9],[12,7,10]];
function saju(y, m, d, hour) {
  const sy = (m < 2 || (m === 2 && d < 4)) ? y - 1 : y;
  const yi = mod(sy - 4, 60);
  let ord = 10;
  for (const [tm, td, o] of TERMS) if (m > tm || (m === tm && d >= td)) ord = o;
  const ys = yi % 10, yb = yi % 12;
  const ms = mod(ys * 2 + 2 + ord, 10), mb = (ord + 2) % 12;
  const di = mod(jdn(y, m, d) - 11, 60), ds = di % 10, db = di % 12;
  const h = hour === null ? null : { s: mod(ds * 2 + hour, 10), b: hour };
  const p = { year: { s: ys, b: yb }, month: { s: ms, b: mb }, day: { s: ds, b: db }, hour: h };
  const count = [0,0,0,0,0];
  for (const k of ['year','month','day','hour']) { if (!p[k]) continue; count[stemEl(p[k].s)]++; count[BRANCH_EL[p[k].b]]++; }
  p.count = count;
  return p;
}
function branchRel(a, b) {
  if (a === b) return 'same';
  if ((a + b) % 12 === 1) return 'rokugo';
  if (Math.abs(a - b) === 6) return 'chu';
  if (a % 4 === b % 4) return 'sango';
  return 'none';
}
function compat(A, B) {
  const out = [];
  let score = 62;
  const sa = A.day.s, sb = B.day.s, ea = stemEl(sa), eb = stemEl(sb);
  if (Math.abs(sa - sb) === 5) { score += 14; out.push({ h: '日主の結びつき', pill: ['good', '天干合'], t: `${STEMS[sa]}と${STEMS[sb]}は「天干合」の組み合わせ。ふたりの日主が結び合い、初対面から不思議と惹かれ合いやすい縁です。` }); }
  else if (ea === eb) { score += 5; out.push({ h: '日主の結びつき', pill: ['neutral', '比和'], t: `どちらも${EL[ea]}の日主。価値観が近く、友達のように並んで歩ける関係です。似た者どうしなので、譲り合いを意識すると長続きします。` }); }
  else if ((ea + 1) % 5 === eb) { score += 9; out.push({ h: '日主の結びつき', pill: ['good', '相生'], t: `あなたの${EL[ea]}が、お相手の${EL[eb]}を生み出す関係。あなたが支え、お相手が伸びていく形です。与えすぎて疲れないようにだけ気をつけて。` }); }
  else if ((eb + 1) % 5 === ea) { score += 9; out.push({ h: '日主の結びつき', pill: ['good', '相生'], t: `お相手の${EL[eb]}が、あなたの${EL[ea]}を生み出す関係。お相手に支えられて、あなたが自然体でいられる組み合わせです。` }); }
  else if ((ea + 2) % 5 === eb) { score -= 4; out.push({ h: '日主の結びつき', pill: ['care', '相剋'], t: `あなたの${EL[ea]}が、お相手の${EL[eb]}を抑える関係。刺激が強く惹かれ合う一方、あなたが主導権を握りすぎないことが鍵です。` }); }
  else { score -= 4; out.push({ h: '日主の結びつき', pill: ['care', '相剋'], t: `お相手の${EL[eb]}が、あなたの${EL[ea]}を抑える関係。お相手のペースに流されやすいので、自分の気持ちをこまめに言葉にしましょう。` }); }
  const br = branchRel(A.day.b, B.day.b);
  const brText = {
    rokugo: ['good', '六合', 10, '日支が「六合」。暮らしのリズムが自然と噛み合い、一緒にいて楽な関係です。同棲や結婚生活の相性も良好です。'],
    sango: ['good', '三合', 7, '日支が「三合」の仲間。同じ目標に向かうと強い結束が生まれます。ふたりで計画を立てるほど絆が深まります。'],
    chu: ['care', '冲', -9, '日支が「冲」。生活のペースがぶつかりやすい反面、惹かれる刺激も強い組み合わせです。休日の過ごし方を話し合っておくと安心です。'],
    same: ['neutral', '同じ日支', 3, '日支が同じ。感覚が似ていて安心感があります。慣れからマンネリになりやすいので、新しい体験を一緒に増やしましょう。'],
    none: ['neutral', '穏やか', 0, '日支どうしに強い作用はなく、穏やかな関係です。ゆっくり時間をかけて信頼を育てるタイプの縁です。']
  }[br];
  score += brText[2];
  out.push({ h: '暮らしのリズム', pill: [brText[0], brText[1]], t: `${BRANCHES[A.day.b]}と${BRANCHES[B.day.b]}。${brText[3]}` });
  const tr = branchRel(A.year.b, B.year.b);
  const ttxt = { rokugo: ['good','六合',4,'干支どうしが六合。家族や周りの人にも祝福されやすい組み合わせです。'], sango: ['good','三合',4,'干支どうしが三合。友人関係からも発展しやすい縁です。'], chu: ['care','冲',-4,'干支どうしが冲。育った環境や考え方の違いが出やすいので、違いを面白がるのがコツです。'], same: ['neutral','同じ干支',0,'同じ干支どうし。共通の話題が多く、打ち解けやすい関係です。'], none: ['neutral','穏やか',0,'干支どうしに強い作用はありません。'] }[tr];
  score += ttxt[2];
  out.push({ h: '干支（띠）の相性', pill: [ttxt[0], ttxt[1]], t: `${ANIMALS[A.year.b]}年と${ANIMALS[B.year.b]}年。${ttxt[3]}` });
  const lackA = EL.filter((_, i) => A.count[i] === 0), lackB = EL.filter((_, i) => B.count[i] === 0);
  const coverA = EL.filter((_, i) => A.count[i] === 0 && B.count[i] >= 2);
  const coverB = EL.filter((_, i) => B.count[i] === 0 && A.count[i] >= 2);
  score += Math.min(8, (coverA.length + coverB.length) * 4);
  let ct;
  if (coverA.length || coverB.length) {
    const parts = [];
    if (coverA.length) parts.push(`あなたに足りない「${coverA.join('・')}」をお相手が持っています`);
    if (coverB.length) parts.push(`お相手に足りない「${coverB.join('・')}」をあなたが持っています`);
    ct = parts.join('。') + '。一緒にいるほどバランスが整う、補い合いの関係です。';
  } else if (!lackA.length && !lackB.length) {
    ct = 'ふたりとも五行がそろっていて、それぞれが自立したバランスの良い関係です。';
  } else {
    ct = `${lackA.length ? `あなたは「${lackA.join('・')}」` : ''}${lackA.length && lackB.length ? '、' : ''}${lackB.length ? `お相手は「${lackB.join('・')}」` : ''}が少なめ。ふたりで同じものが欠けていないかを意識すると、すれ違いを防げます。`;
  }
  out.push({ h: '五行の補い合い', pill: [coverA.length || coverB.length ? 'good' : 'neutral', coverA.length || coverB.length ? '補い合い' : 'バランス'], t: ct });
  score = Math.max(48, Math.min(98, score));
  return { score, items: out };
}
function title(score) {
  if (score >= 90) return ['運命級の縁', '出会うべくして出会ったふたり。迷ったときほど、素直な気持ちが道を開きます。'];
  if (score >= 80) return ['惹かれ合うふたり', '自然と心が向き合う組み合わせ。小さな約束を守るほど、絆は確かなものになります。'];
  if (score >= 70) return ['育てるほど深まる縁', '時間をかけるほど良さが見えてくる関係。焦らず、言葉を交わす回数を増やしましょう。'];
  if (score >= 60) return ['違いを学び合う関係', '性質の違いが、お互いを成長させる組み合わせ。違いを責めずに面白がるのが鍵です。'];
  return ['試練を越えて結ばれる縁', 'ぶつかる場面もある分、乗り越えたときの結びつきは強い組み合わせです。'];
}

/* ---------- 画面の組み立て ---------- */
const $ = id => document.getElementById(id);
const CORNERS = '<i class="corner tl"></i><i class="corner tr"></i><i class="corner bl"></i><i class="corner br"></i>';
function pillarHTML(p) {
  const cols = [['時柱', p.hour], ['日柱', p.day], ['月柱', p.month], ['年柱', p.year]];
  return `<div class="pillars">${cols.map(([l, c], i) => c
    ? `<div class="pillar${i === 1 ? ' day' : ''}"><div class="lbl">${l}</div><div class="ch">${STEMS[c.s]}</div><div class="ko">${STEM_KO[c.s]}</div><div class="ch">${BRANCHES[c.b]}</div><div class="ko">${BRANCH_KO[c.b]}</div></div>`
    : `<div class="pillar"><div class="lbl">${l}</div><div class="unk">時間<br>不明</div></div>`).join('')}</div>`;
}
function barsHTML(count) {
  const max = Math.max(...count, 1);
  return `<div class="bars">${count.map((n, i) => `<div class="bar"><span>${EL[i]}</span><span class="track"><span class="fill" style="width:${n / max * 100}%;background:var(${EL_VAR[i]})"></span></span><span class="n">${n}</span></div>`).join('')}</div>`;
}
function panel(name, p) {
  return `<div class="panel frame">${CORNERS}<h3>${name}の四柱</h3>${pillarHTML(p)}<div class="dm">日主は <b>${STEMS[p.day.s]}（${STEM_KO[p.day.s]}）</b>　${STEM_INFO[p.day.s][0]}の${EL[stemEl(p.day.s)]}</div>${barsHTML(p.count)}</div>`;
}
let lastText = '';
const MEANING = {
  '日主の結びつき': '日主は生まれた日の天干で、その人の本質を表します。ふたりの日主の関係は「心の相性」です。',
  '暮らしのリズム': '日支は「配偶者の座」とも呼ばれ、一緒に過ごす時間や暮らしたときの相性を表します。',
  '干支（띠）の相性': '生まれ年の干支（韓国では「띠」）は、家族や友人など周りとの関係、育った環境の相性を表します。',
  '五行の補い合い': '四柱の文字を木・火・土・金・水に分けたバランスです。足りない力を相手が持っているかを見ます。'
};
const EL_POWER = ['計画を立てて前に進む力', '気持ちを表に出す情熱', '信頼を積み重ねる安定感', 'けじめをつける決断力', '本音を打ち明ける柔らかさ'];
// 気をつけたいポイントと、占い師に聞くとよい質問
function cautions(A, B) {
  const pts = [];
  const sa = A.day.s, sb = B.day.s, ea = stemEl(sa), eb = stemEl(sb);
  if (Math.abs(sa - sb) === 5) pts.push(['相手に合わせすぎて、自分を見失いやすい', '天干合は引き合う力がとても強い組み合わせです。そのぶん、相手の予定や気分に合わせることが当たり前になりがちです。', '会う頻度や連絡のペースを、ときどき自分からも提案する', 'お相手は、私との関係をこの先どうしたいと思っている？']);
  else if (ea === eb) pts.push(['似た者どうしで、意地の張り合いになりやすい', '同じ五行のふたりは考え方が近い反面、ゆずれないポイントも同じです。小さな喧嘩が長引きやすい傾向があります。', '喧嘩をしたら、その日のうちに「ごめんね」を言う役を交代で決める', 'ふたりの関係では、どちらが歩み寄るとうまくいく？']);
  else if ((ea + 1) % 5 === eb) pts.push(['あなたが与える側に偏り、尽くし疲れしやすい', `あなたの${EL[ea]}がお相手の${EL[eb]}を育てる関係です。相手のためを思うほど、自分の気持ちを後回しにしがちです。`, 'してほしいことを、小さなことから言葉にして頼む', 'お相手は、私の支えをどう受け取っている？']);
  else if ((eb + 1) % 5 === ea) pts.push(['相手に頼りすぎて、受け身になりやすい', `お相手の${EL[eb]}があなたの${EL[ea]}を育てる関係です。居心地がいいぶん、関係の舵取りを相手任せにしがちです。`, '感謝を言葉にして、ときどきはデートの行き先をあなたが決める', 'お相手が本当は私に望んでいることは？']);
  else if ((ea + 2) % 5 === eb) pts.push(['あなたの言葉が、相手には強く響きやすい', `あなたの${EL[ea]}がお相手の${EL[eb]}を抑える関係です。悪気のない一言でも、お相手は萎縮してしまうことがあります。`, '気になることは1つずつ、良いところと一緒に伝える', 'お相手は、私といて無理をしていない？']);
  else pts.push(['相手のペースに押され、本音を飲み込みやすい', `お相手の${EL[eb]}があなたの${EL[ea]}を抑える関係です。嫌われたくない気持ちから、言いたいことを我慢しがちです。`, '伝えたいことは、先にメモにまとめてから話す', '私の気持ちを伝えるのに、いいタイミングはいつ？']);
  const br = branchRel(A.day.b, B.day.b);
  if (br === 'chu') pts.push(['生活のリズムや休日の過ごし方でぶつかりやすい', '日支の冲は、暮らしのペースが正反対になりやすい組み合わせです。会う時間帯や休日の使い方で不満がたまりがちです。', '「一緒に過ごす日」と「ひとりの日」を最初に決めておく', 'ふたりの関係が安定するのはいつ頃？']);
  else if (br === 'same') pts.push(['慣れからマンネリになりやすい', '同じ日支のふたりは安心感が大きい反面、刺激が少なくなりがちです。気づくと会話が減っていることも。', '月に1回は、ふたりとも初めての場所へ出かける', '関係をもう一歩進めるきっかけは何？']);
  else if (br === 'none') pts.push(['強い引力がないぶん、進展がゆっくりになりやすい', '日支どうしに強い作用がないため、どちらかが動かないと関係が止まりやすい組み合わせです。', '次に会う約束は、日にちまで具体的に自分から誘う', 'お相手との距離を縮めるには、何をすればいい？']);
  else pts.push(['居心地のよさで、関係が現状維持になりやすい', '日支の結びつきが良く一緒にいて楽なぶん、将来の話を先延ばしにしがちです。', '「1年後どうしていたいか」を、軽い雑談の形で話してみる', '結婚や将来について、お相手はどう考えている？']);
  const tr = branchRel(A.year.b, B.year.b);
  const common = EL.map((_, i) => i).filter(i => A.count[i] === 0 && B.count[i] === 0);
  if (common.length) { const i = common[0]; pts.push([`ふたりとも「${EL[i]}」が少なく、${EL_POWER[i]}が不足しがち`, `ふたりの四柱にどちらも${EL[i]}がないため、${EL_POWER[i]}を補い合えません。大事な場面で同じところでつまずきやすくなります。`, `${['ふたりの予定や目標を、カレンダーで共有する', '好きなところを、照れずに言葉で伝える日をつくる', '小さな約束を守ることを、ふたりで大事にする', '決めるべきことは、期限を決めて話し合う', '不安なことは、溜めずにその日のうちに話す'][i]}`, `ふたりに足りない${EL[i]}の力は、どうやって補えばいい？`]); }
  else if (tr === 'chu') pts.push(['家族や友人の意見で、気持ちが揺れやすい', '生まれ年の干支が冲のふたりは、育った環境や価値観の違いが出やすく、周りの声に左右されがちです。', '周りの意見より、ふたりで決めたことを優先すると約束しておく', '周りの反対や環境の違いは、どう乗り越えられる？']);
  else pts.push(['相性の良さに安心して、言葉が足りなくなりやすい', '全体のバランスが取れているふたりほど、「言わなくても分かる」と思いがちです。すれ違いは小さな言葉不足から始まります。', '「ありがとう」と「どう思う？」を、毎日1回は伝える', '今、お相手は私のことをどう思っている？']);
  return pts;
}
// 4つの観点をくわしく：解説の続き・日常での表れ方・うまくいくコツ
const GEN = ['木が燃えて火を生み出す', '火が燃えたあとの灰が土になる', '土の中から金属が生まれる', '冷えた金属の表面に水滴が生まれる', '水が木を育てる'];
const KOKU = ['木が根を張って土を締めつける', '火が金属を溶かす', '土が水をせき止める', '斧が木を切り倒す', '水が火を消す'];
const EL_TRAIT = ['向上心とやさしさ', '情熱と表現力', '安定感と包容力', '決断力と誠実さ', '知性と柔軟さ'];
const KYOKU = ['水', '金', '火', '木'];
function enrich(A, B, items) {
  const sa = A.day.s, sb = B.day.s, ea = stemEl(sa), eb = stemEl(sb);
  const na = `${STEMS[sa]}（${STEM_INFO[sa][0]}）`, nb = `${STEMS[sb]}（${STEM_INFO[sb][0]}）`;
  const d = {};
  if (Math.abs(sa - sb) === 5) d['日主の結びつき'] = [
    `あなたの${na}とお相手の${nb}は、陰と陽がぴたりと組み合わさるペアです。性格のタイプは違っていても、相手に足りないところを自分が自然に埋められるため、一緒にいるほど「この人といると落ち着く」と感じやすくなります。韓国では、こうしたご縁の深いふたりを「천생연분（天が定めた縁）」と表すこともあります。`,
    '連絡しようと思ったタイミングで相手からメッセージが届く、初めて会ったのに昔から知っていたような気がする、といった「縁を感じる出来事」が起こりやすい組み合わせです。',
    '引き合う力が強いぶん、言葉にしなくても通じると思い込みやすくなります。大事な気持ちほど、照れずに言葉で確かめ合いましょう。'];
  else if (ea === eb) d['日主の結びつき'] = [
    `あなたの${na}とお相手の${nb}は、どちらも${EL[ea]}の日主です。${sa === sb ? 'まったく同じ日主どうしなので、' : '陰と陽の違いはあっても、'}物事の感じ方や大切にしたいものがよく似ています。${EL[ea]}が持つ${EL_TRAIT[ea]}を、ふたりとも生まれつき備えています。`,
    '好きな食べ物や休日の過ごし方、笑うポイントが似ていて、会話が自然と弾みます。一方で、どちらも譲れないところが同じなので、意見がぶつかると平行線になりがちです。',
    '「決める役」を場面ごとに分けておくとスムーズです。たとえば、旅行の行き先はあなた、お店選びはお相手、のように役割を決めておきましょう。'];
  else if ((ea + 1) % 5 === eb) d['日主の結びつき'] = [
    `あなたの${na}とお相手の${nb}は、「${GEN[ea]}」ように、あなたがお相手を育てる相生の関係です。あなたの${EL_TRAIT[ea]}が、お相手の${EL_TRAIT[eb]}を引き出します。お相手はあなたといると、自分らしさを発揮しやすくなります。`,
    'お相手の悩みを聞いたり、背中を押したりする場面が多くなります。お相手もあなたを頼りにしていて、「あなたのおかげで頑張れる」と感じています。',
    '与えるばかりだと、あなたが疲れてしまいます。ときには「今日は話を聞いてほしい」と、あなたからも甘えてみましょう。'];
  else if ((eb + 1) % 5 === ea) d['日主の結びつき'] = [
    `お相手の${nb}とあなたの${na}は、「${GEN[eb]}」ように、お相手があなたを育てる相生の関係です。お相手の${EL_TRAIT[eb]}が、あなたの${EL_TRAIT[ea]}を引き出してくれます。あなたはお相手のそばで、肩の力を抜いて自然体でいられます。`,
    '落ち込んだときにさりげなく励まされたり、迷ったときに答えをくれたりと、お相手に支えられる場面が多い組み合わせです。',
    '支えてもらうことが当たり前にならないよう、「ありがとう」を言葉にしましょう。ときどきはあなたからデートを計画すると、関係のバランスが整います。'];
  else if ((ea + 2) % 5 === eb) d['日主の結びつき'] = [
    `あなたの${na}とお相手の${nb}は、「${KOKU[ea]}」ように、あなたがお相手を抑える相剋の関係です。相剋は悪い相性ではありません。お互いに刺激を与え合い、強く惹かれ合う組み合わせでもあります。ただ、あなたの${EL_TRAIT[ea]}が強く出ると、お相手は窮屈に感じることがあります。`,
    'あなたがリードし、お相手がついてくる形になりやすい関係です。あなたにとっては何気ない一言が、お相手には「責められた」と聞こえてしまうこともあります。',
    'お相手の意見を最後まで聞いてから話すだけで、関係はぐっと穏やかになります。指摘したいことは1つずつ、良いところと一緒に伝えましょう。'];
  else d['日主の結びつき'] = [
    `お相手の${nb}とあなたの${na}は、「${KOKU[eb]}」ように、お相手があなたを抑える相剋の関係です。相剋は悪い相性ではなく、強く惹かれ合う刺激的な組み合わせです。ただ、お相手の${EL_TRAIT[eb]}に押されて、あなたの${EL_TRAIT[ea]}が出しにくくなることがあります。`,
    'お相手のペースに合わせているうちに、言いたいことを飲み込んでしまう場面が増えがちです。お相手は、あなたが我慢していることに気づいていないかもしれません。',
    '「私はこう思う」と、主語を自分にして気持ちを伝える練習をしましょう。小さな希望から伝えていくと、お相手も受け止めやすくなります。'];
  const ba = A.day.b, bb = B.day.b, br = branchRel(ba, bb);
  const bn = `あなたの日支「${BRANCHES[ba]}（${ANIMALS[ba]}）」とお相手の日支「${BRANCHES[bb]}（${ANIMALS[bb]}）」`;
  d['暮らしのリズム'] = {
    rokugo: [`${bn}は、ふたつで1つの組をつくる六合の関係です。生活のリズムや心地よいと感じる距離感が似ていて、長い時間を一緒に過ごしても疲れにくい組み合わせです。同棲や結婚のあとに、相性の良さをいっそう実感しやすいタイプです。`, '家事の分担が自然と決まる、何も話さない時間も気まずくない、相手の体調の変化にすぐ気づく、といった場面に相性の良さが表れます。', '居心地が良いからこそ、相手がしてくれることを当たり前だと思わないように。小さなことにも「ありがとう」を伝え続けましょう。'],
    sango: [`${bn}は、三つで「${KYOKU[ba % 4]}」の力をつくる三合の仲間です。同じ方向を向いたときに、ひとりでは出せない大きな力を発揮できる組み合わせです。ふたりで何かに取り組むほど、絆が深まります。`, '旅行の計画を立てる、共通の趣味に打ち込む、将来のために一緒に貯金をする、といった「ふたりのプロジェクト」で特に盛り上がります。', '目標がないと、関係がなんとなく続くだけになりがちです。小さくてもいいので、ふたりで叶えたいことを1つ決めておきましょう。'],
    chu: [`${bn}は、十二支の円でちょうど向かい合う冲の関係です。生活のペースや大切にしたいことが正反対になりやすい一方で、自分にないものを持つ相手に強く惹かれる組み合わせでもあります。違いを知ったうえで付き合えば、お互いの世界を広げ合えます。`, '朝型と夜型、家で過ごしたい人と出かけたい人、というように過ごし方の好みが分かれやすく、休日の予定や連絡のペースで小さな不満がたまりがちです。', '「一緒に過ごす日」と「それぞれ好きに過ごす日」を最初に決めておくと、ぶつかる回数がぐっと減ります。'],
    same: [`${bn}は同じ十二支です。暮らしの感覚や心地よい距離感がよく似ているため、一緒にいると安心できる組み合わせです。説明しなくても分かってもらえることが多く、気を遣わずに過ごせます。`, '休日の過ごし方や食事の好みが合い、一緒に暮らしても大きな衝突は起こりにくい関係です。ただ、変化が少ないぶん、会話が減っていくことがあります。', '月に1回は、ふたりとも行ったことのない場所に出かけるなど、意識して新しい体験を増やしましょう。'],
    none: [`${bn}の間には、強く引き合う作用もぶつかり合う作用もありません。お互いのペースを尊重しながら、ゆっくり信頼を積み重ねていくタイプの関係です。`, '急に距離が縮まることは少ないものの、大きな喧嘩も起こりにくい穏やかな関係です。その反面、どちらかが動かないと関係が進みにくい面もあります。', '次に会う約束は「いつか」ではなく、日にちまで決めて誘いましょう。小さな約束の積み重ねが、ふたりの距離を縮めます。']
  }[br];
  const ya = A.year.b, yb = B.year.b, tr = branchRel(ya, yb);
  const yn = `${ANIMALS[ya]}年のあなたと${ANIMALS[yb]}年のお相手`;
  d['干支（띠）の相性'] = {
    rokugo: [`${yn}は、干支どうしが六合の関係です。韓国では結婚の前に「띠궁합（干支の相性）」を気にする家族も多く、六合は昔から歓迎されてきた組み合わせです。お互いの家族や友人にも受け入れられやすい関係です。`, '相手の家族と初めて会うときや、友人に紹介するときに、自然と打ち解けやすい傾向があります。', '周りに応援されやすいぶん、周りに気を遣いすぎないように。ふたりのペースを大切にしましょう。'],
    sango: [`${yn}は、干支どうしが三合の仲間です。育った環境や大切にしてきた価値観に共通点が多く、友人のような気楽さから関係を深めていける組み合わせです。`, '共通の知り合いが多かったり、似た趣味を持っていたりと、話題に困ることが少ない関係です。', '友人のような関係が心地よすぎて、恋人らしい時間が減っていないか、ときどき振り返ってみましょう。'],
    chu: [`${yn}は、干支どうしが冲の関係です。育った環境や家族の考え方が違うことが多く、当たり前だと思っていることが相手には新鮮に映ります。違いを面白がれれば、お互いの視野が広がる組み合わせです。`, 'お金の使い方や家族との距離感、記念日の祝い方など、育ちの違いが出る場面で意見が分かれやすくなります。', '「うちではこうだった」と話し合う時間をつくりましょう。違いを知るほど、相手への理解が深まります。'],
    same: [`${yn}は同じ干支です。同世代なら同じ時代の空気を吸って育っているため、懐かしい話題や価値観の共有がしやすい組み合わせです。`, '昔流行ったものの話で盛り上がるなど、共通の話題が多く、初対面でも打ち解けやすい関係です。', '似ているぶん、相手の新しい一面を見つけようとする気持ちを忘れずにいましょう。'],
    none: [`${yn}の干支には、強く引き合う作用もぶつかる作用もありません。家族や周りの影響を受けにくく、ふたりの気持ち次第で関係を育てていける組み合わせです。`, '周りの意見に左右されることが少なく、ふたりのペースで付き合いを進められます。', 'ふたりのことはふたりで決める関係です。大事なことほど、早めに話し合っておきましょう。']
  }[tr];
  const ca = EL.map((e, i) => `${e}${A.count[i]}`).join('・'), cb = EL.map((e, i) => `${e}${B.count[i]}`).join('・');
  const topA = A.count.indexOf(Math.max(...A.count)), topB = B.count.indexOf(Math.max(...B.count));
  d['五行の補い合い'] = [
    `五行の数は、あなたが${ca}、お相手が${cb}です。あなたは${EL[topA]}が最も多く${EL_TRAIT[topA]}に、お相手は${EL[topB]}が最も多く${EL_TRAIT[topB]}に恵まれています。${topA === topB ? 'ふたりとも同じ力が強いので、得意なことが重なり、同じ場面で力を発揮できます。' : '得意なことが違うので、場面によって頼れる人が入れ替わる関係です。'}`,
    `${topA === topB ? `どちらも${EL[topA]}の${EL_TRAIT[topA]}が強いため、ふたりでいると勢いがつきます。` : `${EL[topA]}の力が必要な場面ではあなたが、${EL[topB]}の力が必要な場面ではお相手が、自然と前に出る形になります。`}`,
    '相手の得意なことは素直に任せ、苦手なことは責めずに補い合いましょう。「ここはお願いね」と頼れる関係が、五行のバランスを整えます。'];
  return items.map(i => Object.assign({}, i, { more: d[i.h][0], scene: d[i.h][1], tip: d[i.h][2] }));
}
function render() {
  const ad = $('a-date').value, bd = $('b-date').value;
  const pa = ad.split('-').map(Number), pb = bd.split('-').map(Number);
  const ha = $('a-hour').value === '' ? null : Number($('a-hour').value);
  const hb = $('b-hour').value === '' ? null : Number($('b-hour').value);
  const A = saju(pa[0], pa[1], pa[2], ha), B = saju(pb[0], pb[1], pb[2], hb);
  const c = compat(A, B), t = title(c.score), pts = cautions(A, B);
  lastText = `【韓国式相性占い クンハプ】ふたりの相性は${c.score}点「${t[0]}」\nあなたの日主：${STEMS[A.day.s]}（${STEM_INFO[A.day.s][0]}）／お相手の日主：${STEMS[B.day.s]}（${STEM_INFO[B.day.s][0]}）\n#サジュ #韓国占い #ソウルのサジュ恋愛相性占い`;
  $('result').innerHTML = `
    <div class="score-card frame">${CORNERS}
      <span class="tag">ふたりの相性</span>
      <div class="score gold-text">${c.score}<small>点</small></div>
      <h2>${t[0]}</h2><p>${t[1]}</p>
    </div>
    <div class="charts">${panel('あなた', A)}${panel('お相手', B)}</div>
    <div class="reading frame">${CORNERS}
      <div class="sec-head"><span class="en">Reading</span><h3>4つの観点で読み解く</h3></div>
      ${enrich(A, B, c.items).map(i => `<section><h4>${i.h}</h4><div class="rd"><span class="pill ${i.pill[0]}">${i.pill[1]}</span><p class="mean">${MEANING[i.h]}</p><p class="lead">${i.t}</p><p>${i.more}</p><dl><dt>日常ではこんな場面に</dt><dd>${i.scene}</dd><dt>うまくいくコツ</dt><dd>${i.tip}</dd></dl></div></section>`).join('')}
    </div>
    <div class="caution frame">${CORNERS}
      <div class="sec-head"><span class="en">Caution</span><h3>このふたりが気をつけたい3つのポイント</h3><p>相性に良い悪いはありません。つまずきやすい場所を先に知っておくと、ふたりの関係は長続きします。</p></div>
      <ol class="points">${pts.map((p, i) => `<li><span class="num">${['壹', '貳', '參'][i]}</span><div><h4>${p[0]}</h4><p>${p[1]}</p><p class="tip"><b>ふたりでできること</b>${p[2]}</p></div></li>`).join('')}</ol>
    </div>
    <div class="cta frame">${CORNERS}
      <span class="pr">PR</span>
      <h3>このポイント、お相手の本当の気持ちは<br>占い師に直接聞けます</h3>
      <p>クンハプで分かるのは、ふたりが生まれ持った気質です。お相手が今どう感じているか、この先どう動けばいいかは、あなたたちの状況を聞いたうえで占い師が具体的に答えてくれます。</p>
      <div class="asks"><span class="asks-h">相談するときは、こう聞いてみてください</span><ul>${pts.map(p => `<li>「${p[3]}」</li>`).join('')}</ul></div>
      ${AFF ? `<a class="btn-cta" href="${AFF}" rel="sponsored nofollow noopener" target="_blank">ココナラ電話占いで相談する</a>${PX ? `<img class="a8px" src="${PX}" width="1" height="1" alt="">` : ''}` : '<span class="btn-cta is-disabled">ご案内の準備中です</span>'}
      <span class="note">ココナラ電話占いは、初回は最大30分無料で試せます（条件は公式サイトでご確認ください）。</span>
    </div>
    <div class="copy-row"><button class="btn-ghost" type="button" id="copy">結果をコピーしてシェア</button><button class="btn-ghost" type="button" id="again">もう一度占う</button><span class="note" id="copied" aria-live="polite"></span></div>`;
  $('copy').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(lastText); $('copied').textContent = 'コピーしました。SNSに貼り付けてシェアできます。'; }
    catch (e) { $('copied').textContent = 'この画面ではコピーできませんでした。結果を長押しして選択してください。'; }
  });
  $('again').addEventListener('click', () => { $('form').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }); });
  return true;
}

/* ---------- 生年月日のクリック選択パネル ---------- */
const MIN_Y = 1930, MAX_Y = 2010, WD = ['日','月','火','水','木','金','土'];
const pickers = {};
const pad = n => String(n).padStart(2, '0');
function labelOf(iso) { const [y, m, d] = iso.split('-').map(Number); return `${y}年${m}月${d}日（${WD[new Date(y, m - 1, d).getDay()]}）`; }
function setDate(k, iso) {
  $(k + '-date').value = iso;
  const dv = $(k + '-date-btn').querySelector('.dv');
  dv.textContent = iso ? labelOf(iso) : 'クリックして選ぶ';
  dv.classList.toggle('empty', !iso);
}
function openPicker(k) {
  for (const o of Object.keys(pickers)) if (o !== k && pickers[o].open) closePicker(o);
  const v = $(k + '-date').value;
  const st = pickers[k];
  if (v) { const [y, m] = v.split('-').map(Number); Object.assign(st, { step: 'day', decade: Math.floor(y / 10) * 10, year: y, month: m }); }
  else Object.assign(st, { step: 'decade', decade: null, year: null, month: null });
  st.open = true;
  $(k + '-picker').hidden = false;
  $(k + '-date-btn').setAttribute('aria-expanded', 'true');
  drawPicker(k, true);
}
function closePicker(k, focusBack) {
  pickers[k].open = false;
  $(k + '-picker').hidden = true;
  $(k + '-date-btn').setAttribute('aria-expanded', 'false');
  if (focusBack) $(k + '-date-btn').focus();
}
function drawPicker(k, focusFirst) {
  const st = pickers[k], el = $(k + '-picker'), cur = $(k + '-date').value;
  const steps = [['decade', '年代', true], ['year', st.decade ? `${st.decade}年代` : '年', !!st.decade], ['month', st.year ? `${st.year}年` : '月', !!st.year], ['day', st.month ? `${st.month}月` : '日', !!st.month]];
  let h = `<div class="pk-steps">${steps.map(([s, t, ok], i) => `${i ? '<span class="sep">›</span>' : ''}<button type="button" data-step="${s}" ${ok ? '' : 'disabled'} ${st.step === s ? 'aria-current="step"' : ''}>${t}</button>`).join('')}</div>`;
  if (st.step === 'decade') {
    h += `<div class="pk-title">生まれた年代は？</div><div class="pk-grid c3">`;
    for (let d = 1930; d <= 2010; d += 10) h += `<button type="button" data-decade="${d}" class="${st.decade === d ? 'sel' : ''}">${d}年代</button>`;
    h += '</div>';
  } else if (st.step === 'year') {
    h += `<div class="pk-title">${st.decade}年代の何年？</div><div class="pk-grid c4">`;
    for (let y = st.decade; y < st.decade + 10 && y <= MAX_Y; y++) h += `<button type="button" data-year="${y}" class="${st.year === y ? 'sel' : ''}">${y}</button>`;
    h += '</div>';
  } else if (st.step === 'month') {
    h += `<div class="pk-title">${st.year}年の何月？</div><div class="pk-grid c4">`;
    for (let m = 1; m <= 12; m++) h += `<button type="button" data-month="${m}" class="${st.month === m ? 'sel' : ''}">${m}月</button>`;
    h += '</div>';
  } else {
    const y = st.year, m = st.month, days = new Date(y, m, 0).getDate(), off = new Date(y, m - 1, 1).getDay();
    const prevOk = !(y === MIN_Y && m === 1), nextOk = !(y === MAX_Y && m === 12);
    h += `<div class="pk-title"><span>${y}年${m}月</span><span class="pk-nav"><button type="button" data-shift="-1" aria-label="前の月" ${prevOk ? '' : 'disabled'}>‹</button><button type="button" data-shift="1" aria-label="次の月" ${nextOk ? '' : 'disabled'}>›</button></span></div><div class="pk-grid c7">`;
    h += WD.map((w, i) => `<span class="wd${i === 0 ? ' sun' : i === 6 ? ' sat' : ''}">${w}</span>`).join('');
    for (let i = 0; i < off; i++) h += '<span></span>';
    for (let d = 1; d <= days; d++) {
      const iso = `${y}-${pad(m)}-${pad(d)}`, wd = (off + d - 1) % 7;
      h += `<button type="button" data-day="${iso}" class="${cur === iso ? 'sel ' : ''}${wd === 0 ? 'sun' : wd === 6 ? 'sat' : ''}" aria-label="${labelOf(iso)}">${d}</button>`;
    }
    h += '</div>';
  }
  el.innerHTML = h;
  if (focusFirst !== false) { const f = el.querySelector('.pk-grid button.sel') || el.querySelector('.pk-grid button'); f && f.focus({ preventScroll: true }); }
}
for (const k of ['a', 'b']) {
  pickers[k] = { open: false };
  $(k + '-date-btn').addEventListener('click', () => pickers[k].open ? closePicker(k) : openPicker(k));
  $(k + '-picker').addEventListener('click', e => {
    e.stopPropagation();
    const b = e.target.closest('button'); if (!b || b.disabled) return;
    const st = pickers[k];
    if (b.dataset.step) st.step = b.dataset.step;
    else if (b.dataset.decade) { st.decade = +b.dataset.decade; st.step = 'year'; if (st.year && Math.floor(st.year / 10) * 10 !== st.decade) { st.year = null; st.month = null; } }
    else if (b.dataset.year) { st.year = +b.dataset.year; st.step = 'month'; }
    else if (b.dataset.month) { st.month = +b.dataset.month; st.step = 'day'; }
    else if (b.dataset.shift) { let m = st.month + +b.dataset.shift, y = st.year; if (m < 1) { m = 12; y--; } if (m > 12) { m = 1; y++; } Object.assign(st, { year: y, month: m, decade: Math.floor(y / 10) * 10 }); }
    else if (b.dataset.day) { setDate(k, b.dataset.day); $('err').textContent = ''; closePicker(k, true); return; }
    drawPicker(k);
  });
  $(k + '-picker').addEventListener('keydown', e => { if (e.key === 'Escape') { e.preventDefault(); closePicker(k, true); } });
}
document.addEventListener('click', e => { for (const k of ['a', 'b']) if (pickers[k].open && !e.target.closest(`#${k}-picker, #${k}-date-btn`)) closePicker(k); });

/* ---------- 生まれた時間の選択パネル ---------- */
const HOUR_RANGE = ['23時〜1時','1時〜3時','3時〜5時','5時〜7時','7時〜9時','9時〜11時','11時〜13時','13時〜15時','15時〜17時','17時〜19時','19時〜21時','21時〜23時'];
const hopen = { a: false, b: false };
function setHour(k, v) {
  $(k + '-hour').value = v;
  $(k + '-hour-btn').querySelector('.dv').textContent = v === '' ? 'わからない' : `${HOUR_RANGE[+v]}（${BRANCHES[+v]}の刻）`;
}
function drawHour(k) {
  const cur = $(k + '-hour').value;
  let h = '<div class="pk-title">生まれた時間は？</div><div class="pk-grid c3 hours">';
  for (let i = 0; i < 12; i++) h += `<button type="button" data-hour="${i}" class="${cur === String(i) ? 'sel' : ''}" aria-label="${HOUR_RANGE[i]}（${BRANCHES[i]}の刻）"><b>${BRANCHES[i]}</b><small>${HOUR_RANGE[i]}</small></button>`;
  h += `</div><button type="button" class="pk-unknown${cur === '' ? ' sel' : ''}" data-hour="">わからない</button>`;
  const el = $(k + '-hpicker'); el.innerHTML = h;
  (el.querySelector('button.sel') || el.querySelector('button')).focus({ preventScroll: true });
}
function closeHour(k, focusBack) { hopen[k] = false; $(k + '-hpicker').hidden = true; $(k + '-hour-btn').setAttribute('aria-expanded', 'false'); if (focusBack) $(k + '-hour-btn').focus(); }
function openHour(k) {
  for (const o of ['a', 'b']) { if (pickers[o].open) closePicker(o); if (o !== k && hopen[o]) closeHour(o); }
  hopen[k] = true; $(k + '-hpicker').hidden = false; $(k + '-hour-btn').setAttribute('aria-expanded', 'true'); drawHour(k);
}
for (const k of ['a', 'b']) {
  $(k + '-hour-btn').addEventListener('click', e => { e.stopPropagation(); hopen[k] ? closeHour(k) : openHour(k); });
  $(k + '-date-btn').addEventListener('click', () => { for (const o of ['a', 'b']) if (hopen[o]) closeHour(o); });
  $(k + '-hpicker').addEventListener('click', e => { e.stopPropagation(); const b = e.target.closest('button[data-hour]'); if (!b) return; setHour(k, b.dataset.hour); closeHour(k, true); });
  $(k + '-hpicker').addEventListener('keydown', e => { if (e.key === 'Escape') { e.preventDefault(); closeHour(k, true); } });
}
document.addEventListener('click', e => { for (const k of ['a', 'b']) if (hopen[k] && !e.target.closest(`#${k}-hpicker, #${k}-hour-btn`)) closeHour(k); });
let busy = false;
$('form').addEventListener('submit', e => {
  e.preventDefault();
  if (busy) return;
  if (!$('a-date').value || !$('b-date').value) { $('err').textContent = !$('a-date').value && !$('b-date').value ? 'ふたりの生年月日を選んでください。' : !$('a-date').value ? 'あなたの生年月日を選んでください。' : 'お相手の生年月日を選んでください。'; return; }
  $('err').textContent = '';
  busy = true;
  $('result').innerHTML = '<div class="loader frame" role="status"><span class="ring"><i></i></span><p>ふたりの四柱を読み解いています</p></div>';
  $('result').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  setTimeout(() => { render(); busy = false; $('result').scrollIntoView({ behavior: 'auto', block: 'start' }); }, reduce ? 0 : 1600);
});


setDate('a', ''); setDate('b', ''); setHour('a', ''); setHour('b', '');
