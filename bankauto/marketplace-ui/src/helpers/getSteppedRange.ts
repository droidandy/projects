import range from 'lodash/range';

export const getSteppedRange =
  (list: number[], rangeMap: Record<number, number>) =>
  (startRangeIndex: number = 0, maxRangePointIndex: number = 0): number[] => {
    const maxRangePoint = +Object.keys(rangeMap)[maxRangePointIndex];
    if (!maxRangePoint) {
      return [];
    }

    if (maxRangePoint < list[0]) {
      return getSteppedRange(list, rangeMap)(0, maxRangePointIndex + 1);
    }

    let endRangeIndex = list.indexOf(maxRangePoint);
    if (maxRangePoint === Infinity || endRangeIndex === -1) {
      endRangeIndex = list.length;
    }

    if (maxRangePointIndex === -1) {
      return [];
    }
    const rangePart = list.slice(startRangeIndex, endRangeIndex + 1);

    return [
      ...range(rangePart[0], rangePart[rangePart.length - 1], rangeMap[maxRangePoint]),
      ...getSteppedRange(list, rangeMap)(endRangeIndex, maxRangePointIndex + 1),
    ];
  };
