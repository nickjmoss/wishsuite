const prisma = require('@prismaClient');
const passwordManager = require('@utils/passwordManager');
const { EmailService } = require('../services/EmailService/emailService');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
const crypto = require('crypto');

dayjs.extend(utc);
dayjs.extend(timezone);

// exports.isAuthenticated = async function(req, res, next) {

// }

exports.fetchSession = async function(req, res) {
	if (!req.session.user) {
		return res.status(200).send({ success: false, message: 'No user is currently logged in', data: {} });
	}

	const user = await prisma.user.findUnique({
		where: {
			id: req.session.user,
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

	return res.status(200).send({ success: true, message: 'Successfully fetched user.', data: user });
};

exports.createUser = async function(req, res) {
	try {
		const { firstName, lastName, email, password } = req.body;
		const data = await prisma.user.findFirst({
			where: {
				email: email,
				deletedAt: null,
			},
		});

		if (data) {
			throw new Error(`User with email: ${email} already exists. Try signing in.`);
		}

		if (!passwordManager.isValid(password)) {
			throw new Error('Please enter a stronger password');
		}

		const hashedPassword = await passwordManager.hash(password);
		const newUser = await prisma.user.create({
			data: {
				firstName,
				lastName,
				email,
				fullName: `${firstName} ${lastName}`,
				password: hashedPassword,
			},
		});

		delete newUser.password;

		req.session.user = newUser.id;

		return res.status(200).send({ success: true, message: 'Successfully created user', data: newUser });
	}
	catch (err) {
		return res.status(200).send({ success: false, message: 'Could not create user', data: err.message });
	}
};

exports.loginUser = async function(req, res) {
	try {
		const { email, password } = req.body;
		const data = await prisma.user.findFirst({
			where: {
				email: email,
				deletedAt: null,
			},
		});

		if (!data) {
			throw new Error('No account associated with that email. Please create an account.');
		}

		if (await passwordManager.compare(password, data.password)) {
			delete data.password;

			req.session.user = data.id;
		}
		else {
			throw new Error('Incorrect Password');
		}

		req.session.save();
		return res.status(200).send({ success: true, message: 'Successfully logged in', data: data });
	}
	catch (err) {
		return res.status(200).send({ success: false, message: 'Could not login', data: err.message });
	}
};

exports.logoutUser = async function(req, res) {
	req.session.save();
	req.session.destroy();
	return res.status(200).send({ success: true, message: 'Successfully logged out.', data: {} });
};

exports.forgotPassword = async function(req, res) {
	try {
		const { email } = req.body;

		const user = await prisma.user.findFirst({
			where: {
				email: email,
				deletedAt: null,
			},
			select: {
				id: true,
				email: true,
				firstName: true,
				lastName: true,
				fullName: true,
			},
		});

		if (!user) {
			throw new Error(`A user with the email: ${email} does not exist.`);
		}

		const previousToken = await prisma.token.findFirst({
			where: {
				userId: user.id,
				deletedAt: null,
			},
		});

		if (previousToken) {
			await prisma.token.update({
				where: {
					id: previousToken.id,
				},
				data: {
					deletedAt: dayjs().format(),
				},
			});
		}

		const token = crypto.randomBytes(32).toString('hex');

		const tokenHash = await passwordManager.hash(token);

		const expirationDate = dayjs().add(1, 'h').format();

		const tokenData = await prisma.token.create({
			data: {
				token: tokenHash,
				userId: user.id,
				expirationDate: expirationDate,
			},
		});

		const link =
			process.env.NODE_ENV === 'development'
				? `${req.protocol}://${req.host}:9090/auth/new-password?userId=${tokenData.userId}&token=${token}`
				: `${req.protocol}://${req.host}/auth/new-password?userId=${tokenData.userId}&token=${token}`;

		const result = await EmailService.sendEmail({
			to: email,
			template: 'password',
			subject: 'Password Recovery',
			context: {
				name: `${user.firstName} ${user.lastName}`,
				link: link,
			},
		});

		if (!result.success) {
			throw new Error('Could not send password reset email.');
		}

		return res.status(200).send({ success: true, message: 'Successfully sent password reset email', data: {} });
	}
	catch (err) {
		return res.status(200).send({ success: false, message: 'Could not send password reset email', data: err.message });
	}
};

async function isTokenValid(userId, token) {
	const data = await prisma.token.findFirst({
		where: {
			userId: userId,
			expirationDate: {
				gt: dayjs().format(),
			},
			deletedAt: null,
		},
		select: {
			token: true,
			id: true,
		},
	});

	if (!data) return { success: false, token_id: null };

	return { success: await passwordManager.compare(token, data.token), token_id: data.id };
}


exports.verifyToken = async function(req, res) {
	const { token, userId } = req.body;

	const { success } = await isTokenValid(userId, token);

	if (success) {
		return res.status(200).send({ success: true, message: 'Token is valid for password reset', data: {} });
	}

	return res.status(200).send({ success: false, message: 'No valid token for password reset', data: {} });
};

exports.newPassword = async function(req, res) {
	try {
		const { token, userId, password } = req.body;

		// Check if user exists
		const user = await prisma.user.findFirst({
			where: {
				id: userId,
				deletedAt: null,
			},
		});

		if (!user) {
			throw new Error('Could not find user.');
		}

		// Check if token is valid
		const { success, token_id } = await isTokenValid(userId, token);

		if (!success) {
			throw new Error('Your password reset link has expired, please request a new one.');
		}

		// Check if password is valid
		if (!passwordManager.isValid(password)) {
			throw new Error('Please enter a stronger password');
		}


		// Check if password is the same as previous password
		if (await passwordManager.compare(password, user.password)) {
			throw new Error('New password is same as old password.');
		}

		// Hash password and update user
		const hashedPassword = await passwordManager.hash(password);

		await prisma.user.update({
			where: {
				id: user.id,
			},
			data: {
				password: hashedPassword,
			},
		});

		// Delete token
		await prisma.token.update({
			where: {
				id: token_id,
			},
			data: {
				deletedAt: dayjs().format(),
			},
		});

		return res.status(200).send({ success: true, message: 'Successfully reset password', data: {} });
	}
	catch (err) {
		return res.status(200).send({ success: false, message: 'Could not reset password', data: err.message });
	}
};
