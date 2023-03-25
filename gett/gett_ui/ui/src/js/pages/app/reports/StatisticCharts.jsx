import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { BarChart, PieChart, Desktop, Phone, SpendChart, Icon} from 'components';
import { chunk, map } from 'lodash';
import { vehiclesChartItemSorter } from 'utils';

import CN from 'classnames';
import css from './style.css';

export default class StatisticCharts extends Component {
  static propTypes = {
    countByStatusMonthly: PropTypes.array,
    countByStatusDaily: PropTypes.array,
    countByVehicleNameMonthly: PropTypes.array,
    countByVehicleNameDaily: PropTypes.array,
    spendByBookingTypeMonthly: PropTypes.array,
    spendByBookingTypeDaily: PropTypes.array,
    spendByMonth: PropTypes.array,
    completedByVehicleName: PropTypes.array,
    completedByScheduleType: PropTypes.array,
    monthRidesAllCities: PropTypes.array,
    monthRidesByCity: PropTypes.array,
    monthSpendAllCities: PropTypes.array,
    monthSpendByCity: PropTypes.array,
    monthWaitingCostAllCities: PropTypes.array,
    monthWaitingCostByCity: PropTypes.array,
    monthAvgCostPerVehicleAllCities: PropTypes.array,
    monthAvgCostPerVehicleByCity: PropTypes.array,
    monthRidesAllCompanies: PropTypes.array,
    monthRidesByCompany: PropTypes.array,
    monthSpendAllCompanies: PropTypes.array,
    monthSpendByCompany: PropTypes.array,
    monthWaitingCostAllCompanies: PropTypes.array,
    monthWaitingCostByCompany: PropTypes.array,
    monthAvgCostPerVehicleAllCompanies: PropTypes.array,
    monthAvgCostPerVehicleByCompany: PropTypes.array,
    ordersSettings: PropTypes.object,
    carSettings: PropTypes.object,
    bookingSettings: PropTypes.object,
    rideByCitySettings: PropTypes.object,
    spendByCitySettings: PropTypes.object,
    waitingByCitySettings: PropTypes.object,
    costByCitySettings: PropTypes.object,
    rideByCompanySettings: PropTypes.object,
    spendByCompanySettings: PropTypes.object,
    waitingByCompanySettings: PropTypes.object,
    costByCompanySettings: PropTypes.object,
    setChartIndex: PropTypes.func,
    isPdf: PropTypes.bool,
    isProcurementStatistic: PropTypes.bool
  };

  getCharts() {
    const { isProcurementStatistic, isPdf } = this.props;
    const charts = isProcurementStatistic ? [...this.getBaseCharts(), ...this.getProcurementSpecificCharts()] : this.getBaseCharts();
    const wrappedBarCharts = map(charts, (chart, i) => <div key={ i } className={ CN({ 'mb-20': !isPdf }, css.chartWrapper) }>{ chart }</div>);

    return [...wrappedBarCharts, this.getPieCharts()];
  }

  getBaseCharts() {
    const {
      countByStatusMonthly,
      countByStatusDaily,
      countByVehicleNameMonthly,
      countByVehicleNameDaily,
      spendByBookingTypeMonthly,
      spendByBookingTypeDaily,
      spendByMonth,
      monthRidesAllCities,
      monthRidesByCity,
      monthSpendAllCities,
      monthSpendByCity,
      monthWaitingCostAllCities,
      monthWaitingCostByCity,
      monthAvgCostPerVehicleAllCities,
      monthAvgCostPerVehicleByCity,
      ordersSettings,
      carSettings,
      bookingSettings,
      rideByCitySettings,
      spendByCitySettings,
      waitingByCitySettings,
      costByCitySettings,
      setChartIndex,
      isPdf
    } = this.props;

    return [
      <BarChart
        key="MonthlyByStatus"
        isPdf={ isPdf }
        settings={ ordersSettings }
        onIndexChange={ data => setChartIndex('ordersSettings', data) }
        generalTitle="Monthly Completed/Cancelled Orders"
        extendedTitle="Daily Completed/Cancelled Orders"
        yAxisLabel="Orders"
        generalData={ countByStatusMonthly }
        extendedData={ countByStatusDaily }
        pdfHeight={ 290 }
        name="completed_cancelled_orders_chart"
      />,
      <Phone key="MonthlyByVehicle">
        { matches => (
          <BarChart
            isPdf={ isPdf }
            settings={ carSettings }
            onIndexChange={ data => setChartIndex('carSettings', data) }
            generalTitle="Monthly Completed Orders by Car Type"
            extendedTitle="Daily Completed Orders by Car Type"
            yAxisLabel="Orders"
            generalData={ countByVehicleNameMonthly }
            extendedData={ countByVehicleNameDaily }
            height={ matches ? 550 : 300 }
            pdfHeight={ 290 }
            tooltipOptions={ { itemSorter: vehiclesChartItemSorter } }
            name="completed_orders_by_car_type_chart"
          />
        ) }
      </Phone>,
      <BarChart
        key="MonthlyByBookingType"
        isPdf={ isPdf }
        settings={ bookingSettings }
        onIndexChange={ data => setChartIndex('bookingSettings', data) }
        generalTitle="Monthly Spend by Booking Type"
        extendedTitle="Daily Spend by Booking Type"
        yAxisLabel="Pounds"
        generalData={ spendByBookingTypeMonthly }
        extendedData={ spendByBookingTypeDaily }
        unit=" £"
        pdfHeight={ 290 }
        name="spend_by_booking_type_chart"
      />,
      <SpendChart
        key="MonthlySpend"
        isPdf={ isPdf }
        generalTitle="Daily Spend VS Previous Month"
        data={ spendByMonth }
        label="Pounds"
        dataKey="name"
        name="daily_spend_vs_prev_month_chart"
      />,
      <BarChart
        key="ridesThisMonthByCity"
        isPdf={ isPdf }
        settings={ rideByCitySettings }
        onIndexChange={ data => setChartIndex('rideByCitySettings', data) }
        generalTitle="Total completed rides this month All Cities"
        extendedTitle="Completed rides this month by City"
        yAxisLabel="Rides"
        generalData={ monthRidesAllCities }
        extendedData={ monthRidesByCity }
        pdfHeight={ 290 }
        unit=" rides"
        name="completed_rides_by_city_chart"
      />,
      <BarChart
        key="spendThisMonthByCity"
        isPdf={ isPdf }
        settings={ spendByCitySettings }
        onIndexChange={ data => setChartIndex('spendByCitySettings', data) }
        generalTitle="Total spend this month All Cities"
        extendedTitle="Spend this month by City"
        yAxisLabel="Pounds"
        generalData={ monthSpendAllCities }
        extendedData={ monthSpendByCity }
        unit=" £"
        pdfHeight={ 290 }
        name="spend_by_city_chart"
      />,
      <BarChart
        key="waitingCostThisMonthByCity"
        isPdf={ isPdf }
        settings={ waitingByCitySettings }
        onIndexChange={ data => setChartIndex('waitingByCitySettings', data) }
        generalTitle="Waiting time cost this month All Cities"
        extendedTitle="Waiting time cost this month by City"
        yAxisLabel="Pounds"
        generalData={ monthWaitingCostAllCities }
        extendedData={ monthWaitingCostByCity }
        unit=" £"
        pdfHeight={ 290 }
        name="waiting_time_by_city_chart"
      />,
      <Phone key="avgCostByVehicleThisMonthByCity">
        { matches => (
          <BarChart
            isPdf={ isPdf }
            settings={ costByCitySettings }
            onIndexChange={ data => setChartIndex('costByCitySettings', data) }
            generalTitle="Average ride cost per vehicle type this month All Cities"
            extendedTitle="Average ride cost per vehicle type this month by City"
            yAxisLabel="Pounds"
            generalData={ monthAvgCostPerVehicleAllCities }
            extendedData={ monthAvgCostPerVehicleByCity }
            unit=" £"
            height={ matches ? 550 : 300 }
            pdfHeight={ 290 }
            tooltipOptions={ { itemSorter: vehiclesChartItemSorter } }
            name="avg_ride_cost_per_vehicle_type_by_city_chart"
          />
        ) }
      </Phone>
    ];
  }

  getProcurementSpecificCharts() {
    const {
      monthRidesAllCompanies,
      monthRidesByCompany,
      monthSpendAllCompanies,
      monthSpendByCompany,
      monthWaitingCostAllCompanies,
      monthWaitingCostByCompany,
      monthAvgCostPerVehicleAllCompanies,
      monthAvgCostPerVehicleByCompany,
      rideByCompanySettings,
      spendByCompanySettings,
      waitingByCompanySettings,
      costByCompanySettings,
      setChartIndex,
      isPdf
    } = this.props;

    return [
      <BarChart
        key="ridesThisMonthByCompany"
        isPdf={ isPdf }
        settings={ rideByCompanySettings }
        onIndexChange={ data => setChartIndex('rideByCompanySettings', data) }
        generalTitle="Total completed rides this month All Companies"
        extendedTitle="Completed rides this month by Company Name"
        yAxisLabel="Rides"
        generalData={ monthRidesAllCompanies }
        extendedData={ monthRidesByCompany }
        pdfHeight={ 290 }
        unit=" rides"
        name="completed_rides_all_companies_chart"
      />,
      <BarChart
        key="spendThisMonthByCompany"
        isPdf={ isPdf }
        settings={ spendByCompanySettings }
        onIndexChange={ data => setChartIndex('spendByCompanySettings', data) }
        generalTitle="Total spend this month All Companies"
        extendedTitle="Spend this month by Company Name"
        yAxisLabel="Pounds"
        generalData={ monthSpendAllCompanies }
        extendedData={ monthSpendByCompany  }
        unit=" £"
        pdfHeight={ 290 }
        name="spend_all_companies_chart"
      />,
      <BarChart
        key="waitingCostThisMonthByCompany"
        isPdf={ isPdf }
        settings={ waitingByCompanySettings }
        onIndexChange={ data => setChartIndex('waitingByCompanySettings', data) }
        generalTitle="Waiting time cost this month All Companies"
        extendedTitle="Waiting time cost this month by Company Name"
        yAxisLabel="Pounds"
        generalData={ monthWaitingCostAllCompanies }
        extendedData={ monthWaitingCostByCompany  }
        unit=" £"
        pdfHeight={ 290 }
        name="waiting_cost_all_companies_chart"
      />,
      <BarChart
        key="avgCostByVehicleThisMonthByCompany"
        isPdf={ isPdf }
        settings={ costByCompanySettings }
        onIndexChange={ data => setChartIndex('costByCompanySettings', data) }
        generalTitle="Average ride cost per vehicle type this month All Companies"
        extendedTitle="Average ride cost per vehicle type this month by Company Name"
        yAxisLabel="Pounds"
        generalData={ monthAvgCostPerVehicleAllCompanies }
        extendedData={ monthAvgCostPerVehicleByCompany }
        unit=" £"
        pdfHeight={ 290 }
        tooltipOptions={ { itemSorter: vehiclesChartItemSorter } }
        name="avg_ride_cost_per_vehicle_type_all_companies_chart"
      />
    ];
  }

  getPieCharts() {
    const { completedByVehicleName, completedByScheduleType, isPdf } = this.props;

    return (
      <Desktop key="pieCharts">
        { matches => (
          <div className="layout horizontal xs-wrap mb-40">
            <div className={ CN('xs-full-width half-width mr-10 xs-mr-0', css.chartWrapper) }>
              <PieChart
                title="Completed Orders by Car Type"
                isPdf={ isPdf }
                matches={ matches }
                data={ completedByVehicleName }
                tooltipOptions={ { itemSorter: vehiclesChartItemSorter } }
                name="completed_orders_by_car_type_pie_chart"
              />
            </div>
            <div className={ CN('xs-full-width flex ml-10 xs-ml-0 xs-mt-40', css.chartWrapper) }>
              <PieChart
                title="Completed Orders by Future/ASAP"
                isPdf={ isPdf }
                matches={ matches }
                data={ completedByScheduleType }
                name="completed_orders_by_future_asap_pie_chart"
              />
            </div>
          </div>
        ) }
      </Desktop>
    );
  }

  wrapInPage(charts) {
    return (
      <div className="page-break-avoid p-20">
        { this.renderPdfHeader() }
        { map(charts, (chart, i) => <div key={ i } className="page-break-avoid mb-20">{ chart }</div>) }
      </div>
    );
  }

  renderPdfHeader() {
    return (
      <div className="pdf-header mb-10">
        <Icon icon="LogoOT" width={ 130 } height={ 50 } className="mb-10" />
      </div>
    );
  }

  renderPdf() {
    const pageCapacity = 2;
    const pdfComponents = this.getCharts();
    const pages = chunk(pdfComponents, pageCapacity);

    return (
      <div className="text-center bold-text">
        { map(pages, (page, i) => <div key={ i }>{ this.wrapInPage(page) }</div>) }
      </div>
    );
  }

  render() {
    const { isPdf } = this.props;

    if (isPdf) return this.renderPdf();

    return (
      <Fragment>
        { this.getCharts() }
      </Fragment>
    );
  }
}
