import { User } from '@marketplace/ui-kit/types';
import { VehicleFormSellValuesProfile } from 'types/VehicleFormType';
import { getStore } from 'store/ssr';
import { getCookieImpersonalization } from 'helpers/authCookies';

export const mapUserToValuesProfile = (user: User): VehicleFormSellValuesProfile => ({
  phone: user.phone,
  email: user.email || null,
  firstName: user.firstName,
  lastName: user.lastName || null,
  middleName: user.patronymicName || null,
});

export const getInitialServiceRequestValues = (): any => {
  const store = getStore();
  const {
    serviceRequest: { values },
    user,
    city: { current: currentCity },
  } = store.getState();
  const initialValues: any = { ...values };
  // fill user
  if (!values.authSuccess && user.isAuthorized && (user.firstName || getCookieImpersonalization())) {
    const contacts = mapUserToValuesProfile(user);
    Object.assign(initialValues, contacts, { authSuccess: 1 });
  }
  if (!initialValues.city) {
    Object.assign(initialValues, {
      // eslint-disable-next-line no-nested-ternary
      city: currentCity.id
        ? // Если выбраны Москва и МО или вся Россия, то Москва
          currentCity.id === 1 || currentCity.id === 2
          ? 17849
          : currentCity.id
        : null,
    });
  }
  return initialValues;
};
