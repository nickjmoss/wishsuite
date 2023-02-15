import React, { useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './login.scss';
import SVG from '@reusableComponents/SVG/svg';
import { Form, Button, Input } from 'antd';
import Link from '@reusableComponents/Link/link';
import { Routes, Route, useLocation } from 'react-router-dom';
import { LoginModel } from './login.model';
import { SignUpModel } from './SignUp/signUp.model';
import { RecoverPasswordModel } from './RecoverPassword/recoverPassword.model';
import SignUp from './SignUp/signUp';
import RecoverPassword from './RecoverPassword/recoverPassword';

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
					<Link className={cx('forgot-password')} to="/auth/password">Forgot your password?</Link>
				</Item>
				<Item>
					<div className={cx('button-group')}>
						<Button style={{ marginBottom: '10px' }} type="primary" htmlType="submit">Sign in</Button>
						<Button type="default">Continue with Google</Button>
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

const LoginWrapper = () => (
	<div className={cx('login-container')}>
		<div className={cx('login-wrapper')}>
			<div className={cx('left-side')}>
				<div className={cx('header')}>
					<SVG name="wishSuitePrimary"/>
				</div>
				<Routes>
					<Route exact path="login" element={<Login model={LoginModel.create({})}/>}/>
					<Route exact path="signup" element={<SignUp model={SignUpModel.create({})}/>}/>
					<Route exact path="password" element={<RecoverPassword model={RecoverPasswordModel.create({})}/>}/>
				</Routes>
			</div>
			<div className={cx('right-side')}/>
		</div>
	</div>
);

export default LoginWrapper;
