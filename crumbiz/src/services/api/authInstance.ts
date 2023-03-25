// Azure
import axios from 'axios';
import Keys from '../Keys';

const authApi = axios.create({
	baseURL: Keys.AUTH_API_URI,
	headers: {
		'Content-Type': 'application/x-www-form-urlencoded'
	}
});
export default authApi;
