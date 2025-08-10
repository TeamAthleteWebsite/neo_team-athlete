export interface Client {
	id: string;
	name: string;
	image: string | null;
	email: string;
	phone: string | null;
	height: number | null;
	weight: number | null;
	goal: string | null;
	trainingType: string;
} 