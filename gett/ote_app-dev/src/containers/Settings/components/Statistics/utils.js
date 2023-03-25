import moment from 'moment';
import { curry } from 'lodash';

import { allVehicles } from 'containers/shared/bookings/data';

import config from './config';

export function prepareLabelOfWeek() {
  return `${moment().subtract(7, 'days').format('MMM DD')} - ${moment().format('MMM DD')}`;
}

export function getColorFromScale(index) {
  return config.colorScale[index % config.colorScale.length];
}

function getVehicleName(key) {
  return allVehicles.find(item => item.name.toLowerCase() === key.toLowerCase()).label;
}

function prepareBarData(data, parameter) {
  return (
    data.map(item => ({ x: moment(item.name).format('DD'), y: item[parameter] || 0 }))
  );
}

function getKeysOfValuableObject(dailyData) {
  return Object.keys(dailyData.find(item => Object.keys(item).length !== 1));
}

function prepareByCarType(dailyData) {
  const keys = getKeysOfValuableObject(dailyData).filter(name => (name !== 'date' && name !== 'name'));

  return keys.map(key => ({ name: getVehicleName(key), width: 2, data: prepareBarData(dailyData, key) }));
}

function prepareCancelledCompletedData(dailyData) {
  return [
    { name: 'completed', color: 'rgb(0,160,255)', data: prepareBarData(dailyData, 'completed') },
    { name: 'cancelled', color: 'rgb(255,104,132)', data: prepareBarData(dailyData, 'cancelled') }
  ];
}

function preparePieCardsBy(data) {
  return (
    [
      { type: 'date', label: prepareLabelOfWeek() },
      ...data.map((item, index) => ({ title: item.value, label: item.name, color: getColorFromScale(index) }))
    ]
  );
}

function prepareWeekends(data) {
  return (
    data.map(item => item.date && (moment(item.date).day() === 6 || moment(item.date).day() === 0))
  );
}

const prepareCardData = curry((data, formatter, index) => {
  if (typeof index === 'number') {
    return formatter(data, index);
  }

  return [{ type: 'date', label: 'Select date' }];
});

function cCCardFormatter(data, index) {
  const { date, completed, cancelled } = data[index];

  return [
    { type: 'date', label: moment(date).format('MMM DD') },
    { title: completed + cancelled, label: 'Total', color: 'rgb(142,142,147)' },
    { title: cancelled, label: 'Cancelled', color: 'rgb(255,104,132)' },
    { title: completed, label: 'Completed', color: 'rgb(0,160,255)' }
  ];
}

function costCardFormatter(data, index) {
  const { date, spend } = data[index];

  return [
    { type: 'date', label: moment(date).format('MMM DD') },
    { title: spend, label: 'Cost over', color: 'rgb(0,196,107)' }
  ];
}

function completedFormatter(data, index) {
  const keys = getKeysOfValuableObject(data).filter(name => (name !== 'date' && name !== 'name'));

  const item = data[index];

  return [
    { type: 'date', label: moment(item.date).format('MMM DD') },
    ...keys.map((key, index) => (
      { title: item[key], label: getVehicleName(key), color: getColorFromScale(index) }
    ))
  ];
}

function prepareDailyCompletedCancelledOrders(orders) {
  return {
    cardProps: { data: prepareCardData(orders, cCCardFormatter) },
    data: prepareCancelledCompletedData(orders),
    weekends: prepareWeekends(orders)
  };
}

function prepareDailyCost(orders) {
  return {
    cardProps: {
      data: prepareCardData(orders, costCardFormatter),
      currency: true,
      style: { alignSelf: 'center' }
    },
    data: [{ name: 'cost', color: 'rgb(0,196,107)', data: prepareBarData(orders, 'spend') }],
    weekends: prepareWeekends(orders)
  };
}

function prepareOrdersByCarType({ orders, currency = false }) {
  return {
    cardProps: { data: prepareCardData(orders, completedFormatter), currency },
    offset: 4,
    width: 500,
    data: prepareByCarType(orders),
    weekends: prepareWeekends(orders)
  };
}

function isNullData(data) {
  return data.every(item => Object.keys(item).length === 1);
}

function prepareBarCharts(data) {
  return [
    data.dailyCompletedCancelledOrders
      ? {
        type: 'bar',
        title: 'Daily Completed/Cancelled Orders',
        props: prepareDailyCompletedCancelledOrders(data.dailyCompletedCancelledOrders)
      }
      : null,
    data.dailyCost
      ? {
        type: 'bar',
        title: 'Daily cost over',
        props: prepareDailyCost(data.dailyCost)
      }
      : null,
    data.dailyCompletedOrdersByVehicleName && !isNullData(data.dailyCompletedOrdersByVehicleName)
      ? {
        type: 'bar',
        title: 'Completed orders by car type',
        props: prepareOrdersByCarType({ orders: data.dailyCompletedOrdersByVehicleName })
      }
      : null,
    data.dailyAvgCostByVehicleName && !isNullData(data.dailyAvgCostByVehicleName)
      ? {
        type: 'bar',
        title: 'Avg cost by car type',
        props: prepareOrdersByCarType({
          orders: data.dailyAvgCostByVehicleName,
          currency: true
        })
      }
      : null
  ];
}

function preparePieCharts(data) {
  return [
    data.completedOrdersByCity && data.completedOrdersByCity.length
      ? {
        type: 'pie',
        title: 'Completed orders by city',
        props: {
          cardProps: { data: preparePieCardsBy(data.completedOrdersByCity) },
          data: data.completedOrdersByCity,
          total: data.completedOrdersByCity.reduce((total, item) => (total + item.value), 0)
        }
      }
      : null,
    data.completedOrdersByCompany && data.completedOrdersByCompany.length
      ? {
        type: 'pie',
        title: 'Completed orders by company',
        props: {
          cardProps: { data: preparePieCardsBy(data.completedOrdersByCompany) },
          data: data.completedOrdersByCompany,
          total: data.completedOrdersByCompany.reduce((total, item) => (total + item.value), 0)
        }
      }
      : null
  ];
}

function prepareTopLists(data) {
  return [
    data.topPassengers
      ? { type: 'top', title: 'Top travellers', props: { data: data.topPassengers } }
      : null,
    data.topBookers
      ? { type: 'top', title: 'Top bookers', props: { data: data.topBookers } }
      : null
  ];
}

export function prepareDataBlocks(data) {
  return (
    [
      ...prepareBarCharts(data),
      ...preparePieCharts(data),
      ...prepareTopLists(data)
    ].filter(Boolean)
  );
}

export function tickFormat(t) { return parseInt(t, 10); }
