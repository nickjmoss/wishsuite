import { ExternalItemBaseModel } from '@app/js/baseModels/item.baseModel';
import { types, flow } from 'mobx-state-tree';
import request from '@request';
import { TableStateBaseModel } from '@app/js/baseModels/tableState.baseModel';

const { model, optional, array, boolean, number, maybeNull, string } = types;

const SearchResultsModel = model('SearchResultsModel', {
	itemsList: array(ExternalItemBaseModel),
	isLoading: optional(boolean, false),

	tableState: optional(TableStateBaseModel, {}),
	priceRange: optional(model({
		totalMax: maybeNull(number),
		totalMin: maybeNull(number),
		min: maybeNull(number),
		max: maybeNull(number),
	}), {}),
	showPriceRange: optional(boolean, false),
	priceRangeApplied: optional(boolean, false),
	brand: optional(string, ''),
	color: optional(string, ''),
})
	.views((self) => ({
		get pagination() {
			return self.tableState.pagination;
		},
		get sorter() {
			return self.tableState.sorter;
		},
		get minPrice() {
			return Math.min(...self.itemsList.map(item => item.price));
		},
		get maxPrice() {
			return Math.max(...self.itemsList.map(item => item.price));
		},
		get totalMin() {
			return self.priceRange.totalMin;
		},
		get totalMax() {
			return self.priceRange.totalMax;
		},
		get brands() {
			const brandSet = new Set();
			self.itemsList.forEach(item => brandSet.add(item.brand));
			return Array.from(brandSet.values());
		},
		get colors() {
			const colorSet = new Set();
			self.itemsList.forEach(item => item.color && colorSet.add(item.color));
			return Array.from(colorSet.values());
		},
	}))
	.actions((self) => ({
		searchForItems: flow(function* searchForItems() {
			self.isLoading = true;
			const searchParams = new URLSearchParams({
				searchTerm: self.tableState.searchTerm,
				pageSize: self.pagination.pageSize,
				currentPage: self.pagination.current,
				sortColumn: self.sorter.columnKey,
				sortOrder: self.sorter.order,
				priceRangeMax: self.priceRange.max,
				priceRangeMin: self.priceRange.min,
				brand: self.brand,
				color: self.color,
			});
			const { data } = yield request.get(`search?${searchParams}`);
			self.itemsList = data.data.items;
			self.setPageTotal(data.data.count);
			self.priceRange.totalMax = Math.ceil(self.maxPrice);
			self.priceRange.totalMin = Math.floor(self.minPrice);
			self.isLoading = false;
		}),
		setPageTotal(pageTotal) {
			self.tableState.pagination.total = pageTotal;
		},
		setSearchTerm(searchTerm) {
			self.tableState.searchTerm = searchTerm;
		},
		onPageChange(currentPage, pageSize) {
			self.tableState.pagination.current = currentPage;
			self.tableState.pagination.pageSize = pageSize;

			self.searchForItems();
		},
		onSort(node) {
			if (node) {
				self.tableState.sorter.columnKey = node.col;
				self.tableState.sorter.order = node.direction;
			}
			else {
				self.tableState.sorter.columnKey = '';
				self.tableState.sorter.order = null;
			}

			self.searchForItems();
		},
		setPriceRange([min, max]) {
			self.priceRange.min = min;
			self.priceRange.max = max;
		},
		openPriceRange() {
			if (self.showPriceRange) {
				self.closePriceRange();
			}
			else {
				self.showPriceRange = true;
			}
		},
		closePriceRange() {
			self.showPriceRange = false;
		},
		cancelPriceRange() {
			self.closePriceRange();
			self.priceRange.min = null;
			self.priceRange.max = null;
		},
		applyPriceRange() {
			self.closePriceRange();
			self.priceRangeApplied = true;
			self.searchForItems();
		},
		resetPriceRange() {
			self.priceRangeApplied = false;
			self.cancelPriceRange();
			self.searchForItems();
		},
		setBrand(brand) {
			self.brand = brand;
			self.searchForItems();
		},
		clearBrand() {
			self.brand = '';
			self.searchForItems();
		},
		setColor(color) {
			self.color = color;
			self.searchForItems();
		},
		clearColor() {
			self.color = '';
			self.searchForItems();
		},
	}));

export default {
	model: SearchResultsModel,
	initialValues: {},
	stores: {},
};
