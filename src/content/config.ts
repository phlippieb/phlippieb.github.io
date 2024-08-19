import { z, defineCollection } from 'astro:content';

const blogCollection = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        published: z.date(),
        excerpt: z.string(),
        tags: z.array(z.string()),
        listed: z.boolean(),
    }),
});

const packagesCollection = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        description: z.string(),
        url: z.string().url(),
        number: z.number(),
    }),
});

const projectsCollection = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        description: z.string(),
        url: z.string().url(),
        number: z.number(),
    }),
});

const feedCollection = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        date: z.date(),
        tags: z.array(z.string()),
        excerpt: z.string(),
    }),
})

const talksCollection = defineCollection({
    type: 'content',
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
