import React, { useEffect } from 'react';
import styles from './friendsDetails.scss';
import classNames from 'classnames/bind';
import FriendsDetailsModel from './friendsDetails.model';
import { useParams } from 'react-router-dom';
import { ModelConnector } from '@app/js/stores';
import { observer } from 'mobx-react-lite';
import { Tabs } from 'antd';
import FriendsWishlists from './FriendsWishlists/friendsWishlists';
import FriendsOccasions from './FriendsOccasions/friendsOccasions';

const cx = classNames.bind(styles);

const FriendsDetails = observer(({ model }) => {
	const { friend_id } = useParams();
	useEffect(() => {
		if (friend_id) {
			model.fetchFriend(friend_id);
		}
	}, [friend_id]);

	const tabItems = [
		{
			key: 'wishlists',
			label: 'Wishlists',
			children: <FriendsWishlists/>,
		},
		{
			key: 'occasions',
			label: 'Occasions',
			children: <FriendsOccasions/>,
		},
	];

	return (
		<>
			{model.friend &&
				<div className={cx('wrapper')}>
					<div className={cx('friend-name')}>{model.friend.fullName}</div>
					<div className={cx('friend-detail')}>
						<div className={cx('key')}>Email:</div>
						<div className={cx('value')}>{model.friend.email}</div>
					</div>
					<div className={cx('tabs')}>
						<Tabs
							defaultActiveKey="wishlists"
							items={tabItems}
						/>
					</div>
				</div>
			}
		</>
	);
});

export default ModelConnector(FriendsDetails, { model: FriendsDetailsModel });
