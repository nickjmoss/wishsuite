const { WalmartService } = require('@server/services/WalmartService/walmartService');

exports.searchItems = async function(req, res) {
	const { searchTerm } = req.query;
	const results = await WalmartService.searchProducts(searchTerm);
	return res.status(200).send({ success: true, message: 'Successfully fetched products', data: results });
};

exports.getItemByExternalId = async function (req, res) {
	const { external_id } = req.params;
	const results = await WalmartService.getProductById(external_id);
	return res.status(200).send({ success: true, message: 'Successfully fetched single product', data: results });
};
