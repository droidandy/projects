import React from 'react';
import PropTypes from 'prop-types';
import { isEqual } from 'lodash';
import { FastComponent } from 'utils';

import ThemeContext from './ThemeContext';

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export default function withTheme(Component, styles = () => {}) {
  return class ThemedComponent extends FastComponent {
    static displayName = `Themed(${getDisplayName(Component)})`;

    render() {
      return (
        <ThemeContext.Consumer>
          {theme => <ThemeWrapper {...this.props} theme={theme} themedStyles={styles(theme)} Component={Component} />}
        </ThemeContext.Consumer>
      );
    }
  };
}

class ThemeWrapper extends React.Component {
  static propTypes = {
    Component: PropTypes.node,
    innerRef: PropTypes.func,
    navigation: PropTypes.object,
    theme: PropTypes.object
  };

  componentDidMount() {
    const { navigation, theme } = this.props;

    if (navigation) {
      navigation.setParams({ theme });
    }
  }

  componentDidUpdate({ theme: oldTheme }) {
    const { navigation, theme } = this.props;

    if (navigation && !isEqual(oldTheme, theme)) {
      navigation.setParams({ theme });
    }
  }

  render() {
    const { Component, innerRef, ...rest } = this.props;

    return (
      <Component ref={innerRef} {...rest} />
    );
  }
}
