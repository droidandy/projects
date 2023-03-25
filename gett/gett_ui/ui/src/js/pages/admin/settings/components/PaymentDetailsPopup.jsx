import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';

const fieldTitles = {
  paymentsOsId: 'PaymentsOS ID',
  zoozRequestId: 'X Zooz Request ID',
  errorDescription: 'Error Description',
  goCardlessPaymentId: 'GoCardless Payment ID'
};

export default class PaymentDetailsPopup extends PureComponent {
  static propTypes = {
    visible: PropTypes.bool,
    payment: PropTypes.object,
    title: PropTypes.string,
    onClose: PropTypes.func
  };

  render() {
    const { visible, onClose, payment, title } = this.props;

    if (!payment) return null;

    return (
      <Modal
        title={ title }
        width={ 400 }
        visible={ visible }
        footer={ null }
        onCancel={ onClose }
      >
        { Object.keys(payment).map(key => (
            <div key={ key }>
              <strong>{ fieldTitles[key] }: </strong>{ payment[key] }
            </div>
          ))
        }
      </Modal>
    );
  }
}
