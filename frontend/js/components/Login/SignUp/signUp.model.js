import { types, getSnapshot, flow } from 'mobx-state-tree';
import { validator } from '@utils/validator';
import { message as antMessage } from 'antd';
import { rootStore } from '@stores';

const { model, string, optional, boolean } = types;

const FeedbackModel = model('FeedbackModel', {
	hasFeedback: optional(boolean, false),
	validateStatus: optional(string, ''),
	help: optional(string, ''),
})
	.actions((self) => ({
		setHasFeedback(val) {
			self.hasFeedback = val;
		},
		setValidateStatus(val) {
			self.validateStatus = val;
		},
		setHelp(val) {
			self.help = val;
		},
	}))
;

export const SignUpModel = model('SignUpModel', {
	firstName: optional(string, ''),
	lastName: optional(string, ''),
	email: optional(string, ''),
	password: optional(string, ''),
	confirmPassword: optional(string, ''),
	errors: optional(boolean, false),

	validation: optional(model('ValidationModel', {
		firstName: optional(FeedbackModel, {}),
		lastName: optional(FeedbackModel, {}),
		password: optional(FeedbackModel, {}),
		email: optional(FeedbackModel, {}),
		confirmPassword: optional(FeedbackModel, {}),
	}), {}),
})
	.actions((self) => ({
		createUser: flow(function* createUser(obj) {
			delete obj.confirmPassword;
			try {
				yield rootStore.UserStore.createUser(...Object.values(obj));
				if (rootStore.UserStore.user) {
					window.location.href = '/';
				}
			}
			catch (err) {
				console.error(err);
			}
		}),
		setEmail(val) {
			self.email = val;
		},
		setFirstName(val) {
			self.firstName = val;
		},
		setLastName(val) {
			self.lastName = val;
		},
		setPassword(val) {
			self.password = val;
		},
		setConfirmPassword(val) {
			self.confirmPassword = val;
		},
		validateField(val, type, prop, name) {
			const { outcome, message } = validator(val, type, name);
			if (outcome) {
				const property = self.validation[prop];
				property.setValidateStatus('success');
				property.setHasFeedback(true);
				property.setHelp(message);
			}
			else {
				const property = self.validation[prop];
				property.setValidateStatus('error');
				property.setHasFeedback(true);
				property.setHelp(message);
			}
		},
		validateForm(values) {
			const validateState = getSnapshot(self.validation);
			Object.keys(validateState).every(key => {
				if (!validateState[key].hasFeedback) {
					antMessage.error('Please fill out all fields.');
					self.errors = true;
					return false;
				}

				if (validateState[key].validateStatus === 'error') {
					antMessage.error('Please resolve all errors before submitting.');
					self.errors = true;
					return false;
				}

				return true;
			});

			if (self.password !== self.confirmPassword) {
				antMessage.error('Passwords do not match.');
				self.errors = true;
			}

			if (!self.errors) {
				self.createUser(values);
			}
		},
	}));
