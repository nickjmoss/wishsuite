const Redis = require('ioredis');
const util = require('util');

console.log(process.env.REDIS_HOST);
console.log(process.env.REDIS_PORT);

const redisClient = new Redis({
	host: process.env.REDIS_HOST,
	port: process.env.REDIS_PORT,
});

redisClient.getAsync = util.promisify(redisClient.get).bind(redisClient);
redisClient.setAsync = util.promisify(redisClient.set).bind(redisClient);
redisClient.delAsync = util.promisify(redisClient.del).bind(redisClient);

const get = async function getAsync(key = '', namespace = '') {
	const fullKey = `${namespace}${key}`;
	return await redisClient.getAsync(fullKey);
};

const set = async function setAsync(key = '', value = '',  namespace = '') {
	const fullKey = `${namespace}${key}`;
	return await redisClient.setAsync(fullKey, value);
};

const del = async function delAsync(keys = [],  namespace = '') {
	let fullKeys;
	if (typeof keys === 'object' && keys instanceof Array) {
		fullKeys = keys.map(key => `${namespace}${key}`);
	} else if (typeof keys === 'string') {
		fullKeys = [`${namespace}${keys}`];
	} else {
		throw new Error('keys input needs to be an array of strings or a single string');
	}
	return await redisClient.delAsync(fullKeys);
};

module.exports = {
	get,
	set,
	del,
	redisClient,
};
