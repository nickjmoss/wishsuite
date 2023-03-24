import { types, flow } from 'mobx-state-tree';
import request from '@request';
import { rootStore } from '@stores';
import { WishlistBaseModel } from '@app/js/baseModels/wishlist.baseModel';
import { message } from 'antd';

const { model, optional, boolean, array } = types;

const WishlistsModel = model('WishlistsModel', {
	isLoading: optional(boolean, false),
	wishlistsList: array(WishlistBaseModel),

	// Add Wishlist Modal State
	showAddModal: optional(boolean, false),
})
	.views(() => ({
		get baseURL() {
			return rootStore.UserStore.baseURL;
		},
		get userStore() {
			return rootStore.UserStore;
		},
	}))
	.actions((self) => ({
		afterCreate() {
			self.fetchWishlists();
		},
		closeAddModal() {
			self.showAddModal = false;
		},
		openAddModal() {
			self.showAddModal = true;
		},
		fetchWishlists: flow(function* fetchWishlists() {
			self.isLoading = true;
			const { data } = yield request.get(`${self.baseURL}/wishlists`);
			self.wishlistsList = data.data;
			self.isLoading = false;
		}),
		createWishlist: flow(function* createWishlist(wishlist) {
			try {
				self.isLoading = true;
				const { data } = yield request.post(`${self.baseURL}/wishlists`, wishlist);
				if (!data.success) {
					throw new Error(data.data);
				}
				self.fetchWishlists();
				self.isLoading = false;
				self.closeAddModal();
			}
			catch (err) {
				message.error(err.message);
			}
		}),
	}));

export default {
	model: WishlistsModel,
	initialValues: {},
	stores: {},
};
