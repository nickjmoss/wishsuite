import React from 'react';
import styles from './profile.scss';
import classNames from 'classnames/bind';
import { observer } from 'mobx-react-lite';
import { Button } from 'antd';

const cx = classNames.bind(styles);

const Profile = observer(({ model }) => {
	return (
		<div className={cx('wrapper')}>
			<div className={cx('background')}/>
			<div className={cx('main')}>
				<div>Profile Pic</div>
				<div className={cx('name')}>
					{model.user.fullName}
				</div>
				<div>
					<Button type="primary">Edit Profile</Button>
				</div>
			</div>
		</div>
	);
});

export default Profile;
