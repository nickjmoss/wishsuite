import React, { useEffect } from 'react';
import styles from './addItemModal.scss';
import classNames from 'classnames/bind';
import WishModal from '@reusableComponents/WishModal/wishModal';
import { Input, Select, Switch } from 'antd';
import { observer } from 'mobx-react-lite';
import { ModelConnector } from '@app/js/stores';
import AddItemModalModel from './addItemModal.model';
import ImageCarousel from '@reusableComponents/ImageCarousel/imageCarousel';

const cx = classNames.bind(styles);

const AddItemModal = observer(({ open, onCancel, item, model }) => {
	useEffect(() => {
		if (item) {
			model.setItemToAdd(item);
		}
	}, [item]);

	return (
		<WishModal
			title="Add to Wishlist"
			actionAlignment="right"
			open={open}
			width={'60%'}
			primaryButtonText="Add to Wishlist"
			onPrimary={model.addItemToWishlist}
			onCancel={onCancel}
			cancelButtonProps={{ danger: true }}
		>
			<div className={cx('add-item-wrapper')}>
				<div className={cx('carousel-wrapper')}>
					<ImageCarousel images={item.images} />
				</div>
				<div className={cx('form-wrapper')}>
					<div className={cx('title')}>{item.title}</div>
					<div className={cx('description')}>{item.description}</div>
					<div className={cx('label-input')}>
						<div className={cx('label')}>Quantity</div>
						<Select
							defaultValue={1}
							options={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => ({
								label: String(num),
								value: num,
							}))}
							onSelect={model.setQuantity}
						/>
					</div>
					<div className={cx('label-input')}>
						<div className={cx('label')}>Wishlist</div>
						<div className={cx('label-subtitle')}>Add the item to the selected wishlist</div>
						<Select
							showSearch
							placeholder="Wishlist #1"
							options={model.wishlistsView}
							onSelect={model.setWishlist}
						/>
					</div>
					<div className={cx('label-input')}>
						<div className={cx('label')}>Most Wanted</div>
						<div className={cx('label-subtitle')}>You can mark an item as most wanted so your friends know what items you love the most</div>
						<Switch onChange={model.setMostWanted} />
					</div>
					<div className={cx('label-input')}>
						<div className={cx('label')}>Additional Notes</div>
						<Input.TextArea onChange={(e) => model.setNotes(e.target.value)} rows={5}/>
					</div>
				</div>
			</div>
		</WishModal>
	);
});

export default ModelConnector(AddItemModal, { model: AddItemModalModel });
