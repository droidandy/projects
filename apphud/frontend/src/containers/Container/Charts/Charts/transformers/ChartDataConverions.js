const colors = ['0065C1', '0085FF', 'ABD7FF'];

export default class ChartDataConverions {
  static transform(data, conversion) {
    const { rows = [] } = data;

    const parse = {
      labels: this.getLabels(rows),
      rows,
      data: rows,
      datasets: this.getDatasets(rows, conversion),
      segments: this.getSegments(rows),
    };

    return parse;
  }

  static getDatasets(rows, type) {
    if (!rows?.length) {
      return [];
    }

    const labels = rows[0]?.values?.map((e) => e?.name);

    const parseChart = (values, currentIndex) => {
      const currentValue = values[currentIndex]?.value;

      if (type?.value === '% of total') {
        return Number(
          parseFloat((currentValue / values[0]?.value) * 100).toFixed(1)
        );
      }

      if (type?.value === '% of previous') {
        return Number(
          parseFloat(
            (currentValue / (values[currentIndex - 1]?.value || 1)) * 100
          ).toFixed(1)
        );
      }

      return currentValue;
    };

    return [
      {
        label: `# ${labels[0]}`,
        data: rows?.map((row) =>
          type?.value !== 'user count' ? 100 : row?.values[0].value
        ),
        borderColor: '#0065C1',
        backgroundColor: '#0065C1',
      },
      {
        label: `# ${labels[1]}`,
        data: rows?.map((row, i) => {
          return parseChart(row?.values, 1);
        }),
        borderColor: '#0085FF',
        backgroundColor: '#0085FF',
      },
      {
        label: `# ${labels[2]}`,
        data: rows?.map((row) => parseChart(row?.values, 2)),
        borderColor: '#ABD7FF',
        backgroundColor: '#ABD7FF',
      },
    ];
  }

  static getLabels(rows) {
    const labels = rows?.map((row) =>
      row?.segments?.map((el) => el.value).join(' | ')
    );

    return labels;
  }

  static getSegments(rows) {
    return rows
      ?.map(({ segments }) => {
        return segments?.map((obj) => ({ name: obj?.value }));
      })
      .flat();
  }
}
