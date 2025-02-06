import React from 'react';
import classNames from 'classnames/bind';
import styles from './loginWrapper.scss';
import SVG from '@reusableComponents/SVG/svg';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { LoginModel } from './Login/login.model';
import { SignUpModel } from './SignUp/signUp.model';
import { ForgotPasswordModel } from './ForgotPassword/forgotPassword.model';
import { NewPasswordModel } from './NewPassword/newPassword.model';
import Login from './Login/login';
import SignUp from './SignUp/signUp';
import ForgotPassword from './ForgotPassword/forgotPassword';
import NewPassword from './NewPassword/newPassword';

const cx = classNames.bind(styles);

const LoginWrapper = () => {
	const navigate = useNavigate();
	return (
		<div className={cx('login-container')}>
			<div className={cx('login-wrapper')}>
				<div className={cx('left-side')}>
					<div className={cx('header')}>
						<div style={{ cursor: 'pointer' }} onClick={() => navigate('/wishlists')}><SVG name="wishSuitePrimary"/></div>
					</div>
					<Routes>
						<Route exact path="login" element={<Login model={LoginModel.create({})}/>}/>
						<Route exact path="signup" element={<SignUp model={SignUpModel.create({})}/>}/>
						<Route exact path="forgot-password" element={<ForgotPassword model={ForgotPasswordModel.create({})}/>}/>
						<Route path="new-password" element={<NewPassword model={NewPasswordModel.create({})}/>}/>
					</Routes>
				</div>
				<div className={cx('right-side')}/>
			</div>
		</div>
	);
};

export default LoginWrapper;
