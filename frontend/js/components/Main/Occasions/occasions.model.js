import { types, flow } from 'mobx-state-tree';
import request from '@request';
import { OccasionBaseModel } from '@app/js/baseModels/occasion.baseModel';
import { rootStore } from '@app/js/stores';
import { message } from 'antd';
import dayjs from 'dayjs';

const { model, boolean, array, safeReference, optional } = types;

const OccasionsModel = model('OccasionsModel', {
	isLoading: optional(boolean, false),
	occasionList: array(OccasionBaseModel),
	occasionToCreate: optional(OccasionBaseModel, {}),
	selectedOccasion: safeReference(OccasionBaseModel),

	showOccasionModal: optional(boolean, false),
	isCreating: optional(boolean, false),
})
	.views((self) => ({
		get userStore() {
			return rootStore.UserStore;
		},
		get baseURL() {
			return rootStore.UserStore.baseURL;
		},
		get observableList() {
			return self.occasionList.slice();
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
				self.occasionToCreate.owner_id = self.userStore.user.id;
				const { data } = yield request.post(`${self.baseURL}/occasions`, self.occasionToCreate);
				if (!data.success) {
					throw new Error(data.data);
				}
				self.fetchOccasions();
				self.showOccasionModal = false;
			}
			catch (err) {
				message.error(err.message);
			}
		}),
		openOccasionModal(isCreating) {
			self.isCreating = isCreating;
			self.showOccasionModal = true;
		},
		closeOccasionModal() {
			self.showOccasionModal = false;
			self.occasionToCreate = {};
		},
		setCreateRepeat(val) {
			self.occasionToCreate.repeat = val;
		},
		setCreateName(val) {
			self.occasionToCreate.name = val;
		},
		onValuesChange(allFields) {
			if (allFields.celebrate_date) {
				allFields.celebrate_date = String(allFields.celebrate_date);
			}

			if (allFields.original_date) {
				allFields.original_date = String(allFields.original_date);
			}

			self.occasionToCreate = allFields;
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
