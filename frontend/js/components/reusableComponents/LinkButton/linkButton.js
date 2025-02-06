import React from 'react';
import styles from './linkButton.scss';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

const cx = classNames.bind(styles);

const LinkButton = ({ onClick, children, className }) => (
	<div onClick={onClick} className={cx('link-button', className)}>
		{children}
	</div>
);

LinkButton.propTypes = {
	onClick: PropTypes.func.isRequired,
	children: PropTypes.node,
	className: PropTypes.string,
};

export default LinkButton;
