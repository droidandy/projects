import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, Text, ScrollView, TouchableOpacity, StatusBar } from 'react-native';

import { changeDriverRating, changeDriverRatingReasons } from 'actions/booking';

import { strings } from 'locales';

import { withTheme } from 'theme';
import { prepareInitials } from 'utils';

import { Divider, RatingLabel, Header, BackBtn, Avatar } from 'components';
import Rating from './components/Rating';
import SaveRatingBtn from './components/SaveRatingBtn';

import styles from './styles';

class RateDriver extends PureComponent {
  static propTypes = {
    changeDriverRating: PropTypes.func,
    changeDriverRatingReasons: PropTypes.func,
    navigation: PropTypes.object,
    order: PropTypes.object,
    themedStyles: PropTypes.object
  };

  goBack = () => this.props.navigation.goBack();

  renderDriverCarInfo = vehicle => (
    vehicle && <Text style={this.props.themedStyles.vehicleDetails}>{Object.values(vehicle).join(', ')}</Text>
  );

  renderDriverRating = () => {
    const { order: { driverDetails }, themedStyles } = this.props;

    return (
      <View style={themedStyles.listItem}>
        <Text style={themedStyles.driverName}>{driverDetails.info.name}</Text>
        {driverDetails.info.rating && <RatingLabel label={driverDetails.info.rating} />}
      </View>
    );
  };

  renderRatingOptions = () => {
    const { order: { ratingReasons, tempDriverRatingReasons }, changeDriverRatingReasons, themedStyles } = this.props;

    return <View>
      <Divider left={0} style={themedStyles.divider}/>
      <View style={themedStyles.centerItems}>
        <Text style={themedStyles.label}>{strings('order.text.howCanImprove')}</Text>
        <Text style={themedStyles.subLabel}>{strings('order.text.yourFeedback')}</Text>
        <View style={themedStyles.badgesList}>
          {(ratingReasons || []).map((reason, index) => {
            const isActive = tempDriverRatingReasons.includes(reason);
            return (
              <TouchableOpacity
                key={index}
                style={[themedStyles.badge, isActive && themedStyles.badgeActive]}
                onPress={() => changeDriverRatingReasons(reason)}
                activeOpacity={1}
              >
                <Text style={themedStyles.badgeText}>
                  {strings(`order.ratingReason.${reason}`)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <Text style={themedStyles.subLabel}>{strings('order.text.selectIssues')}</Text>
      </View>
    </View>;
  };

  renderAvatar = () => {
    const { imageUrl, name } = this.props.order.driverDetails.info;
    const [firstName, lastName] = name.split(' ');

    return (
      <View>
        <Avatar
          size={80}
          title={prepareInitials({ firstName, lastName })}
          source={imageUrl}
        />
      </View>
    );
  };

  render() {
    const {
      order: { driverDetails, rateable = true, tempDriverRating },
      changeDriverRating,
      navigation,
      themedStyles
    } = this.props;
    const labelText = (tempDriverRating || driverDetails.tripRating)
      ? strings('order.text.youRated') : strings('order.text.rateYourDriver');
    const isLowRating = tempDriverRating && tempDriverRating <= 4;

    return (
      <View style={themedStyles.wrapper} >
        <StatusBar animated barStyle="default" />
        <Header
          navigation={navigation}
          leftButton={
            <BackBtn
              navigation={navigation}
              touchedPath="booking.currentOrder.tempDriverRating"
              backAction={changeDriverRating}
            />
          }
          rightButton={<SaveRatingBtn navigation={navigation} />}
        />

        <ScrollView contentContainerStyle={themedStyles.content}>
          {!isLowRating && this.renderAvatar()}

          {this.renderDriverRating()}
          {this.renderDriverCarInfo(driverDetails.info.vehicle)}

          <Divider left={0} style={themedStyles.divider}/>
          <Text style={themedStyles.label}>{labelText}</Text>
          <Rating
            value={rateable ? tempDriverRating : driverDetails.tripRating}
            disabled={!rateable}
            onChange={changeDriverRating}
          />

          {isLowRating && this.renderRatingOptions()}
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = ({ booking }) => ({
  order: booking.currentOrder
});

const mapDispatchToProps = {
  changeDriverRating,
  changeDriverRatingReasons
};

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(RateDriver, styles));
