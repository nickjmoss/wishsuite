const validatePassword = (value) => {
	if (/^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[*.!@$%^&(){}[\]:;<>,.?/~_+\-=|\\#'"]).{8,}$/.test(value)) {
		return { outcome: true, message: '' };
	}
	return { outcome: false, message: 'Password must be at least 8 characters long, contain a capitalized letter, a number and a special character' };
};

const validateEmail = (value) => {
	if (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value)) {
		return { outcome: true, message: '' };
	}
	return { outcome: false, message: 'Please enter a valid email address' };
};

const validateString = (value, name) => {
	if (value) {
		return { outcome: true, message: '' };
	}
	return { outcome: false, message: `Please enter a value for ${name}` };
};

export const validator = (value, type, name = '') => {
	let outcome;
	switch (type) {
		case 'password':
			outcome = validatePassword(value);
			break;
		case 'email':
			outcome = validateEmail(value);
			break;
		case 'string':
			outcome = validateString(value, name);
			break;
		default:
			break;
	}

	return outcome;
};
