import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, ScrollView, Text, TouchableOpacity, FlatList } from 'react-native';
import Swipeout from 'react-native-swipeout';
import { capitalize } from 'lodash';

import { destroyFavoriteAddress, sendPredefinedAddress, setTempAddress, changeSwipedAddress } from 'actions/passenger';

import { Icon } from 'components';
import { color, withTheme } from 'theme';
import { nullAddress, throttledAction, showRemovalAlert } from 'utils';
import { strings } from 'locales';

import Tip from './Tip';

import styles from './AddressStyles';

class AddressesList extends Component {
  static propTypes = {
    changeSwipedAddress: PropTypes.func,
    destroyFavoriteAddress: PropTypes.func,
    favoriteAddresses: PropTypes.array,
    homeAddress: PropTypes.object,
    navigation: PropTypes.object,
    sendPredefinedAddress: PropTypes.func,
    setTempAddress: PropTypes.func,
    swipedAddressId: PropTypes.number,
    theme: PropTypes.object,
    themedStyles: PropTypes.object,
    workAddress: PropTypes.object
  };

  goToAddressEditor = throttledAction((address) => {
    this.changeSwipedAddress();
    const { navigation, setTempAddress, theme } = this.props;
    setTempAddress(address);
    navigation.navigate('AddressEditor', { editing: true, onRemove: this.removeAddress, theme });
  });

  renderExistPredefinedAddress = (type, data) => {
    const { themedStyles, theme } = this.props;
    return (
      <View style={themedStyles.predefinedAddress}>
        <Icon name={`addresses.${type}`} size={24} color={theme.color.primaryText} />
        <View style={[
          themedStyles.flex,
          themedStyles.addressWrapper,
          themedStyles.predefinedAddressWrapper
        ]}>
          <Text style={[themedStyles.addressName, themedStyles.predefinedAddressName]}>
            {capitalize(type)}
          </Text>
          <Text
            style={[themedStyles.flex, themedStyles.addressValue]}
            numberOfLines={1}
            testID={`${type}Favourite/value`}
          >
            {data.line}
          </Text>
          <Icon style={themedStyles.chevronIcon} name="chevron" size={16} color={theme.color.arrowRight} />
        </View>
      </View>
    );
  };

  renderEmptyPredefinedAddress = (type) => {
    const { themedStyles, theme } = this.props;
    return (
      <View style={themedStyles.predefinedAddress}>
        <Icon name="add" size={26} color={theme.color.primaryText} />
        <View style={[themedStyles.flex, themedStyles.addressWrapper]}>
          <Text style={themedStyles.addressValue}>Add {type} address</Text>
        </View>
      </View>
    );
  };

  openAddressModal = (type) => {
    this.changeSwipedAddress();
    this.props.navigation.state.params.openAddressModal(type);
  };

  renderAddress = (type, data) => (
    <TouchableOpacity activeOpacity={0.4} onPress={() => this.openAddressModal(type)} testID={`${type}Favourite`}>
      {data
        ? this.renderExistPredefinedAddress(type, data)
        : this.renderEmptyPredefinedAddress(type)
      }
    </TouchableOpacity>
  );

  renderPredefinedAddress = (type) => {
    const data = this.props[`${type}Address`];

    return (data && data.line
      ? this.renderItem({
        data,
        testID: `${type}Favourite`,
        component: this.renderAddress(type, data),
        handler: () => this.removeAddress(data.id, type)
      })
      : this.renderAddress(type)
    );
  };

  changeSwipedAddress = (id) => {
    this.props.changeSwipedAddress(id);
  };

  removeAddress = (id, type, handler) => {
    const { destroyFavoriteAddress, sendPredefinedAddress, theme } = this.props;
    const removeAction = type
      ? () => sendPredefinedAddress(nullAddress(null), type)
      : () => destroyFavoriteAddress(id);

    showRemovalAlert({
      theme,
      message: strings('alert.message.doYouWantToDeleteTheAddress'),
      handler: () => {
        removeAction();
        if (handler) handler();
      }
    });
  };

  keyExtractor = item => String(item.id);

  renderItem = ({ data, testID, component, handler }) => {
    const { swipedAddressId, theme, themedStyles } = this.props;
    return (
      <Swipeout
        key={data.id}
        autoClose
        sensitivity={25}
        close={swipedAddressId !== data.id}
        backgroundColor={theme.color.bgPrimary}
        buttonWidth={100}
        onOpen={() => this.changeSwipedAddress(data.id)}
        right={[
          {
            component: (
              <View style={themedStyles.buttonView} testID={`${testID}Delete`}>
                <Text style={themedStyles.buttonText}>
                  {strings('addresses.button.delete')}
                </Text>
                <Icon style={themedStyles.buttonIcon} name="close" size={14} color={color.white} />
              </View>
            ),
            type: 'delete',
            onPress: handler
          }
        ]}
      >
        {component}
      </Swipeout>
    );
  };

  renderFavoriteAddress = (item, testID) => {
    const { themedStyles, theme } = this.props;
    return (
      <TouchableOpacity
        key={item.id}
        activeOpacity={0.4}
        onPress={() => this.goToAddressEditor(item)}
        style={themedStyles.addressWrapper}
        testID={testID}
      >
        <View style={themedStyles.flex}>
          <Text style={themedStyles.addressName}>{item.name}</Text>
          <Text style={themedStyles.addressValue} testID={`${testID}/value`}>{item.address.line}</Text>
        </View>
        <Icon style={themedStyles.chevronIcon} name="chevron" size={16} color={theme.color.arrowRight} />
      </TouchableOpacity>
    );
  };

  renderFavoriteAddresses = () => (
    <FlatList
      data={this.props.favoriteAddresses}
      keyExtractor={this.keyExtractor}
      extraData={this.props.swipedAddressId}
      renderItem={({ item, index }) => this.renderItem({
        data: item,
        testID: `${index}Favourite`,
        component: this.renderFavoriteAddress(item, `${index}Favourite`),
        handler: () => this.removeAddress(item.id)
      })}
    />
  );

  render() {
    const { themedStyles } = this.props;
    return (
      <ScrollView style={[themedStyles.flex, themedStyles.addressListContainer]}>
        {this.renderPredefinedAddress('home')}
        {this.renderPredefinedAddress('work')}
        {this.renderFavoriteAddresses()}

        <Tip />
      </ScrollView>
    );
  }
}

const mapStateToProps = ({ passenger: { data, temp } }) => ({
  favoriteAddresses: data.favoriteAddresses,
  homeAddress: data.passenger.homeAddress,
  swipedAddressId: temp.swipedAddressId,
  workAddress: data.passenger.workAddress
});

const mapDispatchToProps = {
  changeSwipedAddress,
  destroyFavoriteAddress,
  sendPredefinedAddress,
  setTempAddress
};

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(AddressesList, styles));
