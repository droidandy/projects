import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Pdf from 'react-native-pdf';

import styles from './styles';
import { getReceiptUrl } from './utils';

class Receipt extends PureComponent {
  static propTypes = {
    navigation: PropTypes.object,
    token: PropTypes.string
  };

  render() {
    const { navigation, token } = this.props;
    const source = {
      uri: getReceiptUrl(navigation.state.params.orderId),
      cache: true,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    return (
      <Pdf
        fitWidth
        source={source}
        style={styles.pdf}
      />

    );
  }
}

const mapStateToProps = ({ session }) => ({
  token: session.token
});

export default connect(mapStateToProps)(Receipt);
