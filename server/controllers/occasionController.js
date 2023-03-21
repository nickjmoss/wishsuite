const prisma = require('@prismaClient');

exports.createOccasion = async function(req, res) {
	try {
		const {
			owner_id,
			name,
			description,
			celebrate_date,
			original_date,
			repeat,
		} = req.body || {};

		if (!owner_id || !name || !celebrate_date ) {
			throw new Error('Please provide values for all required fields');
		}

		const newOccasion = await prisma.occasion.create({
			data: {
				ownerId: owner_id,
				name,
				description,
				celebrate_date: celebrate_date,
				original_date: original_date,
				repeat,
			},
		});

		return res.status(200).send({ success: true, message: 'Successfully created occasion', data: newOccasion });
	}
	catch (err) {
		return res.status(200).send({ success: false, message: 'Could not create occasion', data: err.message });
	}
};

exports.editOccasion = async function (req, res) {
	const { occasion_id } = req.params;
	try {
		const {
			owner_id,
			name,
			description,
			celebrate_date,
			original_date,
			repeat,
		} = req.body || {};

		const data = await prisma.occasion.update({
			where: {
				id: occasion_id,
			},
			data: {
				ownerId: owner_id,
				name,
				description,
				celebrate_date,
				original_date,
				repeat,
			},
		});

		return res.status(200).send({ success: true, message: 'Successfully edited occasion', data: data });
	}
	catch (err) {
		return res.status(200).send({ success: false, message: 'Could not edit occasion', data: err.message });
	}
};

exports.deleteOccasion = async function (req, res) {
	const { occasion_id } = req.params;
	await prisma.occasion.delete({
		where: {
			id: occasion_id,
		},
	});

	return res.status(200).send({ success: true, message: 'Successfully deleted occasion', data: {} });
};

exports.getAllOccasions = async function (req, res) {
	const { user_id } = req.params;
	const data = await prisma.occasion.findMany({ where: { ownerId: user_id, deletedAt: null } });

	return res.status(200).send({ success: true, message: 'Successfully fetched occasions', data: data });
};
