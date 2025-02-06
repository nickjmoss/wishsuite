import React from 'react';
import styles from './customWishModal.scss';
import classNames from 'classnames/bind';
import WishModal from '@app/js/components/reusableComponents/WishModal/wishModal';
import FormLabel from '@app/js/components/reusableComponents/FormLabel/formLabel';
import { Select, Input, Switch, InputNumber } from 'antd';

const cx = classNames.bind(styles);

const CustomWishModal = ({
	open,
	onPrimary,
	onCancel,
	setMostWanted,
	setLink,
	setName,
	setQuantity,
	setNotes,
	setSource,
	setPrice,
}) => (
	<WishModal
		title="Add a Custom Wish"
		primaryButtonText="Add Custom Wish"
		open={open}
		onPrimary={onPrimary}
		onCancel={onCancel}
	>
		<div>
			<div className={cx('form-item')}>
				<FormLabel title="Wish Name" subtitle="Add the name of the item you are wishing for" />
				<Input onChange={(e) => setName(e.target.value)}/>
			</div>
			<div className={cx('form-item')}>
				<FormLabel title="Source (optional)" subtitle="Where is this item from?" />
				<Input onChange={(e) => setSource(e.target.value)} placeholder="ex. Walmart" />
			</div>
			<div className={cx('form-item')}>
				<FormLabel title="Add a Link (optional)" subtitle="If there is a link associated with this wish, please add one so your friends can easily find it"/>
				<Input onChange={(e) => setLink(e.target.value)} />
			</div>
			<div className={cx('form-item', 'row')}>
				<div className={cx('row-item')}>
					<FormLabel title="Price" />
					<InputNumber className={cx('input-number')} prefix={<span>$</span>} onChange={setPrice} />
				</div>
				<div className={cx('row-item')}>
					<FormLabel title="Quantity" />
					<Select
						defaultValue={1}
						options={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => ({
							label: String(num),
							value: num,
						}))}
						onSelect={setQuantity}
					/>
				</div>
			</div>
			<div className={cx('form-item')}>
				<FormLabel title="Most Wanted" subtitle="You can mark an item as most wanted so your friends know what items you love the most"/>
				<Switch onChange={setMostWanted} />
			</div>
			<div className={cx('form-item')}>
				<FormLabel title="Additional Notes" subtitle="Let your friends know anything else about this wish" />
				<Input.TextArea onChange={(e) => setNotes(e.target.value)} rows={3}/>
			</div>
		</div>
	</WishModal>
);

export default CustomWishModal;
