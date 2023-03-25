import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Table } from 'antd';
import { bindModalState } from 'components/form';
import { CsvReportsForm } from './components';
import { ButtonIcon, ButtonEdit, notification, confirm } from 'components';
import dispatchers from 'js/redux/app/settings.dispatchers';
import moment from 'moment';

function mapStateToProps(state) {
  const { items, formData } = state.settings.csvReports;

  return {
    csvReports: items,
    recurrenceOptions: formData.recurrenceOptions
  };
}

class CsvReports extends PureComponent {
  static propTypes = {
    csvReports: PropTypes.arrayOf(PropTypes.object),
    recurrenceOptions: PropTypes.array,
    getCsvReports: PropTypes.func,
    getCsvReportFormData: PropTypes.func,
    saveCsvReport: PropTypes.func,
    destroyCsvReport: PropTypes.func
  };

  state = {};

  componentDidMount() {
    this.props.getCsvReports();
  }

  showForm(record = {}) {
    this.setState({ formVisible: true, form: record });
  }

  getFormData = () => {
    this.props.getCsvReportFormData(this.state.form.id)
      .then(record => this.setState({ form: { ...record, recurrenceStartsAt: moment(record.recurrenceStartsAt) } }));
  };

  saveForm = (record, form) => {
    this.props.saveCsvReport(record)
      .then(this.closeForm)
      .then(() => notification.success(`CSV Report has been ${record.id ? 'updated' : 'created'}`))
      .catch(e => form.setErrors(e.response.data.errors));
  };

  closeForm = () => {
    this.setState({ formVisible: false, form: {} });
  };

  destroyRecord(record) {
    const { id, name } = record;

    confirm({
      title: `Delete CSV Report ${name}?`,
      content: 'Are you sure?',
      onOk: () => {
        this.props.destroyCsvReport(id)
          .then(() => notification.success('CSV Report has been deleted'));
      }
    });
  }

  render() {
    const { csvReports, recurrenceOptions } = this.props;
    const { form } = this.state;

    return (
      <Fragment>
        <div className="layout horizontal center mb-30">
          <div className="page-title flex">Report Settings</div>
          <ButtonIcon type="primary" onClick={ () => this.showForm() } icon="Add">
            Add New CSV Report
          </ButtonIcon>
        </div>

        <Table
          className="sm-mt-20"
          rowKey="id"
          dataSource={ csvReports }
          columns={ [
            { title: 'Name', dataIndex: 'name', key: 'name', width: '40%' },
            { title: 'Recurrence', dataIndex: 'recurrence', key: 'recurrence', width: '30%' },
            { title: 'Edit',
              width: '30%',
              render: record => (
                <div>
                  <ButtonEdit
                    className="mr-10 xs-mr-0 xs-mb-10"
                    type="secondary"
                    size="small"
                    onClick={ () => this.showForm(record) }
                  >
                    Edit
                  </ButtonEdit>
                  <ButtonEdit
                    type="danger"
                    size="small"
                    onClick={ () => this.destroyRecord(record) }
                  >
                    Delete
                  </ButtonEdit>
                </div>
              )
            }
          ] }
        />

        <CsvReportsForm
          { ...bindModalState(this) }
          width={ 630 }
          title={ form && form.id ? `Edit CSV Report #${form.id}` : 'New CSV Report' }
          recurrenceOptions={ recurrenceOptions }
          onOpen={ this.getFormData }
          onRequestSave={ this.saveForm }
          onRequestClose={ this.closeForm }
        />
      </Fragment>
    );
  }
}

export default connect(mapStateToProps, dispatchers.mapToProps)(CsvReports);
