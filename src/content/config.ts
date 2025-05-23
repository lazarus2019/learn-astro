import { defineCollection, z } from 'astro:content';
import { CarSchema } from './schema';

const carCollections = defineCollection({
  type: 'content', // data | content | content_layer
  schema: ({ image }) =>
    z.object({
      name: z.string().max(50, {
        message: 'Name must below 50 characters',
      }),
      price: z.number(),
      color: z.string(),
      brand: z.string(),
      category: z.enum([
        'Automotive',
        'Home & Garden',
        'Fashion',
        'Electronics',
        'Toys',
      ]),
      thumbnail: image(),
    }),
});

// Export a single `collections` object to register collection(s)
export const collections = {
  product: carCollections,
};
