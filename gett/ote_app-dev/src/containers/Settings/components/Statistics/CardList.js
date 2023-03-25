import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';

import { withTheme } from 'theme';

import styles from './CardListStyles';

class CardList extends PureComponent {
  static propTypes = {
    currency: PropTypes.bool,
    data: PropTypes.array,
    style: PropTypes.object,
    themedStyles: PropTypes.object
  };

  static defaultProps = {
    data: [],
    style: {}
  };

  renderCard = (item) => {
    const { themedStyles, currency } = this.props;

    return (
      <View key={item.label} style={themedStyles.card}>
        {item.type === 'date'
          ? <Text numberOfLines={2} style={themedStyles.dateLabel}>{item.label}</Text>
          : (
            <Fragment>
              <Text numberOfLines={1} style={[themedStyles.title, { color: item.color }]}>
                {`${item.title}${currency ? ' £' : ''}`}
              </Text>
              <Text numberOfLines={1} style={[themedStyles.label, { color: item.color }]}>{item.label}</Text>
            </Fragment>
          )
        }
      </View>
    );
  }

  render() {
    const { data, themedStyles, style } = this.props;

    return (
      <View style={[themedStyles.wrapper, style]}>
        {data.map(this.renderCard)}
      </View>
    );
  }
}

export default withTheme(CardList, styles);
