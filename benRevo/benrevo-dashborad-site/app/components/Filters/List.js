/**
 *
 * Filter List
 *
 */

import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import {
  QUOTED_STATE, ON_BOARDING_STATE, PENDING_APPROVAL_STATE, SOLD_STATE, CLOSED_STATE,
} from '../../pages/Home/constants';
import { mappingClientState } from '../../utils/query';

class List extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    filters: PropTypes.object.isRequired,
    clearFilter: PropTypes.func.isRequired,
    changeFilter: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.removeFilter = this.removeFilter.bind(this);
    this.clearFilters = this.clearFilters.bind(this);
  }

  removeFilter(type, index, value) {
    const { changeFilter, filters } = this.props;
    let data = filters[type];

    if (index !== undefined && index !== null) {
      data = [...data];
      data.splice(index, 1);
    } else data = value || '';

    changeFilter(type, data);
  }

  clearFilters() {
    const { clearFilter } = this.props;
    clearFilter();
  }

  render() {
    const { filters } = this.props;
    const states = {
      [QUOTED_STATE]: false,
      [PENDING_APPROVAL_STATE]: false,
      [SOLD_STATE]: false,
      [ON_BOARDING_STATE]: false,
      [CLOSED_STATE]: false,
    };
    for (let i = 0; i < filters.clientStates.length; i += 1) {
      const state = filters.clientStates[i];

      states[state] = true;
    }

    const baseStates = filters.clientStates.length >= 2 && filters.clientStates[0] === QUOTED_STATE && filters.clientStates[1] === PENDING_APPROVAL_STATE; // default states
    const solidStates = states[ON_BOARDING_STATE] && states[SOLD_STATE];
    const activeStates = states[PENDING_APPROVAL_STATE] && states[QUOTED_STATE] && !baseStates;
    const allGroups = states[PENDING_APPROVAL_STATE] && states[QUOTED_STATE] && states[ON_BOARDING_STATE] && states[SOLD_STATE] && states[CLOSED_STATE];
    let startDate = null;
    let endDate = null;
    if (filters.effectiveDate.length) {
      startDate = moment().add(filters.effectiveDate[0], 'months').startOf('month').format('MMMM');
      endDate = moment().add(filters.effectiveDate[1], 'months').startOf('month').format('MMMM');
    }

    return (
      <div className="filter-list-wrap">
        { (filters.brokers.length > 0
        || (filters.clientStates.length && (!baseStates || filters.clientStates.length !== 2))
        || filters.carriers.length > 0
        || filters.sales.length > 0
        || filters.presales.length > 0
        || filters.difference.length > 0
        || filters.effectiveDate.length > 0
        || filters.competitiveInfoCarrier.name) && <div className="filter-list">
          { filters.effectiveDate.length > 0 &&
            <a tabIndex={0} className="filter-item" onClick={() => this.removeFilter('effectiveDate', null, [])}>{startDate} - {endDate}</a>
          }
          { filters.difference.length > 0 &&
            <a tabIndex={0} className="filter-item" onClick={() => this.removeFilter('difference', null, [])}>{filters.difference[0]} - {filters.difference[1]}%</a>
          }
          { solidStates && !allGroups && <a tabIndex={0} className="filter-item" onClick={() => this.removeFilter('clientStates', null, [])}>Sold Groups</a> }
          { activeStates && !allGroups && <a tabIndex={0} className="filter-item" onClick={() => this.removeFilter('clientStates', null, [])}>Active Groups</a> }
          { allGroups && <a tabIndex={0} className="filter-item" onClick={() => this.removeFilter('clientStates', null, [])}>All Groups</a> }
          { filters.clientStates.map((item, i) => {
            if ((((solidStates && !allGroups && !activeStates && !baseStates && item !== SOLD_STATE && item !== ON_BOARDING_STATE)
                || (activeStates && !allGroups && !solidStates && item !== PENDING_APPROVAL_STATE && item !== QUOTED_STATE)
                || (allGroups && item !== PENDING_APPROVAL_STATE && item !== QUOTED_STATE && item !== ON_BOARDING_STATE && item !== SOLD_STATE && item !== CLOSED_STATE)
                || (baseStates && !allGroups && !solidStates && item !== PENDING_APPROVAL_STATE && item !== QUOTED_STATE))) || (!solidStates && !activeStates && !baseStates && !allGroups)) {
              return (
                <a tabIndex={0} className="filter-item" onClick={() => this.removeFilter('clientStates', i)} key={item}>Status: {mappingClientState(item)}</a>
              );
            }
            return null;
          })}
          { filters.competitiveInfoCarrier.name &&
            <a tabIndex={0} className="filter-item" onClick={() => this.removeFilter('competitiveInfoCarrier', null, [])}>Competitive Info: {filters.competitiveInfoCarrier.displayName}</a>
          }
          { filters.carriers.map((item, i) =>
            <a tabIndex={0} className="filter-item" onClick={() => this.removeFilter('carriers', i)} key={item.carrierId}>{item.name}</a>
          )}
          { filters.sales.map((item, i) =>
            <a tabIndex={0} className="filter-item" onClick={() => this.removeFilter('sales', i)} key={item.fullName}>{item.name}</a>
          )}
          { filters.presales.map((item, i) =>
            <a tabIndex={0} className="filter-item" onClick={() => this.removeFilter('presales', i)} key={item.fullName}>{item.name}</a>
          )}
          { filters.brokers.map((item, i) =>
            <a tabIndex={0} className="filter-item" onClick={() => this.removeFilter('brokers', i)} key={item.name}>{item.name}</a>
          )}
          <a tabIndex={0} className="clear-all" onClick={this.clearFilters}>Clear all filters</a>
        </div> }
      </div>
    );
  }
}

export default List;
