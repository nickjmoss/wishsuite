import React from 'react';
import { ModelConnector } from '@stores';
import { observer } from 'mobx-react-lite';
import WishlistsModel from './wishlists.model';
import styles from './wishlists.scss';
import classNames from 'classnames/bind';
import { Radio, Input, Button, Tag } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import WishTable from '@reusableComponents/WishTable/wishTable';
import AddWishlistModal from './AddWishlistModal/addWishlistModal';

const cx = classNames.bind(styles);

const columns = [
	{
		dataIndex: 'name',
		key: 'name',
		title: 'Name',
		sorter: true,
	},
	{
		dataIndex: 'isPublished',
		key: 'isPublished',
		title: 'Status',
		sorter: true,
		render: (published) => {
			const text = published ? 'Published' : 'Unpublished';
			return (
				<Tag color={!published ? 'red' : 'cyan'}>{text}</Tag>
			);
		},
	},
	{
		dataIndex: 'occasion',
		key: 'occasion',
		title: 'Occasion',
		sorter: true,
		render: (occasion) => ( occasion.name ),
	},
	{
		dataIndex: 'items',
		key: 'items',
		title: 'Number of Items',
		sorter: true,
		render: (items) => ( items.length ),
	},
	{
		dataIndex: 'actions',
		key: 'actions',
		title: 'Actions',
	},
];

const Wishlists = observer(({ model }) => {
	return (
		<div className={cx('wrapper')}>
			<div className={cx('title')}>Your Wishlists</div>
			<div className={cx('actions-menu')}>
				<div className={cx('action')}>
					<Radio.Group onChange={(e) => model.setFilter(e.target.value)} defaultValue="all" buttonStyle="solid">
						<Radio.Button value="all">All</Radio.Button>
						<Radio.Button value="published">Published</Radio.Button>
						<Radio.Button value="unpublished">Unpublished</Radio.Button>
					</Radio.Group>
				</div>
				<div className={cx('action', 'search')}>
					<Input.Search size="medium" enterButton={<SearchOutlined/>} onSearch={model.onSearch} placeholder="Search for a wishlist..." />
				</div>
				<div className={cx('action')}>
					<Button onClick={model.openAddModal} type="primary" icon={<PlusOutlined/>}>Add a Wishlist</Button>
				</div>
			</div>
			<div>
				<WishTable
					dataSource={[...model.wishlistsList]}
					columns={columns}
					pagination={{
						position: ['bottomCenter'],
						hideOnSinglePage: true,
					}}
					onChange={model.onTableChange}
				/>
			</div>
			<AddWishlistModal
				open={model.showAddModal}
				onCancel={model.closeAddModal}
				onCreate={model.createWishlist}
			/>
		</div>
	);
});

export default ModelConnector(Wishlists, { model: WishlistsModel });
