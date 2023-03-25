import React from 'react';
import PropTypes from 'prop-types';
import { isEqual } from 'lodash';
import { Card, Icon, Input, Dropdown, Button, Loader } from 'semantic-ui-react';
import Filters from '../../../components/Filters';
import FilterList from '../../../components/Filters/List';
import ClientsTable from '../../Clients/components/ClientsTable';

class ClientsBody extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    role: PropTypes.array.isRequired,
    filters: PropTypes.object.isRequired,
    clients: PropTypes.array.isRequired,
    productsList: PropTypes.array.isRequired,
    changeFilter: PropTypes.func.isRequired,
    getClients: PropTypes.func.isRequired,
    clearFilter: PropTypes.func.isRequired,
    setFilter: PropTypes.func.isRequired,
    sort: PropTypes.object.isRequired,
    changeClientsSort: PropTypes.func.isRequired,
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

  constructor(props) {
    super(props);

    this.state = {
      clearing: false,
      card: <div />,
    };

    this.onClear = this.onClear.bind(this);
    this.setCardElem = this.setCardElem.bind(this);
  }

  componentWillMount() {
    const { getClients, clients, filtersLoaded, getFilters } = this.props;
    if (!clients.length) getClients();
    if (!filtersLoaded) getFilters();
  }

  componentWillReceiveProps(nextProps) {
    const nextFilters = nextProps.filters;
    const currentFilters = this.props.filters;
    if (nextFilters.product !== currentFilters.product
      || (!nextFilters.clientName && this.state.clearing)
      || nextFilters.competitiveInfoCarrier.name !== currentFilters.competitiveInfoCarrier.name
      || !isEqual(nextFilters.difference, currentFilters.difference)
      || !isEqual(nextFilters.carriers, currentFilters.carriers)
      || !isEqual(nextFilters.clientStates, currentFilters.clientStates)
      || !isEqual(nextFilters.effectiveDate, currentFilters.effectiveDate)
      || !isEqual(nextFilters.sales, currentFilters.sales)
      || !isEqual(nextFilters.presales, currentFilters.presales)
      || !isEqual(nextFilters.brokers, currentFilters.brokers)
      || !isEqual(nextFilters.difference, currentFilters.difference)) {
      nextProps.getClients();
      this.setState({ clearing: false });
      if (nextFilters.product !== currentFilters.product) nextProps.getFilters();
    }
  }

  onClear() {
    this.setState({ clearing: true }, () => {
      this.props.changeFilter('clientName', '');
    });
  }

  setCardElem(node) {
    this.setState({ card: node });
  }

  render() {
    const { togglingIds, toggleTopClient, filters, changeFilter, clients, productsList, getClients, clearFilter, loading, sort, changeClientsSort, setFilter, role } = this.props;
    return (
      <Card className="card-main clients" fluid>
        <Card.Content>
          <Card.Header>
            Clients
            <Filters
              relativeElement={'.card-main.clients'}
              filters={filters}
              changeFilter={changeFilter}
              saveFilters={getClients}
              maxDiff={this.props.maxDiff}
              minDiff={this.props.minDiff}
              carriers={this.props.filterCarriers}
              brokers={this.props.filterBrokerages}
              sae={this.props.filterSales}
            />
            <div className="header-actions">
              <Dropdown
                search
                selection
                options={productsList}
                value={filters.product}
                onChange={(e, inputState) => { changeFilter('product', inputState.value); }}
              />
              <Input
                className="right search"
                icon
                iconPosition="left"
                size="small"
                placeholder="Search..."
                value={filters.clientName || ''}
                onChange={(e, inputState) => { this.props.changeFilter('clientName', inputState.value); }}
                onKeyPress={(event) => {
                  if (event.key === 'Enter') {
                    getClients();
                  }
                }}
              >
                <Icon name="search" />
                <input />
                { filters.clientName && <Icon
                  className="input-clear"
                  name="remove"
                  link
                  onClick={this.onClear}
                /> }
                <Button
                  primary
                  onClick={getClients}
                >Search</Button>
              </Input>
            </div>
          </Card.Header>
          <FilterList changeFilter={changeFilter} filters={filters} clearFilter={clearFilter} />
          { !loading && <ClientsTable
            role={role}
            clients={clients}
            sort={sort}
            changeClientsSort={changeClientsSort}
            setFilter={setFilter}
            filters={filters}
            toggleTopClient={toggleTopClient}
            togglingIds={togglingIds}
          /> }
          { loading &&
          <div className="empty">
            <Loader inline indeterminate active={loading} size="big">Fetching clients</Loader>
          </div>
          }
        </Card.Content>
      </Card>
    );
  }
}

export default ClientsBody;
