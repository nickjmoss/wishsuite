import React from 'react';
import styles from './itemCard.scss';
import classNames from 'classnames/bind';
import { Button, Card, Carousel, Rate } from 'antd';
import { ArrowRightOutlined, ArrowLeftOutlined, FileImageOutlined } from '@ant-design/icons';

const cx = classNames.bind(styles);

const ImageCarousel = ({ images = [] }) => (
	<Carousel
		arrows
		className={cx('carousel')}
		nextArrow={<ArrowRightOutlined/>}
		prevArrow={<ArrowLeftOutlined/>}
	>
		{images.length && images.map((image, index) => (
			<div className={cx('carousel-image')} key={index}>
				<img src={image.largeImage} crossOrigin="anonymous"/>
			</div>
		))}

		{!images.length &&
			<div className={cx('no-image')}>
				<FileImageOutlined className={cx('no-image-svg')}/>
				<div>No Images Available</div>
			</div>
		}
	</Carousel>
);

const ItemCard = ({ item }) => (
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
				<Rate disabled defaultValue={item.reviews} allowHalf />
			</div>
			<div className={cx('actions')}>
				<Button className={cx('add-button')} type="primary">Add to Wishlist</Button>
				<Button className={cx('view-button')} type="primary">View Details</Button>
			</div>
		</div>
	</Card>
);

export default ItemCard;
