import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Table, Checkbox } from 'antd';
import { bindModalState, ModalForm, Input } from 'components/form';
import { ButtonIcon, ButtonEdit, notification, confirm } from 'components';
import dispatchers from 'js/redux/app/settings.dispatchers';

function mapStateToProps(state) {
  return { travelReasons: state.settings.travelReasons };
}

class TravelReasons extends PureComponent {
  static propTypes = {
    travelReasons: PropTypes.arrayOf(PropTypes.object),
    getTravelReasons: PropTypes.func,
    saveTravelReason: PropTypes.func,
    destroyTravelReason: PropTypes.func
  };

  state = {
    sortOrder: 'ascend'
  };

  componentDidMount() {
    this.props.getTravelReasons();
  }

  showForm(record = {}) {
    this.setState({ formVisible: true, form: record });
  }

  toggleStatus(record) {
    const updated = { ...record, active: !record.active };

    this.props.saveTravelReason(updated)
      .then(() => notification.success(`Reason For Travel has been ${updated.active ? 'activated' : 'deactivated'}`));
  }

  saveForm = (record, form) => {
    this.props.saveTravelReason(record)
      .then(this.closeForm)
      .then(() => notification.success(`Reason For Travel has been ${record.id ? 'updated' : 'created'}`))
      .catch(e => form.setErrors(e.response.data.errors));
  };

  closeForm = () => {
    this.setState({ formVisible: false, form: {} });
  };

  destroyRecord(record) {
    const { id, name } = record;

    confirm({
      title: `Delete Reason For Travel ${name}`,
      content: 'Are you sure?',
      onOk: () => {
        this.props.destroyTravelReason(id)
          .then(() => notification.success('Reason For Travel has been deleted'));
      }
    });
  }

  onTableChange = (_pagination, _filters, { order }) => {
    if (order) {
      this.setState({ sortOrder: order });
    }
  };

  render() {
    const { travelReasons } = this.props;
    const { form, sortOrder } = this.state;

    return (
      <Fragment>
        <div className="layout horizontal center mb-30">
          <div className="page-title flex">Reason for Travel</div>
          <ButtonIcon type="primary" onClick={ () => this.showForm() } icon="Add">
            Add New Reason for Travel
          </ButtonIcon>
        </div>

        <Table
          className="sm-mt-20"
          rowKey="id"
          dataSource={ travelReasons }
          locale={ { emptyText: 'You don\'t have any reasons for travel set' } }
          onChange={ this.onTableChange }
          columns={ [
            { title: 'Reason For Travel',
              dataIndex: 'name',
              key: 'name',
              width: '40%',
              sortOrder,
              sorter: (a, b) => a.name.localeCompare(b.name)
            },
            { title: 'Active',
              width: '20%',
              render: record => (
                <Checkbox checked={ record.active } onChange={ () => this.toggleStatus(record) } data-name="active" />
              )
            },
            { title: 'Edit',
              width: '40%',
              render: record => (
                <div>
                  <ButtonEdit
                    className="mr-10 xs-mb-10"
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

        <ModalForm
          { ...bindModalState(this) }
          validations={ { name: 'presence' } }
          width={ 720 }
          title={ form && form.id ? `Edit Reason For Travel #${form.id}` : 'New Reason For Travel' }
          onRequestSave={ this.saveForm }
          onRequestClose={ this.closeForm }
        >
          { $ => <Input { ...$('name') } label="Reason For Travel Name" /> }
        </ModalForm>
      </Fragment>
    );
  }
}

export default connect(mapStateToProps, dispatchers.mapToProps)(TravelReasons);
