import { types, flow } from 'mobx-state-tree';
import request from '@request';
import { UserBaseModel } from '../baseModels/user.baseModel';

const { model, maybeNull } = types;

const UserStoreModel = model('UserStoreModel', {
	user: maybeNull(UserBaseModel),
})
	.actions((self) => ({
		fetchSession: flow(function* fetchSession() {
			try {
				const { data } = yield request.get('/session');

			}
			catch (err) {
				console.error(err);
			}
		})
	}))

export default UserStoreModel;
