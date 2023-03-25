import React from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';
import { FastComponent } from 'utils';
import styles from './style';

class Header extends FastComponent {
  renderTitle = () => {
    const { title, customStylesTitle, onPressTitle, titleCenter } = this.props;

    return (
      <Text
        style={[styles.headerTitle, titleCenter && styles.headerTitleCenter, customStylesTitle]}
        onPress={onPressTitle}>
        {title}
      </Text>
    );
  };

  render() {
    const { leftButton, rightButton, customStyles } = this.props;

    return (
      <View style={[styles.headerWrap, customStyles]} pointerEvents="box-none">
        <View style={styles.header} pointerEvents="box-none">
          {leftButton && <View>{leftButton}</View>}

          {this.renderTitle()}

          {rightButton &&
            <View>
              {typeof rightButton === 'string'
                ? <Text style={styles.rightHeaderButton}>{rightButton}</Text>
                : rightButton
              }
            </View>
          }
        </View>
      </View>
    );
  }
}

Header.propTypes = {
  customStyles: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  customStylesTitle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  leftButton: PropTypes.node,
  onPressTitle: PropTypes.func,
  rightButton: PropTypes.node,
  title: PropTypes.string,
  titleCenter: PropTypes.bool
};

export default Header;
