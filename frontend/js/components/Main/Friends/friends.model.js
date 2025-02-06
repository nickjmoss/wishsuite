import { UserBaseModel } from '@app/js/baseModels/user.baseModel';
import { types, flow } from 'mobx-state-tree';
import request from '@request';
import { rootStore } from '@app/js/stores';
import { TableStateBaseModel } from '@app/js/baseModels/tableState.baseModel';
import { message } from 'antd';

const { model, array, optional, boolean } = types;

const FriendsModel = model('FriendsModel', {
	friendsList: array(UserBaseModel),
	tableState: optional(TableStateBaseModel, {}),

	// Modal State
	showModal: optional(boolean, false),
})
	.views((self) => ({
		get baseURL() {
			return rootStore.UserStore.baseURL;
		},
		get pagination() {
			return self.tableState.pagination;
		},
		get sorter() {
			return self.tableState.sorter;
		},
	}))
	.actions((self) => ({
		afterCreate() {
			self.fetchFriends();
		},
		fetchFriends: flow(function* fetchFriends() {
			self.isLoading = true;
			const { data } = yield request.get(`
				${self.baseURL}/friends?searchTerm=${self.tableState.searchTerm}&currentPage=${self.pagination.current}&pageSize=${self.pagination.pageSize}&sortColumn=${self.sorter.columnKey}&sortOrder=${self.sorter.sortOrder}
			`);
			self.friendsList = data.data;
			self.isLoading = false;
		}),
		onUnfollow: flow(function* onUnfollow(friendId) {
			try {
				const { data } = yield request.delete(`${self.baseURL}/friends/${friendId}`);
				if (!data.success) {
					throw new Error(data.data);
				}

				self.fetchFriends();
			}
			catch (err) {
				message.error(err.message);
			}
		}),
		onSearch(searchTerm) {
			self.tableState.searchTerm = searchTerm;
			self.fetchFriends();
		},
		onTableChange(pagination, _, sorter) {
			if (pagination) {
				self.setPagination(pagination);
			}

			if (sorter) {
				self.setSorter(sorter);
			}

			self.fetchFriends();
		},
		setPagination(pagination) {
			self.tableState.pagination = pagination;
		},
		setSorter(sorter) {
			self.tableState.sorter = sorter;
		},
		openModal() {
			self.showModal = true;
		},
		closeModal() {
			self.showModal = false;
		},
		onModalDone() {
			self.closeModal();
			self.fetchFriends();
		},
	}));

export default {
	model: FriendsModel,
	initialValues: {},
	stores: {},
};
