import { createElement } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import lib from './lib';

const Icon = ({
  name, size, width, height, color, ...rest
}) => {
  if (!name) {
    return null;
  }

  const svg = get(lib, name);

  if (!svg) {
    // eslint-disable-next-line no-console
    console.error(`Requested unknown icon '${name}'`);
    return null;
  }

  const svgWidth = size || width;
  const svgHeight = size || height;

  return createElement(svg, {
    ...rest,
    color,
    width: svgWidth,
    height: svgHeight
  });
};

Icon.defaultProps = {
  height: 22,
  width: 22
};

Icon.propTypes = {
  color: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  height: PropTypes.number,
  name: PropTypes.string.isRequired,
  size: PropTypes.number,
  width: PropTypes.number
};

export default Icon;
