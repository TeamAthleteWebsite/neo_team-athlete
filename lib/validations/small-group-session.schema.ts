import { z } from "zod";

export const createSmallGroupSessionSchema = z.object({
	date: z.string().min(1, "La date est requise"),
	time: z
		.string()
		.regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "L'heure doit être au format HH:MM"),
	location: z.string().min(2, "Le lieu est requis").max(200),
	description: z.string().min(2, "La description est requise").max(2000),
	maxCapacity: z.coerce
		.number()
		.int("La capacité doit être un nombre entier")
		.min(1, "La capacité minimale est de 1 participant")
		.max(100, "La capacité maximale est de 100 participants"),
});

export type CreateSmallGroupSessionInput = z.infer<
	typeof createSmallGroupSessionSchema
>;
