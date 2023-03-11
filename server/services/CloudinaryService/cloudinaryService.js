const cloudinary = require('cloudinary').v2;
const config = require('../../config/cloudinary.json');

class CloudinaryService {
	constructor () { }

	uploadSignature(public_id) {
		const timestamp = Math.round((new Date).getTime() / 1000);
		const signature = cloudinary.utils.api_sign_request({
			timestamp,
			folder: 'profile_pictures',
			public_id,
		}, config.api_secret);

		return { timestamp, signature, api_key: config.api_key, cloudinary_url: config.cloudinary_url };
	}
}

exports.CloudinaryService = new CloudinaryService();
