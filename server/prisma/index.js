const { PrismaClient } = require('@prisma/client');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
const prisma = new PrismaClient();
dayjs.extend(utc);
dayjs.extend(timezone);

// Cause soft deletes
prisma.$use(async (params, next) => {
	const deletedAt = dayjs().format();
	// Check incoming query type
	if (params.action === 'delete') {
	// Delete queries
	// Change action to an update
		params.action = 'update';
		params.args.data = { deletedAt };
	}
	if (params.action === 'deleteMany') {
	// Delete many queries
		params.action = 'updateMany';
		if (params.args.data !== undefined) {
			params.args.data.deletedAt = deletedAt;
		}
		else {
			params.args.data = { deletedAt };
		}
	}

	return next(params);
});

module.exports = prisma;
