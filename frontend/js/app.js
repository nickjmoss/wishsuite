import React from 'react';
import ReactDOM from 'react-dom/client';
import styles from './app.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles)

const root = document.getElementById('root');

const App = () => {
	return(
		<h1 className={cx('test')}>
			Welcome to your React application Boilerplate
		</h1>
	)
}

const reactRoot = ReactDOM.createRoot(root);
reactRoot.render(<App/>)
