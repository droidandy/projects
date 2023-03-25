import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View } from 'react-native';
import { Answers } from 'react-native-fabric';

import { UserGuide } from 'components';

import { OrderCreatingScene, OrderScene } from 'containers';

import { setActiveBooking } from 'actions/booking';
import { passGuide, resetGuide } from 'actions/session';
import { AVAILABLE_MAP_SCENES } from 'actions/ui/navigation';

import { withTheme } from 'theme';

import PN from 'utils/notifications';

import { containers } from 'testIDs';

import MapController from './MapController/MapController';

import styles from './style';

const GUIDE_TYPE = 'map';

const IDs = containers.Map;

class Map extends Component {
  static propTypes = {
    activeScene: PropTypes.string,
    app: PropTypes.object,
    navigation: PropTypes.object.isRequired,
    passGuide: PropTypes.func,
    resetGuide: PropTypes.func,
    session: PropTypes.object,
    setActiveBooking: PropTypes.func,
    theme: PropTypes.object,
    themedStyles: PropTypes.object
  };

  state = {
    fromNotifications: false,
    fromOrderList: false,
    fromSettings: false,
    routeNameTab: 'Personal'
  };

  setOrderSceneRef = (el) => { this.orderScene = el; };

  setMapViewRef = (el) => { this.mapView = el; };

  componentDidMount() {
    PN.addNotificationListener({
      navigation: this.props.navigation,
      userToken: this.props.session.token,
      onOpen: this.props.setActiveBooking
    });
  }

  // eslint-disable-next-line class-methods-use-this
  componentWillUnmount() {
    PN.clearNotificationListener();
  }

  resizeMapToDriverAndTargetAddress = (type, order) => (
    this.mapView?.resizeMapToDriverAndTargetAddress(type, order)
  );

  isActiveSceneIs = (name = 'orderCreating') => this.props.activeScene === AVAILABLE_MAP_SCENES[name];

  handleBackFromScreen = ({ fromOrderList = false, fromNotifications = false, fromSettings = false }) => (
    () => {
      this.setState({ fromOrderList, fromNotifications, fromSettings });
    }
  );

  handleBackFromOrderList = ({ fromSettings = false }) => {
    this.setState({ fromOrderList: true, fromSettings });
  };

  setActiveRouteTab = (routeNameTab) => {
    this.setState({ routeNameTab });
  };

  handleShowPanel = () => {
    this.orderScene.showPanel();
  };

  goToOrders = ({ fromSettings = false } = {}) => {
    Answers.logContentView('Orders was opened', 'screen view', 'ordersOpen');

    this.props.navigation.navigate('OrdersView', {
      onBack: this.handleBackFromScreen({ fromOrderList: true }),
      fromSettings,
      onGoToRides: this.goToOrders,
      onChangeTab: this.setActiveRouteTab,
      onGoToNotifications: this.goToNotifications
    });
  };

  goToSettings = () => {
    const { navigation } = this.props;

    Answers.logContentView('Settings was opened', 'screen view', 'settingsOpen');

    navigation.navigate('Settings', {
      theme: navigation.state.params.theme,
      onGoToRides: this.goToOrders,
      onGoToNotifications: this.goToNotifications
    });
  };

  goToNotifications = ({ fromSettings = false }) => {
    this.props.navigation.navigate('NotificationsView', {
      onBack: this.handleBackFromScreen({ fromNotifications: true }),
      fromSettings,
      onGoToRides: this.goToOrders,
      onGoToNotifications: this.goToNotifications,
      theme: this.props.theme
    });
  };

  returnToNotifications = () => {
    this.goToSettings();
    this.goToNotifications({ fromSettings: true });
  };

  returnToOrdersList = () => {
    const { fromSettings, routeNameTab } = this.state;
    const { navigation } = this.props;

    this.goToOrders({ fromSettings });
    navigation.navigate(routeNameTab);

    this.getCurrentPosition();

    this.handleBackFromOrderList({});
  };

  getCurrentPosition = (params) => {
    this.mapView.getCurrentPosition(params);
  };

  goToNextGuide = () => {
    this.props.resetGuide('orders');
    this.goToOrders({});
  };

  isEnableNext = () => {
    const { app: { statuses }, session: { user } } = this.props;
    return !user?.guidePassed && statuses.guideEnableNext;
  };

  render() {
    const { navigation, session: { user }, themedStyles, passGuide } = this.props;
    const { fromOrderList, fromNotifications } = this.state;
    const isOrderCreating = this.isActiveSceneIs('orderCreating');
    const isActiveOrder = this.isActiveSceneIs('activeOrder');
    const isCompletedOrder = this.isActiveSceneIs('completedOrder');

    const activeBookingId = user?.activeBookingId;
    if (activeBookingId && this.isEnableNext()) {
      passGuide();
    }

    const guideDisplayCondition = user?.guideType === GUIDE_TYPE || (this.isEnableNext() && !user?.guideType);
    return (
      <View style={themedStyles.container} testID={IDs.map}>
        {!activeBookingId && guideDisplayCondition &&
          <UserGuide
            goToNextGuide={this.goToNextGuide}
            navigation={navigation}
            type={GUIDE_TYPE}
          />
        }

        {isOrderCreating &&
          <OrderCreatingScene
            navigation={navigation}
            getCurrentPosition={this.getCurrentPosition}
            goToOrders={this.goToOrders}
            goToNotifications={this.goToNotifications}
          />
        }
        {(isActiveOrder || isCompletedOrder) &&
          <OrderScene
            innerRef={this.setOrderSceneRef}
            navigation={navigation}
            fromOrderList={fromOrderList}
            fromNotifications={fromNotifications}
            getCurrentPosition={this.getCurrentPosition}
            resizeMapToDriverAndTargetAddress={this.resizeMapToDriverAndTargetAddress}
            returnToOrdersList={this.returnToOrdersList}
            returnToNotifications={this.returnToNotifications}
          />
        }

        <MapController
          ref={this.setMapViewRef}
          onFutureOrderAcceptedReceive={this.handleShowPanel}
        />
      </View>
    );
  }
}

const mapStateToProps = ({ app, ui, booking, session }) => ({
  activeScene: ui.navigation.activeScene,
  app,
  session,
  status: booking.currentOrder.indicatedStatus || 'connected'
});

const mapDispatchToProps = {
  passGuide,
  resetGuide,
  setActiveBooking
};

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(Map, styles));
