import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Table } from 'antd';
import { Icon, Search, notification, ButtonEdit, confirm } from 'components';
import { bindModalState } from 'components/form';
import PoiForm from './components/PoiForm';
import debounce from 'lodash/debounce';
import dispatchers from 'js/redux/admin/settings.dispatchers';

import css from './components/style.css';

const searchDebounce = 300;

function mapStateToProps(state) {
  return state.settings.poi.list;
}

class Poi extends PureComponent {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.object),
    pagination: PropTypes.object,
    query: PropTypes.object,
    getPredefinedAddresses: PropTypes.func,
    savePredefinedAddress: PropTypes.func,
    destroyPredefinedAddress: PropTypes.func
  };

  state = { search: this.props.query.search };

  componentDidMount() {
    const { getPredefinedAddresses } = this.props;

    getPredefinedAddresses({ page: 1, search: this.state.search });

    this.searchPredefinedAddresses = debounce(() => {
      getPredefinedAddresses({ ...this.props.query, page: 1, search: this.state.search });
    }, searchDebounce);
  }

  showForm(record = {}) {
    this.setState({ formVisible: true, form: record });
  }

  saveForm = (record, form) => {
    const { savePredefinedAddress, getPredefinedAddresses, query } = this.props;

    savePredefinedAddress(record)
      .then(this.closeForm)
      .then(() => notification.success(`POI has been ${record.id ? 'updated' : 'created'}`))
      .then(() => getPredefinedAddresses(query))
      .catch(e => form.setErrors(e.response.data.errors));
  };

  closeForm = () => {
    this.setState({ formVisible: false, form: {} });
  };

  destroyRecord(record) {
    const { destroyPredefinedAddress, getPredefinedAddresses, query } = this.props;
    const { line, id } = record;

    confirm({
      title: `Delete POI ${line}`,
      content: 'Are you sure?',
      onOk: () => {
        destroyPredefinedAddress(id)
          .then(() => notification.success('POI has been deleted'))
          .then(() => getPredefinedAddresses(query));
      }
    });
  }

  onTableChange = (pagination, filters, sorter) => {
    const { query: { search }, getPredefinedAddresses } = this.props;
    const query = { page: pagination.current, search };

    if (sorter.field) { query.order = sorter.field; }
    if (sorter.order === 'descend') { query.reverse = true; }

    getPredefinedAddresses(query);
  };

  onSearch = (value) => {
    this.setState({ search: value }, this.searchPredefinedAddresses);
  };

  render() {
    const { pagination, items } = this.props;
    const { search, form } = this.state;
    const locale = { emptyText: search ? 'No results found' : 'You haven\'t added any POI yet' };

    return (
      <Fragment>
        <div className="layout horizontal center xs-wrap mb-30">
          <div className="page-title flex xs-order-1">POI</div>
          <Search
            className={ `mr-20 xs-full-width xs-order-3 xs-mt-10 ${css.w360}` }
            placeholder="Search POI by name..."
            value={ search }
            onChange={ this.onSearch }
          />
          <Button type="primary" onClick={ () => this.showForm() } className="xs-order-2">
            <Icon className="text-20 mr-10" icon="MdAddCircle" />
            Add New POI
          </Button>
        </div>

        <Table
          className="sm-mt-20"
          rowKey="id"
          dataSource={ items }
          pagination={ pagination }
          onChange={ this.onTableChange }
          locale={ locale }

          columns={ [
            { title: 'POI', dataIndex: 'line', width: '50%', sorter: true },
            { title: 'Edit',
              width: '50%',
              render: record => (
                <div>
                  <ButtonEdit className="mr-10 xs-mb-10" type="secondary" onClick={ () => this.showForm(record) }>Edit</ButtonEdit>
                  <ButtonEdit type="danger" onClick={ () => this.destroyRecord(record) }>Delete</ButtonEdit>
                </div>
              )
            }
          ] }
        />

        <PoiForm
          { ...bindModalState(this) }
          width={ 720 }
          title={ form && form.id ? `Edit POI #${form.id}` : 'New POI' }
          onRequestSave={ this.saveForm }
          onRequestClose={ this.closeForm }
        />
      </Fragment>
    );
  }
}
export default connect(mapStateToProps, dispatchers.mapToProps)(Poi);
