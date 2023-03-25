import { useEffect, useState } from 'react';
import { CityModel, GetUserDocument, GetUserQuery } from '../../apollo/requests';
import { useApolloClient } from '@apollo/react-hooks';
import ApolloClient from 'apollo-client';
import { getCityByDeviceLocation } from './get-location';

export const DEFAULT_CITY = {
  storageId: 0,
  storeTitle: null,
  code: null,
  name: 'Москва',
  id: 0,
};
const logDetectedCity = (city: CityModel, hint: string) => {
  console.log(`initializeLocationContext ${hint}:`, city.storageId, city.name);
};

async function initializeLocationContext(client: ApolloClient<object>): Promise<CityModel> {
  // get and validate saved city
  const user = await client.query<GetUserQuery>({ query: GetUserDocument });
  if (user.data.user.city && user.data.user.citySelected) {
    logDetectedCity(user.data.user.city, 'from server data');
    return user.data.user.city;
  }
  // if none get and save city by geolocation
  const { city } = await getCityByDeviceLocation(client);
  if (city) {
    logDetectedCity(city, 'by device location:');
    return city;
  }
  // if none get and save default city
  logDetectedCity(DEFAULT_CITY, 'default: city');
  return DEFAULT_CITY;
}

export const useDetectCity = () => {
  const [state, setState] = useState<{ loading: boolean; city?: CityModel }>({ loading: true });
  const client = useApolloClient();
  useEffect(() => {
    initializeLocationContext(client).then(city => {
      setState({ loading: false, city });
    });
  }, [client]);
  return state;
};
