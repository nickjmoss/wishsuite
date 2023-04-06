import { types } from 'mobx-state-tree';

const { model, maybeNull, string, boolean, identifier, number, integer, frozen, optional } = types;

export const ItemBaseModel = model('ItemBaseModel', {
	id: identifier,
	title: string,
	description: string,
	price: maybeNull(number),
	quantity: integer,
	mostWanted: boolean,
	reserved: boolean,
	externalLink: string,
	source: string,
	wishlistId: string,
	externalId: string,
	reviews: maybeNull(number),
	images: frozen({}),
	notes: maybeNull(string),
});

export const ItemToAddBaseModel = model('ItemBaseModel', {
	title: maybeNull(string),
	description: maybeNull(string),
	price: maybeNull(number),
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
	price: maybeNull(number),
	externalLink: string,
	source: string,
	reviews: maybeNull(number),
	images: frozen({}),
	brand: string,
	color: maybeNull(string),
});
