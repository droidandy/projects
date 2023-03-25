import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet } from 'react-native';
import { CachedImage } from 'react-native-cached-image';
import { color, formattedColor, withTheme } from 'theme';
import { components } from 'testIDs';

const IDs = components.Avatar;

const styles = theme => StyleSheet.create({
  avatar: {
    backgroundColor: formattedColor[theme.isNightMode ? 'white' : 'black'].opacity(0.155),
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  },
  title: {
    color: color.white,
    position: 'absolute',
    zIndex: -1
  }
});

class Avatar extends PureComponent {
  static propTypes = {
    size: PropTypes.number,
    source: PropTypes.string,
    style: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    themedStyles: PropTypes.object,
    title: PropTypes.string
  };

  static defaultProps = {
    size: 40
  };

  render() {
    const { themedStyles, size, source, title, style } = this.props;

    const computedStyles = {
      height: size,
      width: size,
      borderRadius: size / 2
    };

    const imageStyles = { ...computedStyles, backgroundColor: color.white };

    const titleSize = Math.round(size / 2.35);

    return (
      <View style={[themedStyles.avatar, computedStyles, style]}>
        {!!source &&
          <CachedImage style={imageStyles} source={{ uri: source }} resizeMode="contain" />
        }
        {!!title &&
          <Text style={[themedStyles.title, { fontSize: titleSize }]} testID={IDs}>
            {title}
          </Text>
        }
      </View>
    );
  }
}

export default withTheme(Avatar, styles);
