import React from 'react';
import PropTypes from 'prop-types';

export const PieLabel = (props) => {
  const yLevelHeight = 10;
  const RADIAN = Math.PI / 180;
  const { midAngle, outerRadius, textAnchor, cx, cy, percent, payload: { name, value, yLevel = 0 }, unit } = props;

  const cos = Math.cos(-RADIAN * midAngle);
  const sin = Math.sin(-RADIAN * midAngle);
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + yLevel * yLevelHeight + (outerRadius + 30) * sin;
  const percentage = (percent * 100).toFixed(2);

  const indicator = () => {
    switch(unit) {
      case 'percentage': return `${percentage}%`;
      case 'valueAndPercentage': return `${value} (${percentage}%)`;
      default: return '';
    }
  };

  return (
    <text fontSize={ 10 } x={ mx } y={ my } textAnchor={ textAnchor }>
      { `${name} ${indicator()}`.trim() }
    </text>
  );
};

PieLabel.propTypes = {
  midAngle: PropTypes.number,
  outerRadius: PropTypes.number,
  textAnchor: PropTypes.string,
  cx: PropTypes.number,
  cy: PropTypes.number,
  percent: PropTypes.number,
  payload: PropTypes.object,
  unit: PropTypes.oneOfType([PropTypes.string, PropTypes.bool])
};

// eslint-disable-next-line react/no-multi-comp
export const AxisLabel = (props) => {
  const { axisType, x, y, height, stroke, children } = props;
  const isVert = axisType === 'yAxis';
  const cx = isVert ? x + 5 : x;
  const cy = isVert ? (height / 2) + y : y + height + 10;
  const rot = isVert ? `270 ${cx} ${cy}` : 0;
  return (
    <text x={ cx } y={ cy } transform={ `rotate(${rot})` } textAnchor="middle" stroke={ stroke }>
      { children }
    </text>
  );
};

AxisLabel.propTypes = {
  axisType: PropTypes.string,
  x: PropTypes.number,
  y: PropTypes.number,
  height: PropTypes.number,
  stroke: PropTypes.string,
  children: PropTypes.node
};
