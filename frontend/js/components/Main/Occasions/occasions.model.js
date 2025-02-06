import { types, flow, getSnapshot } from 'mobx-state-tree';
import request from '@request';
import { OccasionBaseModel } from '@app/js/baseModels/occasion.baseModel';
import { rootStore } from '@app/js/stores';
import { message } from 'antd';
import dayjs from 'dayjs';
import { toUTC, dayStart } from '@app/js/utils/dayjs';

const { model, boolean, array, optional, safeReference } = types;

const OccasionsModel = model('OccasionsModel', {
	isLoading: optional(boolean, false),
	occasionList: array(OccasionBaseModel),
	occasionToCreate: optional(OccasionBaseModel, {}),
	selectedOccasion: optional(OccasionBaseModel, {}),
	occasionToDetail: safeReference(OccasionBaseModel),

	showOccasionModal: optional(boolean, false),
	showDeleteModal: optional(boolean, false),
	showDetailsModal: optional(boolean, false),
	isCreating: optional(boolean, false),
})
	.views(() => ({
		get userStore() {
			return rootStore.UserStore;
		},
		get baseURL() {
			return rootStore.UserStore.baseURL;
		},
	}))
	.actions((self) => ({
		afterCreate() {
			self.fetchOccasions();
		},
		fetchOccasions: flow(function* fetchOccasions() {
			self.isLoading = true;
			try {
				const { data } = yield request.get(`${self.baseURL}/occasions`);
				if (!data.success) {
					throw new Error(data.data);
				}
				self.occasionList = data.data;
			}
			catch (err) {
				message.error(err.message);
			}
			finally {
				self.isLoading = false;
			}
		}),
		createOccasion: flow(function* createOccasion() {
			try {
				self.occasionToCreate.ownerId = self.userStore.user.id;
				const { data } = yield request.post(`${self.baseURL}/occasions`, self.occasionToCreate);
				if (!data.success) {
					throw new Error(data.data);
				}
				self.fetchOccasions();
				self.showOccasionModal = false;
				self.occasionToCreate = {};
			}
			catch (err) {
				message.error(err.message);
			}
		}),
		editOccasion: flow(function* editOccasion() {
			try {
				self.selectedOccasion.ownerId = self.userStore.user.id;
				const { data } = yield request.put(`${self.baseURL}/occasions/${self.selectedOccasion.id}`, self.selectedOccasion);
				if (!data.success) {
					throw new Error(data.data);
				}
				self.fetchOccasions();
				self.showOccasionModal = false;
				self.selectedOccasion = {};
			}
			catch (err) {
				message.error(err.message);
			}
		}),
		deleteOccasion: flow(function* deleteOccasion() {
			try {
				const { data } = yield request.delete(`${self.baseURL}/occasions/${self.selectedOccasion.id}`);
				if (!data.success) {
					throw new Error(data.data);
				}
				self.fetchOccasions();
				self.closeDeleteModal();
			}
			catch (err) {
				message.error(err);
			}
		}),
		openOccasionModal(isCreating, occasion_id) {
			if (occasion_id) {
				self.selectedOccasion = getSnapshot(self.occasionList.find(occasion => occasion.id === occasion_id));
			}
			self.isCreating = isCreating;
			self.showOccasionModal = true;
		},
		closeOccasionModal() {
			self.showOccasionModal = false;
			self.occasionToCreate = {};
			self.selectedOccasion = {};
		},
		openDeleteModal(occasion_id) {
			if (occasion_id) {
				self.selectedOccasion = getSnapshot(self.occasionList.find(occasion => occasion.id === occasion_id));
			}
			self.showDeleteModal = true;
		},
		closeDeleteModal() {
			self.selectedOccasion = undefined;
			self.showDeleteModal = false;
		},
		openDetailsModal(occasion_id) {
			self.occasionToDetail = occasion_id;
			self.showDetailsModal = true;
		},
		closeDetailsModal() {
			self.occasionToDetail = undefined;
			self.showDetailsModal = false;
		},
		setName(name) {
			if (self.isCreating) {
				self.occasionToCreate.name = name;
				return;
			}

			self.selectedOccasion.name = name;
			return;
		},
		setDescription(description) {
			if (self.isCreating) {
				self.occasionToCreate.description = description;
				return;
			}

			self.selectedOccasion.description = description;
			return;
		},
		setCelebrateDate(date) {
			if (self.isCreating) {
				self.occasionToCreate.celebrateDate = toUTC(dayStart(date)).format();
				return;
			}

			self.selectedOccasion.celebrateDate = toUTC(dayStart(date)).format();
			return;
		},
		setRepeat(repeat) {
			if (self.isCreating) {
				self.occasionToCreate.repeat = repeat;
				if (!repeat) {
					self.occasionToCreate.originalDate = null;
				}
			}
			else {
				self.selectedOccasion.repeat = repeat;
				if (!repeat) {
					self.selectedOccasion.originalDate = null;
				}
			}
		},
		setOriginalDate(date) {
			if (self.isCreating) {
				self.occasionToCreate.originalDate = toUTC(dayStart(date)).format();
				return;
			}

			self.selectedOccasion.originalDate = toUTC(dayStart(date)).format();
			return;
		},
		disabledDate(current) {
			// Can not select days before today and today
			return current && current < dayjs();
		},
	}));

export default {
	model: OccasionsModel,
	initialValues: {},
	stores: {},
};
