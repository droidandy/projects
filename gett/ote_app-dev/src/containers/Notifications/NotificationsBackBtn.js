import React from 'react';
import { BackHandler } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { BackBtn } from 'components';

class NotificationsBackBtn extends React.Component {
  componentDidMount() {
    BackHandler.addEventListener('hardwareBack', () => {
      this.onPress();

      return true;
    });
  }

  // eslint-disable-next-line class-methods-use-this
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBack');
  }

  onPress = () => {
    const { navigation, settingsPageScroll } = this.props;
    navigation.goBack(null);
    navigation.navigate('Settings', {
      onGoToRides: navigation.state.params.onGoToRides,
      restoreScrollPosition: settingsPageScroll,
      onGoToNotifications: navigation.state.params.onGoToNotifications,
      theme: navigation.state.params.theme
    });
  };

  render() {
    return (
      <BackBtn handlePress={this.onPress} />
    );
  }
}

NotificationsBackBtn.propTypes = {
  navigation: PropTypes.object,
  settingsPageScroll: PropTypes.number
};

const mapStateToProps = state => ({
  settingsPageScroll: state.app.statuses?.params?.settingsPageScroll
});

export default connect(mapStateToProps)(NotificationsBackBtn);
