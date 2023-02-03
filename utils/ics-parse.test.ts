import { DateTime } from 'luxon';
import { icsFromString } from './ics-parse';

const icsStrSample = `BEGIN:VCALENDAR
PRODID;X-RICAL-TZSOURCE=TZINFO:-//Example Inc//Hosting Calendar 0.8.8//EN
CALSCALE:GREGORIAN
VERSION:2.0
BEGIN:VEVENT
DTEND;VALUE=DATE:20230202
DTSTART;VALUE=DATE:20230201
UID:1418fb94e984-d697f2641d14a5a0a6616456c1d4ec11@example.com
DESCRIPTION:Test desc with URL: https://www.example.com/example/longexample/
 details/uniqueidhere\\nMore data (inside bracket): data here
SUMMARY:Reserved
END:VEVENT
BEGIN:VEVENT
DTEND;VALUE=DATE:20230203
DTSTART;VALUE=DATE:20230202
UID:6fec1092d3fa-43928c02a75f6bf1e5808c0e3696cad3@example.com
SUMMARY:Example (desc)
END:VEVENT
BEGIN:VEVENT
DTEND;VALUE=DATE:20240203
DTSTART;VALUE=DATE:20230801
UID:6fec1092d3fa-ef7f3ddba7a3b7b861f1491d36f23afa@example.com
SUMMARY:Example (desc)
END:VEVENT
END:VCALENDAR`;

describe('parse iCal from string', () => {
	test('parse example ICS file', () => {
		const ics = icsFromString(icsStrSample);
		expect(ics.calendars).toHaveLength(1);

		const cal = ics.calendars![0];
		expect(cal).not.toBeUndefined();
		expect(cal.prodId).not.toBeUndefined();
		expect(cal.prodId?.value).toBe('-//Example Inc//Hosting Calendar 0.8.8//EN');
		expect(cal.prodId?.xRicalTzSource).toBe('TZINFO');
		expect(cal.events).toHaveLength(3);

		const event = cal.events![0];
		expect(event.description).toBe(
			'Test desc with URL: https://www.example.com/example/longexample/details/uniqueidhere\\nMore data (inside bracket): data here',
		);
		expect(event.summary).toBe('Reserved');
		expect(event.uid).toBe('1418fb94e984-d697f2641d14a5a0a6616456c1d4ec11@example.com');
		expect(event.startDate.toMillis()).toBe(DateTime.local(2023, 2, 1).toMillis());
		expect(event.endDate.toMillis()).toBe(DateTime.local(2023, 2, 2).toMillis());
	});
});
