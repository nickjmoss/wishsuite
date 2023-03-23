import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { Table } from 'antd';
import styles from './wishTable.scss';
const cx = classNames.bind(styles);

const WishTable = ({ className, ...props }) => (
	<div className={cx('container', className)}>
		<Table {...props} />
	</div>
);

WishTable.propTypes = {
	className: PropTypes.string,
};

export default WishTable;
