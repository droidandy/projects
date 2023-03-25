import { namespace } from 'js/redux';
import { get, post, put, destroy } from 'utils';
import axios from 'axios';
import snakeCase from 'lodash/snakeCase';
import omit from 'lodash/omit';

export default namespace('companies', (dispatcher, action) => {
  dispatcher('getCompanies', (dispatch, query) => {
    dispatch(action('setQuery', query));

    return get('/admin/companies', query)
      .then((res) => {
        dispatch(action('getCompaniesSuccess', res.data));
      });
  });

  dispatcher('getUsers', (dispatch) => {
    return get('/admin/users')
      .then((res) => {
        dispatch(action('getUsersSuccess', res.data.items));
      });
  });

  dispatcher('getCompanyForm', (dispatch, companyId) => {
    const path = companyId ? `${companyId}/edit` : 'new';

    return get(`/admin/companies/${path}`)
      .then((res) => {
        dispatch(action('getCompanyForEditSuccess', res.data));
      });
  });

  dispatcher('saveCompany', (dispatch, company) => {
    company = omit(company, ['references']);

    return (company.id
      ? put(`/admin/companies/${company.id}`, { company })
      : post('/admin/companies', { company })
    ).then(res => res.data);
  });

  dispatcher('saveReferences', (dispatch, companyId, references = []) => {
    function buildFormData(params, priority) {
      const data = new FormData();

      data.append('booking_reference[priority]', priority);

      for (var prop in params) {
        if (params.hasOwnProperty(prop)) {
          data.append(`booking_reference[${snakeCase(prop)}]`, params[prop]);
        }
      }

      return data;
    }

    const promises = references.map((ref, i) => {
      return ref.id
        ? put(`admin/booking_references/${ref.id}`, buildFormData(ref, i))
        : post(`admin/companies/${companyId}/booking_references`, buildFormData(ref, i));
    });

    return axios.all(promises);
  });

  dispatcher('toggleCompanyStatus', (dispatch, id) => {
    return put(`/admin/companies/${id}/toggle_status`)
      .then(() => dispatch(action('toggleCompanyStatusSuccess', id)));
  });

  dispatcher('activateAllMembers', (dispatch, id) => {
    return put(`/admin/companies/${id}/members/activate_all`)
      .then(() => dispatch(action('activateAllMembersSuccess', id)));
  });

  dispatcher('toggleNotifications', (dispatch, id, params) => {
    return put(`/admin/companies/${id}/members/toggle_notifications`, params);
  });

  dispatcher('destroyCompany', (dispatch, id) => {
    return destroy(`/admin/companies/${id}`);
  });

  dispatcher('verifyConnection', (dispatch, serviceType, credentials) => {
    return post(`/admin/companies/verify_${serviceType}`, credentials);
  });

  dispatcher('getStats', (dispatch, id) => {
    dispatch(action('getStats'));

    return get(`/admin/companies/${id}/stats`)
      .then((res) => {
        dispatch(action('getStatsSuccess', res.data));
      });
  });

  dispatcher('getLog', (dispatch, query) => {
    return get(`/admin/companies/${query.id}/log`)
      .then((res) => {
        dispatch(action('getLogSuccess', res.data));
      });
  });

  dispatcher('getComments', (dispatch, companyId) => {
    return get(`/admin/companies/${companyId}/comments`)
      .then(({ data }) => dispatch(action('getCommentsSuccess', data.items)));
  });

  dispatcher('addComment', (dispatch, companyId, text) => {
    return post(`/admin/companies/${companyId}/comments`, { comment: { text } })
      .then(({ data }) => dispatch(action('addComment', companyId, data.comment)));
  });

  dispatcher('getPricingRules', (dispatch, companyId) => {
    return get('/admin/pricing_rules', { companyId })
      .then((res) => {
        dispatch(action('getPricingRulesSuccess', res.data));
      });
  });

  dispatcher('savePricingRule', (dispatch, rule) => {
    return (rule.id
      ? put(`/admin/pricing_rules/${rule.id}`, { rule })
      : post('/admin/pricing_rules', { rule })
    ).then(res => res.data);
  });

  dispatcher('destroyPricingRule', (dispatch, id) => {
    return destroy(`/admin/pricing_rules/${id}`);
  });

  dispatcher('togglePricingRuleStatus', (dispatch, rule) => {
    return put(`/admin/pricing_rules/${rule.id}`, { rule })
      .then(res => dispatch(action('togglePricingRuleStatusSuccess', res.data)));
  });

  dispatcher('copyPricingRules', (dispatch, targetId, sourceId) => {
    return post('/admin/pricing_rules/copy', { targetId, sourceId });
  });
});
