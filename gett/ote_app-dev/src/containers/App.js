import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import { createAppContainer } from 'react-navigation';
import SplashScreen from 'react-native-splash-screen';

import { ConnectionMessage, AlertModal, AlertStatic } from 'components';

import NavigatorRoot from 'navigators/navigatorRoot';

import { saveToken } from 'actions/app/pushNotifications';
import { onLayoutConnectBar } from 'actions/app/statuses';
import { changeTheme } from 'actions/app/theme';

import { getAccessToken } from 'actions/app/gett';

import { darkTheme, lightTheme, ThemeContext } from 'theme';

import PN from 'utils/notifications';

import { isNightModeTime } from 'utils';
import { checkTouchIdSupport } from 'components/TouchId/utils';

const Navigator = createAppContainer(NavigatorRoot);

const styles = StyleSheet.create({
  flex: {
    flex: 1
  },
  placeholder: {
    height: 60
  }
});

class AppContainer extends PureComponent {
  static propTypes = {
    autoThemeMode: PropTypes.bool,
    changeTheme: PropTypes.func,
    checkTouchIdSupport: PropTypes.func,
    getAccessToken: PropTypes.func,
    isConnected: PropTypes.bool,
    isNightMode: PropTypes.bool,
    onLayoutConnectBar: PropTypes.func,
    saveToken: PropTypes.func
  };

  componentDidMount() {
    setTimeout(SplashScreen.hide, 1000); // Avoiding flicker
    this.props.getAccessToken();
    setTimeout(async () => {
      await PN.getNotificationsPermissions();
      PN.registerFCMToken().then((token) => {
        this.props.saveToken(token);
      });
    }, 2000); // After login transition

    this.checkForNightMode();
    this.startIntervalChecking();
    this.props.checkTouchIdSupport();
  }

  componentDidUpdate({ autoThemeMode }) {
    if (!autoThemeMode && this.props.autoThemeMode) {
      this.startIntervalChecking();
    } else if (autoThemeMode && !this.props.autoThemeMode) {
      clearInterval(this.themeInterval);
    }
  }

  componentWillUnmount() {
    clearInterval(this.themeInterval);
  }

  startIntervalChecking() {
    const { autoThemeMode } = this.props;
    if (autoThemeMode) {
      this.themeInterval = setInterval(this.checkForNightMode, 20000);
    }
  }

  checkForNightMode = () => {
    const { autoThemeMode, isNightMode, changeTheme } = this.props;

    const isNightTime = isNightModeTime();
    if (autoThemeMode && isNightMode !== isNightTime) {
      changeTheme({ isNightMode: isNightTime });
    }
  };

  render() {
    const { onLayoutConnectBar, isNightMode, isConnected } = this.props;
    const themeValue = isNightMode
      ? { ...darkTheme, type: 'dark', isNightMode }
      : { ...lightTheme, type: 'light', isNightMode };

    return (
      <ThemeContext.Provider value={themeValue}>
        <View style={styles.flex}>
          <AlertModal />

          {!isConnected && <View style={styles.placeholder} />}

          <View style={styles.flex}>
            <Navigator />
          </View>

          <AlertStatic />

          {!isConnected && <ConnectionMessage onLayout={onLayoutConnectBar} />}
        </View>
      </ThemeContext.Provider>
    );
  }
}

const mapStateToProps = ({ app, network }) => ({
  isConnected: network.isConnected,
  autoThemeMode: app.theme.autoThemeMode,
  isNightMode: app.theme.isNightMode
});

const mapDispatchToProps = {
  changeTheme,
  checkTouchIdSupport,
  getAccessToken,
  onLayoutConnectBar,
  saveToken
};

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer);
