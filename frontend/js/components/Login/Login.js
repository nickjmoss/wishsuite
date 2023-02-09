import React from 'react';
import classNames from 'classnames/bind';
import styles from './login.scss';
import SVG from '@reusableComponents/SVG/svg';
import { Form, Button, Input } from 'antd';
import Link from '@reusableComponents/Link/link';

const Item = Form.Item;

const cx = classNames.bind(styles);

const Login = () => {
	const [form] = Form.useForm();
	return (
		<div className={cx('login-container')}>
			<div className={cx('login-wrapper')}>
				<div className={cx('left-side')}>
					<div className={cx('header')}>
						<SVG name="wishSuitePrimary"/>
					</div>
					<div className={cx('login-body')}>
						<div className={cx('welcome')}>Welcome back</div>
						<div className={cx('subtitle')}>Welcome back! Please enter your info.</div>
						<Form
							form={form}
							layout="vertical"
							colon={false}
						>
							<Item
								label="Email"
							>
								<Input type="email" placeholder="Enter your email"/>
							</Item>
							<Item
								label="Password"
							>
								<Input.Password type="password" placeholder="•••••••" visibilityToggle/>
								{/* <Link to="/logout">Forgot your password?</Link> */}
							</Item>
							<Item>
								<Button type="primary">Login</Button>
							</Item>
						</Form>
					</div>
				</div>
				<div className={cx('right-side')}/>
			</div>
		</div>
	)
}

export default Login;
