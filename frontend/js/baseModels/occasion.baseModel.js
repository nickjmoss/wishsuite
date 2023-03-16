import { types } from 'mobx-state-tree';

const { model, string, boolean, identifier, optional, maybeNull } = types;

export const OccasionBaseModel = model('OccasionBaseModel', {
	id: optional(identifier, ''),
	owner_id: optional(string, ''),
	name: optional(string, ''),
	description: maybeNull(string),
	celebrate_date: optional(string, ''),
	original_date: maybeNull(string),
	repeat: optional(boolean, false),
});
