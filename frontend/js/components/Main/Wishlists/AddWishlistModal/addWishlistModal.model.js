import { types, flow } from 'mobx-state-tree';
import request from '@request';
import { rootStore } from '@app/js/stores';
import { message } from 'antd';
import { WishlistToCreate } from '@app/js/baseModels/wishlist.baseModel';

const { model, array, string, optional } = types;

const AddWishListModalModel = model('AddWishlistModalModel', {
	occasionList: array(model('OccasionListModel', {
		label: string,
		value: string,
	})),
	wishlistToCreate: optional(WishlistToCreate, {}),
})
	.views((self) => ({
		get userStore() {
			return rootStore.UserStore;
		},
		get baseURL() {
			return self.userStore.baseURL;
		},
	}))
	.actions((self) => ({
		afterCreate() {
			self.fetchOccasions();
		},
		fetchOccasions: flow(function* fetchOccasions() {
			try {
				const { data } = yield request.get(`${self.baseURL}/occasions`);
				if (!data.success) {
					throw new Error(data.data);
				}
				self.setOccasions(data.data);
			}
			catch (err) {
				message.error(err.message);
			}
		}),
		setOccasions(data) {
			self.occasionList = data.map(occasion => {
				return {
					label: occasion.name,
					value: occasion.id,
				};
			});
		},
		setName(name) {
			self.wishlistToCreate.name = name;
		},
		setDescription(description) {
			self.wishlistToCreate.description = description;
		},
		setOccasionId(id) {
			self.wishlistToCreate.occasionId = id;
		},
		setOwnerId(ownerId) {
			self.wishlistToCreate.ownerId = ownerId;
		},
		setIsPublished(published) {
			self.wishlistToCreate.isPublished = published;
		},
		getWishlistToCreate() {
			self.setOwnerId(self.userStore.user.id);
			return self.wishlistToCreate;
		},
	}));

export default {
	model: AddWishListModalModel,
	initialValues: {},
	stores: {},
};
