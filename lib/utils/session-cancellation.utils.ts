export const SESSION_CANCELLATION_MIN_HOURS = 48;

export const getHoursUntilSession = (sessionDate: Date): number => {
	const now = new Date();
	return (new Date(sessionDate).getTime() - now.getTime()) / (1000 * 60 * 60);
};

export const canCancelSessionBeforeStart = (
	sessionDate: Date,
	minHoursBefore = SESSION_CANCELLATION_MIN_HOURS,
): boolean => {
	return getHoursUntilSession(sessionDate) >= minHoursBefore;
};
