import { types, flow } from 'mobx-state-tree';
import { rootStore } from '@stores';

const { model, string, optional } = types;

export const LoginModel = model('LoginModel', {
	email: optional(string, ''),
	password: optional(string, ''),
})
	.actions((self) => ({
		setEmail(email) {
			self.email = email;
		},
		setPassword(password) {
			self.password = password;
		},
		attemptLogin: flow(function* attemptLogin() {
			try {
				yield rootStore.UserStore.loginUser(self.email, self.password);
			}
			catch (error) {
				console.error(error);
			}
		}),
		testFinish() {
			console.log(self.email, self.password);
		},
	}));
