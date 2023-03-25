import { reduce } from 'js/redux';
import update from 'update-js';

const initialState = {
  ordersSettings: {
    index: 0,
    general: true
  },
  carSettings: {
    index: 0,
    general: true
  },
  bookingSettings: {
    index: 0,
    general: true
  },
  rideByCitySettings: {
    index: 0,
    general: true
  },
  spendByCitySettings: {
    index: 0,
    general: true
  },
  waitingByCitySettings: {
    index: 0,
    general: true
  },
  costByCitySettings: {
    index: 0,
    general: true
  },
  rideByCompanySettings: {
    index: 0,
    general: true
  },
  spendByCompanySettings: {
    index: 0,
    general: true
  },
  waitingByCompanySettings: {
    index: 0,
    general: true
  },
  costByCompanySettings: {
    index: 0,
    general: true
  },
  countByStatusMonthly: [],
  countByStatusDaily: [],
  countByVehicleNameMonthly: [],
  countByVehicleNameDaily: [],
  spendByBookingTypeMonthly: [],
  spendByBookingTypeDaily: [],
  spendByMonth: [],
  completedByVehicleName: [],
  completedByScheduleType: [],
  monthRidesAllCities: [],
  monthRidesByCity: [],
  monthSpendAllCities: [],
  monthSpendByCity: [],
  monthWaitingCostAllCities: [],
  monthWaitingCostByCity: [],
  monthAvgCostPerVehicleAllCities: [],
  monthAvgCostPerVehicleByCity: [],
  monthRidesAllCompanies: [],
  monthRidesByCompany: [],
  monthSpendAllCompanies: [],
  monthSpendByCompany: [],
  monthWaitingCostAllCompanies: [],
  monthWaitingCostByCompany: [],
  monthAvgCostPerVehicleAllCompanies: [],
  monthAvgCostPerVehicleByCompany: []
};

export default reduce('bookings', initialState, (reducer) => {
  reducer('getChartsSuccess', (state, data) => {
    return { ...state, ...data };
  });

  reducer('setChartIndex', (state, chart, data) => {
    return update(state, chart, data);
  });
});
