import React from 'react';
import styles from './occasionDetailsModal.scss';
import classNames from 'classnames/bind';
import WishModal from '../WishModal/wishModal';
import FormLabel from '../FormLabel/formLabel';
import { toLocal } from '@app/js/utils/dayjs';

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
		<div className={cx('modal-detail')}>
			<FormLabel titleClassName={cx('title')} title="Occasion Name"/>
			<div className={cx('value')}>{occasion.name}</div>
		</div>
		<div className={cx('modal-detail')}>
			<FormLabel titleClassName={cx('title')} title="Occasion Description"/>
			<div className={cx('value')}>{occasion.description || 'None'}</div>
		</div>
		<div className={cx('modal-detail')}>
			<FormLabel titleClassName={cx('title')} title="Celebration Date"/>
			<div className={cx('value')}>{toLocal(occasion.celebrateDate).format('MM/DD/YYYY')}</div>
		</div>
		<div className={cx('modal-detail')}>
			<FormLabel titleClassName={cx('title')} title="Original Date"/>
			<div className={cx('value')}>{occasion.originalDate ? toLocal(occasion.originalDate).format('MM/DD/YYYY') : 'None'}</div>
		</div>
	</WishModal>
);

export default OccasionDetailsModal;
