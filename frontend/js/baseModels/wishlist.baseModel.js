import { types } from 'mobx-state-tree';
import { OccasionBaseModel } from './occasion.baseModel';
import { ItemBaseModel } from './item.baseModel';

const { model, identifier, maybeNull, string, boolean, optional, compose, array } = types;

export const WishlistBaseModel = model('WishlistBaseModel', {
	id: identifier,
	name: string,
	description: maybeNull(string),
	ownerId: string,
	occasionId: maybeNull(string),
	isPublished: boolean,
	createdAt: maybeNull(string),
});

export const WishlistToUpdateBaseModel = model('WishlistToUpdateBaseModel', {
	name: maybeNull(string),
	description: maybeNull(string),
	ownerId: maybeNull(string),
	occasionId: maybeNull(string),
	isPublished: maybeNull(boolean),
	createdAt: maybeNull(string),
});

export const WishlistToCreate = model('WishlistToCreate', {
	name: maybeNull(string),
	description: maybeNull(string),
	ownerId: maybeNull(string),
	occasionId: maybeNull(string),
	isPublished: optional(boolean, false),
});

export const ExtendedWishlistModel = compose('ExtendedWishlistModel',
	WishlistBaseModel,
	model({
		occasion: maybeNull(OccasionBaseModel),
		items: array(ItemBaseModel),
	}),
);
