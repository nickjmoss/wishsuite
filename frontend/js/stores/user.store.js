import { types, flow } from 'mobx-state-tree';
import request from '@request';
import { UserBaseModel } from '../baseModels/user.baseModel';
import { message } from 'antd';

const { model, maybeNull } = types;

const UserStoreModel = model('UserStoreModel', {
	user: maybeNull(UserBaseModel),
})
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
				console.log(data);
			}
			catch (err) {
				console.error(err);
			}
		}),
		loginUser: flow(function* loginUser(email, password) {
			try {
				const { data } = yield request.post('auth/login', { email, password });
				if (data.success) {
					self.user = data.data;
				}

				throw new Error(data.error);
			}
			catch (error) {
				message.error(error.message);
			}
		}),
		logoutUser: flow(function* loginUser() {
			try {
				const { data } = yield request.get('/logout');
				console.log(data);
			}
			catch (error) {
				console.error(error);
			}
		}),
	}));

export default UserStoreModel;
