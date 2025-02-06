import { ExtendedWishlistModel, WishlistBaseModel, WishlistToUpdateBaseModel } from '@app/js/baseModels/wishlist.baseModel';
import { types, flow, getSnapshot } from 'mobx-state-tree';
import request from '@request';
import { rootStore } from '@app/js/stores';
import { TableStateBaseModel } from '@app/js/baseModels/tableState.baseModel';
import { message } from 'antd';
import { ItemBaseModel, ItemToAddBaseModel } from '@app/js/baseModels/item.baseModel';

const { model, maybeNull, optional, array, string, boolean, compose, safeReference } = types;

const WishlistDetailsModel = model('WishlistDetailsModel', {
	isLoading: optional(boolean, false),
	wishlist: maybeNull(ExtendedWishlistModel),
	allWishlists: array(WishlistBaseModel),
	occasionList: array(model('OccasionListModel', {
		label: string,
		value: string,
	})),

	tableState: optional(compose(
		TableStateBaseModel,
		model({
			filter: optional(string, 'all'),
		}),
	), {}),
	selectedRows: array(string),

	// Modals
	showDeleteModal: optional(boolean, false),

	showCopyModal: optional(boolean, false),
	copyToWishlist: maybeNull(string),

	showCustomWishModal: optional(boolean, false),
	customWish: optional(ItemToAddBaseModel, {}),

	showItemDetailsModal: optional(boolean, false),
	itemDetails: safeReference(ItemBaseModel),

	showUpdateWishlistModal: optional(boolean, false),
	wishlistToUpdate: optional(WishlistToUpdateBaseModel, {}),
})
	.views((self) => ({
		get baseURL() {
			return rootStore.UserStore.baseURL;
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
		get wishlistsView() {
			if (self.allWishlists) {
				return self.allWishlists.map(wishlist => ({
					label: wishlist.name,
					value: wishlist.id,
				}));
			}
			return null;
		},
		get wishlistName() {
			return self.wishlist.name;
		},
	}))
	.actions((self) => ({
		fetchWishlist: flow(function* fetchWishlist(wishlist_id) {
			self.isLoading = true;
			const searchParams = new URLSearchParams({ isOwnItems: true });
			const { data } = yield request.get(`${self.baseURL}/wishlists/${wishlist_id}?${searchParams}`);
			self.wishlist = data.data;
			self.isLoading = false;
		}),
		fetchWishlists: flow(function* fetchWishlists() {
			const { data } = yield request.get(`${self.baseURL}/wishlists`);
			self.allWishlists = data.data.filter(wishlist => wishlist.id !== self.wishlist.id);
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
				isOwnItems: true,
			});
			const { data } = yield request.get(`${self.baseURL}/items?${searchParams}`);
			self.wishlist.items = data.data;
			self.pagination.total = data.count;
			self.isLoading = false;
		}),
		updateItemStatus: flow(function* updateItemStatus(status) {
			self.isLoading = true;
			try {
				const searchParams = new URLSearchParams({
					status,
				});

				const { data } = yield request.put(`${self.baseURL}/items/status?${searchParams}`, self.selectedRows);
				if (!data.success) {
					throw new Error(data.data);
				}
				self.fetchItems();
			}
			catch (err) {
				message.error(err.message);
			}
		}),
		publishWishlist: flow(function* publishWishlist() {
			try {
				const { data } = yield request.put(`${self.baseURL}/wishlists/${self.wishlist.id}/publish`);
				if (!data.success) {
					throw new Error(data.data);
				}
				self.fetchWishlist(self.wishlist.id);
			}
			catch (err) {
				message.error(err.message);
			}
		}),
		unpublishWishlist: flow(function* unpublishWishlist() {
			try {
				const { data } = yield request.put(`${self.baseURL}/wishlists/${self.wishlist.id}/unpublish`);
				if (!data.success) {
					throw new Error(data.data);
				}
				self.fetchWishlist(self.wishlist.id);
			}
			catch (err) {
				message.error(err.message);
			}
		}),
		deleteItems: flow(function* deleteItems() {
			self.isLoading = true;
			try {
				const { data } = yield request.post(`${self.baseURL}/items/delete`, self.selectedRows);
				if (!data.success) {
					throw new Error(data.data);
				}
				self.fetchItems();
				message.success(`Successfully Deleted ${self.itemTextCaps}`);
			}
			catch (err) {
				message.error(err.message);
			}
			finally {
				self.isLoading = false;
				self.selectedRows = [];
				self.closeDeleteModal();
			}
		}),
		openDeleteModal() {
			self.showDeleteModal = true;
		},
		closeDeleteModal() {
			self.showDeleteModal = false;
		},
		copyItems: flow(function* copyItems() {
			self.isLoading = true;
			try {
				const { data } = yield request.post(`${self.baseURL}/items/copy?wishlist_id=${self.copyToWishlist}`, self.selectedRows);
				if (!data.success) {
					throw new Error(data.data);
				}
				message.success(`Successfully Copied ${self.itemTextCaps} to Wishlist`);
			}
			catch (err) {
				message.error(err.message);
			}
			finally {
				self.isLoading = false;
				self.selectedRows = [];
				self.closeCopyModal();
			}
		}),
		openCopyModal() {
			self.showCopyModal = true;
			self.fetchWishlists();
		},
		closeCopyModal() {
			self.showCopyModal = false;
			self.copyToWishlist = null;
		},
		setCopyToWishlist(wishlist) {
			self.copyToWishlist = wishlist;
		},
		clearCopyToWishlist() {
			self.copyToWishlist = null;
		},
		addCustomWish: flow(function* addCustomWish() {
			self.isLoading = true;
			self.customWish.wishlistId = self.wishlist.id;
			try {
				const { data } = yield request.post(`${self.baseURL}/items`, self.customWish);
				if (!data.success) {
					throw new Error(data.data);
				}
				message.success('Successfully Added Custom Wish');
				self.fetchItems();
			}
			catch (err) {
				message.error(err.message);
			}
			finally {
				self.closeCustomWishModal();
			}
		}),
		openCustomWishModal() {
			self.showCustomWishModal = true;
		},
		closeCustomWishModal() {
			self.showCustomWishModal = false;
		},
		openItemDetailsModal(item) {
			self.itemDetails = item;
			self.showItemDetailsModal = true;
		},
		closeItemDetailsModal() {
			self.itemDetails = undefined;
			self.showItemDetailsModal = false;
		},
		setMostWanted(mostWanted) {
			self.customWish.mostWanted = mostWanted;
		},
		setLink(link) {
			self.customWish.externalLink = link;
		},
		setName(name) {
			self.customWish.title = name;
		},
		setQuantity(quantity) {
			self.customWish.quantity = quantity;
		},
		setNotes(notes) {
			self.customWish.notes = notes;
		},
		setSource(source) {
			self.customWish.source = source;
		},
		setPrice(price) {
			self.customWish.price = price;
		},
		updateWishlist: flow(function* updateWishlist() {
			try {
				const { data } = yield request.put(`${self.baseURL}/wishlists/${self.wishlist.id}`, self.wishlistToUpdate);
				if (!data.success) {
					throw new Error(data.data);
				}
				self.fetchWishlist(self.wishlist.id);
			}
			catch (err) {
				message.error(err.message);
			}
			finally {
				self.closeUpdateWishlistModal();
			}
		}),
		fetchOccasions: flow(function* fetchOccasions() {
			const { data } = yield request.get(`${self.baseURL}/occasions`);
			if (!data.success) {
				throw new Error(data.data);
			}
			self.setOccasions(data.data);
		}),
		setOccasions(data) {
			self.occasionList = data.map(occasion => {
				return {
					label: occasion.name,
					value: occasion.id,
				};
			});
		},
		openUpdateWishlistModal() {
			self.fetchOccasions();
			self.wishlistToUpdate = getSnapshot(self.wishlist);
			self.showUpdateWishlistModal = true;
		},
		closeUpdateWishlistModal() {
			self.showUpdateWishlistModal = false;
			self.wishlistToUpdate = {};
		},
		setWishlistName(name) {
			self.wishlistToUpdate.name = name;
		},
		setWishlistIsPublished(isPublished) {
			self.wishlistToUpdate.isPublished = isPublished;
		},
		setWishlistDescription(description) {
			self.wishlistToUpdate.description = description;
		},
		setWishlistOccasion(occasion) {
			self.wishlistToUpdate.occasionId = occasion;
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
	model: WishlistDetailsModel,
	initialValues: {},
	stores: {},
};
