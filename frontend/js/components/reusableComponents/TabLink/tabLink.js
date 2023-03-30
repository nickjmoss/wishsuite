import React from 'react';
import styles from './tabLink.scss';
import classNames from 'classnames/bind';
import { Link, useLocation } from 'react-router-dom';

const cx = classNames.bind(styles);

const TabLink = ({ to, children, className }) => {
	const location = useLocation();
	return (
		<Link className={cx('tab-button', { 'active': location.pathname === to }, className)} to={to}>{children}</Link>
	);
};

export default TabLink;
