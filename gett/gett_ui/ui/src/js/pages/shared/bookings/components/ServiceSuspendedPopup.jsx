import React, { PureComponent } from 'react';
import { Modal, Button } from 'antd';

export default class ServiceSuspendedPopup extends PureComponent {
  state = {
    open: true
  };

  close = () => {
    this.setState({ open: false });
  };

  render() {
    return (
      <Modal
        title="Service Suspended"
        visible={ this.state.open }
        onCancel={ this.close }
        footer={ <Button type="primary" onClick={ this.close }>OK</Button> }
      >
        <p>Dear Customer,</p>
        <p>
          Due to unpaid invoices the service has been suspended. Please
          contact Gett Business Solutions Billing Department to resolve this issue.
        </p>
        <p>Thank you,<br />Gett Business Solutions Team</p>
      </Modal>
    );
  }
}
