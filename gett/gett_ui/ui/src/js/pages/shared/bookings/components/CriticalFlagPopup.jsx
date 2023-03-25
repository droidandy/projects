import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Checkbox } from 'antd';
import { notification } from 'components';
import moment from 'moment';

export default class CriticalFlagPopup extends PureComponent {
  static propTypes = {
    id: PropTypes.number.isRequired,
    criticalFlag: PropTypes.bool,
    criticalFlagEnabledAt: PropTypes.string,
    criticalFlagEnabledBy: PropTypes.string,
    onToggleCriticalFlag: PropTypes.func
  };

  state = {
    open: false
  };

  open = () => {
    this.setState({ open: true });
  };

  close = () => {
    this.setState({ open: false });
  };

  onCriticalFlagToggle = () => {
    this.props.onToggleCriticalFlag(this.props.id)
      .then(({ criticalFlag }) => {
        this.close();
        notification.success(`Critical Flag was ${criticalFlag ? 'Enabled' : 'Disabled'}`, 5);
      });
  };

  render() {
    const { id, criticalFlag, criticalFlagEnabledBy, criticalFlagEnabledAt } = this.props;

    return (
      <Modal
        key="criticalFlagPopup"
        title={ `Critical Flag Options for Booking ${id}` }
        visible={ this.state.open }
        onCancel={ this.close }
        footer={
          <Button type="secondary" onClick={ this.close }>Close</Button>
        }
      >
        <div className="text-center">
          <Checkbox checked={ criticalFlag } onChange={ this.onCriticalFlagToggle } data-name="criticalFlag">Critical Flag</Checkbox>
          { criticalFlagEnabledBy &&
            `(Enabled by ${criticalFlagEnabledBy} at ${moment(criticalFlagEnabledAt).format('DD/MM/YYYY hh:mm a')})`
          }
        </div>
      </Modal>
    );
  }
}
