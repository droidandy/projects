import { ApolloClient } from 'apollo-client';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import {
  CityModel,
  UpdateCityByLocationDocument,
  UpdateCityByLocationMutation,
  UpdateCityByLocationMutationVariables,
} from '../../apollo/requests';
import { LatLng } from 'react-native-maps';

//region by device location
type TFromGeoRes = { location?: LatLng; city?: CityModel };
const locationOptions = {
  enableHighAccuracy: true,
  accuracy: Location.Accuracy.Highest,
};

export async function getCityByDeviceLocation(client: ApolloClient<object>): Promise<TFromGeoRes> {
  try {
    const response = await Permissions.askAsync(Permissions.LOCATION);
    if (response.status === Permissions.PermissionStatus.GRANTED) {
      const { coords: variables } = await Location.getCurrentPositionAsync(locationOptions);

      const result = await client.mutate<
        UpdateCityByLocationMutation,
        UpdateCityByLocationMutationVariables
      >({
        mutation: UpdateCityByLocationDocument,
        variables,
        fetchPolicy: 'no-cache',
      });
      return { city: result.data?.updateCityByLocation.city, location: variables };
    }
  } catch (e) {
    console.warn(getCityByDeviceLocation, e);
  }
  return {};
}

//endregion
//
// export async function getCityFromDeviceStorage(): Promise<Maybe<CityModel>> {
//   const stored = await AsyncStorage.getItem('@AptStore:city');
//   if (!stored) return null;
//   try {
//     const data = JSON.parse(stored);
//     if (!('storageId' in data) || !('name' in data)) {
//       await AsyncStorage.removeItem('@AptStore:city');
//       return null;
//     }
//     return data;
//   } catch (e) {
//     console.error(e);
//     await AsyncStorage.removeItem('@AptStore:city');
//     return null;
//   }
// }
