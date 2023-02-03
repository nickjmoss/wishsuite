import React from 'react';
import ReactDOM from 'react-dom/client';
import styles from './app.scss';
import classNames from 'classnames/bind';
import { ConfigProvider, Button, message } from 'antd';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginRequired from './components/Login/LoginRequired/LoginRequired';

const cx = classNames.bind(styles)

const root = document.getElementById('root');

const App = () => {
	return(
		<ConfigProvider theme={
			{
				"token": {
				  "colorPrimary": "#585de4",
				  "colorSuccess": "#00c371",
				  "colorWarning": "#f8c220",
				  "colorError": "#f14035",
				  "colorInfo": "#14a6f8",
				  "borderRadius": 6,
				  "wireframe": false
				}
			  }
		}
		>
			<BrowserRouter>
				<Routes>
					<Route exact path='/login' element={<div className={cx('test')}>Login Page</div>}/>
					<Route path='/logout' element={<Button type='default' onClick={() => message.info('Yay')}>Logout</Button>}/>
					<Route path="*"element={
							<LoginRequired>
								<div>Main Page</div>
							</LoginRequired>
						}
					/>
				</Routes>
			</BrowserRouter>
		</ConfigProvider>
	)
}

const reactRoot = ReactDOM.createRoot(root);
reactRoot.render(<App/>)
