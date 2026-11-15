// 占いの結果画面で使う、電話占いの案内（AffiliateCTA.astroと同じ見た目）とシェアボタン
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export function ctaHTML({ aff, px, corners, heading, text, asks = [], asksHead = '相談するときは、こう聞いてみてください' }) {
  const btn = aff
    ? `<a class="btn-cta" href="${aff}" rel="sponsored nofollow noopener" target="_blank">無料クーポンで占い師を探す</a>${px ? `<img class="a8px" src="${px}" width="1" height="1" alt="">` : ''}`
    : '<span class="btn-cta is-disabled">ご案内の準備中です</span>';
  return `<div class="cta frame">${corners}
    <span class="pr">PR</span>
    <h3>${heading}</h3>
    <p>${text}</p>
    ${asks.length ? `<div class="asks"><span class="asks-h">${asksHead}</span><ul>${asks.map(a => `<li>「${a}」</li>`).join('')}</ul></div>` : ''}
    <div class="cta-free">
      <span class="cta-tag">はじめての方限定</span>
      <span class="cta-free-lead">ココナラ電話占いの新規登録で</span>
      <span class="cta-free-main"><small>最大</small><b>30</b><small>分</small><em>無料</em></span>
      <span class="cta-free-cond">※専用ページから新規登録するともらえる3,000円分のクーポンを使った場合。1分100円の占い師なら最大30分、料金の高い占い師ではそれより短くなります。</span>
    </div>
    <ul class="cta-points"><li>24時間いつでも</li><li>アプリなら通話料無料</li></ul>
    ${btn}
    <span class="note">料金や無料の条件は、ココナラ電話占いの公式サイトで最新の情報をご確認ください。</span>
  </div>`;
}

export function shareRowHTML() {
  return `<div class="share-box">
    <p class="share-h">結果をシェアする</p>
    <div class="share-row">
      <a class="share-btn sb-threads" id="sh-threads" target="_blank" rel="noopener">Threads</a>
      <a class="share-btn sb-x" id="sh-x" target="_blank" rel="noopener">X</a>
      <a class="share-btn sb-line" id="sh-line" target="_blank" rel="noopener">LINE</a>
    </div>
    <div class="copy-row"><button class="btn-ghost" type="button" id="save-img">結果を画像で保存</button><button class="btn-ghost" type="button" id="copy">文章をコピー</button><button class="btn-ghost" type="button" id="again">もう一度占う</button><span class="note" id="copied" aria-live="polite"></span></div>
  </div>`;
}

// text：シェアする短い文（URLを含める。生年月日は入れない）
export function initShare(text) {
  const e = encodeURIComponent(text);
  const set = (id, url) => { const a = document.getElementById(id); if (a) a.href = url; };
  set('sh-threads', `https://www.threads.net/intent/post?text=${e}`);
  set('sh-x', `https://twitter.com/intent/tweet?text=${e}`);
  set('sh-line', `https://line.me/R/share?text=${e}`);
}
export { esc };
