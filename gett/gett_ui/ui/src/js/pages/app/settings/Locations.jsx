import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'antd';
import { ResponsiveTable, ButtonIcon, ButtonEdit, confirm } from 'components';
import { bindModalState } from 'components/form';
import { LocationsForm } from './components';
import { notification } from 'components';
import { connect } from 'react-redux';
import dispatchers from 'js/redux/app/settings.dispatchers';

function mapStateToProps(state) {
  return { locations: state.settings.locations };
}

class Locations extends PureComponent {
  static propTypes = {
    locations: PropTypes.arrayOf(PropTypes.object),
    getLocations: PropTypes.func,
    saveLocation: PropTypes.func,
    destroyLocation: PropTypes.func,
    setDefaultLocation: PropTypes.func
  };

  state = {
    sortOrder: 'ascend'
  };

  componentDidMount() {
    this.props.getLocations();
  }

  showForm(location = { pickupMessage: '', destinationMessage: '' }) {
    this.setState({ formVisible: true, form: location });
  }

  saveForm = (location, form) => {
    this.props.saveLocation(location)
      .then(this.closeForm)
      .then(() => notification.success(`Office Location has been ${location.id ? 'updated' : 'created'}`))
      .catch(e => form.setErrors(e.response.data.errors));
  };

  closeForm = () => {
    this.setState({ formVisible: false, form: {} });
  };

  destroyLocation(location) {
    const { id, name } = location;

    confirm({
      title: `Delete Office Location ${name}`,
      content: 'Are you sure?',
      onOk: () => {
        this.props.destroyLocation(id)
          .then(() => notification.success('Office Location has been deleted'));
      }
    });
  }

  setDefaultLocation(id) {
    this.props.setDefaultLocation(id)
      .then(() => notification.success('Office Location has been updated'));
  }

  onTableChange = (_pagination, _filters, { order }) => {
    if (order) {
      this.setState({ sortOrder: order });
    }
  };

  render() {
    const { locations } = this.props;
    const { form, sortOrder } = this.state;

    return (
      <Fragment>
        <div className="layout horizontal center mb-30">
          <div className="page-title flex">Office Locations</div>
          <ButtonIcon type="primary" onClick={ () => this.showForm() } icon="Add">
            Add Office Location
          </ButtonIcon>
        </div>

        <ResponsiveTable
          className="sm-mt-20"
          rowKey="id"
          dataSource={ locations }
          onChange={ this.onTableChange }
          columns={ [
            { title: 'Default',
              key: 'default',
              render: record => (
                <Checkbox
                  onClick={ () => this.setDefaultLocation(record.id) }
                  checked={ record.default }
                  data-name="default"
                />
              )
            },
            { title: 'Name',
              dataIndex: 'name',
              key: 'name',
              sortOrder,
              sorter: (a, b) => a.name.localeCompare(b.name)
            },
            { title: 'Address', dataIndex: 'address.line', key: 'address' },
            { title: 'Pickup Message', dataIndex: 'pickupMessage', key: 'pm' },
            { title: 'Destination Message', dataIndex: 'destinationMessage', key: 'dm' },
            { title: 'Action',
              width: '20%',
              render: record => (
                <div>
                  <ButtonEdit
                    className="mb-5 mr-10"
                    type="secondary"
                    size="small"
                    onClick={ () => this.showForm(record) }
                  >
                    Edit
                  </ButtonEdit>
                  <ButtonEdit
                    type="danger"
                    size="small"
                    onClick={ () => this.destroyLocation(record) }
                  >
                    Delete
                  </ButtonEdit>
                </div>
              )
            }
          ] }
          mobileColumns={ [
            { title: 'Default',
              key: 'default',
              render: record => (
                <Checkbox
                  onClick={ () => this.setDefaultLocation(record.id) }
                  checked={ record.default }
                />
              )
            },
            { title: 'Description',
              key: 'description',
              render: record => (
                <div>
                  <div className="bold-text">Name:</div>
                  <div className="mb-10">{ record.name }</div>
                  <div className="bold-text">Address:</div>
                  <div>{ record.address.line }</div>
                </div>
              )
            },
            { title: 'Action',
              render: record => (
                <div className="layout vertical">
                  <ButtonEdit
                    className="mb-5"
                    type="secondary"
                    size="small"
                    onClick={ () => this.showForm(record) }
                  >
                    Edit
                  </ButtonEdit>
                  <ButtonEdit
                    type="danger"
                    size="small"
                    onClick={ () => this.destroyLocation(record) }
                  >
                    Delete
                  </ButtonEdit>
                </div>
              )
            }
          ] }
        />

        <LocationsForm
          { ...bindModalState(this) }
          width={ 720 }
          title={ form && form.id ? `Edit Office Location #${form.id}` : 'New Office Location' }
          onRequestSave={ this.saveForm }
          onRequestClose={ this.closeForm }
        />
      </Fragment>
    );
  }
}

export default connect(mapStateToProps, dispatchers.mapToProps)(Locations);
