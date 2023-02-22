import { types, flow } from 'mobx-state-tree';
import request from '@request';
import { message } from 'antd';

const { model, string, optional } = types;

export const RecoverPasswordModel = model('RecoverPasswordModel', {
	email: optional(string, ''),
})
	.actions((self) => ({
		setEmail(val) {
			self.email = val;
		},
		sendPasswordReset: flow(function* sendPasswordReset() {
			const loaderFunc = message.loading('Attempting to send email...', 0);
			const { data } = yield request.post('/auth/reset-password', { email: self.email });
			if (!data.success) {
				loaderFunc();
				message.error(data.data);
			}
			else {
				loaderFunc();
				message.success('Successfully sent password reset email');
			}
		}),
	}));
