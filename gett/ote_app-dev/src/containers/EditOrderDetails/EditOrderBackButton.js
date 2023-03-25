import React from 'react';
import { BackHandler } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { BackBtn } from 'components';

class EditOrderBackButton extends React.Component {
  static propTypes = {
    backAction: PropTypes.func,
    busyOrder: PropTypes.bool,
    navigation: PropTypes.object
  };

  componentDidMount() {
    this.backListener = BackHandler.addEventListener('hardwareBack', () => {
      const { navigation, backAction, busyOrder } = this.props;

      if (busyOrder) return true;

      if (backAction) {
        backAction();
      }
      navigation.dispatch({ type: 'Navigation/BACK' });

      return true;
    });
  }

  // eslint-disable-next-line class-methods-use-this
  componentWillUnmount() {
    this.backListener.remove();

    BackHandler.removeEventListener('hardwareBack');
  }

  render() {
    const { navigation, backAction } = this.props;

    return <BackBtn navigation={navigation} backAction={backAction} />;
  }
}

export default connect(({ booking }) => ({ busyOrder: booking.currentOrder.busy }))(EditOrderBackButton);
