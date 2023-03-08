import { Button, Input } from 'antd';
import React from 'react';
import { Routes, Route, useNavigate, Link } from 'react-router-dom';
import styles from './main.scss';
import classNames from 'classnames/bind';
import { useStores } from '@stores';
import SVG from '@reusableComponents/SVG/svg';
import { UserOutlined, SearchOutlined } from '@ant-design/icons';
import TabLink from '@reusableComponents/TabLink/tabLink';
import Home from './Home/home';
import { HomeModel } from './Home/home.model';
import Profile from './Profile/profile';
import { ProfileModel } from './Profile/profile.model';

const cx = classNames.bind(styles);

const Main = () => {
	const navigate = useNavigate();
	const { UserStore } = useStores();
	return (
		<div className={cx('main')}>
			<div className={cx('header-container')}>
				<div>
					<Link to="/"><SVG name="wishSuitePrimary" /></Link>
				</div>
				<div className={cx('menu-buttons')}>
					<div className={cx('menu-button')}>
						<TabLink to="/">Home</TabLink>
					</div>
					<div className={cx('menu-button')}>
						<TabLink to="/wishlists">Wishlists</TabLink>
					</div>
					<div className={cx('menu-button')}>
						<TabLink to="/friends">Friends</TabLink>
					</div>
					<div className={cx('menu-button')}>
						<TabLink to="/occasions">Occasions</TabLink>
					</div>
				</div>
				<div className={cx('search-profile')}>
					<div className={cx('search')}>
						<Input.Search size="medium" className={cx('search-bar')} enterButton={<SearchOutlined/>} placeholder="Search for an item..." />
					</div>
					<div className={cx('profile')}>
						<TabLink to="/profile">
							<UserOutlined className={cx('user-icon')}/>
							<span style={{ paddingLeft: '10px' }}>Profile</span>
						</TabLink>
					</div>
				</div>
			</div>
			<div className={cx('core')}>
				<Routes>
					<Route path="/" element={<Home model={HomeModel.create({})}/>}/>
					<Route path="/search" element={<div>Search Results</div>}/>
					<Route path="/profile" element={<Profile model={ProfileModel.create({})} />}/>
					<Route path="/wishlists" element={<div>Wishlists Page</div>}/>
					<Route path="/friends" element={<div>Friends Page</div>}/>
					<Route path="/occasions" element={<div>Occasions Page</div>}/>
				</Routes>
			</div>
		</div>
	);
};

export default Main;
