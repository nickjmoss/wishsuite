import React from 'react';
import WishModal from '@reusableComponents/WishModal/wishModal';
import { observer } from 'mobx-react-lite';
import { ModelConnector } from '@stores';
import styles from './addWishlistModal.scss';
import classNames from 'classnames/bind';
import AddWishlistModalModel from './addWishlistModal.model';
import { Input, Radio, Select, Space } from 'antd';

const cx = classNames.bind(styles);

const RadioLabel = ({ title, subtitle }) => (
	<div>
		<div className={cx('radio-title')}>{title}</div>
		<div className={cx('radio-subtitle')}>{subtitle}</div>
	</div>
);

const radioOptions = [
	{ label: <RadioLabel title="Public" subtitle="I would like all of my friends to be able to see this wishlist and its contents." />, value: true },
	{ label: <RadioLabel title="Private" subtitle="I do not want this wishlist to be visible to my friends." />, value: false },
];

const FormInput = ({ title, subtitle, children }) => (
	<div className={cx('form-input')}>
		<div className={cx('title', { spacing: !subtitle })}>{title}</div>
		{subtitle && <div className={cx('subtitle', 'spacing')}>{subtitle}</div>}
		{children}
	</div>
);

const AddWishlistModal = observer(({ open, onCancel, onCreate, model }) => {
	return (
		<WishModal
			primaryButtonText="Create Wishlist"
			onPrimary={() => onCreate(model.getWishlistToCreate())}
			open={open}
			title="Create a New Wishlist"
			onCancel={onCancel}
		>
			<div className={cx('container')}>
				<FormInput title="Name of your Wishlist">
					<Input onChange={(e) => model.setName(e.target.value)}/>
				</FormInput>
				<FormInput title="Description (optional)" subtitle="Quick description of what this wishlist is for.">
					<Input.TextArea rows={4} onChange={(e) => model.setDescription(e.target.value)}/>
				</FormInput>
				<FormInput title="Associate your Wishlist with an Occasion (optional)" subtitle="You can associate this wishlist with one of your Occasions. This makes it so when other users look at your upcoming occasions, they can see what to get you!">
					<Select
						className={cx('occasion-select')}
						placeholder="-- Select an Occasion --"
						options={model.occasionList.length && model.occasionList}
						onSelect={model.setOccasionId}
						onClear={() => model.setOccasionId(null)}
						allowClear
					/>
				</FormInput>
				<FormInput title="Wishlist Visibility" subtitle="Don't worry, you can change this later in this Wishlist's settings.">
					<Radio.Group onChange={(e) => model.setIsPublished(e.target.value)}>
						<Space direction="vertical">
							{radioOptions.map(option => (
								<Radio key={option.label} value={option.value} >{option.label}</Radio>
							))}
						</Space>
					</Radio.Group>
				</FormInput>
			</div>
		</WishModal>
	);
});

export default ModelConnector(AddWishlistModal, { model: AddWishlistModalModel });
