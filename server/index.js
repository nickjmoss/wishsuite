require('module-alias/register');
const express = require('express');
const cors = require('cors');
const app = express();
const fallback = require('express-history-api-fallback');
const path = require('path');
const helmet = require('helmet');
const PORT = process.env.PORT || 4000;
const router = require('@router');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const { redisClient } = require('./utils/redisConnector');

app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));

const root = path.join(__dirname, '/../public/');

app.use(cors());

// Configure session middleware
app.use(session({
	store: new RedisStore({
		client: redisClient,
		ttl: 86400,
		logErrors: true,
	}),
	secret: process.env.SESSION_SECRET,
	name: 'wishSuite',
	resave: false,
	saveUninitialized: false,
	rolling: true,
	cookie: {
		secure: false, // if true only transmit cookie over https
		httpOnly: true, // if true prevent client side JS from reading the cookie
		maxAge: 1800000, // 30 minutes
	},
}));

app.use(helmet({
	contentSecurityPolicy: false,
}));

app.use(router);

app.use(express.static(root));
app.use(fallback('index.html', { root: root }));

app.listen(PORT, () => {
	console.info(`Server is listening on ${PORT}`);
});
