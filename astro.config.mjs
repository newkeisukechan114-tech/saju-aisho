import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// ドメインを取得したら site を書き換えてください（sitemap と canonical に使われます）
export default defineConfig({
  site: 'https://saju-aisho.com',
  integrations: [sitemap()],
  trailingSlash: 'ignore',
});
