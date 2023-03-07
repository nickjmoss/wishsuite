import React, { useState } from 'react';
import { Avatar, Modal } from 'antd';
import PropTypes from 'prop-types';
import styles from './profilePic.scss';
import classNames from 'classnames/bind';
import { EditOutlined } from '@ant-design/icons';

const cx = classNames.bind(styles);

const ProfilePic = ({
	size = 'medium',
	wrapperClassName,
	avatarClassName,
	src,
	editable,
}) => {
	const [showModal, setShowModal] = useState(false);

	const sizeMap = {
		'xl': 150,
		'large': 100,
		'medium': 60,
		'small': 40,
		'xs': 20,
	};

	return (
		<div className={wrapperClassName}>
			<Avatar size={sizeMap[size] || size} className={avatarClassName} src={src} crossOrigin=""/>
			{editable && <div className={cx('edit')} onClick={() => setShowModal(true)}><EditOutlined/></div>}
			<Modal open={showModal} onCancel={() => setShowModal(false)} />
		</div>
	);
};

ProfilePic.propTypes = {
	size: PropTypes.string,
	wrapperClassName: PropTypes.string,
	src: PropTypes.string.isRequired,
	avatarClassName: PropTypes.string,
	editable: PropTypes.bool,
};

export default ProfilePic;
