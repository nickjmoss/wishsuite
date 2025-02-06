import React from 'react';
import styles from './itemDetailsModal.scss';
import classNames from 'classnames/bind';
import WishModal from '@app/js/components/reusableComponents/WishModal/wishModal';
import ImageCarousel from '@app/js/components/reusableComponents/ImageCarousel/imageCarousel';
import { LinkOutlined } from '@ant-design/icons';

const cx = classNames.bind(styles);

const ItemDetailsModal = ({ item, onCancel, open, wishlistName }) => (
	<WishModal
		title="Item Details"
		open={open}
		cancelButtonProps={{ hidden: true }}
		primaryButtonProps={{ hidden: true }}
		onCancel={onCancel}
		width="60%"
	>
		<div className={cx('add-item-wrapper')}>
			<div className={cx('carousel-wrapper')}>
				<ImageCarousel images={item.images} />
			</div>
			<div className={cx('form-wrapper')}>
				<div className={cx('title')}>{item.title}</div>
				<div className={cx('description')}>{item.description}</div>
				<div className={cx('item-details')}>
					<div className={cx('labels')}>
						{item.externalLink &&
							<div className={cx('label')}>Link to Item</div>
						}
						<div className={cx('label')}>Quantity</div>
						<div className={cx('label')}>Wishlist</div>
						<div className={cx('label')}>Most Wanted</div>
						<div className={cx('label')}>Additional Notes</div>
					</div>
					<div className={cx('values')}>
						{item.externalLink &&
							<div className={cx('value')}>
								<a href={item.externalLink} target="_blank" rel="noreferrer"><LinkOutlined/> {item.source || 'Link'}</a>
							</div>
						}
						<div className={cx('value')}>
							{item.quantity}
						</div>
						<div className={cx('value')}>
							{wishlistName}
						</div>
						<div className={cx('value')}>
							{item.mostWanted ? 'Yes' : 'No'}
						</div>
						<div className={cx('value')}>
							{item.notes || 'N/A'}
						</div>
					</div>
				</div>
			</div>
		</div>
	</WishModal>
);

export default ItemDetailsModal;
