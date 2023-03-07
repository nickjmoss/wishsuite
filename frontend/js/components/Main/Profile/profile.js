import React from 'react';
import styles from './profile.scss';
import classNames from 'classnames/bind';
import { observer } from 'mobx-react-lite';
import { Button } from 'antd';
import ProfilePic from '@reusableComponents/ProfilePic/profilePic';

const cx = classNames.bind(styles);

const Profile = observer(({ model }) => {
	return (
		<div className={cx('wrapper')}>
			<div className={cx('background')}/>
			<div className={cx('main')}>
				<div className={cx('avatar-wrapper')}>
					<ProfilePic
						size={125}
						wrapperClassName={cx('profile-placement')}
						avatarClassName={cx('profile-pic')}
						src="https://res.cloudinary.com/dbtgm7sed/image/upload/v1675713800/logos/icon-color_pekgin.png"
						editable
					/>
				</div>
				<div className={cx('info')}>
					<div className={cx('name')}>
						{model.user.fullName}
					</div>
				</div>
				<div className={cx('edit-profile')}>
					<Button type="primary">Edit Profile</Button>
				</div>
			</div>
		</div>
	);
});

export default Profile;
