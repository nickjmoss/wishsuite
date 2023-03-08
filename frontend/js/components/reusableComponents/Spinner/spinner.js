import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import styles from './spinner.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const SpinIcon = ({ fontSize, className }) => (
	<LoadingOutlined style={{ fontSize: fontSize }} className={className} spin/>
);

const Spinner = ({ containerClassName, fontSize, className }) => (
	<div className={cx('spinner-container', containerClassName)}>
		<Spin indicator={<SpinIcon fontSize={fontSize} className={className}/>}/>
	</div>
);

export default Spinner;
