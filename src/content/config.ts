import { defineCollection } from "astro:content";
import { CarSchema } from "./schema";

const carCollections = defineCollection({
	type: "content", // data | content | content_layer
	schema: CarSchema,
});

// Export a single `collections` object to register collection(s)
export const collections = {
	product: carCollections,
};
