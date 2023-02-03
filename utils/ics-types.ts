import { DateTime } from 'luxon';

export interface IcsRoot {
	calendars?: IcsCalendar[];
}

export interface IcsCalendar {
	prodId?: {
		value?: string;
		xRicalTzSource?: string;
	};
	calscale?: string;
	version?: string;
	events?: IcsCalendarEvent[];
}

export interface IcsCalendarEvent {
	startDate: DateTime;
	endDate: DateTime;
	uid: string;
	description: string;
	summary: string;
}
