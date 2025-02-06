import React from 'react';
import styles from './addFriendModal.scss';
import classNames from 'classnames/bind';
import { observer } from 'mobx-react-lite';
import { Button, Input, Layout, List } from 'antd';
import WishModal from '@reusableComponents/WishModal/wishModal';
import { ModelConnector } from '@app/js/stores';
import AddFriendModalModel from './addFriendModal.model';
import ProfilePic from '@app/js/components/reusableComponents/ProfilePic/profilePic';
import { CheckOutlined, PlusOutlined } from '@ant-design/icons';

const cx = classNames.bind(styles);

const UserCard = observer(({ user, onFollow }) => {
	return (
		<List.Item>
			<div className={cx('user-card-wrapper')}>
				<div className={cx('profile-name')}>
					<div>
						<ProfilePic src={user.avatarUrl} size="medium"/>
					</div>
					<div className={cx('name-email')}>
						<div className={cx('name')}>
							{user.fullName}
						</div>
						<div className={cx('email')}>
							{user.email}
						</div>
					</div>
				</div>
				{user.isFollowing &&
					<div className={cx('following')}>
						<CheckOutlined/>
						<span style={{ marginLeft: '5px' }}>Following</span>
					</div>
				}
				{!user.isFollowing &&
					<Button type="primary" icon={<PlusOutlined/>} onClick={() => onFollow(user.id)}>Follow</Button>
				}
			</div>
		</List.Item>
	);
});

const AddFriendModal = observer(({ open, onCancel, onPrimary, model }) => {
	return (
		<WishModal
			primaryButtonText="Done"
			modalClassName={cx('modal')}
			title="Search for other users"
			open={open}
			onCancel={onCancel}
			onPrimary={onPrimary}
		>
			<div className={cx('container')}>
				<div className={cx('subtitle')}>
					If you would like to find a friend who you can connect with and look at their wishlists, search for them below and follow them!
				</div>
				<Input.Search className={cx('user-search')} placeholder="Search a user by email or name" onSearch={model.onSearch} size="large" enterButton={<Button type="primary">Search</Button>} />
				<Layout.Content style={{ paddingRight: '1px' }}>
					<List
						className={cx('list-container')}
						dataSource={[...model.usersList]}
						renderItem={(user) => <UserCard user={user} onFollow={model.onFollow}/>}
					/>
				</Layout.Content>
			</div>
		</WishModal>
	);
});

export default ModelConnector(AddFriendModal, { model: AddFriendModalModel });
