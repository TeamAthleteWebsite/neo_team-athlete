export const CALENDAR_START_HOUR = 7;
export const CALENDAR_END_HOUR = 22;
export const CALENDAR_HOUR_COUNT = CALENDAR_END_HOUR - CALENDAR_START_HOUR + 1;
export const SESSION_DURATION_MINUTES = 60;
export const CALENDAR_TOTAL_MINUTES = CALENDAR_HOUR_COUNT * 60;

export const getCalendarHourLabels = (): number[] =>
	Array.from(
		{ length: CALENDAR_HOUR_COUNT },
		(_, index) => CALENDAR_START_HOUR + index,
	);

export const formatCalendarHourLabel = (hour: number): string =>
	`${hour.toString().padStart(2, "0")}:00`;

export const getMinutesFromCalendarStart = (date: Date): number => {
	const sessionDate = new Date(date);
	return (
		(sessionDate.getHours() - CALENDAR_START_HOUR) * 60 +
		sessionDate.getMinutes()
	);
};

export const isSessionInCalendarRange = (date: Date): boolean => {
	const minutes = getMinutesFromCalendarStart(date);
	return minutes >= 0 && minutes < CALENDAR_TOTAL_MINUTES;
};

export const getSessionPositionStyles = (
	date: Date,
	durationMinutes: number = SESSION_DURATION_MINUTES,
): { top: string; height: string } => {
	const topMinutes = getMinutesFromCalendarStart(date);
	const topPercent = (topMinutes / CALENDAR_TOTAL_MINUTES) * 100;
	const heightPercent = (durationMinutes / CALENDAR_TOTAL_MINUTES) * 100;

	return {
		top: `${topPercent}%`,
		height: `${heightPercent}%`,
	};
};

export interface SessionTimeRange {
	id: string;
	startMinutes: number;
	endMinutes: number;
}

export interface SessionOverlapLayout {
	column: number;
	totalColumns: number;
}

export const getSessionTimeRange = (
	id: string,
	date: Date,
	durationMinutes: number = SESSION_DURATION_MINUTES,
): SessionTimeRange => {
	const startMinutes = getMinutesFromCalendarStart(date);
	return {
		id,
		startMinutes,
		endMinutes: startMinutes + durationMinutes,
	};
};

export const doSessionsOverlap = (
	a: SessionTimeRange,
	b: SessionTimeRange,
): boolean => a.startMinutes < b.endMinutes && b.startMinutes < a.endMinutes;

const buildOverlapClusters = (
	ranges: SessionTimeRange[],
): SessionTimeRange[][] => {
	const clusters: SessionTimeRange[][] = [];

	for (const range of ranges) {
		const matchingIndices: number[] = [];

		for (let index = 0; index < clusters.length; index++) {
			if (
				clusters[index].some((existing) => doSessionsOverlap(range, existing))
			) {
				matchingIndices.push(index);
			}
		}

		if (matchingIndices.length === 0) {
			clusters.push([range]);
			continue;
		}

		const primaryIndex = matchingIndices[0];
		clusters[primaryIndex].push(range);

		for (let index = matchingIndices.length - 1; index >= 1; index--) {
			const mergeIndex = matchingIndices[index];
			clusters[primaryIndex].push(...clusters[mergeIndex]);
			clusters.splice(mergeIndex, 1);
		}
	}

	return clusters;
};

const layoutOverlapCluster = (
	cluster: SessionTimeRange[],
): Map<string, SessionOverlapLayout> => {
	const sorted = [...cluster].sort(
		(a, b) =>
			a.startMinutes - b.startMinutes ||
			b.endMinutes - a.endMinutes - (a.endMinutes - a.startMinutes),
	);

	const columnEndTimes: number[] = [];
	const clusterLayout = new Map<string, SessionOverlapLayout>();

	for (const event of sorted) {
		let column = 0;

		while (
			column < columnEndTimes.length &&
			columnEndTimes[column] > event.startMinutes
		) {
			column++;
		}

		if (column === columnEndTimes.length) {
			columnEndTimes.push(event.endMinutes);
		} else {
			columnEndTimes[column] = event.endMinutes;
		}

		clusterLayout.set(event.id, { column, totalColumns: 0 });
	}

	const totalColumns = columnEndTimes.length;

	for (const event of cluster) {
		const layout = clusterLayout.get(event.id);
		if (layout) {
			clusterLayout.set(event.id, { ...layout, totalColumns });
		}
	}

	return clusterLayout;
};

export const computeSessionOverlapLayouts = (
	sessions: { id: string; date: Date }[],
	durationMinutes: number = SESSION_DURATION_MINUTES,
): Map<string, SessionOverlapLayout> => {
	const ranges = sessions.map((session) =>
		getSessionTimeRange(session.id, new Date(session.date), durationMinutes),
	);

	const layout = new Map<string, SessionOverlapLayout>();
	const clusters = buildOverlapClusters(ranges);

	for (const cluster of clusters) {
		const clusterLayout = layoutOverlapCluster(cluster);
		for (const [id, overlapLayout] of clusterLayout) {
			layout.set(id, overlapLayout);
		}
	}

	return layout;
};

export const getSessionLayoutStyles = (
	date: Date,
	overlapLayout: SessionOverlapLayout,
	durationMinutes: number = SESSION_DURATION_MINUTES,
): { top: string; height: string; left: string; width: string } => {
	const { top, height } = getSessionPositionStyles(date, durationMinutes);
	const { column, totalColumns } = overlapLayout;
	const widthPercent = 100 / totalColumns;

	return {
		top,
		height,
		left: `${column * widthPercent}%`,
		width: `${widthPercent}%`,
	};
};
