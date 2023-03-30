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

	let orderBy;
	if (sortColumn && sortOrder) {
		if (sortColumn === 'items') {
			orderBy = {
				[sortColumn]: {
					_count: sortOrder,
				},
			};
		}
		else {
			orderBy = {
				[sortColumn]: sortOrder,
			};
		}
	}

	const data = await prisma.wishlist.findMany({
		where: whereClause,
		include: {
			occasion: true,
			items: true,
		},
		skip: Number(pageSize) * Number(currentPage - 1),
		take: Number(pageSize),
		orderBy,
	});

	return res.status(200).send({ success: true, message: 'Successfully fetched wishlists', data: data });
};

exports.createWishlist = async function (req, res) {
	console.log(req.body);
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
