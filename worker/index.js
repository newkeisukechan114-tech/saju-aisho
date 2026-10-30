// お問い合わせフォームを受け取り、運営者のメールに送る Worker。
// それ以外のリクエストは、静的サイト（dist）をそのまま返す。
// 届け先のメールアドレスは、リポジトリに書かずに Cloudflare の秘密の変数 CONTACT_TO に入れる。
import { EmailMessage } from 'cloudflare:email';

const FROM = 'form@saju-aisho.com';
const FROM_NAME = 'ソウルのサジュ恋愛相性占い お問い合わせフォーム';
const KINDS = ['サイトへのご意見', '記事の誤りのご指摘', '広告・掲載について', 'その他'];

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/contact') return handleContact(request, env);
    return env.ASSETS.fetch(request);
  },
};

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });

const oneLine = (s) => String(s ?? '').replace(/[\r\n]+/g, ' ').trim();

function b64utf8(str) {
  const bytes = new TextEncoder().encode(str);
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}
const encodeHeader = (s) => `=?UTF-8?B?${b64utf8(s)}?=`;
const wrap76 = (s) => s.replace(/.{1,76}/g, (m) => m + '\r\n');

async function handleContact(request, env) {
  if (request.method !== 'POST') return json({ ok: false, error: 'method' }, 405);
  if (!env.CONTACT_TO || !env.SEB) return json({ ok: false, error: 'not_configured' }, 503);

  let data;
  try { data = await request.json(); } catch { return json({ ok: false, error: 'bad_request' }, 400); }

  // 迷惑メール対策：見えない入力欄に値がある、または入力が速すぎるものは送らない
  const elapsed = Date.now() - Number(data.startedAt || 0);
  if (data.website || !(elapsed > 3000 && elapsed < 24 * 60 * 60 * 1000)) return json({ ok: true });

  const name = oneLine(data.name).slice(0, 50);
  const email = oneLine(data.email).slice(0, 200);
  const kind = KINDS.includes(data.kind) ? data.kind : 'その他';
  const message = String(data.message ?? '').trim();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ ok: false, error: 'email' }, 400);
  if (message.length < 10 || message.length > 2000) return json({ ok: false, error: 'message' }, 400);
  if (data.agree !== true) return json({ ok: false, error: 'agree' }, 400);

  const now = new Date();
  const body = [
    'saju-aisho.com のお問い合わせフォームから届きました。',
    '',
    `種類：${kind}`,
    `お名前：${name || '（未入力）'}`,
    `メール：${email}`,
    `日時：${now.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}`,
    '',
    '--- 内容 ---',
    message,
    '',
    '※このメールに返信すると、送り主のメールアドレスあてに届きます。',
  ].join('\r\n');

  const raw = [
    `From: ${encodeHeader(FROM_NAME)} <${FROM}>`,
    `To: <${env.CONTACT_TO}>`,
    `Reply-To: <${email}>`,
    `Subject: ${encodeHeader(`【お問い合わせ】${kind}`)}`,
    `Date: ${now.toUTCString()}`,
    `Message-ID: <${crypto.randomUUID()}@saju-aisho.com>`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
    '',
    wrap76(b64utf8(body)),
  ].join('\r\n');

  try {
    await env.SEB.send(new EmailMessage(FROM, env.CONTACT_TO, raw));
    return json({ ok: true });
  } catch (e) {
    console.error('send failed', e && e.message);
    return json({ ok: false, error: 'send' }, 502);
  }
}
