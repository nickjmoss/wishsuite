import { types, flow, getSnapshot } from 'mobx-state-tree';
import { rootStore } from '@stores';
import { UserBaseModel } from '@app/js/baseModels/user.baseModel';
import { message } from 'antd';
import request from '@request';

const { model, boolean, optional, maybeNull, frozen } = types;

export const ProfileModel = model('ProfileModel', {
	isLoading: optional(boolean, false),
	isEditing: optional(boolean, false),
	user: maybeNull(UserBaseModel),
	temporaryUser: maybeNull(UserBaseModel),

	// Upload Modal State
	avatarBlob: frozen({}),
	showUploadModel: optional(boolean, false),
})
	.views((self) => ({
		get userStore() {
			return rootStore.UserStore;
		},
		get uploadDisabled() {
			return self.temporaryUser.avatarUrl === self.user.avatarUrl;
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
		setAvatar(picture) {
			self.avatarBlob = picture;
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
		saveChanges: flow(function* saveChanges() {
			// const { data } = yield request.post(`api/user/${self.user.id}/update`, { ...self.user });
			self.setEditing(false);
		}),
	}));
