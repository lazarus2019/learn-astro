import { defineCollection, z } from 'astro:content';
import { CarSchema } from './schema';

const carCollections = defineCollection({
  type: 'content', // data | content | content_layer
  schema: CarSchema,
});

const postCollection = defineCollection({
  type: 'content',
  schema: ({ image }) => {
    z.object({
      title: z.string(),
      cover: image(),
      coverAlt: z.string(),
    });
  },
});

// Export a single `collections` object to register collection(s)
export const collections = {
  product: carCollections,
  post: postCollection,
};
