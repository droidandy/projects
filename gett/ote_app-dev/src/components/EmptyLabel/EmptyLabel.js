import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';

import { Icon, KeyboardAnimatedWrapper, KeyboardCustomAnimatedWrapper } from 'components';

import { strings } from 'locales';
import { withTheme } from 'theme';

import styles from './styles';

class EmptyLabel extends PureComponent {
  static propTypes = {
    hideEmptyIcon: PropTypes.bool,
    theme: PropTypes.object,
    themedStyles: PropTypes.object,
    type: PropTypes.string
  };

  static defaultProps = {
    hideEmptyIcon: false
  };

  get labelsData() {
    const { theme } = this.props;
    return ({
      default: {
        icon: 'noResults.noResults',
        width: 190,
        title: strings('emptyPageResults.label.noSearchResults')
      },
      notifications: {
        icon: 'noResults.noNotifications',
        width: 195,
        color: theme.color.bgSecondary,
        title: strings('emptyPageResults.label.noNotifications'),
        subTitle: strings('emptyPageResults.text.noNotifications')
      },
      orders: {
        icon: 'noResults.noOrders',
        width: 190,
        title: strings('emptyPageResults.label.noOrders'),
        subTitle: strings('emptyPageResults.text.noOrders')
      },
      cards: {
        icon: 'noResults.noCards',
        width: 193,
        color: theme.color.bgSecondary,
        title: strings('emptyPageResults.label.noCards'),
        subTitle: strings('emptyPageResults.text.noCards')
      },
      favourites: {
        icon: 'noResults.noFavourites',
        width: 193,
        color: theme.color.bgSecondary,
        title: strings('emptyPageResults.label.noFavourites'),
        subTitle: strings('emptyPageResults.text.noFavourites')
      }
    });
  }

  renderIcon = (icon, color, width) => (
    <Icon name={icon} height={121} style={styles.icon} {...{ color, width }} />
  );

  render() {
    const { type, themedStyles, hideEmptyIcon } = this.props;
    const { icon, width, color, title, subTitle } = this.labelsData[type || 'default'];

    return (
      <View style={themedStyles.emptyContainer}>
        {hideEmptyIcon
          ? <KeyboardAnimatedWrapper delay={300}>
              {this.renderIcon(icon, color, width)}
            </KeyboardAnimatedWrapper>
          : this.renderIcon(icon, color, width)
        }
        <KeyboardCustomAnimatedWrapper delay={300} value={hideEmptyIcon ? -60 : 0}>
          <Text style={[themedStyles.title, themedStyles.header]}>
            {title || strings('emptyPageResults.label.noSearchResults')}
          </Text>
          {subTitle && <Text style={themedStyles.title}>{subTitle}</Text>}
        </KeyboardCustomAnimatedWrapper>
      </View>
    );
  }
}

export default withTheme(EmptyLabel, styles);
