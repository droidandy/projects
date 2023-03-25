import React, { Fragment } from 'react';
import { Tag } from 'antd';
import moment from 'moment';
import { map } from 'lodash';
import { paymentTypeLabels } from 'pages/shared/bookings/data';
import css from '../styles.css';

export const typeOptions = [
  { value: 'asap', text: 'ASAP' },
  { value: 'future', text: 'Future' },
  { value: 'ftr', text: 'FTR' },
  { value: 'vip', text: 'VIP' },
  { value: 'critical_flag', text: 'Critical Ride' },
  { value: 'critical_company', text: 'Critical Company' },
  { value: 'international_flag', text: 'International' }
];
export const labelColors = {
  'Future': 'blue',
  'Critical Ride': 'yellow',
  'Critical Company': 'yellow'
};
const labelNames = typeOptions.reduce((names, { value, text }) => {
  names[value] = text;
  return names;
}, {});
export const etaStatuses = ['on_the_way', 'in_progress'];
export const paymentMethodOptions = map(paymentTypeLabels, (value, key) => ({ value: key, text: value }));

export function formatScheduledAt(scheduledAt, record) {
  let format = 'DD MMM YYYY, HH:mm';

  if (record.timezone && record.timezone !== moment.defaultZone.name) {
    format = `${format} ([${record.timezone}])`;
  }

  return moment(scheduledAt).tz(record.timezone).format(format);
}

export function formatScheduledAtWithId(scheduledAt, record) {
  return (
    <Fragment>
      <div>{ formatScheduledAt(scheduledAt, record) }</div>
      <div>ID: { record.serviceId }</div>
    </Fragment>
  );
}

export function renderEta(record) {
  return (etaStatuses.includes(record.status) && record.eta && `${record.eta} min`) || 'N/A';
}

export function renderLabels(labels) {
  return labels.map(label => <Tag color={ getLabelColor(label) } key={ label } className="mb-5 mt-5">{ labelNames[label] }</Tag>);
}

export function getAlertStatus(alertStatus) {
  return alertStatus === 'critical' ? css.errorAlert : css.warningAlert;
}

function getLabelColor(labelText) {
  return labelColors[labelText] || 'red';
}
