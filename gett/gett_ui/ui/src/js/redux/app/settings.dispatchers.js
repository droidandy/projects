import { namespace } from 'js/redux';
import { get, put, post, destroy } from 'utils';
import sessionDispatchers from './session.dispatchers';
import dashboardDispatchers from './dashboard.dispatchers';
import { map } from 'lodash';

export default namespace('settings', (dispatcher, action) => {
  dispatcher('getCompanySettings', (dispatch) => {
    return get('/company/settings')
      .then(res => dispatch(action('getCompanySettingsSuccess', res.data)));
  });

  dispatcher('updateCompanySettings', (dispatch, params) => {
    return put('/company/settings', params)
      .then((res) => {
        dashboardDispatchers(dispatch).updateDashboard(res.data);
        // also have to reload session information, since it provides address for layout
        sessionDispatchers(dispatch).getCurrent();
      });
  });

  dispatcher('updateCompanyLogo', (dispatch, logo) => {
    return put('/company', { company: { logo } })
      .then((res) => {
        dashboardDispatchers(dispatch).updateDashboard(res.data);
        // also have to reload session information, since it provides logo for layout
        sessionDispatchers(dispatch).getCurrent();
      });
  });

  dispatcher('updatePassword', (dispatch, params) => {
    return put('/user/update_password', params);
  });

  dispatcher('getWorkRoles', (dispatch) => {
    return get('/work_roles')
      .then(res => dispatch(action('getWorkRolesSuccess', res.data)));
  });

  dispatcher('getWorkRoleFormData', (dispatch, workRoleId) => {
    const path = workRoleId ? `/work_roles/${workRoleId}/edit` : '/work_roles/new';

    return get(path)
      .then((res) => {
        const { members, workRole } = res.data;

        dispatch(action('getWorkRoleFormDataSuccess', { members }));
        return workRole;
      });
  });

  dispatcher('saveWorkRole', (dispatch, workRole) => {
    if (!workRole.id) {
      return post('/work_roles', { workRole })
        .then(res => dispatch(action('createWorkRoleSuccess', res.data)));
    }

    return put(`/work_roles/${workRole.id}`, { workRole })
      .then(res => dispatch(action('updateWorkRoleSuccess', res.data)));
  });

  dispatcher('destroyWorkRole', (dispatch, id) => {
    return destroy(`/work_roles/${id}`)
      .then(() => dispatch(action('destroyWorkRoleSuccess', id)));
  });

  dispatcher('getDepartments', (dispatch) => {
    return get('/departments')
      .then(res => dispatch(action('getDepartmentsSuccess', res.data)));
  });

  dispatcher('getDepartmentFormData', (dispatch, departmentId) => {
    const path = departmentId ? `/departments/${departmentId}/edit` : '/departments/new';

    return get(path)
      .then((res) => {
        const { members, department } = res.data;

        dispatch(action('getDepartmentFormDataSuccess', { members }));
        return department;
      });
  });

  dispatcher('saveDepartment', (dispatch, department) => {
    if (!department.id) {
      return post('/departments', { department })
        .then(res => dispatch(action('createDepartmentSuccess', res.data)));
    }

    return put(`/departments/${department.id}`, { department })
      .then(res => dispatch(action('updateDepartmentSuccess', res.data)));
  });

  dispatcher('destroyDepartment', (dispatch, id) => {
    return destroy(`/departments/${id}`)
      .then(() => dispatch(action('destroyDepartmentSuccess', id)));
  });

  dispatcher('getTravelReasons', (dispatch) => {
    return get('/travel_reasons')
      .then(res => dispatch(action('getTravelReasonsSuccess', res.data)));
  });

  dispatcher('saveTravelReason', (dispatch, travelReason) => {
    if (!travelReason.id) {
      return post('/travel_reasons', { travelReason })
        .then(res => dispatch(action('createTravelReasonSuccess', res.data)));
    }

    return put(`/travel_reasons/${travelReason.id}`, { travelReason })
      .then(res => dispatch(action('updateTravelReasonSuccess', res.data)));
  });

  dispatcher('destroyTravelReason', (dispatch, id) => {
    return destroy(`/travel_reasons/${id}`)
      .then(() => dispatch(action('destroyTravelReasonSuccess', id)));
  });

  dispatcher('getTravelRules', (dispatch) => {
    return get('/travel_rules')
      .then(res => dispatch(action('getTravelRulesSuccess', res.data)));
  });

  dispatcher('saveTravelRule', (dispatch, travelRule) => {
    if (!travelRule.id) {
      return post('/travel_rules', { travelRule });
    }

    return put(`/travel_rules/${travelRule.id}`, { travelRule })
      .then((res) => {
        dispatch(action('updateTravelRulesSuccess', res.data));
      });
  });

  dispatcher('changeTravelRuleStatus', (dispatch, rule) => {
    const newStatus = !rule.active;

    dispatch(action('changeTravelRuleStatus', rule.id, newStatus));

    return put(`/travel_rules/${rule.id}`, { ...rule, active: newStatus })
      .catch((error) => {
        dispatch(action('changeTravelRuleStatus', rule.id, !newStatus));

        throw error;
      });
  });

  dispatcher('destroyTravelRule', (dispatch, id) => {
    return destroy(`/travel_rules/${id}`)
      .then(() => dispatch(action('destroyTravelRuleSuccess', id)));
  });

  dispatcher('getTravelRuleFormData', (dispatch) => {
    return get('/travel_rules/form')
      .then((res) => {
        dispatch(action('getTravelRuleFormDataSuccess', res.data));

        return res.data;
      });
  });

  dispatcher('onSortEnd', (dispatch, newOrder) => {
    const params = map(newOrder, 'id');
    return put('/travel_rules/update_priorities', { priorities: params } )
      .then(() => {
        dispatch(action('onSortEndSuccess', newOrder));
      });
  });

  function getInvoices(dispatch) {
    return get('/invoices')
      .then((res) => {
        dispatch(action('getInvoicesSuccess', res.data));
      });
  }

  dispatcher('getInvoices', (dispatch) => {
    getInvoices(dispatch);
  });

  dispatcher('createPayment', (dispatch, payment) => {
    return post('/invoice_payments', { payment })
      .then(() => getInvoices(dispatch));
  });

  dispatcher('getCompanyPaymentCard', (dispatch) => {
    return get('/company/payment_card')
      .then((res) => {
        dispatch(action('getCompanyPaymentCardSuccess', res.data));
      });
  });

  dispatcher('updateCompanyPaymentCard', (dispatch, paymentCard) => {
    return put('/company/payment_card', { paymentCard })
      .then((res) => {
        dispatch(action('getCompanyPaymentCardSuccess', res.data));
      });
  });

  dispatcher('retryPayment', (dispatch) => {
    return post('/invoice_payments/retry')
      .then(() => {
        getInvoices(dispatch);
      });
  });

  dispatcher('getLocations', (dispatch) => {
    return get('/locations').then(res => dispatch(action('getLocationsSuccess', res.data)));
  });

  dispatcher('saveLocation', (dispatch, location) => {
    if (!location.id) {
      return post('/locations', { location })
        .then(res => dispatch(action('createLocationSuccess', res.data)));
    }

    return put(`/locations/${location.id}`, { location })
      .then(res => dispatch(action('updateLocationSuccess', res.data)));
  });

  dispatcher('destroyLocation', (dispatch, id) => {
    return destroy(`/locations/${id}`)
      .then(() => dispatch(action('destroyLocationSuccess', id)));
  });

  dispatcher('setDefaultLocation', (dispatch, id) => {
    return put(`/locations/${id}/default`)
      .then(res => dispatch(action('setDefaultLocationSuccess', res.data)));
  });

  dispatcher('getCsvReports', (dispatch) => {
    return get('/csv_reports').then(res => dispatch(action('getCsvReportsSuccess', res.data)));
  });

  dispatcher('getCsvReportFormData', (dispatch, CsvReportId) => {
    const path = CsvReportId ? `/csv_reports/${CsvReportId}/edit` : '/csv_reports/new';

    return get(path)
      .then((res) => {
        const { csvReport, recurrenceOptions } = res.data;

        dispatch(action('getCsvReportFormDataSuccess', { recurrenceOptions }));
        return csvReport;
      });
  });

  dispatcher('saveCsvReport', (dispatch, csvReport) => {
    if (!csvReport.id) {
      return post('/csv_reports', { csvReport })
        .then(res => dispatch(action('createCsvReportSuccess', res.data)));
    }

    return put(`/csv_reports/${csvReport.id}`, { csvReport })
      .then(res => dispatch(action('updateCsvReportSuccess', res.data)));
  });

  dispatcher('destroyCsvReport', (dispatch, id) => {
    return destroy(`/csv_reports/${id}`)
      .then(() => dispatch(action('destroyCsvReportSuccess', id)));
  });

  dispatcher('createDirectDebitMandate', () => {
    post('/direct_debit_mandate').then(res => window.location = res.data.redirectUrl);
  });

  dispatcher('completeDirectDebitMandate', (dispatch, redirectFlowId) => {
    return post('/direct_debit_mandate/complete', { redirectFlowId })
      .then(res => dispatch(action('getDirectDebitMandateSuccess', res.data)));
  });

  dispatcher('getDirectDebitMandate', (dispatch) => {
    return get('/direct_debit_mandate')
      .then(res => dispatch(action('getDirectDebitMandateSuccess', res.data)));
  });

  dispatcher('getLog', (dispatch, query) => {
    return get(`/travel_rules/${query.id}/log`)
      .then((res) => {
        dispatch(action('getLogSuccess', res.data));
      });
  });
});
