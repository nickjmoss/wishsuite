import { UserBaseModel } from '@app/js/baseModels/user.baseModel';
import { types, flow } from 'mobx-state-tree';
import request from '@request';
import { rootStore } from '@app/js/stores';
import { message } from 'antd';

const { model, array, string, optional, compose, boolean } = types;

const AddFriendModalModel = model('AddFriendModalModel', {
	usersList: array(compose(
		UserBaseModel,
		model({
			isFollowing: optional(boolean, false),
		}),
	)),
	searchTerm: optional(string, ''),
})
	.views(() => ({
		get baseURL() {
			return rootStore.UserStore.baseURL;
		},
	}))
	.actions((self) => ({
		fetchUsers: flow(function* fetchUsers() {
			const { data } = yield request.get(`${self.baseURL}/friends/potential?searchTerm=${self.searchTerm}`);
			self.setUsersList(data.data);
		}),
		setUsersList(data) {
			self.usersList = data.map(user => {
				return {
					id: user.id,
					firstName: user.first_name,
					lastName: user.last_name,
					fullName: user.full_name,
					email: user.email,
					avatarUrl: user.avatarUrl,
					isFollowing: user.is_following,
				};
			});
		},
		onSearch(searchTerm) {
			self.searchTerm = searchTerm;
			self.fetchUsers();
		},
		onFollow: flow(function* onFollow(friendId) {
			try {
				const { data } = yield request.post(`${self.baseURL}/friends/${friendId}`);
				if (!data.success) {
					throw new Error(data.data);
				}
				self.usersList.find(user => user.id === friendId).isFollowing = true;
			}
			catch (err) {
				message.error(err.message);
			}
		}),
	}));

export default {
	model: AddFriendModalModel,
	initialValues: {},
	stores: {},
};
