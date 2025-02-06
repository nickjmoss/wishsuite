import React from 'react';
import styles from './imageCarousel.scss';
import classNames from 'classnames/bind';
import { Carousel } from 'antd';
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

export default ImageCarousel;
