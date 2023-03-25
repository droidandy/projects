import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Modal, Select, Notification } from 'antd';
import { Button, Desktop, Icon, notification } from 'components';
import { isEmpty, last, map, includes } from 'lodash';
import { get, post } from 'utils';
import dispatchers from 'js/redux/app/passengers.dispatchers';
import { faye } from 'utils';

const { Option } = Select;

function mapStateToProps(state) {
  return {
    currentMemberId: state.session.memberId,
    canManagePassengers: state.session.can.createPassengers,
    exportReceiptsBunchChannel: state.session.exportReceiptsBunchChannel
  };
}

class ExportReceipts extends PureComponent {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.object),
    canManagePassengers: PropTypes.bool,
    currentMemberId: PropTypes.number,
    getPassengers: PropTypes.func,
    exportReceiptsBunchChannel: PropTypes.string
  };

  state = {
    monthsList: [],
    passengersList: [],
    selectedMonths: [],
    selectedPassengerId: '',
    visible: false
  };

  componentDidMount() {
    const { exportReceiptsBunchChannel } = this.props;

    this.subscription = faye.on(exportReceiptsBunchChannel, ({ data: { error } }) => {
      if (error) {
        setTimeout(() => {
          notification.error(error);
        }, 1500);
      }
    });
  }

  componentWillUnmount() {
    if (this.subscription) {
      this.subscription.cancel();
    }
  }

  showExport = () => {
    get('/receipts/export_data')
      .then((res) => {
        const { passengers, periods: months } = res.data;

        this.setState({
          monthsList: months,
          passengersList: passengers,
          selectedMonths: months.length ? [last(months).value] : [],
          visible: true
        });
      });
  };

  closeExport = () => {
    this.setState({
      loading: false,
      visible: false,
      selectedMonths: [],
      selectedPassengerId: ''
    });
  };

  exportReceipts = () => {
    const { selectedMonths, selectedPassengerId } = this.state;
    const params = { periods: selectedMonths, passengerId: selectedPassengerId };

    this.setState({ loading: true });

    post('/receipts/export', params)
      .then(() => {
        this.closeExport();
        Notification.open({
          message: 'Please wait...',
          description: 'Your download is about to start...',
          duration: 1.5
        });
      });
  };

  filterPassengerOption = (inputValue, option) => {
    return includes(option.props.children.toLowerCase(), inputValue.toLowerCase());
  };

  renderExportModal() {
    const { monthsList, passengersList, selectedMonths, selectedPassengerId, visible } = this.state;
    const { canManagePassengers } = this.props;

    return (
      <Modal
        visible={ visible }
        title="Select parameters to export receipts"
        onCancel={ this.closeExport }
        footer={ [
          <Button key="back" type="primary" size="large" onClick={ this.closeExport }>Cancel</Button>,
          <Button key="submit" type="primary" size="large" disabled={ isEmpty(selectedMonths) } onClick={ this.exportReceipts }>
            Export
          </Button>
        ] }
      >
        { canManagePassengers
          ? <Fragment>
              <div className="text-14 mb-10">
                Select the user and the month(s) for the receipts you would like to download and click 'export'.
                Receipts data will be exported as a ZIP file
              </div>
              <div>Select user:</div>
              <Select
                value={ selectedPassengerId }
                onChange={ value => this.setState({ selectedPassengerId: value }) }
                onSelect={ this.selectPassenger }
                showSearch
                defaultActiveFirstOption={ false }
                filterOption={ this.filterPassengerOption }
                className="block mb-20"
                placeholder="Name*"
                icon="UserIcon"
                iconClassName="text-30 navy-text"
              >
                { map(passengersList, passenger => (
                    <Option key={ passenger.id }>{ passenger.fullName }</Option>
                  ))
                }
              </Select>
            </Fragment>
          : <div className="text-14 mb-10">
              Select the month(s) for the receipts you would like to download and click 'export'.
              Receipts data will be exported as a ZIP file
            </div>
        }
        <div>Month:</div>
        <Select
          mode="multiple"
          className="full-width"
          placeholder="Please select"
          value={ selectedMonths }
          onChange={ value => this.setState({ selectedMonths: value }) }
        >
          { monthsList.map(item => <Option key={ item.value }>{ item.label } </Option>) }
        </Select>
      </Modal>
    );
  }

  render() {
    return (
      <Desktop>
        <div className="justified-right">
          <Button onClick={ () => this.showExport() } type="secondary">
            <Icon className="text-20 mr-10" icon="MdFileDownload" />
            Export Receipts
          </Button>
        </div>
        { this.renderExportModal() }
      </Desktop>
    );
  }
}

export default connect(mapStateToProps, dispatchers.mapToProps)(ExportReceipts);
