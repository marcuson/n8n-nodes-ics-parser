import { lines2tree } from 'icalts';
import { KeyValue, TreeType } from 'icalts/dist/src/types';
import { IcsCalendar, IcsCalendarEvent, IcsRoot } from './ics-types';
import { DateTime } from 'luxon';

export function icsFromString(icsStr: string): IcsRoot {
	const lines = icsStr.replace(/\n /, '').split(/\r?\n/);
	const parsedData = lines2tree(lines);
	const root: IcsRoot = {
		calendars: calendarsFromIcs(parsedData.VCALENDAR as TreeType[]),
	};
	return root;
}

function calendarsFromIcs(icsCalRoot: TreeType[]): IcsCalendar[] {
	if (!icsCalRoot) {
		return [];
	}

	const ret = icsCalRoot.map((x) => {
		const prodId = x.PRODID as KeyValue;

		return {
			prodId: {
				value: prodId.__value__,
				xRicalTzSource: prodId['X-RICAL-TZSOURCE'],
			},
			events: calEventsFromIcs(x.VEVENT as TreeType[]),
		} as IcsCalendar;
	});

	return ret;
}

function calEventsFromIcs(icsCalEventRoot: TreeType[]): IcsCalendarEvent[] {
	if (!icsCalEventRoot) {
		return [];
	}

	const ret = icsCalEventRoot.map((x) => {
		const dtStart = x.DTSTART as KeyValue;
		const dtEnd = x.DTEND as KeyValue;

		return {
			uid: x.UID,
			summary: x.SUMMARY,
			description: x.DESCRIPTION,
			startDate: getDateFromIcs(dtStart),
			endDate: getDateFromIcs(dtEnd),
		} as IcsCalendarEvent;
	});

	return ret;
}

function getDateFromIcs(icsDate: KeyValue): DateTime {
	return DateTime.fromISO(icsDate.__value__);
}
