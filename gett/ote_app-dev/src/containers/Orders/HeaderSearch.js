import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, BackHandler } from 'react-native';
import { View as AnimatableView } from 'react-native-animatable';

import { setFilter, clearFilter } from 'actions/orders';
import { postEvent } from 'actions/app/gett';

import { ScreenHeader, IconBtn, RoundedBar } from 'components';

import { deviceWidth } from 'utils';

import { strings } from 'locales';

import { withTheme } from 'theme';

import { containers } from 'testIDs';

import styles from './styles';

class HeaderSearch extends Component {
  static propTypes = {
    clearFilter: PropTypes.func,
    delay: PropTypes.number,
    meta: PropTypes.object,
    navigation: PropTypes.object,
    postEvent: PropTypes.func,
    setFilter: PropTypes.func,
    settingsPageScroll: PropTypes.number,
    theme: PropTypes.object,
    themedStyles: PropTypes.object
  };

  static defaultProps = {
    delay: 500
  };

  state = {
    showFilters: false,
    animationHeader: {
      width: deviceWidth / 3
    },
    animationIcon: {
      opacity: 0
    }
  };

  componentDidMount() {
    this.props.postEvent('orders_menu|screen_appears');

    BackHandler.addEventListener('hardwareBack', () => {
      if (this.state.showFilters) {
        this.closeFiltersLayout();
      } else {
        this.handlerBackPress();
      }

      return true;
    });
  }

  // eslint-disable-next-line class-methods-use-this
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBack');
  }

  onChangeText = (value) => {
    const { setFilter, meta, postEvent, navigation: { state } } = this.props;
    if (!meta.search && value.length) {
      postEvent('orders_menu|search|start_typing', { orders_type: state.routes[state.index]?.routeName });
    }
    setFilter('meta.search', value);
  };

  toggleFilters = (bool, fn) => {
    this.setState({ showFilters: bool || false }, fn);
  };

  animate = ({ isHide }) => {
    const opacity = isHide ? 0 : 1;
    const nWidth = isHide ? deviceWidth / 3 : deviceWidth;

    this.setState({ animationHeader: { width: nWidth }, animationIcon: { opacity } });
  };

  closeFiltersLayout = () => {
    const { delay, clearFilter } = this.props;

    this.animate({ isHide: true });
    setTimeout(this.toggleFilters, delay);
    clearFilter('meta');
  };

  openFiltersLayout = () => this.toggleFilters(true, () => this.animate({ isHide: false }));

  goToDateRange = () => {
    const { navigation: { navigate, state }, theme, postEvent } = this.props;
    postEvent('orders_menu|search|calendar|button_clicked', { orders_type: state.routes[state.index]?.routeName });
    navigate('DateRange', { theme });
  };

  renderAnimation = ({ style, duration, transition, children }) => (
    <AnimatableView
      duration={duration}
      transition={transition}
      style={style}
    >
      {children}
    </AnimatableView>
  );

  renderLayer = () => {
    const { showFilters, animationHeader, animationIcon } = this.state;
    const { meta, delay, themedStyles, theme } = this.props;
    const isActiveFilter = meta.from && meta.to;

    return (showFilters && (
      this.renderAnimation({
        style: [themedStyles.search, animationHeader],
        duration: delay,
        transition: ['width'],
        children: (
          <Fragment>
            {this.renderAnimation({
              style: animationIcon,
              duration: delay * 2,
              transition: ['opacity'],
              children: <IconBtn
                style={themedStyles.iconLeftBtn}
                onPress={this.closeFiltersLayout}
                name="close"
                size={16}
                color={theme.color.primaryText}
              />
            })}
            <RoundedBar
              containerStyle={themedStyles.searchBarContainer}
              inputStyle={themedStyles.searchBarInput}
              iconStyle={themedStyles.searchBarIcon}
              onChangeText={this.onChangeText}
              value={meta.search || ''}
              placeholder={strings('header.title.search')}
              labelColor={theme.color.secondaryText}
              underlineColorAndroid="transparent"
            />
            {this.renderAnimation({
              style: animationIcon,
              duration: delay * 2,
              transition: ['opacity'],
              children: <IconBtn
                style={themedStyles.iconRightBtn}
                onPress={this.goToDateRange}
                name="calendarRange"
                color={theme.color.primaryText}
              />
            })}
            {showFilters && isActiveFilter && <View style={themedStyles.activeCalendarFilter}/>}
          </Fragment>
        )
      })
    ));
  };

  handlerBackPress = () => {
    const { navigation, theme, settingsPageScroll } = this.props;

    navigation.goBack();

    if (navigation.state.params && navigation.state.params.fromSettings) {
      navigation.navigate('Settings', {
        theme,
        restoreScrollPosition: settingsPageScroll,
        onGoToRides: navigation.state.params.onGoToRides,
        onGoToNotifications: navigation.state.params.onGoToNotifications
      });
    }
  };

  renderHeader = () => {
    const { showFilters } = this.state;
    const { navigation, themedStyles, theme } = this.props;

    return (
      <ScreenHeader
        navigation={navigation}
        title={!showFilters ? 'Your Orders' : ''}
        leftContent={showFilters && <View style={themedStyles.leftPlaceholder}/>}
        rightContent={!showFilters &&
          <IconBtn
            style={themedStyles.iconRightBtn}
            onPress={this.openFiltersLayout}
            strokeWidth="1.5"
            size={20}
            name="search"
            color={theme.color.primaryText}
          />
        }
        rightContentStyle={[themedStyles.rightContent, !showFilters ? { width: 71 } : {}]}
        headerStyle={themedStyles.header}
        headerContainerStyle={themedStyles.headerContainer}
        onBackPress={this.handlerBackPress}
        backTestID={containers.Orders.backButton}
      />
    );
  };

  render() {
    return (
      <View>
        {this.renderHeader()}
        {this.renderLayer()}
      </View>
    );
  }
}

const mapStateToProps = ({ orders, app }) => ({
  meta: orders.meta,
  settingsPageScroll: app.statuses?.params?.settingsPageScroll
});

const mapDispatchToProps = {
  clearFilter,
  postEvent,
  setFilter
};

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(HeaderSearch, styles));
