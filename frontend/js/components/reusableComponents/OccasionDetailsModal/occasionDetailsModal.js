import React from 'react';
import styles from './occasionDetailsModal.scss';
import classNames from 'classnames/bind';
import WishModal from '../WishModal/wishModal';
import FormLabel from '../FormLabel/formLabel';

const cx = classNames.bind(styles);

const OccasionDetailsModal = ({ occasion, open, onCancel }) => (
	<WishModal
		open={open}
		cancelButtonProps={{ hidden: true }}
		primaryButtonProps={{ hidden: true }}
		width="30%"
		onCancel={onCancel}
		title="Occasion Details"
	>
		<div>
			<FormLabel title="Occasion Name"/>
			<div className={cx('value')}>{occasion.name}</div>
		</div>
	</WishModal>
);

export default OccasionDetailsModal;
