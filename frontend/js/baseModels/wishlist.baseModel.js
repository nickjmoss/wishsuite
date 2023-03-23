import { types } from 'mobx-state-tree';

const { model, identifier, maybeNull, string, boolean, optional } = types;

export const WishlistBaseModel = model('WishlistBaseModel', {
	id: identifier,
	name: string,
	description: maybeNull(string),
	ownerId: string,
	occasionId: maybeNull(string),
	visibility: boolean,
});

export const WishlistToCreate = model('WishlistToCreate', {
	id: maybeNull(string),
	name: maybeNull(string),
	description: maybeNull(string),
	ownerId: maybeNull(string),
	occasionId: maybeNull(string),
	visibility: optional(boolean, false),
});
