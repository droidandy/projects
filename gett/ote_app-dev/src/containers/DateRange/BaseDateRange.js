import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { BackHandler, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import moment from 'moment-timezone';

import { ScreenHeader, Button } from 'components';

import { strings } from 'locales';

import { withTheme } from 'theme';
import { showConfirmationAlert } from 'utils';

import DateRangePicker from './DateRangePicker';
import ClearBtn from './ClearBtn';

import styles from './styles';

const formatLabelDate = date => moment(date).format('D MMM YYYY');

class BaseDateRange extends PureComponent {
  static propTypes = {
    calendarStyles: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    initialValue: PropTypes.array,
    navigation: PropTypes.object,
    onChange: PropTypes.func,
    onRangeChange: PropTypes.func,
    theme: PropTypes.object,
    themedStyles: PropTypes.object,
    value: PropTypes.array,
    withoutHeader: PropTypes.bool,
    withWrappers: PropTypes.bool
  };

  static defaultProps = {
    withoutHeader: false,
    withWrappers: false
  };

  state = {
    touched: false
  };

  componentDidMount() {
    const { initialValue, onRangeChange, withoutHeader } = this.props;
    onRangeChange(initialValue);
    if (!withoutHeader) {
      this.backListener = BackHandler.addEventListener('backPress', this.handleBackPress);
    }
  }

  componentWillUnmount() {
    const { withoutHeader } = this.props;
    if (!withoutHeader) {
      this.backListener.remove();
      BackHandler.removeEventListener('backPress');
    }
  }

  handleBackPress = () => {
    const { theme } = this.props;
    const { touched } = this.state;

    if (touched) {
      showConfirmationAlert({
        theme,
        title: strings('alert.message.areYouSure'),
        message: strings('alert.message.dataWillNotBeSaved'),
        handler: this.goBack
      });
      return true;
    }

    this.goBack();
    return true;
  };

  goBack = () => {
    if (this.props.navigation) {
      this.props.navigation.goBack(null);
    }
  };

  onSaveDateRange = () => {
    const { onChange, value } = this.props;
    const [from, to] = value;
    onChange({ from, to });
    this.goBack();
  };

  renderInterval = () => {
    const { value, themedStyles } = this.props;
    const textStyle = [themedStyles.intervalText, !value.length && themedStyles.intervalTextDisabled];

    return (
      <View style={themedStyles.interval}>
        <Text style={[...textStyle, themedStyles.flex, themedStyles.startDate]}>
          {value[0] ? formatLabelDate(value[0]) : 'Start Date'}
        </Text>
        <Text style={textStyle}>—</Text>
        <Text style={[...textStyle, themedStyles.flex, themedStyles.endDate]}>
          {value[1] ? formatLabelDate(value[1]) : 'End Date'}
        </Text>
      </View>
    );
  };

  renderButton = () => {
    const { initialValue, value, themedStyles } = this.props;

    return (value.length > 0 || initialValue.length > 0) && (
      <View style={themedStyles.buttonView}>
        <Button
          stretched
          onPress={this.onSaveDateRange}
          title={strings('order.button.save')}
        />
      </View>
    );
  };

  onRangeChange = (value = []) => {
    this.props.onRangeChange(value);
    this.setState({ touched: true });
  };

  renderPicker = () => {
    const { calendarStyles, ...rest } = this.props;
    return (
      <DateRangePicker style={calendarStyles} {...rest} onChange={this.onRangeChange} />
    );
  };

  renderClearBtn = () => <ClearBtn onClearPress={this.onRangeChange} />;

  renderHeader = () => {
    const { navigation, withoutHeader } = this.props;
    return !withoutHeader && (
      <ScreenHeader
        navigation={navigation}
        onBackPress={this.handleBackPress}
        title={strings('header.title.dateRange')}
        rightContent={this.renderClearBtn()}
      />
    );
  };

  render() {
    const { themedStyles, withWrappers } = this.props;
    return (
      <Fragment>
        {this.renderHeader()}
        <View style={themedStyles.container}>
          {this.renderInterval()}
          {withWrappers
            ? (
              <ScrollView>
                <TouchableOpacity activeOpacity={1}>
                  <TouchableWithoutFeedback>
                    <View>{this.renderPicker()}</View>
                  </TouchableWithoutFeedback>
                </TouchableOpacity>
              </ScrollView>
            )
            : this.renderPicker()
          }
          {this.renderButton()}
        </View>
      </Fragment>
    );
  }
}

export default withTheme(BaseDateRange, styles);
