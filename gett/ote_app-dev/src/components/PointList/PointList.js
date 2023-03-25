import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, Text, View } from 'react-native';
import { has, isNull } from 'lodash';

import { Icon, Divider } from 'components';

import { strings } from 'locales';

import { color, withTheme } from 'theme';

import { touchableArea, FastComponent, getStops } from 'utils';

import styles from './styles';

class PointList extends FastComponent {
  static propTypes = {
    allowEmptyDestination: PropTypes.bool,
    data: PropTypes.object.isRequired,
    editable: PropTypes.bool,
    noItemMargin: PropTypes.bool,
    onAddressPress: PropTypes.func,
    onStopAdd: PropTypes.func,
    orderDetails: PropTypes.bool,
    stopAsList: PropTypes.bool,
    style: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    themedStyles: PropTypes.object,
    withDivider: PropTypes.bool
  };

  static defaultProps = {
    allowEmptyDestination: true,
    editable: true,
    noItemMargin: true,
    stopAsList: false,
    style: {},
    withDivider: false
  };

  handleAddressPress = (type) => {
    const { onAddressPress, data, editable } = this.props;
    if (editable) {
      onAddressPress(data[type], { type });
    }
  };

  handlePickupAddressPress = () => this.handleAddressPress('pickupAddress');

  handleDestinationAddressPress = () => this.handleAddressPress('destinationAddress');

  handleStopAddressPress = () => this.handleAddressPress('stops');

  hasAddressType = type => has(this.props.data, type) && !!this.props.data[type];

  renderAddressLabel(name) {
    const { data, themedStyles, prefix } = this.props;
    return (
      this.hasAddressType(name) && !isNull(data[name].line) &&
        <Text style={themedStyles.pickUpText} numberOfLines={1} testID={`${prefix}/${name}/value`}>
          {data[name].label || data[name].line}
        </Text>
    );
  }

  renderPickUpItem = () => {
    const { themedStyles, editable, pickUpTestID } = this.props;
    return (
      <TouchableOpacity
        disabled={!editable}
        style={themedStyles.row}
        onPress={this.handlePickupAddressPress}
        activeOpacity={0.6}
        hitSlop={touchableArea}
        testID={pickUpTestID}
      >
        <Icon style={themedStyles.pickUpIcon} name="point" color={color.success} size={16} />
        <View style={themedStyles.flex}>{this.renderAddressLabel('pickupAddress')}</View>
        {this.renderEditIcon()}
      </TouchableOpacity>
    );
  };

  renderEditIcon = () => {
    const { editable, themedStyles } = this.props;
    return this.shouldRenderAddStop() && editable &&
      <Icon style={themedStyles.editIcon} color={color.arrowRight} name="edit" size={16} />;
  };

  renderDestinationItem = () => {
    const { allowEmptyDestination, editable, themedStyles, destinationTestID } = this.props;

    return ((this.hasAddressType('destinationAddress') || allowEmptyDestination) &&
      <TouchableOpacity
        disabled={!editable || !this.hasAddressType('pickupAddress')}
        style={themedStyles.row}
        onPress={this.handleDestinationAddressPress}
        activeOpacity={0.6}
        hitSlop={touchableArea}
        testID={destinationTestID}
      >
        <Icon
          style={themedStyles.pickUpIcon}
          name="point"
          color={color.danger}
          size={16}
        />
        {this.hasAddressType('destinationAddress')
          ? this.renderAddressLabel('destinationAddress')
          : (
            <Text style={themedStyles.selectDestinationText} numberOfLines={1} testID={`${destinationTestID}/value`}>
              {strings('booking.label.selectDestination')}
            </Text>
          )
        }
        {this.renderEditIcon()}
      </TouchableOpacity>
    );
  };

  shouldRenderAddStop = () => {
    const { data } = this.props;
    const stopPointsAvailable = Boolean(data.pickupAddress);
    const hasDestination = this.hasAddressType('pickupAddress') && this.hasAddressType('destinationAddress');

    return (
      (hasDestination && stopPointsAvailable &&
        (!data || !data.stopAddresses || !data.stopAddresses.length || data.stopAddresses.length <= 5)) ||
          (data && data.id && !data.asap)
    );
  };

  hasAnyStops = () => (
    this.getStops().length > 0
  );

  getStops = () => {
    const { data } = this.props;
    return getStops(data) || [];
  };

  renderIcon = () => (
    <Icon
      size={16}
      name="dottedLine"
      pointsNum={5}
      color={color.arrowRight}
    />
  );

  renderStopItem = (stop, index = 1) => {
    const { title, onPress } = stop;
    const { themedStyles, addStopTestID } = this.props;
    const Wrapper = onPress ? TouchableOpacity : View;

    return this.renderAddressWrapper({
      children: (
        <Wrapper
          key={`${title}${index}`}
          onPress={onPress}
          activeOpacity={0.6}
          hitSlop={touchableArea}
          testID={addStopTestID}
        >
          <View style={themedStyles.row}>
            <Icon size={14} color={color.secondaryText} name="point" style={themedStyles.stopIcon} />

            <Text style={[themedStyles.addStopText, onPress && themedStyles.addStopLink]} numberOfLines={1}>
              {title}
            </Text>
          </View>
        </Wrapper>
      ),
      index
    });
  };

  renderStops = () => {
    const { onStopAdd, stopAsList, editable } = this.props;

    if (!this.shouldRenderAddStop() || (!this.hasAnyStops() && !editable)) {
      return null;
    }

    if (stopAsList && this.hasAnyStops()) {
      return this.getStops().map(({ address = {}, line }, index) => (
        this.renderStopItem({ title: address.line || line }, index + 1)
      ));
    }

    let addStopsText = strings('booking.label.addStopPoint');
    const hasStopPoints = this.hasAnyStops();

    if (hasStopPoints) {
      const stops = this.getStops();
      addStopsText = `${stops.length} ${strings('booking.label.stopPoint')}${stops.length > 1 ? 's' : ''}`;
    }

    return this.renderStopItem({
      title: addStopsText,
      onPress: hasStopPoints ? onStopAdd : this.handleStopAddressPress
    });
  };

  renderAddressWrapper = (attrs) => {
    const { withDivider, themedStyles } = this.props;
    const { children, index = 0, last = false } = attrs;

    const dottedIconPosition = 16 + ((34 - 16) / 2); // icon size + diff between icon and container height

    return (
      <Fragment>
        <View style={themedStyles.rowWrapper}>
          {children}
        </View>
        <View style={[themedStyles.connector, { top: dottedIconPosition + (index * 34) }]}>
          {!last && this.renderIcon()}
          {withDivider && <Divider left={14 + (last && 16)} style={themedStyles.separator} />}
        </View>
      </Fragment>
    );
  };

  render() {
    const { themedStyles, style } = this.props;

    return (
      <View style={[themedStyles.wrapper, style]}>
        {this.renderAddressWrapper({ children: this.renderPickUpItem() })}

        {this.renderStops()}

        {this.renderAddressWrapper({
          children: this.renderDestinationItem(), index: this.getStops().length + 1, last: true
        })}
      </View>
    );
  }
}

export default withTheme(PointList, styles);
