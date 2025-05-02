import { z } from 'astro/zod';

export const CarSchema = z.object({
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
});
