// OGP画像（1200x630 JPEG）を記事ごとに作るスクリプト。
// 使い方：node tools/make-og.mjs   （Playwright が入っている環境で実行）
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const dir = path.join(root, 'src/content/articles');
const out = path.join(root, 'public/og');
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

function card(title, label) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
  body{margin:0;width:1200px;height:630px;background:radial-gradient(ellipse at 70% 20%,#2a2234 0%,#0b0a0e 70%);font-family:"Noto Serif CJK JP",serif;color:#EEE7D7;position:relative;overflow:hidden}
  .frame{position:absolute;inset:28px;border:2px solid rgba(201,165,92,.55)}
  .frame2{position:absolute;inset:40px;border:1px solid rgba(201,165,92,.25)}
  .label{position:absolute;left:96px;top:92px;font-family:"Noto Sans CJK JP",sans-serif;font-size:28px;color:#C9A55C;letter-spacing:.12em}
  .title{position:absolute;left:96px;right:96px;top:165px;bottom:150px;display:flex;align-items:center;font-size:var(--fs);font-weight:700;line-height:1.38}
  .brand{position:absolute;left:96px;bottom:84px;display:flex;align-items:center;gap:18px;font-size:30px;color:#D4B26C}
  .mark{width:58px;height:58px;border-radius:50%;border:2px solid #D4B26C;display:flex;align-items:center;justify-content:center;font-size:32px;font-weight:700}
  .url{position:absolute;right:96px;bottom:92px;font-family:"Noto Sans CJK JP",sans-serif;font-size:22px;color:#A9A190}
  .moon{position:absolute;right:110px;top:62px;width:64px;height:64px;border-radius:50%;box-shadow:-18px 10px 0 0 #E9D39C;transform:rotate(-20deg)}
  </style></head><body><div class="frame"></div><div class="frame2"></div><div class="moon"></div>
  <div class="label">${esc(label)}</div><div class="title" style="--fs:${title.length > 44 ? 48 : title.length > 32 ? 54 : 60}px"><div>${esc(title)}</div></div>
  <div class="brand"><div class="mark">合</div>ソウルのサジュ恋愛相性占い</div><div class="url">saju-aisho.com</div></body></html>`;
}

const items = [{ slug: '_default', title: '韓国の四柱推命「サジュ」で、ふたりの恋愛相性を無料診断', label: '韓国式 恋愛相性占い' }];
for (const f of fs.readdirSync(dir).filter((f) => f.endsWith('.md'))) {
  const src = fs.readFileSync(path.join(dir, f), 'utf8');
  const fm = src.split('---')[1] || '';
  if (/^draft:\s*true/m.test(fm)) continue;
  const title = (fm.match(/^title:\s*(.+)$/m) || [])[1];
  const cat = (fm.match(/^category:\s*(.+)$/m) || [])[1] || 'コラム';
  if (title) items.push({ slug: f.replace(/\.md$/, ''), title: title.trim(), label: cat.trim() });
}
const only = process.argv[2];
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
for (const it of items) {
  if (only && it.slug !== only) continue;
  await page.setContent(card(it.title, it.label));
  await page.screenshot({ path: path.join(out, `${it.slug}.jpg`), type: 'jpeg', quality: 82 });
  console.log('og:', it.slug);
}
await browser.close();
