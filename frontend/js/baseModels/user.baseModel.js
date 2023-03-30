import { types } from 'mobx-state-tree';

const { model, string, maybeNull, identifier } = types;

export const UserBaseModel = model('UserBaseModel', {
	id: maybeNull(identifier),
	firstName: maybeNull(string),
	lastName: maybeNull(string),
	fullName: maybeNull(string),
	email: maybeNull(string),
	avatarUrl: maybeNull(string),
});

