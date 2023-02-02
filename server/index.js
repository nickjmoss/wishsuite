const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const fallback = require('express-history-api-fallback');
const path = require('path');
const PORT = process.env.PORT || 4000;
const prisma = require('./prisma');
const { WalmartService } = require('./walmart');
const session = require('express-session');
const redisStore = require('connect-redis')(session);
const { redisClient } = require('./utils/redisConnector');

async function main() {
	console.log('test DB:', await prisma.user.findMany());
	console.log(await redisClient.setAsync('test', 'Nick Moss'));
	console.log(await redisClient.getAsync('test'));
}

main();

app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));

const root = path.join(__dirname, '/../public/');

app.use(cors());

app.get('/api', (req, res) => {
	res.send("Hey I am your api!");
})

app.get('/walmart', async (req, res) => {
	return res.json(await WalmartService.searchProducts('playstation 5'));
})

app.use(express.static(root));
app.use(fallback('index.html', { root: root }));

app.listen(PORT, () => {
	console.info(`Server is listening on ${PORT}`);
})
