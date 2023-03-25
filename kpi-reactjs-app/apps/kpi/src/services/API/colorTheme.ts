import * as Rx from 'src/rx';
import { ColorTheme, SearchResult } from 'src/types-next';
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
} from './_utils';

export function _getColorThemes(): ColorTheme[] {
  return _getData<ColorTheme>('data_colorThemes', [
    {
      id: 1,
      name: { en: 'White Theme', ar: 'White Theme - ar' },
      vars: {
        headerBg: '#fff',
      },
    },
    {
      id: 2,
      name: { en: 'Black Theme', ar: 'Black Theme - ar' },
      vars: {
        headerBg: '#000',
      },
    },
  ]);
}

function _updateColorThemes(themes: ColorTheme[]) {
  localStorage.data_colorThemes = JSON.stringify(themes);
}

interface SearchColorThemesCriteria {
  pageNumber: number;
  pageSize: number;
  name?: string;
  sortBy: string;
  sortDesc: boolean;
}

function _searchColorThemes(criteria: SearchColorThemesCriteria) {
  const items = _getColorThemes();
  const filtered = items.filter(item => {
    return _filterString(item.name, criteria.name);
  });
  filtered.sort((a, b) => {
    const getDiff = () => {
      switch (criteria.sortBy) {
        case 'name':
          return a.name[i18n.language].localeCompare(b.name[i18n.language]);
        default:
          return a.id - b.id;
      }
    };
    return getDiff() * (criteria.sortDesc ? -1 : 1);
  });
  return filtered;
}

export function searchColorThemes(
  criteria: SearchColorThemesCriteria & { pageIndex: number }
): Rx.Observable<SearchResult<ColorTheme>> {
  return _mockResponse(() => {
    const ret = _paginate(
      {
        ...criteria,
        pageNumber: criteria.pageIndex - 1,
      },
      _searchColorThemes
    );
    return {
      metadata: {
        pageIndex: ret.pageNumber + 1,
        pageSize: ret.pageSize,
        totalCount: ret.total,
      },
      items: ret.items,
    };
  });
}

export function getAllColorThemes() {
  return _mockResponse(() => {
    return _getColorThemes();
  });
}

export function getColorTheme(id: number) {
  return _mockResponse(() => {
    const items = _getColorThemes();
    const item = items.find(x => x.id === id);
    if (!item) {
      throw new Error('ColorTheme not found');
    }
    return item;
  });
}

export function createColorTheme(values: Omit<ColorTheme, 'id'>) {
  return _mockResponse(() => {
    const item: ColorTheme = {
      ...values,
      id: Date.now(),
    };
    const items = _getColorThemes();
    _updateColorThemes([...items, item]);
    return item;
  });
}

export function updateColorTheme(id: number, values: ColorTheme) {
  return _mockResponse(() => {
    const items = _getColorThemes();
    const newItems = items.map(item => {
      if (item.id === id) {
        return values;
      }
      return item;
    });
    _updateColorThemes(newItems);
    return values;
  });
}

export function deleteColorTheme(id: number) {
  return _mockResponse(() => {
    const items = _getColorThemes();
    const newItems = items.filter(item => {
      return item.id !== id;
    });
    _updateColorThemes(newItems);
  });
}
