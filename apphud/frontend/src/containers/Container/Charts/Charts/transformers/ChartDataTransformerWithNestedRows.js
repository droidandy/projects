import ChartDataTransformer from "./ChartDataTransformer";
import { sum } from "stats-lite";
import {countries} from "../settings";
import colors from "../utils/colors";

export const weightedAverage = (arr) => {
  const max = Math.max(...arr);
  const weights = arr.map(v => v / max);
  const a = sum(arr.map((v, i) => v * weights[i]));
  const b = sum(weights);
  return (a / b || 0).toFixed(2);
}

export default class ChartDataTransformerWithNestedRows extends ChartDataTransformer{

  static slice = 4;

  static transform(data = [], colors, disabled, slice = this.slice, isPercent = false) {
    const rows = isPercent ? this.transformToPercentValues(data) : data;
    return {
      labels: this.getLabels(rows, null, slice, disabled),
      datasets: rows.map((line, key) =>
          this.getDatasetByLine(line, colors, key, disabled, slice)
      ).filter(({isDisabled}) => !isDisabled),
      segments: this.getSegments(rows, disabled),
      segmentName: ""
    }
  }

  static getSegments(lines, disabled) {
    return lines
        .filter((line) => {
          return disabled.findIndex((v) => {
            return v?.label === line?.label
          }) === -1
        })
        .map(({ label }) => ({ label }));
  }

  static getDatasetByLine(line, colors, index, disabled, sliceNum) {
    const values = line?.values.slice(sliceNum).map((e) => e.value);
    const isDisabled = disabled.findIndex((v) => {
      return v?.label === line?.label
    }) !== -1
    return {
      label: index,
      data: values,
      total: values.reduce((acc, curr) => acc + curr),
      tooltipData: line.values,
      borderColor: line?.color,
      backgroundColor: "rgba(255,255,255,0.00)",
      pointBackgroundColor: "rgba(255,255,255,0.00)",
      pointBorderColor: "rgba(255,255,255,0.00)",
      isDisabled,
      values
    };
  }

  static getLabels(lines = [], transform = null, sliceNum) {
    return lines[0]?.values.slice(sliceNum).map((o) => o.name);
  }

  static getTableData(data, withDefaultColor = false) {
    const { rows = [] } = data || {};
    const res = rows.map(row => {
      return {
        in_progress: row.segments.findIndex((e) => e?.in_progress === true) !== -1,
        label: countries[row.segments[0].value] || row.segments[0].value,
        segment: row.segments[1]?.value,
        values: row.values?.map((val) => ({
          ...val,
          root: val.name === "Renewal 0"
        }))
      }
    });
    return this.groupByLabel(res, withDefaultColor);
  }

  static groupByLabel(data, withDefaultColor) {
    const labels = Array.from(new Set(data.map(e => e.label)));
    const segments = Array.from(new Set(data.map(e => e.segment)));
    const res = labels.map((label, i) => {
      const nodes = data
          .filter(el => el.label === label)
          .map((node, ix) => ({
            ...node,
            value: node.values?.map((val) => ({
              ...val,
              root: val.name === "Renewal 0"
            })),
            label: segments[ix]
          }))
      ;
      return {
        label,
        color: withDefaultColor ? colors[0] :colors[i % 10],
        in_progress: nodes.findIndex((e) => e.in_progress === true) !== -1,
        values: nodes[0].values.map((n, i) => {
          // const value = nodes.filter(e => e.label !== 'Overall').map(node => node.values[i].value);
          return {
            ...n
            // value: this.calculateValue(value, n.name)
          }
        }),
        nodes: nodes.slice(1)
      }
    })
    return res;
  }

  static calculateValue(values, name) {
    switch (name.toLowerCase()) {
      case "users":
        return sum(values);
      default:
        return weightedAverage(values);
    }
  }

  static transformToPercentValues(rows = []) {
    return rows.map((row) => {
      const rootIndex = row.values.findIndex(e => e.root);
      const rootValue = row.values[rootIndex]?.value;
      return {
        ...row,
        values: row.values.map((value, i) => {
          if (rootIndex <= i){
            return {...value, value: this.formatValue(value.value / rootValue * 100)}
          }
          return value;
        }),
        nodes: row.nodes.map((node, i) => {
          const rootIndex = node.values.findIndex(e => e.root);
          const rootValue = node.values[rootIndex]?.value;
          return {
            ...node,
            values: node.values.map((value, i) => {
              if (rootIndex <= i){
                return {...value, value: this.formatValue(value.value / rootValue * 100)}
              }
              return value;
            })
          };
        })
      };
    });
  }

  static formatValue(v) {
    return Number(v).toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });
  }
}
