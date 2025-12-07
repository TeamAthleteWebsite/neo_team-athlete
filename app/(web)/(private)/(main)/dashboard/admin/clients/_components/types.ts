export interface Client {
	id: string;
	name: string;
	lastName?: string | null;
	image: string | null;
	email: string;
	phone: string | null;
	height: number | null;
	weight: number | null;
	goal: string | null;
	programTitle: string;
	coach?: {
		id: string;
		name: string;
		email: string;
	} | null;
}
