import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ScrollView, View, StatusBar, Text, TouchableWithoutFeedback, ActivityIndicator, Linking } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { Answers } from 'react-native-fabric';
import { isEmpty, noop } from 'lodash';

import {
  getPassengerData,
  sendPredefinedAddress,
  changeNotifyWithEmail,
  changeNotifyWithSms,
  changeNotifyWithPush,
  changeNotifyWithCalendarEvent,
  changeWheelchairUser,
  getCompanySettings
} from 'actions/passenger';
import { logout, resetGuide, getCurrentUser } from 'actions/session';
import { deleteToken } from 'actions/app/pushNotifications';
import {
  changeShowCarAnimations,
  changeShowLocatingCarAnimation,
  changeShowSplashScreenAnimation
} from 'actions/app/devSettings';
import { onScrollSettings, guideEnableNext, setTouchIdStatus } from 'actions/app/statuses';
import { postEvent } from 'actions/app/gett';

import { AddressModal, OptionsModal, BackBtn, Modal, UserGuide, TouchIdWizard } from 'components';

import { ThemeSettings, ThemeSettingsInfo } from 'containers';

import { withTheme, color } from 'theme';

import { throttledAction, isAndroid } from 'utils';

import { strings } from 'locales';
import { containers } from 'testIDs';

import {
  prepareProfileBlock,
  prepareAddressesBlock,
  prepareSwitchersBlock,
  prepareHistoryBlock,
  prepareInfoBlock,
  prepareBlockOfAnimationSwitches,
  emptyAddress
} from './utils';

import SettingsListItem from './SettingsListItem';

import styles from './style';

const GUIDE_TYPE = 'settings';

const IDs = containers.Settings;

class Settings extends PureComponent {
  static propTypes = {
    autoThemeMode: PropTypes.bool,
    changeDevSettingField: PropTypes.func,
    changeNotifyWithCalendarEvent: PropTypes.func,
    changeNotifyWithEmail: PropTypes.func,
    changeNotifyWithPush: PropTypes.func,
    changeNotifyWithSms: PropTypes.func,
    changeShowCarAnimations: PropTypes.func,
    changeShowLocatingCarAnimation: PropTypes.func,
    changeShowSplashScreenAnimation: PropTypes.func,
    changeWheelchairUser: PropTypes.func,
    customerServicePhone: PropTypes.string,
    deleteToken: PropTypes.func,
    devSettings: PropTypes.object,
    getCompanySettings: PropTypes.func,
    getCurrentUser: PropTypes.func,
    getPassengerData: PropTypes.func.isRequired,
    guideEnableNext: PropTypes.func,
    isConnected: PropTypes.bool,
    isNightMode: PropTypes.bool,
    logout: PropTypes.func.isRequired,
    navigation: PropTypes.object.isRequired,
    onScrollSettings: PropTypes.func,
    passengerData: PropTypes.object,
    postEvent: PropTypes.func,
    resetGuide: PropTypes.func,
    sendPredefinedAddress: PropTypes.func,
    session: PropTypes.object,
    setTouchIdStatus: PropTypes.func,
    theme: PropTypes.object,
    themedStyles: PropTypes.object,
    touchIdStatus: PropTypes.number,
    unreadNotifications: PropTypes.number
  };

  state = {
    logoutLoading: false,
    isThemeSettingsVisible: false,
    isVisibleOptionsModal: false,
    themeInfo: undefined
  };

  setTouchIdWizardRef = (el) => { this.touchIdWizard = el; };

  componentDidMount() {
    const { getPassengerData, getCompanySettings, navigation: { state: { params } }, postEvent } = this.props;
    postEvent('app_menu|screen_appears');
    getPassengerData();
    getCompanySettings();

    if (this.scrollView && params.restoreScrollPosition) {
      if (isAndroid) {
        this.timeoutId = setTimeout(() => {
          this.scrollTo({ animated: false, y: params.restoreScrollPosition });
        }, 0);
      } else {
        this.scrollTo({ animated: false, y: params.restoreScrollPosition });
      }
    }

    if (params.openAddressList) {
      this.goToAddressesList();
    }
  }

  componentDidUpdate({ session: sessionProps }) {
    const { session } = this.props;

    if (session.user.guidePassed !== sessionProps.user.guidePassed && sessionProps.user.guidePassed) {
      this.scrollTo({ x: 0, y: 0 });
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutId);
  }

  scrollTo = ({ x = 0, y, animated = true }) => {
    if (this.scrollView) {
      this.scrollView.scrollTo({ x, y, animated });
    }
  };

  handleToggleOptionsModal = () => {
    this.setState({ isVisibleOptionsModal: !this.state.isVisibleOptionsModal });
  };

  handleScroll = ({ nativeEvent }) => {
    const { onScrollSettings } = this.props;
    onScrollSettings(nativeEvent.contentOffset.y);
  };

  handleOpenThemeModal = () => this.setState({ isThemeSettingsVisible: true });

  handleHideThemeModal = () => this.setState({ isThemeSettingsVisible: false, themeInfo: undefined });

  handleOnThemeModalInfo = themeInfo => this.setState({ themeInfo });

  handlerEmailChange = () => {
    const { touchIdStatus, setTouchIdStatus, getCurrentUser } = this.props;
    const isSetupNeeded = touchIdStatus & 1 > 0;
    if (isSetupNeeded) setTouchIdStatus(touchIdStatus ^ 1);
    getCurrentUser()
      .then(() => { if (isSetupNeeded) this.touchIdWizard.showPopup(); })
      .catch(noop);
  };

  handleCarTypeChange = () => {
    this.props.postEvent('default_car_type|save|button_clicked');
  };

  handleLogout = async () => {
    if (!this.state.logoutLoading && this.props.isConnected) {
      const { deleteToken, logout, navigation, postEvent } = this.props;

      this.setState({ logoutLoading: true });
      postEvent('app_menu|log_out|button_clicked');
      await deleteToken();

      navigation.navigate('Login', { disableAnimation: true, disableTouchId: true });
      logout();
    }
  };

  goToEditProfile = throttledAction(() => {
    this.props.navigation.navigate('EditProfile', { theme: this.props.theme, keys: ['firstName', 'lastName'] });
  });

  goToAddressesList = throttledAction(() => {
    this.props.navigation.navigate('AddressesList', {
      theme: this.props.theme,
      openAddressModal: this.openAddressModal,
      onBack: this.props.navigation.state.params.onBack
    });
    Answers.logContentView('My Addresses was opened', 'screen view', 'myAddressesOpen');
    this.props.postEvent('app_menu|my_addresses|button_clicked');
  });

  goToCarTypesEditor = throttledAction(() => {
    Answers.logContentView('Default Car type was opened', 'screen view', 'defaultCarTypeOpen');
    this.props.navigation.navigate('CarTypesEditor', { theme: this.props.theme, onSuccess: this.handleCarTypeChange });
  });

  goToEmailEditor = throttledAction(() => {
    this.props.navigation.navigate('SingleInputEditor', {
      key: 'email',
      label: strings('header.title.email'),
      theme: this.props.theme,
      onSuccess: this.handlerEmailChange
    });
  });

  goToPhonesList = throttledAction(() => {
    this.props.navigation.navigate('PhonesList', { theme: this.props.theme });
  });

  openAddressModal = throttledAction((predefinedType) => {
    const { passengerData, postEvent } = this.props;
    const address = passengerData.passenger[`${predefinedType}Address`];
    this.addressModal.open(address && address.line ? address : emptyAddress, { predefinedType });
    postEvent(`app_menu|${predefinedType}|button_clicked`);
  });

  openHomeAddressEditor = () => this.openAddressModal('home');

  openWorkAddressEditor = () => this.openAddressModal('work');

  handleAddressChange = (address, meta) => {
    this.props.sendPredefinedAddress(address, meta.predefinedType);
  };

  handleTouchIdStatusChange = () => {
    const { touchIdStatus, setTouchIdStatus } = this.props;
    const nextStatus = touchIdStatus ^ 1;

    if (nextStatus & 1) {
      return this.touchIdWizard.start();
    }

    return setTouchIdStatus(nextStatus);
  };

  goToNotifications = throttledAction(() => {
    Answers.logContentView('Notifications was opened', 'screen view', 'notificationsOpen');
    this.props.navigation.goBack(null);
    this.props.navigation.state.params.onGoToNotifications({ fromSettings: true });
  });

  goToStatistics = throttledAction(() => {
    const { navigation, postEvent, theme } = this.props;
    Answers.logContentView('Statistics was opened', 'screen view', 'statisticsOpen');
    postEvent('app_menu|statistics|button_clicked');
    navigation.navigate('Statistics', { theme });
  });

  goToMyRides = throttledAction(() => {
    this.props.navigation.goBack(null);
    Answers.logContentView('My Rides was opened', 'screen view', 'myRidesOpen');
    this.props.navigation.state.params.onGoToRides({ fromSettings: true });
  });

  goToFlightTracking = throttledAction(() => {
    Answers.logContentView('Flight Tracking was opened', 'screen view', 'flightTrackingOpen');
    this.props.navigation.navigate('FlightTracking', { theme: this.props.theme });
  });

  goToMyPayments = throttledAction(() => {
    Answers.logContentView('Payment Cards was opened', 'screen view', 'paymentCardsOpen');
    this.props.navigation.navigate('PaymentCardsList', { theme: this.props.theme });
  });

  goToInfoPage = throttledAction((page) => {
    Answers.logContentView(`${strings(`information.${page}`)} was opened`, 'screen view', `${page}Open`);
    this.props.navigation.navigate('InfoPages', { page, theme: this.props.theme });
  });

  goToIconsList = throttledAction(() => {
    this.props.navigation.navigate('IconsList', { theme: this.props.theme });
  });

  goToPrivacyPolicy = () => this.goToInfoPage('privacyPolicy');

  goToTermsConditions = () => this.goToInfoPage('termsConditions');

  callCustomerService = () => Linking.openURL(`tel:${this.props.customerServicePhone}`);

  getSettingsBlocks() {
    const {
      devSettings,
      passengerData: data,
      session: { user },
      unreadNotifications,
      autoThemeMode,
      isNightMode,
      changeShowCarAnimations,
      changeShowLocatingCarAnimation,
      changeShowSplashScreenAnimation,
      changeNotifyWithEmail,
      changeNotifyWithSms,
      changeNotifyWithPush,
      changeNotifyWithCalendarEvent,
      changeWheelchairUser,
      touchIdStatus
    } = this.props;

    return [
      prepareProfileBlock(data, {
        goToEditProfile: this.goToEditProfile,
        goToEmailEditor: this.goToEmailEditor,
        goToPhonesList: this.goToPhonesList,
        goToCarTypesEditor: this.goToCarTypesEditor,
        goToMyPayments: this.goToMyPayments
      }),
      prepareAddressesBlock(data, user.guidePassed, {
        goToAddressesList: this.goToAddressesList,
        openHomeAddressEditor: this.openHomeAddressEditor,
        openWorkAddressEditor: this.openWorkAddressEditor
      }),
      prepareSwitchersBlock({ autoThemeMode, isNightMode, touchIdStatus, ...data }, {
        changeNotifyWithEmail,
        changeNotifyWithSms,
        changeNotifyWithPush,
        changeNotifyWithCalendarEvent,
        changeWheelchairUser,
        handleTouchIdStatusChange: this.handleTouchIdStatusChange,
        handleOpenThemeModal: this.handleOpenThemeModal
      }),
      prepareHistoryBlock({
        goToFlightTracking: this.goToFlightTracking,
        goToMyRides: this.goToMyRides,
        goToStatistics: this.goToStatistics
      }),
      prepareInfoBlock({ unreadNotifications }, {
        goToPrivacyPolicy: this.goToPrivacyPolicy,
        goToTermsConditions: this.goToTermsConditions,
        goToNotifications: this.goToNotifications,
        callCustomerService: this.callCustomerService,
        resetUserGuide: this.handleToggleOptionsModal,
        goToIconsList: this.goToIconsList
      }),
      prepareBlockOfAnimationSwitches(devSettings, {
        changeShowCarAnimations,
        changeShowLocatingCarAnimation,
        changeShowSplashScreenAnimation
      })
    ];
  }

  renderBlock = (data, index) => {
    const { themedStyles } = this.props;
    return (
      <View key={index} style={themedStyles.blockItems}>
        {data.map((listItem, indexItem, arr) => (
          <SettingsListItem key={indexItem} {...listItem} last={indexItem + 1 === arr.length} />
        ))}
      </View>
    );
  };

  renderLogoutBtn = () => {
    const { logoutLoading } = this.state;
    const { themedStyles } = this.props;

    return (
      <TouchableWithoutFeedback onPress={this.handleLogout} testID={IDs.logout}>
        <View style={themedStyles.logoutBtn}>
          {logoutLoading
            ? <ActivityIndicator color={color.danger} />
            : <Text style={themedStyles.logoutText}>{strings('settings.button.logout')}</Text>
          }
        </View>
      </TouchableWithoutFeedback>
    );
  };

  renderAppVersionBlock() {
    const { themedStyles } = this.props;
    return (
      <View style={themedStyles.appVersion}>
        <Text style={themedStyles.appVersionText} testID={IDs.appVersion}>
          {strings('settings.label.version')} {isAndroid ? DeviceInfo.getVersion() : DeviceInfo.getReadableVersion()}
        </Text>
      </View>
    );
  }

  onHandlePress = () => {
    this.setState({ themeInfo: undefined });
  };

  renderThemeModalLeftButton = () => (
    this.state.themeInfo ? (<BackBtn handlePress={this.onHandlePress} />) : null
  );

  renderThemeModalContent = () => (
    this.state.themeInfo
      ? <ThemeSettingsInfo chosenThemeInfo={this.state.themeInfo} />
      : <ThemeSettings handleOnThemeModalInfo={this.handleOnThemeModalInfo} onClose={this.handleHideThemeModal} />
  );

  goToGuide = ({ type, handler = () => {} }) => {
    const { postEvent, guideEnableNext } = this.props;
    guideEnableNext(false);
    setTimeout(() => this.props.resetGuide(type), 1000);
    postEvent('app_menu|watch_tutorial|guide_selected', { guide: type });
    handler();
  };

  modalOptions = ([
    {
      label: strings('settings.label.guideByOrdersList'),
      onPress: () => this.goToGuide({ type: 'orders', handler: this.goToMyRides })
    },
    {
      label: strings('settings.label.guideByMakingOrder'),
      onPress: () => this.goToGuide({ type: 'map', handler: () => this.props.navigation.navigate('MapView') })
    },
    {
      label: strings('settings.label.guideByUserSettings'),
      onPress: () => this.goToGuide({ type: 'settings' })
    }
  ]);

  scrollRef = (el) => { this.scrollView = el; };

  addressModalRef = (el) => { this.addressModal = el; };

  isGuideMode() {
    const { session: { user } } = this.props;
    return !isEmpty(user) && !user.guidePassed;
  }

  render() {
    const { theme: { type }, session: { user }, themedStyles, navigation } = this.props;
    const { isThemeSettingsVisible, isVisibleOptionsModal } = this.state;
    const isNightMode = type === 'dark';
    return (
      <Fragment>
        <StatusBar barStyle={isNightMode ? 'light-content' : 'default'} animated />
        {this.isGuideMode() && user?.guideType === GUIDE_TYPE &&
          <UserGuide
            navigation={navigation}
            scrollTo={this.scrollTo}
            type={GUIDE_TYPE}
          />
        }
        <ScrollView
          ref={this.scrollRef}
          scrollEventThrottle={200}
          onScroll={this.handleScroll}
          style={themedStyles.container}
          testID={IDs.scrollViewSettings}
        >
          {this.getSettingsBlocks().map(this.renderBlock)}
          {this.renderLogoutBtn()}
          {this.renderAppVersionBlock()}
        </ScrollView>
        <AddressModal
          hideFavorites
          innerRef={this.addressModalRef}
          onChange={this.handleAddressChange}
          navigation={this.props.navigation}
        />
        <Modal
          contentStyles={themedStyles.themeModeModal}
          gesturesEnabled
          isVisible={isThemeSettingsVisible}
          onClose={this.handleHideThemeModal}
          leftButton={this.renderThemeModalLeftButton()}
        >
          {this.renderThemeModalContent()}
        </Modal>
        <OptionsModal
          isVisible={isVisibleOptionsModal}
          options={this.modalOptions}
          onClose={this.handleToggleOptionsModal}
        />
        <TouchIdWizard innerRef={this.setTouchIdWizardRef} email={user.email} />
      </Fragment>
    );
  }
}

const mapStateToProps = ({ app, passenger, network, notifications, session }) => ({
  autoThemeMode: app.theme.autoThemeMode,
  customerServicePhone: passenger.companySettings.customerServicePhone,
  devSettings: app.devSettings,
  isConnected: network.isConnected,
  isNightMode: app.theme.isNightMode,
  passengerData: passenger.data,
  session,
  touchIdStatus: app.statuses.touchIdStatus,
  unreadNotifications: notifications.unreadCounter
});

const mapDispatchToProps = {
  changeNotifyWithCalendarEvent,
  changeNotifyWithEmail,
  changeNotifyWithPush,
  changeNotifyWithSms,
  changeShowCarAnimations,
  changeShowLocatingCarAnimation,
  changeShowSplashScreenAnimation,
  changeWheelchairUser,
  deleteToken,
  getCompanySettings,
  getCurrentUser,
  getPassengerData,
  guideEnableNext,
  logout,
  onScrollSettings,
  postEvent,
  resetGuide,
  sendPredefinedAddress,
  setTouchIdStatus
};

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(Settings, styles));
