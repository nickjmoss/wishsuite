import { types } from 'mobx-state-tree';

const { model, string, maybeNull } = types;

export const SignUpModel = model('SignUpModel', {
	test: maybeNull(string),
});
