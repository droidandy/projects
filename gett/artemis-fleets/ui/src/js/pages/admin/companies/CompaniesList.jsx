import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Table, Dropdown, message } from 'antd';
import { Icon, ActionMenu } from 'components';
import moment from 'moment';
import dispatchers from 'js/redux/admin/companies.dispatchers';

const { Item } = ActionMenu;

function mapStateToProps(state) {
  return {
    companies: state.companies.list
  };
}

class CompaniesList extends PureComponent {
  static propTypes = {
    companies: PropTypes.arrayOf(PropTypes.object),
    getCompanies: PropTypes.func,
    toggleCompanyStatus: PropTypes.func
  };

  componentDidMount() {
    this.props.getCompanies();
  }

  toggleCompanyStatus(company) {
    this.props.toggleCompanyStatus(company.id)
      .then(() => message.success('Company has been updated'));
  }

  render() {
    const actionsFor = company => (
      <ActionMenu>
        <Item><Link to={ `/company/${company.id}/edit` }>Edit</Link></Item>
        <Item onClick={ this.toggleCompanyStatus.bind(this, company) }>{ company.active ? 'Deactivate' : 'Activate' }</Item>
      </ActionMenu>
    );

    return (
      <Table
        rowKey="id"
        dataSource={ this.props.companies }
        columns={ [
          { title: 'ID', dataIndex: 'id' },
          { title: 'Name', dataIndex: 'name' },
          { title: 'Сreation date', render: company => moment(company.createdAt).format('YYYY-MM-DD') },
          { title: 'Status', render: company => company.active ? 'Active' : 'Inactive' },
          { title: 'Actions', render: company => (
            <Dropdown overlay={ actionsFor(company) } trigger={ ['click'] }>
              <Icon icon="MdMoreVert" className="text-22 pointer" />
            </Dropdown>
          ) }
        ] }
      />
    );
  }
}

export default connect(mapStateToProps, dispatchers.mapToProps)(CompaniesList);
