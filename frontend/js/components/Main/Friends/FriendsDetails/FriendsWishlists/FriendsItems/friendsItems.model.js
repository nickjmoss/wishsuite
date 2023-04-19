import { ExtendedWishlistModel } from '@app/js/baseModels/wishlist.baseModel';
import { types, flow } from 'mobx-state-tree';
import request from '@request';
import { rootStore } from '@app/js/stores';
import { TableStateBaseModel } from '@app/js/baseModels/tableState.baseModel';
import { message } from 'antd';
import { ItemBaseModel } from '@app/js/baseModels/item.baseModel';

const { model, maybeNull, optional, array, string, boolean, compose, safeReference } = types;

const FriendsItemsModel = model('FriendsItemsModel', {
	isLoading: optional(boolean, false),
	wishlist: maybeNull(ExtendedWishlistModel),
	tableState: optional(compose(
		TableStateBaseModel,
		model({
			filter: optional(string, 'all'),
		}),
	), {}),
	selectedRows: array(string),

	// Modals
	showItemDetailsModal: optional(boolean, false),
	itemDetails: safeReference(ItemBaseModel),
})
	.views((self) => ({
		get baseURL() {
			return rootStore.UserStore.baseURL;
		},
		get userStore() {
			return rootStore.UserStore;
		},
		get items() {
			return self.wishlist.items;
		},
		get pagination() {
			return self.tableState.pagination;
		},
		get isPublished() {
			return self.wishlist.isPublished ? 'Published' : 'Unpublished';
		},
		get sorter() {
			return self.tableState.sorter;
		},
		get itemText() {
			return self.selectedRows.length > 1 ? 'items' : 'item';
		},
		get itemTextCaps() {
			return self.selectedRows.length > 1 ? 'Items' : 'Item';
		},
		get wishlistName() {
			return self.wishlist.name;
		},
	}))
	.actions((self) => ({
		fetchWishlist: flow(function* fetchWishlist(wishlist_id) {
			self.isLoading = true;
			const { data } = yield request.get(`${self.baseURL}/wishlists/${wishlist_id}`);
			self.wishlist = data.data;
			self.isLoading = false;
		}),
		setSelectedRows(rows) {
			self.selectedRows = rows.map(row => row.id);
		},
		fetchItems: flow(function* fetchItems() {
			self.isLoading = true;
			const searchParams = new URLSearchParams({
				wishlist_id: self.wishlist.id,
				searchTerm: self.tableState.searchTerm,
				filter: self.tableState.filter,
				currentPage: self.pagination.current,
				pageSize: self.pagination.pageSize,
				sortOrder: self.sorter.sortOrder,
				sortColumn: self.sorter.columnKey,
			});
			const { data } = yield request.get(`${self.baseURL}/items?${searchParams}`);
			self.wishlist.items = data.data;
			self.isLoading = false;
		}),
		reserveItem: flow(function* reserveItem() {
			try {
				const { data } = yield request.put(`${self.baseURL}/items/reserve`, self.selectedRows);
				if (!data.success) {
					throw new Error(data.data);
				}
				self.fetchItems();
			}
			catch (err) {
				message.error(err.message);
			}
		}),
		unreserveItem: flow(function* reserveItem() {
			try {
				const { data } = yield request.put(`${self.baseURL}/items/unreserve`, self.selectedRows);
				if (!data.success) {
					throw new Error(data.data);
				}
				self.fetchItems();
			}
			catch (err) {
				message.error(err.message);
			}
		}),
		isReserver(reserverId) {
			return reserverId === self.userStore.user.id;
		},
		openItemDetailsModal(item) {
			self.itemDetails = item;
			self.showItemDetailsModal = true;
		},
		closeItemDetailsModal() {
			self.itemDetails = undefined;
			self.showItemDetailsModal = false;
		},
		setFilter(filter) {
			self.tableState.filter = filter;
			self.fetchItems();
		},
		setSearch(searchTerm) {
			self.tableState.searchTerm = searchTerm;
			self.fetchItems();
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

			self.fetchItems();
		},
	}));

export default {
	model: FriendsItemsModel,
	initialValues: {},
	stores: {},
};
