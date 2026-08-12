import { z } from "zod";

export const registerSmallGroupSessionSchema = z.object({
	sessionId: z.string().min(1, "Identifiant de séance requis"),
});

export const unregisterSmallGroupSessionSchema =
	registerSmallGroupSessionSchema;

export type RegisterSmallGroupSessionInput = z.infer<
	typeof registerSmallGroupSessionSchema
>;

export type UnregisterSmallGroupSessionInput = z.infer<
	typeof unregisterSmallGroupSessionSchema
>;
