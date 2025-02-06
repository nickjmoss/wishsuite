import { types } from 'mobx-state-tree';

const { model, string, boolean, identifier, optional, maybeNull } = types;

export const OccasionBaseModel = model('OccasionBaseModel', {
	id: optional(identifier, ''),
	ownerId: maybeNull(string),
	name: maybeNull(string),
	description: maybeNull(string),
	celebrateDate: maybeNull(string),
	originalDate: maybeNull(string),
	repeat: maybeNull(boolean),
});
