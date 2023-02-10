import React from 'react';
import classNames from 'classnames/bind';
import styles from './login.scss';
import SVG from '@reusableComponents/SVG/svg';
import { Form, Button, Input } from 'antd';
import Link from '@reusableComponents/Link/link';

// TO DO:
// Resolve Migrations in prod
// Figure out why module alias is not working for this file

const Item = Form.Item;

const cx = classNames.bind(styles);

const Login = ({ model }) => {
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
							onFinish={model.attemptLogin}
							autoComplete
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
								<Link className={cx('forgot-password')} to="/logout">Forgot your password?</Link>
							</Item>
							<Item>
								<div className={cx('button-group')}>
									<Button style={{ marginBottom: '10px' }} type="primary" htmlType="submit">Sign in</Button>
									<Button type="default">Continue with Google</Button>
								</div>
							</Item>
						</Form>
					</div>
				</div>
				<div className={cx('right-side')}/>
			</div>
		</div>
	);
};

export default Login;
