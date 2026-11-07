// サジュ（四柱）の計算と、四柱・五行の表示部品（相性診断・個人鑑定で共通）
import { STEMS, STEM_KO, BRANCHES, BRANCH_KO, EL, EL_VAR, stemEl, BRANCH_EL } from '../data/saju-data.js';
export const mod = (a, n) => ((a % n) + n) % n;
function jdn(y, m, d) {
  const a = Math.floor((14 - m) / 12), yy = y + 4800 - a, mm = m + 12 * a - 3;
  return d + Math.floor((153 * mm + 2) / 5) + 365 * yy + Math.floor(yy / 4) - Math.floor(yy / 100) + Math.floor(yy / 400) - 32045;
}
// 節入りの概算日（月, 日, 寅月を0とした順番）
const TERMS = [[1,6,11],[2,4,0],[3,6,1],[4,5,2],[5,6,3],[6,6,4],[7,7,5],[8,8,6],[9,8,7],[10,8,8],[11,7,9],[12,7,10]];
export function saju(y, m, d, hour) {
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
// 日主（me）から見た、ほかの天干（other）の十神
export function tengod(me, other) {
  const a = stemEl(me), b = stemEl(other), same = me % 2 === other % 2;
  if (a === b) return same ? '比肩' : '劫財';
  if ((a + 1) % 5 === b) return same ? '食神' : '傷官';
  if ((a + 2) % 5 === b) return same ? '偏財' : '正財';
  if ((b + 2) % 5 === a) return same ? '偏官' : '正官';
  return same ? '偏印' : '正印';
}
export const CORNERS = '<i class="corner tl"></i><i class="corner tr"></i><i class="corner bl"></i><i class="corner br"></i>';
export function pillarHTML(p) {
  const cols = [['時柱', p.hour], ['日柱', p.day], ['月柱', p.month], ['年柱', p.year]];
  return `<div class="pillars">${cols.map(([l, c], i) => c
    ? `<div class="pillar${i === 1 ? ' day' : ''}"><div class="lbl">${l}</div><div class="ch">${STEMS[c.s]}</div><div class="ko">${STEM_KO[c.s]}</div><div class="ch">${BRANCHES[c.b]}</div><div class="ko">${BRANCH_KO[c.b]}</div></div>`
    : `<div class="pillar"><div class="lbl">${l}</div><div class="unk">時間<br>不明</div></div>`).join('')}</div>`;
}
export function barsHTML(count) {
  const max = Math.max(...count, 1);
  return `<div class="bars">${count.map((n, i) => `<div class="bar"><span>${EL[i]}</span><span class="track"><span class="fill" style="width:${n / max * 100}%;background:var(${EL_VAR[i]})"></span></span><span class="n">${n}</span></div>`).join('')}</div>`;
}
