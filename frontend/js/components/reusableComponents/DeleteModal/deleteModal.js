import React from 'react';
import WishModal from '@reusableComponents/WishModal/wishModal';

const DeleteModal = ({ deleteTitle, deleteText, onDelete, onCancel, open }) => (
	<WishModal
		title={deleteTitle}
		onPrimary={onDelete}
		onCancel={onCancel}
		open={open}
		primaryButtonText="Delete"
		primaryButtonProps={{ danger: true }}
	>
		<div>{deleteText}</div>
	</WishModal>
);

export default DeleteModal;
