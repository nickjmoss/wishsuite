const prisma = require('@prismaClient');
const passwordManager = require('@utils/passwordManager');

// exports.isAuthenticated = async function(req, res, next) {

// }

exports.fetchSession = async function(req, res) {
	if (!req.session.user) {
		return res.status(200).send({ success: false, message: 'No user is currently logged in', data: {} });
	}

	const user = await prisma.user.findUnique({ where: { id: req.session.user } });

	delete user.password;

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

		return res.status(200).send({ success: true, message: 'Successfully logged in', data: data });
	}
	catch (err) {
		return res.status(200).send({ success: false, message: 'Could not login', data: err.message });
	}
};

exports.logoutUser = async function(req, res) {
	req.session.destroy();
	return res.status(200).send({ success: true, message: 'Successfully logged out.', data: {} });
};
