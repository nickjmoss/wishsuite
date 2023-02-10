import React from 'react';
import ReactDOM from 'react-dom/client';
import { StoreContext, rootStore } from '@stores';
import { ConfigProvider, Button, message } from 'antd';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginRequired from '@components/Login/LoginRequired/LoginRequired';
import { LoginModel } from './components/Login/login.model';
import Main from '@components/Main/main';
import Login from '@app/js/components/Login/Login.js';

const root = document.getElementById('root');

const App = () => {
	return (
		<StoreContext.Provider value={rootStore}>
			<ConfigProvider theme={
				{
					'token': {
						'colorPrimary': '#585de4',
						'colorSuccess': '#00c371',
						'colorWarning': '#f8c220',
						'colorError': '#f14035',
						'colorInfo': '#14a6f8',
						'borderRadius': 6,
						'wireframe': false,
					},
				}
			}
			>
				<BrowserRouter>
					<Routes>
						<Route exact path="/login" element={<Login model={LoginModel.create({})}/>}/>
						<Route path="/logout" element={<Button type="default" onClick={() => message.info('Yay')}>Logout</Button>}/>
						<Route path="*"element={
							<LoginRequired>
								<Main/>
							</LoginRequired>
						}
						/>
					</Routes>
				</BrowserRouter>
			</ConfigProvider>
		</StoreContext.Provider>
	);
};

const reactRoot = ReactDOM.createRoot(root);
reactRoot.render(<App/>);
