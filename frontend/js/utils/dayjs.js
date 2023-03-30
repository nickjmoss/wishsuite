import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import dayjs from 'dayjs';

dayjs.extend(utc);
dayjs.extend(timezone);

export function toUTC(date) {
	return dayjs.utc(date);
}

export function toLocal(date) {
	return dayjs(date);
}

export function dayStart(date) {
	return dayjs(date).startOf('day');
}

export function dayEnd(date) {
	return dayjs(date).endOf('day');
}
