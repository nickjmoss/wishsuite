import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import styles from './link.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const Link = ({ to, children, style, className, replace }) => {
	const navigate = useNavigate();

	return (
		<div style={style} className={cx('link', className)} type="link" onClick={() => navigate(to, { replace: replace ? true : false })}>{children}</div>
	);
};

Link.propTypes = {
	children: PropTypes.node,
	to: PropTypes.string,
	style: PropTypes.object,
	className: PropTypes.string,
	replace: PropTypes.bool,
};

export default Link;
