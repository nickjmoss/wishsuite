import React from 'react';
import styles from './backButton.scss';
import classNames from 'classnames/bind';
import { LeftOutlined } from '@ant-design/icons';
import Link from '@reusableComponents/Link/link';

const cx = classNames.bind(styles);

const BackButton = ({ children, to, props }) => (
	<div className={cx('back-container')}>
		<LeftOutlined className={cx('icon')} />
		<Link to={to} className={cx('text')} {...props}>{children}</Link>
	</div>
);

export default BackButton;
