import { types, flow, getSnapshot } from 'mobx-state-tree';
import { rootStore } from '@stores';
import { UserBaseModel } from '@app/js/baseModels/user.baseModel';
import { message } from 'antd';
import { validator } from '@app/js/utils/validator';
import request from '@request';

const { model, boolean, optional, maybeNull } = types;

const ProfileModel = model('ProfileModel', {
	isLoading: optional(boolean, false),
	isEditing: optional(boolean, false),
	user: maybeNull(UserBaseModel),
	temporaryUser: maybeNull(UserBaseModel),

	// Upload Modal State
	showUploadModel: optional(boolean, false),
})
	.views((self) => ({
		get userStore() {
			return rootStore.UserStore;
		},
		get uploadDisabled() {
			return self.temporaryUser.avatarUrl === self.user.avatarUrl;
		},
		get differentFields() {
			const tempSnapshot = getSnapshot(self.temporaryUser);
			const userSnapshot = getSnapshot(self.user);
			const diffObj = new Map();

			Object.keys(tempSnapshot).forEach(key => {
				if (tempSnapshot[key] !== userSnapshot[key]) {
					diffObj.set(key, tempSnapshot[key]);
				}
			});

			return diffObj;
		},
	}))
	.actions((self) => ({
		afterCreate() {
			self.user = getSnapshot(self.userStore.user);
			self.temporaryUser = getSnapshot(self.user);
		},
		updateProfile: flow(function* updateProfile() {
			yield self.user.updateUser();
		}),
		logOut: flow(function* logOut(navigate) {
			yield self.userStore.logoutUser(navigate);
			self.user = null;
		}),
		cancelChanges() {
			self.setEditing(false);
			self.temporaryUser = getSnapshot(self.user);
		},
		editProfile() {
			self.setEditing(true);
		},
		setEditing(editing) {
			self.isEditing = editing;
		},
		setEmail(email) {
			self.temporaryUser.email = email;
		},
		setFirstName(name) {
			self.temporaryUser.firstName = name;
		},
		setLastName(name) {
			self.temporaryUser.lastName = name;
		},
		// *********************************
		// *							   *
		// *   Profile Pic Upload Methods  *
		// *							   *
		// *********************************
		setShowUploadModal(show) {
			self.showUploadModel = show;
		},
		setAvatarUrl(url) {
			self.temporaryUser.avatarUrl = url;
		},
		// Return a Data URI for the image that is uploaded
		getBase64(img, callback) {
			const reader = new FileReader();
			reader.addEventListener('load', () => callback(reader.result));
			reader.readAsDataURL(img);
		},
		handleUploadChange(info) {
			if (info.file.status === 'uploading') {
				return;
			}
			if (info.file.status === 'done') {
				self.getBase64(info.file.originFileObj, (url) => {
					self.setAvatarUrl(url);
				});
			}
		},
		beforeUpload(file) {
			const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
			if (!isJpgOrPng) {
				message.error('You can only upload JPG/PNG file!');
			}
			const isLt2M = file.size / 1024 / 1024 < 2;
			if (!isLt2M) {
				message.error('Image must smaller than 2MB!');
			}
			return isJpgOrPng && isLt2M;
		},
		onCancelUpload() {
			self.temporaryUser.avatarUrl = self.user.avatarUrl;
			self.setShowUploadModal(false);
		},
		dummyRequest({ onSuccess }) {
			setTimeout(() => {
				onSuccess('ok');
			}, 0);
		},
		newAvatarUrl: flow(function* newAvatarUrl() {
			const {
				data: {
					data: {
						signature,
						timestamp,
						api_key,
						cloudinary_url,
					},
				},
			} = yield request.get(`/users/${self.user.id}/token`);

			const form = new FormData();

			form.append('api_key', api_key);
			form.append('signature', signature);
			form.append('timestamp', timestamp);
			form.append('folder', 'profile_pictures');
			form.append('file', self.temporaryUser.avatarUrl);
			form.append('public_id', self.user.id);

			const { data: { secure_url } } = yield request.post(`${cloudinary_url}/upload`, form);

			return secure_url;
		}),
		saveChanges: flow(function* saveChanges() {
			self.isLoading = true;
			try {
				const diffObj = self.differentFields;

				if (diffObj.has('firstName')) {
					if (!diffObj.get('firstName')) {
						throw new Error('First name must have a value');
					}
				}

				if (diffObj.has('lastName')) {
					if (!diffObj.get('lastName')) {
						throw new Error('Last name must have a value');
					}
				}

				if (diffObj.has('email')) {
					const validEmail = validator(diffObj.get('email'), 'email');
					if (!validEmail.outcome) {
						throw new Error(validEmail.message);
					}
				}

				if (diffObj.has('avatarUrl')) {
					const newUrl = yield self.newAvatarUrl(diffObj.avatarUrl);

					if (!newUrl) {
						throw new Error('Error uploading profile picture');
					}

					diffObj.set('avatarUrl', newUrl);
				}

				const body = Object.fromEntries(diffObj);

				const { data } = yield request.post(`/users/${self.user.id}`, body);

				if (!data.success) {
					throw new Error(data.message);
				}

				yield self.userStore.fetchSession();
				self.user = getSnapshot(self.userStore.user);
				self.temporaryUser = getSnapshot(self.user);
				self.setEditing(false);
				message.success('Successfully updated profile');
			}
			catch (err) {
				message.error(err.message);
			}
			finally {
				self.isLoading = false;
			}
		}),
		deleteUser: flow(function* deleteUser(navigate) {
			try {
				self.isLoading = true;
				const { data } = yield request.delete(`/users/${self.user.id}`);

				if (!data.success) {
					throw new Error(data.data);
				}

				self.isLoading = false;

				navigate('/auth/login', { replace: true });
			}
			catch (err) {
				message.error(err.message);
			}
		}),
	}));

export default {
	model: ProfileModel,
	initialValues: {},
	stores: {},
};
