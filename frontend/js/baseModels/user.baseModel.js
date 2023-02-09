import { types } from "mobx-state-tree";

const { model, string, optional } = types;

export const UserBaseModel = model('UserBaseModel', {
	id: optional(string, ''),
	firstName: optional(string, ''),
	lastName: optional(string, ''),
	email: optional(string, ''),
})