import { types } from 'mobx-state-tree';

const { model, optional, boolean } = types;

const WishlistsModel = model('WishlistsModel', {
	test: '',

	// Add Wishlist Modal State
	showAddModal: optional(boolean, false),
})
	.views(() => ({}))
	.actions((self) => ({
		closeAddModal() {
			self.showAddModal = false;
		},
		openAddModal() {
			self.showAddModal = true;
		},
	}));

export default {
	model: WishlistsModel,
	initialValues: {},
	stores: {},
};
