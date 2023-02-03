// This is used to determine if a user is authenticated and
// if they are allowed to visit the page they navigated to.

// If they are: they proceed to the page
// If not: they are redirected to the login page.
import React from 'react';
import { Link, Route, Navigate } from 'react-router-dom';

const LoginRequired = ({ children }) => {

  // Add your own authentication on the below line.
  const isLoggedIn = true;

  return (
	isLoggedIn ? children : <Navigate to="/login" />
  );
};

export default LoginRequired;
