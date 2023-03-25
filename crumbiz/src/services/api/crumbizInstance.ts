// Database
import axios from 'axios';
import Keys from '../Keys';

const crumbizApi = axios.create({
	baseURL: Keys.API_URI,
	headers: {
		'Content-Type': 'application/json'
	}
});
export default crumbizApi;
