import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, Text, ScrollView, StatusBar, Linking } from 'react-native';
import Hyperlink from 'react-native-hyperlink';

import { isArray } from 'lodash';

import { withTheme } from 'theme';

import services from './data';

import styles from './InfoPagesStyles';

class InfoPages extends PureComponent {
  static propTypes = {
    navigation: PropTypes.object,
    theme: PropTypes.object,
    themedStyles: PropTypes.object
  };

  goBack = () => this.props.navigation.goBack();

  keyExtractor = (item) => {
    let key = '';
    if (item.marker?.length > 1) {
      key = item.marker;
    } else if (isArray(item.value)) {
      key = item.value[0].value;
    } else {
      key = item.value;
    }
    return key;
  };

  renderListItem = (item, disableMarker = false) => {
    const { themedStyles } = this.props;

    return (
      <View key={this.keyExtractor(item)} style={themedStyles.listItemWrapper}>
        {!disableMarker &&
          <View style={themedStyles.listMarker}>
            {item.marker ? this.renderText({ value: item.marker, inner: true }) : <View style={themedStyles.bullet} />}
          </View>
        }

        <View style={themedStyles.listLabelContainer}>
          {item.title &&
            <View style={themedStyles.listItemTitle}>
              {this.renderText({ value: item.title })}
            </View>
          }

          {this.renderItem(item, true)}
        </View>
      </View>
    );
  };

  renderList = (item, inner = false) => (
    <View key={`list${item.marker || item.value[0].value}`} style={!inner && this.props.themedStyles.listWrapper}>
      {item.value.map(listItem => this.renderListItem(listItem, item.disableMarker))}
    </View>
  );

  handleLinkPress = url => Linking.openURL(url);

  renderText = ({ type = 'plain', value, inner = false }) => (
    <Hyperlink linkStyle={this.props.themedStyles.link} onPress={this.handleLinkPress} key={value}>
      <Text style={[this.props.themedStyles[type], inner && { marginBottom: 0 }]}>
        {value}
      </Text>
    </Hyperlink>
  );

  renderItem = (item, inner = false) => (
    item.type === 'list'
      ? this.renderList(item, inner)
      : this.renderText(item)
  );

  render() {
    const { navigation: { state }, themedStyles, theme: { type } } = this.props;
    const page = state.params.page;

    const nightMode = type === 'dark';

    return (
      <View style={[themedStyles.flex, themedStyles.wrapper]} testID={page}>
        <StatusBar barStyle={nightMode ? 'light-content' : 'default'} animated />

        <ScrollView>
          {services[page].map(this.renderItem)}
        </ScrollView>
      </View>
    );
  }
}

export default withTheme(InfoPages, styles);
