import React from 'react';
import styles from './itemCard.scss';
import classNames from 'classnames/bind';
import { Button, Card, Rate } from 'antd';
import ImageCarousel from '../ImageCarousel/imageCarousel';

const cx = classNames.bind(styles);

const ItemCard = ({ item, onPrimary }) => (
	<Card
		cover={<ImageCarousel images={item.images}/>}
		style={{ width: '300px' }}
		hoverable
		className={cx('item-card')}
	>
		<div>
			<div className={cx('title-price')}>
				<div className={cx('title')}>{item.title}</div>
				<div className={cx('price')}>${item.price}</div>
			</div>
			<div className={cx('source')}>
				{item.source}
			</div>
			<div className={cx('reviews')}>
				<Rate className={cx('stars')} disabled value={Math.floor(item.reviews)} />
			</div>
			<div className={cx('actions')}>
				<Button className={cx('add-button')} onClick={() => onPrimary(item.externalId)} type="primary">Add to Wishlist</Button>
				<a href={item.externalLink} target="_blank" rel="noreferrer"><Button className={cx('view-button')} type="primary">View Details</Button></a>
			</div>
		</div>
	</Card>
);

export default ItemCard;
