import React, { useEffect } from 'react';
import isEqual from 'lodash/isEqual';
import { useSelector } from 'react-redux';
import { useForm } from 'react-final-form';
import { StateModel } from 'store/types';
import { VehicleFormSellValuesContacts, VehicleFormSellValuesProfile } from 'types/VehicleFormType';
import { mapUserToValuesProfile } from './utils';
import { getCookieImpersonalization } from 'helpers/authCookies';

export const UserStateListener = () => {
  const user = useSelector((state: StateModel) => state.user);
  const form = useForm<VehicleFormSellValuesContacts>();

  useEffect(() => {
    const { values } = form.getState();
    if (user.isAuthorized && (user.firstName || getCookieImpersonalization()) && !values.authSuccess) {
      // TODO регистрировать на уровне контейнера авторизации/контактов
      const nextValues = { authSuccess: 1, ...mapUserToValuesProfile(user) };
      form.batch(() => {
        (Object.keys(nextValues) as (keyof VehicleFormSellValuesProfile)[]).forEach((key) => {
          if (!!nextValues[key] && !isEqual(values[key], nextValues[key])) {
            form.change(key, nextValues[key]);
          }
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return <></>;
};
