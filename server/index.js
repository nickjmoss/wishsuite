const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
const PORT = 4000;

const root = path.join(__dirname, '/../public/');

app.use(cors());

app.get('/api', (req, res) => {
	res.send("Hey I am your api!");
})

app.use(express.static(path.resolve('./public')));

app.listen(PORT, () => {
	console.info(`Server is listening on ${PORT}`);
})
