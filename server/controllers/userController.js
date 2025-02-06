const prisma = require('@prismaClient');
const { CloudinaryService } = require('../services/CloudinaryService/cloudinaryService');

exports.fetchUser = async function(req, res) {
	try {
		const { user_id } = req.params;

		const user = await prisma.user.findUnique({
			where: {
				id: user_id,
			},
			select: {
				id: true,
				firstName: true,
				lastName: true,
				fullName: true,
				email: true,
				avatarUrl: true,
			},
		});

		if (!user) {
			throw new Error('Could not fetch user');
		}

		const dataToReturn = {
			...user,
			fullName: `${user.firstName} ${user.lastName}`,
		};

		return res.status(200).send({ success: true, message: 'Successfully fetched user', data: dataToReturn });
	}
	catch (err) {
		return res.status(200).send({ success: false, message: 'Could not fetch user', data: err.message });
	}
};

exports.updateUser = async function(req, res) {
	try {
		const { user_id } = req.params;
		const { firstName, lastName, email, avatarUrl } = req.body || {};

		const data = {
			firstName,
			lastName,
			email,
			avatarUrl,
		};

		const user = await prisma.user.update({
			where: {
				id: user_id,
			},
			data: data,
			select: {
				id: true,
				firstName: true,
				lastName: true,
				fullName: true,
				email: true,
				avatarUrl: true,
			},
		});

		if (!user) {
			throw new Error();
		}

		return res.status(200).send({ success: true, message: 'Successfully updated user', data: user });
	}
	catch (err) {
		return res.status(200).send({ success: false, message: 'Could not update user', data: err.message });
	}
};

exports.getSignature = async function(req, res) {
	const { user_id } = req.params;
	return res.status(200).send({ success: true, message: 'Successfully generated signature', data: CloudinaryService.uploadSignature(user_id) });
};

exports.deleteUser = async function(req, res) {
	try {
		req.session.save();
		req.session.destroy();
		const { user_id } = req.params;

		const data = await prisma.user.delete({
			where: {
				id: user_id,
			},
		});

		if (!data) {
			throw new Error('Could not delete user account');
		}

		return res.status(200).send({ success: true, message: 'Successfully delete user account', data: {} });
	}
	catch (err) {
		return res.status(200).send({ success: false, message: 'Could not delete user account', data: err.message });
	}
};
