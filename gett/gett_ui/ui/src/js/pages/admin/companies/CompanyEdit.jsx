import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindState } from 'react-form-base';
import { Tabs, Modal } from 'antd';
import gettAnalytics from 'utils/gettAnalytics';
import { notification } from 'components';
import { CompanyForm, CompanyPricing, CompanyChangeLog } from './components';
import moment from 'moment';
import isEqual from 'lodash/isEqual';
import companiesDispatchers from 'js/redux/admin/companies.dispatchers';
import appDispatchers from 'js/redux/admin/app.dispatchers';

const { TabPane } = Tabs;

function mapStateToProps(state) {
  return {
    company: state.companies.edit,
    companies: state.companies.form.companies,
    countries: state.companies.form.countries,
    userId: state.app.session.id,
    can: state.companies.form.can
  };
}

function mapDispatchToProps(dispatch) {
  return {
    ...companiesDispatchers.mapToProps(dispatch),
    ...appDispatchers.mapToProps(dispatch)
  };
}

class CompanyEdit extends PureComponent {
  static contextTypes = {
    router: PropTypes.object
  };

  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string
      })
    }),
    company: PropTypes.object,
    getUsers: PropTypes.func,
    getCompanyForm: PropTypes.func,
    saveCompany: PropTypes.func,
    verifyConnection: PropTypes.func,
    saveReferences: PropTypes.func,
    getCompaniesLookup: PropTypes.func,
    companies: PropTypes.array,
    countries: PropTypes.array,
    userId: PropTypes.number,
    can: PropTypes.object
  };

  state = {
    form: {},
    loading: false
  };

  componentDidMount() {
    const { getCompanyForm, company, match: { params: { id } } } = this.props;
    const criticalFlagDueOn = company.criticalFlagDueOn && moment(company.criticalFlagDueOn);

    this.setState({ form: { ...company, criticalFlagDueOn } });
    getCompanyForm(id);
  }

  componentDidUpdate(prevProps) {
    const { company } = this.props;
    const criticalFlagDueOn = company.criticalFlagDueOn && moment(company.criticalFlagDueOn);

    if (!isEqual(prevProps.company, company)) {
      this.setState({ form: { ...company, criticalFlagDueOn } });
    }
  }

  saveCompany = (company, form) => {
    const { saveCompany, saveReferences } = this.props;

    this.setState({ loading: true });

    saveCompany(company)
      .then(data =>
        saveReferences(data.id, company.references)
          .catch(() => {
            if (form.isNew) {
              Modal.warning({
                title: 'Company was created, but...',
                content: [
                  'Company was saved, however there was a problem saving reference information.',
                  'You will be redirected to the company edit page where you can retry'
                ].join(' '),
                onOk: () => this.context.router.history.push(`/companies/${data.id}/edit`)
              });
            } else {
              Modal.warning({
                title: 'Company was updated, but...',
                content: 'There was a problem saving company references. Please try again later'
              });
            }
          })
          .then(() => data)
      ).then((data) => {
        if (data) {
          notification.success(`Company has been ${form.isNew ? 'created' : 'updated'}`);
          this.context.router.history.push('/companies');
        } else {
          this.setState({ loading: false });
        }
      }).catch((error) => {
        this.setState({ loading: false });
        form.setErrors(error.response.data.errors);
      });
  };

  sendAnalyticsEvent = (tabKey) => {
    const { company: { name: companyName }, userId: bookerId } = this.props;

    if (tabKey === 'cl') {
      gettAnalytics('backoffice|company|edit|change_log', { companyName, bookerId });
    }
  };

  renderUntabbed() {
    const { verifyConnection, company } = this.props;
    const { loading } = this.state;

    return (
      <CompanyForm
        { ...bindState(this) }
        onRequestSave={ this.saveCompany }
        verifyConnection={ verifyConnection }
        companies={ this.props.companies }
        countries={ this.props.countries }
        can={ this.props.can }
        title={ company.id ? `Edit ${company.name}` : 'Add New Company' }
        loading={ loading }
      />
    );
  }

  renderTabbed() {
    const { company: { id } } = this.props;

    return (
      <Tabs className="scrollable-tabs" onChange={ this.sendAnalyticsEvent } animated={ false }>
        <TabPane tab="Main Info" key="mi">
          { this.renderUntabbed() }
        </TabPane>
        <TabPane tab="Pricing" key="pg">
          <CompanyPricing companyId={ id } />
        </TabPane>
        <TabPane tab="Change Log" key="cl">
          <CompanyChangeLog companyId={ id } />
        </TabPane>
      </Tabs>
    );
  }

  render() {
    const { company: { id } } = this.props;

    return (
      <Fragment>
        <div className="page-title mb-30">Companies</div>
        { id ? this.renderTabbed() : this.renderUntabbed() }
      </Fragment>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CompanyEdit);
