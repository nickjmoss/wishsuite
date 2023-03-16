import React from 'react';
import styles from './login.scss';
import classNames from 'classnames/bind';
import { Form, Button, Input } from 'antd';
import Link from '@reusableComponents/Link/link';

const Item = Form.Item;

const cx = classNames.bind(styles);

const Login = ({ model }) => {
	const [form] = Form.useForm();
	return (
		<div className={cx('login-body')}>
			<div className={cx('welcome')}>Welcome back</div>
			<div className={cx('subtitle')}>Welcome back! Please enter your info.</div>
			<Form
				form={form}
				layout="vertical"
				colon={false}
				onFinish={model.attemptLogin}
				className={cx('form')}
			>
				<Item
					label="Email"
				>
					<Input onChange={(e) => model.setEmail(e.target.value)} type="email" placeholder="Enter your email"/>
				</Item>
				<Item
					label="Password"
				>
					<Input.Password onChange={(e) => model.setPassword(e.target.value)} type="password" placeholder="•••••••" visibilityToggle/>
					<Link className={cx('forgot-password')} to="/auth/forgot-password">Forgot your password?</Link>
				</Item>
				<Item>
					<div className={cx('button-group')}>
						<Button style={{ marginBottom: '10px' }} type="primary" htmlType="submit">Sign in</Button>
					</div>
					<div className={cx('create-account-group')}>
						<div>{"Don't have an account?"}</div>
						<Link className={cx('sign-up')} to="/auth/signup">Sign Up</Link>
					</div>
				</Item>
			</Form>
		</div>
	);
};

export default Login;
