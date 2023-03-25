import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindState } from 'react-form-base';
import { message } from 'antd';
import CompanyForm from './components/CompanyForm';
import dispatchers from 'js/redux/admin/companies.dispatchers';

function mapStateToProps(state) {
  return {
    company: state.companies.edit
  };
}

class CompanyEdit extends PureComponent {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string
      })
    }),
    company: PropTypes.object,
    buildCompany: PropTypes.func,
    getCompanyForEdit: PropTypes.func,
    saveCompany: PropTypes.func
  };

  static contextTypes = {
    router: PropTypes.object
  };

  state = { form: {} };

  componentDidMount() {
    const { id } = this.props.match.params;

    if (id === undefined) {
      this.props.buildCompany();
    } else {
      this.props.getCompanyForEdit(id);
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ form: nextProps.company });
  }

  saveCompany = (company, form) => {
    this.props.saveCompany(company)
      .then(() => this.context.router.history.push('/companies'))
      .then(() => message.success(`Company has been ${form.isNew ? 'created' : 'updated'}`))
      .catch(e => form.setErrors(e.response.data.errors));
  };

  render() {
    return <CompanyForm { ...bindState(this) } onRequestSave={ this.saveCompany } />;
  }
}

export default connect(mapStateToProps, dispatchers.mapToProps)(CompanyEdit);
