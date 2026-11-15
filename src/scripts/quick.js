// トップ：生年月日だけで、その場で日主を表示（保存・URL送信なし）
import { initBirthInputs } from './birth-input.js';
import { saju } from './saju-calc.js';
import { STEMS, STEM_KO, EL, stemEl, STEM_INFO, STEM_SLUG, STEM_FULL } from '../data/saju-data.js';
const $ = id => document.getElementById(id);
function show() {
  const v = $('q-date').value; if (!v) return;
  const [y, m, d] = v.split('-').map(Number);
  const s = saju(y, m, d, null).day.s;
  const card = $('q-card');
  $('q-result').innerHTML = `
    <span class="qc-en">${STEM_KO[s]} · ${s % 2 ? '陰' : '陽'}の${EL[stemEl(s)]}</span>
    <b class="qc-stem gold-text">${STEMS[s]}</b>
    <span class="qc-name">あなたは<strong>${STEM_FULL[s]}</strong>（${STEM_INFO[s][0]}タイプ）</span>
    <p>${STEM_INFO[s][1]}</p>
    <div class="qc-links">
      <a class="btn" href="/articles/${STEM_SLUG[s]}/">${STEM_FULL[s]}の性格・恋愛を読む</a>
      <a class="qc-more" href="/kojin/">生まれた時間も入れて、くわしく占う →</a>
    </div>`;
  card.classList.remove('flip'); void card.offsetWidth; card.classList.add('flip', 'done');
}
initBirthInputs(['q'], show);
