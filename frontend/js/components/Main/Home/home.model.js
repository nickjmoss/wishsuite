import { types } from 'mobx-state-tree';

const { model, string, maybeNull } = types;

export const HomeModel = model('HomeModel', {
	test: maybeNull(string),
});
