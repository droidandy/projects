import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Header } from 'semantic-ui-react';
import ClientsBody from './components/ClientsBody';
import { ROLE_RENEWAL_SAE, ROLE_RENEWAL_MANAGER } from '../../utils/authService/constants';
import { getRole } from '../../utils/authService/lib';

class Clients extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    children: PropTypes.node,
    loading: PropTypes.bool.isRequired,
    filters: PropTypes.object.isRequired,
    clients: PropTypes.array.isRequired,
    role: PropTypes.array.isRequired,
    productsList: PropTypes.array.isRequired,
    changeFilter: PropTypes.func.isRequired,
    getClients: PropTypes.func.isRequired,
    clearFilter: PropTypes.func.isRequired,
    sort: PropTypes.object.isRequired,
    changeClientsSort: PropTypes.func.isRequired,
    setFilter: PropTypes.func.isRequired,
    maxDiff: PropTypes.number.isRequired,
    minDiff: PropTypes.number.isRequired,
    filterCarriers: PropTypes.array.isRequired,
    filterBrokerages: PropTypes.array.isRequired,
    filterSales: PropTypes.array.isRequired,
    filtersLoaded: PropTypes.bool.isRequired,
    getFilters: PropTypes.func.isRequired,
    toggleTopClient: PropTypes.func.isRequired,
    togglingIds: PropTypes.array.isRequired,
  };

  render() {
    const {
      filters,
      changeFilter,
      clients,
      productsList,
      getClients,
      clearFilter,
      loading,
      sort,
      changeClientsSort,
      setFilter,
      role,
      filtersLoaded,
      getFilters,
      togglingIds,
    } = this.props;

    if (!this.props.children) {
      return (
        <div className="clients-page">
          { (getRole(role, [ROLE_RENEWAL_MANAGER, ROLE_RENEWAL_SAE])) ?
            <Header className="page-title">Renewal Clients</Header> :
            <Header className="page-title">New Business Clients</Header>
          }
          <Grid>
            <Grid.Row>
              <Grid.Column width="16">
                <ClientsBody
                  role={role}
                  filtersLoaded={filtersLoaded}
                  getFilters={getFilters}
                  clients={clients}
                  loading={loading}
                  productsList={productsList}
                  filters={filters}
                  changeFilter={changeFilter}
                  getClients={getClients}
                  clearFilter={clearFilter}
                  sort={sort}
                  changeClientsSort={changeClientsSort}
                  setFilter={setFilter}
                  maxDiff={this.props.maxDiff}
                  minDiff={this.props.minDiff}
                  filterCarriers={this.props.filterCarriers}
                  filterBrokerages={this.props.filterBrokerages}
                  filterSales={this.props.filterSales}
                  toggleTopClient={this.props.toggleTopClient}
                  togglingIds={togglingIds}
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
      );
    }

    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}

export default Clients;
