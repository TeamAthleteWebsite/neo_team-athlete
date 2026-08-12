export const DAYS_OF_WEEK = [
	{ id: 1, label: "L", fullName: "Lundi" },
	{ id: 2, label: "M", fullName: "Mardi" },
	{ id: 3, label: "M", fullName: "Mercredi" },
	{ id: 4, label: "J", fullName: "Jeudi" },
	{ id: 5, label: "V", fullName: "Vendredi" },
	{ id: 6, label: "S", fullName: "Samedi" },
	{ id: 0, label: "D", fullName: "Dimanche" },
] as const;

export const generateRecurringSessionDates = (
	startDate: Date,
	startTime: string,
	numberOfWeeks: number,
	selectedDays: number[],
): Date[] => {
	const [startHour, startMinute] = startTime.split(":").map(Number);
	const sessionsToCreate: Date[] = [];
	const baseDate = new Date(startDate);
	const startDayOfWeek = baseDate.getDay();

	for (let week = 0; week < numberOfWeeks; week++) {
		for (const targetDayOfWeek of selectedDays) {
			let daysToAdd = targetDayOfWeek - startDayOfWeek;
			if (daysToAdd < 0) {
				daysToAdd += 7;
			}

			daysToAdd += week * 7;

			const sessionDate = new Date(baseDate);
			sessionDate.setDate(baseDate.getDate() + daysToAdd);

			const sessionDateTime = new Date(sessionDate);
			sessionDateTime.setHours(startHour, startMinute, 0, 0);

			sessionsToCreate.push(sessionDateTime);
		}
	}

	return Array.from(new Set(sessionsToCreate.map((date) => date.getTime())))
		.map((time) => new Date(time))
		.sort((a, b) => a.getTime() - b.getTime());
};
