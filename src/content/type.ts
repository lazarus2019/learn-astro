import type { z } from "astro/zod";
import type { CarSchema } from "./schema";

export type Car = z.infer<typeof CarSchema>;
