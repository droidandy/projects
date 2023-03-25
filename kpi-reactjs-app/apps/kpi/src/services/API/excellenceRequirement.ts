import * as Rx from 'src/rx';
import * as R from 'remeda';
import { SearchResult, ExcellenceRequirement } from 'src/types';
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
import { _getExcellenceStandards } from './excellenceStandard';

export function _getExcellenceRequirements(): ExcellenceRequirement[] {
  const standards = _getExcellenceStandards();
  const map = R.indexBy(standards, x => x.id);
  const excellenceRequirements = _getData<ExcellenceRequirement>(
    'data_excellenceRequirements',
    [
      ...R.range(1, 40).map(
        i =>
          ({
            id: 'excellence_requirement_' + i,
            name: {
              en: 'Excellence Requirement ' + i,
              ar: 'Excellence Requirement ' + i + ' - ar',
            },
            description: {
              en: 'Excellence Requirement ' + i,
              ar: 'Excellence Requirement ' + i + ' - ar',
            },
            createdTime: new Date().toISOString(),
            status: i % 2 ? 'active' : 'draft',
            excellenceStandardId: 'excellence_standard_' + i,
            targetUnitId: '1',
            responsiblePersonId: `user_${(i % 8) + 2}`,
            strategicPlanId: i < 20 ? '1' : '2',
            unitObjectiveId: i < 20 ? 'unit_objective_1' : 'unit_objective_20',
            startDate: 2015,
            endDate: 2018,
          } as ExcellenceRequirement)
      ),
    ]
  );
  excellenceRequirements.forEach(item => {
    const standard = map[item.excellenceStandardId];
    if (standard) {
      item.standardName = standard.name;
    }
  });
  return excellenceRequirements;
}

function _updateExcellenceRequirements(
  excellenceRequirements: ExcellenceRequirement[]
) {
  localStorage.data_excellenceRequirements = JSON.stringify(
    excellenceRequirements
  );
}

interface SearchExcellenceRequirementsCriteria {
  pageNumber: number;
  pageSize: number;
  name?: string;
  status?: string;
  sortBy: string;
  sortDesc: boolean;
  strategicPlanId: string;
}

function _searchExcellenceRequirements(
  criteria: SearchExcellenceRequirementsCriteria
) {
  const roles = _getExcellenceRequirements();
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
        case 'standardName':
          return _compareOptionalTransString(a.standardName, b.standardName);
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

export function searchExcellenceRequirements(
  criteria: SearchExcellenceRequirementsCriteria
): Rx.Observable<SearchResult<ExcellenceRequirement>> {
  return _mockResponse(() => {
    return _paginate(criteria, _searchExcellenceRequirements);
  });
}

export function getAllExcellenceRequirements(strategicPlanId: string) {
  return _mockResponse(() => {
    return _getExcellenceRequirements().filter(
      x => x.strategicPlanId === strategicPlanId
    );
  });
}

export function exportExcellenceRequirements(
  criteria: SearchExcellenceRequirementsCriteria
) {
  const filtered = _searchExcellenceRequirements(criteria);
  const csv: string[][] = [];
  csv.push([
    i18n.t('ID'),
    i18n.t('Name'),
    i18n.t('Standard'),
    i18n.t('Created Time'),
    i18n.t('Status'),
  ]);
  filtered.forEach(item => {
    csv.push([
      _escapeCsv(item.id),
      _escapeCsv(item.name[i18n.language]),
      _escapeCsv(item.standardName && item.standardName[i18n.language]),
      _escapeCsv(new Date(item.createdTime).toISOString()),
      _escapeCsv(item.status),
    ]);
  });
  const txt = csv.map(item => item.join(',')).join('\n');
  _download(txt, 'excellenceRequirements.csv', 'text/csv');
}

export function getExcellenceRequirement(id: string) {
  return _mockResponse(() => {
    const items = _getExcellenceRequirements();
    const item = items.find(x => x.id === id);
    if (!item) {
      throw new Error('Excellence Requirement not found');
    }
    return item;
  });
}

export function createExcellenceRequirement(
  values: Omit<ExcellenceRequirement, 'id' | 'createdTime' | 'outputName'>
) {
  return _mockResponse(() => {
    const item: ExcellenceRequirement = {
      ...values,
      createdTime: new Date().toISOString(),
      id: String(Date.now()),
    };
    const items = _getExcellenceRequirements();
    _updateExcellenceRequirements([...items, item]);
    return item;
  });
}

export function updateExcellenceRequirement(
  id: string,
  values: ExcellenceRequirement
) {
  return _mockResponse(() => {
    const items = _getExcellenceRequirements();
    const newItems = items.map(item => {
      if (item.id === id) {
        return values;
      }
      return item;
    });
    _updateExcellenceRequirements(newItems);
    return values;
  });
}

export function deleteExcellenceRequirement(id: string) {
  return _mockResponse(() => {
    const items = _getExcellenceRequirements();
    const newItems = items.filter(item => {
      return item.id !== id;
    });
    _updateExcellenceRequirements(newItems);
  });
}
