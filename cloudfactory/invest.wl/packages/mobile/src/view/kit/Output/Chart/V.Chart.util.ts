interface IVChartGranularity {
  granularity?: number;
  labelCount: number;
}

export class VChartUtil {
  public static LABEL_COUNT_MAX = 5;
  public static INTERVAL_COUNT_MIN = 1;
  public static INTERVAL_COUNT_MAX = VChartUtil.LABEL_COUNT_MAX - 1; // не забываем что интервалов всегда на 1 меньше чем вершин
  public static INTERVAL_SPACE_CFC = 1.2; // + запас на отступы;

  // chart-wrapper не воспринимает granularity 5 < G < 10 && 60 < G < 100
  public static isGranularityValid = (interval: number) =>
    interval <= 5 || (10 <= interval && interval < 60) || 100 <= interval;

  // partWidthPercent - число от 0 до 1 (0.2 == 20%), определяющее
  // сколько примерно места занимает относительно ширины экрана занимает один label
  public static calcGranularity = (len: number, partWidthPercent: number): IVChartGranularity => {
    if (!len) return { granularity: 1, labelCount: 0 };
    len -= 1; // т.к. интервалы считаются между, то нужно уменьшить крайнюю точку, чтоб в неё можно было попасть
    const intervalMin = Math.ceil(len * partWidthPercent * VChartUtil.INTERVAL_SPACE_CFC);
    for (let i = VChartUtil.INTERVAL_COUNT_MAX; i >= VChartUtil.INTERVAL_COUNT_MIN; i--) {
      const granularity = Math.floor(len / i);
      if (granularity >= intervalMin && VChartUtil.isGranularityValid(granularity)) {
        return { granularity, labelCount: i + 1 };
      }
    }

    return { granularity: 1, labelCount: 3 };
  };
}
