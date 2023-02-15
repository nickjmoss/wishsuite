import { types } from 'mobx-state-tree';

const { model, string, maybeNull } = types;

export const RecoverPasswordModel = model('RecoverPasswordModel', {
	test: maybeNull(string),
});
