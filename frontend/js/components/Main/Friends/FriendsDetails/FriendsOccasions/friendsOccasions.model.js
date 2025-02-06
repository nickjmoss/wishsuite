import { types, flow } from 'mobx-state-tree';
import request from '@request';
import { OccasionBaseModel } from '@app/js/baseModels/occasion.baseModel';
import { rootStore } from '@app/js/stores';
import { message } from 'antd';

const { model, boolean, array, optional, maybeNull, string, safeReference } = types;

const FriendOccasionsModel = model('FriendOccasionsModel', {
	isLoading: optional(boolean, false),
	occasionList: array(OccasionBaseModel),
	occasionToDetail: safeReference(OccasionBaseModel),

	friendId: maybeNull(string),
})
	.views(() => ({
		get userStore() {
			return rootStore.UserStore;
		},
		get baseURL() {
			return rootStore.UserStore.baseURL;
		},
	}))
	.actions((self) => ({
		afterCreate() {
			self.fetchOccasions();
		},
		setFriendId(friendId) {
			self.friendId = friendId;
		},
		fetchOccasions: flow(function* fetchOccasions() {
			self.isLoading = true;
			try {
				const { data } = yield request.get(`users/${self.friendId}/occasions`);
				if (!data.success) {
					throw new Error(data.data);
				}
				self.occasionList = data.data;
			}
			catch (err) {
				message.error(err.message);
			}
			finally {
				self.isLoading = false;
			}
		}),
		openDetailsModal(occasion_id) {
			self.occasionToDetail = occasion_id;
			self.showDetailsModal = true;
		},
		closeDetailsModal() {
			self.occasionToDetail = undefined;
			self.showDetailsModal = false;
		},
	}));

export default {
	model: FriendOccasionsModel,
	initialValues: {},
	stores: {},
};
