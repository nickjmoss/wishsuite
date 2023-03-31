import { ExternalItemBaseModel } from '@app/js/baseModels/item.baseModel';
import { types, flow } from 'mobx-state-tree';
import request from '@request';
import { TableStateBaseModel } from '@app/js/baseModels/tableState.baseModel';

const { model, optional, array, boolean } = types;

const SearchResultsModel = model('SearchResultsModel', {
	itemsList: array(ExternalItemBaseModel),
	isLoading: optional(boolean, false),

	tableState: optional(TableStateBaseModel, {}),
})
	.views((self) => ({
		get pagination() {
			return self.tableState.pagination;
		},
	}))
	.actions((self) => ({
		searchForItems: flow(function* searchForItems(searchTerm) {
			self.isLoading = true;
			const { data } = yield request.get(`search?searchTerm=${searchTerm}`);
			self.itemsList = data.data;
			self.isLoading = false;
		}),
	}));

export default {
	model: SearchResultsModel,
	initialValues: {},
	stores: {},
};
