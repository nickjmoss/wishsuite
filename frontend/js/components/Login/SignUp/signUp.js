import React from 'react';
import classNames from 'classnames/bind';
import styles from './signup.scss';
import { Form, Button, Input } from 'antd';
import Link from '@reusableComponents/Link/link';

const Item = Form.Item;
const cx = classNames.bind(styles);

const SignUp = ({ model }) => {
	const [form] = Form.useForm();
	return (
		<>
			<div className={cx('welcome')}>Sign up with WishSuite</div>
			<div className={cx('subtitle')}>Please enter your info.</div>
			<Form
				form={form}
				layout="vertical"
				colon={false}
				autoComplete
			>
				<Item
					label="Email"
				>
					<Input onChange={(e) => console.log(e.target.value)} type="email" placeholder="Enter your email"/>
				</Item>
				<Item
					label="Password"
				>
					<Input.Password onChange={(e) => console.log(e.target.value)} type="password" placeholder="•••••••" visibilityToggle/>
					<Link className={cx('forgot-password')} to="/logout">Forgot your password?</Link>
				</Item>
				<Item>
					<div className={cx('button-group')}>
						<Button style={{ marginBottom: '10px' }} type="primary" htmlType="submit">Sign in</Button>
						<Button type="default">Continue with Google</Button>
					</div>
					<div className={cx('create-account-group')}>
						<div>{"Don't have an account?"}</div>
						<Link className={cx('sign-up')} to="signup">Sign Up</Link>
					</div>
				</Item>
			</Form>
		</>
	);
};

export default SignUp;
