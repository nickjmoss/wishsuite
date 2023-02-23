import { types, flow, getSnapshot } from 'mobx-state-tree';
import request from '@request';
import { message as antMessage } from 'antd';
import { validator } from '@utils/validator';
import { FeedbackBaseModel } from '@app/js/baseModels/feedback.baseModel';

const { model, optional, string, boolean, maybeNull } = types;

export const NewPasswordModel = model('NewPasswordModel', {
	isLoading: maybeNull(boolean),
	userId: optional(string, ''),
	token: optional(string, ''),
	password: optional(string, ''),
	confirmPassword: optional(string, ''),

	// Ternary Logic
	tokenIsValid: maybeNull(boolean),
	passwordReset: maybeNull(boolean),

	// Form Validation Logic
	validation: optional(model('ValidationModel', {
		password: optional(FeedbackBaseModel, {}),
		confirmPassword: optional(FeedbackBaseModel, {}),
	}), {}),
})
	.actions((self) => ({
		setToken(token) {
			self.token = token;
		},
		setUserId(userId) {
			self.userId = userId;
		},
		setPassword(password) {
			self.password = password;
		},
		setConfirmPassword(confirmPassword) {
			self.confirmPassword = confirmPassword;
		},
		setIsTokenValid(valid) {
			self.tokenIsValid = valid;
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
		verifyToken: flow(function* verifyToken() {
			self.isLoading = true;
			const { data } = yield request.post('/auth/verify-token', { userId: self.userId, token: self.token });
			if (!data.success) {
				self.setIsTokenValid(false);
			}
			else {
				self.setIsTokenValid(true);
			}
			self.isLoading = false;
		}),
		setNewPassword: flow(function* setNewPassword() {
			self.isLoading = true;
			self.errors = false;
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
				const { data } = yield request.post('/auth/new-password', { userId: self.userId, token: self.token, password: self.password });
				if (!data.success) {
					antMessage.error(data.data);
				}
				else {
					self.passwordReset = true;
				}
			}

			self.isLoading = false;
		}),
	}));
