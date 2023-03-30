import { types } from 'mobx-state-tree';

const { model, maybeNull, optional, string, number, array } = types;

export const TableStateBaseModel = model('TableStateBaseModel', {
	searchTerm: optional(string, ''),
	pagination: optional(model('PaginationModel', {
		current: optional(number, 1),
		total: optional(number, 0),
		pageSize: optional(number, 10),
		hideOnSinglePage: true,
		position: array(string),
	}), {}),
	sorter: optional(model('SorterModel', {
		columnKey: optional(string, ''),
		order: maybeNull(string),
	})
		.views((self) => ({
			get sortOrder() {
				if (self.order) {
					return self.order === 'ascend' ? 'asc' : 'desc';
				}

				return '';
			},
		}))
	, {}),
});
