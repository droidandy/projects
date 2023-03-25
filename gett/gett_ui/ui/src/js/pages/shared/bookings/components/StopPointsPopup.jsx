import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'antd';
import { ResponsiveTable, PhoneNumber } from 'components';
import { map } from 'lodash';

export default class StopPointsPopup extends PureComponent {
  static propTypes = {
    points: PropTypes.arrayOf(PropTypes.object)
  };

  state = { open: false };

  open = () => {
    this.setState({ open: true });
  };

  close = () => {
    this.setState({ open: false });
  };

  render() {
    const { points } = this.props;
    const items = map(points, (point, i) => ({
      index: i, name: point.name, phone: point.phone, address: point.line
    }));

    return (
      <Modal
        title="Stop points"
        width={ 1000 }
        visible={ this.state.open }
        onCancel={ this.close }
        footer={
          <Button type="secondary" onClick={ this.close }>OK</Button>
        }
      >
        <ResponsiveTable
          rowKey="index"
          dataSource={ items }
          columns={ [
            { title: 'Name', dataIndex: 'name', width: '25%' },
            { title: 'Phone',
              dataIndex: 'phone',
              width: '25%',
              render: phone => <PhoneNumber phone={ phone } />
            },
            { title: 'Address', dataIndex: 'address', width: '50%' }
          ] }
        />
      </Modal>
    );
  }
}
