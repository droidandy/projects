import Axios from 'axios';
import Config from 'react-native-config';

const WeatherApi = Axios.create({
  baseURL: Config.WEATHER_URL,
  responseType: 'json',
  params: {
    APPID: Config.WEATHER_API_KEY,
    units: 'metric'
  }
});

const convertLocationFormat = location => ({
  lat: location.lat || location.latitude,
  lon: location.lng || location.longitude
});

const getCurrentWeather = location => (
  WeatherApi.get('/weather', { params: convertLocationFormat(location) })
);

const getForecast = location => (
  WeatherApi.get('/forecast/daily', {
    params: { ...convertLocationFormat(location), cnt: 5 }
  })
);

export default {
  getCurrentWeather,
  getForecast
};
