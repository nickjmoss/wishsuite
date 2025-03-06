const cloudinary = require('cloudinary').v2;

class CloudinaryService {
    constructor() {}

    uploadSignature(public_id) {
        const timestamp = Math.round(new Date().getTime() / 1000);
        const signature = cloudinary.utils.api_sign_request(
            {
                timestamp,
                folder: 'profile_pictures',
                public_id,
            },
            config.api_secret,
        );

        return {
            timestamp,
            signature,
            api_key: process.env.CLOUDINARY_API_KEY,
            cloudinary_url: `cloudinary://${process.env.CLOUDINARY_API_KEY}:${process.env.CLOUDINARY_API_SECRET}@dbtgm7sed`,
        };
    }
}

exports.CloudinaryService = new CloudinaryService();
