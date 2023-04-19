import React, { useEffect } from 'react';
import styles from './occasions.scss';
import classNames from 'classnames/bind';
import { observer } from 'mobx-react-lite';
import WishModal from '@reusableComponents/WishModal/wishModal';
import { Button, DatePicker, Form, Input, Radio, List } from 'antd';
import OccasionCard from './OccasionCard/occasionCard';
import { ModelConnector } from '@app/js/stores';
import OccasionsModel from './occasions.model';
import DeleteModal from '@reusableComponents/DeleteModal/deleteModal';
import { useNavigate } from 'react-router-dom';
import { toLocal } from '@app/js/utils/dayjs';
import OccasionDetailsModal from '../../reusableComponents/OccasionDetailsModal/occasionDetailsModal';

const cx = classNames.bind(styles);
const Item = Form.Item;

const FormLabel = observer(({ title, subtitle }) => (
	<div>
		<div className={cx('label-title')}>{title}</div>
		<div className={cx('label-subtitle')}>{subtitle}</div>
	</div>
));

const OccasionsForm = observer(({ model }) => {
	return (
		<Form
			layout="vertical"
		>
			<Item
				label={<FormLabel title="Name of the Occasion" />}
				name="name"
				initialValue={!model.isCreating ? model.selectedOccasion.name : null}
			>
				<Input name="name" onChange={(e) => model.setName(e.target.value)}/>
			</Item>
			<Item
				label={<FormLabel title="Description of Occasion (optional)" subtitle="Tell us about the Occasion and why you are celebrating" />}
				name="description"
				initialValue={!model.isCreating ? model.selectedOccasion.description : null}
			>
				<Input.TextArea name="description" rows={4} onChange={(e) => model.setDescription(e.target.value)}/>
			</Item>
			<Item
				label={<FormLabel title="Celebration Date" subtitle="When is the next time this occasion will be celebrated?"/>}
				name="celebrateDate"
				initialValue={!model.isCreating ? toLocal(model.selectedOccasion.celebrateDate) : null}
			>
				<DatePicker disabledDate={model.disabledDate} showToday={false} onChange={model.setCelebrateDate}/>
			</Item>
			<Item
				label={<FormLabel title="Is this Occasion recurring?" subtitle="Let us know if this Occasion repeats every so often so we can generate items for you to add!"/>}
				name="repeat"
				initialValue={!model.isCreating ? model.selectedOccasion.repeat : null}
			>
				<Radio.Group onChange={(e) => model.setRepeat(e.target.value)}>
					<Radio value>Yes</Radio>
					<Radio value={false}>No</Radio>
				</Radio.Group>
			</Item>
			<Item
				label={<FormLabel title="Original Date" subtitle="What was the original date of the Occasion?"/>}
				name="originalDate"
				hidden={model.isCreating ? !model.occasionToCreate.repeat : !model.selectedOccasion?.repeat}
				initialValue={!model.isCreating ? toLocal(model.selectedOccasion.originalDate) : null}
			>
				<DatePicker showToday={false} onChange={model.setOriginalDate}/>
			</Item>
		</Form>
	);
});

const Occasions = observer(({ model }) => {
	const navigate = useNavigate();

	return (
		<div className={cx('wrapper')}>
			<div className={cx('title')}>Your Occasions</div>
			<div className={cx('actions-wrapper')}>
				<div className={cx('actions')}>
					<Button type="primary" onClick={() => model.openOccasionModal(true)}>Create an Occasion</Button>
				</div>
			</div>
			<List
				grid={{
					gutter: 16,
					xs: 1,
					sm: 2,
					md: 3,
					lg: 3,
					xl: 3,
					xxl: 4,
				}}
				dataSource={[...model.occasionList]}
				renderItem={(occasion) => {
					return (
						<List.Item
							key={occasion.id}
							onClick={() => model.openDetailsModal(occasion.id)}
						>
							<OccasionCard
								occasion={occasion}
								onDelete={(occasion_id) => model.openDeleteModal(occasion_id)}
								onEdit={(occasion_id) => model.openOccasionModal(false, occasion_id)}
							/>
						</List.Item>
					);
				}}
			/>
			<WishModal
				onPrimary={model.isCreating ? model.createOccasion : model.editOccasion}
				primaryButtonText={model.isCreating ? 'Create Occasion' : 'Save Changes'}
				onCancel={model.closeOccasionModal}
				title={model.isCreating ? 'Create an Occasion' : 'Edit an Occasion'}
				open={model.showOccasionModal}
			>
				<div>
					<OccasionsForm model={model}/>
				</div>
			</WishModal>
			<DeleteModal
				deleteTitle="Delete Occasion"
				deleteText={`Are your sure you would like to delete occasion: ${model.selectedOccasion?.name}? This action cannot be undone.`}
				onDelete={model.deleteOccasion}
				open={model.showDeleteModal}
				onCancel={model.closeDeleteModal}
			/>
			{model.occasionToDetail &&
				<OccasionDetailsModal
					open={model.showDetailsModal}
					onCancel={model.closeDetailsModal}
					occasion={model.occasionToDetail}
				/>
			}
		</div>
	);
});

export default ModelConnector(Occasions, { model: OccasionsModel });
