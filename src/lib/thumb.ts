// 記事一覧のサムネイル：本文の最初のイラスト → 専用サムネイル → OG画像 の順に使う
import fs from 'node:fs';
export function thumbOf(entry: { slug: string; body: string }): string | null {
  const m = entry.body.match(/\/images\/articles\/[A-Za-z0-9_.-]+\.svg/);
  if (m) return m[0];
  if (fs.existsSync(`public/images/thumbs/${entry.slug}.svg`)) return `/images/thumbs/${entry.slug}.svg`;
  if (fs.existsSync(`public/og/${entry.slug}.jpg`)) return `/og/${entry.slug}.jpg`;
  return null;
}
