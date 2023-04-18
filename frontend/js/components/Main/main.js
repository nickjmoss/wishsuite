import { Input } from 'antd';
import React from 'react';
import { Routes, Route, useNavigate, Link } from 'react-router-dom';
import styles from './main.scss';
import classNames from 'classnames/bind';
import SVG from '@reusableComponents/SVG/svg';
import { UserOutlined, SearchOutlined } from '@ant-design/icons';
import TabLink from '@reusableComponents/TabLink/tabLink';
import Profile from './Profile/profile';
import Occasions from './Occasions/occasions';
import Wishlists from './Wishlists/wishlists';
import Friends from './Friends/friends';
import SearchResults from './SearchResults/searchResults';
import WishlistDetails from './Wishlists/WishlistDetails/wishlistDetails';
import FriendsDetails from './Friends/FriendsDetails/friendsDetails';
import FriendsItems from './Friends/FriendsDetails/FriendsWishlists/FriendsItems/friendsItems';

const cx = classNames.bind(styles);

const Main = () => {
	const navigate = useNavigate();
	return (
		<div className={cx('main')}>
			<div className={cx('header-container')}>
				<div>
					<Link to="/wishlists"><SVG name="wishSuitePrimary" /></Link>
				</div>
				<div className={cx('menu-buttons')}>
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
						<Input.Search
							size="medium"
							className={cx('search-bar')}
							onSearch={(val) => val && navigate(`/search?query=${val}`)}
							enterButton={<SearchOutlined/>}
							placeholder="Search for an item..."
						/>
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
					<Route path="/search" element={<SearchResults/>}/>
					<Route path="/profile" element={<Profile/>}/>
					<Route path="/wishlists/*" element={
						<Routes>
							<Route path="/" element={<Wishlists/>}/>
							<Route path=":wishlist_id" element={<WishlistDetails/>}/>
						</Routes>
					}/>
					<Route path="/friends/*" element={
						<Routes>
							<Route path="/" element={<Friends/>}/>
							<Route path=":friend_id" element={<FriendsDetails/>}/>
							<Route path=":friend_id/wishlists/:wishlist_id" element={<FriendsItems/>}/>
						</Routes>
					}/>
					<Route path="/occasions" element={<Occasions/>}/>
				</Routes>
			</div>
		</div>
	);
};

export default Main;
