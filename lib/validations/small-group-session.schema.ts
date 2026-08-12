import { z } from "zod";

export const smallGroupRecurrenceSchema = z.object({
	enabled: z.literal(true),
	numberOfWeeks: z.coerce
		.number()
		.int("Le nombre de semaines doit être un entier")
		.min(1, "Le nombre de semaines doit être supérieur à 0"),
	selectedDays: z
		.array(z.number().int().min(0).max(6))
		.min(1, "Au moins un jour doit être sélectionné"),
});

const smallGroupSessionBaseSchema = z.object({
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

export const createSmallGroupSessionSchema = smallGroupSessionBaseSchema
	.extend({
		recurrence: smallGroupRecurrenceSchema.optional(),
	})
	.superRefine((data, context) => {
		if (!data.recurrence?.enabled) {
			return;
		}

		if (data.recurrence.numberOfWeeks < 1) {
			context.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Le nombre de semaines doit être supérieur à 0",
				path: ["recurrence", "numberOfWeeks"],
			});
		}

		if (data.recurrence.selectedDays.length === 0) {
			context.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Au moins un jour de la semaine doit être sélectionné",
				path: ["recurrence", "selectedDays"],
			});
		}
	});

export const updateSmallGroupSessionSchema = smallGroupSessionBaseSchema.extend(
	{
		sessionId: z.string().min(1, "Identifiant de séance requis"),
	},
);

export const deleteSmallGroupSessionSchema = z.object({
	sessionId: z.string().min(1, "Identifiant de séance requis"),
});

export type CreateSmallGroupSessionInput = z.infer<
	typeof createSmallGroupSessionSchema
>;

export type UpdateSmallGroupSessionInput = z.infer<
	typeof updateSmallGroupSessionSchema
>;
