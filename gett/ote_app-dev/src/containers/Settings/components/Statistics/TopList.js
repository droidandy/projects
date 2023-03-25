import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, FlatList, Text } from 'react-native';

import { Divider } from 'components';

import { withTheme } from 'theme';

import styles from './TopListStyles';

class TopList extends PureComponent {
  static propTypes = {
    data: PropTypes.array,
    navigation: PropTypes.object,
    themedStyles: PropTypes.object
  };

  goBack = () => this.props.navigation.goBack();

  renderListItem = ({ item, index }) => {
    const { themedStyles } = this.props;

    return (
      <View style={themedStyles.wrapper}>
        <Text style={[themedStyles.label, themedStyles.labelMargin]}>{index + 1}</Text>
        <Text numberOfLines={1} style={[themedStyles.label, themedStyles.labelCentered]}>
          {item.firstName} {item.lastName}
        </Text>
        <Text style={[themedStyles.label, themedStyles.labelMargin]}>{item.count}</Text>
      </View>
    );
  }

  renderSeparator = () => <Divider style={this.props.themedStyles.divider} />;

  keyExtractor = item => String(item.id);

  render() {
    return (
      <FlatList
        data={this.props.data}
        keyExtractor={this.keyExtractor}
        renderItem={this.renderListItem}
        ItemSeparatorComponent={this.renderSeparator}
      />
    );
  }
}

export default withTheme(TopList, styles);
