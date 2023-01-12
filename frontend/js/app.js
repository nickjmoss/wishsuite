import React from 'react';
import ReactDOM from 'react-dom/client';

const root = document.getElementById('root');

const App = () => {
	return(
		<h1 className='test'>
			React application
		</h1>
	)
}

const reactRoot = ReactDOM.createRoot(root);
reactRoot.render(<App/>)
