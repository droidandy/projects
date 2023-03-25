class DevKeys {
	static AUTH_CLIENT_ID = 'crumbiz_dev';
	static AUTH_CLIENT_SECRET = '54e709e8-2b9a-81fd-154d-9ac1b9c7415c';
	static AUTH_REDIRECT_URI = 'http://localhost';
	static AUTH_API_URI = 'https://crumidentdev.azurewebsites.net';
	static API_URI = 'https://crumbizdev.azurewebsites.net/api';
	static ONE_SIGNAL_API_KEY = 'ea4b787f-ac95-4010-9e50-5c1cfb00f0ce';
}

class ProdKeys {
	static AUTH_CLIENT_ID = 'crumbiz_prod';
	static AUTH_CLIENT_SECRET = 'd862fa64-3fbc-960d-00bf-3a0445dce7d5';
	static AUTH_REDIRECT_URI = 'http://localhost';
	static AUTH_API_URI = 'https://crumidentprod.azurewebsites.net/';
	static API_URI = 'https://crumbiz.azurewebsites.net/api';
	static ONE_SIGNAL_API_KEY = 'ea4b787f-ac95-4010-9e50-5c1cfb00f0ce';
}

class QaKeys {
	static AUTH_CLIENT_ID = 'crumbiz_qa';
	static AUTH_CLIENT_SECRET = '4b342ba0-6a82-1b6c-1fcc-ff6fc765699b';
	static AUTH_REDIRECT_URI = 'http://localhost';
	static AUTH_API_URI = 'https://crumidentqa.azurewebsites.net/';
	static API_URI = 'https://crumbizqa.azurewebsites.net/api';
	static ONE_SIGNAL_API_KEY = 'ea4b787f-ac95-4010-9e50-5c1cfb00f0ce';
}
const keys = process.env.NODE_ENV === 'development' ? DevKeys : QaKeys;
export default keys;
