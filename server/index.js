require('module-alias/register');
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const fallback = require('express-history-api-fallback');
const path = require('path');
const PORT = process.env.PORT || 4000;
const prisma = require('@prismaClient');
const { WalmartService } = require('./walmart');
// const router = require('@router');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const { redisClient } = require('./utils/redisConnector');

async function main() {
	console.log('test DB:', await prisma.wishlist.findMany());
	console.log(await redisClient.setAsync('test', 'Nick Moss'));
	console.log(await redisClient.getAsync('test'));
}

main();

app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));

const root = path.join(__dirname, '/../public/');

app.use(cors());


// Configure session middleware
app.use(session({
	store: new RedisStore({ client: redisClient }),
	secret: 'secret$%^134',
	resave: false,
	saveUninitialized: false,
	cookie: {
		secure: false, // if true only transmit cookie over https
		httpOnly: false, // if true prevent client side JS from reading the cookie
		maxAge: 1000 * 60 * 10, // session max age in miliseconds
	},
}));

// app.use(router);

// app.get('/api', (req, res) => {
// 	res.send("Hey I am your api!");
// });

// app.get('/walmart', async (req, res) => {
// 	return res.json(await WalmartService.searchProducts('playstation 5'));
// });

app.use(express.static(root));
app.use(fallback('index.html', { root: root }));

app.listen(PORT, () => {
	console.info(`Server is listening on ${PORT}`);
});
