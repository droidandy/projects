import React from 'react';
import PropTypes from 'prop-types';
import { Polyline } from 'react-native-maps';

import { FastComponent } from 'utils';
import { withTheme } from 'theme';

class Route extends FastComponent {
  static propTypes = {
    path: PropTypes.array,
    polyRef: PropTypes.func,
    theme: PropTypes.object
  };

  static defaultProps = {
    path: []
  };

  render() {
    const { path, theme, polyRef } = this.props;

    return (
      <Polyline
        ref={polyRef}
        coordinates={path}
        strokeWidth={3}
        strokeColor={theme.color.route}
      />
    );
  }
}

export default withTheme(Route);
