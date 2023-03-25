import isNumber from 'lodash/isNumber';

const TRIAD_NAMES = ['', 'тыс.', 'млн.', 'млрд.', 'трлн.', 'блн.'];

interface ShortNumber {
  precision?: number;
  num: number;
  triad: string;
}

export function shortNumber(value: string | number = 0, resultNumberCount?: number , shortCount: number = 1000000): ShortNumber {
  value = value || 0;
  if (isNumber(value)) {
    value = value.toString();
  } else {
    value = value.replace(/\s*/g, '');
    if (isNaN(parseFloat(value))) {
      // TODO: подумать что вернуть в этом случае, посмотреть использование
      return { num: 0, triad: '' };
    }
  }

  const numValue = parseFloat(value);
  if (numValue < shortCount) {
    return {
      precision: 2,
      num: numValue,
      triad: TRIAD_NAMES[0],
    };
  }

  const intValue = value.replace(/[\.,]\d*/, '');
  let triadCount = Math.floor(intValue.length / 3);
  let sliceTo = intValue.length % 3;
  if (sliceTo === 0) {
    sliceTo = 3;
    triadCount -= 1;
  }

  const num = parseFloat(triadCount ? intValue.slice(0, sliceTo) + '.' + intValue.slice(sliceTo) : value.replace(',', '.'));

  return {
    precision: num === 0 ? 2 : (resultNumberCount && resultNumberCount > sliceTo ? resultNumberCount - sliceTo : undefined),
    num, triad: TRIAD_NAMES[triadCount],
  };
}
