import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { Icon, BackBtn } from 'components';
import NavImageButton from 'components/Common/NavImageButton';

import { Settings } from 'containers';
import {
  EditProfile,
  SingleInputEditor,
  PhonesList,
  AddressesList,
  AddressEditor,
  SaveAddressBtn,
  AddAddressBtn,
  InfoPages,
  SaveProfileBtn,
  PaymentCardDetails,
  PaymentCardEditor,
  PaymentCardsList,
  PaymentCardTypes,
  SavePaymentBtn,
  AddPaymentBtn,
  CarTypesEditor,
  AddressEditorBackBtn,
  Statistics,
  FlightTracking,
  FlightTrackingSchedule,
  FlightTrackingHeader
} from 'containers/Settings';

import { strings } from 'locales';
import { isDevMode } from 'utils';
import { navigators, containers } from 'testIDs';

import getDefaultHeaderStyle from './utils';

const IDs = navigators;

const navigationOptions = (
  navigation,
  { headerTitle, title, headerLeft = null, headerRight = null, backOptions = {}, headerStyle = null }
) => ({
  headerTintColor: navigation.state.params.theme.color.primaryText,
  headerStyle: headerStyle || getDefaultHeaderStyle(navigation),
  headerTitle: headerTitle || strings(`header.title.${title}`),
  headerLeft: headerLeft || <BackBtn navigation={navigation} {...backOptions} />,
  headerRight
});

const RoutesConfig = {
  Settings: {
    screen: Settings,
    navigationOptions: ({ navigation }) => navigationOptions(navigation, {
      title: 'settings',
      headerLeft:
        <NavImageButton
          onClick={() => navigation.goBack(null)}
          styleView={{ marginLeft: 20 }}
          icon={<Icon size={20} name="close" color={navigation.state.params.theme.color.primaryText} />}
          testID={containers.Settings.closeSettings}
        />
    })
  },
  EditProfile: {
    screen: EditProfile,
    navigationOptions: ({ navigation }) => navigationOptions(navigation, {
      title: 'editProfile',
      headerRight: <SaveProfileBtn navigation={navigation} testID={IDs.profileSaveButton} />,
      backOptions: { touchedPath: 'passenger.temp.profileTouched', testID: IDs.profileBackButton }
    })
  },
  PaymentCardDetails: {
    screen: PaymentCardDetails,
    navigationOptions: ({ navigation }) => navigationOptions(navigation, { title: 'cardDetails' })
  },
  PaymentCardsList: {
    screen: PaymentCardsList,
    navigationOptions: ({ navigation }) => navigationOptions(navigation, {
      title: 'paymentCards',
      headerRight: <AddPaymentBtn navigation={navigation} />
    })
  },
  PaymentCardEditor: {
    screen: PaymentCardEditor,
    navigationOptions: ({ navigation }) => navigationOptions(navigation, {
      title: 'addCreditCard',
      headerRight: <SavePaymentBtn navigation={navigation} testID={IDs.savePaymentBtn} />,
      backOptions: { touchedPath: 'passenger.touched' }
    })
  },
  PaymentCardTypes: {
    screen: PaymentCardTypes,
    navigationOptions: ({ navigation }) => navigationOptions(navigation, { title: 'cardType' })
  },
  PhonesList: {
    screen: PhonesList,
    navigationOptions: ({ navigation }) => navigationOptions(navigation, { title: 'defaultPhone' })
  },
  SingleInputEditor: {
    screen: SingleInputEditor,
    navigationOptions: ({ navigation }) => navigationOptions(navigation, {
      headerTitle: navigation.state.params.label,
      headerRight: <SaveProfileBtn navigation={navigation} testID={IDs.saveButton} />,
      backOptions: { touchedPath: 'passenger.temp.profileTouched', backAction: navigation.state.params.restorePhone }
    })
  },
  CarTypesEditor: {
    screen: CarTypesEditor,
    navigationOptions: ({ navigation }) => navigationOptions(navigation, {
      title: 'defaultCarType',
      headerRight: <SaveProfileBtn navigation={navigation} />,
      backOptions: { touchedPath: 'passenger.temp.profileTouched' }
    })
  },
  AddressesList: {
    screen: AddressesList,
    navigationOptions: ({ navigation }) => navigationOptions(navigation, {
      title: 'myAddresses',
      headerRight: <AddAddressBtn navigation={navigation} />,
      backOptions: {
        touchedPath: 'passenger.temp.addressTouched',
        backAction: navigation.state.params.onBack,
        testID: IDs.addressesListBack
      }
    })
  },
  AddressEditor: {
    screen: AddressEditor,
    navigationOptions: ({ navigation }) => navigationOptions(navigation, {
      headerTitle: navigation.state.params.editing
        ? strings('header.title.editAddress')
        : strings('header.title.newAddress'),
      headerLeft: <AddressEditorBackBtn navigation={navigation} />,
      headerRight: <SaveAddressBtn navigation={navigation} testID={IDs.addressSave} />
    })
  },
  Statistics: {
    screen: Statistics,
    navigationOptions: ({ navigation }) => navigationOptions(navigation, {
      title: 'statistics'
    })
  },
  InfoPages: {
    screen: InfoPages,
    navigationOptions: ({ navigation }) => navigationOptions(navigation, {
      backOptions: { testID: `${navigation.state.params.page}Back` },
      headerTitle: strings(`information.${navigation.state.params.page}`)
    })
  },
  FlightTracking: {
    screen: FlightTracking,
    navigationOptions: ({ navigation }) => navigationOptions(navigation, {
      headerTitle: strings('header.title.flightTracking')
    })
  },
  FlightTrackingSchedule: {
    screen: FlightTrackingSchedule,
    navigationOptions: ({ navigation }) => ({
      header: <FlightTrackingHeader navigation={navigation} />
    })
  }
};

if (isDevMode) {
  RoutesConfig.IconsList = {
    screen: require('components/Icons/IconsList').default, // eslint-disable-line
    navigationOptions: ({ navigation }) => navigationOptions(navigation, {
      headerTitle: 'Icons List'
    })
  };
}

export default createStackNavigator(
  RoutesConfig,
  {
    initialRouteName: 'Settings',
    headerMode: 'screen',
    gesturesEnabled: false
  }
);
