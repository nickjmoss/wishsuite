import { types } from 'mobx-state-tree';
import { UserBaseModel } from './user.baseModel';

const { model, maybeNull, string, boolean, identifier, number, integer, frozen, optional } = types;

export const ItemBaseModel = model('ItemBaseModel', {
	id: identifier,
	title: string,
	description: maybeNull(string),
	price: optional(number, 0),
	quantity: integer,
	mostWanted: boolean,
	reserver: maybeNull(UserBaseModel),
	reserverId: maybeNull(string),
	reserved: boolean,
	status: string,
	externalLink: maybeNull(string),
	source: maybeNull(string),
	wishlistId: string,
	externalId: maybeNull(string),
	reviews: maybeNull(number),
	images: frozen({}),
	notes: maybeNull(string),
});

export const ItemToAddBaseModel = model('ItemBaseModel', {
	title: maybeNull(string),
	description: maybeNull(string),
	price: optional(number, 0),
	quantity: optional(number, 1),
	mostWanted: optional(boolean, false),
	reserved: optional(boolean, false),
	externalLink: maybeNull(string),
	source: maybeNull(string),
	wishlistId: maybeNull(string),
	externalId: maybeNull(string),
	reviews: maybeNull(number),
	images: frozen({}),
	notes: maybeNull(string),
});

export const ExternalItemBaseModel = model('ExternalItemBaseModel', {
	externalId: identifier,
	title: string,
	description: string,
	price: optional(number, 0),
	externalLink: string,
	source: string,
	reviews: maybeNull(number),
	images: frozen({}),
	brand: string,
	color: maybeNull(string),
});
