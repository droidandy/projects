import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ScreenHeader, Icon } from 'components';
import { TouchableOpacity } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import { getReceiptUrl } from 'containers/Receipt/utils';
import {
  requestPermissions,
  checkMultiplePermissions,
  PERMISSION_STATUS
} from 'actions/app/statuses';

import styles from './styles';

class ReceiptHeader extends PureComponent {
  static propTypes = {
    checkMultiplePermissions: PropTypes.func,
    navigation: PropTypes.object,
    requestPermissions: PropTypes.func,
    token: PropTypes.string
  };

  downloadFile = () => {
    const { navigation: { state: { params } }, token } = this.props;

    RNFetchBlob.config({
      path: `${RNFetchBlob.fs.dirs.DownloadDir}/Receipt#${params.orderId}.pdf`,
      addAndroidDownloads: {
        title: `Receipt#${params.orderId}.pdf`,
        description: `Download Receipt#${params.orderId}.pdf`,
        mime: 'application/pdf',
        mediaScannable: true,
        notification: true
      }
    })
      .fetch('POST', getReceiptUrl(params.orderId), {
        Authorization: `Bearer ${token}`
      })
      .then(res => RNFetchBlob.android.actionViewIntent(res.path(), 'application/pdf'));
  };

  downloadReceipt = () => {
    const { checkMultiplePermissions, requestPermissions } = this.props;
    checkMultiplePermissions(['storage']).then(({ storage }) => {
      if (storage === PERMISSION_STATUS.authorized) {
        this.downloadFile();
      } else {
        requestPermissions('storage', {}).then(({ storage }) => {
          if (storage === PERMISSION_STATUS.authorized) {
            this.downloadFile();
          }
        });
      }
    });
  };

  renderDownloadBtn = () => (
    <TouchableOpacity onPress={this.downloadReceipt} style={styles.receiptIcon}>
      <Icon name="download" size={30} color={this.props.navigation.state.params.theme.color.primaryText} />
    </TouchableOpacity>
  );

  render() {
    const { navigation } = this.props;

    return (
      <ScreenHeader
        navigation={navigation}
        title={`Receipt #${navigation.state.params.orderId}`}
        rightContent={this.renderDownloadBtn()}
        rightContentStyle={styles.rightContentStyle}
      />
    );
  }
}

const mapStateToProps = ({ session }) => ({
  token: session.token
});

const mapDispatchToProps = ({
  checkMultiplePermissions,
  requestPermissions
});

export default connect(mapStateToProps, mapDispatchToProps)(ReceiptHeader);
