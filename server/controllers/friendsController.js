const prisma = require('@prismaClient');

exports.fetchFriends = async function (req, res) {
	const { user_id } = req.params;
	const {
		searchTerm,
		currentPage,
		pageSize,
		sortColumn,
		sortOrder,
	} = req.query;

	const whereClause = {
		followerId: user_id,
		deletedAt: null,
	};

	if (searchTerm) {
		whereClause.friends = {
			OR: [
				{
					firstName: {
						contains: searchTerm,
						mode: 'insensitive',
					},
				},
				{
					lastName: {
						contains: searchTerm,
						mode: 'insensitive',
					},
				},
				{
					email: {
						contains: searchTerm,
						mode: 'insensitive',
					},
				},
			],
		};
	}

	let orderBy;
	if (sortColumn && sortOrder) {
		orderBy = {
			friends: {
				[sortColumn]: sortOrder,
			},
		};
	}

	const data = await prisma.friend.findMany({
		where: whereClause,
		select: {
			friends: {
				select: {
					id: true,
					firstName: true,
					fullName: true,
					lastName: true,
					email: true,
					avatarUrl: true,
				},
			},
		},
		skip: Number(pageSize) * Number(currentPage - 1),
		take: Number(pageSize),
		orderBy,
	});

	const dataToReturn = data.map(obj => {
		const { friends } = obj;
		return {
			id: friends.id,
			fullName: `${friends.firstName} ${friends.lastName}`,
			email: friends.email,
			avatarUrl: friends.avatarUrl,
		};
	});

	return res.status(200).send({ success: true, message: 'Successfully fetched friends', data: dataToReturn });
};


exports.fetchPotentialFriends = async function (req, res) {
	const { user_id } = req.params;
	const { searchTerm } = req.query;

	if (!searchTerm) {
		return res.status(200).send({ success: true, message: 'Successfully fetched potential friends', data: [] });
	}

	const data = await prisma.$queryRaw`
		SELECT
			u.id,
			u.first_name,
			u.last_name,
			concat(u.first_name, ' ', u.last_name) full_name,
			u.email,
			u."avatarUrl",
			f.follower_id IS NOT NULL is_following
		FROM "user" u
		LEFT JOIN friend f
			ON f.user_id = u.id AND f.follower_id = ${user_id} and f.deleted_at IS NULL
		WHERE 
			(u.id <> ${user_id})
			AND
			(
				u.first_name ILIKE '%' || ${searchTerm} || '%'
				OR
				u.last_name ILIKE '%' || ${searchTerm} || '%'
				OR
				u.email ILIKE '%' || ${searchTerm} || '%'
			)
		;
	`;
	return res.status(200).send({ success: true, message: 'Successfully fetched potential friends', data: data });
};


exports.followFriend = async function (req, res) {
	try {
		const { user_id, friend_id } = req.params;

		const data = await prisma.friend.create({
			data: {
				userId: friend_id,
				followerId: user_id,
			},
		});

		if (!data) {
			throw new Error('Could not follow user');
		}

		return res.status(200).send({ success: true, message: 'Successfully followed user', data: {} });
	}
	catch (err) {
		console.error(err);
		return res.status(200).send({ success: false, message: 'Could not follow friend', data: err.message });
	}
};

exports.unfollowFriend = async function (req, res) {
	try {
		const { user_id, friend_id } = req.params;

		const data = await prisma.friend.findFirst({
			where: {
				userId: friend_id,
				followerId: user_id,
			},
		});

		const deleteRes = await prisma.friend.delete({
			where: {
				id: data.id,
			},
		});

		if (!deleteRes) {
			throw new Error('Could not follow user');
		}

		return res.status(200).send({ success: true, message: 'Successfully unfollowed friend', data: {} });
	}
	catch (err) {
		console.error(err);
		return res.status(200).send({ success: false, message: 'Could not unfollow friend', data: err.message });
	}
};

exports.fetchSingleFriend = async function (req, res) {
	const { friend_id } = req.params;
	const data = await prisma.user.findFirst({
		where: {
			id: friend_id,
		},
		select: {
			id: true,
			firstName: true,
			lastName: true,
			email: true,
			avatarUrl: true,
		},
	});

	data.fullName = `${data.firstName} ${data.lastName}`;

	return res.status(200).send({ success: true, message: 'Successfully fetched friend', data: data });
};
