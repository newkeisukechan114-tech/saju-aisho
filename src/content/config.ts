import { defineCollection, z } from 'astro:content';
import { CATEGORIES } from '../data/site';

const articles = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(CATEGORIES),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    pr: z.boolean().default(false), // 広告リンクを含む記事は true → 先頭に「PR」表示
    draft: z.boolean().default(false), // true の間は公開されない
  }),
});

export const collections = { articles };
