import React from 'react';
import classNames from 'classnames/bind';
import styles from './signUp.scss';
import { Form, Button, Input } from 'antd';
import BackButton from '@reusableComponents/BackButton/backButton';

const Item = Form.Item;
const cx = classNames.bind(styles);

const SignUp = ({ model }) => {
	const [form] = Form.useForm();
	return (
		<>
			<div className={cx('back')}>
				<BackButton to="/auth/login">Back to Login</BackButton>
			</div>
			<div className={cx('signup-body')}>
				<div className={cx('welcome')}>Create Account</div>
				<div className={cx('subtitle')}>Please enter your info to sign up for a WishSuite account.</div>
				<Form
					form={form}
					layout="vertical"
					colon={false}
				>
					<Item
						label="First Name"
					>
						<Input onChange={(e) => console.log(e.target.value)} placeholder="Enter your first name"/>
					</Item>
					<Item
						label="Last Name"
					>
						<Input onChange={(e) => console.log(e.target.value)} placeholder="Enter your last name"/>
					</Item>
					<Item
						label="Email"
					>
						<Input onChange={(e) => console.log(e.target.value)} type="email" placeholder="Enter your email"/>
					</Item>
					<Item
						label="Password"
					>
						<Input.Password onChange={(e) => console.log(e.target.value)} placeholder="•••••••" visibilityToggle/>
					</Item>
					<Item
						label="Confirm Password"
					>
						<Input.Password onChange={(e) => console.log(e.target.value)} placeholder="•••••••" visibilityToggle/>
					</Item>
					<Item>
						<div className={cx('button-group')}>
							<Button style={{ marginBottom: '10px' }} type="primary" htmlType="submit">Create Account</Button>
							<Button type="default">Continue with Google</Button>
						</div>
					</Item>
				</Form>
			</div>
		</>
	);
};

export default SignUp;
