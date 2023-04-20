import React from 'react';
import styles from './formLabel.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const FormLabel = ({ title, subtitle, titleClassName, subtitleClassName }) => (
	<div>
		<div className={cx(titleClassName || 'label-title')}>{title}</div>
		<div className={cx(subtitleClassName || 'label-subtitle')}>{subtitle}</div>
	</div>
);

export default FormLabel;
