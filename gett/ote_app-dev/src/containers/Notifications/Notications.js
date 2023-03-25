import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableWithoutFeedback } from 'react-native';
import { connect } from 'react-redux';

import { strings } from 'locales';

import { getNotifications, markAsRead } from 'actions/notifications';
import { setActiveBooking } from 'actions/booking';

import { ListView } from 'components';

import { withTheme } from 'theme';

import sortItems from './utils';
import { goBackFromSettings, getLabelType } from '../Orders/utils';

import styles from './styles';

const VIEWED_IDS = {};
let PREV_LENGTH = 0;

class Notifications extends PureComponent {
  static propTypes = {
    getNotifications: PropTypes.func.isRequired,
    markAsRead: PropTypes.func,
    navigation: PropTypes.object,
    readMessagesIds: PropTypes.object,
    sections: PropTypes.array.isRequired,
    setActiveBooking: PropTypes.func.isRequired,
    theme: PropTypes.object,
    themedStyles: PropTypes.object
  };

  viewabilityConfig = {
    minimumViewTime: 10,
    viewAreaCoveragePercentThreshold: 60
  };

  state = {
    loading: false
  };

  componentDidMount() {
    this.requestNotifications();

    this.interval = setInterval(() => {
      const newLength = Object.keys(VIEWED_IDS).length;
      if (newLength > PREV_LENGTH) {
        this.props.markAsRead(VIEWED_IDS);
        PREV_LENGTH = newLength;
      }
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  handleViewableItemsChanged = ({ viewableItems }) => {
    viewableItems.forEach((item) => {
      if (item.key && !VIEWED_IDS[item.key]) {
        VIEWED_IDS[item.key] = item.key;
      }
    });
  };

  goToNotificationDetails = ({ bookingId }) => {
    const { setActiveBooking, navigation } = this.props;

    if (bookingId) {
      setActiveBooking(bookingId)
        .then(goBackFromSettings(navigation));
    }
  };

  requestNotifications = () => {
    const { getNotifications } = this.props;
    const { loading } = this.state;

    if (!loading) {
      this.setState({ loading: true });

      getNotifications()
        .then(() => this.setState({ loading: false }));
    }
  };

  renderSectionHeader = ({ index, section }) => (
    <Text
      key={index}
      style={this.props.themedStyles.sectionHeader}
    >
      {section.section}
    </Text>
  );

  renderStatusBar = (item) => {
    const { theme, themedStyles } = this.props;
    return (
      item.indicatedStatus &&
      <View
        style={[
          themedStyles.notificationLabel,
          { backgroundColor: theme.color[`${getLabelType(item.indicatedStatus).toLowerCase()}Light`] }
        ]}
      >
        <Text
          style={[
            themedStyles.notificationLabelText,
            { color: theme.color[getLabelType(item.indicatedStatus).toLowerCase()] }
          ]}
        >
          {strings(`order.status.${item.indicatedStatus}`).toUpperCase()}
        </Text>
      </View>
    );
  };

  getItemStyle = (itemId) => {
    const { theme, readMessagesIds, themedStyles } = this.props;
    return ([
      themedStyles.notificationWrapper,
      {
        backgroundColor: readMessagesIds[itemId]
          ? theme.color.bgPrimary
          : theme.color.newNotifications
      }
    ]);
  };

  renderItem = ({ item }) => {
    const { themedStyles } = this.props;
    return (
      <TouchableWithoutFeedback
        key={item.id}
        onPress={() => this.goToNotificationDetails(item)}
      >
        <View style={this.getItemStyle(item.id)}>
          <View style={themedStyles.notificationDetails}>
            {item.title &&
              <View style={themedStyles.rowMarginBottom}>
                <Text style={themedStyles.bodyText}>
                  {item.title}
                </Text>
              </View>
            }
            {item.body &&
              <View style={themedStyles.rowMarginBottom}>
                <Text numberOfLines={5} style={themedStyles.itemBody}>
                  {item.body}
                </Text>
              </View>
            }
            <View style={themedStyles.row}>
              <Text
                style={themedStyles.notificationDate}
                numberOfLines={1}
              >
                {item.timestampDate}
              </Text>

              {this.renderStatusBar(item)}
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  render() {
    const { sections, themedStyles, readMessagesIds } = this.props;
    const { loading } = this.state;

    return (
      <View style={themedStyles.container}>
        <ListView
          listViewStyle={themedStyles.listViewStyle}
          emptyLabel="notifications"
          typeSections
          items={sections}
          extraData={readMessagesIds}
          loading={loading}
          renderItem={this.renderItem}
          renderSectionHeader={this.renderSectionHeader}
          viewabilityConfig={this.viewabilityConfig}
          onViewableItemsChanged={this.handleViewableItemsChanged}
          footerComponent={<View style={themedStyles.contentPusher} />}
        />
      </View>
    );
  }
}

const mapStateToProps = ({ notifications: { items, readMessagesIds } }) => ({
  readMessagesIds,
  sections: sortItems(items)
});

const mapDispatchToProps = ({
  getNotifications,
  markAsRead,
  setActiveBooking
});

export default connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(withTheme(Notifications, styles));
