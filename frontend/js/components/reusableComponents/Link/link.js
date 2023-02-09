import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import styles from './link.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const Link = ({ to, children, style }) => {
	const navigate = useNavigate();

	return (
		<div style={style} className={cx('link')} type="link" onClick={() => navigate(to)}>{children}</div>
	);
};

Link.propTypes = {
	children: PropTypes.node,
	to: PropTypes.string,
	style: PropTypes.object,
};

export default Link;
