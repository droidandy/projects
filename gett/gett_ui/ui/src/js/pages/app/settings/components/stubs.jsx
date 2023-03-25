import React from 'react';
import moment from 'moment';
import { range } from 'lodash';

export const columns = [{
  id: 1,
  date: '01/08/2017',
  invoice: '03312243',
  description: 'August Invoice',
  status: 'Unpaid'
}, {
  id: 2,
  date: '01/07/2017',
  invoice: '03312242',
  description: 'July Invoice',
  status: 'Overdue'
}, {
  id: 3,
  date: '01/06/2017',
  invoice: '03312241',
  description: 'June Invoice',
  status: 'Paid'
}];

export function transactionHistoryData() {
  const month = moment().month();

  return range(month, month + 12).map(i => ({
    name: moment.monthsShort(i),
    value: Math.floor(Math.random() * 1000) + 800
  }));
}

export function renderCustomizedLabel(obj) {
  const { x, y, payload } = obj;

  return (
    <text x={ x } y={ y } textAnchor="end" fill="#666">{ `£ ${payload.value}` }</text>
  );
}
