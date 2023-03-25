import ChartDataTransformer from "./ChartDataTransformer";

export default class ChartCohortsDataTransformer extends ChartDataTransformer {
  static getLabels(lines) {
    return lines.length > 0
        ? lines[0].points.map((o) =>  o.time)
        : [];
  }
}
