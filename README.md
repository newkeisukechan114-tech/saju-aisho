# ソウルのサジュ恋愛相性占い

Astro 4.16.18 の静的サイト。Cloudflare（Workers Builds）で公開します。

## よく使うコマンド
- `npm install` … 最初の1回
- `npm run dev` … 手元で確認（http://localhost:4321）
- `npm run build` … 公開用ファイルを `dist/` に作る

## 設定を変える場所
- `src/data/site.ts` … サイト名・運営者名・お問い合わせフォーム・SNS・広告リンク
- `astro.config.mjs` と `public/robots.txt` … ドメイン（`https://saju-aisho.com` を取得したドメインに）

## 記事の追加
1. `src/content/articles/〇〇.md` を作る（ファイル名がURLになります）
2. 先頭に title / description / category / publishedAt / pr / draft を書く
3. 下書きの間は `draft: true`。公開するときに `draft: false` にして commit → push
4. 広告リンクを含む記事は `pr: true`（先頭に「PR」表示、記事の下に案内が出ます）

カテゴリ：サジュの基本 / 日主 / 相性 / 恋愛の悩み / 電話占い / 年運

## ページ
- `/` トップ、`/shindan/` 相性診断、`/nisshu/` 10の日主、`/guide/` はじめての電話占い
- `/articles/` コラム一覧、`/articles/〇〇/` 記事
- `/about/` 運営者情報、`/privacy/` プライバシーポリシー、`/contact/` お問い合わせ

## 注意
- 公開リポジトリに、個人情報・パスワード・トークン・非公開の計画を入れない
- 相性診断の月柱・年柱の切り替わり（節入り）は概算日で計算しています
