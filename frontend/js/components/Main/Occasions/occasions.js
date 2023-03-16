import React from 'react';
import styles from './occasions.scss';
import classNames from 'classnames/bind';
import { observer } from 'mobx-react-lite';
import WishModal from '@reusableComponents/WishModal/wishModal';
import { Button, DatePicker, Form, Input, Radio } from 'antd';

const cx = classNames.bind(styles);
const Item = Form.Item;

const Occasions = observer(({ model }) => {
	const FormLabel = ({ title, subtitle }) => (
		<div>
			<div className={cx('label-title')}>{title}</div>
			<div className={cx('label-subtitle')}>{subtitle}</div>
		</div>
	);

	const OccasionsForm = observer(({ isCreating }) => (
		<Form
			layout="vertical"
			onValuesChange={(_, allFields) => model.onValuesChange(allFields, isCreating)}
			initialValues={!isCreating && model.selectedOccasion}
		>
			<Item
				label={<FormLabel title="Name of the Occasion" />}
				name="name"
			>
				<Input name="name"/>
			</Item>
			<Item
				label={<FormLabel title="Description of Occasion (optional)" subtitle="Tell us about the Occasion and why you are celebrating" />}
				name="description"
			>
				<Input.TextArea name="description" rows={4}/>
			</Item>
			<Item
				label={<FormLabel title="Celebration Date" subtitle="When is the next time this occasion will be celebrated?"/>}
				name="celebrate_date"
			>
				<DatePicker disabledDate={model.disabledDate} showToday={false}/>
			</Item>
			<Item
				label={<FormLabel title="Is this Occasion recurring?" subtitle="Let us know if this Occasion repeats every so often so we can generate items for you to add!"/>}
				name="repeat"
			>
				<Radio.Group>
					<Radio value>Yes</Radio>
					<Radio value={false}>No</Radio>
				</Radio.Group>
			</Item>
			<Item
				label={<FormLabel title="Original Date" subtitle="What was the original date of the Occasion?"/>}
				name="original_date"
				hidden={isCreating ? !model.occasionToCreate.repeat : !model.selectedOccasion?.repeat}
			>
				<DatePicker showToday={false}/>
			</Item>
		</Form>
	));

	return (
		<div>
			<Button type="primary" onClick={() => model.openOccasionModal(true)}>Add Occasion</Button>
			<Button type="primary" onClick={() => model.openOccasionModal(false)}>Edit Occasion</Button>
			<WishModal
				onPrimary={model.isCreating ? model.createOccasion : model.editOccasion}
				primaryButtonText={model.isCreating ? 'Create Occasion' : 'Edit Occasion'}
				onCancel={model.closeOccasionModal}
				title={model.isCreating ? 'Create an Occasion' : 'Edit an Occasion'}
				cancelButtonProps="Cancel"
				open={model.showOccasionModal}
			>
				<div>
					<OccasionsForm isCreating={model.isCreating}/>
				</div>
			</WishModal>
		</div>
	);
});

export default Occasions;
