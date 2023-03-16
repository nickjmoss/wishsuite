const prisma = require('@prismaClient');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

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
				celebrate_date: dayjs(celebrate_date).tz('America/Denver').startOf('day').format(),
				original_date: original_date ? dayjs(original_date).tz('America/Denver').startOf('day').format() : original_date,
				repeat,
			},
		});

		return res.status(200).send({ success: true, message: 'Successfully created occasion', data: newOccasion });
	}
	catch (err) {
		return res.status(200).send({ success: false, message: 'Could not create occasion', data: err.message });
	}
};

exports.getAllOccasions = async function (req, res) {

};
