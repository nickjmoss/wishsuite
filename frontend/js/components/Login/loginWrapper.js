import React from 'react';
import classNames from 'classnames/bind';
import styles from './loginWrapper.scss';
import SVG from '@reusableComponents/SVG/svg';
import { Routes, Route } from 'react-router-dom';
import { LoginModel } from './Login/login.model';
import { SignUpModel } from './SignUp/signUp.model';
import { RecoverPasswordModel } from './RecoverPassword/recoverPassword.model';
import Login from './Login/login';
import SignUp from './SignUp/signUp';
import RecoverPassword from './RecoverPassword/recoverPassword';

const cx = classNames.bind(styles);

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
