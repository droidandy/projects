import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { TouchableWithoutFeedback, Text, View } from 'react-native';
import Spinner from 'react-native-spinkit';
import { CachedImage } from 'react-native-cached-image';
import { isNull, capitalize } from 'lodash';
import { utils } from 'testIDs';

import assets from 'assets';

import { strings } from 'locales';

import { withTheme } from 'theme';

import { formatPrice } from 'utils';

import CarImage from './CarImage';

import styles from './styles';

const CarItem = ({
  vehicle: { name, price, eta, prebook, via, localCurrencySymbol, localPrice },
  style, label, active, loading, onChange, isETADisabled,
  theme, themedStyles
}) => {
  const vehiclePrice = (cost, currency) => (cost
    ? formatPrice(cost, currency, 'object').formattedValue
    : strings('app.label.byMeter'));
  const existLocalPrice = !isNull(localPrice) && localPrice > 0;
  const etaNum = parseInt(String(eta).replace('< ', ''), 10);
  const serviceSpecificName = `${name}${capitalize(via)}`;

  const needToShowBadge = (eta && !isETADisabled) || prebook;
  const detailedPrice = formatPrice(localPrice, localCurrencySymbol, 'object');

  const renderEta = () => (
    <Fragment>
      <Text style={[themedStyles.badgeText, themedStyles.badgeValue, active && themedStyles.badgeTextActive]}>
        {etaNum}
      </Text>
      <Text style={[themedStyles.badgeText, active && themedStyles.badgeTextActive]}>
        {` ${strings('app.label.min')}`}
      </Text>
    </Fragment>
  );

  const renderPreBook = () => (
    <Text style={[themedStyles.badgeText, active && themedStyles.badgeTextActive]}>
      {strings('order.type.preBook')}
    </Text>
  );

  const renderBadge = () => (
    needToShowBadge && !loading &&
    <View style={[themedStyles.badge, active && themedStyles.badgeActive]}>
      {prebook ? renderPreBook() : renderEta()}
    </View>
  );

  const renderSpinner = () => (
    <Spinner type="Circle" size={25} color={theme.color.secondaryText} style={themedStyles.spinner} />
  );

  const renderCarItem = () => (
    <View style={themedStyles.column}>
      <View style={themedStyles.top}>
        {label &&
          <Text numberOfLines={1} style={themedStyles.label}>{label}</Text>
        }
        {!isNull(price) &&
          <View style={themedStyles.price}>
            {price > 0 && <Text style={themedStyles.labelPrice} testID={`${name}/${utils.currencySymbol}`}>£</Text>}
            <Text numberOfLines={1} style={themedStyles.labelPrice}>
              {vehiclePrice(price, '£')}
            </Text>
          </View>
        }
        {localPrice > 0 && localCurrencySymbol &&
          <View style={themedStyles.price}>
            <Text style={themedStyles.label} testID={`${name}/${utils.localCurrencySymbol}`}>
              {detailedPrice.currency}
            </Text>
            <Text numberOfLines={1} style={themedStyles.label}>
              {detailedPrice.formattedValue}
            </Text>
          </View>
        }
      </View>
      <CarImage
        size={existLocalPrice ? 'extraSmall' : 'small'}
        type={assets.carTypes[serviceSpecificName] ? serviceSpecificName : name}
        style={themedStyles.image}
      />
    </View>
  );

  const renderContainer = () => (
    <View
      style={[
        themedStyles.container,
        style,
        loading && themedStyles.spinnerContainer,
        active && themedStyles.activeContainer
      ]}
    >
      {loading ? renderSpinner() : renderCarItem()}
      {!active && <View style={[themedStyles.layout, themedStyles.container]} />}
    </View>
  );

  const renderActiveContainer = () => (
    <View style={[themedStyles.shadow, !active ? themedStyles.shadowActive : null]}>
      <TouchableWithoutFeedback onPress={() => !active && onChange(name)}>
        {renderContainer()}
      </TouchableWithoutFeedback>
    </View>
  );

  return (
    <View style={themedStyles.wrapper} testID={name}>
      <CachedImage
        source={theme.isNightMode ? assets.carNightShadow : assets.carShadow}
        resizeMode="stretch"
        style={[themedStyles.activeBackground, !active && themedStyles.activeBackgroundHidden]}
      />

      {renderActiveContainer()}

      {renderBadge()}
    </View>
  );
};

CarItem.propTypes = {
  active: PropTypes.bool,
  isETADisabled: PropTypes.bool,
  label: PropTypes.string,
  loading: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  style: PropTypes.oneOfType([PropTypes.array, PropTypes.object, PropTypes.number]),
  theme: PropTypes.object,
  themedStyles: PropTypes.object,
  vehicle: PropTypes.shape({
    eta: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    localCurrencySymbol: PropTypes.string,
    localPrice: PropTypes.number,
    name: PropTypes.string,
    prebook: PropTypes.bool,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    via: PropTypes.string
  })
};

CarItem.defaultProps = {
  active: false,
  eta: '',
  isETADisabled: false,
  loading: false,
  localPrice: null,
  name: 'Standard',
  price: null,
  style: {}
};

export default withTheme(CarItem, styles);
