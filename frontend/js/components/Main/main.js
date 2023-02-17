import { Button } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStores } from '@stores';

const Main = () => {
	const { UserStore } = useStores();
	const navigate = useNavigate();
	return (
		<>
			<div>Main Page</div>
			<Button type="default" onClick={() => UserStore.logoutUser(navigate)}>Log Out</Button>
		</>
	);
};

export default Main;
