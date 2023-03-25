import moment from 'moment';
import * as homeTypes from '../pages/Home/constants';
import * as appTypes from '../pages/App/constants';

export const generateQueryFilter = (filters) => {
  let query = `?product=${filters.product}`;
  if (filters.difference.length) query += `&diffPercentFrom=${filters.difference[0]}&diffPercentTo=${filters.difference[1]}`;
  if (filters.effectiveDate.length) {
    const startDate = moment().add(filters.effectiveDate[0], 'months').startOf('month').format(appTypes.FILTER_DATE_FORMAT);
    const endDate = moment().add(filters.effectiveDate[1], 'months').endOf('month').format(appTypes.FILTER_DATE_FORMAT);
    query += `&effectiveDateFrom=${startDate}&effectiveDateTo=${endDate}`;
  }
  if (filters.clientName) query += `&clientName=${filters.clientName}`;
  if (filters.competitiveInfoCarrier.name) query += `&competitiveInfoCarrier=${filters.competitiveInfoCarrier.name}`;
  if (filters.clientStates.length) query += `&clientStates=${filters.clientStates.join(',')}`;

  if (filters.sales.length) {
    const list = [];
    for (let i = 0; i < filters.sales.length; i += 1) {
      list.push(encodeURIComponent(filters.sales[i].id));
    }
    query += `&saleIds=${list.join(',')}`;
  }
  if (filters.presales.length) {
    const list = [];
    for (let i = 0; i < filters.presales.length; i += 1) {
      list.push(encodeURIComponent(filters.presales[i].id));
    }
    query += `&presaleIds=${list.join(',')}`;
  }
  if (filters.brokers.length) {
    const list = [];
    for (let i = 0; i < filters.brokers.length; i += 1) {
      list.push(encodeURIComponent(filters.brokers[i].id));
    }
    query += `&brokerIds=${list.join(',')}`;
  }
  if (filters.carriers.length) {
    const list = [];
    let isMultiple = false;
    for (let i = 0; i < filters.carriers.length; i += 1) {
      const item = filters.carriers[i];
      if (item.id) list.push(item.id);
      else if (item.displayName === 'Multiple Carriers') isMultiple = true;
    }

    if (list.length) query += `&carrierIds=${list.join(',')}`;
    if (isMultiple) query += '&multipleCarriers=true';
  }

  return query;
};

export const getInitials = (name = '') => {
  const initials = name.replace(/[^a-zA-Z- ]/g, '').match(/\b\w/g);

  if (initials && initials.length) {
    initials.splice(2, initials.length - 2);
    initials.join('');
  }

  return initials;
};

export const createFilterData = (data) => {
  const filterCarriers = data.incumbentCarriers;
  const filterSales = data.sales;
  const filterBrokerages = [];
  let lastDif = data.diffPercentFrom;
  let firstDif = data.diffPercentTo;

  for (let i = 0; i < data.brokerages.length; i += 1) {
    const item = data.brokerages[i];
    filterBrokerages.push({
      key: item.name,
      text: item.name,
      value: item.id,
    });
  }

  filterCarriers.sort(
    (a, b) => {
      const x = (a.name) ? a.name.toLowerCase() : '';
      const y = (b.name) ? b.name.toLowerCase() : '';
      if (x < y) return -1;
      else if (x > y) return 1;
      return 0;
    }
  );

  filterSales.sort(
    (a, b) => {
      const x = (a.name) ? a.name.toLowerCase() : '';
      const y = (b.name) ? b.name.toLowerCase() : '';
      if (x < y) return -1;
      else if (x > y) return 1;
      return 0;
    }
  );

  filterBrokerages.sort(
    (a, b) => {
      const x = (a.text) ? a.text.toLowerCase() : '';
      const y = (b.text) ? b.text.toLowerCase() : '';
      if (x < y) return -1;
      else if (x > y) return 1;
      return 0;
    }
  );

  lastDif /= 10;
  firstDif /= 10;

  if (lastDif > 0) lastDif = Math.ceil(lastDif) * 10;
  else lastDif = Math.floor(lastDif) * 10;

  if (firstDif > 0) firstDif = Math.ceil(firstDif) * 10;
  else firstDif = Math.floor(firstDif) * 10;

  return {
    lastDif,
    firstDif,
    filterCarriers,
    filterSales,
    filterBrokerages,
  };
};

export const getDate = (unix, format = 'MM.DD.YY') => moment(new Date(unix)).utc().format(format);

// const constantsStrategy = {
//   [homeTypes.RFP_SUBMITTED_STATE]: homeTypes.RFP_SUBMITTED_NORMAL,
// };

export const mappingClientState = (state) => {
  let clientState = '';
  if (state === homeTypes.RFP_SUBMITTED_STATE) clientState = homeTypes.RFP_SUBMITTED_NORMAL;
  else if (state === homeTypes.RFP_STARTED_STATE) clientState = homeTypes.RFP_STARTED_NORMAL;
  else if (state === homeTypes.QUOTED_STATE) clientState = homeTypes.QUOTED_NORMAL;
  else if (state === homeTypes.SUBMITTED_FOR_APPROVAL_STATE) clientState = homeTypes.SUBMITTED_FOR_APPROVAL_NORMAL;
  else if (state === homeTypes.ON_BOARDING_STATE) clientState = homeTypes.ON_BOARDING_NORMAL;
  else if (state === homeTypes.PENDING_APPROVAL_STATE) clientState = homeTypes.PENDING_APPROVAL_NORMAL;
  else if (state === homeTypes.POLICY_FINALIZED_STATE) clientState = homeTypes.POLICY_FINALIZED_NORMAL;
  else if (state === homeTypes.COMPLETED_STATE) clientState = homeTypes.COMPLETED_NORMAL;
  else if (state === homeTypes.SOLD_STATE) clientState = homeTypes.SOLD_NORMAL;
  else if (state === homeTypes.CLOSED_STATE) clientState = homeTypes.CLOSED_NORMAL;
  else if (state === homeTypes.DTQ_STATE) clientState = homeTypes.DTQ_NORMAL;

  return clientState;
};
