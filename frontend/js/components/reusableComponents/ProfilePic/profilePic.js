import React from 'react';
import { Avatar } from 'antd';
import PropTypes from 'prop-types';
import styles from './profilePic.scss';
import classNames from 'classnames/bind';
import { EditOutlined, UserOutlined } from '@ant-design/icons';

const cx = classNames.bind(styles);

const ProfilePic = ({
	size = 'medium',
	wrapperClassName,
	avatarClassName,
	src,
	editable,
	onEdit,
	bordered,
}) => {
	const sizeMap = {
		'xl': 150,
		'large': 100,
		'medium': 60,
		'small': 40,
		'xs': 20,
	};

	return (
		<div className={cx(wrapperClassName, { 'border': bordered })}>
			{src && <Avatar size={sizeMap[size] || size} shape="circle" className={avatarClassName} src={src} crossOrigin=""/>}
			{!src && <Avatar size={sizeMap[size] || size} shape="circle" icon={<UserOutlined/>} className={avatarClassName} src={null} crossOrigin=""/>}
			{editable && <div className={cx('edit')} onClick={onEdit}><EditOutlined/></div>}
		</div>
	);
};

ProfilePic.propTypes = {
	size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	wrapperClassName: PropTypes.string,
	src: PropTypes.string.isRequired,
	avatarClassName: PropTypes.string,
	editable: PropTypes.bool,
	onEdit: PropTypes.func,
	bordered: PropTypes.bool,
};

export default ProfilePic;
