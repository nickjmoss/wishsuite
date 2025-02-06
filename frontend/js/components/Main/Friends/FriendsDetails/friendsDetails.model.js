import { UserBaseModel } from '@app/js/baseModels/user.baseModel';
import { types, flow } from 'mobx-state-tree';
import request from '@request';
import { rootStore } from '@app/js/stores';

const { model, optional, boolean } = types;

const FriendsDetailsModel = model('FriendsDetailsModel', {
	isLoading: optional(boolean, false),
	friend: optional(UserBaseModel, {}),
})
	.views((self) => ({
		get baseURL() {
			return rootStore.UserStore.baseURL;
		},
	}))
	.actions((self) => ({
		fetchFriend: flow(function* fetchFriend(friend_id) {
			self.isLoading = true;
			const { data } = yield request.get(`${self.baseURL}/friends/${friend_id}`);
			self.friend = data.data;
			self.isLoading = false;
		}),
	}));

export default {
	model: FriendsDetailsModel,
	inititalValues: {},
	stores: {},
};
