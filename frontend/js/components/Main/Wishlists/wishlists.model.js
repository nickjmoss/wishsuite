import { types } from 'mobx-state-tree';

const { model, string } = types;

const WishlistsModel = model('WishlistsModel', {
	test: '',
});

export default {
	model: WishlistsModel,
	initialValues: {},
	stores: {},
};
