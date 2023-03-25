import range from 'lodash/range';
import { getSteppedRange } from './getSteppedRange';

describe('getSteppedRange', () => {
  it('should be valid range for integers', () => {
    const list = range(105, 150);

    const rangeMap = {
      100: 5,
      150: 10,
      250: 25,
      Infinity: 50,
    };
    const resultedRange = [105, 115, 125, 135, 145, 150];

    expect([...getSteppedRange(list, rangeMap)(), 150]).toEqual(resultedRange);
  });

  it('should be valid range for integers', () => {
    const list = [...range(111, 249), 249];

    const rangeMap = {
      100: 5,
      150: 10,
      250: 25,
      Infinity: 50,
    };
    const resultedRange = [111, 121, 131, 141, 150, 175, 200, 225, 249];

    expect([...getSteppedRange(list, rangeMap)(), 249]).toEqual(resultedRange);
  });

  it('should be valid range for decimals', () => {
    const list = [...range(0.1, 3.0, 0.1).map((v) => Math.round(v * 10) / 10), 3.0];
    const rangeMap = {
      1.0: 0.1,
      2.0: 0.2,
      Infinity: 0.5,
    };
    const resultedRange = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.2, 1.4, 1.6, 1.8, 2.0, 2.5, 3.0];

    expect([...getSteppedRange(list, rangeMap)(), 3.0].map((v) => Math.round(v * 10) / 10)).toEqual(resultedRange);
  });

  it('should return limited list', () => {
    const list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const rangeMap = {
      5: 1,
    };
    const resultedRange = [1, 2, 3, 4, 5];

    expect([...getSteppedRange(list, rangeMap)(), 5]).toEqual(resultedRange);
  });

  it('should return empty list', () => {
    const list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const rangeMap = {};
    const resultedRange = [];

    expect(getSteppedRange(list, rangeMap)()).toEqual(resultedRange);
  });
});
