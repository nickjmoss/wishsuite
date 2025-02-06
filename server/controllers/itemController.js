const prisma = require('@prismaClient');

exports.addItem = async function (req, res) {
	try {
		const data = await prisma.item.create({
			data: req.body,
		});

		if (!data) {
			throw new Error('Could not add item to wishlist');
		}

		return res.status(200).send({ success: true, message: 'Successfully added item to wishlist', data: {} });
	}
	catch (err) {
		console.error(err);
		return res.status(200).send({ success: false, message: 'Could not add item to wishlist', data: err.message });
	}
};


exports.deleteItems = async function (req, res) {
	try {
		const data = await prisma.item.deleteMany({
			where: {
				id: {
					in: req.body,
				},
			},
		});

		if (!data.count) {
			throw new Error('Could not delete item(s)');
		}

		return res.status(200).send({ success: true, message: 'Successfully deleted item(s)', data: {} });
	}
	catch (err) {
		console.error(err);
		return res.status(200).send({ success: false, message: 'Could not delete item(s)', data: err.message });
	}
};

exports.fetchItems = async function (req, res) {
	const {
		wishlist_id,
		searchTerm,
		sortOrder,
		sortColumn,
		filter,
		currentPage,
		pageSize,
		isOwnItems,
	} = req.query;

	const whereClause = {
		wishlistId: wishlist_id,
		deletedAt: null,
	};

	if (searchTerm) {
		whereClause.title = {
			contains: searchTerm,
			mode: 'insensitive',
		};
	}

	if (filter && filter !== 'all' && filter !== 'Pending') {
		whereClause.status = filter;
	}

	let orderBy = {
		createdAt: 'desc',
	};
	if (sortColumn && sortOrder && sortColumn !== 'status') {
		orderBy = {
			[sortColumn]: sortOrder,
		};
	}

	let skipVal;
	let takeVal;
	if (currentPage && pageSize) {
		skipVal = Number(pageSize) * Number(currentPage - 1);
		takeVal = Number(pageSize);
	}

	const total = await prisma.item.count({
		where: whereClause,
	});

	const data = await prisma.item.findMany({
		where: whereClause,
		include: {
			reserver: {
				select: {
					id: true,
					firstName: true,
					lastName: true,
					fullName: true,
					email: true,
					avatarUrl: true,
				},
			},
		},
		skip: skipVal,
		take: takeVal,
		orderBy,
	});

	let dataToReturn = data.map(item => {
		item.price = Number(item.price);
		item.reviews = Number(item.reviews);
		item.quantity = Number(item.quantity);

		if (isOwnItems) {
			item.status = item.status === 'Reserved' ? 'Pending' : item.status;
		}

		return item;
	});

	if (isOwnItems && sortColumn === 'status' && sortOrder) {
		dataToReturn.sort((a, b) => {
			if (a.status > b.status) {
				return sortOrder === 'asc' ? 1 : -1;
			}
			else if (a.status < b.status) {
				return sortOrder === 'asc' ? -1 : 1;
			}

			return 0;
		});
	}

	if (isOwnItems && filter === 'Pending') {
		dataToReturn = dataToReturn.filter(item => item.status === 'Pending');
	}

	return res.status(200).send({ success: true, message: 'Successfully fetched items', data: dataToReturn, count: total });
};

exports.copyItems = async function (req, res) {
	try {
		const { wishlist_id } = req.query;

		const items = await prisma.item.findMany({
			where: {
				id: {
					in: req.body,
				},
			},
			select: {
				title: true,
				description: true,
				price: true,
				quantity: true,
				mostWanted: true,
				reserved: true,
				status: true,
				externalLink: true,
				source: true,
				reviews: true,
				externalId: true,
				images: true,
				notes: true,
			},
		});

		const dataToCopy = items.map(item => {
			item.wishlistId = wishlist_id;

			return item;
		});

		const copyResponse = await prisma.item.createMany({
			data: dataToCopy,
		});

		if (!copyResponse.count) {
			throw new Error('Could not copy item(s)');
		}

		return res.status(200).send({ success: true, message: 'Successfully copied items', data: {} });
	}
	catch (err) {
		console.error(err);
		return res.status(200).send({ success: false, message: 'Could not copy item(s)', data: err.message });
	}
};

exports.updateItemStatus = async function(req, res) {
	try {
		const { status } = req.query;

		const updateData = {
			status,
		};

		if (status === 'Pending') {
			updateData.reserverId = null;
			updateData.reserved = false;
		}

		const data = await prisma.item.updateMany({
			where: {
				id: {
					in: req.body,
				},
			},
			data: updateData,
		});

		if (!data.count) {
			throw new Error('Could not update item statuses');
		}

		return res.status(200).send({ success: true, message: 'Successfully updates item statuses', data: {} });
	}
	catch (err) {
		console.error(err);
		return res.status(200).send({ success: false, message: 'Could update item statuses', data: err.message });
	}
};

exports.reserveItems = async function (req, res) {
	try {
		const { user_id } = req.params;
		const data = await prisma.item.updateMany({
			where: {
				id: {
					in: req.body,
				},
			},
			data: {
				reserved: true,
				status: 'Reserved',
				reserverId: user_id,
			},
		});

		if (!data) {
			throw new Error('Could not reserve items');
		}

		return res.status(200).send({ success: true, message: 'Successfully reserved items', data: {} });
	}
	catch (err) {
		console.error(err);
		return res.status(200).send({ success: false, message: 'Could reserve items', data: err.message });
	}
};

exports.unreserveItems = async function (req, res) {
	try {
		const data = await prisma.item.updateMany({
			where: {
				id: {
					in: req.body,
				},
			},
			data: {
				reserved: false,
				status: 'Pending',
				reserverId: null,
			},
		});

		if (!data) {
			throw new Error('Could not unreserve items');
		}

		return res.status(200).send({ success: true, message: 'Successfully unreserved items', data: {} });
	}
	catch (err) {
		console.error(err);
		return res.status(200).send({ success: false, message: 'Could unreserve items', data: err.message });
	}
};
