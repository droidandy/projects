import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { CityModel, useGetCitiesQuery } from '../../apollo/requests';
import { keyExtractor } from '../../helpers/models';
import { FlatDataContainer } from '../layouts/FlatDataContainer/FlatDataContainer';
import { DataChecker } from '../../components/DataChecker/DataChecker';
import { SeparatorLine } from '../../components/SeparatorLine/SeparatorLine';
import { Image } from '../../components/Image/Image';
import { styles } from './LocationChange.styles';
import { DataContainer } from '../layouts/DataContainer/DataContainer';
import { Loader } from '../../components/Loader/Loader';
import { useChangeCity } from '../../contexts/common-data-provider';
import IMAGES from '../../resources';

interface CityProps {
  city: CityModel;
  setCity: (city: CityModel) => void;
}

const City = ({ city, setCity }: CityProps) => {
  const onPress = () => {
    console.log('city OnPress', city);
    setCity(city);
  };

  return (
    <TouchableOpacity key="container" onPress={onPress} style={styles.city}>
      <Text style={styles.cityText}>{city.name}</Text>
    </TouchableOpacity>
  );
};

const LocationChangeBase = () => {
  const { data, loading, error, refetch } = useGetCitiesQuery({ fetchPolicy: 'network-only' });
  const [changeCity, inProgress, currentCity] = useChangeCity();

  const [lookupCartError, setLookupCartError] = useState(false);

  const cities = data?.cities;
  const cityName = currentCity.name;

  if (inProgress) {
    return (
      <DataContainer key="container-loader" scrollContentStyle={styles.containerLoader}>
        <Loader label="Применение города" />
      </DataContainer>
    );
  }

  const loadingCart = false;
  const errorCart = undefined;

  if (lookupCartError && errorCart) {
    return (
      <DataChecker
        key="data-checker"
        loading={false}
        error="Произошла непредвиденная ошибка при применении города"
        data={true}
        loadingLabel="Обновление корзины"
        noDataLabel="Не удалось обновить корзину"
        refetch={(): Promise<void> => Promise.resolve(setLookupCartError(false))}
      />
    );
  }

  return (
    <DataChecker
      key="data-checker"
      loading={loading || loadingCart}
      error={error}
      data={cities}
      loadingLabel="Загрузка списка городов"
      noDataLabel="Нет доступных городов"
      refetch={refetch}
    >
      <FlatDataContainer
        key="container"
        data={cities}
        keyExtractor={keyExtractor}
        renderItem={info => <City city={info.item} setCity={changeCity} />}
        ListHeaderComponent={
          <View key="location" style={styles.location}>
            <Image
              key="icon"
              source={cityName ? IMAGES.locationGreen : IMAGES.locationGray}
              style={styles.icon}
            />
            <Text key="city" style={cityName ? styles.locationCitySelected : styles.locationCity}>
              {cityName ? cityName : 'Определение местоположения'}
            </Text>
          </View>
        }
        ItemSeparatorComponent={SeparatorLine}
      />
    </DataChecker>
  );
};

export const LocationChange = React.memo<{}>(LocationChangeBase);
