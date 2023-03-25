import * as Rx from 'src/rx';
import { TransString } from 'src/types';
import i18n from 'i18next';

const DELAY = 500;

export function _getData<T>(key: string, defaultItems: T): T;
export function _getData<T>(key: string, defaultItems: T[]): T[];
export function _getData<T>(key: string, defaultItems: any): any {
  if (!localStorage[key]) {
    localStorage[key] = JSON.stringify(defaultItems);
  }
  return JSON.parse(localStorage[key]);
}

export function _mockResponse<T>(fn: () => T) {
  return Rx.defer(() => {
    return Rx.of(fn());
  }).pipe(Rx.delay(DELAY));
}

export function _download(data: string, filename: string, type: string) {
  const file = new Blob([data], { type });
  if (window.navigator.msSaveOrOpenBlob) {
    // IE10+
    window.navigator.msSaveOrOpenBlob(file, filename);
  } else {
    // Others
    const a = document.createElement('a');
    const url = URL.createObjectURL(file);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  }
}

export function _escapeCsv(str: string | boolean | number | undefined) {
  if (str == null) {
    return '';
  }
  str = String(str);
  let needQuotes = false;
  if (str.includes('"')) {
    needQuotes = true;
    str = str.replace(/"/g, '""');
  }
  if (str.includes(',')) {
    needQuotes = true;
  }
  if (needQuotes) {
    str = '"' + str + '"';
  }
  return str;
}

export function _paginate<
  T,
  K extends { pageNumber: number; pageSize: number }
>(criteria: K, searchFn: (criteria: K) => T[]) {
  const filtered = searchFn(criteria);
  const start = criteria.pageNumber * criteria.pageSize;
  const items = filtered.slice(start, start + criteria.pageSize);

  return {
    items,
    total: filtered.length,
    pageNumber: criteria.pageNumber,
    pageSize: criteria.pageSize,
  };
}

export function _filterString(a: string | TransString, b: string | undefined) {
  if (!b) {
    return true;
  }
  const target = typeof a === 'string' ? a : a[i18n.language];
  return target.toLowerCase().includes(b.toLowerCase());
}

export function _filterExact(a: string, b: string | undefined) {
  if (!b) {
    return true;
  }
  return a === b;
}

export function _filterBool(a: boolean, b: boolean | undefined) {
  if (b == null) {
    return true;
  }
  return a === b;
}

export function _filterArray(a: string[], b: string[] | undefined) {
  if (b == null) {
    return true;
  }
  return a.some(x => b.includes(x));
}

export function _compareOptionalTransString(
  a: TransString | undefined,
  b: TransString | undefined
) {
  if (!a && !b) {
    return 0;
  }
  if (!a) {
    return -1;
  }
  if (!b) {
    return 1;
  }
  return a[i18n.language].localeCompare(b[i18n.language]);
}

export function _compareBool(a: boolean, b: boolean) {
  return (a ? 1 : 0) - (b ? 1 : 0);
}
