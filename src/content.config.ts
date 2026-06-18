import { z, defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

const blogCollection = defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
    schema: z.object({
        title: z.string(),
        published: z.date(),
        excerpt: z.string(),
        tags: z.array(z.string()),
        listed: z.boolean(),
    }),
});

const packagesCollection = defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/packages' }),
    schema: z.object({
        title: z.string(),
        description: z.string(),
        url: z.string().url(),
        number: z.number(),
    }),
});

const projectsCollection = defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
    schema: z.object({
        title: z.string(),
        description: z.string(),
        url: z.string().url(),
        number: z.number(),
    }),
});

const feedCollection = defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/feed' }),
    schema: z.object({
        title: z.string(),
        date: z.date(),
        tags: z.array(z.string()),
        excerpt: z.string(),
    }),
})

const talksCollection = defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/talks' }),
    schema: z.object({
        title: z.string(),
        description: z.string(),
        date: z.date(),
        url: z.string().url(),
    }),
})

export const collections = {
  'blog': blogCollection,
  'packages': packagesCollection,
  'projects': projectsCollection,
  'feed': feedCollection,
  'talks': talksCollection,
};
