import React from 'react';
import { observer } from 'mobx-react-lite';
import classNames from 'classnames/bind';
import styles from './signUp.scss';
import { Form, Button, Input } from 'antd';
import BackButton from '@reusableComponents/BackButton/backButton';

const Item = Form.Item;
const cx = classNames.bind(styles);

const SignUp = observer(({ model }) => {
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
					onFinish={model.validateForm}
				>
					<Item
						label="First Name"
						name="firstName"
						required
						hasFeedback={model.validation.firstName.hasFeedback}
						validateStatus={model.validation.firstName.validateStatus}
						help={model.validation.firstName.help}
					>
						<Input
							onBlur={(e) => model.validateField(e.target.value, 'string', 'firstName', 'First Name')}
							onChange={(e) => model.setFirstName(e.target.value)}
							placeholder="Enter your first name"/>
					</Item>
					<Item
						label="Last Name"
						name="lastName"
						required
						hasFeedback={model.validation.lastName.hasFeedback}
						validateStatus={model.validation.lastName.validateStatus}
						help={model.validation.lastName.help}
					>
						<Input
							onBlur={(e) => model.validateField(e.target.value, 'string', 'lastName', 'Last Name')}
							onChange={(e) => model.setLastName(e.target.value)}
							placeholder="Enter your last name"
						/>
					</Item>
					<Item
						label="Email"
						name="email"
						required
						hasFeedback={model.validation.email.hasFeedback}
						validateStatus={model.validation.email.validateStatus}
						help={model.validation.email.help}
					>
						<Input
							onBlur={(e) => model.validateField(e.target.value, 'email', 'email')}
							autoComplete="new-password"
							onChange={(e) => model.setEmail(e.target.value)}
							type="email"
							placeholder="Enter your email"
						/>
					</Item>
					<Item
						label="Password"
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
							placeholder="•••••••"
							visibilityToggle
						/>
					</Item>
					<Item
						label="Confirm Password"
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
							placeholder="•••••••"
							visibilityToggle
						/>
					</Item>
					<Item>
						<div className={cx('button-group')}>
							<Button style={{ marginBottom: '10px' }} type="primary" htmlType="submit">Create Account</Button>
						</div>
					</Item>
				</Form>
			</div>
		</>
	);
});

export default SignUp;
