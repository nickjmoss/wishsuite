import React from 'react';
import styles from './forgotPassword.scss';
import classNames from 'classnames/bind';
import { Input, Form, Button } from 'antd';
import BackButton from '@reusableComponents/BackButton/backButton';

const Item = Form.Item;

const cx = classNames.bind(styles);

const ForgotPassword = ({ model }) => (
	<>
		<div className={cx('back')}>
			<BackButton to="/auth/login">Back to Login</BackButton>
		</div>
		<div className={cx('forgot-container')}>
			<div className={cx('title')}>Forgot Password?</div>
			<div className={cx('subtitle')}>{"No worries, we'll send you reset instructions."}</div>
			<Form
				layout="vertical"
				className={cx('form')}
				onFinish={model.sendPasswordReset}
			>
				<Item
					label="Email"
				>
					<Input onChange={(e) => model.setEmail(e.target.value)} type="email" placeholder="Enter your email"/>
				</Item>
				<Item>
					<Button className={cx('reset-button')} type="primary" htmlType="submit">Send Password Reset</Button>
				</Item>
			</Form>
		</div>
	</>
);

export default ForgotPassword;
