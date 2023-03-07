import { types } from 'mobx-state-tree';
import { rootStore } from '@stores';

const { model, boolean, optional } = types;

export const ProfileModel = model('ProfileModel', {
	isLoading: optional(boolean, false),
})
	.views((self) => ({
		get user() {
			return rootStore.UserStore;
		},
	}))
	.actions((self) => ({
	}));
