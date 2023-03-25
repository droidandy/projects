import React from 'react';
import PropTypes from 'prop-types';
import { isEqual } from 'lodash';
import { Grid, Header, Card } from 'semantic-ui-react';
import Chart from './components/Chart';
import Carriers from './components/Carriers';
import AtRisk from './components/AtRisk';
import UpcomingRenewal from './components/UpcomingRenewal';
import SalesCharts from './components/SalesCharts';
import BrokerVolume from './components/BrokerVolume';
import TopClients from './components/TopClients';
import DiscountCard from './components/DiscountCard';
import { ROLE_SUPERADMIN, ROLE_CARRIER_MANAGER, ROLE_CARRIER_PRESALE, ROLE_CARRIER_SALES, ROLE_RENEWAL_SAE, ROLE_RENEWAL_MANAGER } from '../../utils/authService/constants';
import ClientsTable from './ClientsTable';
import { CARRIER } from '../../config';
import { getRole } from '../../utils/authService/lib';
import ProbabilityCard from './components/ProbabilityCard';
import FunnelCard from './components/FunnelCard';

class Home extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    filtersLoaded: PropTypes.bool.isRequired,
    filters: PropTypes.object.isRequired,
    chart: PropTypes.object.isRequired,
    marketProduct: PropTypes.string.isRequired,
    incumbentProduct: PropTypes.string.isRequired,
    volumeProduct: PropTypes.string.isRequired,
    riskProduct: PropTypes.string.isRequired,
    clients: PropTypes.array.isRequired,
    productsList: PropTypes.array.isRequired,
    brokerVolume: PropTypes.array.isRequired,
    volumeGroups: PropTypes.array.isRequired,
    filterCarriers: PropTypes.array.isRequired,
    filterBrokerages: PropTypes.array.isRequired,
    filterSales: PropTypes.array.isRequired,
    marketPositions: PropTypes.array.isRequired,
    quoteDifference: PropTypes.array.isRequired,
    changeFilter: PropTypes.func.isRequired,
    changeVolumeGroup: PropTypes.func.isRequired,
    getBrokerVolume: PropTypes.func.isRequired,
    getQuoteDifference: PropTypes.func.isRequired,
    getMarketPositions: PropTypes.func.isRequired,
    clearFilter: PropTypes.func.isRequired,
    getClients: PropTypes.func.isRequired,
    setFilter: PropTypes.func.isRequired,
    getFilters: PropTypes.func.isRequired,
    changeMarketProduct: PropTypes.func.isRequired,
    changeIncumbentProduct: PropTypes.func.isRequired,
    changeVolumeProduct: PropTypes.func.isRequired,
    volumeGroup: PropTypes.string.isRequired,
    role: PropTypes.array.isRequired,
    groupsTotal: PropTypes.number.isRequired,
    membersTotal: PropTypes.number.isRequired,
    maxDiff: PropTypes.number.isRequired,
    minDiff: PropTypes.number.isRequired,
    probabilityProduct: PropTypes.string.isRequired,
    changeProbabilityProduct: PropTypes.func.isRequired,
    getProbabilityStats: PropTypes.func.isRequired,
    probabilityStats: PropTypes.object.isRequired,
    getClientsAtRisk: PropTypes.func.isRequired,
    getUpcomingRenewalClients: PropTypes.func.isRequired,
    riskClients: PropTypes.array.isRequired,
    riskLoading: PropTypes.bool.isRequired,
    upcomingClients: PropTypes.array.isRequired,
    upcomingLoading: PropTypes.bool.isRequired,
    upcomingProduct: PropTypes.string.isRequired,
    topClients: PropTypes.array.isRequired,
    discountStats: PropTypes.object.isRequired,
    discountLoading: PropTypes.bool.isRequired,
    funnelProduct: PropTypes.string.isRequired,
    getFunnelData: PropTypes.func.isRequired,
    funnelData: PropTypes.object.isRequired,
    getTopClients: PropTypes.func.isRequired,
    quarterYear: PropTypes.string.isRequired,
    changeQY: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.setFilters = this.setFilters.bind(this);
  }

  componentWillMount() {
    const { getBrokerVolume, getMarketPositions, getClients, clients, getQuoteDifference, getFilters, filtersLoaded } = this.props;
    if (!clients.length) getClients();
    if (!filtersLoaded) getFilters();
    getBrokerVolume();
    getMarketPositions();
    getQuoteDifference();
  }

  componentWillReceiveProps(nextProps) {
    const nextFilters = nextProps.filters;
    const currentFilters = this.props.filters;
    if (nextProps.volumeGroup !== this.props.volumeGroup) {
      nextProps.getBrokerVolume();
    }
    if (nextFilters.product !== currentFilters.product
      || !isEqual(nextFilters.difference, currentFilters.difference)
      || !isEqual(nextFilters.effectiveDate, currentFilters.effectiveDate)
      || !isEqual(nextFilters.clientStates, currentFilters.clientStates)
      || !isEqual(nextFilters.carriers, currentFilters.carriers)
      || !isEqual(nextFilters.sales, currentFilters.sales)
      || !isEqual(nextFilters.brokers, currentFilters.brokers)
      || !isEqual(nextFilters.difference, currentFilters.difference)) {
      nextProps.getClients();
      if (nextFilters.product !== currentFilters.product) nextProps.getFilters();
    }
  }

  setFilters(data = this.props.filters) {
    const { setFilter } = this.props;
    const newFilter = { ...data };

    setFilter(newFilter);
  }

  render() {
    const {
      loading,
      filters,
      changeFilter,
      getClients,
      clients,
      chart,
      volumeGroups,
      volumeGroup,
      changeVolumeGroup,
      brokerVolume,
      groupsTotal,
      membersTotal,
      marketPositions,
      quoteDifference,
      productsList,
      clearFilter,
      incumbentProduct,
      marketProduct,
      volumeProduct,
      changeMarketProduct,
      changeVolumeProduct,
      changeIncumbentProduct,
      role,
      probabilityProduct,
      changeProbabilityProduct,
      getProbabilityStats,
      probabilityStats,
      riskProduct,
      getClientsAtRisk,
      getUpcomingRenewalClients,
      riskClients,
      riskLoading,
      upcomingClients,
      upcomingLoading,
      upcomingProduct,
      topClients,
      discountStats,
      discountLoading,
      funnelProduct,
      getFunnelData,
      funnelData,
      getTopClients,
      quarterYear,
      changeQY,
    } = this.props;
    return (
      <div className="home">
        { (getRole(role, [ROLE_RENEWAL_MANAGER, ROLE_RENEWAL_SAE])) ?
          <Header className="page-title">Renewal Clients</Header> :
          <Header className="page-title">New Business Clients</Header>
        }
        <Grid>
          <Grid.Row>
            <Grid.Column width="16">

              { /* Sales + PreSales */}
              { (getRole(role, [ROLE_CARRIER_SALES, ROLE_CARRIER_PRESALE])) &&
                <div>
                  <SalesCharts
                    volumeGroups={volumeGroups}
                    volumeGroup={volumeGroup}
                    changeVolumeGroup={changeVolumeGroup}
                    brokerVolume={brokerVolume}
                    loading={loading}
                    chart={chart}
                    clients={clients}
                    filters={filters}
                    changeFilter={changeFilter}
                    getClients={getClients}
                    productsList={productsList}
                    setFilters={this.setFilters}
                    maxDiff={this.props.maxDiff}
                    minDiff={this.props.minDiff}
                    clearFilter={clearFilter}
                    filterCarriers={this.props.filterCarriers}
                    filterBrokerages={this.props.filterBrokerages}
                    filterSales={this.props.filterSales}
                  />
                  <Card.Group stackable itemsPerRow="2">
                    <Carriers
                      title={'Market'}
                      productsList={productsList}
                      product={marketProduct}
                      changeProduct={changeMarketProduct}
                      data={marketPositions}
                      setFilters={this.setFilters}
                    />
                    <Carriers
                      title={'Incumbent'}
                      productsList={productsList}
                      product={incumbentProduct}
                      changeProduct={changeIncumbentProduct}
                      data={quoteDifference}
                      setFilters={this.setFilters}
                    />
                  </Card.Group>
                  <Grid className="sales-clients">
                    <Grid.Row>
                      <Grid.Column width={16}>
                        <ClientsTable />
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </div>
              }

              { /* Manager + SuperAdmin */}
              { (getRole(role, [ROLE_CARRIER_MANAGER, ROLE_SUPERADMIN])) &&
                <div>
                  <Chart
                    loading={loading}
                    chart={chart}
                    clients={clients}
                    filters={filters}
                    maxDiff={this.props.maxDiff}
                    minDiff={this.props.minDiff}
                    changeFilter={changeFilter}
                    getClients={getClients}
                    products={productsList}
                    setFilters={this.setFilters}
                    clearFilter={clearFilter}
                    filterCarriers={this.props.filterCarriers}
                    filterBrokerages={this.props.filterBrokerages}
                    filterSales={this.props.filterSales}
                  />
                  <Card.Group stackable itemsPerRow="2">
                    <BrokerVolume
                      volumeGroups={volumeGroups}
                      volumeGroup={volumeGroup}
                      changeVolumeGroup={changeVolumeGroup}
                      productsList={productsList}
                      volumeProduct={volumeProduct}
                      changeVolumeProduct={changeVolumeProduct}
                      groupsTotal={groupsTotal}
                      membersTotal={membersTotal}
                      brokerVolume={brokerVolume}
                    />
                    <Carriers
                      title={'Market'}
                      productsList={productsList}
                      product={marketProduct}
                      changeProduct={changeMarketProduct}
                      data={marketPositions}
                      setFilters={this.setFilters}
                    />
                    <Carriers
                      title={'Incumbent'}
                      productsList={productsList}
                      product={incumbentProduct}
                      changeProduct={changeIncumbentProduct}
                      data={quoteDifference}
                      setFilters={this.setFilters}
                    />
                    <ProbabilityCard
                      productsList={productsList}
                      probabilityType={probabilityProduct}
                      changeProduct={changeProbabilityProduct}
                      getProbabilityStats={getProbabilityStats}
                      probabilityStats={probabilityStats}
                    />
                    <FunnelCard
                      productsList={productsList}
                      product={funnelProduct}
                      getFunnelData={getFunnelData}
                      funnelData={funnelData}
                      setFilters={this.setFilters}
                    />
                  </Card.Group>
                </div>
              }

              {/* Renewal Sales */}
              { (getRole(role, [ROLE_RENEWAL_SAE])) && (CARRIER === 'UHC') &&
                <div>
                  <Card.Group stackable itemsPerRow="2">
                    <AtRisk
                      productsList={productsList}
                      clients={riskClients}
                      product={riskProduct}
                      getClients={getClientsAtRisk}
                      riskLoading={riskLoading}
                      setFilters={this.setFilters}
                    />
                    <UpcomingRenewal
                      productsList={productsList}
                      clients={upcomingClients}
                      product={upcomingProduct}
                      getClients={getUpcomingRenewalClients}
                      upcomingLoading={upcomingLoading}
                      setFilters={this.setFilters}
                    />
                  </Card.Group>
                  <ClientsTable />
                </div>
              }

              {/* Renewal Manager */}
              { (getRole(role, [ROLE_RENEWAL_MANAGER])) && (CARRIER === 'UHC') &&
                <div>
                  <Card.Group stackable itemsPerRow="3">
                    <AtRisk
                      productsList={productsList}
                      clients={riskClients}
                      product={riskProduct}
                      getClients={getClientsAtRisk}
                      riskLoading={riskLoading}
                      setFilters={this.setFilters}
                    />
                    <UpcomingRenewal
                      productsList={productsList}
                      clients={upcomingClients}
                      product={upcomingProduct}
                      getClients={getUpcomingRenewalClients}
                      upcomingLoading={upcomingLoading}
                      setFilters={this.setFilters}
                    />
                    <TopClients
                      clients={topClients}
                      getTopClients={getTopClients}
                    />
                  </Card.Group>
                  <ClientsTable />
                  <Card.Group stackable itemsPerRow="2">
                    <Carriers
                      title={'Market'}
                      productsList={productsList}
                      product={marketProduct}
                      changeProduct={changeMarketProduct}
                      data={marketPositions}
                      setFilters={this.setFilters}
                    />
                    <DiscountCard
                      discountStats={discountStats}
                      discountLoading={discountLoading}
                      quarterYear={quarterYear}
                      changeQY={changeQY}
                    />
                  </Card.Group>
                </div>
              }
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default Home;
