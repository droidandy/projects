import React, { createElement } from 'react';
import PropTypes from 'prop-types';
import CN from 'classnames';
import * as Icons from './IconLib';

export default function Icon({ icon, className, color, svgProps, width, height,  ...rest }) {
  if (typeof Icons[icon] !== 'function') {
    console.error(`Requested unknown icon '${icon}'`);
    return <div />;
  }

  return (
    <div className={ CN('inline-block lh-0', className) } { ...rest }>
      { createElement(Icons[icon], { 'data-svg-props': svgProps, color, width, height }) }
    </div>
  );
}

Icon.propTypes = {
  icon: PropTypes.string.isRequired,
  className: PropTypes.string,
  color: PropTypes.string,
  svgProps: PropTypes.object,
  width: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  height: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
};
