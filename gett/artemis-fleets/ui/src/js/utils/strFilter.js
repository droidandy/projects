import isEmpty from 'lodash/isEmpty';

export default function strFilter(string, filter) {
  if (isEmpty(filter)) {
    return true;
  }
  return string.toString().toLowerCase().includes(filter.toLowerCase());
}
