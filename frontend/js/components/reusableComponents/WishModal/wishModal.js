import React from 'react';
import { Button, Modal } from 'antd';
import PropTypes from 'prop-types';
import LinkButton from '../LinkButton/linkButton';
import Spinner from '../Spinner/spinner';
import styles from './wishModal.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const WishModal = ({
	actionAlignment = 'space-between',
	cancelButtonProps,
	cancelText = 'Cancel',
	closable = true,
	confirmLoading = false,
	destroyOnClose = true,
	children,
	modalClassName,
	onCancel,
	onSecondary,
	onPrimary,
	open,
	primaryButtonProps,
	primaryButtonText = 'Ok',
	primaryButtonType = 'primary',
	secondaryButtonProps,
	secondaryButtonText,
	style,
	title,
	width,
}) => {
	const Footer = () => (
		<div style={{ display: 'flex', justifyContent: actionAlignment, alignItems: 'center' }}>
			{!cancelButtonProps && <LinkButton onClick={onCancel}>{cancelText}</LinkButton>}
			{cancelButtonProps && <Button onClick={onCancel} {...cancelButtonProps}>{cancelText}</Button>}
			<div style={{ paddingLeft: '15px' }}>
				{secondaryButtonText && <Button type="default" onClick={onSecondary} {...secondaryButtonProps}>{secondaryButtonText}</Button>}
				<Button type={primaryButtonType} className={cx({ 'button': confirmLoading })} onClick={onPrimary} {...primaryButtonProps}>
					<div className={cx('primary-button-wrapper')}>
						{confirmLoading && <Spinner containerClassName={cx('spinner-container')} className={cx('spinner')}/>}
						<div>{primaryButtonText}</div>
					</div>
				</Button>
			</div>
		</div>
	);

	return (
		<Modal
			bodyStyle={{
				padding: '10px 0',
				margin: '15px 0',
			}}
			cancelButtonProps={{ danger: true }}
			cancelText={cancelText}
			closable={closable}
			destroyOnClose={destroyOnClose}
			footer={<Footer/>}
			onCancel={onCancel}
			onOk={onPrimary}
			open={open}
			style={style}
			title={<div className={cx('title')}>{title}</div>}
			width={width}
			transitionName=""
			className={modalClassName}
		>
			{children}
		</Modal>
	);
};

WishModal.propTypes = {
	actionAlignment: PropTypes.oneOf(['flex-end', 'center', 'flex-start', 'space-between']),
	cancelButtonProps: PropTypes.object,
	cancelText: PropTypes.string,
	closable: PropTypes.bool,
	confirmLoading: PropTypes.bool,
	destroyOnClose: PropTypes.bool,
	children: PropTypes.node,
	modalClassName: PropTypes.string,
	onCancel: PropTypes.func,
	onSecondary: PropTypes.func,
	onPrimary: PropTypes.func,
	open: PropTypes.bool,
	primaryButtonProps: PropTypes.object,
	primaryButtonText: PropTypes.string,
	primaryButtonType: PropTypes.oneOf(['primary', 'default', 'dashed', 'text']),
	secondaryButtonProps: PropTypes.object,
	secondaryButtonText: PropTypes.string,
	style: PropTypes.object,
	title: PropTypes.string,
	width: PropTypes.number,
};

export default WishModal;
