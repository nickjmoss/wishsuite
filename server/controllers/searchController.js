const { WalmartService } = require('@server/services/WalmartService/walmartService');

exports.searchItems = async function(req, res) {
	const {
		searchTerm,
		pageSize,
		currentPage,
		sortColumn,
		sortOrder,
		brand,
		color,
	} = req.query;

	const { totalResults, items } = await WalmartService.searchProducts(
		searchTerm,
		pageSize,
		currentPage,
		brand,
		color,
	);

	if (!items) {
		return res.status(200).send({ success: true, message: 'Successfully fetched products', data: { count: totalResults, items: [] } });
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
		items.sort(sortFunc);
	}

	return res.status(200).send({ success: true, message: 'Successfully fetched products', data: { count: totalResults, items } });
};

exports.getItemByExternalId = async function (req, res) {
	const { external_id } = req.params;
	const results = await WalmartService.getProductById(external_id);
	return res.status(200).send({ success: true, message: 'Successfully fetched single product', data: results });
};
