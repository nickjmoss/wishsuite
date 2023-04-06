const prisma = require('@prismaClient');

exports.addItem = async function (req, res) {
	try {
		// const data = await prisma.item.create({
		// 	data: req.body,
		// });

		// if (!data) {
		// 	throw new Error('Could not add item to wishlist');
		// }

		return res.status(200).send({ success: true, message: 'Successfully added item to wishlist', data: req.body });
	}
	catch (err) {
		console.error(err);
		return res.status(200).send({ success: false, message: 'Could not add item to wishlist', data: err.message });
	}
};
