const bcrypt = require('bcrypt');
const saltRounds = parseInt(process.env.SALT_ROUNDS, 10);
const validPasswordRegex = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[*.!@$%^&(){}[\]:;<>,.?/~_+\-=|\\#'"]).{8,}$/;

module.exports = {
	hash: async (password) => await bcrypt.hash(password, saltRounds),
	compare: async (password1, password2) => await bcrypt.compare(password1, password2),
	isValid: (password) => validPasswordRegex.test(password),
};
