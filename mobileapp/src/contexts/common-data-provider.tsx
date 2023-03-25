import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import {
  CartFragment,
  CityFragment,
  CityModel,
  ListPharmacyFragment,
  useChangeCityMutation,
  useGetCartQuery,
  useGetPharmaciesQuery,
  useGetUserQuery,
  UserFragment,
} from '../apollo/requests';
import { LoaderScreen } from '../components/Loader/Loader';
import { ErrorScreen } from '../components/text/Error/Error';
import { CheckAndDetectCity } from '../components/LocationProvider/CheckAndDetectCity';
import { useNavigation } from '../hooks/navigation';
import { useApolloClient } from '@apollo/react-hooks';
import { sortStreets, testAroundTheClock } from '../helpers/helpers';

type PharmaciesCtx = {
  all: ListPharmacyFragment[];
  cityPharmacies: ListPharmacyFragment[];
  favorites: ListPharmacyFragment[];
  allFavorites: ListPharmacyFragment[];
  aroundTheClock: ListPharmacyFragment[];
  refetch?: (...args: any[]) => Promise<any>;
};

const pharmaciesDefaultVal: PharmaciesCtx = {
  all: [],
  allFavorites: [],
  cityPharmacies: [],
  favorites: [],
  aroundTheClock: [],
};

const CommonDataCtx = createContext({
  setPhoto: (photo: string) => {
    console.log(photo);
  },
  photo: '',
  search: '',
  setSearch: ((s: string) => {
    console.log(s);
  }) as React.Dispatch<React.SetStateAction<string>>,
  user: {} as UserFragment,
  cart: {} as CartFragment,
  pharmacies: pharmaciesDefaultVal,
});

export const CommonDataProvider = ({ children }: PropsWithChildren<{}>) => {
  const [photo, setPhoto] = useState<string>('');
  const [search, setSearch] = useState('');
  const userQuery = useGetUserQuery({
    fetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: true,
  });
  const cartQuery = useGetCartQuery({
    // fetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: true,
  });
  const pharmaciesQuery = useGetPharmaciesQuery({
    fetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: true,
  });

  const pharmacies = useMemo(() => {
    // не склад
    const all: ListPharmacyFragment[] =
      pharmaciesQuery.data?.pharmacies
        .filter(p => p.id !== 0)
        .sort((a, b) => sortStreets(a.address, b.address)) || [];
    const cityName = userQuery.data?.user.city.name.toLowerCase() || '';
    const cityPharmacies = all.filter(p => p.city.toLowerCase().indexOf(cityName) > -1);
    const favorites = cityPharmacies.filter(p => p.isFavourite);
    const allFavorites = all.filter(p => p.isFavourite);
    const aroundTheClock = cityPharmacies.filter(testAroundTheClock);
    return {
      all,
      cityPharmacies,
      favorites,
      allFavorites,
      aroundTheClock,
      refetch: pharmaciesQuery.refetch,
    };
  }, [pharmaciesQuery.data?.pharmacies, pharmaciesQuery.refetch, userQuery.data?.user.city.name]);

  if (userQuery.loading || cartQuery.loading) {
    return <LoaderScreen label="Получение данных пользователя..." />;
  }
  if (pharmaciesQuery.loading) {
    return <LoaderScreen label="Получение списка аптек..." />;
  }

  if (userQuery.error || !userQuery.data) {
    return <ErrorScreen text="Ошибка получения данных пользователя" refetch={userQuery.refetch} />;
  }
  if (cartQuery.error || !cartQuery.data) {
    return <ErrorScreen text="Ошибка получения корзины" refetch={cartQuery.refetch} />;
  }
  if (pharmaciesQuery.error || !pharmaciesQuery.data) {
    return <ErrorScreen text="Ошибка получения списка аптек" refetch={cartQuery.refetch} />;
  }

  const { user } = userQuery.data;
  const { cart } = cartQuery.data;
  return (
    <CommonDataCtx.Provider value={{ user, cart, pharmacies, search, setSearch, photo, setPhoto }}>
      <CheckAndDetectCity key="location">{children}</CheckAndDetectCity>
    </CommonDataCtx.Provider>
  );
};

export const useUser = () => {
  const { user } = useContext(CommonDataCtx);
  return user;
};

export const useCart = () => {
  const { cart } = useContext(CommonDataCtx);
  return cart;
};

export const useFavouritesCount = () => {
  const { user, pharmacies } = useContext(CommonDataCtx);
  const { cityPharmacies } = pharmacies;
  const pharmaciesCount = cityPharmacies.filter(p => user.favoritePharmaciesIds.includes(p.id))
    .length;
  return pharmaciesCount + user.favoriteProductsIds.length;
};

export const useCity = () => {
  const user = useUser();
  return user.city;
};

export const useCartProductsCount = () => {
  const cart = useCart();
  return cart.quantity;
};

export const useNotificationsCount = () => {
  return 3;
};

type ChangeCityFunc = (city: CityFragment) => void;

export const usePharmacies = () => {
  const { pharmacies } = useContext(CommonDataCtx);
  return pharmacies;
};

export const useSearch = () => {
  const { search, setSearch } = useContext(CommonDataCtx);
  return { search, setSearch };
};

export const usePhoto = () => {
  const { photo, setPhoto } = useContext(CommonDataCtx);
  return { photo, setPhoto };
};

export const useChangeCity = (): [ChangeCityFunc, boolean, CityFragment] => {
  const currentCity = useCity();
  const [mutate, mutationState] = useChangeCityMutation();
  const [resetting, setResetting] = useState(false);
  const navigation = useNavigation();
  const client = useApolloClient();
  const changeCity = useCallback(
    (city: CityModel): void => {
      if (city.id === currentCity.id) {
        navigation.goBack();
        return;
      } else {
        mutate({ variables: { id: city.id } }).then(ok => {
          if (ok) {
            setResetting(true);
            client
              .resetStore()
              .then(() => {
                navigation.goBack();
              })
              .finally(() => setResetting(false));
          }
        });
      }
    },
    [client, currentCity, mutate, navigation],
  );
  return [changeCity, mutationState.loading || resetting, currentCity];
};
