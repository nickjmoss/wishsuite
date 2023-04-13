const prisma = require('@prismaClient');

exports.fetchWishlists = async function (req, res) {
	const { user_id } = req.params;
	const {
		searchTerm,
		sortOrder,
		sortColumn,
		currentPage,
		pageSize,
		filter,
	} = req.query;

	const whereClause = {
		ownerId: user_id,
		deletedAt: null,
	};

	if (searchTerm) {
		whereClause.name = {
			contains: searchTerm,
			mode: 'insensitive',
		};
	}

	if (filter && filter !== 'all') {
		whereClause.isPublished = filter === 'published' ? true : false;
	}

	let orderBy = {
		createdAt: 'desc',
	};
	if (sortColumn && sortOrder) {
		if (sortColumn === 'items') {
			orderBy = {
				[sortColumn]: {
					_count: sortOrder,
				},
			};
		}
		else if (sortColumn === 'occasion') {
			orderBy = {
				[sortColumn]: {
					name: sortOrder,
				},
			};
		}
		else {
			orderBy = {
				[sortColumn]: sortOrder,
			};
		}
	}

	let skipVal;
	let takeVal;
	if (currentPage && pageSize) {
		skipVal = Number(pageSize) * Number(currentPage - 1);
		takeVal = Number(pageSize);
	}

	const data = await prisma.wishlist.findMany({
		where: whereClause,
		include: {
			occasion: null,
			items: {
				where: {
					deletedAt: null,
				},
			},
		},
		skip: skipVal,
		take: takeVal,
		orderBy,
	});

	const dataToReturn = data.map(wishlist => {
		wishlist.items = wishlist.items.map(item => {
			item.price = Number(item.price);
			item.reviews = Number(item.reviews);
			item.quantity = Number(item.quantity);

			return item;
		});

		return wishlist;
	});

	return res.status(200).send({ success: true, message: 'Successfully fetched wishlists', data: dataToReturn });
};

exports.createWishlist = async function (req, res) {
	try {
		const data = await prisma.wishlist.create({
			data: req.body,
		});

		if (!data) {
			throw new Error('Could not create wishlist');
		}

		return res.status(200).send({ success: true, message: 'Successfully created wishlist', data: data });
	}
	catch (err) {
		console.error(err);
		return res.status(400).send({ success: false, message: 'Could not create wishlist', data: err.message });
	}
};

exports.deleteWishlist = async function (req, res) {
	try {
		const { wishlist_id } = req.params;
		const data = await prisma.wishlist.delete({
			where: {
				id: wishlist_id,
			},
		});

		if (!data) {
			throw new Error('Could not delete wishlist');
		}

		return res.status(200).send({ success: true, message: 'Successfully deleted wishlist', data: data });
	}
	catch (err) {
		console.error(err);
		return res.status(400).send({ success: false, message: 'Could not delete wishlist', data: err.message });
	}
};

exports.fetchSingleWishlist = async function (req, res) {
	const { wishlist_id } = req.params;
	const data = await prisma.wishlist.findFirst({
		where: {
			id: wishlist_id,
		},
		include: {
			occasion: true,
			items: {
				where: {
					deletedAt: null,
				},
				orderBy: {
					createdAt: 'desc',
				},
			},
		},
	});

	data.items = data.items.map(item => {
		item.price = Number(item.price);
		item.reviews = Number(item.reviews);
		item.quantity = Number(item.quantity);

		return item;
	});

	return res.status(200).send({ success: true, message: 'Successfully fetched a wishlist', data: data });
};

