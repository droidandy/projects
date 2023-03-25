/**
 * The dashboard state selectors
 */

import { createSelector } from 'reselect';
import * as types from './constants';

const selectGlobal = (state) => state.get('app');
const selectDashboard = (state) => state.get('dashboard');

const makeChart = createSelector(
  selectDashboard,
  (substate) => {
    const clients = substate.get('clients').toJS();
    const filterDifference = substate.get('filters').get('difference').toJS();
    const difference = filterDifference.length ? filterDifference : [];
    const positions = [];
    let left = 0;
    let right = 0;
    let lastDif = 999999;
    let firstDif = -999999;

    for (let i = 0; i < clients.length; i += 1) {
      const client = clients[i];
      if ((client.diffPercent) < lastDif) lastDif = client.diffPercent;
      if ((client.diffPercent) > firstDif) firstDif = client.diffPercent;
    }

    if (firstDif > 0) {
      firstDif = Math.ceil(firstDif / 10) * 10;
    } else firstDif = Math.floor(firstDif / 10) * 10;

    if (lastDif > 0) {
      lastDif = Math.ceil(lastDif / 10) * 10;
    } else lastDif = Math.floor(lastDif / 10) * 10;

    if (!difference.length) {
      difference[0] = lastDif;
      difference[1] = firstDif;
    }

    const ranges = [[firstDif]];
    const calcFull = Math.abs(parseFloat(lastDif)) + parseFloat(firstDif);
    let step = 20;

    if (calcFull >= 500) {
      step = Math.ceil(calcFull / 5);

      step = Math.ceil(step / 5) * 5;
    } else if (calcFull >= 100) {
      step = Math.ceil(calcFull / 10);

      step = Math.ceil(step / 10) * 10;
    }

    difference.reverse();

    for (let i = firstDif; i > lastDif; i -= 1) {
      const current = Math.abs(Math.round(i) % step) === 0;
      if (current && i !== firstDif) {
        if (ranges[ranges.length - 1].length === 2) ranges.push([ranges[ranges.length - 1][0]]);
        if (Math.round(i) < ranges[ranges.length - 1][0]) {
          ranges[ranges.length - 1].push(Math.round(i));
          ranges[ranges.length - 1].reverse();
        } else {
          ranges[ranges.length - 1][0] = Math.round(i);
          ranges[ranges.length - 1].push(null);
        }
      }
    }

    if (ranges.length > 1) ranges.push([[ranges[ranges.length - 1][0]] - step, ranges[ranges.length - 1][0]]);
    else {
      left = lastDif / step;
      right = firstDif / step;

      if (left > 0 && right > 0) left = 0;
      else if (left > 0) left = Math.ceil(left) * step;
      else left = Math.floor(left) * step;

      if (left < 0 && right < 0) right = 0;
      else if (right > 0) right = Math.ceil(right) * step;
      else right = Math.floor(right) * step;
    }

    if (ranges.length === 1 && firstDif < 0 && lastDif > 0 && firstDif > 0 && lastDif < 0) {
      ranges[1] = [left, 0];
      ranges[0] = [0, right];
    } else if (ranges.length === 1) {
      ranges[0][0] = (lastDif > 0) ? left : lastDif;
      ranges[0][1] = (firstDif < 0) ? right : firstDif;
      positions.push(clients);

      return {
        positions,
        ranges,
        step,
      };
    }

    for (let j = 0; j < ranges.length; j += 1) {
      const range = ranges[j];
      if (range[0] === null || range[1] === null) {
        ranges.splice(j, 1);
        j -= 1;
      }
    }

    // if (lastDif <= ranges[ranges.length - 1][0] + step) ranges.push([-10000, ranges[ranges.length - 1][0]]);

    if (firstDif === 0 && ranges[0][0] === 0) {
      ranges.splice(0, 1);
    }

    if (lastDif === 0 && ranges[0][1] === 0) {
      ranges.splice(ranges.length - 1, 1);
    }

    if (firstDif > ranges[0][0] + step) {
      ranges[0][0] = step;
      ranges.splice(1, 0, [0, ranges[0][0]]);
    }

    for (let j = 0; j < ranges.length; j += 1) {
      const range = ranges[j];
      positions.push([]);
      for (let i = 0; i < clients.length; i += 1) {
        const client = clients[i];
        if (client.diffPercent >= range[0] && client.diffPercent <= range[1]) {
          positions[positions.length - 1].push(client);
        }
      }
    }

    if (ranges.length && ranges[ranges.length - 1][0] !== 0 && ranges[0][0] - step > 0 && lastDif > 0) {
      ranges.push([0, ranges[ranges.length - 1][0]]);
    }

    /*  if (ranges[0][0] !== 0) {
     ranges[0][1] = 0;
     ranges.unshift([0, step]);
     } */

    if (ranges.length === positions.length) {
      for (let k = 0; k < positions.length; k += 1) {
        const item = positions[k];

        if (item.length === 0 && (k === positions.length - 1 || k === 0)) {
          ranges.splice(k, 1);
          positions.splice(k, 1);
          if (k > 0) k += 1;
          else k = -1;
        }
      }
    }

    return {
      positions,
      ranges,
      step,
    };
  }
);

const makeVolumeGroups = createSelector(
  () => [
    {
      text: 'Active Groups',
      value: types.ACTIVE,
    },
    {
      text: 'Sold Groups',
      value: types.SOLD,
    },
    {
      text: 'Closed',
      value: types.CLOSED,
    },
    {
      text: 'All Groups',
      value: types.ALL_GROUPS,
    },
  ]
);

const selectBrokerVolume = createSelector(
  selectDashboard,
  (substate) => substate.get('volumeGroup'),
);

const selectFilters = createSelector(
  selectDashboard,
  (substate) => substate.get('filters').toJS(),
);

const selectBrokersVolume = createSelector(
  selectDashboard,
  (substate) => {
    const data = substate.get('brokerVolume').toJS();

    data.sort(
      (a, b) => {
        const x = b.members;
        const y = a.members;
        if (x < y) {
          return -1;
        } else if (x > y) {
          return 1;
        }
        return 0;
      }
    );

    return data;
  }
);

const selectMarketPositions = createSelector(
  selectDashboard,
  (substate) => {
    const data = substate.get('marketPositions').toJS();

    data.sort(
      (a, b) => {
        const x = a.avgDiffPercent;
        const y = b.avgDiffPercent;
        if (x < y) {
          return -1;
        } else if (x > y) {
          return 1;
        }
        return 0;
      }
    );

    return data;
  }
);


const selectQuoteDifference = createSelector(
  selectDashboard,
  (substate) => {
    const data = substate.get('quoteDifference').toJS();

    data.sort(
      (a, b) => {
        const x = a.avgDiffPercent;
        const y = b.avgDiffPercent;
        if (x < y) {
          return -1;
        } else if (x > y) {
          return 1;
        }
        return 0;
      }
    );

    return data;
  }
);

const selectMarketProduct = createSelector(
  selectDashboard,
  (substate) => substate.get('marketProduct')
);

const selectVolumeProduct = createSelector(
  selectDashboard,
  (substate) => substate.get('volumeProduct')
);

const selectIncumbentProduct = createSelector(
  selectDashboard,
  (substate) => substate.get('incumbentProduct')
);

export {
  selectGlobal,
  selectDashboard,
  makeChart,
  makeVolumeGroups,
  selectBrokerVolume,
  selectBrokersVolume,
  selectMarketPositions,
  selectFilters,
  selectMarketProduct,
  selectQuoteDifference,
  selectVolumeProduct,
  selectIncumbentProduct,
};
