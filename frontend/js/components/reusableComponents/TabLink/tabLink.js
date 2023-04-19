import React from 'react';
import styles from './tabLink.scss';
import classNames from 'classnames/bind';
import { Link, useLocation } from 'react-router-dom';

const cx = classNames.bind(styles);

const TabLink = ({ to, children, className }) => {
	const location = useLocation();
	const regex = new RegExp(`^${to}.*`);
	return (
		<Link className={cx('tab-button', { 'active': regex.test(location.pathname) }, className)} to={to}>{children}</Link>
	);
};

export default TabLink;
