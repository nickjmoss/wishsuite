const NodeRSA = require('node-rsa');
const axios = require('axios');
const config = require('../../config/config.json')[process.env.NODE_ENV];

const keyData = {
	consumerId: '333c40d7-6a5d-44d2-bae5-d9aa4a5969a2',
	privateKey: `-----BEGIN RSA PRIVATE KEY-----
MIIEpQIBAAKCAQEA6rwzv4astqHRQATze2oe6qXyMdoo64FLuqwKdAjs3oggBQWn
e8NRID12yuWLkXdxTT1JyOPt3kFpbhoMJPuLcUvC8zt17qwJOBeziYlme1vmgzWU
2mYvZ2tCQNQYe+nPQenckcTgeFqK5h6MZ3wSQikdTtFY9Farlb3T5IyRjtB5yQEg
lOn5k4nuzyGBszBsNd3ebUuHYNnULRdXvxQTojK7xCig2Y8f5ni0pjhLrUM8eNpe
VmdmxsANqH3Zs395y5Zwnr+sZ9EQ3RdpuhhNn6E2hwH8h6j8ePOISYdsRN3XPWTe
XOLd7noJ4BF46MaQ/rINp4wQP0aljV9PJl0ZsQIDAQABAoIBAEbSQ5asjl2H0vdK
xx9cNDm9maYa2S+80dlfYMQDkVvOnEKHozF/C3H7uWSb/xEDhYa1UBaxVioxeBrE
9xcNYdPr9MSoEvvQofNvizaa4vWjE5hQyTlfjTvZq6Kdm0l/kI2lfmvoh4UoZDHr
05bBY0zc1L/b/8ewgpJqNI0HMD9y6OPaftRxbmdE7oS7wqvYJAupG18r0QTFqYCf
WrZBZmwBFOS+phf+zx7FfsR7ft0djEwGrPhmTdopNAzoZpxp5lJEKIYBx8EUOCFO
nNogkT47kIbwtrjwoaJwtBGDgCD+r+hxqCkPrJgnbGZeHMo1sZSwC9sUwMheK9Jz
e5qqxKUCgYEA+1POQizYBNBKmqumKGlvPbooQ1nqVZLKOHia+3gCQcFlwDETlwlB
3qHVC6SKLqxlWvpUaqLxbE3WSitL7hXVrCAgFWl50f/jOz4pqpEgBWqVcEtmpgBk
FQx6M84LAqkCiqhNVelTpXb6gqRIPIcraS+8F/AVkjV0ziwAi9YsKtsCgYEA7xls
/eGgKtiREMRbY/YlSe7vbSmHinvgvJl69TZGpcaM/L30mGp8/SWPBAlulAD6WIiz
LPozDWhdwKpIi4AIuI0YdG02cwoTs5o01hr7Ud5D3RcyZPf+X+GWcOyLWFF3QmQ1
uvyrdlr9HpK32+jOBtqAV7yBGP+yHmzWU8lKxWMCgYEAprTlOJHkS/UZt1SqJ14g
UpJ7iIlI3bA7gI/HRYxJ+vHcm0oyU1npnlI8LbfbjK//nwQzIHSqrQtIW/QyLl+/
VqgMgAdxrbENOcu2+ZO/6LfVHiJ1mSDjQe7/1AMU3JPcwrp2ackWGcg8zJFJ9RQ3
4FKwcjRnKo9YxjT7u8W5kEcCgYEA7Z48JjfUAKDH0n0CQl6+gjJ2Oeua63LfTy/M
9eNh5KBlP0zcx5iU7NQlxKJHBcnPAqugPePNVtbQzYetnw24HQkEM7jR8xQhrk1j
kyCvgZY9pXzHNXcMk2dTJpi+hyA3QIDssQ8oq/ATPA4dsOw1zLPb9tW9CwYak4gg
nJYgu/cCgYEAg3tUt2HkbDPS9cu9rIbZ8N1Ijb05D2KZe5ET3OBOy959BYL9LBK0
dS9/Fn8PEbp9vCWxluvv4/TkvPECoCbyVTMI8FULbVxg2aIyS3KFAO0YG3zBZNU0
PQbePwYJDEGx+Pf0+XcG+0m1YIhtfzIyo5I0SoMSAnm+cEH+/OedovI=
-----END RSA PRIVATE KEY-----`,
	keyVer: 1,
};

class WalmartService {
	constructor() { }

	async getApi() {
		const api = axios.create({
			baseURL: config.walmart_url,
			headers: this.generateWalmartHeaders(),
		});

		return api;
	}

	generateWalmartHeaders() {
		const { privateKey, consumerId, keyVer } = keyData;
		const hashList = {
			'WM_CONSUMER.ID': consumerId,
			'WM_CONSUMER.INTIMESTAMP': Date.now().toString(),
			'WM_SEC.KEY_VERSION': keyVer,
		};

		const sortedHashString = `${hashList['WM_CONSUMER.ID']}\n${hashList['WM_CONSUMER.INTIMESTAMP']}\n${hashList['WM_SEC.KEY_VERSION']}\n`;
		const signer = new NodeRSA(privateKey, 'pkcs1');
		const signature = signer.sign(sortedHashString);
		const signature_enc = signature.toString('base64');

		return {
			'WM_SEC.AUTH_SIGNATURE': signature_enc,
			'WM_CONSUMER.INTIMESTAMP': hashList['WM_CONSUMER.INTIMESTAMP'],
			'WM_CONSUMER.ID': hashList['WM_CONSUMER.ID'],
			'WM_SEC.KEY_VERSION': hashList['WM_SEC.KEY_VERSION'],
		};
	}

	async getProductById(productId) {
		const api = await this.getApi();

		const { data } = await api.get(`items/${productId}?publisherId=3967146`);

		return this.mapWalmartFields(data);
	}

	mapWalmartFields(payload) {
		if (payload.items) {
			return {
				totalResults: payload.totalResults,
				items: payload.items.map(item => {
					return {
						title: item.name,
						description: item.shortDescription || item.longDescription,
						price: item.salePrice,
						externalLink: item.productTrackingUrl,
						source: 'Walmart',
						externalId: String(item.itemId),
						reviews: Number(item.customerRating) || 0,
						images: item.imageEntities,
					};
				}),
			};
		}

		return {
			title: payload.name,
			description: payload.shortDescription || payload.longDescription,
			price: payload.salePrice,
			externalLink: payload.productTrackingUrl,
			source: 'Walmart',
			externalId: String(payload.itemId),
			reviews: Number(payload.customerRating) || 0,
			images: payload.imageEntities,
		};
	}

	async searchProducts(searchTerm, pageSize, currentPage) {
		const api = await this.getApi();

		const { data } = await api.get(`
			search?query=${searchTerm}&start=${(pageSize * (currentPage - 1)) + 1}&numItems=${pageSize}&publisherId=3967146
		`);

		return this.mapWalmartFields(data);
	}
}

exports.WalmartService = new WalmartService();
