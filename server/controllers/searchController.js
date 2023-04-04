const { WalmartService } = require('@server/services/WalmartService/walmartService');

exports.searchItems = async function(req, res) {
	const {
		searchTerm,
		pageSize,
		currentPage,
		sortColumn,
		sortOrder,
	} = req.query;

	const resultSet = {
		count: 0,
		items: [],
	};

	const { totalResults, items } = await WalmartService.searchProducts(searchTerm, pageSize, currentPage, sortColumn, sortOrder);
	resultSet.items.push(...items);

	// Prevent more pages since Walmart does not allow a starting index to be greater than 1000
	if (totalResults < Math.floor(1000 / pageSize) * pageSize) {
		resultSet.count += totalResults;
	}
	else {
		resultSet.count = Math.floor(1000 / pageSize) * pageSize;
	}

	const sortFunc = (a, b) => {
		const ascending = sortOrder === 'asc';
		if (a[sortColumn] > b[sortColumn]) {
			return ascending ? 1 : -1;
		}
		else if (a[sortColumn] < b[sortColumn]) {
			return ascending ? -1 : 1;
		}
		else if (a[sortColumn] === b[sortColumn]) {
			return 0;
		}

		return ascending ? -1 : 1;
	};

	if (sortColumn || sortOrder) {
		resultSet.items.sort(sortFunc);
	}

	return res.status(200).send({ success: true, message: 'Successfully fetched products', data: resultSet });
};

exports.getItemByExternalId = async function (req, res) {
	const { external_id } = req.params;
	const results = await WalmartService.getProductById(external_id);
	return res.status(200).send({ success: true, message: 'Successfully fetched single product', data: results });
};
