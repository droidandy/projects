import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet } from 'react-native';
import { CachedImage } from 'react-native-cached-image';
import moment from 'moment';

import assets from 'assets';

import { Icon, Popup } from 'components';

import { strings } from 'locales';

import { withTheme } from 'theme';

import { timeFormat } from 'utils';

const styles = theme => StyleSheet.create({
  futureOrderContainer: {
    padding: 0,
    overflow: 'hidden'
  },
  futureOrderInnerContainer: {
    paddingHorizontal: 20
  },
  futureOrderFooter: {
    paddingHorizontal: 20,
    paddingBottom: 20
  },
  futureOrderDivider: {
    width: '100%',
    height: 22
  },
  futureOrderTitle: {
    fontSize: 22,
    color: theme.color.primaryText,
    textAlign: 'center',
    fontWeight: '600'
  },
  headerTitle: {
    marginVertical: 20
  },
  futureOrderDescription: {
    fontSize: 17,
    color: theme.color.primaryText,
    textAlign: 'center',
    marginBottom: 30
  },
  futureOrderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  futureOrderTime: {
    fontSize: 15,
    color: theme.color.secondaryText
  },
  futureOrderImage: {
    width: '100%',
    height: 169,
    resizeMode: 'cover'
  },
  gap: {
    height: 42
  }
});

const formatTime = time => moment(time).format(timeFormat());

class FutureOrderSuggestionPopup extends PureComponent {
  static propTypes = {
    flightData: PropTypes.object,
    onPress: PropTypes.func,
    popupRef: PropTypes.func,
    themedStyles: PropTypes.object
  };

  get popupBtns() {
    const { onPress } = this.props;
    return ([
      {
        title: strings('popup.orderCreating.button.decline'),
        type: 'secondary'
      },
      {
        title: strings('popup.orderCreating.button.accept'),
        onPress
      }
    ]);
  }

  renderContent() {
    const { themedStyles, flightData } = this.props;
    const { arrival, departure } = flightData || {};
    return (
      <View>
        <CachedImage style={themedStyles.futureOrderImage} source={assets.flight} />
        <View style={themedStyles.futureOrderInnerContainer}>
          <Text style={[themedStyles.futureOrderTitle, themedStyles.headerTitle]}>
            {strings('popup.orderCreating.inProgress')}
          </Text>
          {flightData &&
            <Fragment>
              <Text style={themedStyles.futureOrderDescription}>
                {strings('popup.orderCreating.description', { code: arrival.code, name: arrival.name })}
              </Text>

              <View style={themedStyles.futureOrderRow}>
                <Text style={themedStyles.futureOrderTitle}>{departure.code}</Text>
                <Icon style={themedStyles.futureOrderDivider} height={22} width={124} name="flightInProgress" />
                <Text style={themedStyles.futureOrderTitle}>{arrival.code}</Text>
              </View>

              <View style={themedStyles.futureOrderRow}>
                <Text style={themedStyles.futureOrderTime}>{formatTime(departure.time)}</Text>
                <Text style={themedStyles.futureOrderTime}>{formatTime(arrival.time)}</Text>
              </View>
              <View styles={themedStyles.gap} />
            </Fragment>
          }
        </View>
      </View>
    );
  }

  render() {
    const { popupRef, themedStyles } = this.props;
    return (
      <Popup
        innerRef={popupRef}
        title={null}
        contentWrapperStyle={themedStyles.futureOrderContainer}
        footerStyle={themedStyles.futureOrderFooter}
        content={this.renderContent()}
        buttons={this.popupBtns}
      />
    );
  }
}

export default withTheme(FutureOrderSuggestionPopup, styles);
