import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Text, View, ScrollView, StyleSheet, TouchableOpacity, Clipboard, Slider } from 'react-native';
import { isFunction } from 'lodash';
import { withTheme } from 'theme';
import Icon from './Icon';
import lib from './lib';

const styles = theme => StyleSheet.create({
  bg: {
    backgroundColor: theme.color.bgPrimary,
    flex: 1
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 5,
    paddingVertical: 10
  },
  iconWrapper: {
    padding: 5,
    alignItems: 'center'
  },
  title: {
    color: theme.color.primaryText,
    textAlign: 'center',
    marginTop: 5
  }
});

function getIconsNames(icons, prefix) {
  let names = [];
  Object.keys(icons).forEach((icon) => {
    if (isFunction(icons[icon])) {
      names.push(prefix ? `${prefix}.${icon}` : icon);
    } else {
      names = names.concat(getIconsNames(icons[icon], icon));
    }
  });
  return names;
}

const iconsNames = getIconsNames(lib);

class IconsList extends PureComponent {
  static propTypes = {
    theme: PropTypes.object,
    themedStyles: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.handlers = {};
    iconsNames.forEach((name) => {
      this.handlers[name] = () => Clipboard.setString(name);
    });
  }

  state = {
    iconSize: 40
  };

  handleSizeChange = iconSize => this.setState({ iconSize });

  getIconWrapperWidth() {
    const { iconSize } = this.state;
    return iconSize >= 100 ? '50%' : iconSize >= 50 ? '33%' : '25%'; //eslint-disable-line
  }

  render() {
    const { themedStyles, theme } = this.props;
    const { iconSize } = this.state;
    return (
      <View style={themedStyles.bg}>
        <Slider value={iconSize} onValueChange={this.handleSizeChange} step={10} minimumValue={20} maximumValue={150} />
        <ScrollView style={themedStyles.bg} contentContainerStyle={themedStyles.container}>
          {iconsNames.map(name => (
            <TouchableOpacity
              key={name}
              onPress={this.handlers[name]}
              style={[themedStyles.iconWrapper, { width: this.getIconWrapperWidth() }]}
            >
              <Icon name={name} color={theme.color.primaryText} size={iconSize} />
              <Text style={themedStyles.title}>{name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  }
}

export default withTheme(IconsList, styles);
