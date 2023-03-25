import * as Rx from 'src/rx';
import * as R from 'remeda';
import { SearchResult, UnitObjective } from 'src/types';
import i18n from 'i18next';
import {
  _getData,
  _mockResponse,
  _paginate,
  _escapeCsv,
  _download,
  _filterString,
  _filterArray,
  _filterExact,
  _compareOptionalTransString,
} from './_utils';
import { _getGoals } from './goal';
import { _getOutputs } from './output';
import { _getMissions } from './mission';
import { _getLoggedUser } from './user';

export function _getUnitObjectives(): UnitObjective[] {
  const missions = _getMissions();
  const map = R.indexBy(missions, x => x.id);
  const unitObjectives = _getData<UnitObjective>('data_unitObjectives', [
    ...R.range(1, 40).map(
      i =>
        ({
          id: 'unit_objective_' + i,
          lastUpdatedTime: '2019-08-09T09:21:14.869Z',
          lastUpdatedById: 'admin',
          name: {
            en: 'Unit Objective ' + i,
            ar: 'Unit Objective ' + i + ' - ar',
          },
          description: {
            en: 'Unit Objective ' + i,
            ar: 'Unit Objective ' + i + ' - ar',
          },
          createdTime: new Date().toISOString(),
          status: i % 2 ? 'active' : 'draft',
          missionId: 'mission_' + i,
          targetUnitId: '1',
          responsiblePersonId: `user_${(i % 8) + 2}`,
          strategicPlanId: i < 20 ? '1' : '2',
        } as UnitObjective)
    ),
  ]);

  unitObjectives.forEach(item => {
    const mission = map[item.missionId];
    if (mission) {
      item.missionName = mission.name;
    }
  });
  return unitObjectives;
}

function _updateUnitObjectives(unitObjectives: UnitObjective[]) {
  localStorage.data_unitObjectives = JSON.stringify(unitObjectives);
}

interface SearchUnitObjectivesCriteria {
  pageNumber: number;
  pageSize: number;
  name?: string;
  status?: string;
  sortBy: string;
  sortDesc: boolean;
  strategicPlanId: string;
}

function _searchUnitObjectives(criteria: SearchUnitObjectivesCriteria) {
  const roles = _getUnitObjectives();
  const filtered = roles.filter(role => {
    return (
      _filterString(role.name, criteria.name) &&
      _filterExact(role.status, criteria.status) &&
      _filterExact(role.strategicPlanId, criteria.strategicPlanId)
    );
  });

  filtered.sort((a, b) => {
    const getDiff = () => {
      switch (criteria.sortBy) {
        case 'name':
          return a.name[i18n.language].localeCompare(b.name[i18n.language]);
        case 'status':
          return a.status.localeCompare(b.status);
        case 'missionName':
          return _compareOptionalTransString(a.missionName, b.missionName);
        case 'createdTime':
          return (
            new Date(a.createdTime).getTime() -
            new Date(b.createdTime).getTime()
          );
        default:
          return a.id.localeCompare(b.id);
      }
    };
    return getDiff() * (criteria.sortDesc ? -1 : 1);
  });
  return filtered;
}

export function searchUnitObjectives(
  criteria: SearchUnitObjectivesCriteria
): Rx.Observable<SearchResult<UnitObjective>> {
  return _mockResponse(() => {
    return _paginate(criteria, _searchUnitObjectives);
  });
}

export function getAllUnitObjectives(strategicPlanId: string) {
  return _mockResponse(() => {
    return _getUnitObjectives().filter(
      x => x.strategicPlanId === strategicPlanId
    );
  });
}

export function exportUnitObjectives(criteria: SearchUnitObjectivesCriteria) {
  const filtered = _searchUnitObjectives(criteria);
  const csv: string[][] = [];
  csv.push([
    i18n.t('ID'),
    i18n.t('Name'),
    i18n.t('Mission'),
    i18n.t('Created Time'),
    i18n.t('Status'),
  ]);
  filtered.forEach(item => {
    csv.push([
      _escapeCsv(item.id),
      _escapeCsv(item.name[i18n.language]),
      _escapeCsv(item.missionName && item.missionName[i18n.language]),
      _escapeCsv(new Date(item.createdTime).toISOString()),
      _escapeCsv(item.status),
    ]);
  });
  const txt = csv.map(item => item.join(',')).join('\n');
  _download(txt, 'unitObjectives.csv', 'text/csv');
}

export function getUnitObjective(id: string) {
  return _mockResponse(() => {
    const items = _getUnitObjectives();
    const item = items.find(x => x.id === id);
    if (!item) {
      throw new Error('UnitObjective not found');
    }
    return item;
  });
}

export function createUnitObjective(
  values: Omit<UnitObjective, 'id' | 'createdTime' | 'outputName'>
) {
  return _mockResponse(() => {
    const { user } = _getLoggedUser();
    const item: UnitObjective = {
      ...values,
      createdTime: new Date().toISOString(),
      lastUpdatedById: user!.id,
      lastUpdatedTime: new Date().toISOString(),
      id: String(Date.now()),
    };
    const items = _getUnitObjectives();
    _updateUnitObjectives([...items, item]);
    return item;
  });
}

export function updateUnitObjective(id: string, values: UnitObjective) {
  return _mockResponse(() => {
    const { user } = _getLoggedUser();
    const items = _getUnitObjectives();
    const newItems = items.map(item => {
      if (item.id === id) {
        return {
          ...values,
          lastUpdatedById: user!.id,
          lastUpdatedTime: new Date().toISOString(),
        };
      }
      return item;
    });
    _updateUnitObjectives(newItems);
    return values;
  });
}

export function deleteUnitObjective(id: string) {
  return _mockResponse(() => {
    const items = _getUnitObjectives();
    const newItems = items.filter(item => {
      return item.id !== id;
    });
    _updateUnitObjectives(newItems);
  });
}
