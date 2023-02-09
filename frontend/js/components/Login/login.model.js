import { types } from "mobx-state-tree";

const { model, string, optional } = types;

const LoginModel = model('LoginModel', {
	email: optional(string, ''),
	password: optional(string, ''),
})
	.actions((self) => ({
		setEmail(email) {
			self.email = email;
		},
		setPassword(password) {
			self.password = password;
		}
	}))