import axios from 'axios';

export default axios.create({
	baseURL: '/',
	validateStatus: (status) => {
		return status < 500;
	},
});
