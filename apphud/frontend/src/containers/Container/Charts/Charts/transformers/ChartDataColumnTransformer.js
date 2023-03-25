import { countries } from '../settings';

export default class ChartDataColumnTransformer {
  static transform(data, colors, disabled) {
    const { rows = [] } = data;

    return {
      labels: this.getLabels(rows),
      rows,
      data: rows,
      typeValue: rows[0]?.values[0]?.type,
      datasets: [
        {
          label: '#',
          data: rows?.map((row) => row?.values[0]?.value),
          borderColor: '#0085ff',
          backgroundColor: '#0085ff',
        },
      ],
      segments: this.getSegments(rows),
      segmentName: 'Day',
    };
  }

  static getLabels(rows) {
    const labels = rows?.map((row) =>
      row?.segments?.map((el) => countries[el.value] || el.value).join(' | ')
    );

    return labels;
  }

  static getSegments(rows) {
    return rows
      ?.map(({ segments }) => {
        return segments?.map((obj) => ({
          name: countries[obj?.value] || obj?.value,
        }));
      })
      .flat();
  }
}
