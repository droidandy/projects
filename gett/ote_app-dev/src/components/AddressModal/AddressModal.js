import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, Keyboard, TouchableOpacity, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { debounce, isArray, isUndefined, camelCase, isEmpty } from 'lodash';

import { getSuggestedAddresses } from 'actions/booking';

import { postEvent } from 'actions/app/gett';

import { ListView, Icon, Input, Modal, Button, KeyboardAvoidingWrapper } from 'components';

import { areUniqueAddresses } from 'containers/shared/bookings/data';

import { strings } from 'locales';

import { color, withTheme } from 'theme';

import { addresses } from 'api';

import { nullAddress, processLocation, geocode, isAndroid, showInfoAlert } from 'utils';
import { components } from 'testIDs';

import AddressTabBar from './AddressTabBar';
import AddressItem from './AddressItem';

import styles from './styles';

const IDs = components.AddressModal;

const searchDebounce = 700;
let cancelRequest;

class AddressModal extends PureComponent {
  static propTypes = {
    bookingForm: PropTypes.object,
    currentOrder: PropTypes.object,
    defaultValues: PropTypes.array,
    getSuggestedAddresses: PropTypes.func,
    hideFavorites: PropTypes.bool,
    loadingTab: PropTypes.string,
    navigation: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    postEvent: PropTypes.func,
    suggestedAddresses: PropTypes.object,
    theme: PropTypes.object,
    themedStyles: PropTypes.object,
    typingTimeout: PropTypes.number,
    value: PropTypes.object
  };

  static defaultProps = {
    defaultValues: [],
    typingTimeout: 700,
    value: {}
  };

  state = {
    isVisible: false,
    loading: false,
    inputValue: '',
    initialAddress: {},
    inputTouched: false,
    values: [],
    meta: {},
    activeTab: 'favorites',
    message: ''
  };

  get barTabs() {
    const { hideFavorites } = this.props;
    const tabs = [
      { label: 'Favourites', id: 'favorites' },
      { label: 'Recent', id: 'recent' },
      { label: 'Airports', id: 'airport' },
      { label: 'Train Stations', id: 'trainStation' },
      { label: 'Hotels', id: 'lodging' },
      { label: 'Restaurants', id: 'restaurant' },
      { label: 'Places to visit', id: 'pointOfInterest' }
    ];
    return tabs.filter(t => !hideFavorites || t.id !== 'favorites');
  }

  sendAnalyticsEvent = (event, meta = this.state.meta) => {
    if (meta.type) {
      const source = meta.type.replace('Address', '');
      this.props.postEvent(event, { source });
    }
  };

  onHandleRequestToken = (c) => { cancelRequest = c; };

  open = (address, meta = {}) => {
    const processedAddress = !isEmpty(address) ? address : nullAddress('');
    const firstTab = this.barTabs[0].id;
    this.sendAnalyticsEvent('search_address|screen_appears', meta);
    this.setState({
      isVisible: true,
      meta,
      activeTab: firstTab,
      inputValue: processedAddress.line,
      initialAddress: processedAddress,
      inputTouched: false
    }, this.onTabChange(firstTab));
  }

  close = (rmInitialAddress = true) => {
    const newState = { isVisible: false, inputValue: '', inputTouched: false, values: [] };
    if (rmInitialAddress) {
      newState.initialAddress = {};
    }

    this.setState(newState);
  };

  onTabChange = (activeTab) => {
    const { suggestedAddresses, getSuggestedAddresses, postEvent } = this.props;

    this.setState({ activeTab });

    postEvent('search_address|tab_clicked', { tab: activeTab });

    if (activeTab !== 'favorites' && (!suggestedAddresses[activeTab]?.loaded || activeTab === 'recent')) {
      getSuggestedAddresses(activeTab);
    }
  };

  onChangeText = (text) => {
    this.setState({ inputValue: text, inputTouched: !!text }, this.searchAddresses);
  };

  looksLikeAddress = item => !!(item.line && item.lat && item.lng);

  onAddressPress = (item) => {
    const { bookingForm } = this.props;
    const { activeTab, inputValue, meta: { type, index } } = this.state;
    const { id, text, google, predefined, address } = item;

    Keyboard.dismiss();

    if (text) {
      const currentAddress = !isUndefined(index) ? bookingForm.stops[index] : bookingForm[type];
      const areAddressesByInputShown = currentAddress && inputValue
        ? currentAddress.line !== inputValue
        : inputValue;
      const googleParam = google || (activeTab !== 'favourites' && !areAddressesByInputShown);

      const payload = {
        locationId: id,
        string: text,
        predefined
      };

      if (googleParam) payload.google = googleParam;

      geocode(payload)
        .then(processLocation)
        .then(this.handleSelect)
        .catch(() => showInfoAlert({ message: strings('alert.message.notSupportedAddress'), modal: true }));
    }

    if (address || this.looksLikeAddress(item)) {
      this.handleSelect(address || item);
    }
  };

  areAddressesUnique(address) {
    const { meta: { type, index } } = this.state;
    const { bookingForm, currentOrder, navigation } = this.props;
    const order = currentOrder.id && !navigation.state.params.futureOrderEditing ? currentOrder : bookingForm;
    const { pickupAddress, destinationAddress, stops, stopAddresses } = order;
    let stopPoints = (stopAddresses || stops || []).map(address => address.address || address);

    if (type === 'destinationAddress') {
      return areUniqueAddresses([pickupAddress, ...stopPoints, address]);
    } if (type === 'stops') {
      if (index || index === 0) {
        stopPoints[index] = address;
      } else {
        stopPoints = [...stopPoints, address];
      }

      return areUniqueAddresses([pickupAddress, ...stopPoints, destinationAddress]);
    }

    return areUniqueAddresses([address, ...stopPoints, destinationAddress]);
  }

  handleSelect = (address) => {
    const { currentOrder: { id }, bookingForm: { destinationAddress }, hideFavorites } = this.props;

    if ((id || destinationAddress) && !hideFavorites && !this.areAddressesUnique(address)) {
      showInfoAlert({ message: strings('alert.message.pathDuplication'), modal: true });
    } else {
      this.props.onChange(address, this.state.meta);
      this.setState({ isVisible: false });

      const pyaload = {
        inputValue: '',
        values: [],
        inputTouched: false,
        meta: {}
      };

      setTimeout(() => this.setState(pyaload), 500); // for smooth animation
      this.sendAnalyticsEvent('select_destination|destination_selected');
    }
  };

  handleBackFromFavourites = () => {
    this.props.navigation.goBack(null);
    this.open(this.state.initialAddress, this.state.meta);
  }

  handleAddFavourites = () => {
    this.close(false);
    this.props.navigation.navigate('Settings', {
      theme: this.props.theme,
      openAddressList: true,
      onBack: this.handleBackFromFavourites
    });
  }

  searchAddresses = debounce(() => {
    const { inputValue, loading } = this.state;

    if (!inputValue.length) return;
    if (loading && cancelRequest) {
      cancelRequest();
    }

    this.setState({ loading: true });
    addresses.getAddress(inputValue, this.onHandleRequestToken)
      .then((data) => {
        this.setState({ values: isArray(data) ? data : [], loading: false });
      })
      .catch(() => {
        this.setState({ values: [], loading: false });
      });
  }, searchDebounce, { leading: true });

  getPointerIconData() {
    const defaultIcon = {
      name: 'point',
      color: color.success
    };
    if (!this.state.meta) return defaultIcon;

    switch (this.state.meta.type) {
      case 'destinationAddress':
        return { ...defaultIcon, color: color.danger };
      case 'stops':
        return { ...defaultIcon, color: color.secondaryText };
      default:
        return defaultIcon;
    }
  }

  renderAddressItem = ({ item, index }) => {
    const { inputValue, inputTouched, activeTab } = this.state;
    const { type, types } = item;

    const icons = {
      favorite: 'favorites',
      recent: 'recent',
      airport: 'airport',
      trainStation: 'trainStation',
      transitStation: 'trainStation',
      lodging: 'lodging',
      restaurant: 'restaurant',
      pointOfInterest: 'pointOfInterest',
      home: 'home',
      work: 'work'
    };

    const typedIcon = activeTab && activeTab !== 'favorites' && (!inputValue.length || !inputTouched)
      ? activeTab
      : (type || types) && icons[type || camelCase(types[0])];

    return (
      <AddressItem
        testID={`${IDs.list}[${index}]`}
        typedIcon={typedIcon}
        item={item}
        onPress={this.onAddressPress}
      />
    );
  };

  renderFooter = () => (
    <View style={this.props.themedStyles.indicatorView}>
      <ActivityIndicator animating size="small" color={this.props.theme.color.secondaryText} />
    </View>
  );

  keyExtractor = (item, index) => (item.id && String(item.id) + index) || item.text || item.name;

  handlePickupSomeAddress = () => {
    const prevState = { ...this.state };

    this.setState({ isVisible: false }, () => {
      this.props.navigation.navigate(
        'PickupAddressScene',
        {
          handleBackPress: () => {
            this.setState(prevState);
          },
          handlePickUp: ({ address }) => {
            setTimeout(() => {
              this.handleSelect(address);
            }, 350);
          },
          meta: this.state.meta,
          predefinedAddress: this.state.initialAddress
        }
      );
    });
  };

  renderSearchInput() {
    const { inputValue } = this.state;
    const { themedStyles, theme } = this.props;

    return (
      <View style={[themedStyles.row, themedStyles.searchInputContainer]}>
        <Icon
          style={themedStyles.pointerIcon}
          {...this.getPointerIconData()}
          size={18}
        />
        <View style={[themedStyles.flex, themedStyles.row, themedStyles.inputWrapper]}>
          <Input
            placeholder="Enter the address..."
            value={inputValue}
            autoFocus
            onChangeText={this.onChangeText}
            style={themedStyles.flex}
            autoCorrect={false}
            allowedError={false}
            borderLess
            inputStyle={themedStyles.inputStyle}
            testID={IDs.input}
            clearIconTestID={IDs.inputClear}
          />
          <TouchableOpacity onPress={this.handlePickupSomeAddress} testID={IDs.pin}>
            <Icon
              style={themedStyles.pointerIconRight}
              name="setOnMap"
              color={theme.color.primaryText}
              size={24}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  renderAddFavourites = () => (
    <Button
      title={strings('emptyPageResults.button.noFavourites')}
      type="secondary"
      onPress={this.handleAddFavourites}
      style={this.props.themedStyles.addButton}
      stretched
      size="mid"
    />
  )

  renderAddressList() {
    const { values, loading, activeTab, inputValue, inputTouched } = this.state;
    const { defaultValues, loadingTab, suggestedAddresses, themedStyles, bookingForm } = this.props;

    const isFavouriteTab = activeTab === 'favorites';
    const addresses = isFavouriteTab ? defaultValues : suggestedAddresses[activeTab].list;
    const data = inputValue.length > 0 && inputTouched ? values : addresses || [];
    const isLoading = loadingTab?.length > 0 || loading;
    const shouldAddFavourites = !isLoading && data.length === 0 && isFavouriteTab && !bookingForm.destinationAddress;

    return (
      <KeyboardAvoidingWrapper style={themedStyles.flex} keyboardVerticalOffset={20}>
        <ListView
          keyboardShouldPersistTaps="always"
          contentContainerStyle={themedStyles.list}
          removeClippedSubviews={isAndroid}
          typeSections={false}
          disableAvoiding
          items={data}
          loading={isLoading}
          renderItem={this.renderAddressItem}
          keyExtractor={this.keyExtractor}
          ListFooterComponent={isLoading && this.renderFooter}
          style={themedStyles.listView}
          emptyLabel={isFavouriteTab && !inputTouched ? 'favourites' : 'default'}
          hideEmptyIcon={isFavouriteTab && !inputTouched}
          testID={IDs.list}
        />
        {shouldAddFavourites && !inputTouched && this.renderAddFavourites()}
      </KeyboardAvoidingWrapper>
    );
  }

  render() {
    const { themedStyles } = this.props;
    const { isVisible, activeTab, inputValue, inputTouched } = this.state;

    return (
      <Modal
        testID={IDs.container}
        isVisible={isVisible}
        onClose={this.close}
        contentStyles={themedStyles.modalContent}
        type="fullScreen"
      >
        {this.renderSearchInput()}

        {(!inputValue.length || !inputTouched) &&
          <AddressTabBar
            themedStyles={themedStyles}
            tabs={this.barTabs}
            activeTab={activeTab}
            onTabChange={this.onTabChange}
          />
        }

        {this.renderAddressList()}
      </Modal>
    );
  }
}

const mapStateToProps = ({ booking }) => ({
  bookingForm: booking.bookingForm,
  currentOrder: booking.currentOrder,
  loadingTab: booking.suggestedAddresses.loadingType,
  suggestedAddresses: booking.suggestedAddresses
});

const mapDispatchToProps = {
  getSuggestedAddresses,
  postEvent
};

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(AddressModal, styles));
