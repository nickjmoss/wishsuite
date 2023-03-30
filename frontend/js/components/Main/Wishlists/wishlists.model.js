import { types, flow } from 'mobx-state-tree';
import request from '@request';
import { rootStore } from '@stores';
import { WishlistBaseModel } from '@app/js/baseModels/wishlist.baseModel';
import { message } from 'antd';
import { TableStateBaseModel } from '@app/js/baseModels/tableState.baseModel';
import { OccasionBaseModel } from '@app/js/baseModels/occasion.baseModel';
import { ItemBaseModel } from '@app/js/baseModels/item.baseModel';

const { model, optional, boolean, array, string, compose } = types;

const WishlistsModel = model('WishlistsModel', {
	isLoading: optional(boolean, false),
	wishlistsList: array(compose(
		WishlistBaseModel,
		model({
			occasion: optional(OccasionBaseModel, {}),
			items: array(ItemBaseModel),
		}),
	)),
	tableState: optional(compose(
		TableStateBaseModel,
		model({
			filter: optional(string, 'all'),
		}),
	), {}),

	// Add Wishlist Modal State
	showAddModal: optional(boolean, false),
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
		get filter() {
			return self.tableState.filter;
		},
		get sorter() {
			return self.tableState.sorter;
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
			const searchParams = new URLSearchParams();
			searchParams.set('searchTerm', self.tableState.searchTerm);
			searchParams.set('sortOrder', self.sorter.sortOrder);
			searchParams.set('sortColumn', self.sorter.columnKey);
			searchParams.set('currentPage', self.pagination.current);
			searchParams.set('pageSize', self.pagination.pageSize);
			searchParams.set('filter', self.filter);
			const { data } = yield request.get(`${self.baseURL}/wishlists?${searchParams}`);
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
		setFilter(filter) {
			self.tableState.filter = filter;
			self.fetchWishlists();
		},
		onSearch(search) {
			self.tableState.searchTerm = search;
			self.fetchWishlists();
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

			self.fetchWishlists();
		},
	}));

export default {
	model: WishlistsModel,
	initialValues: {},
	stores: {},
};
