import { types, flow } from 'mobx-state-tree';
import request from '@request';
import { rootStore } from '@stores';
import { WishlistBaseModel } from '@app/js/baseModels/wishlist.baseModel';
import { TableStateBaseModel } from '@app/js/baseModels/tableState.baseModel';
import { OccasionBaseModel } from '@app/js/baseModels/occasion.baseModel';
import { ItemBaseModel } from '@app/js/baseModels/item.baseModel';

const { model, optional, boolean, array, string, compose, maybeNull } = types;

const ExtendedWishlistModel = compose(
	WishlistBaseModel,
	model({
		occasion: maybeNull(OccasionBaseModel),
		items: array(ItemBaseModel),
	}),
);

const FriendsWishlistsModel = model('FriendsWishlistsModel', {
	isLoading: optional(boolean, false),
	friendId: maybeNull(string),
	wishlistsList: array(ExtendedWishlistModel),
	tableState: optional(compose(
		TableStateBaseModel,
		model({
			filter: optional(string, 'all'),
		}),
	), {}),
})
	.views((self) => ({
		get baseURL() {
			return rootStore.UserStore.baseURL;
		},
		get userStore() {
			return rootStore.UserStore;
		},
		get pagination() {
			return self.tableState.pagination;
		},
		get sorter() {
			return self.tableState.sorter;
		},
		get publicWishlists() {
			return self.wishlistsList.filter(wishlist => wishlist.isPublished === true);
		},
	}))
	.actions((self) => ({
		fetchFriendsWishlists: flow(function* fetchFriendsWishlists() {
			self.isLoading = true;
			const searchParams = new URLSearchParams();
			searchParams.set('searchTerm', self.tableState.searchTerm);
			searchParams.set('sortOrder', self.sorter.sortOrder);
			searchParams.set('sortColumn', self.sorter.columnKey);
			searchParams.set('currentPage', self.pagination.current);
			searchParams.set('pageSize', self.pagination.pageSize);
			const { data } = yield request.get(`users/${self.friendId}/wishlists?${searchParams}`);
			self.wishlistsList = data.data;
			self.pagination.total = data.count;
			self.isLoading = false;
		}),
		setFriendId(friend_id) {
			self.friendId = friend_id;
		},
		onSearch(search) {
			self.tableState.searchTerm = search;
			self.fetchFriendsWishlists();
		},
		setPagination(pagination) {
			self.tableState.pagination = pagination;
		},
		setSorter(sorter) {
			self.tableState.sorter = sorter;
		},
		onTableChange(pagination, _, sorter) {
			if (pagination) {
				self.setPagination(pagination);
			}

			if (sorter) {
				self.setSorter(sorter);
			}

			self.fetchFriendsWishlists();
		},
	}));

export default {
	model: FriendsWishlistsModel,
	initialValues: {},
	stores: {},
};
