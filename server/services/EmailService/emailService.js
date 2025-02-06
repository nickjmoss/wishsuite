const hbs = require('nodemailer-express-handlebars');
const nodemailer = require('nodemailer');
const path = require('path');

class EmailService {
    constructor() {}

    getEmailClient() {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'wishsuite.dev@gmail.com',
                pass: '',
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
    /*
	var mailOptions = {
    from: '"Adebola" <adebola.rb.js@gmail.com>', // sender address
    to: 'adebola.rb.js@gmail.com', // list of receivers
    subject: 'Welcome!',
    template: 'email', // the name of the template file i.e email.handlebars
    context:{
        name: "Adebola", // replace {{name}} with Adebola
        company: 'My Company' // replace {{company}} with My Company
    }
};
	*/

    /**
     *
     * @param {object} emailOptions The email options to use
     * @param emailOptions.to The email to send this to
     * @param emailOptions.subject The subject line of the email
     * @param emailOptions.template The handlebars template to use
     * @param {object} emailOptions.context The params for the handlebars template
     */
    async sendEmail(emailOptions) {
        const client = this.getEmailClient();
        const newEmailOptions = {
            ...emailOptions,
            from: 'WishSuite <wishsuite.dev@google.com>',
        };

        const res = await client.sendMail(newEmailOptions);
        if (res.rejected.length) {
            return { success: false, message: res.response };
        }

        return { success: true, message: res.response };
    }
}

exports.EmailService = new EmailService();
