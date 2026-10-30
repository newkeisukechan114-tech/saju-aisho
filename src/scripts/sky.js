// 背景：星・金の粒子・十干十二支の円環
const cv = document.getElementById('sky'), cx = cv.getContext('2d');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
let W = 0, H = 0, DPR = 1, stars = [], dust = [], shoot = null, nextShoot = 4;
const BR = '子丑寅卯辰巳午未申酉戌亥', ST = '甲乙丙丁戊己庚辛壬癸';
function resize() {
  DPR = Math.min(2, window.devicePixelRatio || 1);
  W = innerWidth; H = innerHeight;
  cv.width = W * DPR; cv.height = H * DPR; cx.setTransform(DPR, 0, 0, DPR, 0, 0);
  const n = Math.round(Math.min(220, W * H / 7000));
  stars = Array.from({ length: n }, () => ({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.1 + .2, p: Math.random() * 6.28, s: .4 + Math.random() * 1.4 }));
  dust = Array.from({ length: Math.round(n / 4) }, () => newDust(true));
}
function newDust(any) { return { x: Math.random() * W, y: any ? Math.random() * H : H + 10, r: Math.random() * 1.8 + .6, v: .08 + Math.random() * .25, w: Math.random() * 6.28, a: .25 + Math.random() * .5 }; }
function frame(t) {
  const s = t / 1000;
  cx.clearRect(0, 0, W, H);
  // 星雲
  const neb = [[.2 + .05 * Math.sin(s * .05), .25 + .04 * Math.cos(s * .04), 'rgba(70,40,90,.22)'], [.8 + .04 * Math.cos(s * .03), .7 + .05 * Math.sin(s * .05), 'rgba(30,45,90,.22)'], [.6 + .05 * Math.sin(s * .02), .2, 'rgba(120,90,30,.10)']];
  for (const [nx, ny, c] of neb) {
    const g = cx.createRadialGradient(nx * W, ny * H, 0, nx * W, ny * H, Math.max(W, H) * .55);
    g.addColorStop(0, c); g.addColorStop(1, 'rgba(0,0,0,0)'); cx.fillStyle = g; cx.fillRect(0, 0, W, H);
  }
  // 星
  for (const st of stars) {
    const a = .25 + .55 * (0.5 + 0.5 * Math.sin(s * st.s + st.p));
    cx.fillStyle = `rgba(238,231,215,${a})`; cx.beginPath(); cx.arc(st.x, st.y, st.r, 0, 6.283); cx.fill();
  }
  // 円環
  const R = Math.min(W, H) * .46, ox = W * .5, oy = H * .52, rot = s * .018;
  cx.save(); cx.translate(ox, oy);
  cx.strokeStyle = 'rgba(201,165,92,.13)'; cx.lineWidth = 1;
  for (const rr of [R, R * .985, R * .78, R * .6]) { cx.beginPath(); cx.arc(0, 0, rr, 0, 6.283); cx.stroke(); }
  cx.save(); cx.rotate(rot);
  cx.fillStyle = 'rgba(201,165,92,.20)'; cx.font = `${Math.max(12, R * .07)}px "Shippori Mincho", serif`; cx.textAlign = 'center'; cx.textBaseline = 'middle';
  for (let i = 0; i < 12; i++) { const a = i / 12 * 6.283; cx.save(); cx.rotate(a); cx.fillText(BR[i], 0, -R * .885); cx.restore(); cx.beginPath(); cx.moveTo(Math.sin(a + .26) * R * .78, -Math.cos(a + .26) * R * .78); cx.lineTo(Math.sin(a + .26) * R * .985, -Math.cos(a + .26) * R * .985); cx.stroke(); }
  cx.restore();
  cx.save(); cx.rotate(-rot * 1.4);
  cx.fillStyle = 'rgba(201,165,92,.15)'; cx.font = `${Math.max(11, R * .055)}px "Shippori Mincho", serif`; cx.textAlign = 'center'; cx.textBaseline = 'middle';
  for (let i = 0; i < 10; i++) { cx.save(); cx.rotate(i / 10 * 6.283); cx.fillText(ST[i], 0, -R * .69); cx.restore(); }
  // 中心の星形（五行の相剋線）
  cx.strokeStyle = 'rgba(201,165,92,.09)'; cx.beginPath();
  for (let i = 0; i <= 5; i++) { const a = (i * 2 % 5) / 5 * 6.283; const px = Math.sin(a) * R * .6, py = -Math.cos(a) * R * .6; i ? cx.lineTo(px, py) : cx.moveTo(px, py); }
  cx.stroke(); cx.restore();
  cx.restore();
  // 金の粒子
  for (const d of dust) {
    d.y -= d.v; d.x += Math.sin(s * .5 + d.w) * .15;
    if (d.y < -10) Object.assign(d, newDust(false));
    const g = cx.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.r * 4);
    g.addColorStop(0, `rgba(233,211,156,${d.a})`); g.addColorStop(1, 'rgba(233,211,156,0)');
    cx.fillStyle = g; cx.beginPath(); cx.arc(d.x, d.y, d.r * 4, 0, 6.283); cx.fill();
  }
  // 流れ星
  if (!shoot && s > nextShoot) { shoot = { x: Math.random() * W * .7 + W * .2, y: Math.random() * H * .35, t0: s }; nextShoot = s + 7 + Math.random() * 8; }
  if (shoot) {
    const k = (s - shoot.t0) / 1.1;
    if (k > 1) shoot = null; else {
      const hx = shoot.x - k * 260, hy = shoot.y + k * 130, alpha = Math.sin(k * Math.PI) * .8;
      const g = cx.createLinearGradient(hx, hy, hx + 90, hy - 45);
      g.addColorStop(0, `rgba(244,228,182,${alpha})`); g.addColorStop(1, 'rgba(244,228,182,0)');
      cx.strokeStyle = g; cx.lineWidth = 1.3; cx.beginPath(); cx.moveTo(hx, hy); cx.lineTo(hx + 90, hy - 45); cx.stroke();
    }
  }
}
function loop(t) { if (!document.hidden) frame(t); requestAnimationFrame(loop); }
resize(); addEventListener('resize', resize);
if (reduce) { frame(0); addEventListener('resize', () => frame(0)); } else requestAnimationFrame(loop);
document.fonts && document.fonts.ready.then(() => reduce && frame(0));
