import React from 'react';
import styles from './updateWishlistModal.scss';
import classNames from 'classnames/bind';
import { Radio, Select, Input, Space } from 'antd';
import WishModal from '@app/js/components/reusableComponents/WishModal/wishModal';

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

const UpdateWishlistsModal = ({
	onCancel,
	onPrimary,
	open,
	setWishlistName,
	setWishlistDescription,
	setWishlistOccasion,
	setWishlistIsPublished,
	occasionList,
	wishlist,
}) => (
	<WishModal
		primaryButtonText="Update Wishlist"
		onPrimary={onPrimary}
		open={open}
		title={`Update ${wishlist.name}`}
		onCancel={onCancel}
	>
		<div className={cx('container')}>
			<FormInput title="Name of your Wishlist">
				<Input defaultValue={wishlist.name} onChange={(e) => setWishlistName(e.target.value)}/>
			</FormInput>
			<FormInput title="Description (optional)" subtitle="Quick description of what this wishlist is for.">
				<Input.TextArea defaultValue={wishlist.description} rows={4} onChange={(e) => setWishlistDescription(e.target.value)}/>
			</FormInput>
			<FormInput title="Associate your Wishlist with an Occasion (optional)" subtitle="You can associate this wishlist with one of your Occasions. This makes it so when other users look at your upcoming occasions, they can see what to get you!">
				<Select
					className={cx('occasion-select')}
					placeholder="-- Select an Occasion --"
					options={occasionList.length && occasionList}
					onSelect={setWishlistOccasion}
					onClear={() => setWishlistOccasion(null)}
					allowClear
					defaultValue={wishlist.occasionId}
				/>
			</FormInput>
			<FormInput title="Wishlist Visibility">
				<Radio.Group onChange={(e) => setWishlistIsPublished(e.target.value)} defaultValue={wishlist.isPublished}>
					<Space direction="vertical">
						{radioOptions.map(option => (
							<Radio key={option.label} value={option.value}>{option.label}</Radio>
						))}
					</Space>
				</Radio.Group>
			</FormInput>
		</div>
	</WishModal>
);

export default UpdateWishlistsModal;
