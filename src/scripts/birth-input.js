// 生年月日・生まれた時間の選択パネル（相性診断・個人鑑定で共通）
import { BRANCHES } from '../data/saju-data.js';
const $ = id => document.getElementById(id);
export function initBirthInputs(KEYS, onPick) {
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
  for (const k of KEYS) {
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
      else if (b.dataset.day) { setDate(k, b.dataset.day); onPick && onPick(); closePicker(k, true); return; }
      drawPicker(k);
    });
    $(k + '-picker').addEventListener('keydown', e => { if (e.key === 'Escape') { e.preventDefault(); closePicker(k, true); } });
  }
  document.addEventListener('click', e => { for (const k of KEYS) if (pickers[k].open && !e.target.closest(`#${k}-picker, #${k}-date-btn`)) closePicker(k); });

  /* ---------- 生まれた時間の選択パネル ---------- */
  const HOUR_RANGE = ['23時〜1時','1時〜3時','3時〜5時','5時〜7時','7時〜9時','9時〜11時','11時〜13時','13時〜15時','15時〜17時','17時〜19時','19時〜21時','21時〜23時'];
  const hopen = {};
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
    for (const o of KEYS) { if (pickers[o].open) closePicker(o); if (o !== k && hopen[o]) closeHour(o); }
    hopen[k] = true; $(k + '-hpicker').hidden = false; $(k + '-hour-btn').setAttribute('aria-expanded', 'true'); drawHour(k);
  }
  for (const k of KEYS) {
    $(k + '-hour-btn').addEventListener('click', e => { e.stopPropagation(); hopen[k] ? closeHour(k) : openHour(k); });
    $(k + '-date-btn').addEventListener('click', () => { for (const o of KEYS) if (hopen[o]) closeHour(o); });
    $(k + '-hpicker').addEventListener('click', e => { e.stopPropagation(); const b = e.target.closest('button[data-hour]'); if (!b) return; setHour(k, b.dataset.hour); closeHour(k, true); });
    $(k + '-hpicker').addEventListener('keydown', e => { if (e.key === 'Escape') { e.preventDefault(); closeHour(k, true); } });
  }
  document.addEventListener('click', e => { for (const k of KEYS) if (hopen[k] && !e.target.closest(`#${k}-hpicker, #${k}-hour-btn`)) closeHour(k); });
  for (const k of KEYS) { setDate(k, ''); setHour(k, ''); }
}
