import * as Rx from 'src/rx';
import * as R from 'remeda';
import { SearchResult, Metric } from 'src/types';
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
  _filterBool,
  _compareBool,
} from './_utils';
import { _getGoals } from './goal';
import { _getOutputs } from './output';
import { _getMissions } from './mission';
import { _getUnitObjectives } from './unitObjective';

export function _getMetrics(): Metric[] {
  const metrics = _getData<Metric>('data_metrics', [
    ...R.range(2, 10).map(
      i =>
        ({
          id: 'generated_' + i,
          name: { en: 'Generated ' + i, ar: 'Generated ' + i + ' - ar' },
          enabled: i % 2 === 0,
          metricType: `Type ${(i % 4) + 1}`,
          dataType: `Data Type ${(i % 4) + 1}`,
          dataSource: `Data Source ${(i % 4) + 1}`,
        } as Metric)
    ),
  ]);
  return metrics;
}

function _updateMetrics(metrics: Metric[]) {
  localStorage.data_metrics = JSON.stringify(metrics);
}

interface SearchMetricsCriteria {
  pageNumber: number;
  pageSize: number;
  name?: string;
  metricType?: string;
  enabled?: boolean;
  dataType?: string;
  dataSource?: string;
  status?: string;
  sortBy: string;
  sortDesc: boolean;
}

function _searchMetrics(criteria: SearchMetricsCriteria) {
  const metrics = _getMetrics();
  const filtered = metrics.filter(item => {
    return (
      _filterString(item.name, criteria.name) &&
      _filterBool(item.enabled, criteria.enabled) &&
      _filterExact(item.metricType, criteria.metricType) &&
      _filterExact(item.dataType, criteria.dataType) &&
      _filterExact(item.dataSource, criteria.dataSource)
    );
  });

  filtered.sort((a, b) => {
    const getDiff = () => {
      switch (criteria.sortBy) {
        case 'name':
          return a.name[i18n.language].localeCompare(b.name[i18n.language]);
        case 'metricType':
          return a.metricType.localeCompare(b.metricType);
        case 'dataType':
          return a.dataType.localeCompare(b.dataType);
        case 'dataSource':
          return a.dataSource.localeCompare(b.dataSource);
        case 'enabled':
          return _compareBool(a.enabled, b.enabled);
        default:
          return a.id.localeCompare(b.id);
      }
    };
    return getDiff() * (criteria.sortDesc ? -1 : 1);
  });
  return filtered;
}

export function searchMetrics(
  criteria: SearchMetricsCriteria
): Rx.Observable<SearchResult<Metric>> {
  return _mockResponse(() => {
    return _paginate(criteria, _searchMetrics);
  });
}

export function getAllMetrics() {
  return _mockResponse(() => {
    return _getMetrics();
  });
}

export function exportMetrics(criteria: SearchMetricsCriteria) {
  const filtered = _searchMetrics(criteria);
  const csv: string[][] = [];
  csv.push([
    i18n.t('ID'),
    i18n.t('Name'),
    i18n.t('Enabled'),
    i18n.t('Metric Type'),
    i18n.t('Data Type'),
    i18n.t('Data Source'),
  ]);
  filtered.forEach(item => {
    csv.push([
      _escapeCsv(item.id),
      _escapeCsv(item.name[i18n.language]),
      _escapeCsv(item.enabled),
      _escapeCsv(item.metricType),
      _escapeCsv(item.dataType),
      _escapeCsv(item.dataSource),
    ]);
  });
  const txt = csv.map(item => item.join(',')).join('\n');
  _download(txt, 'metrics.csv', 'text/csv');
}

export function getMetric(id: string) {
  return _mockResponse(() => {
    const items = _getMetrics();
    const item = items.find(x => x.id === id);
    if (!item) {
      throw new Error('Metric not found');
    }
    return item;
  });
}

export function createMetric(values: Omit<Metric, 'id' | 'createdTime'>) {
  return _mockResponse(() => {
    const item: Metric = {
      ...values,
      id: String(Date.now()),
    };
    const items = _getMetrics();
    _updateMetrics([...items, item]);
    return item;
  });
}

export function updateMetric(id: string, values: Metric) {
  return _mockResponse(() => {
    const items = _getMetrics();
    const newItems = items.map(item => {
      if (item.id === id) {
        return values;
      }
      return item;
    });
    _updateMetrics(newItems);
    return values;
  });
}

export function deleteMetric(id: string) {
  return _mockResponse(() => {
    const items = _getMetrics();
    const newItems = items.filter(item => {
      return item.id !== id;
    });
    _updateMetrics(newItems);
  });
}
