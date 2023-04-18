import { types, flow } from 'mobx-state-tree';
import request from '@request';
import { UserBaseModel } from '../baseModels/user.baseModel';
import { message } from 'antd';

const { model, maybeNull } = types;

const UserStoreModel = model('UserStoreModel', {
	user: maybeNull(UserBaseModel),
})
	.views((self) => ({
		get fullName() {
			return `${self.user.firstName} ${self.user.lastName}`;
		},
		get baseURL() {
			return `users/${self.user.id}`;
		},
	}))
	.actions((self) => ({
		fetchSession: flow(function* fetchSession() {
			try {
				const { data } = yield request.get('auth/session');
				self.user = data.data;
			}
			catch (err) {
				console.error(err);
			}
		}),
		createUser: flow(function* createUser(firstName, lastName, email, password) {
			try {
				const { data } = yield request.post('auth/create', { firstName, lastName, email, password });
				if (data.success) {
					self.user = data.data;
				}
				else {
					throw new Error(data.data);
				}
			}
			catch (err) {
				message.error(err.message);
			}
		}),
		loginUser: flow(function* loginUser(email, password) {
			try {
				const { data } = yield request.post('auth/login', { email, password });
				if (data.success) {
					self.user = data.data;
					window.location.href = '/wishlists';
				}
				else {
					throw new Error(data.data);
				}
			}
			catch (error) {
				message.error(error.message);
			}
		}),
		logoutUser: flow(function* logoutUser(navigate) {
			try {
				yield request.post('auth/logout');
				self.user = null;
				navigate('/auth/login', { replace: true });
			}
			catch (error) {
				console.error(error);
			}
		}),
	}));

export default UserStoreModel;
