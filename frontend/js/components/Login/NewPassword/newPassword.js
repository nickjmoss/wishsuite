import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styles from './newPassword.scss';
import classNames from 'classnames/bind';
import { Form, Input, Button } from 'antd';
import { observer } from 'mobx-react-lite';
import Spinner from '@reusableComponents/Spinner/spinner';

const Item = Form.Item;

const cx = classNames.bind(styles);

const NewPassword = observer(({ model }) => {
	const [searchParams] = useSearchParams();
	const userId = searchParams.get('userId');
	const token = searchParams.get('token');
	const navigate = useNavigate();

	useEffect(() => {
		if (userId && token) {
			model.setUserId(userId);
			model.setToken(token);
			model.verifyToken();
		}
		else {
			model.setIsTokenValid(false);
		}
	}, [userId, token]);

	return (
		<>
			{model.isLoading
				?
				<Spinner fontSize={32}/>
				:
				<div className={cx('new-password-container')}>
					{model.tokenIsValid && !model.passwordReset &&
						<>
							<div className={cx('title')}>Set a New Password</div>
							<div className={cx('subtitle')}>Please set a new password for your account.</div>
							<Form
								layout="vertical"
								colon={false}
								onFinish={model.setNewPassword}
							>
								<Item
									label="New Password"
									name="password"
									required
									hasFeedback={model.validation.password.hasFeedback}
									validateStatus={model.validation.password.validateStatus}
									help={model.validation.password.help}
								>
									<Input.Password
										onBlur={(e) => model.validateField(e.target.value, 'password', 'password')}
										autoComplete="new-password"
										onChange={(e) => model.setPassword(e.target.value)}
										placeholder="Enter a new password"
										visibilityToggle
									/>
								</Item>
								<Item
									label="Confirm New Password"
									name="confirmPassword"
									required
									hasFeedback={model.validation.confirmPassword.hasFeedback}
									validateStatus={model.validation.confirmPassword.validateStatus}
									help={model.validation.confirmPassword.help}
								>
									<Input.Password
										onBlur={(e) => model.validateField(e.target.value, 'string', 'confirmPassword', 'Confirm Password')}
										autoComplete="new-password"
										onChange={(e) => model.setConfirmPassword(e.target.value)}
										placeholder="Confirm new password"
										visibilityToggle
									/>
								</Item>
								<Item>
									<Button className={cx('new-password-button')} type="primary" htmlType="submit">Set New Password</Button>
								</Item>
							</Form>
						</>
					}

					{!model.tokenIsValid && !model.passwordReset &&
						<>
							<div className={cx('title')}>Link Expired</div>
							<div className={cx('subtitle')}>
								Hi there, your magic password reset link has expired. Password reset links expire after one hour and can only be used once. Click the button below in order to submit another password reset request.
							</div>
							<Button className={cx('new-password-button')} type="primary" onClick={() => navigate('/auth/forgot-password', { replace: true })}>Request Password Reset</Button>
						</>
					}

					{model.tokenIsValid && model.passwordReset &&
						<>
							<div className={cx('title')}>Password Reset Successful</div>
							<div className={cx('subtitle')}>
								Your password was successfully reset. You can now try logging in to WishSuite.
							</div>
							<Button className={cx('new-password-button')} type="primary" onClick={() => navigate('/auth/login', { replace: true })}>Go To Login</Button>
						</>
					}
				</div>
			}
		</>
	);
});

export default NewPassword;
