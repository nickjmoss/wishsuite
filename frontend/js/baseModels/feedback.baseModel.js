import { types } from 'mobx-state-tree';

const { model, string, optional, boolean } = types;

export const FeedbackBaseModel = model('FeedbackBaseModel', {
	hasFeedback: optional(boolean, false),
	validateStatus: optional(string, ''),
	help: optional(string, ''),
})
	.actions((self) => ({
		setHasFeedback(val) {
			self.hasFeedback = val;
		},
		setValidateStatus(val) {
			self.validateStatus = val;
		},
		setHelp(val) {
			self.help = val;
		},
	}));
