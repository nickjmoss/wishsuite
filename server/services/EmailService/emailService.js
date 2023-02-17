const hbs = require('nodemailer-express-handlebars');
const nodemailer = require('nodemailer');
const path = require('path');

class EmailService {
	constructor () { }

	getEmailClient() {
		const transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: 'wishsuite.dev@gmail.com',
				pass: 'ysjgctsuxynzdpyu',
			},
		});

		const handlebarOptions = {
			viewEngine: {
				partialsDir: path.resolve(__dirname, './views/'),
				defaultLayout: false,
			},
			viewPath: path.resolve(__dirname, './views/'),
		};

		transporter.use('compile', hbs(handlebarOptions));

		return transporter;
	}

	async sendEmail(emailOptions) {
		const client = this.getEmailClient();
		const res = await client.sendMail(emailOptions);
		if (res.rejected.length) {
			console.error('Could not send email.');
		}
	}
}

exports.EmailService = new EmailService();
