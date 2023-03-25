import { reduce } from 'js/redux';
import update from 'update-js';

const initialState = {
  account: {
    data: {},
    can: {}
  },
  workRoles: [],
  workRoleFormData: {
    members: []
  },
  departments: [],
  departmentFormData: {
    members: []
  },
  travelRules: {
    changeLog: [],
    travelReasons: [],
    list: [],
    formData: {
      members: [],
      departments: [],
      workRoles: [],
      vehicles: []
    }
  },
  invoices: {
    items: [],
    outstandingBalance: 0
  },
  companyPaymentCard: {},
  locations: [],
  csvReports: {
    items: [],
    formData: {
      recurrenceOptions: []
    }
  }
};

export default reduce('settings', initialState, function(reducer) {
  reducer('getCompanySettingsSuccess', (state, account) => {
    return { ...state, account };
  });

  reducer('getWorkRolesSuccess', (state, workRoles) => {
    return { ...state, workRoles };
  });

  reducer('getWorkRoleFormDataSuccess', (state, workRoleFormData) => {
    return { ...state, workRoleFormData };
  });

  reducer('updateWorkRoleSuccess', (state, workRole) => {
    return update(state, `workRoles.{id:${workRole.id}}`, workRole);
  });

  reducer('createWorkRoleSuccess', (state, workRole) => {
    return update.add(state, 'workRoles', workRole);
  });

  reducer('destroyWorkRoleSuccess', (state, id) => {
    return update.remove(state, `workRoles.{id:${id}}`);
  });

  reducer('getDepartmentsSuccess', (state, departments) => {
    return { ...state, departments };
  });

  reducer('getDepartmentFormDataSuccess', (state, departmentFormData) => {
    return { ...state, departmentFormData };
  });

  reducer('updateDepartmentSuccess', (state, department) => {
    return update(state, `departments.{id:${department.id}}`, department);
  });

  reducer('createDepartmentSuccess', (state, department) => {
    return update.add(state, 'departments', department);
  });

  reducer('destroyDepartmentSuccess', (state, id) => {
    return update.remove(state, `departments.{id:${id}}`);
  });

  reducer('getTravelReasonsSuccess', (state, travelReasons) => {
    return { ...state, travelReasons };
  });

  reducer('updateTravelReasonSuccess', (state, travelReason) => {
    return update(state, `travelReasons.{id:${travelReason.id}}`, travelReason);
  });

  reducer('createTravelReasonSuccess', (state, travelReason) => {
    return update.add(state, 'travelReasons', travelReason);
  });

  reducer('destroyTravelReasonSuccess', (state, id) => {
    return update.remove(state, `travelReasons.{id:${id}}`);
  });

  reducer('getTravelRulesSuccess', (state, rules) => {
    return update(state, 'travelRules.list', rules);
  });

  reducer('updateTravelRulesSuccess', (state, rule) => {
    return update(state, `travelRules.list.{id:${rule.id}}`, rule);
  });

  reducer('destroyTravelRuleSuccess', (state, id) => {
    return update.remove(state, `travelRules.list.{id:${id}}`);
  });

  reducer('getTravelRuleFormDataSuccess', (state, formData) => {
    return update(state, 'travelRules.formData', formData);
  });

  reducer('changeTravelRuleStatus', (state, id, status) => {
    return update(state, `travelRules.list.{id:${id}}.active`, status);
  });

  reducer('onSortEndSuccess', (state, newOrder) => {
    return update(state, 'travelRules.list', newOrder);
  });

  reducer('getInvoicesSuccess', (state, data) => {
    return update(state, 'invoices', data);
  });

  reducer('getCompanyPaymentCardSuccess', (state, data) => {
    return update(state, 'companyPaymentCard', data);
  });

  reducer('getLocationsSuccess', (state, data) => {
    return update(state, 'locations', data);
  });

  reducer('createLocationSuccess', (state, location) => {
    return update.add(state, 'locations', location);
  });

  reducer('updateLocationSuccess', (state, location) => {
    return update(state, `locations.{id:${location.id}}`, location);
  });

  reducer('destroyLocationSuccess', (state, id) => {
    return update.remove(state, `locations.{id:${id}}`);
  });

  reducer('setDefaultLocationSuccess', (state, location) => {
    return update.with(state, 'locations', (items) => {
      return items.map(item => ({ ...item, default: item.id == location.id && location.default }));
    });
  });

  reducer('getCsvReportsSuccess', (state, csvReports) => {
    return update(state, 'csvReports.items', csvReports);
  });

  reducer('getCsvReportFormDataSuccess', (state, formData) => {
    return update(state, 'csvReports.formData', formData);
  });

  reducer('createCsvReportSuccess', (state, csvReport) => {
    return update.add(state, 'csvReports.items', csvReport);
  });

  reducer('updateCsvReportSuccess', (state, csvReport) => {
    return update(state, `csvReports.items.{id:${csvReport.id}}`, csvReport);
  });

  reducer('destroyCsvReportSuccess', (state, id) => {
    return update.remove(state, `csvReports.items.{id:${id}}`);
  });

  reducer('getDirectDebitMandateSuccess', (state, mandate) => {
    return update(state, 'directDebitMandate', mandate);
  });

  reducer('getLogSuccess', (state, changeLog) => {
    return update(state, 'travelRules.changeLog', changeLog);
  });
});
