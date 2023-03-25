import React, { PropsWithChildren } from 'react';
import { View } from 'react-native';
import { useDetectCity } from './use-detect-city';
import { Loader } from '../Loader/Loader';
import { Error } from '../text/Error/Error';

export const CheckAndDetectCity = ({ children }: PropsWithChildren<{}>) => {
  const { loading, city } = useDetectCity();
  if (loading) {
    return (
      <View key="container" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Loader key="loader" size="large" label="Определение вашего города..." />
      </View>
    );
  }
  if (!city) {
    return <Error text="Не получилось определить ваш город" />;
  }
  return <>{children}</>;
};
