const prisma = require('@prismaClient');

exports.createOccasion = async function(req, res) {
	const {
		owner_id,
		name,
		description,
		celebrate_date,
		original_date,
		repeat,
	} = req.body || {};

	return res.status(200).send({ success: true, message: 'Successfully created occasion', data: { owner_id, name, description, celebrate_date, original_date, repeat } })
};
