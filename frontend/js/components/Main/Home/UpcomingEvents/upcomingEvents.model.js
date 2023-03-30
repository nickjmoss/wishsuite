import { types } from 'mobx-state-tree';

const { model, optional, string } = types;

export const UpcomingEventsModel = model('UpcomingEventsModel', {
	test: optional(string, ''),
});
