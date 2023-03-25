import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import timer from 'react-timer-hoc';
import { Text } from 'react-native';
import moment from 'moment';

import { withTheme } from 'theme';

import { setCurrentOrder, deleteCurrentOrder } from 'utils';

import styles from './styles';

class CountdownTimer extends PureComponent {
  static propTypes = {
    endTime: PropTypes.object,
    onCountdownComplete: PropTypes.func,
    orderId: PropTypes.number,
    themedStyles: PropTypes.object,
    timer: PropTypes.object
  };

  state = {
    endTime: this.props.endTime || moment()
  };

  componentDidMount() {
    setCurrentOrder(this.props.orderId, this.state.endTime);
  }

  componentDidUpdate(_, { endTime }) {
    const { timer, onCountdownComplete, orderId } = this.props;
    const now = moment();
    if (now.unix() + 1 >= endTime.unix()) {
      timer.stop();
      deleteCurrentOrder(orderId);
      onCountdownComplete();
    }
  }

  render() {
    const { themedStyles } = this.props;
    const { endTime } = this.state;
    const now = moment();
    const remainingTime = moment(endTime.diff(now));

    return (
      <Text style={[themedStyles.timer, !remainingTime.minute() ? themedStyles.timerEnds : {}]}>
        {remainingTime.format(remainingTime.minute() > 0 ? 'm:ss' : ':ss')}
      </Text>
    );
  }
}

export default timer(1000)(withTheme(CountdownTimer, styles));
