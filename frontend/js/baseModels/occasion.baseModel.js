import { types } from 'mobx-state-tree';

const { model, string, boolean, identifier, optional, maybeNull } = types;

export const OccasionBaseModel = model('OccasionBaseModel', {
	id: optional(identifier, ''),
	owner_id: maybeNull(string),
	name: maybeNull(string),
	description: maybeNull(string),
	celebrate_date: maybeNull(string),
	original_date: maybeNull(string),
	repeat: maybeNull(boolean),
});
