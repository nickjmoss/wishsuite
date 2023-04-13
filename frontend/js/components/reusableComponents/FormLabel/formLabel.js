import React from 'react';
import styles from './formLabel.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const FormLabel = ({ title, subtitle }) => (
	<div>
		<div className={cx('label-title')}>{title}</div>
		<div className={cx('label-subtitle')}>{subtitle}</div>
	</div>
);

export default FormLabel;
