// 個人占いの結果：電話占いに持っていく「相談メモ」
// この画面の中だけで作る。保存・送信はしない。
const TOPICS = [
  ['kataomoi', '片思い'], ['koibito', '恋人・夫婦'], ['fukuen', '復縁'], ['shigoto', '仕事・転職'],
  ['okane', 'お金'], ['ningen', '人間関係'], ['rainen', '来年の流れ'],
];
const Q = {
  kataomoi: c => [`片思いの相手がいます。${c.full}の私が、今月（${c.mtg}の時期）にできる、距離を縮める一歩は何ですか？`, '相手の生年月日がわかる場合：ふたりの相性と、連絡しやすい時期を教えてください。'],
  koibito: c => [`恋人（夫・妻）とのすれ違いが気になっています。${c.full}の私が気をつけるといい伝え方はありますか？`, 'ふたりの関係が安定しやすい時期と、避けたほうがいい時期はいつですか？'],
  fukuen: c => ['別れた相手とやり直せる可能性はありますか？', `連絡するなら、いつ頃がいいですか？今月は「${c.mtg}」の星の時期と出ました。`],
  shigoto: c => [`今の仕事を続けるか、変えるか迷っています。2027年（${c.ytg}の年）は動くのに向いていますか？`, `${c.full}の私の強みが生きる働き方を教えてください。`],
  okane: c => ['お金の使い方で、私が気をつけるといいことは何ですか？', `金運が上向く時期はいつですか？少ない五行の「${c.weak}」をどう補うといいですか？`],
  ningen: c => [`職場や友人との関係で悩んでいます。${c.full}の私に合う距離の取り方はありますか？`, '相手の生年月日がわかる場合：その人との相性と、うまく付き合うコツを教えてください。'],
  rainen: c => [`2027年は「${c.ytg}」の年と出ました。月ごとに見て、どの時期に動くといいですか？`, '来年いちばん大切にするといいことは何ですか？'],
};
export function memoHTML() {
  return `<div class="memo frame" id="memo">
    <h3>電話占いに持っていく「相談メモ」</h3>
    <p class="memo-lead">無料の時間を、説明ではなく相談に使うためのメモです。相談したいことを選ぶと、あなたのサジュに合わせた質問ができあがります。この画面の中だけで作り、どこにも保存・送信しません。</p>
    <div class="memo-topics" role="group" aria-label="相談したいこと">${TOPICS.map(([k, l]) => `<label><input type="checkbox" value="${k}"><span>${l}</span></label>`).join('')}</div>
    <label class="memo-free"><span>いまの状況をひと言で（任意）</span><textarea id="memo-free" rows="2" maxlength="200" placeholder="例：3か月前から気になっている職場の先輩がいる"></textarea></label>
    <textarea id="memo-out" class="memo-out" rows="12" readonly aria-label="できあがった相談メモ"></textarea>
    <div class="memo-btns"><button type="button" class="btn" id="memo-copy">メモをコピーする</button><span id="memo-copied" class="memo-copied" aria-live="polite"></span></div>
    <p class="memo-tip">使い方：電話がつながったら、最初に「四柱推命で見てほしいです」と伝えて、このメモを読み上げてから質問すると、話が早く進みます。</p>
  </div>`;
}
export function initMemo(c) {
  const box = document.getElementById('memo'); if (!box) return () => {};
  let type = '';
  const draw = () => {
    let picked = [...box.querySelectorAll('.memo-topics input:checked')].map(i => i.value);
    if (!picked.length) picked = ['rainen'];
    const qs = picked.flatMap(k => Q[k](c)).slice(0, 6);
    const free = document.getElementById('memo-free').value.trim();
    const lines = [
      '【相談メモ】', '■ わたしのサジュ',
      `・生年月日：${c.birth}（生まれた時間：${c.hour}）`,
      `・日主：${c.full}（${c.name}タイプ）`,
      `・今月の星：${c.mtg}　／　2027年の星：${c.ytg}`,
      `・強い五行：${c.strong}　／　少ない五行：${c.weak}`,
      ...(type ? [`・MBTI：${type}`] : []),
      ...(free ? ['', '■ いまの状況', free] : []),
      '', '■ 聞きたいこと', ...qs.map((q, i) => `${i + 1}. ${q}`),
    ];
    document.getElementById('memo-out').value = lines.join('\n');
  };
  box.addEventListener('change', draw);
  document.getElementById('memo-free').addEventListener('input', draw);
  document.getElementById('memo-copy').addEventListener('click', async () => {
    const t = document.getElementById('memo-out').value, msg = document.getElementById('memo-copied');
    try { await navigator.clipboard.writeText(t); msg.textContent = 'コピーしました。スマホのメモ帳に貼って、電話のときに見てください。'; }
    catch (e) { document.getElementById('memo-out').select(); msg.textContent = '選択しました。長押しでコピーしてください。'; }
  });
  draw();
  return t => { type = t; draw(); };
}
