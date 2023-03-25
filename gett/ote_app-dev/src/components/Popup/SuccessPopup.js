import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { Icon } from 'components';
import { withTheme } from 'theme';

import Popup from './Popup';

import styles from './style';

class SuccessPopup extends PureComponent {
  static propTypes = {
    buttons: PropTypes.array,
    content: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    popupRef: PropTypes.func,
    themedStyles: PropTypes.object
  };

  static defaultProps = {
    buttons: null,
    content: null
  };

  render() {
    const { themedStyles, popupRef, content = null, ...rest } = this.props;
    return (
      <Popup
        innerRef={popupRef}
        icon={<Icon size={70} name="done" style={themedStyles.doneIcon} />}
        contentWrapperStyle={themedStyles.contentWrapperStyle}
        titleStyle={themedStyles.titleStyle}
        contentStyle={content && themedStyles.popupInfo}
        content={content}
        {...rest}
      />
    );
  }
}

export default withTheme(SuccessPopup, styles);
