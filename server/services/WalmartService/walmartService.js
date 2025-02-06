const NodeRSA = require('node-rsa');
const axios = require('axios');
const config = require('../../config/config.json')[process.env.NODE_ENV];

const keyData = {
    consumerId: '',
    privateKey: ``,
    keyVer: 1,
};

class WalmartService {
    constructor() {}

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

        const { data } = await api.get(
            `items/${productId}?publisherId=3967146`,
        );

        return this.mapWalmartFields(data);
    }

    mapWalmartFields(payload) {
        if (payload.items) {
            return {
                totalResults: payload.totalResults,
                items: payload.items.map((item) => {
                    return {
                        title: item.name,
                        description:
                            item.shortDescription || item.longDescription,
                        price: item.salePrice,
                        externalLink: item.productTrackingUrl,
                        source: 'Walmart',
                        externalId: String(item.itemId),
                        reviews: Number(item.customerRating) || 0,
                        images: item.imageEntities,
                        brand: item.brandName,
                        color: item.color,
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

    async searchProducts(searchTerm, pageSize, currentPage, brand, color) {
        const api = await this.getApi();

        let filterString = '&facet=on';

        if (brand) {
            filterString += `&facet.filter=brand:${brand}`;
        }

        if (color) {
            filterString += `&facet.filter=color:${color}`;
        }

        const { data } = await api.get(`
			search?query=${searchTerm}&start=${
            pageSize * (currentPage - 1) + 1
        }&numItems=${pageSize}&publisherId=3967146${filterString}
		`);

        // Prevent more pages since Walmart does not allow a starting index to be greater than 1000
        if (data.totalResults > Math.floor(1000 / pageSize) * pageSize) {
            data.totalResults = Math.floor(1000 / pageSize) * pageSize;
        }

        return this.mapWalmartFields(data);
    }
}

exports.WalmartService = new WalmartService();
