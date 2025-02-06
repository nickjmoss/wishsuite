import React, { useEffect } from 'react';
import { ModelConnector } from '@stores';
import { observer } from 'mobx-react-lite';
import FriendsWishlistsModel from './friendsWishlists.model';
import styles from './friendsWishlists.scss';
import classNames from 'classnames/bind';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import WishTable from '@reusableComponents/WishTable/wishTable';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);


const FriendsWishlists = observer(({ model }) => {
	const { friend_id } = useParams();
	useEffect(() => {
		if (friend_id) {
			model.setFriendId(friend_id);
			model.fetchFriendsWishlists();
		}
	}, [friend_id]);

	const navigate = useNavigate();

	const columns = [
		{
			dataIndex: 'name',
			key: 'name',
			title: 'Name',
			sorter: true,
		},
		{
			dataIndex: 'occasion',
			key: 'occasion',
			title: 'Occasion',
			sorter: true,
			render: (occasion) => ( occasion ? occasion.name : 'None' ),
		},
		{
			dataIndex: 'items',
			key: 'items',
			title: 'Number of Items',
			sorter: true,
			render: (items) => ( items.length ),
		},
	];

	return (
		<>
			<div className={cx('actions-menu')}>
				<div className={cx('action', 'search')}>
					<Input.Search size="medium" enterButton={<SearchOutlined/>} onSearch={model.onSearch} placeholder="Search for a wishlist..." />
				</div>
			</div>
			<div>
				<WishTable
					dataSource={[...model.publicWishlists]}
					columns={columns}
					pagination={model.pagination}
					onChange={model.onTableChange}
					loading={model.isLoading}
					onRow={(record) => {
						return {
							onClick: () => {
								navigate(`wishlists/${record.id}`);
							},
						};
					}}
				/>
			</div>
		</>
	);
});

export default ModelConnector(FriendsWishlists, { model: FriendsWishlistsModel });
