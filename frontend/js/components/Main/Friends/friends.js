import React from 'react';
import styles from './friends.scss';
import classNames from 'classnames/bind';
import { observer } from 'mobx-react-lite';
import WishTable from '@reusableComponents/WishTable/wishTable';
import FriendsModel from './friends.model';
import { ModelConnector } from '@app/js/stores';
import { Input, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ProfilePic from '@reusableComponents/ProfilePic/profilePic';
import LinkButton from '@reusableComponents/LinkButton/linkButton';
import AddFriendModal from './AddFriendModal/addFriendModal';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);


const Friends = observer(({ model }) => {
	const navigate = useNavigate();
	const columns = [
		{
			dataIndex: 'fullName',
			key: 'firstName',
			title: 'Name',
			sorter: true,
			render: (fullName, friend) => (
				<div className={cx('full-name')}>
					<div className={cx('icon')}><ProfilePic size="small" src={friend.avatarUrl || ''}/></div>
					<div>{fullName}</div>
				</div>
			),
		},
		{
			dataIndex: 'email',
			key: 'email',
			title: 'Email',
		},
		{
			dataIndex: 'actions',
			key: 'actions',
			title: 'Actions',
			render: (_, friend) => (
				<LinkButton onClick={(e) => {e.stopPropagation(); model.onUnfollow(friend.id)}}>Unfollow</LinkButton>
			),
		},
	];

	return (
		<div className={cx('wrapper')}>
			<div className={cx('title')}>
				Your Friends
			</div>
			<div className={cx('actions')}>
				<div className={cx('action', 'search')}>
					<Input.Search placeholder="Search for a friend..." onSearch={model.onSearch}/>
				</div>
				<div className={cx('action')}>
					<Button type="primary" onClick={model.openModal} icon={<PlusOutlined/>}>Add a Friend</Button>
				</div>
			</div>
			<div>
				<WishTable
					loading={model.isLoading}
					dataSource={[...model.friendsList]}
					columns={columns}
					rowKey={record => record.id}
					onChange={model.onTableChange}
					pagination={model.pagination}
					onRow={(record) => {
						return {
							onClick: () => {
								navigate(`/friends/${record.id}`);
							},
						};
					}}
				/>
			</div>
			<AddFriendModal
				onCancel={model.closeModal}
				open={model.showModal}
				onPrimary={model.onModalDone}
			/>
		</div>
	);
});

export default ModelConnector(Friends, { model: FriendsModel });
