// This is used to determine if a user is authenticated and
// if they are allowed to visit the page they navigated to.

// If they are: they proceed to the page
// If not: they are redirected to the login page.
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useStores } from '@stores';
import Spinner from '@reusableComponents/Spinner/spinner';

const LoginRequired = ({ children }) => {
	const { UserStore } = useStores();
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function fetchData() {
			await UserStore.fetchSession();
			if (UserStore.user?.id) {
				setIsAuthenticated(true);
			}
			setIsLoading(false);
		}
		fetchData();
	}, []);

	if (isLoading) {
		return (
			<div style={{ height: '100vh' }}>
				<Spinner fontSize={32}/>
			</div>
		);
	}

	return (
		isAuthenticated ? children : <Navigate to="/auth/login" />
	);
};

export default LoginRequired;
