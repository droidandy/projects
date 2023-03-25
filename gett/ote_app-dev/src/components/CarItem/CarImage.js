import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { CachedImage } from 'react-native-cached-image';
import { upperFirst } from 'lodash';
import { FastComponent } from 'utils';

import assets from 'assets';

import { Icon } from 'components';

import { OTcars, splytCars } from 'containers/shared/bookings/data';

import styles from './CarImageStyles';

class CarImage extends FastComponent {
  static propTypes = {
    animatable: PropTypes.bool,
    duration: PropTypes.number,
    size: PropTypes.oneOf(['extraSmall', 'small', 'medium', 'big']),
    style: PropTypes.oneOfType([PropTypes.array, PropTypes.object, PropTypes.number]),
    type: PropTypes.string
  };

  static defaultProps = {
    animatable: false,
    duration: 400,
    size: 'medium',
    style: {},
    type: 'BlackTaxi'
  };

  getLogoIconName = () => {
    const { type } = this.props;
    if (type === 'Chauffeur') {
      return 'Carey';
    } if (splytCars.includes(type)) {
      return type;
    } if (OTcars.includes(type)) {
      return 'OT';
    }
    return 'Gett';
  };

  renderLogo = (sizeFormatted) => {
    const { size, animatable, duration } = this.props;
    const sizes = {
      extraSmall: 22,
      small: 28,
      medium: 34,
      big: 62
    };

    const IconWrapper = animatable ? Animatable.View : View;

    return (
      <IconWrapper
        style={styles.typeWrapper}
        animation="slideInLeft"
        duration={duration}
        delay={duration}
      >
        <View style={styles[`typeInnerWrapper${sizeFormatted}`]}>
          <Icon
            size={sizes[size]}
            name={this.getLogoIconName()}
            style={styles[`logoService${sizeFormatted}`]}
          />
        </View>
      </IconWrapper>
    );
  };

  render() {
    const { style, size, type, animatable, duration } = this.props;

    const ImageWrapper = animatable ? Animatable.Image : CachedImage;

    const sizeFormatted = upperFirst(size);

    return (
      <View style={[styles.container, style]}>
        <ImageWrapper
          animation="slideInLeft"
          duration={duration}
          delay={200}
          style={[styles.carImage, styles[`carImage${sizeFormatted}`]]}
          source={assets.carTypes[type]}
          resizeMode="contain"
        />

        {this.renderLogo(sizeFormatted)}
      </View>
    );
  }
}
export default CarImage;
