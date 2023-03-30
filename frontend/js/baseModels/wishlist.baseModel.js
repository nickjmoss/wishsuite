import { types } from 'mobx-state-tree';

const { model, identifier, maybeNull, string, boolean, optional } = types;

export const WishlistBaseModel = model('WishlistBaseModel', {
	id: identifier,
	name: string,
	description: maybeNull(string),
	ownerId: string,
	occasionId: maybeNull(string),
	isPublished: boolean,
});

export const WishlistToCreate = model('WishlistToCreate', {
	name: maybeNull(string),
	description: maybeNull(string),
	ownerId: maybeNull(string),
	occasionId: maybeNull(string),
	isPublished: optional(boolean, false),
});
