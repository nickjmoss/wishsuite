const prisma = require('@prismaClient');

exports.fetchWishlists = async function (req, res) {
	const { user_id } = req.params;
	const data = await prisma.wishlist.findMany({
		where: {
			ownerId: user_id,
			deletedAt: null,
		},
	});

	return res.status(200).send({ success: true, message: 'Successfully fetched wishlists', data: data });
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
