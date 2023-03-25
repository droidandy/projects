import moment from 'moment';

export const DATERANGE_TODAY = [moment(), moment()];
export const DATERANGE_YESTERDAY = [moment().subtract(1, 'days'), moment().subtract(1, 'days')];
export const DATERANGE_LAST7DAYS = [moment().subtract(6, 'days'), moment()];
export const DATERANGE_LAST30DAYS = [moment().subtract(29, 'days'), moment()];
export const DATERANGE_THISMONTH = [moment().startOf('month'), moment().endOf('month')];
export const DATERANGE_LASTMONTH = [moment().subtract(1, 'month').startOf('month'),
    moment().subtract(1, 'month').endOf('month')];

export const DATERANGE_TODAY_LABEL = 'Today';
export const DATERANGE_YESTERDAY_LABEL = 'Yesterday';
export const DATERANGE_LAST7DAYS_LABEL = 'Last 7 Days';
export const DATERANGE_LAST30DAYS_LABEL = 'Last 30 Days';
export const DATERANGE_THISMONTH_LABEL = 'This Month';
export const DATERANGE_LASTMONTH_LABEL = 'Last Month';
export const DATERANGE_CUSTOMRANGE_LABEL = 'Custom Range';
