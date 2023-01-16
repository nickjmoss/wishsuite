module.exports = {
	apps: [
		{
			name: 'WishSuite',
			script: 'server/index.js',
			env_production: {
				NODE_ENV: 'production',
				PORT: 4000,
			},
		},

	],
};
