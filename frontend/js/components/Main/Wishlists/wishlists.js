import React from 'react';
import { ModelConnector } from '@stores';
import { observer } from 'mobx-react-lite';
import WishlistsModel from './wishlists.model';
import styles from './wishlists.scss';
import classNames from 'classnames/bind';
import { Table } from 'antd';

const cx = classNames.bind(styles);

const columns = [
	{
		dataIndex: 'name',
		key: 'name',
		title: 'Name',
	},
	{
		dataIndex: 'status',
		key: 'status',
		title: 'Status',
	},
	{
		dataIndex: 'assignendOccasion',
		key: 'assignedOccasion',
		title: 'Occasion',
	},
	{
		dataIndex: 'numOfItems',
		key: 'numOfItems',
		title: 'Number of Items',
	},
	{
		dataIndex: 'actions',
		key: 'actions',
		title: 'Actions',
	},
];

const testData = [
	{
		name: 'Wishlist #1',
		status: 'Active',
	},
];

const Wishlists = observer(({ model }) => {
	return (
		<div className={cx('wrapper')}>
			<div className={cx('title')}>My Wishlists</div>
			<div className={cx('actions-menu')}>
				<div className={cx('action')}>Search Wishlists</div>
				<div className={cx('action')}>Filter Wishlists</div>
				<div className={cx('action')}>Create Wishlist</div>
			</div>
			<div>
				<Table
					dataSource={testData}
					columns={columns}
				/>
			</div>
		</div>
	);
});

export default ModelConnector(Wishlists, { model: WishlistsModel });
