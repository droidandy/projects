import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, Text, Image, TouchableWithoutFeedback } from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment-timezone';
import { debounce, isEmpty, isEqual } from 'lodash';
import Config from 'react-native-config';

import { getOrders, clearOrdersList, initialOrdersList } from 'actions/orders';
import { setActiveBooking } from 'actions/booking';
import { resetGuide } from 'actions/session';

import { strings } from 'locales';
import { withTheme } from 'theme';

import { ListView, Icon, PointList, UserGuide } from 'components';

import { timeFormat, convertToZone, deviceWidth } from 'utils';

import { Answers } from 'react-native-fabric';
import styles from './styles';
import mapStyles from './mapStyles';
import darkMapStyles from './darkMapStyles';

import { getLabelType, getOrdersStatuses } from '../../utils';
import { fakeOrders } from './utils';

const GUIDE_TYPE = 'orders';

class OrdersList extends PureComponent {
  static propTypes = {
    clearOrdersList: PropTypes.func,
    getOrders: PropTypes.func,
    idsType: PropTypes.string,
    initialOrdersList: PropTypes.func,
    items: PropTypes.array,
    meta: PropTypes.object,
    navigation: PropTypes.object,
    ordersParams: PropTypes.object,
    passengerId: PropTypes.number,
    resetGuide: PropTypes.func,
    session: PropTypes.object,
    setActiveBooking: PropTypes.func,
    theme: PropTypes.object,
    themedStyles: PropTypes.object,
    type: PropTypes.string
  };

  state = {
    loading: false,
    pagination: {
      current: 0,
      total: 0
    },
    showEmptyLabel: false
  };

  setListViewRef = (el) => { this.listView = el; };

  componentDidMount() {
    this.getOrders();

    if (this.props.meta) {
      this.updateCounter(this.props.meta);
    }
  }

  componentDidUpdate({ meta: metaProps, ordersParams: ordersParamsProps, session: sessionProps }) {
    const { meta, ordersParams, session } = this.props;
    if (!isEqual(ordersParams, ordersParamsProps)) {
      this.getOrders();
    }

    if (session.user.guidePassed !== sessionProps.user.guidePassed) {
      this.updateCounter(meta);
    }

    if (meta && (!metaProps || meta.total !== metaProps.total)) {
      this.updateCounter(meta);
    }
  }

  componentWillUnmount() {
    this.props.clearOrdersList();
  }

  isGuideMode() {
    const { session: { user } } = this.props;
    return !isEmpty(user) && !user.guidePassed;
  }

  goToOrderDetails = (id) => {
    const { setActiveBooking, navigation } = this.props;
    setActiveBooking(id)
      .then(() => {
        navigation.state.params.onBack({ fromSettings: navigation.state.params.fromSettings });

        navigation.goBack(null);
      });
  };

  scrollTo = ({ offset }) => {
    if (this.listView) {
      this.listView.scrollToOffset({ offset });
    }
  };

  updateCounter = (meta) => {
    const { navigation } = this.props;
    const orderItems = this.getOrderItems();
    navigation.setParams({ count: this.isGuideMode() ? orderItems.length : meta?.total });
  };

  // eslint-disable-next-line class-methods-use-this
  get mapSize() {
    const width = deviceWidth - 40;
    const height = 140;
    return {
      size: `${width * 1.5}x${height * 1.5}`,
      width,
      height
    };
  }

  getOrders = debounce((nextPageRequired = false) => {
    const { getOrders, type, idsType, items, meta, passengerId, ordersParams, initialOrdersList } = this.props;
    const { loading } = this.state;

    if (!loading && (!items.length || items.length < meta.total || !nextPageRequired)) {
      this.setState({ loading: true, showEmptyLabel: true });

      if (!nextPageRequired) {
        initialOrdersList(idsType || type);
      }

      const params = {
        page: ((nextPageRequired && meta.current) || 0) + 1,
        order: 'scheduledAt',
        status: getOrdersStatuses(type || 'active'),
        reverse: true,
        mapSize: this.mapSize.size,
        ...ordersParams
      };

      if (idsType) {
        params[`${idsType}PassengerIds`] = [passengerId];
      }

      getOrders(params, idsType || type, nextPageRequired).then(() => this.setState({ loading: false }));
    }
  }, 750);

  getOrderItems = () => {
    const { items } = this.props;

    return this.isGuideMode() && items.length <= 2 ? fakeOrders : items;
  };

  onEndReached = () => this.getOrders(true);

  goToNextGuide = () => {
    const { navigation, resetGuide } = this.props;
    resetGuide('settings');

    navigation.goBack(null);
    this.goToSettings();
  };

  goToSettings = () => {
    const { navigation } = this.props;
    Answers.logContentView('Settings was opened', 'screen view', 'settingsOpen');

    navigation.navigate('Settings', {
      theme: navigation.state.params.theme,
      onGoToRides: navigation.state.params.onGoToRides,
      onGoToNotifications: navigation.state.params.onGoToNotifications
    });
  };

  renderItem = ({ item }) => {
    const { theme, themedStyles } = this.props;
    const mapTheme = theme.isNightMode ? darkMapStyles : mapStyles;
    let timezoneDate = item.scheduledAt;

    if (item.timezone) {
      timezoneDate = convertToZone(item.scheduledAt, item.timezone);
    }
    const processedMap = item.staticMap
      .replace('scale=1', 'scale=2')
      .replace('color:0x2B4983FF', `color:0x${theme.color.route}FF`);

    const mapUrl = `${processedMap}&${mapTheme}&key=${Config.GOOGLE_API_KEY}`;

    return (
      <TouchableWithoutFeedback key={item.id} onPress={() => this.goToOrderDetails(item.id)}>
        <View style={themedStyles.orderWrapper}>
          <View>
            <View style={themedStyles.orderMap}>
              <Image
                source={{ uri: mapUrl }}
                style={[{ width: this.mapSize.width, height: this.mapSize.height }, themedStyles.orderMap]}
              />
            </View>
          </View>
          <View style={themedStyles.orderDetails}>
            <View style={themedStyles.row}>
              <Text style={themedStyles.orderDate} numberOfLines={1}>
                {moment(timezoneDate).format(`D MMM YYYY, ${timeFormat()}`)}
              </Text>
              <View style={[
                themedStyles.orderLabel,
                themedStyles[`orderLabel${getLabelType(item.indicatedStatus)}`]
              ]}>
                <Text style={[
                  themedStyles.orderLabelText,
                  themedStyles[`orderLabelText${getLabelType(item.indicatedStatus)}`]
                ]}>
                  {strings(`order.status.${item.indicatedStatus}`).toUpperCase()}
                </Text>
              </View>
              {item.recurringNext &&
                <View style={themedStyles.recurringIcon}>
                  <Icon name="recurring" color={theme.color.primaryText} size={16} />
                </View>
              }
            </View>
            <PointList
              allowEmptyDestination={false}
              data={item}
              editable={false}
              noItemMargin={false}
              orderDetails
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  render() {
    const { loading, showEmptyLabel } = this.state;
    const { idsType, navigation, session: { user }, ordersParams, themedStyles } = this.props;
    const isSearchActive = ordersParams.search?.length > 0;

    // createMaterialTopTabNavigator has three screens and always renders all screens on android.
    // We need render only one instance instead three of UserGuide.
    // For this use idsType === 'include'
    return (
      <View style={[themedStyles.bg, themedStyles.flex]}>
        {idsType === 'include' && user?.guideType === GUIDE_TYPE &&
          <UserGuide
            goToNextGuide={this.goToNextGuide}
            navigation={navigation}
            scrollTo={this.scrollTo}
            type={GUIDE_TYPE}
          />
        }
        <ListView
          listViewRef={this.setListViewRef}
          emptyLabel={!isSearchActive && 'orders'}
          showEmptyLabel={showEmptyLabel}
          typeSections={false}
          items={this.getOrderItems()}
          renderItem={this.renderItem}
          loading={loading}
          refreshing={loading}
          onEndReached={this.isGuideMode() ? null : this.onEndReached}
          bottomIndicatorStyle={themedStyles.spinner}
        />
      </View>
    );
  }
}

const mapStateToProps = ({ session, orders }, { idsType, type }) => ({
  items: orders[idsType || type].items,
  meta: orders[idsType || type].meta,
  ordersParams: orders.meta,
  passengerId: session.user.memberId,
  session
});

const mapDispatchToProps = ({
  clearOrdersList,
  getOrders,
  initialOrdersList,
  resetGuide,
  setActiveBooking
});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(OrdersList, styles));
