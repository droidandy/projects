const colorScale = [
  'rgb(85,132,225)',
  'rgb(0,160,255)',
  'rgb(0,196,107)',
  'rgb(114,223,0)',
  'rgb(255,221,15)',
  'rgb(255,104,132)',
  'rgb(188,113,255)',
  'rgb(155,201,109)',
  'rgb(255,132,28)',
  'rgb(255,183,13)',
  '#7455E1',
  '#556CE1',
  '#02C2D0',
  'rgb(195,203,208)'
];

const barStyles = {
  xAxis: {
    axis: { stroke: 'rgb(187, 187, 191)', strokeWidth: 0.5 },
    axisLabel: { fontSize: 12, fill: 'rgb(142, 142, 147)' }
  },
  yAxis: {
    axis: { stroke: 'transparent' },
    grid: { stroke: 'rgba(187, 187, 191, 0.4)', strokeWidth: 0.5 },
    tickLabels: { fontSize: 12, fill: 'rgb(142, 142, 147)' }
  }
};

const pieStyles = {
  labels: { fill: 'transparent', stroke: 'none' }
};

export default {
  colorScale,
  barStyles,
  pieStyles
};
