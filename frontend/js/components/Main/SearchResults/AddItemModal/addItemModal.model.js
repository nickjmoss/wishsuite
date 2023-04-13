import { ItemToAddBaseModel } from '@app/js/baseModels/item.baseModel';
import { WishlistBaseModel } from '@app/js/baseModels/wishlist.baseModel';
import { types, flow, getSnapshot } from 'mobx-state-tree';
import request from '@request';
import { rootStore } from '@app/js/stores';
import { message } from 'antd';

const { model, array, optional } = types;

const AddItemModalModel = model('AddItemModalModel', {
	wishlists: array(WishlistBaseModel),
	itemToAdd: optional(ItemToAddBaseModel, {}),
})
	.views((self) => ({
		get baseURL() {
			return rootStore.UserStore.baseURL;
		},
		get wishlistsView() {
			return self.wishlists.map(wishlist => ({
				label: wishlist.name,
				value: wishlist.id,
			}));
		},
	}))
	.actions((self) => ({
		afterCreate() {
			self.fetchWishlists();
		},
		fetchWishlists: flow(function* fetchWishlists() {
			const { data } = yield request.get(`${self.baseURL}/wishlists`);
			self.setWishlists(data.data);
		}),
		addItemToWishlist: flow(function* addItemToWishlist() {
			try {
				const { data } = yield request.post(`${self.baseURL}/items`, self.itemToAdd);
				if (!data.success) {
					throw new Error(data.data);
				}
				message.success('Successfully added item to wishlist');
				self.props.onCancel();
			}
			catch (err) {
				message.error(err.message);
			}
		}),
		setItemToAdd(item) {
			self.itemToAdd = getSnapshot(item);
		},
		setWishlists(wishlists) {
			self.wishlists = wishlists;
		},
		setMostWanted(mostWanted) {
			self.itemToAdd.mostWanted = mostWanted;
		},
		setQuantity(quantity) {
			self.itemToAdd.quantity = quantity;
		},
		setWishlist(wishlist) {
			self.itemToAdd.wishlistId = wishlist;
		},
		setNotes(notes) {
			self.itemToAdd.notes = notes;
		},
	}));

export default {
	model: AddItemModalModel,
	initialValues: {},
	stores: {},
};
