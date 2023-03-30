import React, { useEffect } from 'react';
import styles from './profile.scss';
import classNames from 'classnames/bind';
import { observer } from 'mobx-react-lite';
import { Button, Divider, Input, Popconfirm, Upload } from 'antd';
import ProfilePic from '@reusableComponents/ProfilePic/profilePic';
import { useNavigate } from 'react-router-dom';
import WishModal from '@reusableComponents/WishModal/wishModal';
import { UploadOutlined } from '@ant-design/icons';
import { ModelConnector } from '@app/js/stores';
import Spinner from '@reusableComponents/Spinner/spinner';
import ProfileModel from './profile.model';

const cx = classNames.bind(styles);

const Profile = observer(({ model }) => {
	const navigate = useNavigate();

	return (
		<>
			{model.isLoading &&
				<Spinner
					containerClassName={cx('spinner-container')}
					className={cx('spinner')}
					fontSize={36}
				/>
			}
			<div className={cx('wrapper')}>
				<div className={cx('background')}/>
				<div className={cx('main')}>
					<div className={cx('avatar-wrapper')}>
						<ProfilePic
							size={125}
							wrapperClassName={cx('profile-placement')}
							avatarClassName={cx('profile-pic')}
							src={model.isEditing ? model.temporaryUser.avatarUrl : model.user.avatarUrl}
							editable={model.isEditing}
							onEdit={() => model.setShowUploadModal(true)}
							bordered
						/>
					</div>
					<div className={cx('info')}>
						<div className={cx('name')}>
							{model.user.fullName}
						</div>
						<Divider/>
						<div className={cx('section')}>Contact Info</div>
						<div className={cx('info-block')}>
							<div className={cx('key')}>First Name</div>
							{!model.isEditing && <div>{model.user.firstName}</div>}
							{model.isEditing && <Input defaultValue={model.user.firstName} onChange={(e) => model.setFirstName(e.target.value)}/>}
						</div>
						<div className={cx('info-block')}>
							<div className={cx('key')}>Last Name</div>
							{!model.isEditing && <div>{model.user.lastName}</div>}
							{model.isEditing && <Input defaultValue={model.user.lastName} onChange={(e) => model.setLastName(e.target.value)}/>}
						</div>
						<div className={cx('info-block')}>
							<div className={cx('key')}>Email</div>
							{!model.isEditing && <div>{model.user.email}</div>}
							{model.isEditing && <Input type="email" defaultValue={model.user.email} onChange={(e) => model.setEmail(e.target.value)}/>}
						</div>
						<Divider/>
						<div>
							{!model.isEditing && <Button className={cx('margin')} type="default" onClick={() => model.logOut(navigate)}>Log Out</Button>}
							{!model.isEditing &&
								<Popconfirm
									title="Delete WishSuite Account"
									description="Are you sure you want to delete your WishSuite account? This cannot be undone."
									okText="Yes, I am sure"
									okButtonProps={{
										danger: true,
									}}
									cancelText="Cancel"
									onConfirm={() => model.deleteUser(navigate)}
								>
									<Button className={cx('margin')} type="default" danger>Delete Account</Button>
								</Popconfirm>
							}
						</div>
					</div>
					<div className={cx('edit-profile')}>
						{model.isEditing && <Button className={cx('margin')} type="primary" danger onClick={model.cancelChanges}>Cancel Changes</Button>}
						{!model.isEditing && <Button type="primary" onClick={model.editProfile}>Edit Profile</Button>}
						{model.isEditing && <Button type="primary" onClick={model.saveChanges}>Save Changes</Button>}
					</div>
				</div>
				<WishModal
					open={model.showUploadModel}
					onCancel={model.onCancelUpload}
					title="Upload New Profile Picture"
					onPrimary={() => model.setShowUploadModal(false)}
					primaryButtonText="Save New Picture"
					primaryButtonProps={{
						disabled: model.uploadDisabled,
					}}
				>
					<div className={cx('upload-wrapper')}>
						<ProfilePic
							size={'xl'}
							src={model.temporaryUser.avatarUrl}
							bordered
						/>
						<Upload
							onChange={model.handleUploadChange}
							beforeUpload={model.beforeUpload}
							customRequest={model.dummyRequest}
							showUploadList={false}
						>
							<Button className={cx('upload-button')} type="default"><UploadOutlined/>Upload Profile Picture</Button>
						</Upload>
					</div>
				</WishModal>
			</div>
		</>
	);
});

export default ModelConnector(Profile, { model: ProfileModel });
