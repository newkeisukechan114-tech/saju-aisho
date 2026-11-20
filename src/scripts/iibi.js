// 個人占いの結果：今月の「いい日」カレンダー（日主と、その日の天干の関係から出す目安）
import { saju, tengod } from './saju-calc.js';
const KIND = {
  gou: ['★', 'ご縁の日', '連絡・告白・大事な約束に'],
  tell: ['♡', '伝える日', '気持ちを言葉にする・発信に'],
  rest: ['☾', '休む日', 'ひと休み・学び・ひとり時間に'],
};
function kindOf(me, ds) {
  if (ds === (me + 5) % 10) return 'gou';
  const g = tengod(me, ds);
  if (g === '食神' || g === '傷官') return 'tell';
  if (g === '正印' || g === '偏印') return 'rest';
  return '';
}
export function iibiHTML() {
  return `<div class="iibi frame" id="iibi">
    <h3>今月の「いい日」カレンダー</h3>
    <p class="iibi-lead">あなたの日主と、その日の干支の関係から出した目安です。予定を決めるときの、ちょっとした後押しにどうぞ。</p>
    <div class="iibi-nav"><button type="button" id="iibi-prev" aria-label="前の月">‹</button><b id="iibi-title"></b><button type="button" id="iibi-next" aria-label="次の月">›</button></div>
    <div class="iibi-best" id="iibi-best"></div>
    <div class="iibi-cal" id="iibi-cal" role="grid"></div>
    <ul class="iibi-legend">${Object.values(KIND).map(([m, n, t]) => `<li><span class="iibi-m">${m}</span><b>${n}</b>${t}</li>`).join('')}</ul>
  </div>`;
}
export function initIibi(me) {
  const now = new Date(); let y = now.getFullYear(), m = now.getMonth() + 1;
  const draw = () => {
    document.getElementById('iibi-title').textContent = `${y}年${m}月`;
    const first = new Date(y, m - 1, 1).getDay(), days = new Date(y, m, 0).getDate();
    let h = ['日', '月', '火', '水', '木', '金', '土'].map(w => `<span class="iibi-w">${w}</span>`).join('') + '<span></span>'.repeat(first);
    const gous = [];
    for (let d = 1; d <= days; d++) {
      const k = kindOf(me, saju(y, m, d, null).day.s);
      const isToday = y === now.getFullYear() && m === now.getMonth() + 1 && d === now.getDate();
      const past = new Date(y, m - 1, d) < new Date(now.getFullYear(), now.getMonth(), now.getDate());
      if (k === 'gou' && !past) gous.push(d);
      h += `<span class="iibi-d${k ? ' k-' + k : ''}${isToday ? ' today' : ''}${past ? ' past' : ''}" ${k ? `title="${KIND[k][1]}"` : ''}>${d}${k ? `<i>${KIND[k][0]}</i>` : ''}</span>`;
    }
    document.getElementById('iibi-cal').innerHTML = h;
    document.getElementById('iibi-best').innerHTML = gous.length
      ? `この月のご縁の日（★）は <b>${gous.map(d => `${m}月${d}日`).join('・')}</b> です。`
      : 'この月は、これから来るご縁の日（★）がありません。♡の日に気持ちを伝えてみましょう。';
  };
  document.getElementById('iibi-prev').addEventListener('click', () => { if (--m < 1) { m = 12; y--; } draw(); });
  document.getElementById('iibi-next').addEventListener('click', () => { if (++m > 12) { m = 1; y++; } draw(); });
  draw();
}
