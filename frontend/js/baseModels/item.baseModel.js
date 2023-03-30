import { types } from 'mobx-state-tree';

const { model, maybeNull, string, boolean, identifier, number, integer, frozen } = types;

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
	images: frozen({}),
	notes: maybeNull(string),
});
