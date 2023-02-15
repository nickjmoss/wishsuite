import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import styles from './spinner.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const SpinIcon = ({ fontSize, props }) => (
	<LoadingOutlined style={{ fontSize: fontSize }} {...props} spin/>
);

const Spinner = ({ containerClassName, fontSize, props }) => (
	<div className={cx('spinner-container', containerClassName)}>
		<Spin indicator={<SpinIcon fontSize={fontSize}/>} {...props}/>
	</div>
);

export default Spinner;
