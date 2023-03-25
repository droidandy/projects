import moment from "moment-timezone";

export default class ChartDataTransformer {
  static transform(data, colors, disabled, timezone) {
    const { lines = [] } = data;
    return {
      labels: this.getLabels(lines, (value) =>
        moment(value).utcOffset(timezone, false).format('DD-MM-YYYY')
      ),
      datasets: lines.map((line, key) =>
        this.getDatasetByLine(line, colors, key, disabled)
      ),
      segments: this.getSegments(lines),
      segmentName: '',
    };
  }

  static getSegments(lines) {
    return lines.map(({ name }) => ({ name }));
  }

  static getDatasetByLine(line, colors, index, disabled) {
    const values = line?.points.map((e) => e.values[0]);
    const type = values.filter((e) => e.type.length > 0)[0]?.type;
    return {
      label: line.name,
      data: this.getLineValues(line.points),
      total: values?.map((v) => v?.value).reduce((acc, curr) => acc + curr),
      tooltipData: line.points,
      borderColor: colors[index % 10],
      backgroundColor: 'rgba(255,255,255,0.00)',
      pointBackgroundColor: 'rgba(255,255,255,0.00)',
      pointBorderColor: 'rgba(255,255,255,0.00)',
      disabled: false,
      values,
      typeValue: type
    };
  }

  static getLineValues(points) {
    return points.map((point) => point.values[0].value);
  }

  static getLabels(lines, transform = null) {
    return lines.length > 0
      ? lines[0].points.map((o) => (transform ? transform(o.time) : o.time))
      : [];
  }
}
